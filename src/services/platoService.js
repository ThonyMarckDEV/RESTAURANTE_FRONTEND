import { fetchWithAuth } from 'js/authToken'; 
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse'; 

const BASE_URL = `${API_BASE_URL}/api/platos`;

// Listar paginado
export const getPlatos = async (pageNumber = 1, filters = {}) => {
  const params = new URLSearchParams({
    page: pageNumber - 1,
    size: 6,
  });

  if (filters.search) params.append('search', filters.search);
  if (filters.estado !== undefined) params.append('estado', filters.estado);
  
  // Si enviamos este filtro, el backend excluirá los asignados
  if (filters.notInSedeId) params.append('notInSedeId', filters.notInSedeId);

  const response = await fetchWithAuth(`${BASE_URL}?${params.toString()}`, { 
    method: 'GET' 
  });
  return handleResponse(response);
};

// Crear
export const createPlato = async (data) => {
  const response = await fetchWithAuth(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
};

// Obtener por ID
export const showPlato = async (id) => {
  const response = await fetchWithAuth(`${BASE_URL}/${id}`, { method: 'GET' });
  return handleResponse(response);
};

// Actualizar
export const updatePlato = async (id, data) => {
  const response = await fetchWithAuth(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
};

// Cambiar estado
export const togglePlatoEstado = async (id) => {
    const response = await fetchWithAuth(`${BASE_URL}/${id}/status`, {
        method: 'PATCH',
        headers: { 'Accept': 'application/json' }
    });
    return handleResponse(response);
};