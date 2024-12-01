const db = require('../config/db'); //requiere la base de datos
const fs = require('fs');
const path = require('path');
const offlineDataPath = path.join(__dirname, 'offline_data.json'); // Archivo local para datos no subidos

// Crear un registro de signos vitales
exports.createPatientRecord = async (req, res) => {
    const {
        id_paciente, record_date, record_time, presion_sistolica, presion_diastolica, presion_media,
        pulso, temperatura, frecuencia_respiratoria, saturacion_oxigeno, peso_adulto, peso_pediatrico, talla, observaciones
    } = req.body;

    const responsable_signos = req.user?.username; // Asegúrate de que el middleware authMiddleware adjunte el usuario a req.user

    if (!responsable_signos) {
        return res.status(401).json({ message: "Usuario no autorizado para realizar esta acción" });
    }
    // Verifica si los valores de entradas son reales, es decir que verifica si ese dato es posible o no, ya que pueden haber errores en el ingreso de la informaicon 
    if (talla > 250) {
        return res.status(400).json({ message: "La altura excede el valor máximo realista" });
    }
    if (pulso > 200 || pulso < 40) {
        return res.status(400).json({ message: "Valor de pulso fuera de rango" });
    }
    if (frecuencia_respiratoria > 70 || frecuencia_respiratoria < 10) {
        return res.status(400).json({ message: "Frecuencia respiratoria demasiado alta o baja" });
    }
    if (saturacion_oxigeno > 100 || saturacion_oxigeno < 50) {
        return res.status(400).json({ message: "La saturación de oxígeno no puede superar el 100% o ser menor de 50%" });
    }
    if (presion_sistolica > 190 || presion_sistolica < 50) {
        return res.status(400).json({ message: "La presion arterial sistolica es demasiado alta o baja" });
    }
    if (presion_diastolica > 130 || presion_diastolica < 40) {
        return res.status(400).json({ message: "La presion arterial diastolica demasiado alta o baja" });
    }
    if (temperatura > 55 || temperatura < 15) {
        return res.status(400).json({ message: "La temperatura demasiado alta o baja" });
    }
    try {
        // Insertar el nuevo registro en la base de datos del paciente
        await db.query(
            "INSERT INTO registros_paciente (id_paciente, record_date, record_time, presion_sistolica, presion_diastolica, presion_media, pulso, temperatura, frecuencia_respiratoria, saturacion_oxigeno, peso_adulto, peso_pediatrico, talla, observaciones, responsable_signos) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [id_paciente, record_date, record_time, presion_sistolica, presion_diastolica, presion_media, pulso, temperatura, frecuencia_respiratoria, saturacion_oxigeno, peso_adulto, peso_pediatrico, talla, observaciones, responsable_signos]
        );

        res.status(201).json({ message: "Registro del paciente creado exitosamente" });
    } catch (error) {
        console.error("Error al crear el registro del paciente:", error);
        // Guardar los datos localmente si falla la conexión a la base de datos
        const offlineRecord = {
            id_paciente, record_date, record_time, presion_sistolica, presion_diastolica, presion_media,
            pulso, temperatura, frecuencia_respiratoria, saturacion_oxigeno, peso_adulto, peso_pediatrico, talla, observaciones, responsable_signos
        };

        saveOfflineRecord(offlineRecord);
        res.status(500).json({ message: "Error al crear el registro del paciente", error: error.message });
    }
};

// Función para guardar los datos localmente en un archivo
function saveOfflineRecord(record) {
    let offlineData = [];
    if (fs.existsSync(offlineDataPath)) {
        const fileData = fs.readFileSync(offlineDataPath);
        offlineData = JSON.parse(fileData);
    }
    offlineData.push(record);
    fs.writeFileSync(offlineDataPath, JSON.stringify(offlineData, null, 2));
}

