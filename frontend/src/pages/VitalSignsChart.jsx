import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { format } from 'date-fns';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const VitalSignsChart = ({ records, selectedVariables }) => {
    const getLabels = () => {
        return records.map((record, index) => {
            console.log(`Registro ${index + 1}:`); // Identificar registros
            console.log('record_date:', record.record_date); 
            console.log('record_time:', record.record_time);
    
            if (record.record_date && record.record_time) {
                // Extraer solo la fecha (YYYY-MM-DD) de record_date
                const datePart = record.record_date.split('T')[0]; 
                const dateTimeString = `${datePart}T${record.record_time}`;
                console.log('dateTimeString:', dateTimeString); // Ver cadena combinada
    
                const dateTime = new Date(dateTimeString);
    
                if (!isNaN(dateTime)) {
                    console.log('dateTime válido:', dateTime);
                    return format(dateTime, 'dd/MM/yyyy HH:mm:ss');
                } else {
                    console.warn(`Fecha inválida: ${dateTimeString}`);
                    return 'Fecha inválida';
                }
            } else {
                console.warn('record_date o record_time faltante:', record);
                return 'Fecha/Hora no disponible';
            }
        });
    };
    
    
    
    const createDataset = (label, dataKey, color) => ({
        label,
        data: records.map(record => record[dataKey]),
        borderColor: color,
        backgroundColor: color,
        tension: 0.2,
        fill: false,
    });

    const colors = {
        pulso: 'rgb(255, 15, 15)', 
        temperatura: 'rgb(250, 147, 23)',
        frecuencia_respiratoria: 'rgb(25, 204, 31)',
        presion_sistolica: 'rgb(153, 102, 255)',
        presion_diastolica: 'rgb(204, 25, 163)',
        saturacion_oxigeno: 'rgb(53, 154, 255)',
    };

    const data = {
        labels: getLabels(),
        datasets: selectedVariables.map(variable =>
            createDataset(variable, variable, colors[variable])
        ),
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Signos Vitales del Paciente' },
        },
        scales: {
            x: { title: { display: true, text: 'Fecha' } },
            y: { title: { display: true, text: 'Valor' }, beginAtZero: true },
        },
    };

    // "pulso" 
    const pulsoData = {
        labels: getLabels(),
        datasets: [
            createDataset('Pulso', 'pulso', colors.pulso), 
        ],
    };

    const pulsoOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Pulso del Paciente' },
        },
        scales: {
            x: { title: { display: true, text: 'Fecha' } },
            y: { title: { display: true, text: 'Valor' }, beginAtZero: true },
        },
    };

    // "FR" 
    const frecuencia_respiratoriaData = {
        labels: getLabels(),
        datasets: [
            createDataset('Frecuencia Respiratoria', 'frecuencia_respiratoria', colors.frecuencia_respiratoria), 
        ],
    };

    const frecuencia_respiratoriaOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Frecuencia Respiratoria' },
        },
        scales: {
            x: { title: { display: true, text: 'Fecha' } },
            y: { title: { display: true, text: 'Valor' }, beginAtZero: true },
        },
    };

        // "systolic Pressure" 
    const presion_sistolicaData = {
        labels: getLabels(),
        datasets: [
            createDataset('Presion sistolica', 'presion_sistolica', colors.presion_sistolica), 
        ],
    };
    
    const presion_sistolicaOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Presion sistolica del Paciente' },
        },
        scales: {
            x: { title: { display: true, text: 'Fecha' } },
            y: { title: { display: true, text: 'Valor' }, beginAtZero: true },
        },
    };
        // "Diastolic Pressure" 
        const presion_diastolicaData = {
            labels: getLabels(),
            datasets: [
                createDataset('Presion diastolica', 'presion_diastolica', colors.presion_diastolica), 
            ],
        };
        
        const presion_diastolicaOptions = {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Presion diastolica del Paciente' },
            },
            scales: {
                x: { title: { display: true, text: 'Fecha' } },
                y: { title: { display: true, text: 'Valor' }, beginAtZero: true },
            },
        };
        

     // "temperatura" 
     const temperaturaData = {
        labels: getLabels(),
        datasets: [
            createDataset('Temperatura', 'temperatura', colors.temperatura), 
        ],
    };

    const temperaturaOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Temperatura del Paciente' },
        },
        scales: {
            x: { title: { display: true, text: 'Fecha' } },
            y: { title: { display: true, text: 'Valor' }, beginAtZero: true },
        },
    };
    // "saturacion de oxigeno" 
    const saturacion_oxigenoData = {
        labels: getLabels(),
        datasets: [
            createDataset('Saturacion oxigeno', 'saturacion_oxigeno', colors.saturacion_oxigeno),
        ],
    };

    const saturacion_oxigenoOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Saturacion de oxigeno del Paciente' },
        },
        scales: {
            x: { title: { display: true, text: 'Fecha' } },
            y: { title: { display: true, text: 'Valor' }, beginAtZero: true },
        },
    };

    return (
        <div>
            {/* Gráfico principal de todos los signos vitales */}
            {/*<Line data={data} options={options} />*/}

            {/* Gráfico de "Pulso"  */}
            {selectedVariables.includes('pulso') && (
                <div className="mt-8">
                    <Line data={pulsoData} options={pulsoOptions} />
                </div>
            )}
            {/* Gráfico de "Temperatura"  */}
            {selectedVariables.includes('temperatura') && (
                <div className="mt-8">
                    <Line data={temperaturaData} options={temperaturaOptions} />
                </div>
            )}
            {/* Gráfico de "FR"  */}
            {selectedVariables.includes('frecuencia_respiratoria') && (
                <div className="mt-8">
                    <Line data={frecuencia_respiratoriaData} options={frecuencia_respiratoriaOptions} />
                </div>
            )}
            {/* Gráfico de "PS"  */}
            {selectedVariables.includes('presion_sistolica') && (
                <div className="mt-8">
                    <Line data={presion_sistolicaData} options={presion_sistolicaOptions} />
                </div>
            )}
            {/* Gráfico de "PD"  */}
            {selectedVariables.includes('presion_diastolica') && (
                <div className="mt-8">
                    <Line data={presion_diastolicaData} options={presion_diastolicaOptions} />
                </div>
            )}
             {/* Gráfico de "FR"  */}
             {selectedVariables.includes('saturacion_oxigeno') && (
                <div className="mt-8">
                    <Line data={ saturacion_oxigenoData} options={ saturacion_oxigenoOptions} />
                </div>
            )}

        </div>
    );
};

export default VitalSignsChart;
