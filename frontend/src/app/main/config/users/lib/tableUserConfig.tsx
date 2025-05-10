import { ActionConfig, ColumnConfig } from '@/components/lib/TableTypes';

// En tableUserConfig.ts, mejora los renders:
export const userTableConfig: ColumnConfig[] = [
  {
    key: 'email',
    header: 'Email',
    sortable: true,
    render: (value: string) => (
      <span className="font-medium text-blue-600 transition-colors duration-200 hover:text-blue-800">
        {value}
      </span>
    ),
  },
  {
    key: 'role.name',
    header: 'Rol',
    sortable: true,
    render: (value: string) => (
      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 capitalize">
        {value}
      </span>
    ),
  },
  {
    key: 'isActive',
    header: 'Estado',
    sortable: true,
    render: (value: boolean) => (
      <span
        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
      >
        {value ? 'Activo' : 'Inactivo'}
      </span>
    ),
  },
];
export const userActionsConfig: ActionConfig[] = [
  {
    label: 'Editar',
    icon: '✏️',
    permission: 'users:update',
    onClick: (item, onAction) => onAction('edit', item),
  },
  {
    label: 'Eliminar',
    icon: '🗑️',
    permission: 'users:delete',
    onClick: (item, onAction) => onAction('delete', item), 
  },
  {
    label: 'Asignar Rol',
    icon: '🔑',
    permission: 'users:assign-role',
    onClick: (item, onAction) => onAction('assign-role', item),
  },
];
