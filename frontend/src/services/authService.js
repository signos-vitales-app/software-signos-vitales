import axios from 'axios';

const API_URL = "http://localhost:5000/api";

// Función de inicio de sesión
export const login = async (username, password) => {
    return await axios.post(`${API_URL}/auth/login`, { username, password });
};

// Función de registro de usuario
export const register = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Función para solicitar restablecimiento de contraseña
export const resetPassword = async (email) => {
    return await axios.post(`${API_URL}/auth/reset-password`, { email });
};

// Función para actualizar la contraseña usando el token
export const updatePassword = async (token, newPassword) => {
    return await axios.patch(`${API_URL}/auth/reset-password/${token}`, { newPassword });
};

// Función para obtener la lista de usuarios (usada en el panel de administración)
export const getUsers = async () => {
    return await axios.get(`${API_URL}/users`);
};

// Función para actualizar el rol de usuario (usada en el panel de administración)
export const updateUserRole = async (id, role) => {
    return await axios.patch(`${API_URL}/users/${id}`, { role });
};

// Función para habilitar/inhibir un usuario
export const toggleUserStatus = async (id, isActive) => {
    return await axios.patch(`${API_URL}/users/${id}/status`, { is_active: isActive });
};

// Función para obtener la información del usuario
export const getUserInfo = async () => {
    return await axios.get(`${API_URL}/auth/user-info`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
};
