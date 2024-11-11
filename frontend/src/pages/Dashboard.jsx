import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiUserPlus } from "react-icons/fi"; // Importamos los íconos necesarios
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState(localStorage.getItem("role") || "");

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/login"); // Redirigir al login si no hay token
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        toast.success("Cierre de sesión exitoso!");
        navigate("/login");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold text-blue-600 mb-6">Bienvenido/a</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                {/* Botón para Buscar paciente */}
                <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg">
                    <FiSearch className="w-12 h-12 text-gray-700 mb-4" />
                    <button
                        onClick={() => navigate("/search-patient")}
                        className="px-6 py-2 bg-green-500 text-white font-bold rounded hover:bg-green-600 transition"
                    >
                        Buscar paciente
                    </button>
                </div>

                {/* Botón para Registrar paciente */}
                <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg">
                    <FiUserPlus className="w-12 h-12 text-gray-700 mb-4" />
                    <button
                        onClick={() => navigate("/register-patient")}
                        className="px-6 py-2 bg-green-500 text-white font-bold rounded hover:bg-green-600 transition"
                    >
                        Registrar paciente
                    </button>
                </div>
            </div>

            {/* Botón para ir al panel de administración, solo visible para administradores */}
            {role === "admin" && (
                <button
                    onClick={() => navigate("/admin-panel")}
                    className="mb-4 px-4 py-2 bg-red-500 text-white rounded"
                >
                    Ir al panel de administrador
                </button>
            )}

            {/* Botón para cerrar sesión */}
            <button
                onClick={handleLogout}
                className="px-4 py-2 bg-blue-500 text-white rounded"
            >
                Cerrar sesión
            </button>
        </div>
    );
};

export default Dashboard;
