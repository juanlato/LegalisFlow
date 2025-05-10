// app/(dashboard)/conversion-rates/lib/tableConversionRateConfig.tsx
import { ActionConfig, ColumnConfig } from '@/components/lib/TableTypes';

export const conversionRateTableConfig: ColumnConfig[] = [
  {
    key: 'currencyOrigin.code',
    header: 'Moneda Origen',
    sortable: true,
    render: (value: string, item: any) => (
      <span className="font-medium text-blue-600">
        {value} - {item.currencyOrigin.name}
      </span>
    ),
  },
  {
    key: 'currencyDestination.code',
    header: 'Moneda Destino',
    sortable: true,
    render: (value: string, item: any) => (
      <span className="font-medium text-blue-600">
        {value} - {item.currencyDestination.name}
      </span>
    ),
  },
  {
    key: 'value',
    header: 'Tasa',
    sortable: true,
    render: (value: string) => parseFloat(value).toFixed(2),
  },
  {
    key: 'fechaActualizacion',
    header: 'Última Actualización',
    sortable: true,
    render: (value: string) => new Date(value).toLocaleString(),
  },
];

export const conversionRateActionsConfig: ActionConfig[] = [
  {
    label: 'Editar',
    icon: '✏️',
    permission: 'conversion-rates:update',
    onClick: (item, onAction) => onAction('edit', item),
  },
  {
    label: 'Eliminar',
    icon: '🗑️',
    permission: 'conversion-rates:delete',
    onClick: (item, onAction) => onAction('delete', item), 
  },
];