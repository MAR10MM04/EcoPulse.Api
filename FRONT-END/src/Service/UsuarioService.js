// src/services/UsuarioService.js

const API_URL = 'http://localhost:5153/api/Usuario';

const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem('token');

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });

    // Manejo de errores uniforme
    if (!response.ok) {
        let errorMessage = 'Error en la solicitud';

        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.title || errorMessage;
        } catch (e) {
            errorMessage = `Error ${response.status}: ${response.statusText}`;
        }

        throw new Error(errorMessage);
    }

    if (response.status === 204) return null;

    return response.json();
};

// 🔄 Transformar datos del backend → frontend
const transformUsuario = (u) => {
    return {
        IdUsuario: u.idUsuario,
        Nombre: u.nombre,
        Email: u.email,
        Rol: u.rol,
        PuntosTotales: u.puntosTotales,
        TotalEntregas: u.totalEntregas,
        PuntosPromedioPorEntrega: u.puntosPromedioPorEntrega,
        CentroAcopio: u.centroAcopio
            ? {
                IdCentroAcopio: u.centroAcopio.idCentroAcopio,
                Nombre: u.centroAcopio.nombre,
                Direccion: u.centroAcopio.direccion,
                Ciudad: u.centroAcopio.ciudad,
                Telefono: u.centroAcopio.telefono,
                HorarioAtencion: u.centroAcopio.horarioAtencion,
                Estado: u.centroAcopio.estado,
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
        CentroAcopio: u.centroAcopio ?? null,
        Entregas: u.entregas ?? [],
    };
};
// GET todos los usuarios
export const getUsuarios = async () => {
    const data = await fetchWithAuth(API_URL);
    return data.map(transformUsuario);
};

// GET usuario por ID
export const getUsuarioById = async (id) => {
    const data = await fetchWithAuth(`${API_URL}/${id}`);
    return transformUsuarioDetail(data);
};

// POST crear usuario
export const createUsuario = async (usuarioData) => {
    const dataToSend = {
        Nombre: usuarioData.Nombre,
        Email: usuarioData.Email,
        Password: usuarioData.Password,
    };

    const data = await fetchWithAuth(API_URL, {
        method: 'POST',
        body: JSON.stringify(dataToSend),
    });

    return transformUsuario(data);
};

// PUT actualizar usuario
export const updateUsuario = async (id, usuarioData) => {
    const dataToSend = {
        Nombre: usuarioData.Nombre,
        Email: usuarioData.Email,
        Rol: usuarioData.Rol,
    };

    await fetchWithAuth(`${API_URL}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(dataToSend),
    });

    return true;
};

// DELETE eliminar usuario
export const deleteUsuario = async (id) => {
    await fetchWithAuth(`${API_URL}/${id}`, {
        method: 'DELETE',
    });

    return id;
};

// POST login
export const loginUsuario = async (email, password) => {
    const data = await fetchWithAuth(`${API_URL}/login`, {
        method: 'POST',
        body: JSON.stringify({ Email: email, Password: password }),
    });

    // Guardar token en localStorage
    if (data.token) {
        localStorage.setItem('token', data.token);
    }

    return data;
};
