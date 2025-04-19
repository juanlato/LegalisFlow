'use client';

import { useState, useEffect, useCallback } from 'react'; 
import { 
  createUserConfig, 
  editUserConfig, 
  deleteUserConfig, 
  filterUserConfig,
  assignRoleUserConfig, 
} from './lib/userConfig';
import { getUsers, createUser, updateUser, deleteUser, assignRole } from '@/lib/api/users';

import { GenericTable } from '@/components/ui/GenericTable';
import { userActionsConfig, userTableConfig } from './lib/tableUserConfig';
import { Pagination } from '@/components/ui/Pagination';
import { BaseModal } from '@/components/ui/BaseModal';

import { usePermissions } from '@/hooks/usePermissions'; 
import { getRoles } from '@/lib/api/roles';
import { toast } from 'react-toastify';

export default function UsersPage() {
  const [modalState, setModalState] = useState<{
    type: 'create' | 'edit' | 'delete'| 'assign-role' | 'filter' | null;
    data?: any;
  }>({ type: null });

  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sort, setSort] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const { hasPermission } = usePermissions();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
        ...(sort ? { sortBy: sort.key, sortOrder: sort.direction } : {}),
      };
      
      const response = await getUsers(params);
      setUsers(response.data);
      setPagination(prev => ({
        ...prev,
        total: response.total,
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
      try {
        const response = await getRoles();  
        setRoles(response.data); 
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, filters, sort]);

  const handleCreate = async (formData: any) => {
    setLoading(true);
    try {
      await createUser(formData);
      fetchUsers();
      
      // Añadir feedback al usuario
      toast.success('Usuario creado con éxito');
    } catch (error:any) {
      console.error('Error creating user:', error);
      // Mostrar error al usuario
      toast.error(error.response?.data?.message || 'Error al crear usuario');
    } finally {
      setModalState({ type: null });
      setLoading(false);
    }
  };

  const handleEdit = async (formData: any) => {
    setLoading(true);
    try {
      await updateUser(modalState.data.id, formData);
      fetchUsers();
      setModalState({ type: null });
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteUser(modalState.data.id);
      fetchUsers();
      setModalState({ type: null });
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignRole = async (formData: any) => {
      setLoading(true);
      try {
        console.log('Assigning role:', formData);
        await assignRole(modalState.data.id, formData.roleId);
        fetchRoles();
        setModalState({ type: null });
      } catch (error) {
        console.error('Error assigning permissions:', error);
      } finally {
        setLoading(false);
      }
    };

  const handleFilter = (filterData: any) => {
    setFilters(filterData);
    setPagination(prev => ({ ...prev, page: 1 }));
    setModalState({ type: null });
  };

  const handlePageChange = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    setSort({ key, direction });
  };

  const handleAction = useCallback((action: string, item: any) => {
    setModalState({ type: action as any, data: item });
  }, []);

  const getModalConfig = () => {

    const rolesOptions = roles.map(rol => ({
      value: rol.id,
      label: rol.name,
    }));

    switch (modalState.type) {
      case 'create':
        return {
          config: {
            ...createUserConfig,
            fields: createUserConfig.fields.map(field => 
              field.name === 'roleId' ? { ...field, options: rolesOptions } : field
            ),
          },
          onSubmit: handleCreate,
        };
      case 'edit':
        return { 
          config: {
            ...editUserConfig,
            fields: editUserConfig.fields.map(field => 
              field.name === 'roleId' ? { ...field, options: rolesOptions } : field
            ),
          },
          initialData: {
            ...modalState.data,
            roleId: modalState.data.role?.id || null,
          },
          onSubmit: handleEdit,
        };
      case 'delete':
        return {
          config: deleteUserConfig,
          onSubmit: handleDelete,
        };
      case 'assign-role':
        return { 
          config: {
            ...assignRoleUserConfig,
            fields: assignRoleUserConfig.fields.map(field => 
              field.name === 'roleId' ? { ...field, options: rolesOptions } : field
            ),
          },
          initialData: {
            roleId: modalState.data.role?.id || null,
          },
          onSubmit: handleAssignRole,
        };
        
      case 'filter':
        return {
          config: filterUserConfig,
          onSubmit: handleFilter,
        };
      default:
        return null;
    }
  };

  const modalConfig = getModalConfig();

  return (
    <div>
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
      <div className="space-x-2">
            <button 
              onClick={() => setModalState({ type: 'filter' })}
              className="btn-filter"
            >
              Filtrar
            </button>
            {hasPermission('users:create') && (
              <button 
                onClick={() => setModalState({ type: 'create' })}
                className="btn-primary"
              >
                Crear Usuario
              </button>
            )}
      </div>
    </div>
    <div className="mb-4">
          <GenericTable
            data={users}
            columns={userTableConfig}
            actions={userActionsConfig}
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