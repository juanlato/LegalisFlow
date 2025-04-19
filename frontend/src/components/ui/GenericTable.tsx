'use client';

import { useState, useEffect } from 'react';

import { usePermissions } from '@/hooks/usePermissions';

import { ActionConfig, ColumnConfig } from '../lib/TableTypes';

interface GenericTableProps {
  data: any[];
  columns: ColumnConfig[];
  actions?: ActionConfig[];
  keyField?: string;
  onAction: (action: string, item: any) => void;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  loading?: boolean;
}

export const GenericTable = ({
  data,
  columns,
  actions = [],
  keyField = 'id',
  onAction,
  onSort,
  loading = false,
}: GenericTableProps) => {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const { hasPermission } = usePermissions();

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    onSort?.(key, direction);
  };

  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((acc, part) => acc?.[part], obj);
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gradient-to-r from-indigo-600 to-indigo-800">
          <tr>
            {actions.length > 0 && (
              <th
                scope="col"
                className="px-2 py-3 text-center text-xs font-medium text-white uppercase tracking-wider"
                style={{ width: '1%' }}
              >
                Acciones
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={`px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider ${column.sortable ? 'cursor-pointer hover:bg-indigo-700' : ''}`}
                onClick={() => column.sortable && handleSort(column.key)}
                style={{ width: column.width }}
              >
                <div className={`flex items-center ${column.align === 'right' ? 'justify-end' : column.align === 'center' ? 'justify-center' : 'justify-start'}`}>
                  {column.header}
                  {column.sortable && sortConfig?.key === column.key && (
                    <span className="ml-1 text-white">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td colSpan={columns.length + (actions.length > 0 ? 1 : 0)} className="px-6 py-4 text-center">
                Cargando...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (actions.length > 0 ? 1 : 0)} className="px-6 py-4 text-center text-gray-500">
                No se encontraron registros
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item[keyField]} className="transition-colors duration-150">
                {actions.length > 0 && (
                  <td className="px-2 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <div className="flex justify-center space-x-2">
                      {actions
                        .filter(action => !action.permission || hasPermission(action.permission))
                        .map((action) => (
                          <button
                            key={action.label}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (action.confirm) {
                                if (window.confirm(action.confirmMessage || '¿Estás seguro?')) {
                                  action.onClick(item, onAction);
                                }
                              } else {
                                action.onClick(item, onAction);
                              }
                            }}
                            className={`p-2 rounded-md transition-colors duration-200 ${
                              action.className || 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                            }`}
                            title={action.label}
                          >
                            {action.icon || action.label}
                          </button>
                        ))}
                    </div>
                  </td>
                )}
                {columns.map((column) => (
                  <td
                    key={`${item[keyField]}-${column.key}`}
                    className={`px-6 py-4 whitespace-nowrap ${column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'} ${
                      item[keyField] % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                    }`}
                  >
                    {column.render
                      ? column.render(getNestedValue(item, column.key), item)
                      : getNestedValue(item, column.key)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};