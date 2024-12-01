import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPatientRecord, updatePatientRecord, fetchPatientInfo } from "../services/patientService";
import { FiSave } from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditPatientDataForm = () => {
    const { idRegistro,idPaciente } = useParams();
    const navigate = useNavigate();

    const currentDate = new Date().toISOString().split("T")[0];
    const currentTime = new Date().toTimeString().split(" ")[0].slice(0, 5);

    const [formData, setFormData] = useState({
        record_date: "",
        record_time: "",
        presion_sistolica: "",
        presion_diastolica: "",
        presion_media: "",
        pulso: "",
        temperatura: "",
        frecuencia_respiratoria: "",
        saturacion_oxigeno: "",
        peso_adulto: "",
        peso_pediatrico: "",
        talla: "",
        observaciones: "",
    });

    const [ageGroup, setAgeGroup] = useState(""); // Estado para el grupo de edad

    useEffect(() => {
        const loadRecord = async () => {
            try {
                const data = await fetchPatientRecord(idRegistro);
                console.log("Registro cargado:", data); // Verifica los datos cargados
    
                // Formatear la fecha para que sea compatible con el campo de tipo "date"
                const formattedDate = data.record_date ? data.record_date.split("T")[0] : "";
    
                setFormData({
                    ...data,
                    record_date: formattedDate, // Asigna la fecha formateada
                });
            } catch (error) {
                console.error("Error al cargar el registro del paciente:", error);
                toast.error("Error al cargar el registro del paciente.");
            }
        };

        const loadPatientInfo = async () => {
            try {
                const response = await fetchPatientInfo(idPaciente);
                const patient = response.data;
                console.log('Grupo de edad del paciente:', patient.age_group); // Verificar el valor
                setAgeGroup(patient.age_group || ""); // Establecer el grupo de edad
            } catch (error) {
                console.error("Error al recuperar la información del paciente:", error);
                toast.error("Error al recuperar la información del paciente.");
            }
        };
        

        loadRecord();
        loadPatientInfo();
    }, [idRegistro]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === "presion_sistolica" || name === "presion_diastolica") {
            calculatePresionMedia({ ...formData, [name]: value });
        }
    };

    const calculatePresionMedia = (data) => {
        const sistolica = parseInt(data.presion_sistolica, 10);
        const diastolica = parseInt(data.presion_diastolica, 10);

        if (!isNaN(sistolica) && !isNaN(diastolica)) {
            const tam = (( sistolica + 2 * diastolica) / 3).toFixed(0);
            setFormData((prev) => ({ ...prev, presion_media: tam }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const token = localStorage.getItem("token");

        if (!token) {
            toast.error("Token no encontrado. Por favor inicia sesión nuevamente.");
            return;
        }
        try {
            await updatePatientRecord(idRegistro, formData, token);
            toast.success("¡Registro actualizado correctamente!");
            navigate(`/patient/${formData.id_paciente}/records`);
        } catch (error) {
            console.error("Error al actualizar el registro:", error);
            toast.error("Error al actualizar el registro.");
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4 overflow-auto">
            <h1 className="text-2xl font-bold mb-6">Editar Registro del Paciente</h1>
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-3xl bg-white p-6 rounded shadow-md grid gap-6"
            >
                {/* Fecha y Hora */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label>Fecha Dato:</label>
                        <input
                            type="date"
                            name="record_date"
                            value={formData.record_date}
                            onChange={handleInputChange}
                            max={currentDate}

                            required
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label>Hora Dato:</label>
                        <input
                            type="time"
                            name="record_time"
                            value={formData.record_time}
                            onChange={handleInputChange}
                            max={currentTime}

                            required
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>

                {/* Peso, Talla, Temperatura */}
                <div className="grid grid-cols-3 gap-4">
                    {/* Mostrar el campo de peso adecuado según el grupo de edad */}
                    {ageGroup !== "Adulto" ? (
                        <div>
                            <label>Peso Pediátrico (g/kg):</label>
                            <input
                                type="number"
                                name="peso_pediatrico"
                                value={formData.peso_pediatrico || ""}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                    ) : (
                        <div>
                            <label>Peso Adulto (kg):</label>
                            <input
                                type="number"
                                name="peso_adulto"
                                value={formData.peso_adulto || ""}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                    )}
                    <div>
                        <label>Talla (cm):</label>
                        <input
                            type="number"
                            name="talla"
                            value={formData.talla}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label>Temperatura (°C):</label>
                        <input
                            type="number"
                            name="temperatura"
                            value={formData.temperatura}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>

                {/* Presiones */}
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label>Presión Sistólica:</label>
                        <input
                            type="number"
                            name="presion_sistolica"
                            value={formData.presion_sistolica}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label>Presión Diastólica:</label>
                        <input
                            type="number"
                            name="presion_diastolica"
                            value={formData.presion_diastolica}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label>Presión Media:</label>
                        <input
                            type="number"
                            name="presion_media"
                            value={formData.presion_media}
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
                            name="pulso"
                            value={formData.pulso}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label>Frecuencia Respiratoria (resp/min):</label>
                        <input
                            type="number"
                            name="frecuencia_respiratoria"
                            value={formData.frecuencia_respiratoria}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label>SatO2 (%):</label>
                        <input
                            type="number"
                            name="saturacion_oxigeno"
                            value={formData.saturacion_oxigeno}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>

                {/* Observaciones */}
                <div className="mb-4">
                    <label>Observaciones:</label>
                    <textarea
                        name="observaciones"
                        value={formData.observaciones}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <button
                    type="submit"
                    className="flex items-center justify-center py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    <FiSave className="mr-2" />
                    Guardar Cambios
                </button>
            </form>
        </div>
    );
};

export default EditPatientDataForm;
