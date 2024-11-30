const express = require('express');
const { getPatientRecords, createPatientRecord,getPatientHistory,updatePatientRecord } = require('../controllers/patientRecordController');
const router = express.Router();
const  authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware,createPatientRecord); // Ruta para crear un registro de paciente
router.get('/:idPaciente',getPatientRecords); // Ruta para obtener registros de un paciente específico
router.get('/history/:idPaciente', getPatientHistory); // Nueva ruta
router.put('/:recordId' ,authMiddleware,updatePatientRecord); // Asegúrate de que `recordId` sea el ID del registro

module.exports = router;
