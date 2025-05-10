'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  createCurrencyConfig,
  editCurrencyConfig,
  deleteCurrencyConfig,
  setBaseCurrencyConfig,
} from './lib/currencyConfig';
import { getCurrencies, createCurrency, updateCurrency, deleteCurrency, setBaseCurrency } from '@/lib/api/currencies';

import { GenericTable } from '@/components/ui/GenericTable';
import { currencyActionsConfig, currencyTableConfig } from './lib/tableCurrencyConfig';
import { Pagination } from '@/components/ui/Pagination';
import { BaseModal } from '@/components/ui/BaseModal';

import { usePermissions } from '@/hooks/usePermissions';
import { toast } from 'react-toastify';

export default function CurrenciesPage() {
  const [modalState, setModalState] = useState<{
    type: 'create' | 'edit' | 'delete' | 'set-base' | 'filter' | null;
    data?: any;
  }>({ type: null });

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

  const fetchCurrencies = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
        ...(sort ? { sortBy: sort.key, sortOrder: sort.direction } : {}),
      };

      const response = await getCurrencies(params);
      setCurrencies(response.data);
      setPagination((prev) => ({
        ...prev,
        total: response.total,
      }));
    } catch (error) {
      console.error('Error fetching currencies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrencies();
  }, [pagination.page, filters, sort]);

  const handleCreate = async (formData: any) => {
    setLoading(true);
    try {
      await createCurrency(formData);
      fetchCurrencies();
      toast.success('Moneda creada con éxito');
    } catch (error: any) {
      console.error('Error creating currency:', error);
      toast.error(error.response?.data?.message || 'Error al crear moneda');
    } finally {
      setModalState({ type: null });
      setLoading(false);
    }
  };

  const handleEdit = async (formData: any) => {
    setLoading(true);
    try {
      await updateCurrency(modalState.data.id, formData);
      fetchCurrencies();
      toast.success('Moneda actualizada con éxito');
      setModalState({ type: null });
    } catch (error: any) {
      console.error('Error updating currency:', error);
      toast.error(error.response?.data?.message || 'Error al actualizar moneda');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteCurrency(modalState.data.id);
      fetchCurrencies();
      toast.success('Moneda eliminada con éxito');
      setModalState({ type: null });
    } catch (error: any) {
      console.error('Error deleting currency:', error);
      toast.error(error.response?.data?.message || 'Error al eliminar moneda');
    } finally {
      setLoading(false);
    }
  };

  const handleSetBase = async () => {
    setLoading(true);
    try {
      await setBaseCurrency(modalState.data.id);
      fetchCurrencies();
      toast.success('Moneda base establecida con éxito');
      setModalState({ type: null });
    } catch (error: any) {
      console.error('Error setting base currency:', error);
      toast.error(error.response?.data?.message || 'Error al establecer moneda base');
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
          config: createCurrencyConfig,
          onSubmit: handleCreate,
        };
      case 'edit':
        return {
          config: editCurrencyConfig,
          initialData: {
            code: modalState.data.code,
            name: modalState.data.name,
            symbol: modalState.data.symbol || '',
          },
          onSubmit: handleEdit,
        };
      case 'delete':
        return {
          config: deleteCurrencyConfig,
          onSubmit: handleDelete,
        };
      case 'set-base':
        return {
          config: setBaseCurrencyConfig,
          onSubmit: handleSetBase,
        };
      default:
        return null;
    }
  };

  const modalConfig = getModalConfig();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Monedas</h1>
        <div className="space-x-2">
          {hasPermission('currencies:create') && (
            <button onClick={() => setModalState({ type: 'create' })} className="btn-primary">
              Nueva Moneda
            </button>
          )}
        </div>
      </div>
      <div className="mb-4">
        <GenericTable
          data={currencies}
          columns={currencyTableConfig}
          actions={currencyActionsConfig}
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