import api, { getApiHeaders } from '@/lib/api';
import { useTenant } from '@/hooks/useTenant';
import { PaginatedResponse } from '../interface/PaginatedResponse';

export interface GetInsolvencyTariffsParams {
  page?: number;
  limit?: number;
  search?: string;
  unitReferenceId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface InsolvencyTariffResponse {
  id: string;
  code: string;
  unitReference?: {
    id: string;
    code?: string;
    name?: string;
  } | null;
  lowerLimit: number;
  upperLimit: number;
  value: number;
  valueMaxLaw: number;
}

export interface CreateInsolvencyTariffData {
  code: string;
  unitReferenceId?: string;
  lowerLimit: number;
  upperLimit: number;
  value: number;
  valueMaxLaw: number;
}

export interface UpdateInsolvencyTariffData {
  code?: string;
  unitReferenceId?: string | null;
  lowerLimit?: number;
  upperLimit?: number;
  value?: number;
  valueMaxLaw?: number;
}

export const getInsolvencyTariffs = async (
  params: GetInsolvencyTariffsParams = {},
): Promise<PaginatedResponse<InsolvencyTariffResponse>> => {
  const tenant = useTenant();
  const response = await api.get<PaginatedResponse<InsolvencyTariffResponse>>('/insolvency-tariffs', {
    headers: getApiHeaders(tenant),
    params: {
      ...params,
    },
  });
  return response.data;
};

export const getInsolvencyTariff = async (id: string): Promise<InsolvencyTariffResponse> => {
  const tenant = useTenant();
  const response = await api.get<InsolvencyTariffResponse>(`/insolvency-tariffs/${id}`, {
    headers: getApiHeaders(tenant),
  });
  return response.data;
};

export const createInsolvencyTariff = async (data: CreateInsolvencyTariffData) => {
  const tenant = useTenant();
  const response = await api.post('/insolvency-tariffs', data, {
    headers: getApiHeaders(tenant),
  });
  return response.data;
};

export const updateInsolvencyTariff = async (id: string, data: UpdateInsolvencyTariffData) => {
  const tenant = useTenant();
  const response = await api.patch(`/insolvency-tariffs/${id}`, data, {
    headers: getApiHeaders(tenant),
  });
  return response.data;
};

export const deleteInsolvencyTariff = async (id: string) => {
  const tenant = useTenant();
  await api.delete(`/insolvency-tariffs/${id}`, {
    headers: getApiHeaders(tenant),
  });
};