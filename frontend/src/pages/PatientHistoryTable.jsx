import React, { useEffect, useState } from "react";
import { fetchPatientHistory } from "../services/patientService";
import { useParams, useNavigate } from "react-router-dom";
import {  FiHome } from "react-icons/fi";

const PatientHistoryPage = ({ token }) => {
    const [history, setHistory] = useState([]);
    const { idPaciente } = useParams();
    const navigate = useNavigate(); // Hook para la navegación
    const role = localStorage.getItem('role');

    useEffect(() => {
        const loadHistory = async () => {
            try {
                const { data } = await fetchPatientHistory(idPaciente, token);
                setHistory(data);
            } catch (error) {
                console.error("Error al cargar el historial del paciente:", error);
            }
        };
        loadHistory();
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

    const handleGoBack = () => {
        navigate(-1); // Redirige a la página de búsqueda
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6 overflow-auto">
            <h1 className="text-2xl font-bold mb-6">Historial del Paciente</h1>
            
            
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-7xl mb-6 overflow-x-auto">
                <table className="w-full border-collapse table-auto text-sm">
                    <thead>
                        <tr className="bg-blue-100 text-left">
                            <th className="p-3 border-b-2">Fecha de Registro</th>
                            <th className="p-3 border-b-2">Hora de Registro</th>
                            <th className="p-3 border-b-2">Responsable</th>
                            <th className="p-3 border-b-2">Primer Nombre</th>
                            <th className="p-3 border-b-2">Segundo Nombre</th>
                            <th className="p-3 border-b-2">Primer Apellido</th>
                            <th className="p-3 border-b-2">Segundo Apellido</th>
                            <th className="p-3 border-b-2">Tipo de dentificación</th>

                            <th className="p-3 border-b-2">Numero de identificación</th>
                            <th className="p-3 border-b-2">Ubicación</th>
                            <th className="p-3 border-b-2">Fecha de Nacimiento</th>
                            <th className="p-3 border-b-2">Estado</th>
                            <th className="p-3 border-b-2">Grupo de Edad</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.length > 0 ? (
                            history.map((record, index) => {
                                const { date, time } = formatDateTime(record.created_at);
                                return (
                                    <tr
                                        key={index}
                                        className={`text-center ${
                                            index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                        }`}
                                    >
                                        <td className="p-3 border">{date}</td>
                                        <td className="p-3 border">{time}</td>
                                        <td className="p-3 border">{record.responsable_registro}</td>
                                        <td className="p-3 border">{record.primer_nombre}</td>
                                        <td className="p-3 border">{record.segundo_nombre}</td>
                                        <td className="p-3 border">{record.primer_apellido}</td>
                                        <td className="p-3 border">{record.segundo_apellido}</td>
                                        <td className="p-3 border">{record.tipo_identificacion}</td>

                                        <td className="p-3 border">{record.numero_identificacion}</td>
                                        <td className="p-3 border">{record.ubicacion}</td>
                                        <td className="p-3 border">{formatDate(record.fecha_nacimiento)}</td>
                                        <td
                                            className={`p-3 border font-bold ${
                                                record.status === "activo" ? "text-green-500" : "text-red-500"
                                            }`}
                                        >
                                            {record.status}
                                        </td>
                                        <td className="p-3 border">{record.age_group}</td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="13" className="p-3 border text-center text-gray-500">
                                    No se encontraron registros
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Botón de regresar */}
            <button
                        onClick={handleGoBack}
                        className="flex items-center px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition"
                    >
                        <FiHome className="mr-2" /> Regresar
                    </button>
        </div>
    );
};

export default PatientHistoryPage;
