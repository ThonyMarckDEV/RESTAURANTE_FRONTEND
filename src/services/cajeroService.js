import { fetchWithAuth } from 'js/authToken'; 
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse'; 


const BASE_URL = `${API_BASE_URL}/api/cajeros`;


export const createCajero = async (data) => {
  const url = `${BASE_URL}`;
  const response = await fetchWithAuth(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
};

export const getCajeros = async (pageNumber = 1, search = '', status = '') => {
  const params = new URLSearchParams({
    page: pageNumber - 1,
    size: 6,
  });

  if (search.trim()) params.append('search', search);
  if (status !== null && status !== '') params.append('status', status);

  const response = await fetchWithAuth(`${BASE_URL}?${params.toString()}`, { 
    method: 'GET', 
    headers: { 'Accept': 'application/json' } 
  });

  return handleResponse(response);
};

export const showCajero = async (id) => {
  const url = `${BASE_URL}/${id}`;
  const response = await fetchWithAuth(url, { method: 'GET' });
  return handleResponse(response);
};

export const updateCajero = async (id, data) => {
  const url = `${BASE_URL}/${id}`;
  const response = await fetchWithAuth(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
};

export const toggleCajeroEstado = async (id) => {
    const url = `${BASE_URL}/${id}/status`;
    const response = await fetchWithAuth(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
    });
    return handleResponse(response);
};