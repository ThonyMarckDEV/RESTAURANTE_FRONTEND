import { fetchWithAuth } from 'js/authToken'; 
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse'; 

export const createCaja = async (data) => {
  const url = `${API_BASE_URL}/api/cajas`;
  const response = await fetchWithAuth(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
};

export const getCajas = async (pageNumber = 1, search = '', status = '') => {
  const params = new URLSearchParams({
    page: pageNumber - 1,
    size: 6, 
  });

  if (search.trim()) params.append('search', search);
  if (status !== null && status !== '') params.append('status', status);

  const response = await fetchWithAuth(`${API_BASE_URL}/api/cajas?${params.toString()}`, { 
    method: 'GET', 
    headers: { 'Accept': 'application/json' } 
  });

  return handleResponse(response);
};

export const showCaja = async (id) => {
  const url = `${API_BASE_URL}/api/cajas/${id}`;
  const response = await fetchWithAuth(url, { method: 'GET' });
  return handleResponse(response);
};

export const updateCaja = async (id, data) => {
  const url = `${API_BASE_URL}/api/cajas/${id}`;
  const response = await fetchWithAuth(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
};

export const toggleCajaEstado = async (id) => {
    const url = `${API_BASE_URL}/api/cajas/${id}/status`;
    const response = await fetchWithAuth(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
    });
    return handleResponse(response);
};