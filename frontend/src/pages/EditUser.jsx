import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updateUser, fetchUserInfo } from '../services/authService';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiHome } from "react-icons/fi";
import { FaSave, FaUserEdit } from "react-icons/fa";

const EditUser = () => {
    const { idUsuario } = useParams();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("user");
    const [numeroIdentificacion, setNumeroIdentificacion] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUserData = async () => {
            if (!idUsuario) {
                toast.error("ID de usuario no proporcionado");
                return;
            }
            try {
                const response = await fetchUserInfo(idUsuario);
                const user = response.data;
                setUsername(user.username || "");
                setEmail(user.email || "");
                setRole(user.role || "user");
                setNumeroIdentificacion(user.numero_identificacion || "");
                setLoading(false);
            } catch (error) {
                toast.error("Error al cargar los datos del usuario: " + error.message);
                setLoading(false);
            }
        };
        loadUserData();
    }, [idUsuario]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!username || !email || !numeroIdentificacion) {
            toast.error("Por favor, complete todos los campos.");
            return;
        }
        try {
            const userData = {
                username,
                email,
                role,
                numero_identificacion: numeroIdentificacion,
            };
            await updateUser(idUsuario, userData);
            toast.success("Usuario actualizado exitosamente");
            navigate("/search-user");
        } catch (error) {
            toast.error("Error al actualizar el usuario: " + error.message);
        }
    };

    const handleGoBack = () => {
        navigate("/search-user");
    };

    if (loading) return <div>Cargando...</div>;

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <form onSubmit={handleUpdate} className="w-full max-w-lg p-8 bg-white rounded shadow-lg">
                <h2 className="text-xl font-bold mb-6 text-center text-black flex items-center justify-center gap-2">
                    <FaUserEdit size={25} /> Editar Usuario
                </h2>
                <div className="grid grid-cols-1 gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Nombre de usuario"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded"
                    />
                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded"
                    />
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded"
                    >
                        <option value="user">Enfermero/a</option>
                        <option value="jefe">Jefe de enfermería</option>
                        <option value="staff">Médico/a</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Número de identificación"
                        value={numeroIdentificacion}
                        onChange={(e) => setNumeroIdentificacion(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded"
                    />
                </div>
                <div className="flex justify-center gap-6 mt-4">
                    <button
                        type="button"
                        onClick={handleGoBack}
                        className="flex items-center px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition"
                    >
                        <FiHome size={20} className="mr-2" /> Regresar
                    </button>
                    <button
                        type="submit"
                        className="flex items-center px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition"
                    >
                        <FaSave size={18} className="mr-2" /> Guardar Cambios
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditUser;