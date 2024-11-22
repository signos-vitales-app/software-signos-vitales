import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from "react-toastify";

const generatePDF = async (patientInfo, edad, ageUnit, ageGroup, filteredRecords, chartRef) => {
    try {
        // Crear un nuevo documento PDF
        const doc = new jsPDF();
        const canvasElements = chartRef.current.querySelectorAll("canvas");

        // Título del documento
        doc.setFontSize(18);
        doc.text('Historial Médico del Paciente', 20, 20);

        // Información del paciente
        doc.setFontSize(12);
        doc.text(`Nombre: ${patientInfo.primer_nombre} ${patientInfo.segundo_nombre} ${patientInfo.primer_apellido} ${patientInfo.segundo_apellido}`, 20, 30);
        doc.text(`Edad: ${edad} ${ageUnit}`, 20, 35);
        doc.text(`Tipo de Paciente: ${ageGroup}`, 20, 40);
        doc.text(`Número de Identificación: ${patientInfo.numero_identificacion}`, 20, 45);
        doc.text(`Ubicación: ${patientInfo.ubicacion}`, 20, 50);
        doc.text(`Estado: ${patientInfo.status === 'activo' ? 'Activo' : 'Inactivo'}`, 20, 55);

        // Espaciado entre la información del paciente y la tabla
        doc.setLineWidth(0.5);
        doc.line(20, 60, 190, 60);  // Línea divisoria
        doc.text('Signos Vitales:', 20, 65);

        // Crear la tabla de signos vitales
        const tableColumns = ["Fecha", "Hora", "Pulso (lpm)", "Temperatura (°C)", "FR (RPM)", "TAS (mmHg)", "TAD (mmHg)", "TAM (mmHg)", "SatO2 (%)", "Peso", "Observaciones"];
        const tableData = filteredRecords.map(record => [
            record.record_date, 
            record.record_time,     
            record.pulso, 
            record.temperatura, 
            record.frecuencia_respiratoria, 
            record.presion_sistolica, 
            record.presion_diastolica, 
            record.presion_media, 
            record.saturacion_oxigeno, 
            record.peso_pediatrico || record.peso_adulto, 
            record.observaciones || "-"
        ]);

        autoTable(doc, {
            head: [tableColumns],
            body: tableData,
            startY: 70,
            margin: { horizontal: 20 },
            theme: 'grid'
        });

        // Espaciado entre la tabla y los gráficos
        doc.addPage();

    // Espaciado antes de los gráficos (puedes ajustar la posición para que no se sobrepongan)
    let yPosition = 20;
    const margin = 10;  // Márgenes
    const maxGraphicsPerPage = 2;  // Número de gráficos por página
    let graphicsOnCurrentPage = 0;

    // Iterar sobre todos los gráficos y agregarlos al PDF
    canvasElements.forEach((canvas, index) => {
        // Si los gráficos no caben en una página, agregamos una nueva página
        if (graphicsOnCurrentPage === maxGraphicsPerPage) {
            doc.addPage();
            yPosition = 20; // Resetea la posición Y al inicio de la nueva página
            graphicsOnCurrentPage = 0;
        }

        // Capturar el gráfico como imagen
        const imgData = canvas.toDataURL("image/png");

        // Ajustar la altura y la posición para los gráficos
        doc.addImage(imgData, "PNG", margin, yPosition, 180, 90);  // Ajusta el tamaño y la posición según sea necesario

        // Actualizar la posición Y para el siguiente gráfico
        yPosition += 110;  // Espacio entre gráficos, puedes ajustar si es necesario
        graphicsOnCurrentPage++;  // Incrementar el contador de gráficos por página
    });

    // Guardar el PDF generado
        doc.save(`Historial_Medico_${patientInfo.numero_identificacion}.pdf`);
    } catch (error) {
        console.error("Error generando el PDF:", error);
        toast.error("Hubo un error al generar el PDF.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }
};

export default generatePDF;
