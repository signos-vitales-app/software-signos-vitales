import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiSearch, FiUserPlus, FiUsers, FiSettings, FiLogOut, FiUser } from 'react-icons/fi';
import { getUserInfo } from '../services/authService';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
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

    const isActive = (path) => location.pathname === path;

    return (
        <div className={`fixed left-0 h-full bg-white text-gray-700 shadow-lg transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'}`}>
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="absolute right-0 top-4 transform translate-x-full bg-white p-2 rounded-r-md shadow-md"
            >
                {isOpen ? '◀' : '▶'}
            </button>

            <div className="flex flex-col h-full p-4">
                {/* Perfil de usuario */}
                <div className="flex flex-col items-center mb-8 mt-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-blue-500 mb-2">
                        {userInfo?.profile_image ? (
                            <img 
                                src={getProfileImageUrl(userInfo.profile_image)}
                                alt="Profile"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'default-avatar.png';
                                }}
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <FiUser size={40} className="text-gray-500" />
                            </div>
                        )}
                    </div>
                    {isOpen && userInfo && (
                        <div className="text-center">
                            <h3 className="font-bold text-gray-900">{userInfo.username}</h3>
                            <p className="text-sm text-gray-500">{userInfo.role}</p>
                        </div>
                    )}
                </div>

                {/* Navegación del sidebar */}
                <div className="flex-grow">
                    <nav className="space-y-4">
                        <button 
                            onClick={() => navigate('/dashboard')}
                            className={`flex items-center w-full p-2 rounded ${isActive('/dashboard') ? 'bg-blue-500 text-white' : 'hover:bg-blue-100 text-gray-700'}`}
                        >
                            <FiHome size={20} className={`${isActive('/dashboard') ? 'text-white' : 'text-blue-500'}`} />
                            {isOpen && <span className="ml-3">Inicio</span>}
                        </button>

                        <button 
                            onClick={() => navigate('/search-patient')}
                            className={`flex items-center w-full p-2 rounded ${isActive('/search-patient') ? 'bg-blue-500 text-white' : 'hover:bg-blue-100 text-gray-700'}`}
                        >
                            <FiSearch size={20} className={`${isActive('/search-patient') ? 'text-white' : 'text-blue-500'}`} />
                            {isOpen && <span className="ml-3">Buscar Paciente</span>}
                        </button>

                        <button 
                            onClick={() => navigate('/register-patient')}
                            className={`flex items-center w-full p-2 rounded ${isActive('/register-patient') ? 'bg-blue-500 text-white' : 'hover:bg-blue-100 text-gray-700'}`}
                        >
                            <FiUserPlus size={20} className={`${isActive('/register-patient') ? 'text-white' : 'text-blue-500'}`} />
                            {isOpen && <span className="ml-3">Registrar Paciente</span>}
                        </button>

                        {role === 'jefe' && (
                            <button 
                                onClick={() => navigate('/admin-panel')}
                                className={`flex items-center w-full p-2 rounded ${isActive('/admin-panel') ? 'bg-blue-500 text-white' : 'hover:bg-blue-100 text-gray-700'}`}
                            >
                                <FiUsers size={20} className={`${isActive('/admin-panel') ? 'text-white' : 'text-blue-500'}`} />
                                {isOpen && <span className="ml-3">Panel de administrador</span>}
                            </button>
                        )}
                    </nav>
                </div>

                {/* Footer del sidebar */}
                <div className="pt-4 border-t border-gray-300">
                    <button 
                        onClick={() => navigate('/settings')}
                        className={`flex items-center w-full p-2 rounded ${isActive('/settings') ? 'bg-blue-500 text-white' : 'hover:bg-blue-100 text-gray-700'}`}
                    >
                        <FiSettings size={20} className={`${isActive('/settings') ? 'text-white' : 'text-blue-500'}`} />
                        {isOpen && <span className="ml-3">Configuración</span>}
                    </button>
                    
                    <button 
                        onClick={handleLogout}
                        className="flex items-center w-full p-2 hover:bg-red-100 rounded text-red-500"
                    >
                        <FiLogOut size={20} className="text-red-500" />
                        {isOpen && <span className="ml-3">Cerrar Sesión</span>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
