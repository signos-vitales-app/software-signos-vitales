// generatePDF.js
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { format } from "date-fns";  // Si utilizas date-fns

// Constantes de configuración de PDF
const logoUrl = "https://media.sipiapa.org/adjuntos/185/imagenes/001/819/0001819724.jpg";  // URL o base64 del logo
const logoWidth = 50;  // Ancho del logo en mm
const logoHeight = 25; // Alto del logo en mm

export const generatePDF = async (patientInfo, fechaNacimiento, filteredRecords, isPediatric, chartRef) => {
    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(logoUrl, 'PNG', 10, 10, logoWidth, logoHeight);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    //Titulo 
    pdf.text(105, 20, "Historial de Registros del Paciente", { align: "center" });
//info paciente 
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text(10, 40, "Nombres y apellidos: ");
    pdf.text(10, 45, "Tipo de identificación: ");
    pdf.text(10, 50, "Número de identificación: ");
    pdf.text(10, 55, "Ubicación (habitación): ");
    pdf.text(10, 60, "Edad: ");
    pdf.text(10, 65, "Estado: ");
//info del paciente 
    pdf.setFont("helvetica", "normal");
    pdf.text(55, 40, `${patientInfo.primer_nombre} ${patientInfo.segundo_nombre} ${patientInfo.primer_apellido} ${patientInfo.segundo_apellido}`);
    pdf.text(57, 45, `${patientInfo.tipo_identificacion}`);
    pdf.text(63, 50, `${patientInfo.numero_identificacion}`);
    pdf.text(58, 55, `${patientInfo.ubicacion}`);
    pdf.text(23, 60, `${fechaNacimiento} años`);
    pdf.text(27, 65, `${patientInfo.status === "activo" ? "Activo" : "Inactivo"}`);

    // Datos de la tabla para el PDF con los rangos 
    const tableData = filteredRecords.map(record => {
        const getCellStyle = (value, variable) => {
            const [min, max] = getRange(variable, isPediatric);
            if (value < min) {
                return { fillColor: [120, 190, 230] }; // Azul
            } else if (value > max) {
                return { fillColor: [248, 113, 113] }; // Rojo
            } else {
                return { backgroundColor: 'green', color: 'white' }; // Verde
            }
        };
        return [
            { content: format(new Date(record.record_date), "dd/MM/yyyy"), styles: {} },
            { content: record.record_time, styles: {} },
            { content: record.pulso, styles: getCellStyle(record.pulso, "pulso") },
            { content: record.temperatura, styles: getCellStyle(record.temperatura, "temperatura") },
            { content: record.frecuencia_respiratoria, styles: getCellStyle(record.frecuencia_respiratoria, "frecuencia_respiratoria") },
            { content: record.presion_sistolica, styles: getCellStyle(record.presion_sistolica, "presion_sistolica") },
            { content: record.presion_diastolica, styles: getCellStyle(record.presion_diastolica, "presion_diastolica") },
            { content: record.presion_media, styles: getCellStyle(record.presion_media, "presion_media") },
            { content: record.saturacion_oxigeno, styles: getCellStyle(record.saturacion_oxigeno, "saturacion_oxigeno") },
            { content: isPediatric ? record.peso_pediatrico : record.peso_adulto, styles: {} },
            { content: record.observaciones || "-", styles: {} }
        ];
    });
//tabla automatica con los datos anteriores
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

pdf.save(`Historia_Registro_Paciente_${patientInfo.numero_identificacion}.pdf`);
};

// Función para obtener el rango para una variable seleccionada
const getRange = (variable, isPediatric) => {
    const ranges = {
        pulso: { adulto: [60, 90], pediatrico: [60, 90] },
        frecuencia_respiratoria: { adulto: [16, 24], pediatrico: [14, 24] },
        presion_sistolica: { adulto: [100, 140], pediatrico: [86, 120] },
        presion_diastolica: { adulto: [60, 100], pediatrico: [60, 85] },
        presion_media: { adulto: [70, 83], pediatrico: [60, 80] },
        saturacion_oxigeno: { adulto: [95, 100], pediatrico: [95, 100] },
        temperatura: { adulto: [36.0, 37.9], pediatrico: [36.5, 37.9] }
    };
    return isPediatric ? ranges[variable].pediatrico : ranges[variable].adulto;
};

export default generatePDF;
