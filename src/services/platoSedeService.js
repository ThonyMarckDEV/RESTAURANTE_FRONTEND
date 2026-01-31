import { fetchWithAuth } from 'js/authToken'; 
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse'; 

const BASE_URL = `${API_BASE_URL}/api/plato-sede`;

export const getPlatosPorSede = async (sedeId, page = 1, filters = {}) => {
  const params = new URLSearchParams({
    page: page - 1,
    size: 6
  });

  if (filters.search) params.append('search', filters.search);
  if (filters.categoriaId) params.append('categoriaId', filters.categoriaId);
  if (filters.minPrecio) params.append('minPrecio', filters.minPrecio);
  if (filters.maxPrecio) params.append('maxPrecio', filters.maxPrecio);

  const response = await fetchWithAuth(`${BASE_URL}/sede/${sedeId}?${params.toString()}`);
  return handleResponse(response);
};

export const asignarPlatoASede = async (sedeId, platoId) => {
  const response = await fetchWithAuth(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sedeId, platoId }) 
  });
  return handleResponse(response);
};

export const eliminarPlatoDeSede = async (id) => {
  const response = await fetchWithAuth(`${BASE_URL}/${id}`, { method: 'DELETE' });
  return handleResponse(response);
};