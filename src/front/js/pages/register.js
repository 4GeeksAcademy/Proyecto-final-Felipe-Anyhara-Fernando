import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/register.css";  // Asegúrate de importar el archivo de estilos

export const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleRegister = async (event) => {
        event.preventDefault();

        const response = await fetch('https://verbose-broccoli-pj7679g4qw5q397x7-3001.app.github.dev/api/register/teacher', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();
        if (response.ok) {
            setMessage("Usuario registrado con éxito");
            console.log("User registered successfully", data);
            setTimeout(() => {
                window.location.reload();  // Recargar la página después de 3 segundos
            }, 3000);
        } else {
            setMessage(`Error registrando usuario: ${data.error}`);
            console.log("Error registering user", data);
        }
    };

    return (
        <div className="contenedor-principal-form">
            <div className="contenedor-form container py-5">
                <h3 className="titulo-form mb-4">Registrarse</h3>
                <form onSubmit={handleRegister}>
                    <div className="mb-3">
                        <label htmlFor="exampleInputEmail1" className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="exampleInputEmail1"
                            aria-describedby="emailHelp"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <div id="emailHelp" className="form-text">Nunca compartiremos tus datos con alguien más.</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputPassword1" className="form-label">Contraseña</label>
                        <div className="input-group">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-control"
                                id="exampleInputPassword1"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <span className="input-group-text" onClick={() => setShowPassword(!showPassword)}>
                                <i className={showPassword ? "fa-regular fa-eye-slash" : "fa-regular fa-eye"}></i>
                            </span>
                        </div>
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
