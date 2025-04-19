// app/roles/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  createRoleConfig, 
  editRoleConfig, 
  deleteRoleConfig,
  assignPermissionsConfig,
} from './lib/roleConfig';
import { getRoles, createRole, updateRole, deleteRole, assignPermissions } from '@/lib/api/roles';
import { getPermissions } from '@/lib/api/permissions';

import { GenericTable } from '@/components/ui/GenericTable';
import { roleActionsConfig, roleTableConfig } from './lib/tableRoleConfig';
import { Pagination } from '@/components/ui/Pagination';
import { BaseModal } from '@/components/ui/BaseModal';
import { usePermissions } from '@/hooks/usePermissions';

export default function RolesPage() {
  const [modalState, setModalState] = useState<{
    type: 'create' | 'edit' | 'delete' | 'assign-permissions' | null;
    data?: any;
  }>({ type: null });

  const [roles, setRoles] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const { hasPermission } = usePermissions();

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const response = await getRoles({
        page: pagination.page,
        limit: pagination.limit,
      });
      setRoles(response.data);
      setPagination(prev => ({
        ...prev,
        total: response.total,
      }));
    } catch (error) {
      console.error('Error fetching roles:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await getPermissions();  
      setPermissions(response.data); 
    } catch (error) {
      console.error('Error fetching permissions:', error);
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, [pagination.page]);

  const handleCreate = async (formData: any) => {
    setLoading(true);
    try {
      await createRole(formData);
      fetchRoles();
      setModalState({ type: null });
    } catch (error) {
      console.error('Error creating role:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (formData: any) => {
    setLoading(true);
    try {
      await updateRole(modalState.data.id, formData);
      fetchRoles();
      setModalState({ type: null });
    } catch (error) {
      console.error('Error updating role:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteRole(modalState.data.id);
      fetchRoles();
      setModalState({ type: null });
    } catch (error) {
      console.error('Error deleting role:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignPermissions = async (formData: any) => {
    setLoading(true);
    try {
      await assignPermissions(modalState.data.id, formData);
      fetchRoles();
      setModalState({ type: null });
    } catch (error) {
      console.error('Error assigning permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handleAction = (action: string, item: any) => {
    setModalState({ type: action as any, data: item });
  };

  const getModalConfig = () => {
    const permissionOptions = permissions.map(perm => ({
      value: perm.id,
      label: perm.code,
    }));

    switch (modalState.type) {
      case 'create':
        return {
          config: {
            ...createRoleConfig,
            fields: createRoleConfig.fields.map(field => 
              field.name === 'permissionIds' ? { ...field, options: permissionOptions } : field
            ),
          },
          onSubmit: handleCreate,
        };
      case 'edit':
        return {
          config: {
            ...editRoleConfig,
            fields: editRoleConfig.fields.map(field => 
              field.name === 'permissionIds' ? { ...field, options: permissionOptions } : field
            ),
          },
          initialData: {
            ...modalState.data,
            permissionIds: modalState.data.permissions?.map((p: any) => p.id) || [],
          },
          onSubmit: handleEdit,
        };
      case 'delete':
        return {
          config: deleteRoleConfig,
          onSubmit: handleDelete,
        };
      case 'assign-permissions':
        return {
          config: {
            ...assignPermissionsConfig,
            fields: assignPermissionsConfig.fields.map(field => 
              field.name === 'permissionIds' ? { ...field, options: permissionOptions } : field
            ),
          },
          initialData: {
            permissionIds: modalState.data.permissions?.map((p: any) => p.id) || [],
          },
          onSubmit: handleAssignPermissions,
        };
      default:
        return null;
    }
  };

  const modalConfig = getModalConfig();

  return (
    <div>
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-gray-900">Gestión de Roles</h1>
      <div className="space-x-2">
        {hasPermission('roles:create') && (
          <button 
            onClick={() => setModalState({ type: 'create' })}
            className="btn-primary"
          >
            Crear Rol
          </button>
        )}
      </div>
    </div>
    <div className="mb-4">
          <GenericTable
            data={roles}
            columns={roleTableConfig}
            actions={roleActionsConfig}
            onAction={handleAction}
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