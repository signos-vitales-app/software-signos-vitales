import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from "react-toastify";

const generatePDF = async (patientInfo, edad, ageUnit, ageGroup, filteredRecords, chartRef) => {
    try {
        // Crear un nuevo documento PDF
        const doc = new jsPDF();

        // Función para formatear la fecha (solo día, mes, año)
        const formatDate = (dateString) => {
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript comienzan desde 0
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;  // Devuelve la fecha en formato DD/MM/YYYY
        };

        // Título del documento con un estilo más elegante
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.text('Historial Médico del Paciente', 20, 20);

        // Información del paciente con formato más atractivo
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.text(`Nombre: ${patientInfo.primer_nombre} ${patientInfo.segundo_nombre} ${patientInfo.primer_apellido} ${patientInfo.segundo_apellido}`, 20, 30);
        doc.text(`Edad: ${edad} ${ageUnit}`, 20, 35);
        doc.text(`Tipo de Paciente: ${ageGroup}`, 20, 40);
        doc.text(`Número de Identificación: ${patientInfo.numero_identificacion}`, 20, 45);
        doc.text(`Ubicación: ${patientInfo.ubicacion}`, 20, 50);
        doc.text(`Estado: ${patientInfo.status === 'activo' ? 'Activo' : 'Inactivo'}`, 20, 55);

        // Línea divisoria estilizada
        doc.setLineWidth(0.7);
        doc.setDrawColor(0, 153, 255); // Color azul para la línea
        doc.line(20, 60, 190, 60);  // Línea divisoria

        // Título de la sección de signos vitales con color y mayor tamaño
        doc.setFontSize(14);
        doc.setTextColor(0, 102, 204); // Color azul
        doc.text('Signos Vitales:', 20, 70);

        // Crear la tabla de signos vitales con colores alternos y bordes suaves
        const tableColumns = ["Fecha", "Hora", "Pulso", "T °C", "FR", "TAS ", "TAD ", "TAM ", "SatO2 (%)", "Peso", "Observaciones"];
        const tableData = filteredRecords.map(record => [
            formatDate(record.record_date),  // Usar la función formatDate para formatear la fecha
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
            startY: 75,
            margin: { horizontal: 20 },
            theme: 'grid',
            headStyles: {
                fillColor: [0, 102, 204], // Azul para los encabezados
                textColor: [255, 255, 255], // Blanco para el texto
                fontStyle: 'bold',
            },
            alternateRowStyles: {
                fillColor: [240, 240, 240], // Color gris suave para filas alternas
            },
            styles: {
                fontSize: 10,
                lineColor: [200, 200, 200],
                lineWidth: 0.5,
            }
        });

        // Espaciado entre la tabla y los gráficos
        doc.addPage();

        // Ajuste de gráficos con márgenes adecuados y espacios
        let yPosition = 20;
        const margin = 10;  // Márgenes
        const maxGraphicsPerPage = 2;  // Número de gráficos por página
        let graphicsOnCurrentPage = 0;

        // Iterar sobre todos los gráficos y agregarlos al PDF
        const canvasElements = chartRef.current.querySelectorAll("canvas");
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
