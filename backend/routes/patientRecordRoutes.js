const express = require('express');
const { getPatientRecords, createPatientRecord } = require('../controllers/patientRecordController');
const router = express.Router();

router.post('/', createPatientRecord); // Ruta para crear un registro de paciente
router.get('/:patientId',getPatientRecords); // Ruta para obtener registros de un paciente específico

module.exports = router;
