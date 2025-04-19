import { useAuth } from '@/contexts/AuthContext';


interface PermissionHook {
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  getPermissions: () => string[];
}

export const usePermissions = (): PermissionHook => {
  const { token } = useAuth();
  
  // Decodifica el token JWT (parte del payload)
  const decodeJWT = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(window.atob(base64));
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  };

  // Obtiene los permisos del token
  const getPermissionsFromToken = () => {
    if (!token) return [];
    
    const decoded = decodeJWT(token);
    if (!decoded || !decoded.permissions) return [];
    
    // Asegúrate de que permissions es un array
    return Array.isArray(decoded.permissions) 
      ? decoded.permissions 
      : [decoded.permissions];
  };

  // Verifica si tiene un permiso específico
  const hasPermission = (permission: string) => {
     
    
    const permissions = getPermissionsFromToken();
    return permissions.includes(permission);
  };

  // Verifica si tiene al menos uno de los permisos
  const hasAnyPermission = (permissions: string[]) => {
    const userPermissions = getPermissionsFromToken();
    return permissions.some(permission => userPermissions.includes(permission));
  };

  // Verifica si tiene todos los permisos
  const hasAllPermissions = (permissions: string[]) => {
    const userPermissions = getPermissionsFromToken();
    return permissions.every(permission => userPermissions.includes(permission));
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    getPermissions: getPermissionsFromToken,
  };
};