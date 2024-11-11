// src/pages/PatientGraphs.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchPatientRecords } from "../services/patientService";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

const PatientGraphs = () => {
    const { patientId } = useParams();
    const [records, setRecords] = useState([]);

    useEffect(() => {
        const loadPatientRecords = async () => {
            try {
                const response = await fetchPatientRecords(patientId);
                setRecords(response.data.records);
            } catch (error) {
                console.error("Error fetching patient records", error);
            }
        };
        loadPatientRecords();
    }, [patientId]);

    const generateChartData = (label, dataKey) => {
        return {
            labels: records.map(record => record.record_date),
            datasets: [
                {
                    label: label,
                    data: records.map(record => record[dataKey]),
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: true,
                },
            ],
        };
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
            <h1 className="text-2xl font-bold mb-6">Gráficos del Paciente</h1>

            <div className="w-full max-w-4xl mb-8 bg-white p-6 rounded shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Pulso</h2>
                <Line data={generateChartData("Pulso (lpm)", "pulse")} />
            </div>

            <div className="w-full max-w-4xl mb-8 bg-white p-6 rounded shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Temperatura</h2>
                <Line data={generateChartData("Temperatura (°C)", "temperature")} />
            </div>

            <div className="w-full max-w-4xl mb-8 bg-white p-6 rounded shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Frecuencia Respiratoria</h2>
                <Line data={generateChartData("Frecuencia Respiratoria (RPM)", "respiratory_rate")} />
            </div>

            <div className="w-full max-w-4xl mb-8 bg-white p-6 rounded shadow-lg">
                <h2 className="text-xl font-semibold mb-4">TAS (mmHg)</h2>
                <Line data={generateChartData("TAS (mmHg)", "systolic_pressure")} />
            </div>

            <div className="w-full max-w-4xl mb-8 bg-white p-6 rounded shadow-lg">
                <h2 className="text-xl font-semibold mb-4">TAD (mmHg)</h2>
                <Line data={generateChartData("TAD (mmHg)", "diastolic_pressure")} />
            </div>

            <div className="w-full max-w-4xl mb-8 bg-white p-6 rounded shadow-lg">
                <h2 className="text-xl font-semibold mb-4">SatO2 (%)</h2>
                <Line data={generateChartData("SatO2 (%)", "oxygen_saturation")} />
            </div>
        </div>
    );
};

export default PatientGraphs;