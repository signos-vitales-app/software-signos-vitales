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
    const [edad, setEdad] = useState(null); // Nueva variable para la edad
    const [isPediatric, setIsPediatric] = useState(false); // Nuevo estado para pediátrico
    const [loading, setLoading] = useState(true);

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

    const handleFechaNacimientoChange = (date) => {
        setFechaNacimiento(date);
        const age = calculateAge(date);
        setEdad(age);
        setIsPediatric(age < 10); // Determinar si es pediátrico
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
                const calculatedAge = calculateAge(patient.fecha_nacimiento);
                setEdad(calculatedAge);
                setIsPediatric(calculatedAge < 10);
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
                is_pediatric: isPediatric, // Incluir pediátrico en la solicitud
            });
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
                    />
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
                <div className="mb-4">
                    <p className="text-gray-700">Edad: {edad !== null ? edad : "No disponible"}</p>
                    <p className="text-gray-700">Pediátrico: {isPediatric ? "Sí" : "No"}</p>
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
