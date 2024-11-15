import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPatients, updatePatientStatus } from "../services/patientService";
import { FiHome, FiX } from "react-icons/fi";
import { FaCamera } from 'react-icons/fa';
import { Html5QrcodeScanner } from "html5-qrcode";

const SearchPatient = () => {
    const [patients, setPatients] = useState([]);
    const [searchId, setSearchId] = useState("");
    const [selectedIdPaciente, setSelectedIdPaciente] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const [cameraPermission, setCameraPermission] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [scanCompleted, setScanCompleted] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadPatients();
    }, []);

    useEffect(() => {
        if (isScanning) {
            handleOpenQRScanner();
        }
    }, [isScanning]);

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
            navigate(`/patient/${selectedIdPaciente}/records`);
        }
    };

    const handleScan = (qrCodeMessage) => {
        if (qrCodeMessage && !scanCompleted) {
            setSearchId(qrCodeMessage);
            setErrorMessage("");
            setScanCompleted(true);
            stopScanning();
        }
    };

    const stopScanning = () => {
        setIsScanning(false);
        setScanCompleted(true);
    };

    const requestCameraPermission = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (stream) {
                setCameraPermission(true);
                handleOpenQRScanner();
            }
        } catch (err) {
            setCameraPermission(false);
            setErrorMessage("Permiso de cámara denegado o no disponible.");
        }
    };

    const handleOpenQRScanner = () => {
        if (!cameraPermission) {
            requestCameraPermission();
            return;
        }

        setSearchId("");
        setErrorMessage("");
        setIsScanning(true);
        setScanCompleted(false);

        // Inicializar el lector QR solo cuando la cámara esté disponible
        const scanner = new Html5QrcodeScanner("qr-reader", {
            fps: 10,
            qrbox: { width: 250, height: 250 }
        });

        // Iniciar el escaneo
        scanner.render((decodedText, decodedResult) => {
            handleScan(decodedText);
        }, (errorMessage) => {
            console.log(`Error de escaneo: ${errorMessage}`);
        });
    };

    const handleCancelScan = () => {
        setIsScanning(false);
        setErrorMessage("");
        setScanCompleted(false);
    };

    const handleGoBack = () => {
        navigate("/dashboard");
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold text-blue-600 mb-6">Buscar Paciente</h1>
            <input
                type="text"
                placeholder="Número de identificación"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="mb-4 p-2 border rounded w-full max-w-md"
            />

            <button
                onClick={handleOpenQRScanner}
                className="mb-4 px-4 py-2 bg-blue-500 text-white font-bold rounded flex items-center"
            >
                <FaCamera className="mr-2" />
                {cameraPermission === null
                    ? "Solicitar acceso a la cámara"
                    : "Escanear Código QR"}
            </button>

            {cameraPermission === false && (
                <div className="text-red-500 font-bold mb-4">
                    No se ha concedido acceso a la cámara. Verifique los permisos en su navegador.
                </div>
            )}

            {isScanning && (
                <div className="flex flex-col items-center justify-center bg-gray-200 p-4 rounded-md shadow-lg w-full max-w-xs mb-4">
                    <div id="qr-reader" className="mb-4" style={{ width: "250px", height: "250px" }}></div>
                    <button
                        onClick={handleCancelScan}
                        className="mt-4 px-4 py-2 bg-red-500 text-white font-bold rounded flex items-center"
                    >
                        <FiX className="mr-2" />
                        Cancelar Escaneo
                    </button>
                </div>
            )}

            {errorMessage && (
                <div className="text-red-500 font-bold mb-4">
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
                                    className={`px-4 py-1 rounded ${patient.status === "activo" ? "bg-green-500" : "bg-red-500"
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
                                    className={`px-4 py-1 rounded ${selectedIdPaciente === patient.id ? "bg-blue-500 text-white" : "bg-gray-300"
                                        }`}
                                >
                                    {selectedIdPaciente === patient.id ? "Seleccionado" : "Seleccionar"}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex justify-center w-full max-w-4xl space-x-4">
                <button onClick={handleGoBack} className="mt-6 flex items-center px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition">
                    <FiHome className="mr-2" /> Regresar
                </button>
                <button
                    onClick={handleRegisterData}
                    disabled={!selectedIdPaciente}
                    className={`mt-6 px-4 py-2 ${selectedIdPaciente ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-300 cursor-not-allowed"} text-white font-bold rounded flex items-center space-x-2`}
                >
                    Registrar Datos
                </button>
            </div>
        </div>
    );
};

export default SearchPatient;
