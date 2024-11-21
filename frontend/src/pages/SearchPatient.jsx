import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPatients, updatePatientStatus } from "../services/patientService";
import { FiHome, FiX } from "react-icons/fi";
import { FaCamera } from 'react-icons/fa';
import { Html5QrcodeScanner } from "html5-qrcode";
import { BiSolidSpreadsheet } from "react-icons/bi";
import 'react-toastify/dist/ReactToastify.css';
import { toast } from "react-toastify";

const SearchPatient = () => {
    const [patients, setPatients] = useState([]);
    const [searchId, setSearchId] = useState("");
    const [selectedIdPaciente, setSelectedIdPaciente] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const [cameraPermission, setCameraPermission] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [scanCompleted, setScanCompleted] = useState(false);
    const [currentPage, setCurrentPage] = useState(1); // Página actual del slider
    const navigate = useNavigate();

    const patientsPerPage = 10; // Pacientes por página

    useEffect(() => {
        loadPatients();
    }, []);

    useEffect(() => {
        if (isScanning) {
            handleOpenQRScanner();
        }
    }, [isScanning]);
    useEffect(() => {
        if (searchId) {
            const foundPatient = patients.find(patient => patient.numero_identificacion === searchId);
            if (foundPatient) {
                // Calcula la página donde se encuentra el paciente
                const patientIndex = sortedPatients.findIndex(patient => patient.numero_identificacion === searchId);
                const pageNumber = Math.ceil((patientIndex + 1) / patientsPerPage);
    
                // Actualiza el estado para mostrar el paciente en la tabla
                setCurrentPage(pageNumber);
                setSelectedIdPaciente(foundPatient.id); // Selecciona al paciente automáticamente
            } else {
                setSelectedIdPaciente(null); // Deselecciona si no hay coincidencia
            }
        } else {
            setSelectedIdPaciente(null); // Deselecciona si el campo está vacío
        }
    }, [searchId, patients]);
    
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

    // Ordenar alfabéticamente por primer nombre, segundo nombre, primer apellido y segundo apellido
    const sortedPatients = [...filteredPatients].sort((a, b) => {
        if (a.primer_nombre < b.primer_nombre) return -1;
        if (a.primer_nombre > b.primer_nombre) return 1;
        if (a.segundo_nombre < b.segundo_nombre) return -1;
        if (a.segundo_nombre > b.segundo_nombre) return 1;
        if (a.primer_apellido < b.primer_apellido) return -1;
        if (a.primer_apellido > b.primer_apellido) return 1;
        if (a.segundo_apellido < b.segundo_apellido) return -1;
        if (a.segundo_apellido > b.segundo_apellido) return 1;
        return 0;
    });

    // Calcular la paginación
    const totalPages = Math.ceil(sortedPatients.length / patientsPerPage);
    const indexOfLastPatient = currentPage * patientsPerPage;
    const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
    const currentPatients = sortedPatients.slice(indexOfFirstPatient, indexOfLastPatient);

    const handleSelectPatient = (id) => {
        setSelectedIdPaciente(id);
    };

    const handleRegisterData = () => {
        if (selectedIdPaciente) {
            navigate(`/patient/${selectedIdPaciente}/records`);
        } else {
            toast.error("Debes seleccionar un paciente", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    const handleScan = (qrCodeMessage) => {
        if (qrCodeMessage && !scanCompleted) {
            setSearchId(qrCodeMessage);  // Actualiza el valor de búsqueda
            setErrorMessage("");         // Borra mensajes de error previos
            setScanCompleted(true);      // Marca que el escaneo ha sido completado
    
            // Busca al paciente con el número de identificación del QR
            const foundPatient = patients.find(patient => patient.numero_identificacion === qrCodeMessage);
            if (foundPatient) {
                // Calcula la página donde se encuentra el paciente
                const patientIndex = sortedPatients.findIndex(patient => patient.numero_identificacion === qrCodeMessage);
                const pageNumber = Math.ceil((patientIndex + 1) / patientsPerPage);
    
                // Actualiza el estado para mostrar el paciente en la tabla
                setCurrentPage(pageNumber);
                setSelectedIdPaciente(foundPatient.id); // Selecciona al paciente automáticamente
            } else {
                toast.error("Paciente no encontrado.", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
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

        const scanner = new Html5QrcodeScanner("qr-reader", {
            fps: 10,
            qrbox: { width: 250, height: 250 }
        });

        scanner.render((decodedText) => {
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
    const handleEdit = (idPaciente) => {
        navigate(`/edit-patient/${idPaciente}`);
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
                        <th className="p-4">Primer nombre</th>
                        <th className="p-4">Segundo nombre</th>
                        <th className="p-4">Primer apellido</th>
                        <th className="p-4">Segundo apellido</th>
                        <th className="p-4">Número de identificación</th>
                        <th className="p-4">Tipo de identificación</th>
                        <th className="p-4">Ubicación</th>
                        <th className="p-4">Estado</th>
                        <th className="p-4">Editar</th>
                        <th className="p-4">Seleccionar</th>
                    </tr>
                </thead>
                <tbody>
                    {currentPatients.map((patient) => (
                        <tr key={patient.id} className="border-b">
                            <td className="p-4">{patient.primer_nombre}</td>
                            <td className="p-4">{patient.segundo_nombre}</td>
                            <td className="p-4">{patient.primer_apellido}</td>
                            <td className="p-4">{patient.segundo_apellido}</td>
                            <td className="p-4">{patient.numero_identificacion}</td>
                            <td className="p-4">{patient.tipo_identificacion}</td>
                            <td className="p-4">{patient.ubicacion}</td>
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
                                <td className="p-4">
                                    <button
                                        onClick={() => handleEdit(patient.id)}
                                        className="text-blue-600 hover:underline"
                                    >
                                        &#9998;
                                    </button>
                                </td>

                            </td>
                            <td className="p-4">
                                <button
                                    onClick={() => handleSelectPatient(patient.id)}
                                    className={`px-4 py-1 rounded ${selectedIdPaciente === patient.id ? "bg-blue-600 text-white" : "bg-gray-300"
                                        }`}
                                >
                                    Seleccionar
                                </button>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="mt-6">
                <div className="flex justify-between items-center">
                    <button
                        onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                        className={`px-4 py-2 ${currentPage > 1 ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-gray-300 cursor-not-allowed"} rounded`}
                    >
                        Anterior
                    </button>
                    <span> Página {currentPage} de {totalPages} </span>
                    <button
                        onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                        className={`px-4 py-2 ${currentPage < totalPages ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-gray-300 cursor-not-allowed"} rounded`}
                    >
                        Siguiente
                    </button>
                </div>
            </div>

            <div className="mt-6 flex justify-center w-full max-w-4xl space-x-4">
                <button
                    onClick={handleGoBack}
                    className="flex items-center px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition"
                >
                    <FiHome className="mr-2" />
                    Regresar
                </button>
                <button
                    onClick={handleRegisterData}
                    className={`px-4 py-2 ${selectedIdPaciente ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-300 cursor-not-allowed"} text-white font-bold rounded flex items-center space-x-2`}
                >
                    <BiSolidSpreadsheet className="mr-2" />
                    Ir a registros
                </button>
            </div>
        </div>
    );
};

export default SearchPatient;


