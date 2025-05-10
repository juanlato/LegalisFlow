// lib/api/roles.ts
import api, { getApiHeaders } from '@/lib/api';
import { useTenant } from '@/hooks/useTenant';
import { PaginatedResponse } from '../interface/PaginatedResponse';

export interface GetRolesParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface RoleResponse {
  id: string;
  name: string;
  permissions: {
    id: string;
    name: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export const getRoles = async (
  params: GetRolesParams = {},
): Promise<PaginatedResponse<RoleResponse>> => {
  const tenant = useTenant();
  const response = await api.get<PaginatedResponse<RoleResponse>>('/roles', {
    headers: getApiHeaders(tenant),
    params: {
      ...params,
    },
  });
  return response.data;
};

export const createRole = async (data: { name: string; permissionIds?: string[] }) => {
  const tenant = useTenant();
  const response = await api.post('/roles', data, {
    headers: getApiHeaders(tenant),
  });
  return response.data;
};

export const updateRole = async (id: string, data: { name?: string; permissionIds?: string[] }) => {
  const tenant = useTenant();
  const response = await api.patch(`/roles/${id}`, data, {
    headers: getApiHeaders(tenant),
  });
  return response.data;
};

export const deleteRole = async (id: string) => {
  const tenant = useTenant();
  await api.delete(`/roles/${id}`, {
    headers: getApiHeaders(tenant),
  });
};

export const assignPermissions = async (roleId: string, data: { permissionIds: string[] }) => {
  const tenant = useTenant();
  const response = await api.patch(`/roles/${roleId}/assign-permissions`, data, {
    headers: getApiHeaders(tenant),
  });
  return response.data;
};

export const getMePermissions = async (): Promise<{ data: string[] }> => {
  const tenant = useTenant();
  const response = await api.get('/roles/me/permissions', {
    headers: getApiHeaders(tenant),
  });
  const data = Array.isArray(response.data) ? response.data : [];
  return { data };
};
