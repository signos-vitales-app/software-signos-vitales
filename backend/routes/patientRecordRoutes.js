const express = require('express');
const { getPatientRecords, createPatientRecord,getPatientHistory,getPatientRecord,updatePatientRecord, getPatientHistoryRecords } = require('../controllers/patientRecordController');
const router = express.Router();
const  authMiddleware = require('../middlewares/authMiddleware');

// Coloca las rutas más específicas antes de las generales
router.get('/patient-record/:idRegistro', getPatientRecord); // Obtener un registro específico
router.put('/patient-record/:idRegistro',authMiddleware, updatePatientRecord); // Actualizar un registro
router.get('/:idPaciente',getPatientRecords); // Ruta para obtener registros de un paciente específico
router.get('/history/:idPaciente', getPatientHistory); // Obtener historial completo
router.post('/', authMiddleware,createPatientRecord); // Ruta para crear un registro de paciente
// Rutas de historial de signos vitales
router.get('/patient-history/:idPaciente',getPatientHistoryRecords);

module.exports = router;
