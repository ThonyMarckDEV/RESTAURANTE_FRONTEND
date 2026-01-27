import { fetchWithAuth } from 'js/authToken'; 
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse'; 

const BASE_URL = `${API_BASE_URL}/api/categorias`;

export const getCategorias = async (pageNumber = 1, search = '', type = '', status = '') => {
  const params = new URLSearchParams({
    page: pageNumber - 1,
    size: 8,
  });
  
  // Filtro por búsqueda de texto
  if (search && search.trim()) {
    params.append('search', search);
  }
  
  // Filtro por Tipo (1, 2, 3, 4)
  if (type !== null && type !== undefined && type !== '') {
    params.append('type', type);
  }

  // Filtro por Estado (0 o 1)
  if (status !== null && status !== undefined && status !== '') {
    params.append('status', status);
  }

  const response = await fetchWithAuth(`${BASE_URL}?${params.toString()}`, { 
    method: 'GET', 
    headers: { 
      'Accept': 'application/json' 
    } 
  });

  return handleResponse(response);
};

export const createCategoria = async (data) => {
  const response = await fetchWithAuth(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
};

export const showCategoria = async (id) => {
  const response = await fetchWithAuth(`${BASE_URL}/${id}`, { method: 'GET' });
  return handleResponse(response);
};

export const updateCategoria = async (id, data) => {
  const response = await fetchWithAuth(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(response);
};

export const toggleCategoriaEstado = async (id) => {
    const response = await fetchWithAuth(`${BASE_URL}/${id}/status`, {
        method: 'PATCH',
        headers: { 'Accept': 'application/json' }
    });
    return handleResponse(response);
};