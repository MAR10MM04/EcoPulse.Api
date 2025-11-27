// src/services/MaterialService.js

const API_URL = "http://localhost:5153/api/Material";

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
            const err = await response.json();
            errorMessage = err.message || err.title || errorMessage;
        } catch (e) {
            errorMessage = `Error ${response.status}: ${response.statusText}`;
        }

        throw new Error(errorMessage);
    }

    if (response.status === 204) return null;

    return response.json();
};

/* -----------------------------------------
   🔄 TRANSFORMADORES (Backend → Frontend)
----------------------------------------- */
const transformMaterial = (m) => ({
    IdMaterial: m.idMaterial,
    Nombre: m.nombre,
    FactorPuntos: m.factorPuntos,
});

/* -----------------------------------------
   📌 ENDPOINTS
----------------------------------------- */

// GET: materiales
export const getMateriales = async () => {
    const data = await fetchWithAuth(API_URL);
    return data.map(transformMaterial);
};

// GET: material por ID
export const getMaterialById = async (id) => {
    const data = await fetchWithAuth(`${API_URL}/${id}`);
    return transformMaterial(data);
};

// POST: crear material
export const createMaterial = async (materialData) => {
    const body = {
        Nombre: materialData.Nombre,
        FactorPuntos: materialData.FactorPuntos,
    };

    const data = await fetchWithAuth(API_URL, {
        method: "POST",
        body: JSON.stringify(body),
    });

    return data;
};

// PUT: actualizar material
export const updateMaterial = async (id, materialData) => {
    const body = {
        Nombre: materialData.Nombre,
        FactorPuntos: materialData.FactorPuntos,
    };

    await fetchWithAuth(`${API_URL}/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
    });

    return true;
};

// DELETE: eliminar material
export const deleteMaterial = async (id) => {
    await fetchWithAuth(`${API_URL}/${id}`, {
        method: "DELETE",
    });

    return id;
};
