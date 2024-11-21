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

    // Calcular el grupo de edad basado en meses
    const calculateAgeGroup = (date) => {
        const birth = new Date(date);
        const today = new Date();
        const ageInMonths =
            (today.getFullYear() - birth.getFullYear()) * 12 +
            (today.getMonth() - birth.getMonth()) -
            (today.getDate() < birth.getDate() ? 1 : 0); // Ajuste si no ha pasado el día del mes

        if (ageInMonths >= 0 && ageInMonths <= 3) return 'Recién nacido'; // 0m-3m
        if (ageInMonths > 3 && ageInMonths <= 6) return 'Lactante temprano'; // 3m-6m
        if (ageInMonths > 6 && ageInMonths <= 12) return 'Lactante mayor'; // 6m-12m
        if (ageInMonths > 12 && ageInMonths <= 36) return 'Niño pequeño'; // 12m-3a
        if (ageInMonths > 36 && ageInMonths <= 72) return 'Preescolar temprano'; // 3a-6a
        if (ageInMonths > 72 && ageInMonths <= 168) return 'Preescolar tardío'; // 6a-14a
        return 'Adulto'; // > 14a
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        const ageGroup = calculateAgeGroup(fechaNacimiento); // Calculamos el grupo de edad

        try {
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
                age_group: ageGroup // Usamos age_group en lugar de is_pediatric
            });
            toast.success("Paciente registrado exitosamente!");
            navigate("/dashboard");
        } catch (err) {
            console.error("Error en el registro", err);
            toast.error("No se pudo registrar al paciente. Inténtelo nuevamente.");
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
                        onChange={(e) => setFechaNacimiento(e.target.value)}
                        required
                        className="w-full p-3 border border-gray-300 rounded col-span-2"
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
