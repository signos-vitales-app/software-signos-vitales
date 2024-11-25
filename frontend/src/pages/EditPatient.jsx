import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchPatientInfo, updatePatient } from "../services/patientService";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { FaSave, FaClipboard } from 'react-icons/fa';
import { FiHome } from 'react-icons/fi';

const EditPatient = () => {
    const { idPaciente } = useParams();
    const navigate = useNavigate();

    const [primerNombre, setprimerNombre] = useState("");
    const [segundoNombre, setSegundoNombre] = useState("");
    const [primerApellido, setprimerApellido] = useState("");
    const [segundoApellido, setSegundoApellido] = useState("");
    const [tipoIdentificacion, settipoIdentificacion] = useState("");
    const [numeroIdentificacion, setnumeroIdentificacion] = useState("");
    const [ubicacion, setubicacion] = useState("");
    const [fechaNacimiento, setFechaNacimiento] = useState("");
    const [status, setStatus] = useState("activo");
    const [edad, setEdad] = useState(null);
    const [ageGroup, setAgeGroup] = useState(""); // Nueva variable para age_group
    const [loading, setLoading] = useState(true);

    // Función para calcular la edad en años
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

    // Función para calcular la edad en meses
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

    // Función para calcular el grupo de edad
    const calculateAgeGroup = (fechaNacimiento) => {
        const birth = new Date(fechaNacimiento);
        const today = new Date();
        const ageInMonths =
            (today.getFullYear() - birth.getFullYear()) * 12 +
            (today.getMonth() - birth.getMonth()) -
            (today.getDate() < birth.getDate() ? 1 : 0);

        if (ageInMonths >= 0 && ageInMonths <= 3) return 'Recién nacido';
        if (ageInMonths > 3 && ageInMonths <= 6) return 'Lactante tempranoprano';
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

        // Calcular el grupo de edad
        const group = calculateAgeGroup(date);
        setAgeGroup(group);
    };

    useEffect(() => {
        const loadPatientData = async () => {
            try {
                const response = await fetchPatientInfo(idPaciente);
                const patient = response.data;

                if (patient.fecha_nacimiento) {
                    patient.fecha_nacimiento = new Date(patient.fecha_nacimiento)
                        .toISOString()
                        .split("T")[0];
                }

                setprimerNombre(patient.primer_nombre || "");
                setSegundoNombre(patient.segundo_nombre || "");
                setprimerApellido(patient.primer_apellido || "");
                setSegundoApellido(patient.segundo_apellido || "");
                settipoIdentificacion(patient.tipo_identificacion || "cédula de ciudadanía");
                setnumeroIdentificacion(patient.numero_identificacion || "");
                setubicacion(patient.ubicacion || "");
                setFechaNacimiento(patient.fecha_nacimiento || "");
                setStatus(patient.status || "activo");

                // Calcular y asignar el grupo de edad
                const calculatedAge = calculateAge(patient.fecha_nacimiento);
                setEdad(calculatedAge);
                const group = patient.age_group || calculateAgeGroup(patient.fecha_nacimiento); // Usar age_group del backend
                setAgeGroup(group);

                setLoading(false);
            } catch (error) {
                toast.error("Error al cargar los datos del paciente");
                setLoading(false);
            }
        };

        loadPatientData();
    }, [idPaciente]);

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token'); // Asegúrate de guardar el token al iniciar sesión

            if (!token) {
                toast.error("No se encontró un token. Por favor, inicia sesión.");
                return;
            }
    
            await updatePatient(idPaciente, {
                primer_nombre: primerNombre,
                segundo_nombre: segundoNombre,
                primer_apellido: primerApellido,
                segundo_apellido: segundoApellido,
                tipo_identificacion: tipoIdentificacion,
                numero_identificacion: numeroIdentificacion,
                ubicacion,
                fecha_nacimiento: fechaNacimiento,
                status,
                edad,
                age_group: ageGroup, 
            }, token // Pasa el token al servicio

        );
            toast.success("Paciente actualizado exitosamente");
            navigate("/search-patient");
        } catch (error) {
            toast.error("Error al actualizar el paciente");
        }
    };

    const handleGoBack = () => {
        navigate("/search-patient");
    };

    if (loading) return <div>Cargando...</div>;

    // Mostrar la edad en meses o años según corresponda
    const displayAge = () => {
        const ageInMonths = calculateAgeInMonths(fechaNacimiento);
        if (ageInMonths <= 24) {
            return `${ageInMonths} meses`;
        } else {
            return `${edad} años`;
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <form onSubmit={handleUpdate} className="w-full max-w-lg p-8 bg-white rounded shadow-lg">
                <h2 className="text-xl font-bold mb-6 text-center text-black flex items-center justify-center gap-2">
                    <FaClipboard size={25} /> Editar paciente
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
                    />Fecha de nacimiento 
                    <input
                        type="date"
                        placeholder="Fecha de nacimiento"
                        value={fechaNacimiento}
                        onChange={(e) => handleFechaNacimientoChange(e.target.value)}
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

                {/* Mostrar Edad y Tipo de Paciente */}
                <div className="mb-4">
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
                        <FaSave size={18} className="mr-2" /> Guardar Cambios
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditPatient;


