import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiHome, FiUsers, FiUserPlus, FiSearch, FiLogOut, FiSettings, FiUser } from 'react-icons/fi';
import { getUserInfo } from '../services/authService';
import process from 'process';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate();
    const role = localStorage.getItem('role');

    useEffect(() => {
        const loadUserInfo = async () => {
            try {
                const response = await getUserInfo();
                setUserInfo(response.data);
            } catch (error) {
                console.error('Error loading user info:', error);
            }
        };
        loadUserInfo();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    const getProfileImageUrl = (imageName) => {
        if (!imageName) return null;
        return `${import.meta.env.VITE_API_URL}/uploads/profile-images/${imageName}`;
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('profileImage', file);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/upload-profile-image`, {
                method: 'POST',
                credentials: 'include',
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                setUserInfo(prevState => ({
                    ...prevState,
                    profile_image: data.profileImage
                }));
            }
        } catch (error) {
            console.error('Error al subir la imagen:', error);
        }
    };

    return (
        <div className={`fixed left-0 h-full bg-gray-800 text-white transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'}`}>
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="absolute right-0 top-4 transform translate-x-full bg-gray-800 p-2 rounded-r-md"
            >
                {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>

            <div className="flex flex-col h-full p-4">
                {/* Perfil de usuario */}
                <div className="flex flex-col items-center mb-8 mt-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white mb-2">
                        {userInfo?.profile_image ? (
                            <img 
                                src={getProfileImageUrl(userInfo.profile_image)}
                                alt="Profile"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'default-avatar.png'; // Imagen por defecto
                                }}
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                                <FiUser size={40} className="text-gray-300" />
                            </div>
                        )}
                    </div>
                    {isOpen && userInfo && (
                        <div className="text-center">
                            <h3 className="font-bold">{userInfo.username}</h3>
                            <p className="text-sm text-gray-300">{userInfo.role}</p>
                        </div>
                    )}
                </div>

                {/* Resto del contenido del sidebar */}
                <div className="flex-grow">
                    <nav className="space-y-4">
                        <button 
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center w-full p-2 hover:bg-gray-700 rounded"
                        >
                            <FiHome size={20} />
                            {isOpen && <span className="ml-3">Dashboard</span>}
                        </button>

                        <button 
                            onClick={() => navigate('/search-patient')}
                            className="flex items-center w-full p-2 hover:bg-gray-700 rounded"
                        >
                            <FiSearch size={20} />
                            {isOpen && <span className="ml-3">Buscar Paciente</span>}
                        </button>

                        <button 
                            onClick={() => navigate('/register-patient')}
                            className="flex items-center w-full p-2 hover:bg-gray-700 rounded"
                        >
                            <FiUserPlus size={20} />
                            {isOpen && <span className="ml-3">Registrar Paciente</span>}
                        </button>

                        {role === 'admin' && (
                            <button 
                                onClick={() => navigate('/admin-panel')}
                                className="flex items-center w-full p-2 hover:bg-gray-700 rounded"
                            >
                                <FiUsers size={20} />
                                {isOpen && <span className="ml-3">Panel Admin</span>}
                            </button>
                        )}
                    </nav>
                </div>

                {/* Footer del sidebar */}
                <div className="pt-4 border-t border-gray-700">
                    <button 
                        onClick={() => navigate('/settings')}
                        className="flex items-center w-full p-2 hover:bg-gray-700 rounded"
                    >
                        <FiSettings size={20} />
                        {isOpen && <span className="ml-3">Configuración</span>}
                    </button>
                    
                    <button 
                        onClick={handleLogout}
                        className="flex items-center w-full p-2 hover:bg-gray-700 rounded text-red-400"
                    >
                        <FiLogOut size={20} />
                        {isOpen && <span className="ml-3">Cerrar Sesión</span>}
                    </button>
                </div>

                <div className="profile-image-section">
                    <input 
                        type="file"
                        id="profile-image-input"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                    />
                    <label 
                        htmlFor="profile-image-input" 
                        className="upload-button"
                    >
                        {/* Actualizar foto de perfil */}
                    </label>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;