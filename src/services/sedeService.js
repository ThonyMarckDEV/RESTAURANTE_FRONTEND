import { fetchWithAuth } from 'js/authToken'; 
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse'; 

export const createSede = async (data) => {
  const url = `${API_BASE_URL}/api/sedes`;
  const response = await fetchWithAuth(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
};

export const getSedes = async (pageNumber = 1, search = '') => {
  const params = new URLSearchParams({
    page: pageNumber - 1,
    size: 10,
  });

  // Solo agregamos el search si realmente tiene contenido
  if (search.trim()) {
    params.append('search', search);
  }

  const url = `${API_BASE_URL}/api/sedes?${params.toString()}`;

  const response = await fetchWithAuth(url, { 
    method: 'GET', 
    headers: { 'Accept': 'application/json' } 
  });

  return handleResponse(response);
};

export const showSede = async (id) => {
  const url = `${API_BASE_URL}/api/sedes/${id}`;
  const response = await fetchWithAuth(url, { method: 'GET' });
  return handleResponse(response);
};

export const updateSede = async (id, data) => {
  const url = `${API_BASE_URL}/api/sedes/${id}`;
  const response = await fetchWithAuth(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
};

export const toggleSedeEstado = async (id, nuevoEstado) => {
    const url = `${API_BASE_URL}/api/sedes/${id}/toggle-status`;
    const response = await fetchWithAuth(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado })
    });
    return handleResponse(response);
};