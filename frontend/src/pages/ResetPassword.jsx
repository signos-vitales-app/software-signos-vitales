import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "../services/authService";

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
        <div className="flex flex-col h-screen items-center justify-center bg-gray-100">
            <form onSubmit={handleResetPassword} className="w-full max-w-md p-8 bg-white rounded shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-center">Restablecer contraseña</h2>
                <input
                    type="email"
                    placeholder="Correo electronico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mb-4 p-3 border border-gray-300 rounded"
                />
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
                <button
                    type="submit"
                    className="w-full p-3 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition"
                >
                    Enviar enlace de reinicio
                </button>
            </form>

            <button
                onClick={() => navigate("/login")}
                className="mt-4 text-blue-500 hover:underline"
            >
                Volver a iniciar sesión
            </button>
        </div>
    );
};

export default ResetPassword;