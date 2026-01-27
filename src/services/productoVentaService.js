import { fetchWithAuth } from 'js/authToken'; 
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse'; 

const BASE_URL = `${API_BASE_URL}/api/productos-venta`;

// Listar paginado
export const getProductosVenta = async (pageNumber = 1, search = '', categoriaId = '', estado = '') => {
  const params = new URLSearchParams({
    page: pageNumber - 1,
    size: 6,
  });

  if (search.trim()) params.append('search', search);
  if (categoriaId) params.append('categoriaId', categoriaId);
  
  if (estado !== '') {
      params.append('estado', estado === '1' ? 'true' : 'false');
  }

  const response = await fetchWithAuth(`${BASE_URL}?${params.toString()}`, { 
    method: 'GET', 
    headers: { 'Accept': 'application/json' } 
  });
  return handleResponse(response);
};

// Crear
export const createProductoVenta = async (data) => {
  const response = await fetchWithAuth(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
};

// Obtener por ID
export const showProductoVenta = async (id) => {
  const response = await fetchWithAuth(`${BASE_URL}/${id}`, { method: 'GET' });
  return handleResponse(response);
};

// Actualizar
export const updateProductoVenta = async (id, data) => {
  const response = await fetchWithAuth(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
};

// Cambiar estado
export const toggleProductoVentaEstado = async (id) => {
    const response = await fetchWithAuth(`${BASE_URL}/${id}/status`, {
        method: 'PATCH',
        headers: { 'Accept': 'application/json' }
    });
    return handleResponse(response);
};