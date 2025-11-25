// src/services/CentroAcopioService.js

const API_URL = "http://localhost:5153/api/CentroAcopio";

// Helper para incluir token automáticamente
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

    // Manejo global de errores
    if (!response.ok) {
        let errorMessage = "Error en la solicitud";

        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.title || errorMessage;
        } catch {
            errorMessage = `Error ${response.status}: ${response.statusText}`;
        }

        throw new Error(errorMessage);
    }

    if (response.status === 204) return null;

    return response.json();
};

//
// 🔄 TRANSFORMADORES (Backend → Frontend)
//
const transformCentro = (c) => {
    return {
        IdCentroAcopio: c.idCentroAcopio,
        Nombre: c.nombre,
        Direccion: c.direccion,
        Telefono: c.telefono,
        HorarioAtencion: c.horarioAtencion,
        Ciudad: c.ciudad,
        Estado: c.estado,
        IdUsuario: c.idUsuario,
        IdMaterial: c.idMaterial,
        NombreUsuario: c.nombreUsuario,
        NombreMaterial: c.nombreMaterial,
    };
};

const transformCentroDetail = (c) => {
    return {
        IdCentroAcopio: c.idCentroAcopio,
        Nombre: c.nombre,
        Direccion: c.direccion,
        Telefono: c.telefono,
        HorarioAtencion: c.horarioAtencion,
        Ciudad: c.ciudad,
        Estado: c.estado,
        IdUsuario: c.idUsuario,
        IdMaterial: c.idMaterial,
        NombreUsuario: c.nombreUsuario,
        NombreMaterial: c.nombreMaterial,
        // Si necesitas entregas:
        // Entregas: c.entregas ?? []
    };
};

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
    return transformCentroDetail(data);
};

//
// 📌 POST: Crear centro
//
export const createCentro = async (centroData) => {
    const toSend = {
        Nombre: centroData.Nombre,
        Direccion: centroData.Direccion,
        Telefono: centroData.Telefono,
        HorarioAtencion: centroData.HorarioAtencion,
        Ciudad: centroData.Ciudad,
        Estado: centroData.Estado,
        IdUsuario: centroData.IdUsuario,
        IdMaterial: centroData.IdMaterial,
    };

    const data = await fetchWithAuth(API_URL, {
        method: "POST",
        body: JSON.stringify(toSend),
    });

    return data;
};

//
// 📌 PUT: Actualizar centro
//
export const updateCentro = async (id, centroData) => {
    const toSend = {
        Nombre: centroData.Nombre,
        Direccion: centroData.Direccion,
        Telefono: centroData.Telefono,
        HorarioAtencion: centroData.HorarioAtencion,
        Ciudad: centroData.Ciudad,
        Estado: centroData.Estado,
        IdMaterial: centroData.IdMaterial,
    };

    await fetchWithAuth(`${API_URL}/${id}`, {
        method: "PUT",
        body: JSON.stringify(toSend),
    });

    return true;
};
// 📌 DELETE: Eliminar centro
export const deleteCentro = async (id) => {
    await fetchWithAuth(`${API_URL}/${id}`, {
        method: "DELETE",
    });

    return id;
};
