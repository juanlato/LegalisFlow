// lib/api/permissions.ts
import api from '@/lib/api';

export interface Permission {
  id: string;
  code: string;
  description?: string; 
}

export const getPermissions = async (): Promise<{ data: Permission[] }> => {
  const response = await api.get('/permissions');
  const data = Array.isArray(response.data) ? response.data : []; 
  return { data };
};