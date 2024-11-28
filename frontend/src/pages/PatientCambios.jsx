import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const PatienCambios = () => {
    const { id } = useParams(); // Obtener el ID del paciente desde la URL
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await axios.get(`/api/patients/${id}/history`);
                setHistory(response.data);
            } catch (err) {
                setError("Error al cargar el historial del paciente");
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [id]);

    if (loading) return <p>Cargando historial...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Historial de Cambios del Paciente</h2>
            <button onClick={() => navigate(-1)}>Volver</button>
            <table>
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Nombre</th>
                        <th>Identificación</th>
                        <th>Ubicación</th>
                        <th>Estado</th>
                        <th>Registrado por</th>
                    </tr>
                </thead>
                <tbody>
                    {history.map((entry, index) => (
                        <tr key={index}>
                            <td>{new Date(entry.created_at).toLocaleString()}</td>
                            <td>{`${entry.primer_nombre} ${entry.primer_apellido}`}</td>
                            <td>{entry.numero_identificacion}</td>
                            <td>{entry.ubicacion}</td>
                            <td>{entry.status}</td>
                            <td>{entry.responsable_registro}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PatienCambios;
