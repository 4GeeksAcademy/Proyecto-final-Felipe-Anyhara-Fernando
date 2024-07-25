import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/register.css";

export const RegisterGuardian = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (event) => {
        event.preventDefault();

        if (!email || !password || !firstName || !lastName) {
            setMessage("Por favor, completa todos los campos.");
            return;
        }

        try {
            const response = await fetch('https://ubiquitous-broccoli-wrvr9v7p7r462g7x6-3001.app.github.dev/api/register/guardian', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    name: firstName,
                    lastName: lastName
                })
            });

            if (!response.ok) {
                const errorMessage = `HTTP error! status: ${response.status}`;
                setMessage(`Error registrando usuario: ${errorMessage}`);
                throw new Error(errorMessage);
            }

            const data = await response.json();
            setMessage("Usuario registrado con éxito");
            console.log("User registered successfully", data);
            setTimeout(() => {
                navigate('/login');  // Redirige a la página de inicio de sesión
            }, 3000);
        } catch (error) {
            setMessage(`Error registrando usuario: ${error.message}`);
            console.error("Error registering user", error);
        }
    };

    return (
        <div className="contenedor-principal-form">
            <div className="contenedor-form container py-5">
                <h3 className="titulo-form mb-4">Registrarse</h3>
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
                            <span className="input-group-text" onClick={() => setShowPassword(!showPassword)}>
                                <i className={showPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}></i>
                            </span>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Registrar</button>
                    {message && <div className="mt-3 alert alert-info">{message}</div>}
                    <div className="text-center mt-3">
                        <Link to="/" className="link-warning">Volver al inicio</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};