function syncOfflineData() {
    if (fs.existsSync(offlineDataPath)) {
        const offlineData = JSON.parse(fs.readFileSync(offlineDataPath));

        offlineData.forEach(async (record, index) => {
            try {
                await db.query(
                    "INSERT INTO registros_paciente (id_paciente, record_date, record_time, presion_sistolica, presion_diastolica, presion_media, pulso, temperatura, frecuencia_respiratoria, saturacion_oxigeno, peso_adulto, peso_pediatrico, talla, observaciones) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [
                        record.id_paciente, record.record_date, record.record_time, record.presion_sistolica, record.presion_diastolica,
                        record.presion_media, record.pulso, record.temperatura, record.frecuencia_respiratoria, record.saturacion_oxigeno,
                        record.peso_adulto, record.peso_pediatrico, record.talla, record.observaciones
                    ]
                );

                // Si se sube correctamente, remover el registro del archivo
                offlineData.splice(index, 1);
                fs.writeFileSync(offlineDataPath, JSON.stringify(offlineData, null, 2));

            } catch (error) {
                console.error("Error al sincronizar datos offline:", error);
            }
        });
    }
}

// Ejecutar la sincronización periódicamente (cada 5 minutos, por ejemplo)
setInterval(syncOfflineData, 5 * 60 * 1000);


exports.getPatientRecords = async (req, res) => {
    const { idPaciente } = req.params;

    try {
        // Obtener información del paciente
        const [patient] = await db.query("SELECT * FROM patients WHERE id = ?", [idPaciente]);

        // Obtener registros del paciente
        const [records] = await db.query("SELECT * FROM registros_paciente WHERE id_paciente = ?", [idPaciente]);

        res.json({ patient: patient[0], records });
    } catch (error) {
        console.error("Error al recuperar el registro del paciente:", error);
        res.status(500).json({ message: "Error al recuperar el registro del pacientes" });
    }
};

exports.getPatientHistory = async (req, res) => {
    const { idPaciente } = req.params; // Asegúrate de que el idPaciente llega desde los parámetros de la URL
    try {
        const [rows] = await db.query(
            `SELECT * FROM historial_paciente WHERE id_paciente = ? ORDER BY created_at DESC`,
            [idPaciente]
        );
        console.log("ID del Paciente:", idPaciente);

        if (rows.length === 0) {
            return res.status(404).json({ message: "No se encontraron registros para este paciente" });
        }

        res.json(rows); // Devuelve los registros encontrados
    } catch (error) {
        console.error("Error al obtener el historial del paciente:", error);
        res.status(500).json({ message: "Error al obtener el historial del paciente" });
    }
};

// Obtener un registro específico de signos vitales
exports.getPatientRecord = async (req, res) => {
    const { idRegistro } = req.params;
    console.log("ID recibido en el backend:", idRegistro); // Log para depuración
    try {
        const [record] = await db.query("SELECT * FROM registros_paciente WHERE id = ?", [idRegistro]);

        if (!record.length) {
            console.log("Registro no encontrado.");
            return res.status(404).json({ message: "Registro no encontrado." });
        }

        res.json(record[0]);
    } catch (error) {
        console.error("Error al obtener el registro:", error);
        res.status(500).json({ message: "Error al obtener el registro." });
    }
};


