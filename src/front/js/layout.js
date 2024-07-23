import React, { useEffect, useContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";

import { Home } from "./pages/home";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { Private } from "./pages/private";
import { Navbar } from "./component/navbar";
import { Jumbotron } from "./component/jumbotron";
import { Footer } from "./component/footer";
import PrivateRoute from "./component/privateRoute";
import { LoginProfesor } from "./pages/loginProfesor"; // Añade esta línea para importar LoginProfesor
import { LoginApoderado } from "./pages/loginApoderado";

import injectContext, { Context } from "./store/appContext";

const Layout = () => {
    const { actions } = useContext(Context);
    const basename = process.env.BASENAME || "";

    useEffect(() => {
        actions.loadUserFromToken();
    }, []);

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/private" element={<PrivateRoute><Private /></PrivateRoute>} />
                        <Route path="/login/profesor" element={<LoginProfesor />} /> {/* Ruta para LoginProfesor */}
                        <Route path="/login/apoderado" element={<LoginApoderado />} />
                        <Route path="*" element={<h1>Not found!</h1>} />
                    </Routes>
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);

