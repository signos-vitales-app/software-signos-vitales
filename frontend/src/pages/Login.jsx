import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { FaUser, FaLock,FaEye, FaEyeSlash } from "react-icons/fa"; // Importamos los íconos para la visibilidad de la contraseña
import loginBackground from "./imagen Login.png"; // Importar la imagen directamente desde la ruta

const Login = () => {
    const [numeroIdentificacion, setNumeroIdentificacion] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false); // Estado para controlar la visibilidad de la contraseña
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await login(numeroIdentificacion, password);
            localStorage.setItem("token", response.data.token); // Guardar el token
            localStorage.setItem("role", response.data.role);   // Guardar el rol del usuario
            localStorage.setItem("numero_identificacion", response.data.numero_identificacion); // Guardar el token

            toast.success("Inicio de sesión exitosa!");
            navigate("/dashboard"); // Redirigir al panel general
        } catch (err) {
          console.error("Error al iniciar sesión", err);
          
          // Verifica si el error indica que el usuario está deshabilitado
          if (err.response && err.response.status === 403) {
              toast.error("El usuario está deshabilitado. Contacte al administrador.");
          } else if (err.response && err.response.status === 401) {
              toast.error("Credenciales inválidas. Por favor, intente de nuevo.");
          } else {
              toast.error("Error del servidor. Intente más tarde.");
          }
        }
    };

    // Función para alternar la visibilidad de la contraseña
    const togglePasswordVisibility = () => {
        setPasswordVisible((prevState) => !prevState); // Cambia el estado de visibilidad
    };

    return (
        <div className="flex flex-col h-screen items-center justify-center bg-gray-100 relative">
          {/* Imagen de fondo */}
          <div className="absolute inset-0 z-0">
            <img
              src={loginBackground} // Usar la imagen importada
              alt="Login Background"
              className="w-full h-full object-cover"
            />
          </div>
    
          <div className="w-full max-w-md bg-blue-800 rounded-lg shadow-lg p-8 relative z-10">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                <FaUser className="text-gray-600 text-4xl" />
              </div>
            </div>
    
            <form onSubmit={handleLogin}>
              {/* Campo de usuario */}
              <div className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Numero de identificación"
                    value={numeroIdentificacion}
                    onChange={(e) => setNumeroIdentificacion(e.target.value)}
                    className="w-full pl-10 p-3 border rounded-full bg-white focus:outline-none"
                  />
                  <span className="absolute inset-y-0 left-3 flex items-center text-gray-600">
                    <FaUser />
                  </span>
                </div>
              </div>
    
              {/* Campo de contraseña */}
              <div className="mb-4">
                <div className="relative">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 p-3 border rounded-full bg-white focus:outline-none"
                  />
                  <span className="absolute inset-y-0 left-3 flex items-center text-gray-600">
                    <FaLock />
                  </span>
                  <span
                    onClick={togglePasswordVisibility}
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                  >
                    {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>
    
              {/* Olvidé mi contraseña */}
              <div className="mb-6 text-center">
                        <button
                            type="button"
                            onClick={() => navigate("/reset-password")} // Redirigir a la página de restablecer contraseña
                            className="text-white text-sm hover:underline"
                        >
                            Olvidé mi contraseña
                        </button>
                    </div>
    
              {/* Botón de iniciar sesión */}
              <button
                type="submit"
                className="w-full p-3 bg-green-500 text-white font-bold rounded-full hover:bg-green-600 transition"
              >
                Iniciar Sesión
              </button>
            </form>
          </div>
        </div>
      );
};

export default Login;
