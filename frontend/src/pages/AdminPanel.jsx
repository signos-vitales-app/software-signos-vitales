import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers, updateUserRole, register, toggleUserStatus } from "../services/authService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Importamos íconos
import { FiUpload } from "react-icons/fi";

const AdminPanel = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("user");
    const [success, setSuccess] = useState(null);
    const [passwordVisible, setPasswordVisible] = useState(false); // Estado para visibilidad de la contraseña

    useEffect(() => {
        const role = localStorage.getItem("role");
        if (role !== "admin") {
            navigate("/dashboard"); // Redirigir al panel general si no es admin
        } else {
            fetchUsers();
        }
    }, [navigate]);

    const fetchUsers = async () => {
        try {
            const response = await getUsers();
            setUsers(response.data);
        } catch (error) {
            setError("Failed to fetch users");
        }
    };

    const handleRoleChange = async (id, newRole) => {
        try {
            await updateUserRole(id, newRole);
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === id ? { ...user, role: newRole } : user
                )
            );
        } catch (error) {
            setError("Failed to update user role");
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
            setError("Failed to update user status");
        }
    };

    // Función para validar la contraseña
    const validatePassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}|:"<>?~`.]).{8,16}$/;
        return regex.test(password);
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setSuccess(null);
            return;
        }

        // Validar la contraseña
        if (!validatePassword(password)) {
            toast.error("La contraseña debe tener entre 8 y 16 caracteres, incluyendo al menos una mayúscula, una minúscula, un número y un carácter especial.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);
            formData.append('email', email);
            formData.append('role', role);
            if (profileImage) {
                formData.append('profileImage', profileImage);
            }

            console.log('Enviando datos:');
            for (let pair of formData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }

            const response = await register(formData);
            setSuccess("Usuario registrado exitosamente!");
            setError(null);
            navigate('/login');
        } catch (err) {
            const errorMessage = err.response?.data?.message || 
                               err.response?.data?.error || 
                               "Error en el registro. Por favor, intente nuevamente.";
            setError(errorMessage);
            setSuccess(null);
            console.error('Error detallado:', err.response?.data);
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible((prevState) => !prevState); // Cambiar la visibilidad de la contraseña
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
            <p>Manage user roles and permissions below.</p>
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}

            {/* Formulario de registro de usuario */}
            <form onSubmit={handleRegister} className="w-full max-w-md p-4 bg-white rounded shadow-lg mb-6">
                <h2 className="text-2xl font-bold mb-4 text-center">Register New User</h2>
                
                
                
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full mb-4 p-3 border border-gray-300 rounded"
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mb-4 p-3 border border-gray-300 rounded"
                />
                <div className="relative">
                    <input
                        type={passwordVisible ? "text" : "password"} // Mostrar u ocultar la contraseña
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full mb-4 p-3 border border-gray-300 rounded"
                    />
                    <span
                        onClick={togglePasswordVisibility} // Cambiar la visibilidad
                        className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                    >
                        {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>
                <div className="relative">
                    <input
                        type={passwordVisible ? "text" : "password"} // Hacer lo mismo para la confirmación
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full mb-4 p-3 border border-gray-300 rounded"
                    />
                    <span
                        onClick={togglePasswordVisibility} // Cambiar la visibilidad
                        className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                    >
                        {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full mb-4 p-3 border border-gray-300 rounded"
                >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="staff">Staff</option>
                </select>
                <button
                    type="submit"
                    className="w-full p-3 bg-green-500 text-white font-bold rounded hover:bg-green-600 transition"
                >
                    Register User
                </button>
            </form>

            {/* Tabla de usuarios */}
            <div className="w-full max-w-2xl mt-6">
                <table className="w-full bg-white shadow-md rounded">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-3 text-left">Username</th>
                            <th className="p-3 text-left">Email</th>
                            <th className="p-3 text-left">Role</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="border-b">
                                <td className="p-3">{user.username}</td>
                                <td className="p-3">{user.email}</td>
                                <td className="p-3">{user.role}</td>
                                <td className="p-3">
                                    {user.is_active ? "Active" : "Disabled"}
                                </td>
                                <td className="p-3 flex space-x-2">
                                    <select
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                        className="p-2 border rounded"
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                        <option value="staff">Staff</option>
                                    </select>
                                    <button
                                        onClick={() => handleToggleStatus(user.id, user.is_active)}
                                        className={`p-2 text-white rounded ${user.is_active ? 'bg-red-500' : 'bg-green-500'}`}
                                    >
                                        {user.is_active ? "Disable" : "Enable"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button
                onClick={() => navigate("/dashboard")}
                className="mt-6 px-4 py-2 bg-blue-500 text-white rounded"
            >
                Back to Dashboard
            </button>
        </div>
    );
};

export default AdminPanel;
