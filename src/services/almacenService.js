import { fetchWithAuth } from 'js/authToken'; 
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse'; 

const BASE_URL = `${API_BASE_URL}/api/almacenes`;

// Listar paginado
export const getAlmacenes = async (pageNumber = 1, search = '') => {
  const params = new URLSearchParams({
    page: pageNumber - 1,
    size: 8,
  });
  if (search.trim()) params.append('search', search);

  const response = await fetchWithAuth(`${BASE_URL}?${params.toString()}`, { 
    method: 'GET', 
    headers: { 'Accept': 'application/json' } 
  });
  return handleResponse(response);
};

// Crear
export const createAlmacen = async (data) => {
  const response = await fetchWithAuth(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
};

// Obtener por ID
export const showAlmacen = async (id) => {
  const response = await fetchWithAuth(`${BASE_URL}/${id}`, { method: 'GET' });
  return handleResponse(response);
};

// Actualizar
export const updateAlmacen = async (id, data) => {
  const response = await fetchWithAuth(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
};

// Cambiar estado
export const toggleAlmacenEstado = async (id) => {
    const response = await fetchWithAuth(`${BASE_URL}/${id}/status`, {
        method: 'PATCH',
        headers: { 'Accept': 'application/json' }
    });
    return handleResponse(response);
};