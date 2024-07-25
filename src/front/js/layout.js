import React, { useEffect, useContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";

import { Home } from "./pages/home";
import { Login } from "./pages/login";
import { RegisterTeacher } from "./pages/registerTeacher"; 
import { RegisterGuardian } from "./pages/registerGuardian";
import { Private } from "./pages/private";
import PrivateRoute from "./component/privateRoute";


import injectContext, { Context } from "./store/appContext";

const Layout = () => {
    const { actions } = useContext(Context);
    const basename = process.env.BASENAME || "";

    useEffect(() => {
        actions.loadUserFromToken();
    }, [actions]);

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register/teacher" element={<RegisterTeacher />} />
                        <Route path="/register/guardian" element={<RegisterGuardian />} />
                        <Route path="/private" element={<PrivateRoute><Private /></PrivateRoute>} />
                        {/* <Route path="/login/profesor" element={<LoginProfesor />} />
                        <Route path="/login/apoderado" element={<LoginApoderado />} /> */}
                        <Route path="*" element={<h1>Not found!</h1>} />
                    </Routes>
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
