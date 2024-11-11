import { useState, useEffect, useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPatientRecords } from "../services/patientService";
import { FiPlusCircle, FiHome, FiFilter, FiDownload } from "react-icons/fi";
import { format } from "date-fns";
import VitalSignsChart from "./VitalSignsChart";
import "jspdf-autotable"; // Importar el complemento para la tabla

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
            setIsPediatric(age < 10);
        } catch (error) {
            console.error("Error fetching patient records", error);
        }
    };






    const handleNewRecord = () => {
        navigate(`/patient/${idPaciente}/add-record`);
    };

    const handleGoBack = () => {
        navigate("/dashboard");
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
        const pdf = new jsPDF("p", "mm", "a4");
        // Agregar el logo al PDF
        const logoUrl = "https://media.sipiapa.org/adjuntos/185/imagenes/001/819/0001819724.jpg";  // O usa un base64
        const logoWidth = 50;  // Ancho del logo en milímetros
        const logoHeight = 25; // Alto del logo en milímetros
        // Título con fuente estilizada
        pdf.addImage(logoUrl, 'PNG', 10, 10, logoWidth, logoHeight);

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(16);
        pdf.text(105, 20, "Historial de Registros del Paciente", { align: "center" });

        // Agregar información del paciente en secciones bien organizadas
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "normal");
        pdf.text(10, 40, `Nombres y apellidos: ${patientInfo.primer_nombre} ${patientInfo.primer_apellido}`);
        pdf.text(10, 45, `Tipo de identificación: ${patientInfo.tipo_identificacion}`);
        pdf.text(10, 50, `Número de identificación: ${patientInfo.numero_identificacion}`);
        pdf.text(10, 55, `Ubicación: ${patientInfo.ubicacion}`);
        pdf.text(10, 60, `Edad: ${fechaNacimiento} años`);
        pdf.text(10, 65, `Estado: ${patientInfo.status === "activo" ? "Activo" : "Inactivo"}`);

        // Prepara los datos de la tabla
        const tableData = filteredRecords.map(record => {
            const getCellStyle = (value, min, max) => {
                // Si el valor está fuera del rango, aplica un fondo rojo
                return value < min || value > max ? { fillColor: [255, 99, 71] } : {};  // Rojo
            };

            return [
                { content: format(new Date(record.record_date), "dd/MM/yyyy"), styles: {} },
                { content: record.record_time, styles: {} },
                { content: record.pulso, styles: getCellStyle(record.pulso, 60, 90) },
                { content: record.temperatura, styles: getCellStyle(record.temperatura, 36.0, 37.9) },
                { content: record.frecuencia_respiratoria, styles: getCellStyle(record.frecuencia_respiratoria, 16, 24) },
                { content: record.presion_sistolica, styles: getCellStyle(record.presion_sistolica, 60, 100) },
                { content: record.presion_diastolica, styles: getCellStyle(record.presion_diastolica, 90, 140) },
                { content: record.presion_media, styles: getCellStyle(record.presion_media, 70, 83) },
                { content: record.saturacion_oxigeno, styles: getCellStyle(record.saturacion_oxigeno, 95, 100) },
                { content: isPediatric ? record.peso_pediatrico : record.peso_adulto, styles: {} },
                { content: record.observaciones || "-", styles: {} }
            ];
        });

        // Tabla con autoTable estilizada
        pdf.autoTable({
            head: [["Fecha", "Hora", "Pulso", "T°C", "FR", "TAD", "TAS", "TAM", "SatO2", "Peso", "Observaciones"]],
            body: tableData,
            startY: 70,
            theme: 'striped',
            headStyles: { fillColor: [54, 162, 235], textColor: 255, fontSize: 11 },
            bodyStyles: { textColor: 50, fontSize: 10, fillColor: [245, 245, 245] },
            alternateRowStyles: { fillColor: [255, 255, 255] },
        });
        // Captura del gráfico de signos vitales
        const chartCanvas = chartRef.current; // Referencia del gráfico de signos vitales
        if (chartCanvas) {
            // Captura el gráfico como una imagen con html2canvas
            const chartImage = await html2canvas(chartCanvas);
            const chartDataURL = chartImage.toDataURL("image/png");

            // Obtener el tamaño de la página del PDF
            const pageWidth = pdf.internal.pageSize.width; // Ancho de la página
            const pageHeight = pdf.internal.pageSize.height; // Altura de la página
            const margin = 10; // Margen
            const maxWidth = pageWidth - 2 * margin; // Ancho máximo del gráfico (menos los márgenes)
            const maxHeight = pageHeight - 2 * margin; // Altura máxima del gráfico (menos los márgenes)

            // Calcular la relación de aspecto del gráfico
            const aspectRatio = chartImage.height / chartImage.width;

            // Ajuste automático del tamaño para que encaje en la página sin cortar
            let chartWidth = maxWidth;
            let chartHeight = chartWidth * aspectRatio;

            // Verificar si la altura del gráfico excede la altura de la página
            if (chartHeight > maxHeight) {
                chartHeight = maxHeight;
                chartWidth = chartHeight / aspectRatio;
            }

            // Agregar una nueva página al PDF
            pdf.addPage();

            // Agregar el texto de título al PDF
            pdf.setFontSize(12);
            pdf.text(10, 10, "Gráfico de Signos Vitales:");

            // Agregar el gráfico al PDF
            pdf.addImage(chartDataURL, "PNG", margin, 20, chartWidth, chartHeight); // Ajuste del gráfico con tamaño automático
        }

        // Guardar el PDF
        pdf.save("Patient_Record_History.pdf");
    };




    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6 overflow-auto">
            <h1 className="text-2xl font-bold mb-6">Registro del Paciente</h1>
            <div className="bg-white p-4 rounded shadow-lg w-full max-w-4xl mb-6 overflow-x-auto" ref={tableRef}>
                {/* Información del paciente */}
                <div className="flex justify-between mb-4">
                    <div>

                        <p><strong>Nombre:</strong> {patientInfo.primer_nombre} {patientInfo.primer_apellido}</p>
                        <p><strong>Tipo de identificación:</strong> {patientInfo.tipo_identificacion}</p>
                        <p><strong>Número de identificación:</strong> {patientInfo.numero_identificacion}</p>
                        <p><strong>Ubicación:</strong> {patientInfo.ubicacion}</p>
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
                                        className="mr-2"
                                    />
                                    {variable}
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
                            <th className="p-2 border">TAD (mmHg)</th>
                            <th className="p-2 border">TAS (mmHg)</th>
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
                                <td className={`p-2 border ${record.pulso < 60 || record.pulso > 90 ? "bg-red-200" : ""}`}>{record.pulso}</td>
                                <td className={`p-2 border ${record.temperatura < 36.0 || record.temperatura > 37.9 ? "bg-red-200" : ""}`}>{record.temperatura}</td>
                                <td className={`p-2 border ${record.frecuencia_respiratoria < 16 || record.frecuencia_respiratoria > 24 ? "bg-red-200" : ""}`}>{record.frecuencia_respiratoria}</td>
                                <td className={`p-2 border ${record.presion_sistolica < 60 || record.presion_sistolica > 100 ? "bg-red-200" : ""}`}>{record.presion_sistolica}</td>
                                <td className={`p-2 border ${record.presion_diastolica < 90 || record.presion_diastolica > 140 ? "bg-red-200" : ""}`}>{record.presion_diastolica}</td>
                                <td className={`p-2 border ${record.presion_media < 70 || record.presion_media > 83 ? "bg-red-200" : ""}`}>{record.presion_media}</td>
                                <td className={`p-2 border ${record.saturacion_oxigeno < 95 ? "bg-red-200" : ""}`}>{record.saturacion_oxigeno}</td>
                                {/* Mostrar peso dependiendo de si es pediátrico o adulto */}
                                <td className="p-2 border">
                                    {isPediatric ? record.peso_pediatrico : record.peso_adulto}
                                </td>
                                <td className="p-2 border">{record.observaciones || "-"}</td>
                            </tr>

                        ))}
                    </tbody>
                </table>
            </div>

            {/* Gráfico de Signos Vitales */}
            <div className="bg-white p-4 rounded shadow-lg w-full max-w-4xl mb-6" ref={chartRef}>
                <h3 className="font-bold mb-4">Gráfico de Signos Vitales</h3>
                <VitalSignsChart records={filteredRecords} selectedVariables={selectedVariables} />
            </div>

            {/* Botones de acción */}
            <div className="flex justify-between w-full max-w-4xl">
                <button onClick={handleNewRecord} className="flex items-center px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition">
                    <FiPlusCircle className="mr-2" /> Nuevo registro
                </button>
                <button onClick={handleExportPDF} className="flex items-center px-4 py-2 bg-green-500 text-white font-bold rounded hover:bg-green-600 transition">
                    <FiDownload className="mr-2" /> Exportar como PDF
                </button>
                <button onClick={handleGoBack} className="flex items-center px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition">
                    <FiHome className="mr-2" /> Regresar
                </button>
            </div>
        </div>
    );
};

export default PatientRecordHistory;
