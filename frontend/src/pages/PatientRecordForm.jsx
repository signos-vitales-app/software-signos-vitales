import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createPatientRecord } from "../services/patientService";

const PatientRecordForm = () => {
    const { patientId } = useParams();
    const navigate = useNavigate();

    const [recordDate, setRecordDate] = useState("");
    const [recordTime, setRecordTime] = useState("");
    const [systolicPressure, setSystolicPressure] = useState("");
    const [diastolicPressure, setDiastolicPressure] = useState("");
    const [meanArterialPressure, setMeanArterialPressure] = useState("");
    const [pulse, setPulse] = useState("");
    const [temperature, setTemperature] = useState("");
    const [respiratoryRate, setRespiratoryRate] = useState("");
    const [oxygenSaturation, setOxygenSaturation] = useState("");
    const [adultWeight, setAdultWeight] = useState("");
    const [pediatricWeight, setPediatricWeight] = useState("");
    const [height, setHeight] = useState("");
    const [observations, setObservations] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createPatientRecord({
                patient_id: patientId,
                record_date: recordDate,
                record_time: recordTime,
                systolic_pressure: systolicPressure,
                diastolic_pressure: diastolicPressure,
                mean_arterial_pressure: meanArterialPressure,
                pulse,
                temperature,
                respiratory_rate: respiratoryRate,
                oxygen_saturation: oxygenSaturation,
                adult_weight: adultWeight,
                pediatric_weight: pediatricWeight,
                height,
                observations
            });
            alert("Registro de paciente guardado exitosamente!");
            navigate(`/patient/${patientId}`);
        } catch (error) {
            console.error("Error al crear el registro del paciente", error);
            alert("No se pudo crear el registro del paciente.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 overflow-auto">
            <h1 className="text-2xl font-bold mb-6">Agregar nuevo registro</h1>
            <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-6 rounded shadow-md">
                {/* Campos similares a los de PatientRegister para capturar los datos en el historial del paciente */}
                <div className="mb-4">
                    <label>Fecha</label>
                    <input
                        type="date"
                        value={recordDate}
                        onChange={(e) => setRecordDate(e.target.value)}
                        required
                        className="w-full p-2 border rounded"
                    />
                </div>
                {/* Otros campos de entrada aquí, similares al formulario original de PatientRegister */}
                <button type="submit" className="w-full p-3 bg-green-500 text-white font-bold rounded hover:bg-green-600 transition">
                    Guardar
                </button>
            </form>
        </div>
    );
};

export default PatientRecordForm;
