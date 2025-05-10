import { ActionConfig, ColumnConfig } from '@/components/lib/TableTypes';

export const unitReferenceTableConfig: ColumnConfig[] = [
  {
    key: 'code',
    header: 'Código',
    sortable: true,
  },
  {
    key: 'name',
    header: 'Nombre',
    sortable: true,
  },
  {
    key: 'value',
    header: 'Valor',
    sortable: true,
    render: (value: string) => parseFloat(value).toFixed(2),
  },
  {
    key: 'currency.code',
    header: 'Moneda',
    sortable: true,
    render: (value: string, item: any) => (
      <span className="font-medium text-blue-600">
        {value} - {item.currency.name}
      </span>
    ),
  },
];

export const unitReferenceActionsConfig: ActionConfig[] = [
  {
    label: 'Editar',
    icon: '✏️',
    permission: 'units-reference:update',
    onClick: (item, onAction) => onAction('edit', item),
  },
  {
    label: 'Eliminar',
    icon: '🗑️',
    permission: 'units-reference:delete',
    onClick: (item, onAction) => onAction('delete', item),
  },
];