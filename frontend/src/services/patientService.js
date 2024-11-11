import axios from 'axios';

const API_URL = "http://localhost:5000/api";

export const registerPatient = async (patientData) => {
    return await axios.post(`${API_URL}/patients`, patientData);
};

export const fetchPatients = async () => {
    return await axios.get(`${API_URL}/patients`);
};

export const fetchPatientInfo = async (patientId) => {
    return await axios.get(`${API_URL}/patients/${patientId}`);
};

export const updatePatientStatus = async (patientId, status) => {
    return await axios.patch(`${API_URL}/patients/${patientId}`, { status });
};

// Función para crear un registro de historial médico
export const createPatientRecord = async (recordData) => {
    return await axios.post(`${API_URL}/patient-records`, recordData);
};

// Función para obtener el historial de un paciente específico
export const fetchPatientRecords = async (patientId) => {
    return await axios.get(`${API_URL}/patient-records/${patientId}`);
};