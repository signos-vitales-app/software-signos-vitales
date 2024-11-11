import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerPatient } from "../services/patientService";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const PatientRegister = () => {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [identificationNumber, setIdentificationNumber] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [documentType, setDocumentType] = useState("cédula de ciudadanía");
    const [location, setLocation] = useState("");
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
        const age = calculateAge(birthDate);
        const isPediatric = age < 14;

        try {
            await registerPatient({
                first_name: firstName,
                last_name: lastName,
                identification_number: identificationNumber,
                birth_date: birthDate,
                document_type: documentType,
                location,
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
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full mb-4 p-3 border border-gray-300 rounded"
                />
                <input
                    type="text"
                    placeholder="Apellidos"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full mb-4 p-3 border border-gray-300 rounded"
                />
                <select
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                    className="w-full mb-4 p-3 border border-gray-300 rounded"
                >
                    <option value="cédula de ciudadanía">Cédula de Ciudadanía</option>
                    <option value="tarjeta de identidad">Tarjeta de Identidad</option>
                </select>
                <input
                    type="text"
                    placeholder="Numero de identificación"
                    value={identificationNumber}
                    onChange={(e) => setIdentificationNumber(e.target.value)}
                    className="w-full mb-4 p-3 border border-gray-300 rounded"
                />
                <h1> Fecha de nacimiento </h1>
                <input
                    type="date"
                    
                    placeholder="Fecha de nacimiento"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    required
                    className="w-full mb-4 p-3 border border-gray-300 rounded"
                />
                
                <input
                    type="text"
                    placeholder="Ubicación (habitacion)"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
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