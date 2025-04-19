
export const useTenant = () => {
  // En desarrollo puedes usar un valor por defecto
  if (process.env.NODE_ENV === 'development') {
    return 'dev'; // Cambia esto según necesites para desarrollo
  }

  // En producción obtiene el subdominio
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    const parts = host.split('.');
    if (parts.length > 2) {
      return parts[0];
    }
  }

  return null;
};