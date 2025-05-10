import api, { getApiHeaders } from '@/lib/api';
import { useTenant } from '@/hooks/useTenant';

interface Debt {
  id: string;
  creditor: string;
  creditorType: string;
  amount: number;
  description?: string;
}

interface Asset {
  id: string;
  type: string;
  description: string;
  value: number;
}

interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  idNumber: string;
  address: string;
  city?: string;
  birthDate?: string;
  occupation?: string;
}

interface InsolvencySimulation {
  debts: Debt[];
  assets: {
    total: number;
    details: Asset[];
  };
  calculatedCost: {
    estimatedCost: number;
    tariffApplied: any;
    details: any;
  };
  personalInfo: PersonalInfo;
}

export const submitInsolvencySimulation = async (
  simulationData: InsolvencySimulation
): Promise<any> => {
  const tenant = useTenant();
  const response = await api.post('/insolvency-simulations', simulationData, {
    headers: getApiHeaders(tenant),
  });
  return response.data;
};

export const getInsolvencySimulations = async (
  params: { page?: number; limit?: number } = {}
): Promise<any> => {
  const tenant = useTenant();
  const response = await api.get('/insolvency-simulations', {
    headers: getApiHeaders(tenant),
    params,
  });
  return response.data;
};

export const getInsolvencySimulationById = async (
  id: string
): Promise<InsolvencySimulation> => {
  const tenant = useTenant();
  const response = await api.get(`/insolvency-simulations/${id}`, {
    headers: getApiHeaders(tenant),
  });
  return response.data;
};
