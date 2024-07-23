import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/home.css";

export const Home = () => {
	const navigate = useNavigate();
	return (
		<div className="container-nav-fluid">
			<nav className="navbar navbar-expand-lg bg-dark">
				<div className="container-fluid">
					<span className="navbar-text fs-3 font-monospace">Smart Brain</span>
					<div className="collapse navbar-collapse" id="navbarNavAltMarkup">
						<div className="navbar-nav ms-auto">
							<a className="nav-link link-warning fs-5 font-monospace" onClick={() => navigate("/login")}>EDUCADORES</a>
							<a className="nav-link link-warning fs-5 font-monospace" onClick={() => navigate("/register")}>TUTORES</a>
						</div>
					</div>
				</div>
			</nav>
			<div className="row">
				
			</div>
			<div className="col-12 text-center">
				<button type="button" onClick={() => navigate("/login/private/profesor")} className="btn btn-primary btn-lg me-5">EDUCADORES</button>
				<button type="button" onClick={() => navigate("/login/private/apoderado")} className="btn btn-success btn-lg">TUTORES</button>
			</div>
		</div>
	);
};

