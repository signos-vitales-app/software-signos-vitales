import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchRecordById, updatePatientRecord } from '../services/patientService';
import { FiSave, FiClipboard } from 'react-icons/fi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditVitalSignRecord = () => {
    const { recordId } = useParams();
    const navigate = useNavigate();

    const [record, setRecord] = useState({
        record_date: '',
        record_time: '',
        pulso: '',
        temperatura: '',
        frecuencia_respiratoria: '',
        saturacion_oxigeno: '',
        peso_adulto: '',
        peso_pediatrico: '',
        talla: '',
        presion_sistolica: '',
        presion_diastolica: '',
        presion_media: '',
        observaciones: '',
    });

    const [ageGroup, setAgeGroup] = useState(''); // Para gestionar el grupo de edad
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadRecord = async () => {
            try {
                const response = await fetchRecordById(recordId);
                setRecord(response.data);
                setAgeGroup(response.data.age_group || ''); // Establecer el grupo de edad desde el backend
                setLoading(false);
            } catch (error) {
                console.error("Error fetching record:", error);
                setLoading(false);
            }
        };
        loadRecord();
    }, [recordId]);

    const calculatePresionMedia = (sistolica, diastolica) => {
        if (!isNaN(sistolica) && !isNaN(diastolica)) {
            return ((parseInt(sistolica) + 2 * parseInt(diastolica)) / 3).toFixed(0);
        }
        return '';
    };
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newRecord = { ...record, [name]: value };

        if (name === 'presion_sistolica' || name === 'presion_diastolica') {
            const sistolica = name === 'presion_sistolica' ? value : record.presion_sistolica;
            const diastolica = name === 'presion_diastolica' ? value : record.presion_diastolica;

            newRecord.presion_media = calculatePresionMedia(sistolica, diastolica);
        }

        setRecord(newRecord);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token'); // Asegúrate de guardar el token al iniciar sesión

            if (!token) {
                toast.error("No se encontró un token. Por favor, inicia sesión.");
                return;
            }
            await updatePatientRecord(recordId, record,token);
            toast.success("¡Los datos se guardaron correctamente!");
            navigate(-1); // Regresar a la página anterior
        } catch (error) {
            console.error("Error al guardar los datos del paciente:", error);
            const errorMessage =
                error.response?.data?.message || "Error al guardar los datos del paciente.";
            toast.error(errorMessage);
        }
    };

    if (loading) return <div>Cargando...</div>;

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4 overflow-auto">
            <h1 className="text-2xl font-bold mb-6">Editar Registro de Signos Vitales</h1>
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-3xl bg-white p-6 rounded shadow-md grid gap-6"
            >
                {/* Fecha y hora */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label>Fecha de Registro:</label>
                        <input
                            type="date"
                            name="record_date"
                            value={record.record_date}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label>Hora de Registro:</label>
                        <input
                            type="time"
                            name="record_time"
                            value={record.record_time}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>

                {/* Peso y talla */}
                <div className="grid grid-cols-3 gap-4">
                    {ageGroup !== "Adulto" ? (
                        <div>
                            <label>Peso Pediátrico (g/kg):</label>
                            <input
                                type="number"
                                name="peso_pediatrico"
                                value={record.peso_pediatrico}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                    ) : (
                        <div>
                            <label>Peso Adulto (kg):</label>
                            <input
                                type="number"
                                name="peso_adulto"
                                value={record.peso_adulto}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                    )}
                    <div>
                        <label>Talla (cm):</label>
                        <input
                            type="number"
                            name="talla"
                            value={record.talla}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label>Temperatura (°C):</label>
                        <input
                            type="number"
                            name="temperatura"
                            value={record.temperatura}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>

                {/* Presiones */}<div className="grid grid-cols-3 gap-4">
                    <div>
                        <label>Presión Sistólica (mmHg):</label>
                        <input
                            type="number"
                            name="presion_sistolica"
                            value={record.presion_sistolica || ''}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label>Presión Diastólica (mmHg):</label>
                        <input
                            type="number"
                            name="presion_diastolica"
                            value={record.presion_diastolica || ''}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label>Presión Media (mmHg):</label>
                        <input
                            type="number"
                            name="presion_media"
                            value={record.presion_media || ''}
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
                            value={record.pulso}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label>Frecuencia Respiratoria (resp/min):</label>
                        <input
                            type="number"
                            name="frecuencia_respiratoria"
                            value={record.frecuencia_respiratoria}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label>Saturación de Oxígeno (%):</label>
                        <input
                            type="number"
                            name="saturacion_oxigeno"
                            value={record.saturacion_oxigeno}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label>Observaciones:</label>
                    <textarea
                        name="observaciones"
                        value={record.observaciones}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    ></textarea>
                </div>

                {/* Botones */}
                <div className="flex justify-between">
                    <button
                        type="submit"
                        className="flex items-center px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition"
                    >
                        <FiSave className="mr-2" />
                        Guardar Cambios
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="flex items-center px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition"
                    >
                        <FiClipboard className="mr-2" />
                        Ver Registros Anteriores
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditVitalSignRecord;