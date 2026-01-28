import { fetchWithAuth } from 'js/authToken'; 
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse'; 

const BASE_URL = `${API_BASE_URL}/api/compras-insumos`;

// Listar
export const getComprasInsumos = async (pageNumber = 1, search = '', fechaInicio = '', fechaFin = '') => {
  const params = new URLSearchParams({
    page: pageNumber - 1,
    size: 10, // Las tablas de compras suelen necesitar más filas
  });

  if (search.trim()) params.append('search', search);
  if (fechaInicio) params.append('fechaInicio', fechaInicio);
  if (fechaFin) params.append('fechaFin', fechaFin);

  const response = await fetchWithAuth(`${BASE_URL}?${params.toString()}`, { 
    method: 'GET', 
    headers: { 'Accept': 'application/json' } 
  });
  return handleResponse(response);
};

// Crear (Esta es la más importante para stock)
export const createCompraInsumo = async (data) => {
  const response = await fetchWithAuth(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
};

// Obtener detalles (Para ver la factura/boleta)
export const showCompraInsumo = async (id) => {
  const response = await fetchWithAuth(`${BASE_URL}/${id}`, { method: 'GET' });
  return handleResponse(response);
};

export const updateCompraInsumo = async (id, data) => {
  const response = await fetchWithAuth(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
};