import { fetchWithAuth } from 'js/authToken'; 
import API_BASE_URL from 'js/urlHelper';
import { handleResponse } from 'utilities/Responses/handleResponse'; 

const BASE_URL = `${API_BASE_URL}/api/inventario-insumos`;

export const getInventarioInsumos = async (pageNumber = 1, search = '', almacenId = '') => {
  const params = new URLSearchParams({
    page: pageNumber - 1,
    size: 6, 
  });

  if (search) params.append('search', search);
  if (almacenId) params.append('almacenId', almacenId);

  const response = await fetchWithAuth(`${BASE_URL}?${params.toString()}`, { 
    method: 'GET', 
    headers: { 'Accept': 'application/json' } 
  });
  return handleResponse(response);
};