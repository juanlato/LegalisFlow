// app/(dashboard)/conversion-rates/lib/api/conversionRates.ts
import api, { getApiHeaders } from '@/lib/api';
import { useTenant } from '@/hooks/useTenant';
import { PaginatedResponse } from '../interface/PaginatedResponse';

export interface GetConversionRatesParams {
  page?: number;
  limit?: number;
  currencyOriginId?: string;
  currencyDestinationId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ConversionRateResponse {
  id: string;
  value: number;
  fechaActualizacion: string;
  currencyOrigin: {
    id: string;
    code: string;
    name: string;
    symbol?: string;
  };
  currencyDestination: {
    id: string;
    code: string;
    name: string;
    symbol?: string;
  };
}

export const getConversionRates = async (
  params: GetConversionRatesParams = {},
): Promise<PaginatedResponse<ConversionRateResponse>> => {
  const tenant = useTenant();
  const response = await api.get<PaginatedResponse<ConversionRateResponse>>('/conversion-rates', {
    headers: getApiHeaders(tenant),
    params: {
      ...params,
    },
  });
  return response.data;
};

export const createConversionRate = async (data: {
  value: number;
  currencyOriginId: string;
  currencyDestinationId: string;
}) => {
  const tenant = useTenant();
  const response = await api.post('/conversion-rates', data, {
    headers: getApiHeaders(tenant),
  });
  return response.data;
};

export const updateConversionRate = async (
  id: string,
  data: {
    value?: number;
    currencyOriginId?: string;
    currencyDestinationId?: string;
  },
) => {
  const tenant = useTenant();
  const response = await api.patch(`/conversion-rates/${id}`, data, {
    headers: getApiHeaders(tenant),
  });
  return response.data;
};

export const deleteConversionRate = async (id: string) => {
  const tenant = useTenant();
  await api.delete(`/conversion-rates/${id}`, {
    headers: getApiHeaders(tenant),
  });
};