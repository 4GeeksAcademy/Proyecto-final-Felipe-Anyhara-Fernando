const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            user: null,
            message: null,
            demo: [
                {
                    title: "FIRST",
                    background: "white",
                    initial: "white"
                },
                {
                    title: "SECOND",
                    background: "white",
                    initial: "white"
                }
            ]
        },
        actions: {
            exampleFunction: () => {
                getActions().changeColor(0, "green");
            },
            getMessage: async () => {
                try {
                    const resp = await fetch(process.env.BACKEND_URL + "/api/hello");
                    const data = await resp.json();
                    setStore({ message: data.message });
                    return data;
                } catch (error) {
                    console.log("Error loading message from backend", error);
                }
            },
            changeColor: (index, color) => {
                const store = getStore();
                const demo = store.demo.map((elm, i) => {
                    if (i === index) elm.background = color;
                    return elm;
                });
                setStore({ demo: demo });
            },
            login: async (email, password) => {
                try {
                    const resp = await fetch(`${process.env.BACKEND_URL}/api/login`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ correo_electronico: email, contrasena: password })
                    });
                    const data = await resp.json();
                    if (!resp.ok) {
                        throw new Error(data.mensaje || "Error al iniciar sesión");
                    }
                    // Guardar el token, el rol y el ID del usuario en localStorage
                    sessionStorage.setItem("accessToken", data.access_token);
                    localStorage.setItem("userRole", data.rol);
                    localStorage.setItem("userId", data.id);
                    // Redirigir según el rol del usuario
                    if (data.rol === 'Profesor') {
                        window.location.href = "/home-profesor";
                    } else if (data.rol === 'Apoderado') {
                        window.location.href = "/home-apoderado";
                    }
                    setStore({ user: data });
                    return data;
                } catch (error) {
                    console.log("Error al iniciar sesión", error);
                    throw error;
                }
            },
            getPrivateData: async () => {
                try {
                    const token = sessionStorage.getItem("accessToken");
                    if (!token) {
                        throw new Error("No hay un token de acceso disponible");
                    }
                    const resp = await fetch(`${process.env.BACKEND_URL}/api/private`, {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    const data = await resp.json();
                    if (!resp.ok) {
                        throw new Error(data.msg || "Error en la obtención de datos");
                    }
                    const { user } = getStore();
                    if (JSON.stringify(user) !== JSON.stringify(data)) {
                        setStore({ user: data });
                        console.log("Los datos del usuario están actualizados en el store:", data);
                    }
                    return data;
                } catch (error) {
                    console.error("Error en la obtención de los datos:", error);
                    throw error;
                }
            },
            //Debuggeo de esta acción. Prestar atención a comentarios y a los logs de la consola del navegador
            loadUserFromToken: async () => {
                const token = sessionStorage.getItem("accessToken"); //obtener el token desde el sessionStorage
                const userId = localStorage.getItem("userId");  // Obtener el id desde el localStorage
                const userRole = localStorage.getItem("userRole");  // Obtener el rol del usuario desde localStorage
                if (!token || !userId || !userRole) {
                    console.error("Token, userId, or userRole not found");
                    setStore({ user: null });
                    return;
                }
                try {
                    // Construir la URL para la solicitud basada en el rol del usuario
                    let apiUrl;
                    if (userRole === 'Profesor') {
                        apiUrl = `${process.env.BACKEND_URL}/api/teacher/${userId}`;
                    } else if (userRole === 'Apoderado') {
                        apiUrl = `${process.env.BACKEND_URL}/api/guardian/${userId}`;
                    } else {
                        throw new Error("Unknown user role");
                    }
                    // Obtener los datos del usuario
                    const response = await fetch(apiUrl, {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    });
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    const data = await response.json();
                    setStore({ user: data }); // Actualizar el Store con la data del usuario
                    // Console log del store después de actualizarlo
                    console.log("User data updated in store:", data);
                } catch (error) {
                    console.error("Error loading user from token:", error);
                    setStore({ user: null });
                }
            },
            // Acción para registrar un apoderado
            registerGuardian: async (nombre, apellido, correo_electronico, contrasena, telefono, direccion) => {
                const backendUrl = process.env.BACKEND_URL;
                try {
                    const response = await fetch(`${backendUrl}/api/register/guardian`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            nombre,
                            apellido,
                            correo_electronico,
                            contrasena,
                            telefono,
                            direccion,
                            rol: 'Apoderado' // Asigna el rol de 'Apoderado' por defecto
                        })
                    });
                    if (!response.ok) {
                        const errorMessage = `HTTP error! status: ${response.status}`;
                        throw new Error(errorMessage);
                    }
                    const data = await response.json();
                    console.log("User registered successfully", data);
                    setStore({ message: "Usuario registrado con éxito" });
                    return data;
                } catch (error) {
                    console.error("Error registering user", error);
                    setStore({ message: `Error registrando usuario: ${error.message}` });
                    throw error;
                }
            },
            // Agregado: Acción para registrar un profesor
            registerProfessor: async (nombre, apellido, correo_electronico, contrasena, titulo, especializacion) => {
                const backendUrl = process.env.BACKEND_URL;
                try {
                    const response = await fetch(`${backendUrl}/api/register/teacher`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            nombre,
                            apellido,
                            correo_electronico,
                            contrasena,
                            titulo,
                            especializacion,
                            rol: 'Profesor' // Asigna el rol de 'Profesor' por defecto
                        })
                    });
                    if (!response.ok) {
                        const errorMessage = `HTTP error! status: ${response.status}`;
                        throw new Error(errorMessage);
                    }
                    const data = await response.json();
                    console.log("Professor registered successfully", data);
                    setStore({ message: "Profesor registrado con éxito" });
                    return data;
                } catch (error) {
                    console.error("Error registering professor", error);
                    setStore({ message: `Error registrando profesor: ${error.message}` });
                    throw error;
                }
            },
            logout: () => {
                sessionStorage.removeItem("accessToken");
                localStorage.removeItem("userRole");
                setStore({ user: null });
            }
        }
    };
};
export default getState;