import React, { useEffect, useState } from "react";
import { fetchPatientHistory, fetchPatientInfo, fetchPatientHistoryRecords } from "../services/patientService";
import { useParams, useNavigate } from "react-router-dom";
import { FiPlusCircle, FiHome, FiFilter, FiDownload, FiEdit } from "react-icons/fi";
import "jspdf-autotable";
import { generatePatientPDF } from "../services/generatePatientPDF";

const PatientHistoryPage = ({ token }) => {
    const [history, setHistory] = useState([]);
    const [filteredHistory, setFilteredHistory] = useState([]); // Estado para el historial filtrado
    const [patientInfo, setPatientInfo] = useState(null);
    const [patientHistory, setPatientHistory] = useState([]);
    const [filteredPatientHistory, setFilteredPatientHistory] = useState([]); // Nuevo estado para tabla filtrada
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedIds, setSelectedIds] = useState(new Set()); // Estado para almacenar IDs seleccionados

    const { idPaciente } = useParams();
    const navigate = useNavigate();
    const role = localStorage.getItem('role');
    // Filtros
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [searchId, setSearchId] = useState("");


    useEffect(() => {
        const loadPatientData = async () => {
            try {
                // Llamadas paralelas
                const [patientDataResponse, historyResponse, vitalSignsResponse] = await Promise.allSettled([
                    fetchPatientInfo(idPaciente),
                    fetchPatientHistory(idPaciente, token),
                    fetchPatientHistoryRecords(idPaciente),
                ]);

                // Manejar respuesta de información del paciente
                if (patientDataResponse.status === "fulfilled") {
                    setPatientInfo(patientDataResponse.value || null);
                }

                // Manejar respuesta del historial del paciente
                if (historyResponse.status === "fulfilled") {
                    setHistory(historyResponse.value?.data || []); // Vacío si no hay datos
                    setFilteredHistory(historyResponse.value?.data || []); // Inicializar el historial filtrado

                } else if (historyResponse.reason?.response?.status === 404) {
                    setHistory([]); // Sin historial (404 no es error crítico)
                } else {
                    throw new Error("Error al obtener el historial del paciente");
                }

                // Manejar respuesta del historial de signos vitales
                if (vitalSignsResponse.status === "fulfilled") {
                    const vitalSignsData = vitalSignsResponse.value || [];
                    setPatientHistory(vitalSignsData);
                    setFilteredPatientHistory(vitalSignsData); // Inicializa el estado de la tabla
                } else if (vitalSignsResponse.reason?.response?.status === 404) {
                    setPatientHistory([]); // Sin signos vitales (404 no es error crítico)
                } else {
                    throw new Error("Error al obtener el historial de signos vitales");
                }
            } catch (err) {
                console.error("Error al cargar los datos del paciente:", err);
                setError("Ocurrió un problema al cargar la información del paciente.");
            } finally {
                setLoading(false);
            }
        };

        loadPatientData();
    }, [idPaciente, token]);


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(); // Solo la fecha (dd/mm/aaaa)
    };

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString(), // Solo la fecha
            time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) // Solo la hora (hh:mm)
        };
    };

    const handleFilterHistory = () => {
        let filtered = history;
        if (startDate) {
            filtered = filtered.filter(record => new Date(record.created_at) >= new Date(startDate));
        }
        if (endDate) {
            filtered = filtered.filter(record => new Date(record.created_at) <= new Date(endDate));
        }
        setFilteredHistory(filtered);
    };

    const handleSearchIdChange = (e) => {
        const value = e.target.value.trim();
        setSearchId(value);

        if (value) {
            // Filtra por ID cuando se ingresa un valor
            setFilteredPatientHistory(patientHistory.filter(record => record.id_registro.toString() === value));
        } else {
            // Muestra todos los registros si se borra el valor
            setFilteredPatientHistory(patientHistory);
        }
    };

    const handleSelectRecord = (id) => {
        setSelectedIds(prevState => {
            const newSelectedIds = new Set(prevState);
            if (newSelectedIds.has(id)) {
                newSelectedIds.delete(id); // Deselecciona
            } else {
                newSelectedIds.add(id); // Selecciona
            }
            return newSelectedIds;
        });
    };

    const handleSelectAllWithId = (id) => {
        setSelectedIds(prevState => {
            const newSelectedIds = new Set(prevState);
            filteredPatientHistory.forEach(record => {
                if (record.id_registro === id) {
                    newSelectedIds.add(id);
                }
            });
            return newSelectedIds;
        });
    };

    const handleGoBack = () => {
        navigate(-1); // Redirige a la página de búsqueda
    };

    const handleGoToPatientPage = () => {
        navigate(`/patient/${idPaciente}`); // Redirige a la página de detalles del paciente
    };

    const isModified = (currentValue, nextValue) => {
        if (nextValue === undefined || nextValue === null) {
            return false;
        }
        const normalizedCurrent = currentValue ? currentValue.toString().trim() : "";
        const normalizedNext = nextValue ? nextValue.toString().trim() : "";
        return normalizedCurrent !== normalizedNext;
    };

    const getChangedClass = (field, currentRecord, prevRecord) => {
        if (prevRecord && currentRecord.id_registro === prevRecord.id_registro) {
            return currentRecord[field] !== prevRecord[field] ? "bg-green-300" : "";
        }
        return ""; // No marcar como cambiado si no son del mismo ID
    };

    const exportPDF = () => {
        const selectedRecords = filteredPatientHistory.filter(record => selectedIds.has(record.id_registro));
        generatePatientPDF(patientInfo, selectedRecords,filteredHistory,filteredPatientHistory,selectedIds); // Generar PDF solo con los seleccionados
    };
    const isPediatric = patientInfo && patientInfo.age_group !== "Adulto";

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6 overflow-auto">
            <h1 className="text-2xl font-bold mb-6">Trazabilidad del paciente </h1>
            {/* Contenedor para capturar en PDF */}
            <div id="pdf-content">
                {/* Filtros para el historial de cambios del paciente */}
                <div className="mb-4">
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="mr-2 p-2 border rounded"
                    />
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="mr-2 p-2 border rounded"
                    />
                    <button onClick={handleFilterHistory} className="p-2 bg-blue-500 text-white rounded">Filtrar por Fecha</button>
                </div>
                {/* Historial del Paciente */}
                <div className="bg-white p-6 rounded shadow-lg w-full max-w-7xl mb-6 overflow-x-auto">
                    <h2 className="text-lg font-bold mb-4">Historial de cambios del paciente</h2>
                    {filteredHistory.length > 0 ? (

                        <table className="w-full border-collapse table-auto text-sm">
                            <thead>
                                <tr className="bg-blue-100 text-left">
                                    <th className="p-3 border-b-2">Fecha de Registro</th>
                                    <th className="p-3 border-b-2">Hora de Registro</th>
                                    <th className="p-3 border-b-2">Primer Nombre</th>
                                    <th className="p-3 border-b-2">Segundo Nombre</th>
                                    <th className="p-3 border-b-2">Primer Apellido</th>
                                    <th className="p-3 border-b-2">Segundo Apellido</th>
                                    <th className="p-3 border-b-2">Tipo de Identificación</th>
                                    <th className="p-3 border-b-2">Número de Identificación</th>
                                    <th className="p-3 border-b-2">Ubicación</th>
                                    <th className="p-3 border-b-2">Fecha de Nacimiento</th>
                                    <th className="p-3 border-b-2">Estado</th>
                                    <th className="p-3 border-b-2">Tipo de paciente</th>
                                    <th className="p-3 border-b-2">Responsable</th>

                                </tr>
                            </thead>
                            <tbody>

                                {filteredHistory.map((record, index) => {
                                    const { date, time } = formatDateTime(record.created_at);
                                    const nextRecord = history[index + 1] || {};
                                    return (
                                        <tr key={index} className={`text-center ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                                            <td className="p-3 border">{date}</td>
                                            <td className="p-3 border">{time}</td>

                                            <td className={`p-3 border ${isModified(record.primer_nombre, nextRecord.primer_nombre) ? "bg-green-300" : ""}`}>{record.primer_nombre}</td>

                                            <td className={`p-3 border ${isModified(record.segundo_nombre, nextRecord.segundo_nombre) ? "bg-green-300" : ""}`}>{record.segundo_nombre}</td>
                                            <td className={`p-3 border ${isModified(record.primer_apellido, nextRecord.primer_apellido) ? "bg-green-300" : ""}`}>{record.primer_apellido}</td>
                                            <td className={`p-3 border ${isModified(record.segundo_apellido, nextRecord.segundo_apellido) ? "bg-green-300" : ""}`}>{record.segundo_apellido}</td>
                                            <td className={`p-3 border ${isModified(record.tipo_identificacion, nextRecord.tipo_identificacion) ? "bg-green-300" : ""}`}>{record.tipo_identificacion}</td>
                                            <td className={`p-3 border ${isModified(record.numero_identificacion, nextRecord.numero_identificacion) ? "bg-green-300" : ""}`}>{record.numero_identificacion}</td>
                                            <td className={`p-3 border ${isModified(record.ubicacion, nextRecord.ubicacion) ? "bg-green-300" : ""}`}>{record.ubicacion}</td>
                                            <td className={`p-3 border ${isModified(record.fecha_nacimiento, nextRecord.fecha_nacimiento) ? "bg-green-300" : ""}`}>{formatDate(record.fecha_nacimiento)}</td>
                                            <td className={`p-3 border font-bold ${record.status === "activo" ? "text-green-500" : "text-red-500"}`}>{record.status}</td>
                                            <td className={`p-3 border ${isModified(record.age_group, nextRecord.age_group) ? "bg-green-300" : ""}`}>{record.age_group}</td>
                                            <td className={`p-3 border ${isModified(record.responsable_registro, nextRecord.responsable_registro) ? "bg-green-300" : ""}`}>{record.responsable_registro}</td>

                                        </tr>
                                    );
                                })}
                            </tbody>

                        </table>
                    ) : (
                        <div className="text-center text-gray-500">No hay registros en el historial del paciente.</div>
                    )}
                </div>
                {/* Filtro por ID */}
                <div className="mb-4">
                    <input
                        type="text"
                        value={searchId}
                        onChange={handleSearchIdChange}
                        placeholder="Buscar por ID de Registro"
                        className="p-2 border rounded w-full max-w-md"
                    />
                </div>
                {/* Signos Vitales */}
                <div className="bg-white p-6 rounded shadow-lg w-full max-w-7xl mb-6 overflow-x-auto">
                    <h2 className="text-lg font-bold mb-4">Historial cambios de Signos Vitales</h2>
                    {filteredPatientHistory.length > 0 ? (

                        <table className="w-full border-collapse table-auto text-sm">
                            <thead>
                                <tr className="bg-blue-100 text-left">
                                    <th className="p-3 border-b-2">Seleccionar</th>
                                    <th className="p-3 border-b-2">Id del registro</th>
                                    <th className="p-3 border-b-2">Fecha</th>
                                    <th className="p-3 border-b-2">Hora</th>
                                    <th className="p-3 border-b-2">Pulso</th>
                                    <th className="p-3 border-b-2">Temperatura</th>
                                    <th className="p-3 border-b-2">FR</th>
                                    <th className="p-3 border-b-2">TAS</th>
                                    <th className="p-3 border-b-2">TAD</th>
                                    <th className="p-3 border-b-2">TAM</th>
                                    <th className="p-3 border-b-2">SatO2</th>
                                    {isPediatric ? (
                                        <th className="p-3 border-b-2">Peso Pediátrico</th>
                                    ) : (
                                        <th className="p-3 border-b-2">Peso Adulto</th>
                                    )}
                                    <th className="p-3 border-b-2">Talla</th>
                                    <th className="p-3 border-b-2">Observaciones</th>
                                    <th className="p-3 border-b-2">Responsable</th>
                                </tr>
                            </thead>
                            <tbody>

                                {filteredPatientHistory.map((currentRecord, index) => {
                                    const prevRecord = index > 0 ? filteredPatientHistory[index - 1] : null;
                                    return (

                                        <tr key={currentRecord.id_registro} className="text-center">
                                            <td className="p-3 border">
                                            <input 
                                                type="checkbox" 
                                                checked={selectedIds.has(currentRecord.id_registro)} 
                                                onChange={() => handleSelectRecord(currentRecord.id_registro)} 
                                            />
                                        </td>
                                            <td className="p-3 border">{currentRecord.id_registro}</td>
                                            <td className="p-3 border">{formatDate(currentRecord.record_date)}</td>
                                            <td className="p-3 border">{currentRecord.record_time}</td>
                                            <td className={`p-3 border ${getChangedClass("pulso", currentRecord, prevRecord)}`}>{currentRecord.pulso}</td>
                                            <td className={`p-3 border ${getChangedClass('temperatura', currentRecord, prevRecord)}`}>{currentRecord.temperatura}</td>
                                            <td className={`p-3 border ${getChangedClass('frecuencia_respiratoria', currentRecord, prevRecord)}`}>{currentRecord.frecuencia_respiratoria}</td>
                                            <td className={`p-3 border ${getChangedClass('presion_sistolica', currentRecord, prevRecord)}`}>{currentRecord.presion_sistolica}</td>
                                            <td className={`p-3 border ${getChangedClass('presion_diastolica', currentRecord, prevRecord)}`}>{currentRecord.presion_diastolica}</td>
                                            <td className={`p-3 border ${getChangedClass('presion_media', currentRecord, prevRecord)}`}>{currentRecord.presion_media}</td>
                                            <td className={`p-3 border ${getChangedClass('saturacion_oxigeno', currentRecord, prevRecord)}`}>{currentRecord.saturacion_oxigeno}</td>
                                            {isPediatric ? (
                                                <td className={`p-3 border ${getChangedClass('peso_pediatrico', currentRecord, prevRecord)}`}>{currentRecord.peso_pediatrico}</td>
                                            ) : (
                                                <td className={`p-3 border ${getChangedClass('peso_adulto', currentRecord, prevRecord)}`}>{currentRecord.peso_adulto}</td>
                                            )}
                                            <td className={`p-3 border ${getChangedClass('talla', currentRecord, prevRecord)}`}>{currentRecord.talla}</td>
                                            <td className={`p-3 border ${getChangedClass('observaciones', currentRecord, prevRecord)}`}>{currentRecord.observaciones}</td>
                                            <td className={`p-3 border ${getChangedClass('responsable_signos', currentRecord, prevRecord)}`}>{currentRecord.responsable_signos}</td>
                                        </tr>
                                    );
                                })}

                            </tbody>
                        </table>
                    ) : (
                        <div className="text-center text-gray-500">No hay registros en el historial de signos vitales.</div>

                    )}
                </div>
{/* Botones de acción */}
<div className="flex justify-center w-full max-w-7xl mt-4 space-x-2">
  <button
    onClick={handleGoBack}
    className="flex items-center px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition"
  >
    <FiHome className="mr-2" /> Regresar
  </button>
  <button
    onClick={exportPDF}
    className="flex items-center px-4 py-2 bg-green-500 text-white font-bold rounded hover:bg-green-600 transition"
  >
    <FiDownload className="mr-2" /> Exportar PDF
  </button>
</div>

            </div>
        </div>
    );
};

export default PatientHistoryPage;