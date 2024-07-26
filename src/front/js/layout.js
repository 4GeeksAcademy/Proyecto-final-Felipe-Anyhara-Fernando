import React, { useEffect, useContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { Home } from "./pages/home";
import { Login } from "./pages/login";
import { RegisterTeacher } from "./pages/registerTeacher"; 
import { RegisterGuardian } from "./pages/registerGuardian";
import { HomeProfesor } from "./pages/homeProfesor"; //importamos el componente de la vista del profesor
import { HomeApoderado } from "./pages/homeApoderado"; //importamos el componente de la vista del apoderado
import injectContext, { Context } from "./store/appContext"; 
const Layout = () => {
    const { actions } = useContext(Context);
    const basename = process.env.BASENAME || "";
    useEffect(() => {
        actions.loadUserFromToken();
    }, []); // Dependencia vacía asegura que esto se ejecute solo una vez, estaba generando loop
    
    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/home-apoderado" element={<HomeApoderado />} /> 
                        <Route path="/home-profesor" element={<HomeProfesor />} />
                        <Route path="/register/teacher" element={<RegisterTeacher />} />
                        <Route path="/register/guardian" element={<RegisterGuardian />} />
                    </Routes>
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};
export default injectContext(Layout);