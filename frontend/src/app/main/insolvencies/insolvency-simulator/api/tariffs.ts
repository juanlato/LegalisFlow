import api, { getApiHeaders } from '@/lib/api';
import { useTenant } from '@/hooks/useTenant';
import { PaginatedResponse } from '@/lib/interfaces/PaginatedResponse';

export interface InsolvencyTariff {
  id: string;
  code: string;
  unitReference?: {
    id: string;
    code: string;
    name: string;
    value: number;
  } | null;
  lowerLimit: number;
  upperLimit: number;
  value: number;
  valueMaxLaw: number;
}

export interface GetInsolvencyTariffsParams {
  page?: number;
  limit?: number;
  search?: string;
  unitReferenceId?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export const getInsolvencyTariffs = async (
  params: GetInsolvencyTariffsParams = {},
): Promise<PaginatedResponse<InsolvencyTariff>> => {
  const tenant = useTenant();
  const response = await api.get<PaginatedResponse<InsolvencyTariff>>('/insolvency-tariffs', {
    headers: getApiHeaders(tenant),
    params: {
      ...params,
    },
  });
  return response.data;
};

export const getInsolvencyTariffById = async (id: string): Promise<InsolvencyTariff> => {
  const tenant = useTenant();
  const response = await api.get<InsolvencyTariff>(`/insolvency-tariffs/${id}`, {
    headers: getApiHeaders(tenant),
  });
  return response.data;
};
