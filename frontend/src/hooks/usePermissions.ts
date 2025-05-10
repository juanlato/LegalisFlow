import { useAuth } from '@/contexts/AuthContext';
import { getMePermissions } from '@/lib/api/roles';
import { useState, useEffect, useCallback } from 'react';

interface PermissionHook {
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  getPermissions: () => string[];
  refreshPermissions: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const usePermissions = (): PermissionHook => {
  const { isAuthenticated } = useAuth();
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPermissions = useCallback(async () => {
    if (!isAuthenticated) {
      setPermissions([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // Usamos el nuevo endpoint
      const response = await getMePermissions();

      if (Array.isArray(response.data)) {
        setPermissions(response.data);
      } else {
        console.error('Formato de permisos inesperado:', response.data);
        setPermissions([]);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching permissions:', err);
      setError('No se pudieron cargar los permisos');
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  // Función para refrescar permisos manualmente (útil después de cambios de rol)
  const refreshPermissions = async () => {
    await fetchPermissions();
  };

  // Verifica si tiene un permiso específico
  const hasPermission = (permission: string) => {
    return permissions.includes(permission);
  };

  // Verifica si tiene al menos uno de los permisos
  const hasAnyPermission = (permissions: string[]) => {
    return permissions.some((permission) => hasPermission(permission));
  };

  // Verifica si tiene todos los permisos
  const hasAllPermissions = (permissions: string[]) => {
    return permissions.every((permission) => hasPermission(permission));
  };

  // Obtiene todos los permisos del usuario
  const getPermissions = () => {
    return [...permissions];
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    getPermissions,
    refreshPermissions,
    loading,
    error,
  };
};
