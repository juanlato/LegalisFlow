'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getInsolvencyTariffs,
  createInsolvencyTariff,
  updateInsolvencyTariff,
  deleteInsolvencyTariff,
} from '@/lib/api/insolvencyTariffs';
import { getUnitsReference } from '@/lib/api/unitsReference';
import { GenericTable } from '@/components/ui/GenericTable';
import { insolvencyTariffActionsConfig, insolvencyTariffTableConfig } from './lib/tableInsolvencyTariffConfig';
import { Pagination } from '@/components/ui/Pagination';
import { BaseModal } from '@/components/ui/BaseModal';
import { createInsolvencyTariffConfig, deleteInsolvencyTariffConfig, editInsolvencyTariffConfig } from './lib/insolvencyTariffConfig';

import { usePermissions } from '@/hooks/usePermissions';
import { toast } from 'react-toastify';

export default function InsolvencyTariffsPage() {
  const [modalState, setModalState] = useState<{
    type: 'create' | 'edit' | 'delete' | null;
    data?: any;
  }>({ type: null });

  const [insolvencyTariffs, setInsolvencyTariffs] = useState<any[]>([]);
  const [unitsReference, setUnitsReference] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sort, setSort] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const { hasPermission } = usePermissions();

  const fetchInsolvencyTariffs = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
        ...(sort ? { sortBy: sort.key, sortOrder: sort.direction } : {}),
      };

      const response = await getInsolvencyTariffs(params);
      setInsolvencyTariffs(response.data);
      setPagination((prev) => ({
        ...prev,
        total: response.total,
      }));
    } catch (error) {
      console.error('Error fetching insolvency tariffs:', error);
      toast.error('Error al cargar las tarifas de insolvencia');
    } finally {
      setLoading(false);
    }
  };

  const fetchUnitsReference = async () => {
    try {
      const response = await getUnitsReference({ limit: 1000 });
      setUnitsReference(response.data);
    } catch (error) {
      console.error('Error fetching units reference:', error);
    }
  };

  useEffect(() => {
    fetchInsolvencyTariffs();
    fetchUnitsReference();
  }, [pagination.page, filters, sort]);

  const handleCreate = async (formData: any) => {
    setLoading(true);
    try {
      await createInsolvencyTariff(formData);
      fetchInsolvencyTariffs();
      toast.success('Tarifa de insolvencia creada con éxito');
    } catch (error: any) {
      console.error('Error creating insolvency tariff:', error);
      toast.error(error.response?.data?.message || 'Error al crear tarifa de insolvencia');
    } finally {
      setModalState({ type: null });
      setLoading(false);
    }
  };

  const handleEdit = async (formData: any) => {
    setLoading(true);
    try {
      await updateInsolvencyTariff(modalState.data.id, formData);
      fetchInsolvencyTariffs();
      toast.success('Tarifa de insolvencia actualizada con éxito');
      setModalState({ type: null });
    } catch (error: any) {
      console.error('Error updating insolvency tariff:', error);
      toast.error(error.response?.data?.message || 'Error al actualizar tarifa de insolvencia');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteInsolvencyTariff(modalState.data.id);
      fetchInsolvencyTariffs();
      toast.success('Tarifa de insolvencia eliminada con éxito');
      setModalState({ type: null });
    } catch (error: any) {
      console.error('Error deleting insolvency tariff:', error);
      toast.error(error.response?.data?.message || 'Error al eliminar tarifa de insolvencia');
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

  const handleSearch = (search: string) => {
    setFilters((prev) => ({ ...prev, search }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const getModalConfig = () => {
    switch (modalState.type) {
      case 'create':
        return {
          config: {
            ...createInsolvencyTariffConfig,
            fields: createInsolvencyTariffConfig.fields.map(field => 
              field.name === 'unitReferenceId' 
                ? { ...field, options: unitsReference.map(u => ({ value: u.id, label: u.name })) } 
                : field
            )
          },
          onSubmit: handleCreate
        };
      case 'edit':
        return {
          config: {
            ...editInsolvencyTariffConfig,
            fields: editInsolvencyTariffConfig.fields.map(field => 
              field.name === 'unitReferenceId' 
                ? { ...field, options: unitsReference.map(u => ({ value: u.id, label: u.name })) } 
                : field
            )
          },
          initialData: {
            code: modalState.data?.code,
            unitReferenceId: modalState.data?.unitReference?.id || null,
            lowerLimit: modalState.data?.lowerLimit,
            upperLimit: modalState.data?.upperLimit,
            value: modalState.data?.value,
            valueMaxLaw: modalState.data?.valueMaxLaw,
          },
          onSubmit: handleEdit
        };
      case 'delete':
        return {
          config: deleteInsolvencyTariffConfig,
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
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Tarifas de Insolvencia</h1>
        <div className="space-x-2">
          {hasPermission('insolvency-tariffs:create') && (
            <button onClick={() => setModalState({ type: 'create' })} className="btn-primary">
              Nueva Tarifa
            </button>
          )}
        </div>
      </div>

      <div className="mb-4">
        

        <GenericTable
          data={insolvencyTariffs}
          columns={insolvencyTariffTableConfig}
          actions={insolvencyTariffActionsConfig}
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