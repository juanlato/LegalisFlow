import { ActionConfig, ColumnConfig } from '@/components/lib/TableTypes';
 

export const insolvencyTariffTableConfig: ColumnConfig[] = [
  {
    key: 'code',
    header: 'Código',
    sortable: true,
  },
  {
    key: 'unitReference.name',
    header: 'Unidad de Referencia',
    sortable: false,
    render: (value: string, item: any) => 
      item.unitReference ? item.unitReference.name : 'N/A',
  },
  {
    key: 'lowerLimit',
    header: 'Límite Inferior',
    sortable: true,
    render: (value: string) => parseFloat(value).toFixed(2),
  },
  {
    key: 'upperLimit',
    header: 'Límite Superior',
    sortable: true,
    render: (value: string) => parseFloat(value).toFixed(2),
  },
  {
    key: 'value',
    header: 'Valor',
    sortable: true,
    render: (value: string) => parseFloat(value).toFixed(2),
  },
  {
    key: 'valueMaxLaw',
    header: 'Valor Máx. Ley',
    sortable: true,
    render: (value: string) => parseFloat(value).toFixed(2),
  },
];

export const insolvencyTariffActionsConfig: ActionConfig[] = [
  {
    label: 'Editar',
    icon: '✏️',
    permission: 'insolvency-tariffs:update',
    onClick: (item, onAction) => onAction('edit', item),
  },
  {
    label: 'Eliminar',
    icon: '🗑️',
    permission: 'insolvency-tariffs:delete',
    onClick: (item, onAction) => onAction('delete', item),
  },
];