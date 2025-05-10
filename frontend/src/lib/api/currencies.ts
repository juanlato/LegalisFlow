// lib/api/currencies.ts
import api, { getApiHeaders } from '@/lib/api';
import { useTenant } from '@/hooks/useTenant';
import { PaginatedResponse } from '../interface/PaginatedResponse';

export interface GetCurrenciesParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CurrencyResponse {
  id: string;
  code: string;
  name: string;
  symbol?: string;
  isCurrencyBase: boolean;
  createdAt: string;
  updatedAt: string;
}

export const getCurrencies = async (
  params: GetCurrenciesParams = {},
): Promise<PaginatedResponse<CurrencyResponse>> => {
  const tenant = useTenant();
  const response = await api.get<PaginatedResponse<CurrencyResponse>>('/currencies', {
    headers: getApiHeaders(tenant),
    params: {
      ...params,
    },
  });
  return response.data;
};

export const createCurrency = async (data: { code: string; name: string; symbol?: string }) => {
  const tenant = useTenant();
  const response = await api.post('/currencies', data, {
    headers: getApiHeaders(tenant),
  });
  return response.data;
};

export const updateCurrency = async (id: string, data: { code?: string; name?: string; symbol?: string }) => {
  const tenant = useTenant();
  const response = await api.patch(`/currencies/${id}`, data, {
    headers: getApiHeaders(tenant),
  });
  return response.data;
};

export const deleteCurrency = async (id: string) => {
  const tenant = useTenant();
  await api.delete(`/currencies/${id}`, {
    headers: getApiHeaders(tenant),
  });
};

export const setBaseCurrency = async (id: string) => {
  const tenant = useTenant();
  const response = await api.patch(`/currencies/${id}/set-base`, {}, {
    headers: getApiHeaders(tenant),
  });
  return response.data;
};