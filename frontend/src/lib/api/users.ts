import { useTenant } from '@/hooks/useTenant';
import api, { getApiHeaders } from '../api';
import { PaginatedResponse } from '../interface/PaginatedResponse';

export interface User {
  id: string;
  email: string;
  isActive: boolean;
  role: {
    id: string;
    name: string;
  };
}
export interface GetUsersParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  email?: string;
  isActive?: boolean;
  roleId?: string;
}

export interface UserResponse {
  id: string;
  email: string;
  isActive: boolean;
  role: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const fetchUsers = async (): Promise<User[]> => {
  const tenant = useTenant();
  const response = await api.get('/users', {
    headers: getApiHeaders(tenant),
  });
  return response.data;
};
export const getUsers = async (
  params: GetUsersParams = {},
): Promise<PaginatedResponse<UserResponse>> => {
  try {
    const tenant = useTenant();
    const response = await api.get<PaginatedResponse<UserResponse>>('/users', {
      headers: getApiHeaders(tenant),
      params: {
        ...params,
      },
    });

    const data = Array.isArray(response.data.data) ? response.data.data : [];
    return {
      data: data,
      total: response.data.total,
      page: params.page || 1,
      limit: params.limit || 10,
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const createUser = async (userData: {
  email: string;
  password: string;
  roleId: string;
}): Promise<User> => {
  const tenant = useTenant();
  const response = await api.post('/users', userData, {
    headers: getApiHeaders(tenant),
  });
  return response.data;
};

export const updateUser = async (
  id: string,
  userData: {
    email?: string;
    isActive?: boolean;
    roleId?: string;
  },
): Promise<User> => {
  const tenant = useTenant();
  const response = await api.patch(`/users/${id}`, userData, {
    headers: getApiHeaders(tenant),
  });
  return response.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  const tenant = useTenant();
  await api.delete(`/users/${id}`, {
    headers: getApiHeaders(tenant),
  });
};

export const assignRole = async (userId: string, roleId: string) => {
  const tenant = useTenant();
  const response = await api.patch(`/users/${userId}/assign-role/${roleId}`,{}, {
    headers: getApiHeaders(tenant),
  });
  return response.data;
};
