import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerPatient } from "../services/patientService";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { FaUserPlus , FaClipboard } from 'react-icons/fa';  // Usamos FaClipboard para el icono de planilla
import { FiHome} from 'react-icons/fi';  // Usamos FaClipboard para el icono de planilla
const PatientRegister = () => {
    const navigate = useNavigate();
    const [primerNombre, setprimerNombre] = useState("");
    const [segundoNombre, setSegundoNombre] = useState("");
    const [primerApellido, setprimerApellido] = useState("");
    const [segundoApellido, setSegundoApellido] = useState("");
    const [numeroIdentificacion, setnumeroIdentificacion] = useState("");
    const [fechaNacimiento, setFechaNacimiento] = useState("");
    const [tipoIdentificacion, settipoIdentificacion] = useState("cédula de ciudadanía");
    const [ubicacion, setubicacion] = useState("");
    const [status, setStatus] = useState("activo");
    const [edad, setEdad] = useState(null);
    const [ageGroup, setAgeGroup] = useState("");
    const currentDate = new Date().toISOString().split("T")[0]; // Fecha actual en formato YYYY-MM-DD

    const calculateAge = (date) => {
        if (!date) return null;
        const birth = new Date(date);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    const calculateAgeInMonths = (date) => {
        if (!date) return null;
        const birth = new Date(date);
        const today = new Date();
        const ageInMonths =
            (today.getFullYear() - birth.getFullYear()) * 12 +
            (today.getMonth() - birth.getMonth()) -
            (today.getDate() < birth.getDate() ? 1 : 0);
        return ageInMonths;
    };

    const calculateAgeGroup = (fechaNacimiento) => {
        const ageInMonths = calculateAgeInMonths(fechaNacimiento);
        if (ageInMonths >= 0 && ageInMonths <= 3) return 'Recién nacido';
        if (ageInMonths > 3 && ageInMonths <= 6) return 'Lactante temprano';
        if (ageInMonths > 6 && ageInMonths <= 12) return 'Lactante mayor';
        if (ageInMonths > 12 && ageInMonths <= 36) return 'Niño pequeño';
        if (ageInMonths > 36 && ageInMonths <= 72) return 'Preescolar temprano';
        if (ageInMonths > 72 && ageInMonths <= 180) return 'Preescolar tardío';
        return 'Adulto';
    };

    const handleFechaNacimientoChange = (date) => {
        setFechaNacimiento(date);
        const age = calculateAge(date);
        setEdad(age);

        const group = calculateAgeGroup(date);
        setAgeGroup(group);
        // Cambiar tipo de identificación según la edad
    if (age !== null) {
        settipoIdentificacion(age > 20 ? "cédula de ciudadanía" : "tarjeta de identidad");
    }
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token'); // Asegúrate de guardar el token al iniciar sesión

            if (!token) {
                toast.error("No se encontró un token. Por favor, inicia sesión.");
                return;
            }
    
            await registerPatient({
                primer_nombre: primerNombre,
                segundo_nombre: segundoNombre,
                primer_apellido: primerApellido,
                segundo_apellido: segundoApellido,
                numero_identificacion: numeroIdentificacion,
                fecha_nacimiento: fechaNacimiento,
                tipo_identificacion: tipoIdentificacion,
                ubicacion,
                status,
                age_group: ageGroup
            },
            token // Pasa el token al servicio
        );
            toast.success("Paciente registrado exitosamente!");
            navigate("/dashboard");
        } catch (err) {
            console.error("Error en el registro", err);
            toast.error("No se pudo registrar al paciente. Inténtelo nuevamente.");
        }
    };

    const displayAge = () => {
        const ageInMonths = calculateAgeInMonths(fechaNacimiento);
        if (ageInMonths <= 24) {
            return `${ageInMonths} meses`;
        } else {
            return `${edad} años`;
        }
    };

    const handleGoBack = () => {
        navigate("/dashboard");
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <form onSubmit={handleRegister} className="w-full max-w-lg p-8 bg-white rounded shadow-lg">
                <h2 className="text-xl font-bold mb-6 text-center text-black flex items-center justify-center gap-2">
                    <FaClipboard size={25} /> Registrar paciente
                </h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    {/* Campos de texto */}
                    <input
                        type="text"
                        placeholder="Primer nombre"
                        value={primerNombre}
                        onChange={(e) => setprimerNombre(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded"
                    />
                    <input
                        type="text"
                        placeholder="Segundo nombre"
                        value={segundoNombre}
                        onChange={(e) => setSegundoNombre(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded"
                    />
                    <input
                        type="text"
                        placeholder="Primer apellido"
                        value={primerApellido}
                        onChange={(e) => setprimerApellido(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded"
                    />
                    <input
                        type="text"
                        placeholder="Segundo apellido"
                        value={segundoApellido}
                        onChange={(e) => setSegundoApellido(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded"
                    />
                    <select
                        value={tipoIdentificacion}
                        onChange={(e) => settipoIdentificacion(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded col-span-2"
                    >
                        <option value="cédula de ciudadanía">Cédula de Ciudadanía</option>
                        <option value="tarjeta de identidad">Tarjeta de Identidad</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Número de identificación"
                        value={numeroIdentificacion}
                        onChange={(e) => setnumeroIdentificacion(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded col-span-2"
                    />
                    <input
                        type="date"
                        placeholder="Fecha de nacimiento"
                        value={fechaNacimiento}
                        onChange={(e) => handleFechaNacimientoChange(e.target.value)}
                        required
                        className="w-full p-3 border border-gray-300 rounded col-span-2"
                        max={currentDate} // Limitar a la fecha actual
                    />
                    
                    <input
                        type="text"
                        placeholder="Ubicación (habitación)"
                        value={ubicacion}
                        onChange={(e) => setubicacion(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded col-span-2"
                    />
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded col-span-2"
                    >
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                    </select>
                </div>
                
                {/* Mostrar Edad y Tipo de Paciente */}
                <div className="col-span-2 mb-4">
                        <p>Edad: {displayAge()}</p>
                        <p>Tipo de paciente: {ageGroup}</p>
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
                        <FaUserPlus size={18} className="mr-2" /> Registrar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PatientRegister;
