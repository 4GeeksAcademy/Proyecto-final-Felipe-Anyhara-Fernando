const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            user: null,
            message: null,
            demo: [
                { title: "FIRST", background: "white", initial: "white" },
                { title: "SECOND", background: "white", initial: "white" }
            ],
            asignaturas: [],
            calificaciones: [],
            apoderados: [],
            alumnos: [],
            recomendaciones: []
        },
        actions: {
            exampleFunction: () => {
                getActions().changeColor(0, "green");
            },
            getMessage: async () => {
                try {
                    const resp = await fetch(`${process.env.BACKEND_URL}/api/hello`);
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
                        headers: { "content-type": "application/json",
                            "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}` },
                        body: JSON.stringify({ correo_electronico: email, contrasena: password })
                    });
                    const data = await resp.json();
                    if (!resp.ok) throw new Error(data.mensaje || "Error al iniciar sesión");

                    sessionStorage.setItem("accessToken", data.access_token);
                    localStorage.setItem("userRole", data.rol);
                    localStorage.setItem("userId", data.id);

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

            obtenerRecomendaciones: async (idAlumno) => {
                console.log(idAlumno)
                const {recomendaciones} = getStore()
                const backendUrl = process.env.BACKEND_URL;
                try {
                    const response = await fetch(`${backendUrl}/api/recomendaciones/${idAlumno}`);

                    // Verificar si la respuesta es OK (status code 200-299)
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    // Capturar el texto crudo de la respuesta para verificar su contenido
                    const data = await response.json();

                    // Intentar parsear el texto como JSON
                    try {
                        console.log(data)

                        // Verificar si los datos obtenidos son un array
                        if (Array.isArray(data)) {
                            const newRecomendaciones = recomendaciones.concat(data)
                            setStore({ recomendaciones: newRecomendaciones });
                            console.log("Recomendaciones fetched successfully", data);
                        } else {
                            console.error("Las recomendaciones obtenidas no son un array:", data);
                            setStore({ recomendaciones: [] });
                        }
                    } catch (jsonError) {
                        // Si no se puede parsear como JSON, mostrar el contenido de la respuesta
                        console.error("Error parsing JSON:", jsonError);
                        console.error("Raw response:", textResponse);
                    }
                } catch (error) {
                    console.error("Error fetching recomendaciones", error);
                }
            },

            getPrivateData: async () => {
                try {
                    const token = sessionStorage.getItem("accessToken");
                    if (!token) throw new Error("No hay un token de acceso disponible");

                    const resp = await fetch(`${process.env.BACKEND_URL}/api/private`, {
                        method: "GET",
                        headers: { "content-type": "application/json",
                            "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}` }
                    });
                    const data = await resp.json();
                    if (!resp.ok) throw new Error(data.msg || "Error en la obtención de datos");

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

            obtenerAlumnoAsignaturasPorId: async (id_alumno) => {
                const backendUrl = process.env.BACKEND_URL;
                try {
                    const response = await fetch(`${backendUrl}/api/alumno_asignaturas/${id_alumno}`, {
                        method: "GET",
                        headers: {
                            "content-type": "application/json",
                            "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`
                        }
                    });
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const data = await response.json();
                    // Solo retorna los datos, no actualiza el estado del store
                    console.log("Calificaciones fetched successfully", data);
                    return data;
                } catch (error) {
                    console.error("Error fetching calificaciones", error);
                    // Devuelve un array vacío en caso de error
                    return [];
                }
            },

            loadUserFromToken: async () => {
                const token = sessionStorage.getItem("accessToken");
                const userId = localStorage.getItem("userId");
                const userRole = localStorage.getItem("userRole");
                if (!token || !userId || !userRole) {
                    console.error("Token, userId, or userRole not found");
                    setStore({ user: null });
                    return;
                }
                try {
                    let apiUrl;
                    if (userRole === 'Profesor') {
                        apiUrl = `${process.env.BACKEND_URL}/api/teacher/${userId}`;
                    } else if (userRole === 'Apoderado') {
                        apiUrl = `${process.env.BACKEND_URL}/api/guardian/${userId}`;
                    } else {
                        throw new Error("Unknown user role");
                    }

                    const response = await fetch(apiUrl, {
                        method: "GET",
                        headers: { "content-type": "application/json",
                            "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}` }
                    });
                    if (!response.ok) throw new Error("Network response was not ok");

                    const data = await response.json();
                    setStore({ user: data });
                    console.log("User data updated in store:", data);
                } catch (error) {
                    console.error("Error loading user from token:", error);
                    setStore({ user: null });
                }
            },
            registerGuardian: async (nombre, apellido, correo_electronico, contrasena, telefono, direccion) => {
                const backendUrl = process.env.BACKEND_URL;
                try {
                    const response = await fetch(`${backendUrl}/api/register/guardian`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json',"Authorization": `Bearer ${sessionStorage.getItem("accessToken")}` },
                        body: JSON.stringify({
                            nombre,
                            apellido,
                            correo_electronico,
                            contrasena,
                            telefono,
                            direccion,
                            rol: 'Apoderado'
                        })
                    });
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.mensaje || `HTTP error! status: ${response.status}`);
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
            registerProfessor: async (nombre, apellido, correo_electronico, contrasena, titulo, especializacion) => {
                const backendUrl = process.env.BACKEND_URL;
                try {
                    const response = await fetch(`${backendUrl}/api/register/teacher`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json',"Authorization": `Bearer ${sessionStorage.getItem("accessToken")}` },
                        body: JSON.stringify({
                            nombre,
                            apellido,
                            correo_electronico,
                            contrasena,
                            titulo,
                            especializacion,
                            rol: 'Profesor'
                        })
                    });
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.mensaje || `HTTP error! status: ${response.status}`);
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

            addAsignatura: async (profesorId, nombreAsignatura) => {
                const backendUrl = process.env.BACKEND_URL;
                if (!profesorId || !nombreAsignatura) {
                    console.error("Profesor ID or Nombre de Asignatura is missing");
                    return;
                }
                try {
                    const response = await fetch(`${backendUrl}/api/asignaturas`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json',"Authorization": `Bearer ${sessionStorage.getItem("accessToken")}` },
                        body: JSON.stringify({
                            id_profesor: profesorId,
                            nombre: nombreAsignatura
                        })
                    });
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.mensaje || `HTTP error! status: ${response.status}`);
                    }

                    const data = await response.json();
                    const store = getStore();
                    setStore({ asignaturas: [...store.asignaturas, data] });
                    console.log("Asignatura added successfully", data);
                    return data;
                } catch (error) {
                    console.error("Error adding asignatura", error);
                    throw error;
                }
            },
            addCalificacion: async (idAlumno, idAsignatura, calificacion) => {
                const backendUrl = process.env.BACKEND_URL;
                if (!idAlumno || !idAsignatura || calificacion === undefined) {
                    console.error("ID de alumno, ID de asignatura y calificación son requeridos");
                    return;
                }
                try {
                    const response = await fetch(`${backendUrl}/api/alumno_asignaturas`, {
                        method: 'POST',
                        mode: 'cors',  // Añadir este campo
                        headers: { 'Content-Type': 'application/json'
                        ,"Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`},
                        body: JSON.stringify({
                            id_alumno: idAlumno,
                            id_asignatura: idAsignatura,
                            calificacion: calificacion
                        })
                    });
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.mensaje || `HTTP error! status: ${response.status}`);
                    }

                    const data = await response.json();
                    const store = getStore();
                    setStore({ calificaciones: [...store.calificaciones, data] });
                    console.log("Calificación añadida con éxito", data);
                    return data;
                } catch (error) {
                    console.error("Error añadiendo calificación", error);
                    throw error;
                }
            },

            generateRecomendacion: async (idAlumno, idAsignatura) => {
                const backendUrl = process.env.BACKEND_URL;
                if (!idAlumno || !idAsignatura) {
                    console.error("ID de alumno, ID de asignatura son requeridos");
                    return;
                }
                try {
                    const response = await fetch(`${backendUrl}/api/gemini`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json',
                            "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`
                         },
                        body: JSON.stringify({
                            id_alumno: idAlumno,
                            id_asignatura: idAsignatura,
                        })
                    });
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.mensaje || `HTTP error! status: ${response.status}`);
                    }

                    const data = await response.json();
                    console.log("Recomendación añadida con éxito", data);
                    return data;
                } catch (error) {
                    console.error("Error añadiendo recomendación", error);
                    throw error;
                }
            },

            obtenerAlumnoAsignaturas: async () => {
                const backendUrl = process.env.BACKEND_URL;
                try {
                    const response = await fetch(`${backendUrl}/api/alumnos_asignaturas_por_apoderados`, {
                        method: "GET",
                        headers: {
                            "content-type": "application/json",
                            "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`
                        }
                    });
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const data = await response.json();
                    setStore({ calificaciones: data });
                    console.log("Calificaciones fetched successfully", data);
                } catch (error) {
                    console.error("Error fetching calificaciones", error);
                }
            },

            obtenerAlumnoAsignaturasProfesor: async () => {
                const backendUrl = process.env.BACKEND_URL;
                try {
                    const response = await fetch(`${backendUrl}/api/alumno_asignaturas`, {
                        method: "GET",
                        headers: {'Content-Type': 'application/json', "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`}
                    });
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const data = await response.json();
                    console.log(data);
                    setStore({ calificaciones: data });
                    console.log("Calificaciones fetched successfully", data);
                } catch (error) {
                    console.error("Error fetching calificaciones", error);
                }
            },

            getProfesores: async () => {
                const backendUrl = process.env.BACKEND_URL;
                try {
                    const response = await fetch(`${backendUrl}/api/teachers`, {
                        method: 'GET',
                        headers: { "content-type": "application/json",
                            "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}` }
                    });
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.mensaje || `HTTP error! status: ${response.status}`);
                    }

                    const data = await response.json();
                    return data;
                } catch (error) {
                    console.error("Error fetching profesores", error);
                    throw error;
                }
            },
            getApoderados: async () => {
                const backendUrl = process.env.BACKEND_URL;
                try {
                    const response = await fetch(`${backendUrl}/api/guardians`, {
                        method: 'GET',
                        headers: { "content-type": "application/json",
                            "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}` }
                    });
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.mensaje || `HTTP error! status: ${response.status}`);
                    }

                    const data = await response.json();
                    setStore({ apoderados: data });
                    return data;
                } catch (error) {
                    console.error("Error fetching apoderados", error);
                    throw error;
                }
            },
            getAsignaturas: async () => {
                const backendUrl = process.env.BACKEND_URL;
                try {
                    const response = await fetch(`${backendUrl}/api/asignaturas`, {
                        method: 'GET',
                        headers: { "content-type": "application/json",
                            "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}` }
                    });
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.mensaje || `HTTP error! status: ${response.status}`);
                    }

                    const data = await response.json();
                    setStore({ asignaturas: data });
                    return data;
                } catch (error) {
                    console.error("Error fetching asignaturas", error);
                    throw error;
                }
            },

            registerAlumno: async (nombre, apellido, idApoderado, estaActivo = false) => {
                const backendUrl = process.env.BACKEND_URL;
                if (!nombre || !apellido || !idApoderado) {
                    console.error("Nombre, apellido e ID del apoderado son requeridos");
                    return;
                }
                try {
                    const response = await fetch(`${backendUrl}/api/alumnos`, {
                        method: 'POST',
                        headers: { "content-type": "application/json",
                            "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}` },
                        body: JSON.stringify({
                            nombre,
                            apellido,
                            id_apoderado: idApoderado,
                            esta_activo: estaActivo
                        })
                    });
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.mensaje || `HTTP error! status: ${response.status}`);
                    }

                    const data = await response.json();
                    const store = getStore();
                    setStore({ alumnos: [...store.alumnos, data] });
                    console.log("Alumno registrado con éxito", data);
                    return data;
                } catch (error) {
                    console.error("Error registrando alumno", error);
                    throw error;
                }
            },
            getAlumnos: async () => {
                const backendUrl = process.env.BACKEND_URL;
                try {
                    const response = await fetch(`${backendUrl}/api/alumnos`, {
                        method: 'GET',
                        headers: { "content-type": "application/json",
                            "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}` }
                    });
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.mensaje || `HTTP error! status: ${response.status}`);
                    }

                    const data = await response.json();
                    setStore({ alumnos: data });
                    return data;
                } catch (error) {
                    console.error("Error fetching alumnos", error);
                    throw error;
                }
            },

        }
    };
};

export default getState;