import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Importamos los íconos para la visibilidad de la contraseña

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false); // Estado para controlar la visibilidad de la contraseña
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await login(username, password);
            localStorage.setItem("token", response.data.token); // Guardar el token
            localStorage.setItem("role", response.data.role);   // Guardar el rol del usuario
            toast.success("Inicio de sesión exitosa!");
            navigate("/dashboard"); // Redirigir al panel general
        } catch (err) {
            console.error("No se pudo iniciar sesión", err);
            toast.error("Error al iniciar sesión. Por favor, verifique sus credenciales.");
        }
    };

    // Función para alternar la visibilidad de la contraseña
    const togglePasswordVisibility = () => {
        setPasswordVisible((prevState) => !prevState); // Cambia el estado de visibilidad
    };

    return (
        <div className="flex flex-col h-screen items-center justify-center bg-gray-100">
            <form onSubmit={handleLogin} className="w-full max-w-md p-8 bg-white rounded shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                <input
                    type="text"
                    placeholder="Usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full mb-4 p-3 border border-gray-300 rounded"
                />
                <div className="relative">
                    <input
                        type={passwordVisible ? "text" : "password"} // Cambiar entre texto o contraseña
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full mb-4 p-3 border border-gray-300 rounded"
                    />
                    <span
                        onClick={togglePasswordVisibility} // Al hacer clic se alterna la visibilidad
                        className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                    >
                        {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>
                <button
                    type="submit"
                    className="w-full p-3 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition"
                >
                    Entrar
                </button>
            </form>
        </div>
    );
};

export default Login;
