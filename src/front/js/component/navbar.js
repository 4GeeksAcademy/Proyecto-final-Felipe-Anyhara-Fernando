import React from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
	return (
		<nav className="navbar navbar-expand-lg bg-dark">
				<div className="container-fluid">
					<img src="https://www.canva.com/design/DAGLmPcD3Rw/Ttq_f5-CpWvZlnKOFgZQQQ/view?utm_content=DAGLmPcD3Rw&utm_campaign=designshare&utm_medium=link&utm_source=editor" 
					width="45" height="36" />
					<span className="navbar-text fs-3 font-monospace">Smart Brain</span>
					<div className="collapse navbar-collapse" id="navbarNavAltMarkup">
						<div className="navbar-nav ms-auto">
							<a className="nav-link link-warning fs-5 font-monospace" onClick={() => navigate("/login")}>EDUCADORES</a>
							<a className="nav-link link-warning fs-5 font-monospace" onClick={() => navigate("/register")}>TUTORES</a>
						</div>
					</div>
				</div>
			</nav>
	);
};
