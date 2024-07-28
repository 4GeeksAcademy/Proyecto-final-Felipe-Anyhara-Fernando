import React from "react";
import ReactDOM from "react-dom/client";
import Layout from "./layout";

const rootElement = document.getElementById("app"); 
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <Layout />
        </React.StrictMode>
    );
} else {
    console.error("No se encontró un elemento con el ID 'app'.");
}