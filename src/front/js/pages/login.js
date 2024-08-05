import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"; // Importa los íconos

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");  // Estado para almacenar mensajes de error
    const { store, actions } = useContext(Context);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            await actions.login(email, password);
            if (store.role === 'profesor') {
                navigate("/profesor");
            } else if (store.role === 'apoderado') {
                navigate("/apoderado");
            } else {
                navigate("/private");
            }
        } catch (error) {
            setError("Credenciales incorrectas. Inténtalo de nuevo.");  // Mensaje de error
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
                            required
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
                                required
                            />
                           <span className="input-group-text" onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer' }}>
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                            </span>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Ingresar</button>
                    {error && <div className="mt-3 alert alert-danger">{error}</div>}  {/* Mostrar mensaje de error */}
                    <div className="text-center mt-3">
                        <Link to="/" className="link-warning">Volver al inicio</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};
