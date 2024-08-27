import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/home.css"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faUserPlus } from "@fortawesome/free-solid-svg-icons";

export const Home = () => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState("");

    const handleShowModal = (content) => {
        setModalContent(content);
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    const renderModalContent = () => {
        switch (modalContent) {
            case "mision":
                return (
                    <div>
                        <p>
                            Nuestra misión es proporcionar herramientas educativas innovadoras que optimicen el trabajo de los profesores y faciliten una comunicación efectiva entre apoderados y el entorno educativo de sus hijos.
                        </p>
                    </div>
                );
            case "vision":
                return (
                    <div>
                        <p>
                            Visualizamos un futuro donde el trabajo de los profesores sea optimizado y la comunicación entre los apoderados y el entorno educativo de sus hijos sea rápida y efectiva, mejorando la colaboración para apoyar el éxito académico de los estudiantes.
                        </p>
                    </div>
                );
            case "quienesSomos":
                return (
                    <div>
                        <p>
                            Somos una plataforma innovadora dedicada a mejorar la eficiencia y efectividad de la educación. Nuestro equipo está compuesto por profesionales apasionados por la tecnología y la enseñanza, comprometidos en proporcionar soluciones que faciliten la labor educativa y fortalezcan la colaboración entre todos los actores del entorno académico.
                        </p>
                    </div>
                );
            default:
                return null;
        }
    };

    const getModalTitle = () => {
        switch (modalContent) {
            case "mision":
                return "Misión";
            case "vision":
                return "Visión";
            case "quienesSomos":
                return "¿Quiénes Somos?";
            default:
                return "";
        }
    };

    return (
        <div className="container-fluid">
            <nav className="navbar">
                <div className="navbar-brand text-warning">Smart BRAIN</div>
                <div className="navbar-links">
                    <button className="nav-link text-warning fw-bold" onClick={() => handleShowModal("mision")}>Misión</button>
                    <button className="nav-link text-warning fw-bold" onClick={() => handleShowModal("vision")}>Visión</button>
                    <button className="nav-link text-warning fw-bold" onClick={() => handleShowModal("quienesSomos")}>¿Quiénes Somos?</button>
                </div>
            </nav>

            <div className="d-flex flex-column align-items-center vh-100 mt-4">
                <div className="container d-flex justify-content-center align-items-center mt-4">
                    <div className="bg-white rounded shadow text-center contenedor-img">
                        <img
                            src="https://i.ibb.co/fXZX266/Logo-Smart-Brain.png"
                            alt="Logo"
                            className="img-fluid logo-smartbrain"
                            style={{ maxWidth: '400px' }}
                        />
                    </div>
                </div>

                <div className="text-center mt-4">
                    <div className="container d-flex justify-content-center align-items-center">
                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                            className="boton-login btn"
                        >
                            <FontAwesomeIcon icon={faUser} className="me-2" />
                            Iniciar Sesión
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/register/teacher")}
                            className="boton-registro btn"
                        >
                            <FontAwesomeIcon icon={faUserPlus} className="me-2" />
                            Regístrate como Profesor
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5>{getModalTitle()}</h5>
                            <button className="modal-close" onClick={handleCloseModal}>
                                &times;
                            </button>
                        </div>
                        <div className="modal-body">{renderModalContent()}</div>
                    </div>
                </div>
            )}
        </div>
    );
};
