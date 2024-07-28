import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/register.css";
//Modificado: Llama a la nueva acción para agregar apoderados desde el store
export const RegisterGuardian = () => {
    //Incluir TODOS los campos de la tabla de apoderados 
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { actions } = useContext(Context);
    const navigate = useNavigate();
    const handleRegister = async (event) => {
        event.preventDefault();
        if (!email || !password || !firstName || !lastName) {
            setMessage("Por favor, completa todos los campos.");
            return;
        }
        try {
            await actions.registerGuardian(firstName, lastName, email, password, phone, address);
            setMessage("Usuario registrado con éxito");
            console.log("User registered successfully");
            setTimeout(() => {
                navigate('/login');  // Redirige a la página de inicio de sesión
            }, 3000);
        } catch (error) {
            setMessage(`Error registrando usuario: ${error.message}`);
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
                        <label htmlFor="phone" className="form-label">Teléfono</label>
                        <input
                            type="text"
                            className="form-control"
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="address" className="form-label">Dirección</label>
                        <textarea
                            className="form-control"
                            id="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
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
