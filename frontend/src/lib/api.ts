import axios from 'axios';
import config from './config';

// Crea una instancia básica de Axios sin el interceptor del tenant
const api = axios.create({
  baseURL: config.apiUrl,
});

// Función para obtener los headers con el tenant
export const getApiHeaders = (tenant: string | null, token?: string | null) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  // Añadir tenant si existe
  if (tenant) {
    headers['x-tenant-subdomain'] = tenant;
  }

  // Usar el token proporcionado o buscarlo en localStorage
  const authToken = token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  return headers;
};

// Configurar interceptores globales para manejar errores comunes
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Manejar errores comunes como 401 (no autorizado)
    if (error.response?.status === 401) {
      // Solo ejecutar en el cliente
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        // Si estamos en una aplicación cliente, podemos redirigir
        window.location.href = '/login';
      }
    }

    // Para errores 500, podríamos mostrar una notificación genérica
    if (error.response?.status >= 500) {
      console.error('Error del servidor:', error.response?.data || error.message);
    }

    return Promise.reject(error);
  },
);

export default api;
