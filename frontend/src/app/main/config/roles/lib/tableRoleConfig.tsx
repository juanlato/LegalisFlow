// lib/tableRoleConfig.tsx
import { ActionConfig, ColumnConfig } from '@/components/lib/TableTypes';

export const roleTableConfig: ColumnConfig[] = [
  {
    key: 'name',
    header: 'Nombre del Rol',
    sortable: true,    
  },
  {
    key: 'permissions',
    header: 'Permisos',
    render: (permissions: any[]) => {
      const limitedPermissions = permissions.slice(0, 10); // Limitar a 10 elementos
      return (
        <div className="flex flex-wrap gap-1">
          {limitedPermissions.map((perm) => (
            <span
              key={perm.id}
              className="inline-flex items-center rounded bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800"
            >
              {perm.code}
            </span>
          ))}
          {permissions.length > 10 && (
            <span className="text-xs text-gray-500">+ {permissions.length - 10} más</span>
          )}
        </div>
      );
    },
  },
];

export const roleActionsConfig: ActionConfig[] = [
  {
    label: 'Editar',
    icon: '✏️',
    permission: 'roles:update',
    onClick: (item, onAction) => onAction('edit', item),
  },
  {
    label: 'Eliminar',
    icon: '🗑️',
    permission: 'roles:delete',
    onClick: (item, onAction) => onAction('delete', item),
  },
  {
    label: 'Asignar Permisos',
    icon: '🔑',
    permission: 'roles:assign-permissions',
    onClick: (item, onAction) => onAction('assign-permissions', item),
  },
];
