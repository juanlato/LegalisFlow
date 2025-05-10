'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getUnitsReference,
  createUnitReference,
  updateUnitReference,
  deleteUnitReference,
} from '@/lib/api/unitsReference';
import { getCurrencies } from '@/lib/api/currencies';
import { GenericTable } from '@/components/ui/GenericTable';
import { unitReferenceTableConfig, unitReferenceActionsConfig } from './lib/tableUnitReferenceConfig';
import { Pagination } from '@/components/ui/Pagination';
import { BaseModal } from '@/components/ui/BaseModal';
import { usePermissions } from '@/hooks/usePermissions';
import { toast } from 'react-toastify';
import {
  createUnitReferenceConfig,
  editUnitReferenceConfig,
  deleteUnitReferenceConfig,
} from './lib/unitReferenceConfig';

export default function UnitsReferencePage() {
  const [modalState, setModalState] = useState<{
    type: 'create' | 'edit' | 'delete' | null;
    data?: any;
  }>({ type: null });

  const [unitsReference, setUnitsReference] = useState<any[]>([]);
  const [currencies, setCurrencies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sort, setSort] = useState<{ key: string; direction:  'asc' | 'desc' } | null>(null);
  const { hasPermission } = usePermissions();

  const fetchUnitsReference = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
        ...(sort ? { sortBy: sort.key, sortOrder: sort.direction } : {}),
      };

      const response = await getUnitsReference(params);
      setUnitsReference(response.data);
      setPagination((prev) => ({
        ...prev,
        total: response.total,
      }));
    } catch (error) {
      console.error('Error fetching units reference:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrencies = async () => {
    try {
      const response = await getCurrencies({ limit: 1000 });
      setCurrencies(response.data);
    } catch (error) {
      console.error('Error fetching currencies:', error);
    }
  };

  useEffect(() => {
    fetchUnitsReference();
    fetchCurrencies();
  }, [pagination.page, filters, sort]);

  const handleCreate = async (formData: any) => {
    setLoading(true);
    try {
      await createUnitReference(formData);
      fetchUnitsReference();
      toast.success('Unidad de referencia creada con éxito');
    } catch (error: any) {
      console.error('Error creating unit reference:', error);
      toast.error(error.response?.data?.message || 'Error al crear unidad de referencia');
    } finally {
      setModalState({ type: null });
      setLoading(false);
    }
  };

  const handleEdit = async (formData: any) => {
    setLoading(true);
    try {
      await updateUnitReference(modalState.data.id, formData);
      fetchUnitsReference();
      toast.success('Unidad de referencia actualizada con éxito');
      setModalState({ type: null });
    } catch (error: any) {
      console.error('Error updating unit reference:', error);
      toast.error(error.response?.data?.message || 'Error al actualizar unidad de referencia');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteUnitReference(modalState.data.id);
      fetchUnitsReference();
      toast.success('Unidad de referencia eliminada con éxito');
      setModalState({ type: null });
    } catch (error: any) {
      console.error('Error deleting unit reference:', error);
      toast.error(error.response?.data?.message || 'Error al eliminar unidad de referencia');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  }, []);

  const handleSort = (key: string, direction:  'asc' | 'desc') => {
    setSort({ key, direction });
  };

  const handleSearch = (search: string) => {
    setFilters((prev) => ({ ...prev, search }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleAction = useCallback((action: string, item: any) => {
    setModalState({ type: action as any, data: item });
  }, []);

  const getModalConfig = () => {
    switch (modalState.type) {
      case 'create':
        return {
          config: {
            ...createUnitReferenceConfig,
            fields: createUnitReferenceConfig.fields.map(field => 
              field.name === 'currencyId' 
                ? { ...field, options: currencies.map(c => ({ value: c.id, label: `${c.code} - ${c.name}` })) } 
                : field
            )
          },
          onSubmit: handleCreate
        };
      case 'edit':
        return {
          config: {
            ...editUnitReferenceConfig,
            fields: editUnitReferenceConfig.fields.map(field => 
              field.name === 'currencyId' 
                ? { ...field, options: currencies.map(c => ({ value: c.id, label: `${c.code} - ${c.name}` })) } 
                : field
            )
          },
          initialData: {
            code: modalState.data?.code,
            name: modalState.data?.name,
            value: modalState.data?.value,
            currencyId: modalState.data?.currency?.id,
          },
          onSubmit: handleEdit
        };
      case 'delete':
        return {
          config: deleteUnitReferenceConfig,
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
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Unidades de Referencia</h1>
        <div className="space-x-2">
          {hasPermission('units-reference:create') && (
            <button onClick={() => setModalState({ type: 'create' })} className="btn-primary">
              Nueva Unidad
            </button>
          )}
        </div>
      </div>

      <div className="mb-4">
        <GenericTable
          data={unitsReference}
          columns={unitReferenceTableConfig}
          actions={unitReferenceActionsConfig}
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