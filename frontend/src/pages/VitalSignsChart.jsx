import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const VitalSignsChart = ({ records, selectedVariables }) => {
    const getLabels = () => {
        return records.map(record => {
            const date = new Date(record.record_date); // Asegúrate de que record_date sea una fecha válida
            return date.toLocaleString(); // Esto devolverá una cadena con fecha y hora
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
        pulse: 'rgb(255, 132, 132)', 
        temperature: 'rgb(54, 162, 235)',
        respiratory_rate: 'rgb(255, 132, 132)',
        systolic_pressure: 'rgb(153, 102, 255)',
        diastolic_pressure: 'rgb(255, 159, 64)',
        oxygen_saturation: 'rgb(201, 203, 207)',
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
    const pulseData = {
        labels: getLabels(),
        datasets: [
            createDataset('Pulso', 'pulse', colors.pulse), 
        ],
    };

    const pulseOptions = {
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
    const respiratory_rateData = {
        labels: getLabels(),
        datasets: [
            createDataset('Frecuencia Respiratoria', 'respiratory_rate', colors.respiratory_rate), 
        ],
    };

    const respiratory_rateOptions = {
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
    const systolic_pressureData = {
        labels: getLabels(),
        datasets: [
            createDataset('Presion sistolica', 'systolic_pressure', colors.systolic_pressure), 
        ],
    };
    
    const systolic_pressureOptions = {
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
        const diastolic_pressureData = {
            labels: getLabels(),
            datasets: [
                createDataset('Presion diastolica', 'diastolic_pressure', colors.diastolic_pressure), 
            ],
        };
        
        const diastolic_pressureOptions = {
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
     const temperatureData = {
        labels: getLabels(),
        datasets: [
            createDataset('Temperatura', 'temperature', colors.temperature), 
        ],
    };

    const temperatureOptions = {
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
    const oxygen_saturationData = {
        labels: getLabels(),
        datasets: [
            createDataset('Saturacion oxigeno', 'oxygen_saturation', colors.oxygen_saturation),
        ],
    };

    const oxygen_saturationOptions = {
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
            {selectedVariables.includes('pulse') && (
                <div className="mt-8">
                    <Line data={pulseData} options={pulseOptions} />
                </div>
            )}
            {/* Gráfico de "Temperatura"  */}
            {selectedVariables.includes('temperature') && (
                <div className="mt-8">
                    <Line data={temperatureData} options={temperatureOptions} />
                </div>
            )}
            {/* Gráfico de "FR"  */}
            {selectedVariables.includes('respiratory_rate') && (
                <div className="mt-8">
                    <Line data={respiratory_rateData} options={respiratory_rateOptions} />
                </div>
            )}
            {/* Gráfico de "PS"  */}
            {selectedVariables.includes('systolic_pressure') && (
                <div className="mt-8">
                    <Line data={systolic_pressureData} options={systolic_pressureOptions} />
                </div>
            )}
            {/* Gráfico de "PD"  */}
            {selectedVariables.includes('diastolic_pressure') && (
                <div className="mt-8">
                    <Line data={diastolic_pressureData} options={diastolic_pressureOptions} />
                </div>
            )}
             {/* Gráfico de "FR"  */}
             {selectedVariables.includes('oxygen_saturation') && (
                <div className="mt-8">
                    <Line data={ oxygen_saturationData} options={ oxygen_saturationOptions} />
                </div>
            )}

        </div>
    );
};

export default VitalSignsChart;
