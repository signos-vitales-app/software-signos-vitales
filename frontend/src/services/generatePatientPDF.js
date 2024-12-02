import jsPDF from "jspdf";

export const generatePatientPDF = (history, vitalSigns) => {
    const doc = new jsPDF("l", "mm", "a4");

    // Título del documento
    doc.setFontSize(16);
    doc.text("Historial del Paciente y Signos Vitales", 10, 10);

    // Historial del paciente
    if (history.length > 0) {
        doc.setFontSize(14);
        doc.text("Historial del Paciente", 10, 20);

        // Tabla del historial del paciente
        const patientHeaders = [
            "Fecha", "Hora", "Responsable", "Primer nombre", "Segundo nombre","Primer spellido" ,"Segundo apellido","Tipo identificacion", "Numero de identificacion", "Ubicación", "Fecha de nacimiento", "Estado", "Grupo Edad"
        ];

        const patientData = history.map((record, index) => {
            const nextRecord = history[index + 1] || {};
            return [
                new Date(record.created_at).toLocaleDateString(),
                new Date(record.created_at).toLocaleTimeString(),
                record.responsable_registro,
                record.primer_nombre,
                record.segundo_nombre || "",
                record.primer_apellido,
                record.segundo_apellido || "",
                record.tipo_identificacion,
                record.numero_identificacion,
                record.ubicacion,
                new Date(record.fecha_nacimiento).toLocaleDateString(),
                record.status,
                record.age_group
            ];
        });

        doc.autoTable({
            head: [patientHeaders],
            body: patientData,
            startY: 25,
            didParseCell: (data) => {
                const { row, column } = data;
                const currentRecord = history[row.index];
                const nextRecord = history[row.index + 1] || {};

                const fieldsToCheck = [
                    'responsable_registro', 'primer_nombre', 'segundo_nombre', 'primer_apellido', 'segundo_apellido',
                    'tipo_identificacion', 'numero_identificacion', 'ubicacion', 'fecha_nacimiento','status','age_group'
                ];

                fieldsToCheck.forEach((field, index) => {
                    if (currentRecord[field] !== nextRecord[field]) {
                        if (data.column.index === index) {
                            data.cell.styles.fillColor = [0, 255, 0]; // Verde para resaltar el cambio
                        }
                    }
                });
            }
        });
    }

    // Historial de signos vitales
    if (vitalSigns.length > 0) {
        const startY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 25;

        doc.setFontSize(14);
        doc.text("Historial de Signos Vitales", 10, startY);

        const vitalSignsHeaders = [
            "Id del registro", "Fecha", "Hora", "Pulso", "Temperatura", "FR", "TAS", "TAD", "TAM", "SatO2", "Peso", "Talla", "Observaciones", "Responsable"
        ];

        const vitalSignsData = vitalSigns.map((currentRecord, index) => {
            const prevRecord = index > 0 ? vitalSigns[index - 1] : null;
            return [
                currentRecord.id_registro,
                new Date(currentRecord.created_at).toLocaleDateString(),
                new Date(currentRecord.created_at).toLocaleTimeString(),
                currentRecord.pulso,
                currentRecord.temperatura,
                currentRecord.frecuencia_respiratoria,
                currentRecord.presion_sistolica,
                currentRecord.presion_diastolica,
                currentRecord.presion_media,
                currentRecord.saturacion_oxigeno,
                currentRecord.peso_aulto || currentRecord.peso_pediatrico,
                currentRecord.talla,
                currentRecord.observaciones,
                currentRecord.responsable_signos
            ];
        });

        doc.autoTable({
            head: [vitalSignsHeaders],
            body: vitalSignsData,
            startY: startY + 10,
            didParseCell: (data) => {
                const { row, column } = data;
                const currentRecord = vitalSigns[row.index];
                const prevRecord = row.index > 0 ? vitalSigns[row.index - 1] : null;

                const fieldsToCheck = [
                    'pulso', 'temperatura', 'frecuencia_respiratoria', 'presion_sistolica', 'presion_diastolica', 'presion_media',
                    'saturacion_oxigeno', 'peso_aulto', 'peso_pediatrico', 'talla', 'observaciones', 'responsable_signos'
                ];

                fieldsToCheck.forEach((field, index) => {
                    if (prevRecord && currentRecord[field] !== prevRecord[field]) {
                        if (data.column.index === index) {
                            data.cell.styles.fillColor = [0, 255, 0]; // Verde para resaltar el cambio
                        }
                    }
                });
            }
        });
    }

    // Guardar el PDF
    doc.save("Patient_History.pdf");
};
