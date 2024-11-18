import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers, updateUserRole, toggleUserStatus, deleteUser } from "../services/authService";
import { FiHome, FiTrash2, FiUserCheck, FiUserX } from "react-icons/fi";
import { MdOutlineEdit } from "react-icons/md";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const roleNames = {
    user: "Enfermero/a",
    staff: "Médico/a",
    jefe: "Jefe de Enfermería",
};

const SearchUsers = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

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
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === id ? { ...user, role: newRole } : user
                )
            );
        } catch (error) {
            setError("Error al actualizar el rol del usuario");
        }
    };

    const handleToggleStatus = async (id, isActive) => {
        try {
            await toggleUserStatus(id, !isActive);
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === id ? { ...user, is_active: !isActive } : user
                )
            );
        } catch (error) {
            setError("Error al actualizar el estado del usuario");
        }
    };

    const handleDeleteUser = async (id) => {
        const userToDelete = users.find((user) => user.id === id);
        if (!userToDelete) return;

        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: `Estás a punto de eliminar al usuario "${userToDelete.username}". Esta acción no se puede deshacer.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });

        if (result.isConfirmed) {
            try {
                await deleteUser(id);
                setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
                toast.success(`Usuario "${userToDelete.username}" eliminado correctamente.`);
            } catch (error) {
                toast.error("Error al eliminar el usuario.");
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-start h-screen bg-gray-100 p-4">
            <ToastContainer />
            <h1 className="text-3xl font-bold mb-6">Panel de Administración de Usuarios</h1>
            {error && <p className="text-red-500">{error}</p>}

            <div className="w-full mt-6">
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md rounded">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="p-3 text-left">Usuario</th>
                                <th className="p-3 text-left">Número de Identificación</th>
                                <th className="p-3 text-left">Email</th>
                                <th className="p-3 text-left">Rol</th>
                                <th className="p-3 text-left">Estado</th>
                                <th className="p-3 text-left">Cambiar rol</th>
                                <th className="p-3 text-left">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-b">
                                    <td className="p-3">{user.username}</td>
                                    <td className="p-3">{user.numero_identificacion}</td>
                                    <td className="p-3">{user.email}</td>
                                    <td className="p-3">{roleNames[user.role]}</td>
                                    <td className="p-3">{user.is_active ? "Activo" : "Inactivo"}</td>
                                    <td className="p-3">
                                        <select
                                            value={user.role}
                                            onChange={(e) =>
                                                handleRoleChange(user.id, e.target.value)
                                            }
                                            className="p-2 border rounded"
                                        >
                                            {Object.entries(roleNames).map(([value, label]) => (
                                                <option key={value} value={value}>
                                                    {label}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="p-3 flex space-x-2">
                                        <button
                                            onClick={() =>
                                                handleToggleStatus(user.id, user.is_active)
                                            }
                                            className={`flex items-center p-2 text-white rounded ${
                                                user.is_active ? "bg-blue-500" : "bg-green-500"
                                            }`}
                                        >
                                            {user.is_active ? (
                                                <>
                                                    <FiUserX className="mr-1" /> Desactivar
                                                </>
                                            ) : (
                                                <>
                                                    <FiUserCheck className="mr-1" /> Activar
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleDeleteUser(user.id)}
                                            className="flex items-center p-2 bg-red-500 text-white rounded hover:bg-red-600"
                                        >
                                            <FiTrash2 className="mr-1" /> Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <button
                onClick={() => navigate("/admin-panel")}
                className="mt-6 flex items-center px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition"
            >
                <FiHome className="mr-2" /> Regresar
            </button>
        </div>
    );
};

export default SearchUsers;
