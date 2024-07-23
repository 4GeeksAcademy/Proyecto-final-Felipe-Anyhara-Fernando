import React from "react";
import { Link } from "react-router-dom";
 
 export const Jumbotron = () => {
    return (
        <div className="jumbotron bg-body-terciary rounded-3 mt-4 mb-3">
            <div className="container-fluid py-4">
                <h1 className="display-4">Bienvenidos a la plataforma educativa Smart Brain!</h1>
                <p className="lead">Lorem ipsum, dolor sit amet consectetur adipisicing elit. 
                Voluptates ab, pariatur illum optio recusandae consequuntur nesciunt fugiat. Laborum, molestiae et. 
                Asperiores tenetur fugiat culpa. Excepturi, officiis assumenda. Eius, commodi aspernatur!</p>
                    <a href="#" className="btn btn-primary btn-lg">Learn more</a>
            </div>
        </div>
    );
};

export default Jumbotron;