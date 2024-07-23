import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/login.css";  // Asegúrate de importar el archivo de estilos

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { actions } = useContext(Context);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            await actions.login(email, password);
            navigate("/private");
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    return (
        <div className="contenedor-principal-form">
            <div className="contenedor-form container py-5">
            <h3 className="titulo-form mb-4">Iniciar Sesión</h3>
            <form onSubmit={handleLogin}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Contraseña</label>
                    <div className="input-group">
                        <input
                            type={showPassword ? "text" : "password"}
                            className="form-control"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <span className="input-group-text" onClick={() => setShowPassword(!showPassword)}>
                            <i className={showPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}></i>
                        </span>
                    </div>
                </div>
                <button type="submit" className="btn btn-primary w-100">Ingresar</button>
                <div className="text-center mt-3">
                    <Link to="/" className="link-warning">Volver al inicio</Link>
                </div>
            </form>
        </div>
        </div>
        
    );
};


