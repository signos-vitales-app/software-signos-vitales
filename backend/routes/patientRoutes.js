const express = require('express');
const { getPatients, registerPatient, updatePatientStatus, getPatientInfo } = require('../controllers/patientController');
const router = express.Router();

router.get('/', getPatients); // Obtener todos los pacientes
router.post('/',registerPatient); // Registrar un nuevo paciente
router.patch('/:id', updatePatientStatus); // Actualizar el estado del paciente
router.get('/:id', getPatientInfo); // Ruta para obtener la información de un paciente específico


module.exports = router;