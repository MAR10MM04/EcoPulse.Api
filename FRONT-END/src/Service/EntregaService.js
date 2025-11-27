// src/services/EntregaService.js

const API_URL = "http://localhost:5153/api/Entrega";

/* -----------------------------------------
   🛡️ FETCH con autenticación
----------------------------------------- */
const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    if (token) headers["Authorization"] = `Bearer ${token}`;

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
        let errorMessage = "Error en la solicitud";

        try {
            const errData = await response.json();
            errorMessage = errData.message || errData.title || errorMessage;
        } catch (err) {
            errorMessage = `Error ${response.status}: ${response.statusText}`;
        }

        throw new Error(errorMessage);
    }

    if (response.status === 204) return null;
    return response.json();
};

/* -----------------------------------------
   🔄 TRANSFORMADORES
----------------------------------------- */

// Lista de entregas (GET ALL)
const transformEntregaList = (e) => ({
    IdEntrega: e.idEntrega,
    Cantidad: e.cantidad,
    FechaEntrega: e.fechaEntrega,
    PuntosGenerados: e.puntosGenerados,

    Usuario: e.usuario,
    Material: e.material,
    CentroAcopio: e.centroAcopio,
});

// Obtención de entrega por ID
const transformEntregaDetail = (e) => ({
    IdEntrega: e.idEntrega,
    Cantidad: e.cantidad,
    FechaEntrega: e.fechaEntrega,
    PuntosGenerados: e.puntosGenerados,

    Usuario: e.usuario,
    Material: e.material,
    CentroAcopio: e.centroAcopio,
});

// Respuesta especial del POST con rango + puntos
const transformEntregaRango = (e) => ({
    IdEntrega: e.idEntrega,
    IdUsuario: e.idUsuario,
    Cantidad: e.cantidad,
    FechaEntrega: e.fechaEntrega,
    PuntosGenerados: e.puntosGenerados,

    PuntosTotalesUsuario: e.puntosTotalesUsuario,

    // 🔥 Rango actual del usuario después de la entrega
    RangoActual: e.rangoActual,
    ProgresoRango: e.progresoRango,
    SiguienteRango: e.siguienteRango,
    ColorRango: e.colorRango,
    IconoRango: e.iconoRango,
});

/* -----------------------------------------
   📌 ENDPOINTS
----------------------------------------- */

// GET: entregas
export const getEntregas = async () => {
    const data = await fetchWithAuth(API_URL);
    return data.map(transformEntregaList);
};

// GET: entrega por ID
export const getEntregaById = async (id) => {
    const data = await fetchWithAuth(`${API_URL}/${id}`);
    return transformEntregaDetail(data);
};

// POST: crear entrega (regresa puntos + rango)
export const createEntrega = async (entregaData) => {
    const body = {
        IdUsuario: entregaData.IdUsuario,
        IdMaterial: entregaData.IdMaterial,
        IdCentroAcopio: entregaData.IdCentroAcopio,
        Cantidad: entregaData.Cantidad,
    };

    const data = await fetchWithAuth(API_URL, {
        method: "POST",
        body: JSON.stringify(body),
    });

    // 🔥 Transformamos para entregar rango + puntos
    return transformEntregaRango(data);
};

// PUT: actualizar entrega
export const updateEntrega = async (id, entregaData) => {
    const body = {
        IdUsuario: entregaData.IdUsuario,
        IdMaterial: entregaData.IdMaterial,
        IdCentroAcopio: entregaData.IdCentroAcopio,
        Cantidad: entregaData.Cantidad,
    };

    await fetchWithAuth(`${API_URL}/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
    });

    return true;
};

// DELETE: eliminar entrega (puntos se ajustan automáticamente)
export const deleteEntrega = async (id) => {
    await fetchWithAuth(`${API_URL}/${id}`, {
        method: "DELETE",
    });

    return id;
};
