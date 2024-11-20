import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiUpload, FiHome } from "react-icons/fi";
import { FaEye, FaEyeSlash, FaUserPlus } from "react-icons/fa"; // Añadimos FaUserPlus para el botón

const RegisterUser = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("user");
    const [profileImage, setProfileImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [numeroIdentificacion, setNumeroIdentificacion] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const validatePassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}|:"<>?~`.]).{8,16}$/;
        return regex.test(password);
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Las contraseñas no coinciden.");
            return;
        }

        if (!validatePassword(password)) {
            toast.error("La contraseña debe tener entre 8 y 16 caracteres, incluyendo al menos una mayúscula, una minúscula, un número y un carácter especial.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("username", username);
            formData.append("password", password);
            formData.append("email", email);
            formData.append("role", role);
            if (profileImage) {
                formData.append("profileImage", profileImage);
            }
            formData.append("numero_identificacion", numeroIdentificacion);

            await register(formData);
            toast.success("Usuario registrado exitosamente!");
            navigate("/login");
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Error en el registro. Intente nuevamente.";
            toast.error(errorMessage);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <form onSubmit={handleRegister} className="w-full max-w-lg p-8 bg-white rounded shadow-lg">
                <h2 className="text-xl font-bold mb-6 text-center text-black flex items-center justify-center gap-2">
                    <FaUserPlus size={25} /> Registrar nuevo usuario
                </h2>

                <div className="flex flex-col items-center mb-6">
                    <div className="w-32 h-32 rounded-full overflow-hidden mb-4 bg-gray-200 flex items-center justify-center">
                        {previewImage ? (
                            <img src={previewImage} alt="Profile preview" className="w-full h-full object-cover" />
                        ) : (
                            <FiUpload size={24} className="text-gray-400" />
                        )}
                    </div>
                    <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                        <span>Subir imagen de perfil</span>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </label>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Nombres y apellidos"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full col-span-2 p-3 border border-gray-300 rounded"
                    />
                    <input
                        type="text"
                        placeholder="Número de identificación"
                        value={numeroIdentificacion}
                        onChange={(e) => setNumeroIdentificacion(e.target.value)}
                        className="w-full col-span-2 p-3 border border-gray-300 rounded"
                    />
                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full col-span-2 p-3 border border-gray-300 rounded"
                    />
                    <div className="relative col-span-2">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-gray-500"
                        >
                            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                        </button>
                    </div>
                    <div className="relative col-span-2">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirmar contraseña"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-3 text-gray-500"
                        >
                            {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                        </button>
                    </div>
                </div>

                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full mb-4 p-3 border border-gray-300 rounded"
                >
                    <option value="user">Enfermero/a</option>
                    <option value="jefe">Jefe de enfermería</option>
                    <option value="staff">Médico/a</option>
                </select>

                <div className="flex justify-center gap-6 mt-4">
                <button
                        type="button"
                        onClick={() => navigate("/admin-panel")}
                        className="flex items-center px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition"
                    >
                        <FiHome size={20} className="mr-2" /> Regresar
                    </button>
                    <button
                        type="submit"
                        className="flex items-center px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition"
                    >
                        <FaUserPlus size={18} className="mr-2" /> Registrar
                    </button>
                    
                </div>
            </form>
        </div>
    );
};

export default RegisterUser;
