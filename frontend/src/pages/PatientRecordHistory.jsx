import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPatientRecords } from "../services/patientService";
import { FiPlusCircle, FiHome, FiFilter, FiDownload, FiEdit } from "react-icons/fi";
import { MdOutlinePublishedWithChanges } from "react-icons/md";
import { format } from "date-fns";
import VitalSignsChart from "./VitalSignsChart";
import "jspdf-autotable"; // Importar el complemento para la tabla
import 'react-toastify/dist/ReactToastify.css';
import { toast } from "react-toastify";
import generatePDF from "../services/generatePDF";
import { getUserInfo } from '../services/authService';

const PatientRecordHistory = () => {
    //Datos del paciente
    const { idPaciente } = useParams();
    const navigate = useNavigate();
    const [records, setRecords] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [patientInfo, setPatientInfo] = useState({});
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectedVariables, setSelectedVariables] = useState(["pulso", "temperatura", "frecuencia_respiratoria", "presion_sistolica", "presion_diastolica", "saturacion_oxigeno"
    ]);
    const [edad, setEdad] = useState(null);
    const [ageUnit, setAgeUnit] = useState(""); // Unidad de edad: años o meses
    const [ageGroup, setAgeGroup] = useState(""); // Tipo de paciente
    const [loading, setLoading] = useState(true);
    //Tabla y grafico de signos
    const tableRef = useRef(null);
    const chartRef = useRef(null);
    //Solo permitir el rol del jefe 
    const role = localStorage.getItem('role');
    useEffect(() => {
        loadPatientRecords();
    }, []); // Se ejecuta una sola vez cuando la página se carga

    // Función para calcular la edad en años
    const calculateAge = (date) => {
        if (!date) return null;
        const birth = new Date(date);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    // Función para calcular la edad en meses
    const calculateAgeInMonths = (date) => {
        if (!date) return null;
        const birth = new Date(date);
        const today = new Date();
        const ageInMonths =
            (today.getFullYear() - birth.getFullYear()) * 12 +
            (today.getMonth() - birth.getMonth()) -
            (today.getDate() < birth.getDate() ? 1 : 0);
        return ageInMonths;
    };

    // Función para calcular el grupo de edad
    const calculateAgeGroup = (fechaNacimiento) => {
        const birth = new Date(fechaNacimiento);
        const today = new Date();
        const ageInMonths =
            (today.getFullYear() - birth.getFullYear()) * 12 +
            (today.getMonth() - birth.getMonth()) -
            (today.getDate() < birth.getDate() ? 1 : 0);

        if (ageInMonths >= 0 && ageInMonths <= 3) return 'Recién nacido';
        if (ageInMonths > 3 && ageInMonths <= 6) return 'Lactante temprano';
        if (ageInMonths > 6 && ageInMonths <= 12) return 'Lactante mayor';
        if (ageInMonths > 12 && ageInMonths <= 36) return 'Niño pequeño';
        if (ageInMonths > 36 && ageInMonths <= 72) return 'Preescolar temprano';
        if (ageInMonths > 72 && ageInMonths <= 180) return 'Preescolar tardío';
        return 'Adulto';
    };

    // Maneja el cambio de la fecha de nacimiento
    const handleFechaNacimientoChange = (date) => {
        const ageInYears = calculateAge(date);
        const ageInMonths = calculateAgeInMonths(date);

        if (ageInYears >= 1) {
            setEdad(ageInYears);
            setAgeUnit("años");
        } else {
            setEdad(ageInMonths);
            setAgeUnit("meses");
        }

        // Calcular el grupo de edad
        const group = calculateAgeGroup(date);
        setAgeGroup(group);
    };
    // Cargar los registros del paciente

    const loadPatientRecords = async () => {
        try {
            const response = await fetchPatientRecords(idPaciente);
            let records = response.data.records;

            // Ordenar los registros por fecha y hora
            records = records.sort((a, b) => {
                const dateA = new Date(a.record_date);
                const dateB = new Date(b.record_date);

                if (dateA.getTime() === dateB.getTime()) {
                    const timeA = a.record_time.split(':');
                    const timeB = b.record_time.split(':');

                    const minutesA = parseInt(timeA[0]) * 60 + parseInt(timeA[1]);
                    const minutesB = parseInt(timeB[0]) * 60 + parseInt(timeB[1]);
                    return minutesA - minutesB;
                }

                return dateA - dateB;
            });

            setRecords(records);
            setFilteredRecords(records);
            const patient = response.data.patient;
            setPatientInfo(patient);

            // Calcular la edad y el grupo de edad
            handleFechaNacimientoChange(patient.fecha_nacimiento);

            setLoading(false);
        } catch (error) {
            console.error("Error al recuperar registros de pacientes", error);
            setLoading(false);
        }
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

    // Etiquetas amigables para las variables
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

    // Rango de signos vitales por grupo de edad
    const vitalSignRanges = {
        pulso: {
            'Recién nacido': { min: 90, max: 180 },
            'Lactante temprano': { min: 80, max: 160 },
            'Lactante mayor': { min: 80, max: 140 },
            'Niño pequeño': { min: 75, max: 110 },
            'Preescolar temprano': { min: 70, max: 110 },
            'Preescolar tardío': { min: 60, max: 90 },
            'Adulto': { min: 60, max: 90 },
        },
        temperatura: {
            'Recién nacido': { min: 36.0, max: 37.5 },
            'Lactante temprano': { min: 36.0, max: 37.5 },
            'Lactante mayor': { min: 36.0, max: 37.5 },
            'Niño pequeño': { min: 36.0, max: 37.5 },
            'Preescolar temprano': { min: 36.0, max: 37.5 },
            'Preescolar tardío': { min: 36.0, max: 37.5 },
            'Adulto': { min: 36.5, max: 37.5 },
        },
        frecuencia_respiratoria: {
            'Recién nacido': { min: 30, max: 60 },
            'Lactante temprano': { min: 30, max: 60 },
            'Lactante mayor': { min: 24, max: 40 },
            'Niño pequeño': { min: 20, max: 30 },
            'Preescolar temprano': { min: 20, max: 30 },
            'Preescolar tardío': { min: 16, max: 24 },
            'Adulto': { min: 12, max: 16 },
        },
        presion_sistolica: {
            'Recién nacido': { min: 60, max: 90 },
            'Lactante temprano': { min: 80, max: 100 },
            'Lactante mayor': { min: 90, max: 110 },
            'Niño pequeño': { min: 95, max: 110 },
            'Preescolar temprano': { min: 100, max: 120 },
            'Preescolar tardío': { min: 105, max: 120 },
            'Adulto': { min: 100, max: 140 },
        },
        presion_diastolica: {
            'Recién nacido': { min: 30, max: 60 },
            'Lactante temprano': { min: 50, max: 70 },
            'Lactante mayor': { min: 55, max: 75 },
            'Niño pequeño': { min: 60, max: 75 },
            'Preescolar temprano': { min: 65, max: 80 },
            'Preescolar tardío': { min: 70, max: 85 },
            'Adulto': { min: 60, max: 90 },
        },
        saturacion_oxigeno: {
            'Recién nacido': { min: 95, max: 100 },
            'Lactante temprano': { min: 95, max: 100 },
            'Lactante mayor': { min: 95, max: 100 },
            'Niño pequeño': { min: 95, max: 100 },
            'Preescolar temprano': { min: 95, max: 100 },
            'Preescolar tardío': { min: 95, max: 100 },
            'Adulto': { min: 95, max: 100 },
        },
        presion_media: {
            'Recién nacido': { min: 50, max: 70 },
            'Lactante temprano': { min: 60, max: 85 },
            'Lactante mayor': { min: 70, max: 95 },
            'Niño pequeño': { min: 75, max: 100 },
            'Preescolar temprano': { min: 80, max: 105 },
            'Preescolar tardío': { min: 85, max: 110 },
            'Adulto': { min: 70, max: 105 },
        },
    };

    const handleExportPDF = async () => {
        if (!chartRef.current) {
            console.error("El chartRef no está asignado correctamente.");
            return;
        }
        try {
            await generatePDF(patientInfo, edad, ageUnit, ageGroup, filteredRecords, chartRef.current, chartRef, role);
        } catch (error) {
            console.error("Error al generar el PDF", error);
        }
    };

    // Función para obtener el fondo basado en el valor y el grupo de edad
    const getVitalSignBackground = (ageGroup, vitalSign, value) => {
        const range = vitalSignRanges[vitalSign][ageGroup];
        if (!range) return 'bg-white'; // Si no hay rango definido, se deja en blanco por defecto

        if (value < range.min) return 'bg-[rgb(120,190,230)]'; // Azul si el valor es bajo
        if (value > range.max) return 'bg-red-200'; // Rojo si el valor es alto
        return 'bg-white'; // Blanco si el valor está dentro del rango normal
    };

    const handleRedirect = () => {
        navigate(`/patient-history/${idPaciente}`); // Incluye el idPaciente en la ruta
    };
    const handleEditRecord = (idRegistro) => {
        navigate(`/patient/${idPaciente}/edit-record/${idRegistro}`);
    };
    if (loading) {
        return <div className="flex justify-center items-center h-screen">Cargando...</div>;
    }
    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6 overflow-auto">
            <h1 className="text-2xl font-bold mb-6">Registro del Paciente</h1>
            <div className="bg-white p-4 rounded shadow-lg w-full max-w-7xl mb-6 overflow-x-auto" ref={tableRef}>
                {/* Información del paciente */}
                <div className="flex justify-between mb-4">

                    <div>
                        <p><strong>Nombre:</strong> {patientInfo.primer_nombre} {patientInfo.segundo_nombre} {patientInfo.primer_apellido} {patientInfo.segundo_apellido}</p>
                        <p><strong>Tipo de identificación:</strong> {patientInfo.tipo_identificacion}</p>
                        <p><strong>Número de identificación:</strong> {patientInfo.numero_identificacion}</p>
                        <p><strong>Ubicación (habitación):</strong> {patientInfo.ubicacion}</p>
                        <p><strong>Edad:</strong> {edad} {ageUnit}</p>
                        <p><strong>Tipo de Paciente:</strong> {ageGroup}</p>
                    </div>
                    <span className={`font-bold ${patientInfo.status === "activo" ? "text-green-500" : "text-red-500"}`}>
                        Paciente {patientInfo.status === "activo" ? "Activo" : "Inactivo"}
                    </span>
                </div>

                {/* Filtros */}
                <div className="mb-4">
                    <div className="flex items-center mb-4">
                        <label className="mr-2">Fecha de inicio:</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="p-2 border rounded"
                        />
                        <label className="mx-2">Fecha de fin:</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="p-2 border rounded"
                            
                        />
                        <button
                            onClick={handleFilter}
                            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition flex items-center"
                        >
                            <FiFilter className="mr-2" /> Filtrar
                        </button>
                    </div>


                </div>
                <div>
                    <h3 className="font-bold">Variables para graficar:</h3>
                    <div className="flex space-x-7">
                        {["pulso", "temperatura", "frecuencia_respiratoria", "presion_sistolica", "presion_diastolica", "saturacion_oxigeno"].map(variable => (
                            <label key={variable} className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={selectedVariables.includes(variable)}
                                    onChange={() => toggleVariable(variable)}
                                    className="mr-2"
                                />
                                {variableLabels[variable]}
                            </label>
                        ))}
                    </div>
                </div>
                {/* Tabla de Registros Filtrados */}
                <table className="w-full border-collapse table-auto">
                    <thead>
                        <tr className="bg-blue-100">
                            <th className="p-2 border">Id</th>
                            <th className="p-2 border">Fecha</th>
                            <th className="p-2 border">Hora</th>
                            <th className="p-2 border">Pulso (lpm)</th>
                            <th className="p-2 border">T°C</th>
                            <th className="p-2 border">FR (RPM)</th>
                            <th className="p-2 border">TAS (mmHg)</th>
                            <th className="p-2 border">TAD (mmHg)</th>
                            <th className="p-2 border">TAM (mmHg)</th>
                            <th className="p-2 border">SatO2 (%)</th>
                            {/* Encabezado dinámico para el peso */}
                            <th className="p-2 border">
                                {['Recién nacido', 'Lactante temprano', 'Lactante mayor', 'Niño pequeño', 'Preescolar temprano', 'Preescolar tardío'].includes(ageGroup) ? "Peso Pediátrico (kg)" : "Peso Adulto (kg)"}
                            </th>
                            <th className="p-2 border">Talla (cm) </th>

                            <th className="p-2 border">Observaciones</th>
                            {role === "jefe" && (
                                <th className="p-2 border">Registrado por</th>
                            )}
                            <th className="p-2 border">Editar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRecords.map((record, index) => (
                            <tr key={index} className="text-center">
                                <td className="p-2 border">{record.id}</td>

                                <td className="p-2 border">{format(new Date(record.record_date), "dd/MM/yyyy")}</td>
                                <td className="p-2 border">{record.record_time}</td>
                                <td className={`p-2 border ${getVitalSignBackground(ageGroup, 'pulso', record.pulso)}`}>
                                    {record.pulso}
                                </td>
                                <td className={`p-2 border ${getVitalSignBackground(ageGroup, 'temperatura', record.temperatura)}`}>
                                    {record.temperatura}
                                </td>
                                <td className={`p-2 border ${getVitalSignBackground(ageGroup, 'frecuencia_respiratoria', record.frecuencia_respiratoria)}`}>
                                    {record.frecuencia_respiratoria}
                                </td>
                                <td className={`p-2 border ${getVitalSignBackground(ageGroup, 'presion_sistolica', record.presion_sistolica)}`}>
                                    {record.presion_sistolica}
                                </td>
                                <td className={`p-2 border ${getVitalSignBackground(ageGroup, 'presion_diastolica', record.presion_diastolica)}`}>
                                    {record.presion_diastolica}
                                </td>
                                <td className={`p-2 border ${getVitalSignBackground(ageGroup, 'presion_media', record.presion_media)}`}>
                                    {record.presion_media}
                                </td>

                                <td className={`p-2 border ${getVitalSignBackground(ageGroup, 'saturacion_oxigeno', record.saturacion_oxigeno)}`}>
                                    {record.saturacion_oxigeno}
                                </td>

                                {/* Mostrar peso dependiendo de si es pediátrico o adulto */}
                                <td className="p-2 border">
                                    {['Recién nacido', 'Lactante temprano', 'Lactante mayor', 'Niño pequeño', 'Preescolar temprano', 'Preescolar tardío'].includes(ageGroup) ? record.peso_pediatrico : record.peso_adulto}
                                </td>
                                {/* Observaciones */}
                                <td className="p-2 border">{record.talla || "-"}</td>
                                <td className="p-2 border">{record.observaciones || "-"}</td>
                                {role === "jefe" && (
                                    <td className="p-2 border">{record.responsable_signos || "No disponible"}</td>)}
                                {/* Botón de editar */}
                                <td className="p-2 border">
                                    <button
                                        onClick={() => handleEditRecord(record.id)}
                                        className="flex items-center px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                                    >
                                        <FiEdit className="mr-1" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* Botones de acción */}
                <div className="flex justify-between w-full max-w-7xl mt-4">
                    <button
                        onClick={handleNewRecord}
                        className={`flex items-center px-4 py-2 ${patientInfo.status !== "activo" ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                            } text-white rounded transition`}
                        disabled={patientInfo.status !== "activo"}
                    >
                        <FiPlusCircle className="mr-2" /> Agregar Registro
                    </button>
                    <button
                        onClick={handleExportPDF}
                        className="flex items-center px-4 py-2 bg-green-500 text-white font-bold rounded hover:bg-green-600 transition"
                    >
                        <FiDownload className="mr-2" /> Exportar como PDF
                    </button>

                    {role === "jefe" && (
                        <button
                            onClick={handleRedirect}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                        >
                            <MdOutlinePublishedWithChanges className="inline mr-2" />
                            Ver Historial de Cambios
                        </button>
                    )}
                    <button
                        onClick={handleGoBack}
                        className="flex items-center px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition"
                    >
                        <FiHome className="mr-2" /> Regresar
                    </button>
                </div>
            </div>

            {/* Gráfico de Signos Vitales */}
            <div className="bg-white p-4 rounded shadow-lg w-full max-w-7xl mb-6" ref={chartRef}>

                <VitalSignsChart records={filteredRecords} selectedVariables={selectedVariables} />
            </div>
        </div>
    );
};

export default PatientRecordHistory;
