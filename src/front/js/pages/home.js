import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/home.css";

export const Home = () => {
    const navigate = useNavigate();
    return (
        <div className="container-fluid">
            <nav className="navbar navbar-expand-lg bg-dark">
                <div className="container-fluid">
                    <span className="navbar-text fs-3 font-monospace">Smart Brain</span>
                    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                        {/* Otras opciones del navbar */}
                    </div>
                </div>
            </nav>
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="text-center">
                    <button type="button" onClick={() => navigate("/login")} className="btn btn-primary btn-lg me-2 mb-2">Iniciar Sesión</button>
                    <button type="button" onClick={() => navigate("/register")} className="btn btn-success btn-lg mb-2">Regístrate</button>
                </div>
            </div>
        </div>
    );
};

