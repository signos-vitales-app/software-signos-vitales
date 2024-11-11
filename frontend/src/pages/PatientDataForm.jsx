import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createPatientRecord, fetchPatientInfo } from "../services/patientService";
import { FiSave, FiClipboard } from "react-icons/fi";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const PatientDataForm = () => {
    const { idPaciente } = useParams();
    const navigate = useNavigate();

    // Obtener la fecha y hora actuales
    const currentDate = new Date().toISOString().split("T")[0];  // Fecha actual en formato YYYY-MM-DD
    const currentTime = new Date().toTimeString().split(" ")[0].slice(0, 5);  // Hora actual en formato HH:MM
    // Estado para almacenar si el paciente es pediátrico
    const [isPediatric, setIsPediatric] = useState(false);


    const [recordDate, setRecordDate] = useState(currentDate);  // Usar la fecha actual por defecto
    const [recordTime, setRecordTime] = useState(currentTime);  // Usar la hora actual por defecto
    const [pesoAdulto, setPesoAdulto] = useState("");
    const [pesoPediatrico, setPesoPediatrico] = useState("");
    const [talla, setTalla] = useState("");
    const [presionSistolica, setPresionSistolica] = useState("");
    const [presionDiastolica, setPresionDiastolica] = useState("");
    const [presionMedia, setPresionMedia] = useState("");
    const [pulso, setPulso] = useState("");
    const [frecuenciaRespiratoria, setFrecuenciaRespiratoria] = useState("");
    const [saturacionOxigeno, setSaturacionOxigeno] = useState("");
    const [temperatura, setTemperatura] = useState(""); // Agregado el campo de temperatura
    const [observaciones, setObservations] = useState("");

    // Cargar información del paciente
    useEffect(() => {
        const loadPatientInfo = async () => {
            try {
                const response = await fetchPatientInfo(idPaciente);
                const patient = response.data;
                setIsPediatric(patient.is_pediatric); // Verificar si el paciente es pediátrico
            } catch (error) {
                console.error("Error fetching patient info:", error);
                toast.error("Error loading patient information.");
            }
        };
        loadPatientInfo();
    }, [idPaciente]);

    const calculatePresionMedia = () => {
        if (presionSistolica && presionDiastolica) {
            const tam = ((2 * parseInt(presionDiastolica) + parseInt(presionSistolica)) / 3).toFixed(0);
            setPresionMedia(tam);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createPatientRecord({
                id_paciente: idPaciente,
                record_date: recordDate,
                record_time: recordTime,
                presion_sistolica: presionSistolica,
                presion_diastolica: presionDiastolica,
                presion_media: presionMedia,
                pulso,
                temperatura, 
                frecuencia_respiratoria: frecuenciaRespiratoria,
                saturacion_oxigeno: saturacionOxigeno,
                peso_adulto: isPediatric ? null : pesoAdulto,
                peso_pediatrico: isPediatric ? pesoPediatrico : null,
                talla,
                observaciones
            });
            toast.success("Patient data saved successfully!");
            navigate(`/patient/${idPaciente}/records`);
        } catch (error) {
            console.error("Error saving patient data:", error);
            const errorMessage = error.response?.data?.message || "Failed to save patient data.";
            toast.error(errorMessage);
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4 overflow-auto">
            <h1 className="text-2xl font-bold mb-6">Monitoreo General</h1>
            <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white p-6 rounded shadow-md">
                <div className="flex justify-between mb-4">
                    <div className="w-1/2 mr-2">
                        <label>Fecha Dato:</label>
                        <input
                            type="date"
                            value={recordDate}
                            onChange={(e) => setRecordDate(e.target.value)}
                            required
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="w-1/2 ml-2">
                        <label>Hora Dato:</label>
                        <input
                            type="time"
                            value={recordTime}
                            onChange={(e) => setRecordTime(e.target.value)}
                            required
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                        <label>Peso Adulto (kg):</label>
                        <input
                            type="number"
                            value={pesoAdulto}
                            onChange={(e) => setPesoAdulto(e.target.value)}
                            disabled={isPediatric}
                            className={`w-full p-2 border rounded ${isPediatric ? "bg-gray-100" : ""}`}
                        />
                    </div>
                    <div>
                        <label>Peso Pediátrico (g/kg):</label>
                        <input
                            type="number"
                            value={pesoPediatrico}
                            onChange={(e) => setPesoPediatrico(e.target.value)}
                            disabled={!isPediatric}
                            className={`w-full p-2 border rounded ${!isPediatric ? "bg-gray-100" : ""}`}
                        />
                    </div>
                    <div>
                        <label>Talla (cm):</label>
                        <input
                            type="number"
                            value={talla}
                            onChange={(e) => setTalla(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                        <label>Pulso (lat x min):</label>
                        <input
                            type="number"
                            value={pulso}
                            onChange={(e) => setPulso(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label>Frecuencia Respiratoria (resp x min):</label>
                        <input
                            type="number"
                            value={frecuenciaRespiratoria}
                            onChange={(e) => setFrecuenciaRespiratoria(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label>SatO2%:</label>
                        <input
                            type="number"
                            value={saturacionOxigeno}
                            onChange={(e) => setSaturacionOxigeno(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                        <label>TAS (mm Hg):</label>
                        <input
                            type="number"
                            value={presionDiastolica}
                            onChange={(e) => {
                                setPresionDiastolica(e.target.value);
                                calculatePresionMedia();
                            }}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label>TAD (mm Hg):</label>
                        <input
                            type="number"
                            value={presionSistolica}
                            onChange={(e) => {
                                setPresionSistolica(e.target.value);
                                calculatePresionMedia();
                            }}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label>TAM (mm Hg):</label>
                        <input
                            type="text"
                            value={presionMedia}
                            readOnly
                            className="w-full p-2 border rounded bg-gray-100"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                        <label>Temperatura (°C):</label>
                        <input
                            type="number"
                            value={temperatura}
                            onChange={(e) => setTemperatura(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label>Observaciones:</label>
                    <textarea
                        value={observaciones}
                        onChange={(e) => setObservations(e.target.value)}
                        maxLength="100"
                        className="w-full p-2 border rounded"
                    />
                </div>

                {/* Botones */}
                <div className="flex justify-between">
                    <button
                        type="submit"
                        className="flex items-center px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition"
                    >
                        <FiSave className="mr-2" />
                        Guardar Datos
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(`/patient/${idPaciente}/records`)}
                        className="flex items-center px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition"
                    >
                        <FiClipboard className="mr-2" />
                        Ver registros anteriores
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PatientDataForm;