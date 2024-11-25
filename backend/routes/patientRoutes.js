const express = require('express');
const { getPatients, registerPatient, updatePatientStatus, getPatientInfo, updatePatient } = require('../controllers/patientController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', getPatients); // Obtener todos los pacientes
router.post('/', authMiddleware,registerPatient); // Registrar un nuevo paciente
router.patch('/:id', updatePatientStatus); // Actualizar el estado del paciente
router.get('/:id', getPatientInfo); // Obtener información de un paciente
router.put('/:id', updatePatient); // Actualizar datos de un paciente

module.exports = router;
