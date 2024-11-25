import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiSearch, FiUserPlus, FiUsers } from 'react-icons/fi';
import { getUserInfo } from '../services/authService';
import axios from 'axios';

const Sidebar = () => {
    const DEFAULT_AVATAR = '/uploads/profile-images/default-avatar.png'; // Imagen predeterminada
    const [isOpen, setIsOpen] = useState(true);
    const [userInfo, setUserInfo] = useState(null);
    const [profileImage, setProfileImage] = useState(DEFAULT_AVATAR);
    const navigate = useNavigate();
    const location = useLocation();
    const role = localStorage.getItem('role');

    // Cargar información del usuario
    const loadUserInfo = async () => {
        try {
            const response = await getUserInfo();
            setUserInfo(response.data);
            localStorage.setItem('is_active', response.data.is_active); // Guardar estado en localStorage
        } catch (error) {
            console.error('Error loading user info:', error);
        }
    };

    // Llamada inicial para cargar datos del usuario
    useEffect(() => {
        loadUserInfo();
    }, []);

    // Obtener la imagen de perfil
    useEffect(() => {
        const fetchProfileImage = async () => {
            try {
                const token = localStorage.getItem('token'); // Si usas JWT
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/get-profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setProfileImage(response.data.profileImage || DEFAULT_AVATAR);
            } catch (error) {
                console.error('Error al obtener la imagen de perfil:', error);
                setProfileImage(DEFAULT_AVATAR); // Imagen predeterminada si hay error
            }
        };

        fetchProfileImage();
    }, []);

    // Función para manejar el error de carga de la imagen
    const handleImageError = () => {
        setProfileImage(DEFAULT_AVATAR);
    };

    // Verificar si la ruta actual es la activa
    const isActive = (path) => location.pathname === path;

    // Mapeo del rol del usuario a un nombre más amigable
    const getRoleDescription = (role) => {
        const roleDescriptions = {
            user: 'Enfermero/a',
            staff: 'Médico/a',
            jefe: 'Jefe de Enfermería',
        };
        return roleDescriptions[role] || 'Rol desconocido';
    };

    return (
        <div
            className={`fixed left-0 h-full bg-white text-gray-700 shadow-lg transition-all duration-300 ${
                isOpen ? 'w-65' : 'w-20'
            }`}
            style={{ marginTop: '60px' }}
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="absolute right-0 top-4 transform translate-x-full bg-white p-2 rounded-r-md shadow-md"
            >
                {isOpen ? '◀' : '▶'}
            </button>
    
            <div className="flex flex-col h-full p-4">
                <div
                    className={`flex flex-col items-center mb-8 mt-4 transition-opacity duration-300 ${
                        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                >
                    <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-blue-500 mb-2">
                        <img
                            src={profileImage}
                            alt="Profile"
                            className="w-full h-full object-cover"
                            onError={handleImageError} // Cambia a la imagen predeterminada si hay error
                        />
                    </div>
    
                    {isOpen && userInfo && (
                        <div className="text-center">
                            <h3 className="font-bold text-xl text-gray-900">{userInfo.username}</h3>
                            <p className="text-sm text-gray-500">
                                {getRoleDescription(userInfo.role)}
                            </p>
                            <button className="mt-2 px-3 py-1 rounded-full bg-green-500 text-white text-xs font-semibold">
                                Activo
                            </button>
                        </div>
                    )}
                </div>
    
                <div className="flex-grow">
                    <nav className="space-y-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className={`flex items-center w-full p-2 rounded ${
                                isActive('/dashboard')
                                    ? 'bg-blue-500 text-white'
                                    : 'hover:bg-blue-100 text-gray-700'
                            }`}
                        >
                            <FiHome
                                size={20}
                                className={`${
                                    isActive('/dashboard')
                                        ? 'text-white'
                                        : 'text-blue-500'
                                }`}
                            />
                            {isOpen && <span className="ml-3">Inicio</span>}
                        </button>
    
                        <button
                            onClick={() => navigate('/search-patient')}
                            className={`flex items-center w-full p-2 rounded ${
                                isActive('/search-patient')
                                    ? 'bg-blue-500 text-white'
                                    : 'hover:bg-blue-100 text-gray-700'
                            }`}
                        >
                            <FiSearch
                                size={20}
                                className={`${
                                    isActive('/search-patient')
                                        ? 'text-white'
                                        : 'text-blue-500'
                                }`}
                            />
                            {isOpen && <span className="ml-3">Buscar Paciente</span>}
                        </button>
    
                        <button
                            onClick={() => navigate('/register-patient')}
                            className={`flex items-center w-full p-2 rounded ${
                                isActive('/register-patient')
                                    ? 'bg-blue-500 text-white'
                                    : 'hover:bg-blue-100 text-gray-700'
                            }`}
                        >
                            <FiUserPlus
                                size={20}
                                className={`${
                                    isActive('/register-patient')
                                        ? 'text-white'
                                        : 'text-blue-500'
                                }`}
                            />
                            {isOpen && <span className="ml-3">Registrar Paciente</span>}
                        </button>
    
                        {role === 'jefe' && (
                            <button
                                onClick={() => navigate('/admin-panel')}
                                className={`flex items-center w-full p-2 rounded ${
                                    isActive('/admin-panel')
                                        ? 'bg-blue-500 text-white'
                                        : 'hover:bg-blue-100 text-gray-700'
                                }`}
                            >
                                <FiUsers
                                    size={20}
                                    className={`${
                                        isActive('/admin-panel')
                                            ? 'text-white'
                                            : 'text-blue-500'
                                    }`}
                                />
                                {isOpen && <span className="ml-3">Panel administrador</span>}
                            </button>
                        )}
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;