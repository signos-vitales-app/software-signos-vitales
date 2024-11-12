import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "../services/authService";
import { FaUser } from "react-icons/fa";
import resetPasswordBackground from "./imagen restablecer contraseña.jpg"; // Ruta de la imagen de fondo

const ResetPassword = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            const response = await resetPassword(email);
            setSuccess("Correo electrónico de restablecimiento de contraseña enviado. Por favor revisa tu bandeja de entrada.");
            setError(null);
            console.log(response.data);
        } catch (err) {
            setError("No se pudo enviar el correo electrónico de restablecimiento. Por favor inténtalo de nuevo.");
            setSuccess(null);
        }
    };

    return (
        <div className="flex flex-col h-screen items-center justify-center relative">
          {/* Imagen de fondo */}
          <div className="absolute inset-0 z-0">
            <img
              src={resetPasswordBackground} // Utilizamos la imagen importada
              alt="Restablecer contraseña background"
              className="w-full h-full object-cover"
            />
          </div>
    
          {/* Formulario */}
          <div className="w-full max-w-md p-8 bg-white rounded shadow-lg relative z-10">
            <h2 className="text-center text-lg mb-6">
              Para reestablecer su contraseña, por favor ingrese el correo electrónico que está asociado a su cuenta
            </h2>
    
            {/* Campo de correo */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Ingrese su correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 p-3 border border-gray-300 rounded-full bg-blue-100 focus:outline-none"
                />
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-600">
                  <FaUser />
                </span>
              </div>
            </div>
    
            {/* Mensajes de error y éxito */}
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
    
            {/* Botón de enviar */}
            <button
              type="submit"
              onClick={handleResetPassword}
              className="w-full p-3 bg-blue-500 text-white font-bold rounded-full hover:bg-blue-600 transition"
            >
              Enviar correo
            </button>
    
            {/* Botón para volver al inicio de sesión */}
            <button
              onClick={() => navigate("/login")}
              className="mt-4 w-full text-blue-500 hover:underline text-center"
            >
              Volver a iniciar sesión
            </button>
          </div>
        </div>
      );
};

export default ResetPassword;