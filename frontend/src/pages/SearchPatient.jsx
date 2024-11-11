import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPatients, updatePatientStatus } from "../services/patientService";
import { QrReader } from 'react-qr-reader'; // Importamos el lector de QR

const SearchPatient = () => {
    const [patients, setPatients] = useState([]);
    const [searchId, setSearchId] = useState(""); // Para almacenar el ID escaneado
    const [selectedIdPaciente, setSelectedIdPaciente] = useState(null);
    const [isScanning, setIsScanning] = useState(false); // Controlar si el escáner está activo
    const [errorMessage, setErrorMessage] = useState(""); // Para mostrar el mensaje de error
    const [scanCompleted, setScanCompleted] = useState(false); // Controlar si el escaneo está completado
    const navigate = useNavigate();

    useEffect(() => {
        loadPatients();
    }, []);

    const loadPatients = async () => {
        const response = await fetchPatients();
        setPatients(response.data);
    };

    const handleStatusToggle = async (idPaciente, currentStatus) => {
        const newStatus = currentStatus === "activo" ? "inactivo" : "activo";
        await updatePatientStatus(idPaciente, newStatus);
        loadPatients();
    };

    const filteredPatients = patients.filter(patient =>
        patient.numero_identificacion.includes(searchId)
    );

    const handleSelectPatient = (id) => {
        setSelectedIdPaciente(id);
    };

    const handleRegisterData = () => {
        if (selectedIdPaciente) {
            navigate(`/patient/${selectedIdPaciente}/records`);//cambio de lusvin
        }
    };

    const handleScan = (data) => {
        if (data && !scanCompleted) {
            setSearchId(data); 
            setErrorMessage(""); 
            setScanCompleted(true); 
            stopScanning(); 
        }
    };

    const handleError = (err) => {
        // Solo mostramos el error si es diferente al último error registrado
        if (err?.message && err?.message !== lastError) {
            console.error(err);
            setLastError(err.message);
            setErrorMessage("Error al escanear el código QR. Intenta nuevamente.");
        }
    };

    const stopScanning = () => {
        setIsScanning(false); 
        setScanCompleted(true); // Marcamos como completado

    };

    const handleOpenQRScanner = () => {
        setSearchId(""); 
        setErrorMessage(""); 
        setIsScanning(true); 
        setScanCompleted(false); 
    };

    const handleCancelScan = () => {
        setIsScanning(false); 
        setErrorMessage(""); 
        setScanCompleted(false); 
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold text-blue-600 mb-6">Buscar Paciente</h1>
            <input
                type="text"
                placeholder="Número de identificación"
                value={searchId} // El valor del QR se asignará aquí
                onChange={(e) => setSearchId(e.target.value)}
                className="mb-4 p-2 border rounded w-full max-w-md"
            />

            <button
                onClick={handleOpenQRScanner}
                className="mb-4 px-4 py-2 bg-blue-500 text-white font-bold rounded"
            >
                Escanear Código QR
            </button>

            {isScanning && (
                <div className="mb-4">
                    <QrReader
                        onResult={(result, error) => {
                            if (result) handleScan(result?.text);
                            if (error) handleError(error);
                        }}
                        constraints={{ facingMode: "environment" }}
                        style={{ width: '100%' }}
                    />
                    <button
                        onClick={handleCancelScan}
                        className="mt-2 px-4 py-2 bg-red-500 text-white font-bold rounded"
                    >
                        Cancelar Escaneo
                    </button>
                </div>
            )}

            {errorMessage && (
                <div className="mb-4 text-red-500 font-bold">
                    {errorMessage}
                </div>
            )}

            <table className="w-full max-w-2xl bg-white rounded-lg shadow-lg overflow-hidden">
                <thead>
                    <tr className="bg-blue-100 text-blue-700">
                        <th className="p-4">Nombres y apellidos</th>
                        <th className="p-4">Número de identificación</th>
                        <th className="p-4">Estado</th>
                        <th className="p-4">Editar</th>
                        <th className="p-4">Seleccionar</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredPatients.map((patient) => (
                        <tr key={patient.id} className="border-b">
                            <td className="p-4">{patient.primer_nombre} {patient.primer_apellido}</td>
                            <td className="p-4">{patient.numero_identificacion}</td>
                            <td className="p-4">
                                <button
                                    onClick={() => handleStatusToggle(patient.id, patient.status)}
                                    className={`px-4 py-1 rounded ${
                                        patient.status === "activo" ? "bg-green-500" : "bg-red-500"
                                    } text-white`}
                                >
                                    {patient.status === "activo" ? "Activo" : "Inactivo"}
                                </button>
                            </td>
                            <td className="p-4">
                                <button
                                    onClick={() => console.log(`Edit patient ${patient.id}`)}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    &#9998;
                                </button>
                            </td>
                            <td className="p-4">
                                <button
                                    onClick={() => handleSelectPatient(patient.id)}
                                    className={`px-4 py-1 rounded ${
                                        selectedIdPaciente === patient.id ? "bg-blue-500 text-white" : "bg-gray-300"
                                    }`}
                                >
                                    {selectedIdPaciente === patient.id ? "Seleccionado" : "Seleccionar"}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button
                onClick={handleRegisterData}
                disabled={!selectedIdPaciente}
                className={`mt-6 px-4 py-2 ${
                    selectedIdPaciente ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-300 cursor-not-allowed"
                } text-white font-bold rounded`}
            >
                Registrar Datos
            </button>
        </div>
    );
};

export default SearchPatient;
