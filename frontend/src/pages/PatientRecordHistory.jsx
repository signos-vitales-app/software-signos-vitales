import { useState, useEffect, useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPatientRecords } from "../services/patientService";
import { FiPlusCircle, FiHome, FiFilter, FiDownload } from "react-icons/fi";
import { format } from "date-fns";
import VitalSignsChart from "./VitalSignsChart";
import "jspdf-autotable"; // Importar el complemento para la tabla
import 'react-toastify/dist/ReactToastify.css';
import { toast } from "react-toastify";
import generatePDF from "../services/generatePdf";
const PatientRecordHistory = () => {
    const { idPaciente } = useParams();
    const navigate = useNavigate();
    const [records, setRecords] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [patientInfo, setPatientInfo] = useState({});
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectedVariables, setSelectedVariables] = useState(["pulso", "temperatura", "frecuencia_respiratoria", "presion_sistolica", "presion_diastolica", "saturacion_oxigeno"]);
    const [isPediatric, setIsPediatric] = useState(false);
    const [fechaNacimiento, setFechaNacimiento] = useState("");

    const tableRef = useRef(null); // Referencia para la tabla
    const chartRef = useRef(null); // Referencia para el gráfico

    useEffect(() => {
        loadPatientRecords();
    }, []); // Se ejecuta una sola vez cuando la página se carga

    const loadPatientRecords = async () => {
        try {
            const response = await fetchPatientRecords(idPaciente);
            let records = response.data.records;

            // Ordenar los registros por fecha y hora
            records = records.sort((a, b) => {
                const dateA = new Date(a.record_date);  // Convertir la fecha a un objeto Date
                const dateB = new Date(b.record_date);  // Convertir la fecha a un objeto Date

                // Si las fechas son iguales, ordenar por hora (record_time)
                if (dateA.getTime() === dateB.getTime()) {
                    const timeA = a.record_time.split(':');  // Dividir la hora en horas y minutos
                    const timeB = b.record_time.split(':');  // Dividir la hora en horas y minutos

                    // Convertir horas y minutos en minutos totales para compararlos
                    const minutesA = parseInt(timeA[0]) * 60 + parseInt(timeA[1]);
                    const minutesB = parseInt(timeB[0]) * 60 + parseInt(timeB[1]);
                    return minutesA - minutesB;  // Ordenar por hora
                }

                // Si las fechas son diferentes, ordenar por fecha
                return dateA - dateB;  // Ordenar por fecha
            });

            // Establecer los registros ordenados en el estado
            setRecords(records);
            setFilteredRecords(records); // Los registros se mantienen ordenados al inicio (sin filtro)
            setPatientInfo(response.data.patient);

            // Calcular la edad y si es pediátrico
            const birth = new Date(response.data.patient.fecha_nacimiento);
            const today = new Date();
            let age = today.getFullYear() - birth.getFullYear();
            const monthDiff = today.getMonth() - birth.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
                age--;
            }
            setFechaNacimiento(age);
            setIsPediatric(age < 14);
        } catch (error) {
            console.error("Error al recuperar registros de pacientes", error);
        }
    };

    const handleNewRecord = () => {
        if (patientInfo.status !== "activo") {
            toast.error("No se pueden agregar registros para pacientes inactivos.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } else {
            navigate(`/patient/${idPaciente}/add-record`);
        }
    };

    const handleGoBack = () => {
        navigate("/search-patient");
    };

    //variables bonitas <3
    const variableLabels = {
        pulso: "Pulso",
        temperatura: "Temperatura",
        frecuencia_respiratoria: "Frecuencia Respiratoria",
        presion_sistolica: "Presión Sistólica",
        presion_diastolica: "Presión Diastólica",
        saturacion_oxigeno: "SatO2",
        peso_pediatrico: "Peso Pediátrico",
        peso_adulto: "Peso Adulto",
        presion_media: "Presión Media"
    };

    const handleFilter = () => {
        // Filtrar los registros según las fechas
        let filtered = records.filter(record => {
            const recordDate = new Date(record.record_date);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;
            return (!start || recordDate >= start) && (!end || recordDate <= end);
        });

        // Ordenar los registros filtrados por fecha
        filtered = filtered.sort((a, b) => new Date(a.record_date) - new Date(b.record_date));

        // Filtrar las variables seleccionadas
        const filteredWithVariables = filtered.map(record => {
            const filteredRecord = {};
            selectedVariables.forEach(variable => {
                filteredRecord[variable] = record[variable];
            });
            return { ...record, ...filteredRecord };
        });

        // Actualizar el estado de los registros filtrados
        setFilteredRecords(filteredWithVariables);
    };

    const toggleVariable = (variable) => {
        setSelectedVariables(prev =>
            prev.includes(variable)
                ? prev.filter(v => v !== variable)
                : [...prev, variable]
        );
    };

    const handleExportPDF = async () => {
        try {
            await generatePDF(patientInfo, fechaNacimiento, filteredRecords, isPediatric, chartRef);
        } catch (error) {
            console.error("Error al generar el PDF", error);
        }
    };
    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6 overflow-auto">
            <h1 className="text-2xl font-bold mb-6">Registro del Paciente</h1>
            <div className="bg-white p-4 rounded shadow-lg w-full max-w-4xl mb-6 overflow-x-auto" ref={tableRef}>
                {/* Información del paciente */}
                <div className="flex justify-between mb-4">
                    <div>
                        <p><strong>Nombre:</strong> {patientInfo.primer_nombre} {patientInfo.segundo_nombre} {patientInfo.primer_apellido} {patientInfo.segundo_apellido}</p>
                        <p><strong>Tipo de identificación:</strong> {patientInfo.tipo_identificacion}</p>
                        <p><strong>Número de identificación:</strong> {patientInfo.numero_identificacion}</p>
                        <p><strong>Ubicación (habitación):</strong> {patientInfo.ubicacion}</p>
                        <p><strong>Edad:</strong> {fechaNacimiento} años</p>
                    </div>
                    <span className={`font-bold ${patientInfo.status === "activo" ? "text-green-500" : "text-red-500"}`}>
                        Paciente {patientInfo.status === "activo" ? "Activo" : "Inactivo"}
                    </span>
                </div>

                {/* Filtros */}
                <div className="mb-4">
                    <div className="flex items-center mb-4">
                        <label className="mr-2">Fecha de inicio:</label>
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="p-2 border rounded" />
                        <label className="mx-2">Fecha de fin:</label>
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="p-2 border rounded" />
                        <button onClick={handleFilter} className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition flex items-center">
                            <FiFilter className="mr-2" /> Filtrar
                        </button>
                    </div>

                    <div>
                        <h3 className="font-bold">Variables:</h3>
                        <div className="flex space-x-4">
                            {["pulso", "temperatura", "frecuencia_respiratoria", "presion_sistolica", "presion_diastolica", "saturacion_oxigeno"].map(variable => (
                                <label key={variable} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedVariables.includes(variable)}
                                        onChange={() => toggleVariable(variable)}
                                        className="mr-2" />
                                    {variableLabels[variable]}  {/* Usamos el objeto variableLabels aquí */}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tabla de Registros Filtrados */}
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-blue-100">
                            <th className="p-2 border">Fecha</th>
                            <th className="p-2 border">Hora</th>
                            <th className="p-2 border">Pulso (lpm)</th>
                            <th className="p-2 border">T°C</th>
                            <th className="p-2 border">FR (RPM)</th>
                            <th className="p-2 border">TAS (mmHg)</th>
                            <th className="p-2 border">TAD (mmHg)</th>
                            <th className="p-2 border">TAM (mmHg)</th>
                            <th className="p-2 border">SatO2 (%)</th>
                            {/* Aquí cambiaremos el encabezado */}
                            <th className="p-2 border">{isPediatric ? "Peso Pediátrico (kg)" : "Peso Adulto (kg)"}</th>
                            <th className="p-2 border">Observaciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRecords.map((record, index) => (
                            <tr key={index} className="text-center">
                                <td className="p-2 border">{format(new Date(record.record_date), "dd/MM/yyyy")}</td>
                                <td className="p-2 border">{record.record_time}</td>
                                {/* Pulso */}
                                <td className={`p-2 border ${isPediatric
                                    ? (record.pulso < 60 ? "bg-[rgb(120,190,230)]" : record.pulso > 90 ? "bg-red-200" : "bg-white")
                                    : (record.pulso < 60 ? "bg-[rgb(120,190,230)]" : record.pulso > 90 ? "bg-red-200" : "bg-white")}`}>
                                    {record.pulso}
                                </td>
                                {/* Temperatura */}
                                <td className={`p-2 border ${isPediatric
                                    ? (record.temperatura < 36.0 ? "bg-[rgb(120,190,230)]" : record.temperatura > 37.9 ? "bg-red-200" : "bg-white")
                                    : (record.temperatura < 36.0 ? "bg-[rgb(120,190,230)]" : record.temperatura > 37.9 ? "bg-red-200" : "bg-white")}`}>
                                    {record.temperatura}
                                </td>
                                {/* Frecuencia respiratoria */}
                                <td className={`p-2 border ${isPediatric
                                    ? (record.frecuencia_respiratoria < 14 ? "bg-[rgb(120,190,230)]" : record.frecuencia_respiratoria > 24 ? "bg-red-200" : "bg-white")
                                    : (record.frecuencia_respiratoria < 16 ? "bg-[rgb(120,190,230)]" : record.frecuencia_respiratoria > 24 ? "bg-red-200" : "bg-white")}`}>
                                    {record.frecuencia_respiratoria}
                                </td>
                                {/* Presión sistólica */}
                                <td className={`p-2 border ${isPediatric
                                    ? (record.presion_sistolica < 86 ? "bg-[rgb(120,190,230)]" : record.presion_sistolica > 120 ? "bg-red-200" : "bg-white")
                                    : (record.presion_sistolica < 100 ? "bg-[rgb(120,190,230)]" : record.presion_sistolica > 140 ? "bg-red-200" : "bg-white")}`}>
                                    {record.presion_sistolica}
                                </td>
                                {/* Presión diastólica */}
                                <td className={`p-2 border ${isPediatric
                                    ? (record.presion_diastolica < 60 ? "bg-[rgb(120,190,230)]" : record.presion_diastolica > 85 ? "bg-red-200" : "bg-white")
                                    : (record.presion_diastolica < 60 ? "bg-[rgb(120,190,230)]" : record.presion_diastolica > 100 ? "bg-red-200" : "bg-white")}`}>
                                    {record.presion_diastolica}
                                </td>
                                {/* Presión media */}
                                <td className={`p-2 border ${isPediatric
                                    ? (record.presion_media < 60 ? "bg-[rgb(120,190,230)]" : record.presion_media > 80 ? "bg-red-200" : "bg-white")
                                    : (record.presion_media < 70 ? "bg-[rgb(120,190,230)]" : record.presion_media > 83 ? "bg-red-200" : "bg-white")}`}>
                                    {record.presion_media}
                                </td>
                                {/* Saturación de oxígeno */}
                                <td className={`p-2 border ${record.saturacion_oxigeno < 95 ? "bg-[rgb(120,190,230)]" : record.saturacion_oxigeno > 100 ? "bg-red-200" : "bg-white"}`}>
                                    {record.saturacion_oxigeno}
                                </td>
                                {/* Mostrar peso dependiendo de si es pediátrico o adulto */}
                                <td className="p-2 border">
                                    {isPediatric ? record.peso_pediatrico : record.peso_adulto}
                                </td>
                                {/* Observaciones */}
                                <td className="p-2 border">{record.observaciones || "-"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* Botones de acción */}
                <div className="flex justify-between w-full max-w-4xl mt-4"> {/* Añadí mt-4 para mayor separación */}
                    <button
                        onClick={handleNewRecord}
                        className={`flex items-center px-4 py-2 ${patientInfo.status !== "activo" ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"} text-white rounded transition flex items-center`}
                    >
                        <FiPlusCircle className="mr-2" /> Agregar Registro
                    </button>
                    <button onClick={handleExportPDF} className="flex items-center px-4 py-2 bg-green-500 text-white font-bold rounded hover:bg-green-600 transition">
                        <FiDownload className="mr-2" /> Exportar como PDF
                    </button>
                    <button onClick={handleGoBack} className="flex items-center px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition">
                        <FiHome className="mr-2" /> Regresar
                    </button>
                </div>
            </div>
            {/* Gráfico de Signos Vitales */}
            <div className="bg-white p-4 rounded shadow-lg w-full max-w-4xl mb-6" ref={chartRef}>
                <h3 className="font-bold mb-4">Gráfico de Signos Vitales</h3>
                <VitalSignsChart records={filteredRecords} selectedVariables={selectedVariables} />
            </div>
        </div>
    );

};

export default PatientRecordHistory;
