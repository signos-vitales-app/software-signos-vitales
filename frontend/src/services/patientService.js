import axios from 'axios';

// Modificar la URL base para que use variables de entorno
const API_URL = "http://localhost:5000/api";

export const registerPatient = async (patientData) => {
    return await axios.post(`${API_URL}/patients`, patientData);
};

export const fetchPatients = async () => {
    return await axios.get(`${API_URL}/patients`);
};

export const fetchPatientInfo = async (idPaciente) => {
    return await axios.get(`${API_URL}/patients/${idPaciente}`);
};

export const updatePatientStatus = async (idPaciente, status) => {
    return await axios.patch(`${API_URL}/patients/${idPaciente}`, { status });
};

// Función para crear un registro de historial médico
export const createPatientRecord = async (recordData) => {
    return await axios.post(`${API_URL}/patient-records`, recordData);
};

// Función para obtener el historial de un paciente específico
export const fetchPatientRecords = async (idPaciente) => {
    return await axios.get(`${API_URL}/patient-records/${idPaciente}`);
};
// Función para editar paciente
export const updatePatient = async (idPaciente, updatedData) => {
    return await axios.put(`${API_URL}/patients/${idPaciente}`, updatedData);
};
