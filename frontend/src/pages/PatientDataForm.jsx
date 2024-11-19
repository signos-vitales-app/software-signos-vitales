import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createPatientRecord, fetchPatientInfo } from "../services/patientService";
import { FiSave, FiClipboard } from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PatientDataForm = () => {
    const { idPaciente } = useParams();
    const navigate = useNavigate();

    const currentDate = new Date().toISOString().split("T")[0];
    const currentTime = new Date().toTimeString().split(" ")[0].slice(0, 5);

    const [isPediatric, setIsPediatric] = useState(null); // Inicializar como null
    const [recordDate, setRecordDate] = useState(currentDate);
    const [recordTime, setRecordTime] = useState(currentTime);
    const [pesoAdulto, setPesoAdulto] = useState("");
    const [pesoPediatrico, setPesoPediatrico] = useState("");
    const [talla, setTalla] = useState("");
    const [presionSistolica, setPresionSistolica] = useState("");
    const [presionDiastolica, setPresionDiastolica] = useState("");
    const [presionMedia, setPresionMedia] = useState("");
    const [pulso, setPulso] = useState("");
    const [frecuenciaRespiratoria, setFrecuenciaRespiratoria] = useState("");
    const [saturacionOxigeno, setSaturacionOxigeno] = useState("");
    const [temperatura, setTemperatura] = useState("");
    const [observaciones, setObservations] = useState("");

    useEffect(() => {
        const loadPatientInfo = async () => {
            try {
                const response = await fetchPatientInfo(idPaciente);
                const patient = response.data;
                setIsPediatric(patient.is_pediatric); // Verificar si el paciente es pediátrico
            } catch (error) {
                console.error("Error al recuperar la información del paciente:", error);
                toast.error("Error al recuperar la información del paciente.");
            }
        };
        loadPatientInfo();
    }, [idPaciente]);

    const calculatePresionMedia = () => {
        if (presionSistolica && presionDiastolica) {
            const tam = (
                (parseInt(presionDiastolica) + 2*parseInt(presionSistolica)) / 3
            ).toFixed(0);
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
                observaciones,
            });
            toast.success("¡Los datos del paciente se guardaron correctamente!");
            navigate(`/patient/${idPaciente}/records`);
        } catch (error) {
            console.error("Error al guardar los datos del paciente:", error);
            const errorMessage =
                error.response?.data?.message || "Error al guardar los datos del paciente.";
            toast.error(errorMessage);
        }
    };

    if (isPediatric === null) {
        return <div>Cargando información del paciente...</div>;
    }

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4 overflow-auto">
            <h1 className="text-2xl font-bold mb-6">Monitoreo General</h1>
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-3xl bg-white p-6 rounded shadow-md grid gap-6"
            >
                {/* Fecha y hora */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label>Fecha Dato:</label>
                        <input
                            type="date"
                            value={recordDate}
                            onChange={(e) => setRecordDate(e.target.value)}
                            max={currentDate} // Limita a no permitir fechas futuras
                            required
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div>
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

                {/* Peso y talla */}
                <div className="grid grid-cols-3 gap-4">
                    {isPediatric ? (
                        <div>
                            <label>Peso Pediátrico (g/kg):</label>
                            <input
                                type="number"
                                value={pesoPediatrico}
                                onChange={(e) => setPesoPediatrico(e.target.value)}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                    ) : (
                        <div>
                            <label>Peso Adulto (kg):</label>
                            <input
                                type="number"
                                value={pesoAdulto}
                                onChange={(e) => setPesoAdulto(e.target.value)}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                    )}
                    <div>
                        <label>Talla (cm):</label>
                        <input
                            type="number"
                            value={talla}
                            onChange={(e) => setTalla(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    </div>
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

                {/* Presiones */}
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label>Presión Sistólica (mmHg):</label>
                        <input
                            type="number"
                            value={presionSistolica} // Antes estaba presionDiastolica
                            onChange={(e) => {
                                setPresionSistolica(e.target.value); // Antes estaba setPresionDiastolica
                                calculatePresionMedia();
                            }}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label>Presión Diastólica (mmHg):</label>
                        <input
                            type="number"
                            value={presionDiastolica} // Antes estaba presionSistolica
                            onChange={(e) => {
                                setPresionDiastolica(e.target.value); // Antes estaba setPresionSistolica
                                calculatePresionMedia();
                            }}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div>
                        <label>Presión Media (mmHg):</label>
                        <input
                            type="number"
                            value={presionMedia}
                            readOnly
                            className="w-full p-2 border rounded bg-gray-100"
                        />
                    </div>
                </div>

                {/* Otros datos */}
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label>Pulso (lat/min):</label>
                        <input
                            type="number"
                            value={pulso}
                            onChange={(e) => setPulso(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label>Frecuencia Respiratoria (resp/min):</label>
                        <input
                            type="number"
                            value={frecuenciaRespiratoria}
                            onChange={(e) => setFrecuenciaRespiratoria(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label>SatO2 (%):</label>
                        <input
                            type="number"
                            value={saturacionOxigeno}
                            onChange={(e) => setSaturacionOxigeno(e.target.value)}
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
                        onClick={() => navigate(-1)}
                        className="flex items-center px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition"
                    >
                        <FiClipboard />
                        Ver registros anteriores
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PatientDataForm;
