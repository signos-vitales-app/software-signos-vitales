import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiUpload, FiHome } from "react-icons/fi";
import { FaEye, FaEyeSlash } from "react-icons/fa";  // Importar iconos para visibilidad

const RegisterUser = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("user");
    const [profileImage, setProfileImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showPassword, setShowPassword] = useState(false);  // Estado para visibilidad de la contraseña
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);  // Estado para visibilidad de la confirmación de contraseña
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

    // Validar contraseña
    const validatePassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}|:"<>?~`.]).{8,16}$/;
        return regex.test(password);
    };

    const handleGoBack = () => {
        navigate("/admin-panel");
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            setSuccess(null);
            return;
        }

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

            const response = await register(formData);
            setSuccess("Usuario registrado exitosamente!");
            setError(null);
            toast.success("Usuario registrado exitosamente!");
            navigate('/login');  // Redirigir al login después de registro exitoso
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.response?.data?.error || "Error en el registro. Por favor, intente nuevamente.";
            setError(errorMessage);
            setSuccess(null);
        }
    };

    return (
        <div className="flex flex-col items-center justify-start h-screen bg-gray-100 p-4">
            <form onSubmit={handleRegister} className="w-full max-w-md p-4 bg-white rounded shadow-lg mb-6">
                <h2 className="text-2xl font-bold mb-4 text-center">Registrar nuevo usuario</h2>
                
                <div className="mb-6 flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full overflow-hidden mb-4 bg-gray-200 flex items-center justify-center">
                        {previewImage ? (
                            <img 
                                src={previewImage} 
                                alt="Profile preview" 
                                className="w-full h-full object-cover"
                            />
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

                <input
                    type="text"
                    placeholder="Usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full mb-4 p-3 border border-gray-300 rounded"
                />
                <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mb-4 p-3 border border-gray-300 rounded"
                />
                <div className="relative mb-4">
                    <input
                        type={showPassword ? "text" : "password"}  // Cambio de visibilidad de la contraseña
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

                <div className="relative mb-4">
                    <input
                        type={showConfirmPassword ? "text" : "password"}  // Cambio de visibilidad de la confirmación de contraseña
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

                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full mb-4 p-3 border border-gray-300 rounded"
                >
                    <option value="user">Enfermero/a</option>
                    <option value="jefe">Jefe de enfermería</option>
                    <option value="staff">Médico/a</option>
                </select>

                <button
                    type="submit"
                    className="w-full p-3 bg-green-500 text-white font-bold rounded hover:bg-green-600 transition"
                >
                    Registrar usuario
                </button>

                <div className="flex justify-center w-full mt-6">
                    <button 
                        onClick={handleGoBack} 
                        className="flex items-center px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition"
                    >
                        <FiHome className="mr-2" /> Regresar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RegisterUser;
