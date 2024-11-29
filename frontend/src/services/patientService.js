import axios from 'axios';

// Modificar la URL base para que use variables de entorno
const API_URL = "http://localhost:5000/api";
export const registerPatient = async (patientData, token) => {
    return await axios.post(
        `${API_URL}/patients`,
        patientData,
        {
            headers: {
                Authorization: `Bearer ${token}`, // Envía el token en el encabezado
            },
        }
    );
};
export const fetchPatients = async () => {
    return await axios.get(`${API_URL}/patients`);
};

export const fetchPatientInfo = async (idPaciente, token) => {
    return await axios.get(`${API_URL}/patients/${idPaciente}`, {
        headers: {
            Authorization: `Bearer ${token}`, // Incluir el token en el encabezado
        },
    });
};

export const updatePatientStatus = async (idPaciente, status) => {
    return await axios.patch(`${API_URL}/patients/${idPaciente}`, { status });
};

// Función para crear un registro de historial médico
export const createPatientRecord = async (recordData, token) => {
    return await axios.post(
        `${API_URL}/patient-records`, 
        recordData, 
        {
            headers: {
                Authorization: `Bearer ${token}`, // Incluye el token
            },
        }
    );
};


// Función para obtener el historial de un paciente específico
export const fetchPatientRecords = async (idPaciente) => {
    return await axios.get(`${API_URL}/patient-records/${idPaciente}`);
};

// Función para editar paciente
export const updatePatient = async (idPaciente, updatedData, token) => {
    return await axios.put(
        `${API_URL}/patients/${idPaciente}`,
        updatedData,
        {
            headers: {
                Authorization: `Bearer ${token}`, // Envía el token en el encabezado
            },
        }
    );
};

// Obtener el historial de cambios de un paciente
export const fetchPatientHistory = async (idPaciente, token) => {
    try {
        const response = await axios.get(
            `${API_URL}/patient-records/history/${idPaciente}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        console.log("Respuesta del historial del paciente:", response.data); // Verifica que los datos llegan
        return response;
    } catch (error) {
        console.error("Error al obtener el historial del paciente:", error);
        throw error;
    }
};

export const updatePatientRecord = async (recordId, updatedData, token) => {
    return await axios.put(
        `${API_URL}/patient-records/${recordId}`,
        updatedData,
        {
            headers: {
                Authorization: `Bearer ${token}`, // Envía el token en el encabezado
            },
        }
    );
};
export const fetchRecordById = async (recordId, token) => {
    return await axios.get(`${API_URL}/patient-records/${recordId}`, {
        headers: {
            Authorization: `Bearer ${token}`, // Envía el token en el encabezado si es necesario
        },
    });
};






