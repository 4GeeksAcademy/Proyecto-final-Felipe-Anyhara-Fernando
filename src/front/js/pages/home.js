import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/home.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faUserPlus } from "@fortawesome/free-solid-svg-icons";

export const Home = () => {
    const navigate = useNavigate();
    const [selectedTab, setSelectedTab] = useState(null);

    const handleTabClick = (tab) => {
        setSelectedTab(tab);
    };

    const renderContent = () => {
        switch (selectedTab) {
            case "mision":
                return <p>Nuestra misión es proporcionar una educación de calidad...</p>;
            case "vision":
                return <p>Visión: Ser líderes en la educación digital...</p>;
            case "quienesSomos":
                return <p>¿Quiénes Somos?: Somos una organización dedicada a...</p>;
            default:
                return <p>Seleccione una pestaña para ver más información.</p>;
        }
    };

    return (
        <div className="container-fluid">
            <nav className="barra-navegacion navbar navbar-expand-lg bg-dark">
                <div className="container-fluid">
                    <span className="navbar-text fs-3 font-monospace">Smart Brain</span>
                    <div className="navbar-collapse">
                        <span 
                            className="navbar-text fs-3 font-monospace mx-3" 
                            onClick={() => handleTabClick("mision")}
                            style={{ cursor: 'pointer' }}
                        >
                            Misión
                        </span>
                        <span 
                            className="navbar-text fs-3 font-monospace mx-3" 
                            onClick={() => handleTabClick("vision")}
                            style={{ cursor: 'pointer' }}
                        >
                            Visión
                        </span>
                        <span 
                            className="navbar-text fs-3 font-monospace mx-3" 
                            onClick={() => handleTabClick("quienesSomos")}
                            style={{ cursor: 'pointer' }}
                        >
                            ¿Quiénes Somos?
                        </span>
                    </div>
                </div>
            </nav>
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="text-center">
                    <div id="carouselExampleSlidesOnly" className="carousel slide" data-bs-ride="carousel">
                        <div className="carousel-inner">
                            <div className="carousel-item active">
                                <img src="https://img.freepik.com/vector-gratis/kinder-dibujos-animados_33099-1136.jpg?t=st=1722670167~exp=1722673767~hmac=56e3eee026b9f7e9bc15fa4cdf453ccd3abf47d7a06d4c526039ccc0021605cf&w=826" className="imagen-a" alt="Niños Dibujando" />
                            </div>
                            <div className="carousel-item">
                                <img src="https://img.freepik.com/fotos-premium/tres-ninos-jugando-tablas-madera-pizarra-palabra-alfabeto-ella_763111-285296.jpg?w=740" className="imagen-b" alt="Niños Jugando" />
                            </div>
                            <div className="carousel-item">
                                <img src="https://img.freepik.com/vector-gratis/ilustracion-jardin-infantes_1284-22416.jpg?t=st=1722671332~exp=1722674932~hmac=79783298245b2dd40ea247c23216a993a8cc42b2bd9ee6e770435293e615ab55&w=740" className="imagen-c" alt="Ilustración de Jardín de Infantes" />
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
                    <div className="mt-4">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};
