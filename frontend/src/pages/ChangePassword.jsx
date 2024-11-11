import { useState } from "react";
import { useParams } from "react-router-dom";
import { updatePassword } from "../services/authService";

const ChangePassword = () => {
    const { token } = useParams();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleChangePassword = async (e) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            setError("La contraseña no coincide.");
            return;
        }

        try {
            await updatePassword(token, newPassword);
            setSuccess("Contraseña actualizada exitosamente.");
            setError(null);
        } catch (err) {
            setError("No se pudo actualizar la contraseña. Es posible que el enlace haya caducado.");
            setSuccess(null);
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gray-100">
            <form onSubmit={handleChangePassword} className="w-full max-w-md p-8 bg-white rounded shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-center">Cambiar contraseña</h2>
                <input
                    type="password"
                    placeholder="Nueva contraseña"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full mb-4 p-3 border border-gray-300 rounded"
                />
                <input
                    type="password"
                    placeholder="Confirme la nueva contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full mb-4 p-3 border border-gray-300 rounded"
                />
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
                <button
                    type="submit"
                    className="w-full p-3 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition"
                >
                    Cambiar contraseña
                </button>
            </form>
        </div>
    );
};

export default ChangePassword;
