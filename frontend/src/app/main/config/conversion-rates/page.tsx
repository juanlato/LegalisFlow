// app/(dashboard)/conversion-rates/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  createConversionRateConfig,
  editConversionRateConfig,
  deleteConversionRateConfig,
} from './lib/conversionRateConfig';
import {
  getConversionRates,
  createConversionRate,
  updateConversionRate,
  deleteConversionRate,
} from '@/lib/api/conversionRates';
import { getCurrencies } from '@/lib/api/currencies';

import { GenericTable } from '@/components/ui/GenericTable';
import { conversionRateActionsConfig, conversionRateTableConfig } from './lib/tableConversionRateConfig.tsx';
import { Pagination } from '@/components/ui/Pagination';
import { BaseModal } from '@/components/ui/BaseModal';

import { usePermissions } from '@/hooks/usePermissions';
import { toast } from 'react-toastify';

export default function ConversionRatesPage() {
  const [modalState, setModalState] = useState<{
    type: 'create' | 'edit' | 'delete' | null;
    data?: any;
  }>({ type: null });

  const [conversionRates, setConversionRates] = useState<any[]>([]);
  const [currencies, setCurrencies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sort, setSort] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const { hasPermission } = usePermissions();

  const fetchConversionRates = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
        ...(sort ? { sortBy: sort.key, sortOrder: sort.direction } : {}),
      };

      const response = await getConversionRates(params);
      setConversionRates(response.data);
      setPagination((prev) => ({
        ...prev,
        total: response.total,
      }));
    } catch (error) {
      console.error('Error fetching conversion rates:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrencies = async () => {
    try {
      const response = await getCurrencies({ limit: 1000 }); // Ajusta según necesidad
      setCurrencies(response.data);
    } catch (error) {
      console.error('Error fetching currencies:', error);
    }
  };

  useEffect(() => {
    fetchConversionRates();
    fetchCurrencies();
  }, [pagination.page, filters, sort]);

  const handleCreate = async (formData: any) => {
    setLoading(true);
    try {
      await createConversionRate(formData);
      fetchConversionRates();
      toast.success('Tasa de conversión creada con éxito');
    } catch (error: any) {
      console.error('Error creating conversion rate:', error);
      toast.error(error.response?.data?.message || 'Error al crear tasa de conversión');
    } finally {
      setModalState({ type: null });
      setLoading(false);
    }
  };

  const handleEdit = async (formData: any) => {
    setLoading(true);
    try {
      await updateConversionRate(modalState.data.id, formData);
      fetchConversionRates();
      toast.success('Tasa de conversión actualizada con éxito');
      setModalState({ type: null });
    } catch (error: any) {
      console.error('Error updating conversion rate:', error);
      toast.error(error.response?.data?.message || 'Error al actualizar tasa de conversión');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteConversionRate(modalState.data.id);
      fetchConversionRates();
      toast.success('Tasa de conversión eliminada con éxito');
      setModalState({ type: null });
    } catch (error: any) {
      console.error('Error deleting conversion rate:', error);
      toast.error(error.response?.data?.message || 'Error al eliminar tasa de conversión');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  }, []);

  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    setSort({ key, direction });
  };

  const handleAction = useCallback((action: string, item: any) => {
    setModalState({ type: action as any, data: item });
  }, []);

  const getModalConfig = () => {
    switch (modalState.type) {
      case 'create':
        return {
          config: {
            ...createConversionRateConfig,
            fields: createConversionRateConfig.fields.map(field => 
              field.type === 'select' 
                ? { ...field, options: currencies.map(c => ({ value: c.id, label: c.code })) } 
                : field
            )
          },
          onSubmit: handleCreate
        };
      case 'edit':
        return {
          config: {
            ...editConversionRateConfig,
            fields: editConversionRateConfig.fields.map(field => 
              field.type === 'select' 
                ? { ...field, options: currencies.map(c => ({ value: c.id, label: c.code })) } 
                : field
            )
          },
          initialData: {
            value: modalState.data?.value,
            currencyOriginId: modalState.data?.currencyOrigin?.id,
            currencyDestinationId: modalState.data?.currencyDestination?.id
          },
          onSubmit: handleEdit
        };
      case 'delete':
        return {
          config: deleteConversionRateConfig,
          onSubmit: handleDelete
        };
      default:
        return null;
    }
  };

  const modalConfig = getModalConfig();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Tasas de Conversión</h1>
        <div className="space-x-2">
          {hasPermission('conversion-rates:create') && (
            <button onClick={() => setModalState({ type: 'create' })} className="btn-primary">
              Nueva Tasa
            </button>
          )}
        </div>
      </div>
      <div className="mb-4">
        <GenericTable
          data={conversionRates}
          columns={conversionRateTableConfig}
          actions={conversionRateActionsConfig}
          onAction={handleAction}
          onSort={handleSort}
          loading={loading}
        />
      </div>

      <Pagination
        currentPage={pagination.page}
        totalPages={Math.ceil(pagination.total / pagination.limit)}
        onPageChange={handlePageChange}
      />

      {modalConfig && (
        <BaseModal
          config={modalConfig.config}
          initialData={modalConfig.initialData}
          isOpen={true}
          onClose={() => setModalState({ type: null })}
          onSubmit={modalConfig.onSubmit}
          loading={loading}
        />
      )}
    </div>
  );
}