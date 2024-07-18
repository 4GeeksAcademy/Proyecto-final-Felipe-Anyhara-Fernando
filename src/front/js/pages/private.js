import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const Private = () => {
    const { store, actions } = useContext(Context);
    const { user } = store;
    const navigate = useNavigate();

    useEffect(() => {
        actions.getPrivateData();
    }, []);

    const handleLogout = () => {
        alert("See you next time!");
        actions.logout();
        navigate("/login");
    };

    return (
        <div className="container-fluid">
            {user ? (
                <>
                    <h1>Mi Perfil, {user.email}</h1>
                    <p>Role: {user.role}</p>
                    <img src="https://image.tmdb.org/t/p/original/1r8TWaAExHbFRzyqT3Vcbq1XZQb.jpg" className="card" alt="..." />
                    <button onClick={handleLogout} className="btn-c">
                        Cerrar Sesión
                    </button>
                </>
            ) : (
                <p>actualizando los datos del usuario...</p>
            )}
        </div>
    );
};






