    const db = require('../config/db'); //requiere la base de datos
    const fs = require('fs');
    const path = require('path');
    const offlineDataPath = path.join(__dirname, 'offline_data.json'); // Archivo local para datos no subidos

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
        if (saturacion_oxigeno > 100|| saturacion_oxigeno <50) {
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

    exports.updatePatientRecord = async (req, res) => {
        const { recordId } = req.params; // Suponiendo que estás pasando el ID del registro en la URL
        const {
            record_date, record_time, presion_sistolica, presion_diastolica, presion_media,
            pulso, temperatura, frecuencia_respiratoria, saturacion_oxigeno, peso_adulto, peso_pediatrico, talla, observaciones
        } = req.body;
    
        try {
            // Actualiza el registro en la base de datos
            await db.query(
                "UPDATE registros_paciente SET record_date = ?, record_time = ?, presion_sistolica = ?, presion_diastolica = ?, presion_media = ?, pulso = ?, temperatura = ?, frecuencia_respiratoria = ?, saturacion_oxigeno = ?, peso_adulto = ?, peso_pediatrico = ?, talla = ?, observaciones = ? WHERE id = ?",
                [record_date, record_time, presion_sistolica, presion_diastolica, presion_media, pulso, temperatura, frecuencia_respiratoria, saturacion_oxigeno, peso_adulto, peso_pediatrico, talla, observaciones, recordId]
            );
    
            res.status(200).json({ message: "Registro actualizado exitosamente" });
        } catch (error) {
            console.error("Error al actualizar el registro del paciente:", error);
            res.status(500).json({ message: "Error al actualizar el registro del paciente" });
        }
    };
    exports.getPatientRecordById = async (req, res) => {
        const { idPaciente, recordId } = req.params;
    
        try {
            // Obtener el registro específico del paciente
            const [record] = await db.query("SELECT * FROM registros_paciente WHERE id_paciente = ? AND id = ?", [idPaciente, recordId]);
    
            if (!record.length) {
                return res.status(404).json({ message: "Registro no encontrado" });
            }
    
            res.json(record[0]);
        } catch (error) {
            console.error("Error al recuperar el registro específico del paciente:", error);
            res.status(500).json({ message: "Error al recuperar el registro específico del paciente" });
        }
    };
    