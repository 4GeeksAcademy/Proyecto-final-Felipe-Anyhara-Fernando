import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";  
import "../../styles/register.css";
//Modificado para usar la accion de flux para registrar profesores
//Incluyan todos los campos
export const RegisterTeacher = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [title, setTitle] = useState("");  // Campo adicional para título
    const [specialization, setSpecialization] = useState("");  // Campo adicional para especialización
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { actions } = useContext(Context);
    const handleRegister = async (event) => {
        event.preventDefault();
        if (!email || !password || !firstName || !lastName || !title || !specialization) {
            setMessage("Por favor, completa todos los campos.");
            return;
        }
        try {
            await actions.registerProfessor(firstName, lastName, email, password, title, specialization);
            setMessage("Profesor registrado con éxito");
            setTimeout(() => {
                navigate('/login');  // Redirige a la página de inicio de sesión
            }, 3000);
        } catch (error) {
            setMessage(`Error registrando profesor: ${error.message}`);
            console.error("Error registering professor", error);
        }
    };
    return (
        <div className="contenedor-principal-form">
            <div className="contenedor-form container py-5">
                <h3 className="titulo-form mb-4">Registrar Profesor</h3>
                <form onSubmit={handleRegister}>
                    <div className="mb-3">
                        <label htmlFor="firstName" className="form-label">Nombre</label>
                        <input
                            type="text"
                            className="form-control"
                            id="firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="lastName" className="form-label">Apellido</label>
                        <input
                            type="text"
                            className="form-control"
                            id="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            aria-describedby="emailHelp"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <div id="emailHelp" className="form-text">Nunca compartiremos tus datos con alguien más.</div>
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
                            <span className="input-group-text" onClick={() => setShowPassword(!showPassword)}>
                                <i className={showPassword ? "fa-regular fa-eye-slash" : "fa-regular fa-eye"}></i>
                            </span>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Título</label>
                        <input
                            type="text"
                            className="form-control"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="specialization" className="form-label">Especialización</label>
                        <input
                            type="text"
                            className="form-control"
                            id="specialization"
                            value={specialization}
                            onChange={(e) => setSpecialization(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Registrar</button>
                    <div className="text-center mt-3">
                        <Link to="/" className="link-warning">Volver al inicio</Link>
                    </div>
                </form>
                {message && <div className="mt-3 alert alert-info">{message}</div>}
            </div>
        </div>
    );
};