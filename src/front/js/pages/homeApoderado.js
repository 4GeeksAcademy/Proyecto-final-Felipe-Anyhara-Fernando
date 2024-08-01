import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../store/appContext'; // Verifica esta ruta
import { Calificaciones } from "./calificaciones"; // Importa el componente
import { Recomendaciones } from "./recomendaciones";
import { useNavigate } from 'react-router-dom';
export const HomeApoderado = () => {
    const { actions, store } = useContext(Context); // Obtén actions y store del contexto
    const [activeTab, setActiveTab] = useState('calificaciones');
    const [studentData, setStudentData] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        if (!sessionStorage.getItem("accessToken")){
            navigate("/")
        }
    }, []);
    const logout = () => {
        sessionStorage.removeItem("accessToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("userRole");
        navigate("/");
    };
    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                const data = await actions.getStudentData(); // Obtén los datos del alumno
                setStudentData(data);
            } catch (error) {
                console.error('Error fetching student data:', error);
            }
        };
        fetchStudentData();
    }, [actions]);
    const renderContent = () => {
        switch (activeTab) {
            case 'calificaciones':
                return <Calificaciones studentData={studentData} />;
            case 'recomendaciones':
                return <Recomendaciones />;
            default:
                return <h1>Bienvenidos Apoderados</h1>;
        }
    };
    return (
        <div className="container-fluid">
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">APODERADO DASHBOARD</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a
                                    className={`nav-link ${activeTab === 'calificaciones' ? 'active' : ''}`}
                                    href="#"
                                    onClick={() => setActiveTab('calificaciones')}
                                >
                                    Calificaciones
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className={`nav-link ${activeTab === 'recomendaciones' ? 'active' : ''}`}
                                    href="#"
                                    onClick={() => setActiveTab('recomendaciones')}
                                >
                                    Recomendaciones
                                </a>
                            </li>
                        </ul>
                        <div className="d-flex justify-content-end">
                        <button className="btn btn-outline-success" onClick={logout} type="button">Logout</button>
                        </div>
                    </div>
                </div>
            </nav>
            <div className="container mt-4">
                <div className="border border-secondary rounded p-4 bg-light">
                    {studentData ? (
                        <>
                            <h2>Información del Alumno</h2>
                            <p><strong>ID:</strong> {studentData.id}</p>
                            <p><strong>Nombre:</strong> {studentData.nombre}</p>
                            <p><strong>Apellido:</strong> {studentData.apellido}</p>
                            <p><strong>Asignaturas:</strong></p>
                            <ul>
                                {studentData.asignaturas.map(asignatura => (
                                    <li key={asignatura.id}>{asignatura.nombre}</li>
                                ))}
                            </ul>
                            <p><strong>Calificaciones:</strong></p>
                            <ul>
                                {studentData.calificaciones.map(calif => (
                                    <li key={calif.id}>
                                        {calif.asignaturaNombre}: {calif.calificacion}
                                    </li>
                                ))}
                            </ul>
                        </>
                    ) : (
                        <p>Cargando información del alumno...</p>
                    )}
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};