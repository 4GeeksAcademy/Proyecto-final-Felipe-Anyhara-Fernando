import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/home.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faUserPlus } from "@fortawesome/free-solid-svg-icons";

export const Home = () => {
    const navigate = useNavigate();
    const [selectedTab, setSelectedTab] = useState("mision");

    const tabs = ["mision", "vision", "quienesSomos"];

    useEffect(() => {
        const interval = setInterval(() => {
            setSelectedTab((prevTab) => {
                const currentIndex = tabs.indexOf(prevTab);
                const nextIndex = (currentIndex + 1) % tabs.length;
                return tabs[nextIndex];
            });
        }, 3000); // Cambia de pestaña cada 3 segundos

        return () => clearInterval(interval); // Limpia el intervalo al desmontar el componente
    }, []);

    const handleTabClick = (tab) => {
        setSelectedTab(tab);
    };

    const renderCarouselItemContent = () => {
        switch (selectedTab) {
            case "mision":
                return (
                    <div className="carousel-content">
                        <h3 className="text-light">Misión</h3>
                        <p>Ser la plataforma líder en la transformación digital de la educación, potenciando la colaboración y comunicación entre profesores, apoderados y estudiantes. Nos esforzamos por crear un entorno educativo más eficiente y accesible, donde cada estudiante tenga el apoyo necesario para alcanzar su máximo potencial académico.</p>
                    </div>
                );
            case "vision":
                return (
                    <div className="carousel-content">
                        <h3 className="text-light">Visión</h3>
                        <p>Nuestra misión es optimizar el trabajo de los profesores y facilitar una comunicación rápida y efectiva entre apoderados y el entorno educativo de sus hijos. Proveemos herramientas integradas para que los profesores gestionen sus clases de manera eficiente, simplifiquen la evaluación del progreso académico y generen contenido de apoyo personalizado. Al mismo tiempo, ofrecemos a los apoderados acceso inmediato a la información académica de sus hijos, promoviendo un seguimiento cercano y una comunicación directa con los educadores. Con nuestra plataforma, buscamos mejorar la colaboración entre profesores y apoderados para apoyar el éxito académico de los estudiantes.</p>
                    </div>
                );
            case "quienesSomos":
                return (
                    <div className="carousel-content">
                        <h3 className="text-light">¿Quiénes Somos?</h3>
                        <p>Somos una plataforma innovadora dedicada a mejorar la eficiencia y efectividad de la educación. Nuestro equipo está compuesto por profesionales apasionados por la tecnología y la enseñanza, comprometidos en proporcionar soluciones que faciliten la labor educativa y fortalezcan la colaboración entre todos los actores del entorno académico. Creemos en el poder de la tecnología para transformar la educación y estamos dedicados a construir herramientas que ayuden a los profesores a gestionar sus clases, a los apoderados a mantenerse informados y a los estudiantes a alcanzar su máximo potencial.</p>
                    </div>
                );
            default:
                return <p className="text-light">Seleccione una pestaña para ver más información.</p>;
        }
    };

    return (
        <div className="container-fluid">
            <nav className="barra-navegacion navbar navbar-expand-lg bg-dark">
                <div className="container-fluid">
                    <span className="navbar-text fs-3 font-monospace mx-3">Smart Brain</span>
                    <div className="navbar-collapse collapse justify-content-end">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <span
                                    className={`nav-link text-warning fs-3 font-monospace mx-3 ${selectedTab === "mision" ? "active" : ""}`}
                                    onClick={() => handleTabClick("mision")}
                                    style={{ cursor: "pointer" }}
                                >
                                    Misión
                                </span>
                            </li>
                            <li className="nav-item">
                                <span
                                    className={`nav-link text-warning fs-3 font-monospace mx-3 ${selectedTab === "vision" ? "active" : ""}`}
                                    onClick={() => handleTabClick("vision")}
                                    style={{ cursor: "pointer" }}
                                >
                                    Visión
                                </span>
                            </li>
                            <li className="nav-item">
                                <span
                                    className={`nav-link text-warning fs-3 font-monospace mx-3 ${selectedTab === "quienesSomos" ? "active" : ""}`}
                                    onClick={() => handleTabClick("quienesSomos")}
                                    style={{ cursor: "pointer" }}
                                >
                                    ¿Quiénes Somos?
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="text-center">
                    <div id="carouselExampleSlidesOnly" className="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">
                        <div className="carousel-inner">
                            <div className="carousel-item active">
                                <img src="https://img.freepik.com/foto-gratis/desenfoque-lujo-abstracto-degradado-gris-oscuro-negro-utilizado-como-pared-estudio-fondo-mostrar-sus-productos_1258-102010.jpg?t=st=1722835461~exp=1722839061~hmac=3a2ef0f6dc0b29e78c25d2d068c32a85c7846dc09ec2a3f8cac1ae2799e46dc4&w=1380" className="d-block w-100" alt="Background" />
                                <div className="carousel-caption d-flex flex-column justify-content-center align-items-center">
                                    {renderCarouselItemContent()}
                                </div>
                            </div>
                        </div>
                        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleSlidesOnly" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleSlidesOnly" data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>
                    <div className="container-fluid mt-4">
                        <button type="button" onClick={() => navigate("/login")} className="boton-login btn btn-primary me-3">
                            <FontAwesomeIcon icon={faUser} className="me-2" />
                            Iniciar Sesión
                        </button>
                        <button type="button" onClick={() => navigate("/register/teacher")} className="boton-registro btn btn-secondary">
                            <FontAwesomeIcon icon={faUserPlus} className="me-2" />
                            Regístrate como Profesor
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
