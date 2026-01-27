import { fetchWithAuth } from 'js/authToken'; 
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse'; 

const BASE_URL = `${API_BASE_URL}/api/insumos`;

// Listar paginado
export const getInsumos = async (pageNumber = 1, filters = {}) => {
  const params = new URLSearchParams({
    page: pageNumber - 1,
    size: 6,
  });

  // Agregamos filtros si existen
  if (filters.search) params.append('search', filters.search);
  if (filters.categoriaId) params.append('categoriaId', filters.categoriaId);
  if (filters.unidad) params.append('unidad', filters.unidad);
  if (filters.minPrecio) params.append('minPrecio', filters.minPrecio);
  if (filters.maxPrecio) params.append('maxPrecio', filters.maxPrecio);
  if (filters.estado !== '') params.append('estado', filters.estado); // 0 o 1

  const response = await fetchWithAuth(`${BASE_URL}?${params.toString()}`, { 
    method: 'GET', 
    headers: { 'Accept': 'application/json' } 
  });
  return handleResponse(response);
};

// Crear
export const createInsumo = async (data) => {
  const response = await fetchWithAuth(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
};

// Obtener por ID
export const showInsumo = async (id) => {
  const response = await fetchWithAuth(`${BASE_URL}/${id}`, { method: 'GET' });
  return handleResponse(response);
};

// Actualizar
export const updateInsumo = async (id, data) => {
  const response = await fetchWithAuth(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
};

// Cambiar estado
export const toggleInsumoEstado = async (id) => {
    const response = await fetchWithAuth(`${BASE_URL}/${id}/status`, {
        method: 'PATCH',
        headers: { 'Accept': 'application/json' }
    });
    return handleResponse(response);
};