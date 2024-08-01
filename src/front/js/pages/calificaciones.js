import React, { useState, useEffect } from 'react';

export const Calificaciones = () => {
    
    const [alumnos, setAlumnos] = useState([]);
    const [selectedAlumno, setSelectedAlumno] = useState('');
    const [calificaciones, setCalificaciones] = useState([]);
    const [idAsignatura, setIdAsignatura] = useState('');
    const [calificacionMin, setCalificacionMin] = useState('');
    const [calificacionMax, setCalificacionMax] = useState('');

    // Cargar la lista de alumnos al montar el componente
    useEffect(() => {
        const fetchAlumnos = async () => {
            try {
                const response = await fetch('/alumnos'); // Ruta para obtener alumnos
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setAlumnos(data);
            } catch (error) {
                console.error('Error al cargar la lista de alumnos:', error);
            }
        };

        fetchAlumnos();
    }, []);

    // Cargar las calificaciones cuando se selecciona un alumno
    useEffect(() => {
        const fetchCalificaciones = async () => {
            if (selectedAlumno) {
                try {
                    const queryParams = new URLSearchParams({
                        ...(idAsignatura ? { id_asignatura: idAsignatura } : {}),
                        ...(calificacionMin ? { calificacion_min: calificacionMin } : {}),
                        ...(calificacionMax ? { calificacion_max: calificacionMax } : {}),
                    }).toString();

                    const response = await fetch(`/alumno_asignaturas/${selectedAlumno}?${queryParams}`);
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    const data = await response.json();
                    setCalificaciones(data);
                } catch (error) {
                    console.error('Error al cargar las calificaciones:', error);
                }
            } else {
                setCalificaciones([]);
            }
        };

        fetchCalificaciones();
    }, [selectedAlumno, idAsignatura, calificacionMin, calificacionMax]);

    const handleSelectChange = (event) => {
        setSelectedAlumno(event.target.value);
    };

    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        if (name === 'id_asignatura') {
            setIdAsignatura(value);
        } else if (name === 'calificacion_min') {
            setCalificacionMin(value);
        } else if (name === 'calificacion_max') {
            setCalificacionMax(value);
        }
    };

    return (
        <div className="container mt-4">
            <h1>Progreso Académico</h1>
            <select
                className="form-control mb-3"
                value={selectedAlumno}
                onChange={handleSelectChange}
            >
                <option value="">Selecciona un Alumno</option>
                {alumnos.map(alumno => (
                    <option key={alumno.id} value={alumno.id}>
                        {alumno.nombre} {alumno.apellido}
                    </option>
                ))}
            </select>

            {selectedAlumno && (
                <div className="mb-3">
                    <label htmlFor="id_asignatura" className="form-label">Filtrar por Asignatura</label>
                    <input
                        id="id_asignatura"
                        name="id_asignatura"
                        type="number"
                        className="form-control"
                        placeholder="ID de Asignatura"
                        value={idAsignatura}
                        onChange={handleFilterChange}
                    />
                </div>
            )}

            {selectedAlumno && (
                <div className="mb-3">
                    <label htmlFor="calificacion_min" className="form-label">Calificación Mínima</label>
                    <input
                        id="calificacion_min"
                        name="calificacion_min"
                        type="number"
                        step="0.01"
                        className="form-control"
                        placeholder="Calificación Mínima"
                        value={calificacionMin}
                        onChange={handleFilterChange}
                    />
                </div>
            )}

            {selectedAlumno && (
                <div className="mb-3">
                    <label htmlFor="calificacion_max" className="form-label">Calificación Máxima</label>
                    <input
                        id="calificacion_max"
                        name="calificacion_max"
                        type="number"
                        step="0.01"
                        className="form-control"
                        placeholder="Calificación Máxima"
                        value={calificacionMax}
                        onChange={handleFilterChange}
                    />
                </div>
            )}

            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre Alumno</th>
                        <th>Nombre Asignatura</th>
                        <th>Calificación</th>
                    </tr>
                </thead>
                <tbody>
                    {calificaciones.map(registro => (
                        <tr key={registro.id}>
                            <td>{registro.id}</td>
                            <td>{registro.nombre_alumno}</td>
                            <td>{registro.nombre_asignatura}</td>
                            <td>{registro.calificacion !== null ? registro.calificacion.toFixed(2) : 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Calificaciones;
