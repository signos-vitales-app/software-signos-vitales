const db = require('../config/db'); //requiere la base de datos
const fs = require('fs');
const path = require('path');
const offlineDataPath = path.join(__dirname, 'offline_data.json'); // Archivo local para datos no subidos

exports.createPatientRecord = async (req, res) => {
    const {
        patient_id, record_date, record_time, systolic_pressure, diastolic_pressure, mean_arterial_pressure,
        pulse, temperature, respiratory_rate, oxygen_saturation, adult_weight, pediatric_weight, height, observations
    } = req.body;

    // Verifica si los valores de entradas son reales, es decir que verifica si ese dato es posible o no, ya que pueden haber errores en el ingreso de la informaicon 
    if (height > 250) {
        return res.status(400).json({ message: "La altura excede el valor máximo realista" });
    }
    if (pulse > 200 || pulse < 55) {
        return res.status(400).json({ message: "Valor de pulso fuera de rango" });
    }
    if (respiratory_rate > 70 || respiratory_rate < 10) {
        return res.status(400).json({ message: "Frecuencia respiratoria demasiado alta o baja" });
    }
    if (oxygen_saturation > 100) {
        return res.status(400).json({ message: "La saturación de oxígeno no puede superar el 100%" });
    }
    if (systolic_pressure > 190 || systolic_pressure < 50) {
        return res.status(400).json({ message: "La presion arterial sistolica es demasiado alta o baja" });
    }
    if (diastolic_pressure > 130 || diastolic_pressure < 40) {
        return res.status(400).json({ message: "La presion arterial diastolica demasiado alta o baja" });
    }
    if (temperature > 55 || temperature < 15) {
        return res.status(400).json({ message: "La temperatura demasiado alta o baja" });
    }
    try {
        // Insertar el nuevo registro en la base de datos del paciente
        await db.query(
            "INSERT INTO patient_records (patient_id, record_date, record_time, systolic_pressure, diastolic_pressure, mean_arterial_pressure, pulse, temperature, respiratory_rate, oxygen_saturation, adult_weight, pediatric_weight, height, observations) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [patient_id, record_date, record_time, systolic_pressure, diastolic_pressure, mean_arterial_pressure, pulse, temperature, respiratory_rate, oxygen_saturation, adult_weight, pediatric_weight, height, observations]
        );

        res.status(201).json({ message: "Registro del paciente creado exitosamente y temperatura actualizada" });
    } catch (error) {
        console.error("Error al crear el registro del paciente:", error);
        // Guardar los datos localmente si falla la conexión a la base de datos
        const offlineRecord = {
            patient_id, record_date, record_time, systolic_pressure, diastolic_pressure, mean_arterial_pressure,
            pulse, temperature, respiratory_rate, oxygen_saturation, adult_weight, pediatric_weight, height, observations
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
                    "INSERT INTO patient_records (patient_id, record_date, record_time, systolic_pressure, diastolic_pressure, mean_arterial_pressure, pulse, temperature, respiratory_rate, oxygen_saturation, adult_weight, pediatric_weight, height, observations) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [
                        record.patient_id, record.record_date, record.record_time, record.systolic_pressure, record.diastolic_pressure,
                        record.mean_arterial_pressure, record.pulse, record.temperature, record.respiratory_rate, record.oxygen_saturation,
                        record.adult_weight, record.pediatric_weight, record.height, record.observations
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
    const { patientId } = req.params;

    try {
        // Obtener información del paciente
        const [patient] = await db.query("SELECT * FROM patients WHERE id = ?", [patientId]);

        // Obtener registros del paciente
        const [records] = await db.query("SELECT * FROM patient_records WHERE patient_id = ?", [patientId]);

        res.json({ patient: patient[0], records });
    } catch (error) {
        console.error("Error al recuperar el registro del paciente:", error);
        res.status(500).json({ message: "Error al recuperar el registro del pacientes" });
    }
};
