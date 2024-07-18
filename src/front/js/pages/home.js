import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/home.css";

export const Home = () => {
	const navigate = useNavigate();
	return (
		<div className="container-fluid py-5 text-center">
			<div className="row">
				<div className="col-12">
					<h1>Bienvenido al sistema de registro de usuarios</h1>
				</div>
			</div>
			<div className="card">
				<img src="https://i.pinimg.com/564x/f8/15/79/f81579b700e1f0272242f1d3aa62c52c.jpg" className="card-img-top" alt="..." />
			</div>
			<div className="row mt-5">
				<div className="col-12 text-center">
					<button type="button" onClick={() => navigate("/login")} className="btn btn-primary btn-lg me-5">Inicia sesión</button>
					<button type="button" onClick={() => navigate("/register")} className="btn btn-success btn-lg">Regístrate</button>
				</div>
			</div>
		</div>
	);
};


