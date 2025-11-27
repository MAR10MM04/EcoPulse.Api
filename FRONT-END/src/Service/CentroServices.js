// src/services/CentroAcopioService.js

const API_URL = "http://localhost:5153/api/CentroAcopio";

//
// 🛡️ Helper con token automático
//
const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (!response.ok) {
        let errorMessage = "Error en la solicitud";

        try {
            const err = await response.json();
            errorMessage = err.message || err.title || errorMessage;
        } catch {
            errorMessage = `Error ${response.status}: ${response.statusText}`;
        }

        throw new Error(errorMessage);
    }

    if (response.status === 204) return null;

    return response.json();
};


//
// 🔄 TRANSFORMADOR (Backend → Frontend)
//
const transformCentro = (c) => ({
    IdCentroAcopio: c.idCentroAcopio,
    Nombre: c.nombre,
    Latitud: c.latitud,
    Longitud: c.longitud,
    Telefono: c.telefono,
    HorarioAtencion: c.horarioAtencion,
    IdUsuario: c.idUsuario
});

//
// 📌 GET: Todos los centros
//
export const getCentros = async () => {
    const data = await fetchWithAuth(API_URL);
    return data.map(transformCentro);
};

//
// 📌 GET: Centro por ID
//
export const getCentroById = async (id) => {
    const data = await fetchWithAuth(`${API_URL}/${id}`);
    return transformCentro(data);
};

//
// 📌 GET: Centro por Usuario
//
export const getCentroByUsuario = async (idUsuario) => {
    const data = await fetchWithAuth(`${API_URL}/usuario/${idUsuario}`);
    return {
        Nombre: data.nombre,
        Latitud: data.latitud,
        Longitud: data.longitud,
        Telefono: data.telefono,
        HorarioAtencion: data.horarioAtencion,
        IdUsuario: data.idUsuario
    };
};

//
// 📌 POST: Crear centro
//
export const createCentro = async (centroData) => {
    const body = {
        Nombre: centroData.Nombre,
        Latitud: centroData.Latitud,
        Longitud: centroData.Longitud,
        Telefono: centroData.Telefono,
        HorarioAtencion: centroData.HorarioAtencion,
        IdUsuario: centroData.IdUsuario,
    };

    return await fetchWithAuth(API_URL, {
        method: "POST",
        body: JSON.stringify(body),
    });
};

//
// 📌 PUT: Actualizar centro
//
export const updateCentro = async (id, centroData) => {
    const body = {
        Nombre: centroData.Nombre,
        Latitud: centroData.Latitud,
        Longitud: centroData.Longitud,
        Telefono: centroData.Telefono,
        HorarioAtencion: centroData.HorarioAtencion,
    };

    await fetchWithAuth(`${API_URL}/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
    });

    return true;
};

//
// 📌 DELETE: Eliminar centro
//
export const deleteCentro = async (id) => {
    await fetchWithAuth(`${API_URL}/${id}`, {
        method: "DELETE",
    });

    return id;
};