// Actualizar un registro de signos vitales
exports.updatePatientRecord = async (req, res) => {
    const { idRegistro } = req.params;
    const updatedData = req.body;

    // Si `created_at` está presente, conviértelo al formato MySQL
    if (updatedData.created_at) {
        updatedData.created_at = formatDateForMySQL(updatedData.created_at);
    }

    const responsable_signos = req.user?.username; // Asegúrate de que el middleware authMiddleware adjunte el usuario a req.user

    if (!responsable_signos) {
        return res.status(401).json({ message: "Usuario no autorizado para realizar esta acción" });
    }
    updatedData.responsable_signos = responsable_signos;

    // Validaciones
    if (updatedData.talla && updatedData.talla > 250) {
        return res.status(400).json({ message: "La altura excede el valor máximo realista" });
    }
    if (updatedData.pulso && (updatedData.pulso > 200 || updatedData.pulso < 40)) {
        return res.status(400).json({ message: "Valor de pulso fuera de rango" });
    }
    if (updatedData.frecuencia_respiratoria && (updatedData.frecuencia_respiratoria > 70 || updatedData.frecuencia_respiratoria < 10)) {
        return res.status(400).json({ message: "Frecuencia respiratoria demasiado alta o baja" });
    }
    if (updatedData.saturacion_oxigeno && (updatedData.saturacion_oxigeno > 100 || updatedData.saturacion_oxigeno < 50)) {
        return res.status(400).json({ message: "La saturación de oxígeno no puede superar el 100% o ser menor de 50%" });
    }
    if (updatedData.presion_sistolica && (updatedData.presion_sistolica > 190 || updatedData.presion_sistolica < 50)) {
        return res.status(400).json({ message: "La presión arterial sistólica es demasiado alta o baja" });
    }
    if (updatedData.presion_diastolica && (updatedData.presion_diastolica > 130 || updatedData.presion_diastolica < 40)) {
        return res.status(400).json({ message: "La presión arterial diastólica es demasiado alta o baja" });
    }
    if (updatedData.temperatura && (updatedData.temperatura > 55 || updatedData.temperatura < 15)) {
        return res.status(400).json({ message: "La temperatura es demasiado alta o baja" });
    }
    updatedData.created_at = formatDateForMySQL(updatedData.created_at);

    try {
         // Guardar los valores actuales en historial antes de la actualización
    const [currentRecord] = await db.query("SELECT * FROM registros_paciente WHERE id = ?", [idRegistro]);

    const historial = {
        id_paciente: currentRecord[0].id_paciente,
        id_registro: currentRecord[0].id,
        record_date: currentRecord[0].record_date,
        record_time: currentRecord[0].record_time,
        presion_sistolica: currentRecord[0].presion_sistolica,
        presion_diastolica: currentRecord[0].presion_diastolica,
        presion_media: currentRecord[0].presion_media,
        pulso: currentRecord[0].pulso,
        temperatura: currentRecord[0].temperatura,
        frecuencia_respiratoria: currentRecord[0].frecuencia_respiratoria,
        saturacion_oxigeno: currentRecord[0].saturacion_oxigeno,
        peso_adulto: currentRecord[0].peso_adulto,
        peso_pediatrico: currentRecord[0].peso_pediatrico,
        talla: currentRecord[0].talla,
        observaciones: currentRecord[0].observaciones,
        responsable_signos: currentRecord[0].responsable_signos,
    };

    // Insertar el historial antes de actualizar
    await db.query("INSERT INTO historial_signos_pacientes SET ?", [historial]);

        await db.query("UPDATE registros_paciente SET ? WHERE id = ?", [updatedData, idRegistro]);
        res.json({ message: "Registro actualizado correctamente." });
    } catch (error) {
        console.error("Error al actualizar el registro:", error);
        res.status(500).json({ message: "Error al actualizar el registro." });
    }
};
const formatDateForMySQL = (dateString) => {
    const date = new Date(dateString);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // Mes (0-indexado)
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const mi = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
};

// Obtener historial de signos vitales de un paciente
exports.getPatientHistoryRecords = async (req, res) => {
    const { idPaciente } = req.params; // ID del paciente desde los parámetros de la URL

    try {
        const [history] = await db.query(
            "SELECT * FROM historial_signos_pacientes WHERE id_paciente = ? ORDER BY record_date DESC, record_time DESC",
            [idPaciente]
        );

        if (!history.length) {
            return res.status(404).json({ message: "No se encontraron registros históricos." });
        }

        res.json(history);
    } catch (error) {
        console.error("Error al obtener el historial:", error);
        res.status(500).json({ message: "Error al obtener el historial." });
    }
};
