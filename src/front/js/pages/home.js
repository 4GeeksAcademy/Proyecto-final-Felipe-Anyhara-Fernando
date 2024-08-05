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
                        <p>Nuestra misión es proporcionar herramientas educativas innovadoras que optimicen el trabajo de los profesores y faciliten una comunicación efectiva entre apoderados y el entorno educativo de sus hijos.</p>
                    </div>
                );
            case "vision":
                return (
                    <div className="carousel-content">
                        <h3 className="text-light">Visión</h3>
                        <p>Visualizamos un futuro donde el trabajo de los profesores sea optimizado y la comunicación entre los apoderados y el entorno educativo de sus hijos sea rápida y efectiva, mejorando la colaboración para apoyar el éxito académico de los estudiantes.</p>
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
                                    <div className="carousel-content-wrapper">
                                        {renderCarouselItemContent()}
                                    </div>
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
                        <button type="button" onClick={() => navigate("/login")} className="boton-login btn me-3">
                            <FontAwesomeIcon icon={faUser} className="me-2" />
                            Iniciar Sesión
                        </button>
                        <button type="button" onClick={() => navigate("/register/teacher")} className="boton-registro btn">
                            <FontAwesomeIcon icon={faUserPlus} className="me-2" />
                            Regístrate como Profesor
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
