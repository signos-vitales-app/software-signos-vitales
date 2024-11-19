const db = require('../config/db'); //requiere la base de datos

exports.getPatients = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM patients");
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener pacientes:", error);
        res.status(500).json({ message: "Error al obtener pacientes" });
    }
};

exports.registerPatient = async (req, res) => {
    const { primer_nombre,segundo_nombre, primer_apellido,segundo_apellido, numero_identificacion, fecha_nacimiento, tipo_identificacion, ubicacion, status } = req.body;

    // Calcular si el paciente es pediátrico en base a la fecha de nacimiento
    const birth = new Date(fecha_nacimiento);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    const is_pediatric = age < 10;

    try {
        await db.query(
            "INSERT INTO patients (primer_nombre,segundo_nombre, primer_apellido,segundo_apellido, numero_identificacion, fecha_nacimiento, tipo_identificacion, ubicacion, status, is_pediatric) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?,?)",
            [primer_nombre,segundo_nombre, primer_apellido,segundo_apellido, numero_identificacion, fecha_nacimiento, tipo_identificacion, ubicacion, status || 'activo', is_pediatric]
        );
        res.status(201).json({ message: "Paciente registrado exitosamente" });
    } catch (error) {
        console.error("Error al registrar paciente:", error);
        res.status(500).json({ message: "Error al registrar paciente" });
    }
};


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

exports.updatePatient = async (req, res) => {
    const { id } = req.params;
    const { primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, numero_identificacion, tipo_identificacion, ubicacion, status,fecha_nacimiento } = req.body;

    try {
        const [result] = await db.query(
            "UPDATE patients SET primer_nombre = ?, segundo_nombre = ?, primer_apellido = ?, segundo_apellido = ?, numero_identificacion = ?, tipo_identificacion = ?, ubicacion = ?, status = ?, fecha_nacimiento=? WHERE id = ?",
            [primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, numero_identificacion, tipo_identificacion, ubicacion, status,fecha_nacimiento, id]
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
