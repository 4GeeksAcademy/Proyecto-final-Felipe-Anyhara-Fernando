import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/home.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faUserPlus } from "@fortawesome/free-solid-svg-icons";

export const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="container-fluid">
            <nav className="barra-navegacion navbar navbar-expand-lg bg-dark">
                <div className="container-fluid">
                    <span className="navbar-text fs-3 font-monospace">Smart Brain</span>
                    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                        {/* Otras opciones del navbar */}
                    </div>
                </div>
            </nav>
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="text-center">
                <div id="carouselExampleSlidesOnly" className="carousel slide" data-bs-ride="carousel">
                        <div className="carousel-inner">
                            <div className="carousel-item active">
                                <img src="https://img.freepik.com/vector-gratis/kinder-dibujos-animados_33099-1136.jpg?t=st=1722670167~exp=1722673767~hmac=56e3eee026b9f7e9bc15fa4cdf453ccd3abf47d7a06d4c526039ccc0021605cf&w=826" className="imagen-a" alt="..." />
                            </div>
                            <div className="carousel-item">
                                <img src="https://img.freepik.com/fotos-premium/tres-ninos-jugando-tablas-madera-pizarra-palabra-alfabeto-ella_763111-285296.jpg?w=740" className="imagen-b" alt="..." />
                            </div>
                            <div className="carousel-item">
                                <img src="https://img.freepik.com/vector-gratis/ilustracion-jardin-infantes_1284-22416.jpg?t=st=1722671332~exp=1722674932~hmac=79783298245b2dd40ea247c23216a993a8cc42b2bd9ee6e770435293e615ab55&w=740" className="imagen-c" alt="..." />
                            </div>
                        </div>
                    </div>
                    <div className="container-fluid-a">
                    <button type="button" onClick={() => navigate("/login")} className="boton-login btn">
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
