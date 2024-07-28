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
                    <button type="button" onClick={() => navigate("/login")} className="boton-login btn ">
                        <FontAwesomeIcon icon={faUser} className="me-2" />
                        Iniciar Sesión
                    </button>
                    <button type="button" onClick={() => navigate("/register/teacher")} className="boton-registro btn">
                        <FontAwesomeIcon icon={faUserPlus} className="me-2" />
                        Regístrate como Profesor
                    </button>
                    <button type="button" onClick={() => navigate("/register/guardian")} className="boton-registro btn">
                        <FontAwesomeIcon icon={faUserPlus} className="me-2" />
                        Regístrate como Apoderado
                    </button>
                </div>
            </div>
        </div>
    );
};