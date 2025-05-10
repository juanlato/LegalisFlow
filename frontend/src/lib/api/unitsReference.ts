import api, { getApiHeaders } from '@/lib/api';
import { useTenant } from '@/hooks/useTenant';
import { PaginatedResponse } from '../interface/PaginatedResponse';

export interface GetUnitsReferenceParams {
  page?: number;
  limit?: number;
  search?: string;
  currencyId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UnitReferenceResponse {
  id: string;
  code: string;
  name: string;
  value: number;
  currency: {
    id: string;
    code: string;
    name: string;
    symbol?: string;
  };
}

export const getUnitsReference = async (
  params: GetUnitsReferenceParams = {},
): Promise<PaginatedResponse<UnitReferenceResponse>> => {
  const tenant = useTenant();
  const response = await api.get<PaginatedResponse<UnitReferenceResponse>>('/units-reference', {
    headers: getApiHeaders(tenant),
    params: {
      ...params,
    },
  });
  return response.data;
};

export const createUnitReference = async (data: {
  code: string;
  name: string;
  value: number;
  currencyId: string;
}) => {
  const tenant = useTenant();
  const response = await api.post('/units-reference', data, {
    headers: getApiHeaders(tenant),
  });
  return response.data;
};

export const updateUnitReference = async (
  id: string,
  data: {
    code?: string;
    name?: string;
    value?: number;
    currencyId?: string;
  },
) => {
  const tenant = useTenant();
  const response = await api.patch(`/units-reference/${id}`, data, {
    headers: getApiHeaders(tenant),
  });
  return response.data;
};

export const deleteUnitReference = async (id: string) => {
  const tenant = useTenant();
  await api.delete(`/units-reference/${id}`, {
    headers: getApiHeaders(tenant),
  });
};