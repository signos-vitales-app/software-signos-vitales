import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerPatient } from "../services/patientService";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const PatientRegister = () => {
    const navigate = useNavigate();
    const [primerNombre, setprimerNombre] = useState("");
    const [primerApellido, setprimerApellido] = useState("");
    const [numeroIdentificacion, setnumeroIdentificacion] = useState("");
    const [fechaNacimiento, setFechaNacimiento] = useState("");
    const [tipoIdentificacion, settipoIdentificacion] = useState("cédula de ciudadanía");
    const [ubicacion, setubicacion] = useState("");
    const [status, setStatus] = useState("activo");

    const calculateAge = (date) => {
        const birth = new Date(date);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        const age = calculateAge(fechaNacimiento);
        const isPediatric = age < 14;

        try {
            await registerPatient({
                primer_nombre: primerNombre,
                primer_apellido: primerApellido,
                numero_identificacion: numeroIdentificacion,
                fecha_nacimiento: fechaNacimiento,
                tipo_identificacion: tipoIdentificacion,
                ubicacion,
                status,
                is_pediatric: isPediatric // Información de clasificación pediátrica
            });
            toast.success("Paciente registrado exitosamente!");
            navigate("/dashboard");
        } catch (err) {
            console.error("Error en el registro", err);
            toast.error("No se pudo registrar al paciente. Inténtelo nuevamente.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <form onSubmit={handleRegister} className="w-full max-w-md p-8 bg-white rounded shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-center">Registrar paciente</h2>
                <input
                    type="text"
                    placeholder="Nombres"
                    value={primerNombre}
                    onChange={(e) => setprimerNombre(e.target.value)}
                    className="w-full mb-4 p-3 border border-gray-300 rounded"
                />
                <input
                    type="text"
                    placeholder="Apellidos"
                    value={primerApellido}
                    onChange={(e) => setprimerApellido(e.target.value)}
                    className="w-full mb-4 p-3 border border-gray-300 rounded"
                />
                <select
                    value={tipoIdentificacion}
                    onChange={(e) => settipoIdentificacion(e.target.value)}
                    className="w-full mb-4 p-3 border border-gray-300 rounded"
                >
                    <option value="cédula de ciudadanía">Cédula de Ciudadanía</option>
                    <option value="tarjeta de identidad">Tarjeta de Identidad</option>
                </select>
                <input
                    type="text"
                    placeholder="Numero de identificación"
                    value={numeroIdentificacion}
                    onChange={(e) => setnumeroIdentificacion(e.target.value)}
                    className="w-full mb-4 p-3 border border-gray-300 rounded"
                />
                <h1> Fecha de nacimiento </h1>
                <input
                    type="date"
                    
                    placeholder="Fecha de nacimiento"
                    value={fechaNacimiento}
                    onChange={(e) => setFechaNacimiento(e.target.value)}
                    required
                    className="w-full mb-4 p-3 border border-gray-300 rounded"
                />
                
                <input
                    type="text"
                    placeholder="Ubicación (habitacion)"
                    value={ubicacion}
                    onChange={(e) => setubicacion(e.target.value)}
                    className="w-full mb-4 p-3 border border-gray-300 rounded"
                />
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full mb-4 p-3 border border-gray-300 rounded"
                >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                </select>
                <button
                    type="submit"
                    className="w-full p-3 bg-green-500 text-white font-bold rounded hover:bg-green-600 transition"
                >
                    Registrar paciente
                </button>
            </form>
        </div>
    );
};

export default PatientRegister;