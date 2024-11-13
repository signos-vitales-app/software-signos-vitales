import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers, updateUserRole, toggleUserStatus } from "../services/authService";
import { FiHome } from "react-icons/fi"; // Icono para regresar
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Iconos de visibilidad de la contraseña

const SearchUsers = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [role, setRole] = useState("user");
    const [passwordVisible, setPasswordVisible] = useState(false); // Estado para visibilidad de la contraseña

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getUsers();
                setUsers(response.data);
            } catch (error) {
                setError("Error al obtener los usuarios");
            }
        };
        fetchUsers();
    }, []);

    const handleRoleChange = async (id, newRole) => {
        try {
            await updateUserRole(id, newRole);
            setUsers(prevUsers => prevUsers.map(user => user.id === id ? { ...user, role: newRole } : user));
        } catch (error) {
            setError("Error al actualizar el rol del usuario");
        }
    };

    const handleToggleStatus = async (id, isActive) => {
        try {
            await toggleUserStatus(id, !isActive);
            setUsers(prevUsers => prevUsers.map(user => user.id === id ? { ...user, is_active: !isActive } : user));
        } catch (error) {
            setError("Error al actualizar el estado del usuario");
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible((prevState) => !prevState);
    };

    return (
        <div className="flex flex-col items-center justify-start h-screen bg-gray-100 p-4">
            <h1 className="text-3xl font-bold mb-6">Panel de administración de usuarios</h1>
            {error && <p className="text-red-500">{error}</p>}

            <div className="w-full mt-6">
                <div className="overflow-x-auto"> {/* Cambiado overflow-y-auto por overflow-x-auto */}
                    <table className="min-w-full bg-white shadow-md rounded">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="p-3 text-left">Usuario</th>
                                <th className="p-3 text-left">Email</th>
                                <th className="p-3 text-left">Rol</th>
                                <th className="p-3 text-left">Estado</th>
                                <th className="p-3 text-left">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-b">
                                    <td className="p-3">{user.username}</td>
                                    <td className="p-3">{user.email}</td>
                                    <td className="p-3">{user.role}</td>
                                    <td className="p-3">
                                        {user.is_active ? "Activo" : "Inactivo"}
                                    </td>
                                    <td className="p-3 flex space-x-2">
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                            className="p-2 border rounded"
                                        >
                                            <option value="user">Enfermero/a</option>
                                            <option value="jefe">Jefe de enfermería</option>
                                            <option value="staff">Medico/a</option>
                                        </select>
                                        <button
                                            onClick={() => handleToggleStatus(user.id, user.is_active)}
                                            className={`p-2 text-white rounded ${user.is_active ? 'bg-red-500' : 'bg-green-500'}`}
                                        >
                                            {user.is_active ? "Desactivar" : "Activar"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <button onClick={() => navigate("/admin-panel")} className="mt-6 flex items-center px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition">
                <FiHome className="mr-2" /> Regresar
            </button>
        </div>
    );
};

export default SearchUsers;
