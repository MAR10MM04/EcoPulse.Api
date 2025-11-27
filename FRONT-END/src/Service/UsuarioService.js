// src/services/UsuarioService.js

const API_URL = 'http://localhost:5153/api/Usuario';

const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem('token');

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
        let errorMessage = 'Error en la solicitud';

        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.title || errorMessage;
        } catch (err) {
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

const transformUsuario = (u) => {
    return {
        IdUsuario: u.idUsuario,
        Nombre: u.nombre,
        Email: u.email,
        Rol: u.rol,
        PuntosTotales: u.puntosTotales,

        // ⭐ NUEVOS CAMPOS DE RANGO
        Rango: u.rango,
        ProgresoRango: u.progresoRango,
        SiguienteRango: u.siguienteRango,
        ColorRango: u.colorRango,
        IconoRango: u.iconoRango,

        TotalEntregas: u.totalEntregas,
        PuntosPromedioPorEntrega: u.puntosPromedioPorEntrega,

        CentroAcopio: u.centroAcopio
            ? {
                IdCentroAcopio: u.centroAcopio.idCentroAcopio,
                Nombre: u.centroAcopio.nombre,
            }
            : null,
    };
};

const transformUsuarioDetail = (u) => {
    return {
        IdUsuario: u.idUsuario,
        Nombre: u.nombre,
        Email: u.email,
        Rol: u.rol,
        PuntosTotales: u.puntosTotales,

        // ⭐ NUEVOS CAMPOS DE RANGO
        Rango: u.rango,
        ProgresoRango: u.progresoRango,
        SiguienteRango: u.siguienteRango,
        ColorRango: u.colorRango,
        IconoRango: u.iconoRango,

        CentroAcopio: u.centroAcopio ?? null,
        Entregas: u.entregas ?? [],
    };
};

/* -----------------------------------------
   📌 ENDPOINTS
----------------------------------------- */

// GET: usuarios
export const getUsuarios = async () => {
    const data = await fetchWithAuth(API_URL);
    return data.map(transformUsuario);
};

// GET: usuario por ID
export const getUsuarioById = async (id) => {
    const data = await fetchWithAuth(`${API_URL}/${id}`);
    return transformUsuarioDetail(data);
};

// GET: información de rango de un usuario
export const getUsuarioRango = async (id) => {
    return await fetchWithAuth(`${API_URL}/${id}/rango`);
};

// POST: crear usuario
export const createUsuario = async (usuarioData) => {
    const body = {
        Nombre: usuarioData.Nombre,
        Email: usuarioData.Email,
        Password: usuarioData.Password,
    };

    const data = await fetchWithAuth(API_URL, {
        method: 'POST',
        body: JSON.stringify(body),
    });

    return transformUsuario(data);
};

// PUT: actualizar usuario
export const updateUsuario = async (id, usuarioData) => {
    const body = {
        Nombre: usuarioData.Nombre,
        Email: usuarioData.Email,
        Rol: usuarioData.Rol,
    };

    await fetchWithAuth(`${API_URL}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
    });

    return true;
};

// DELETE: eliminar usuario
export const deleteUsuario = async (id) => {
    await fetchWithAuth(`${API_URL}/${id}`, { method: 'DELETE' });
    return id;
};

// POST: login
export const loginUsuario = async (email, password) => {
    const data = await fetchWithAuth(`${API_URL}/login`, {
        method: 'POST',
        body: JSON.stringify({ Email: email, Password: password }),
    });

    // Guardar token
    if (data.token) {
        localStorage.setItem('token', data.token);
    }

    // 🔄 devolvemos usuario + rango incluido
    return {
        Token: data.token,
        Usuario: {
            ...data.usuarioResponse,
        },
    };
};
