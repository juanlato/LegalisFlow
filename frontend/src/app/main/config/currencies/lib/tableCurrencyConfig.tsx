// lib/tableCurrencyConfig.tsx
import { ActionConfig, ColumnConfig } from '@/components/lib/TableTypes';


export const currencyTableConfig: ColumnConfig[] = [
  {
    key: 'code',
    header: 'Código',
    sortable: true,
    render: (value: string) => (
      <span className="font-medium text-blue-600 transition-colors duration-200 hover:text-blue-800">
        {value}
      </span>
    ),
  },
  {
    key: 'name',
    header: 'Nombre',
    sortable: true,
  },
  {
    key: 'symbol',
    header: 'Símbolo',
    render: (value: string) => value || '-',
  },
  {
    key: 'isCurrencyBase',
    header: 'Moneda Base',
    sortable: true,
    render: (value: boolean) => (
      <span
        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${value ? 'bg-green-100 text-green-800' : ''}`}
      >
        {value ? 'Moneda Base' : ''}
      </span>
    ),
  },
];

export const currencyActionsConfig: ActionConfig[] = [
  {
    label: 'Editar',
    icon: '✏️',
    permission: 'currencies:update',
    onClick: (item, onAction) => onAction('edit', item),
  },
  {
    label: 'Eliminar',
    icon: '🗑️',
    permission: 'currencies:delete',
    onClick: (item, onAction) => onAction('delete', item),
    //disabled: (item) => item.isCurrencyBase,
  },
  {
    label: 'Establecer como Base',
    icon: '🏦',
    permission: 'currencies:update',
    onClick: (item, onAction) => onAction('set-base', item),
    //disabled: (item) => item.isCurrencyBase,
  },
];