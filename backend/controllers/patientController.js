const db = require('../config/db'); // Requiere la base de datos

// Función para calcular el grupo de edad basado en la fecha de nacimiento
function calculateAgeGroup(fechaNacimiento) {
    const birth = new Date(fechaNacimiento);
    const today = new Date();

    const ageInMonths =
        (today.getFullYear() - birth.getFullYear()) * 12 +
        (today.getMonth() - birth.getMonth()) -
        (today.getDate() < birth.getDate() ? 1 : 0); // Ajuste si no ha pasado el día del mes

    if (ageInMonths >= 0 && ageInMonths <= 3) return 'Recién nacido';
    if (ageInMonths > 3 && ageInMonths <= 6) return 'Lactante temprano';
    if (ageInMonths > 6 && ageInMonths <= 12) return 'Lactante mayor';
    if (ageInMonths > 12 && ageInMonths <= 36) return 'Niño pequeño';
    if (ageInMonths > 36 && ageInMonths <= 72) return 'Preescolar temprano';
    if (ageInMonths > 72 && ageInMonths <= 168) return 'Preescolar tardío';
    return 'Adulto';
}
'Recién nacido','Lactante temprano','Lactante mayor','Niño pequeño','Preescolar temprano','Preescolar tardío','Adulto'// Obtener todos los pacientes
exports.getPatients = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM patients");
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener pacientes:", error);
        res.status(500).json({ message: "Error al obtener pacientes" });
    }
};

// Registrar un nuevo paciente
exports.registerPatient = async (req, res) => {
    const { primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, numero_identificacion, fecha_nacimiento, tipo_identificacion, ubicacion, status } = req.body;

    // Calcular el grupo de edad
    const age_group = calculateAgeGroup(fecha_nacimiento);

    try {
        await db.query(
            "INSERT INTO patients (primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, numero_identificacion, fecha_nacimiento, tipo_identificacion, ubicacion, status, age_group) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, numero_identificacion, fecha_nacimiento, tipo_identificacion, ubicacion, status || 'activo', age_group]
        );
        res.status(201).json({ message: "Paciente registrado exitosamente" });
    } catch (error) {
        console.error("Error al registrar paciente:", error);
        res.status(500).json({ message: "Error al registrar paciente" });
    }
};

// Actualizar información de un paciente
exports.updatePatient = async (req, res) => {
    const { id } = req.params;
    const { primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, numero_identificacion, tipo_identificacion, ubicacion, status, fecha_nacimiento } = req.body;

    // Calcular el grupo de edad
    const age_group = calculateAgeGroup(fecha_nacimiento);

    try {
        const [result] = await db.query(
            "UPDATE patients SET primer_nombre = ?, segundo_nombre = ?, primer_apellido = ?, segundo_apellido = ?, numero_identificacion = ?, tipo_identificacion = ?, ubicacion = ?, status = ?, fecha_nacimiento = ?, age_group = ? WHERE id = ?",
            [primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, numero_identificacion, tipo_identificacion, ubicacion, status, fecha_nacimiento, age_group, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Paciente no encontrado" });
        }

        res.json({ message: "Paciente actualizado exitosamente" });
    } catch (error) {
        console.error("Error al actualizar paciente:", error);
        res.status(500).json({ message: "Error al actualizar paciente" });
    }
};

// Actualizar estado de un paciente
exports.updatePatientStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        await db.query("UPDATE patients SET status = ? WHERE id = ?", [status, id]);
        res.json({ message: "Estado del paciente actualizado exitosamente" });
    } catch (error) {
        console.error("Error al actualizar el estado del paciente:", error);
        res.status(500).json({ message: "Error al actualizar el estado del paciente" });
    }
};

// Obtener información de un paciente específico
exports.getPatientInfo = async (req, res) => {
    const { id } = req.params;

    try {
        const [patient] = await db.query("SELECT * FROM patients WHERE id = ?", [id]);
        if (patient.length === 0) {
            return res.status(404).json({ message: "Paciente no encontrado" });
        }
        res.json(patient[0]);
    } catch (error) {
        console.error("Error al recuperar la información del paciente:", error);
        res.status(500).json({ message: "Error al recuperar la información del paciente" });
    }
};
