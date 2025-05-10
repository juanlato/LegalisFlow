// lib/currencyConfig.ts
import { ModalConfig } from '@/components/lib/ModalConfig';

export const createCurrencyConfig: ModalConfig = {
  title: 'Crear Nueva Moneda',
  submitText: 'Crear Moneda',
  fields: [
    {
      name: 'code',
      label: 'Código',
      type: 'text',
      required: true,
    },
    {
      name: 'name',
      label: 'Nombre',
      type: 'text',
      required: true,
    },
    {
      name: 'symbol',
      label: 'Símbolo',
      type: 'text',
      required: false,
    },
  ],
};

export const editCurrencyConfig: ModalConfig = {
  title: 'Editar Moneda',
  submitText: 'Actualizar Moneda',
  fields: [
    {
      name: 'code',
      label: 'Código',
      type: 'text',
      required: true,
    },
    {
      name: 'name',
      label: 'Nombre',
      type: 'text',
      required: true,
    },
    {
      name: 'symbol',
      label: 'Símbolo',
      type: 'text',
      required: false,
    },
  ],
};

export const deleteCurrencyConfig: ModalConfig = {
  title: 'Confirmar Eliminación',
  submitText: 'Eliminar',
  cancelText: 'Cancelar',
  fields: [
    {
      name: 'confirmation',
      label: '¿Estás seguro de eliminar esta moneda?',
      type: 'text',
      defaultValue: 'Eliminar moneda',
      validation: {
        custom: (value) =>
          value === 'Eliminar moneda' ? null : 'Por favor escribe "Eliminar moneda" para confirmar',
      },
    },
  ],
};

export const setBaseCurrencyConfig: ModalConfig = {
  title: 'Establecer Moneda Base',
  submitText: 'Establecer como Base',
  cancelText: 'Cancelar',
  fields: [
    {
      name: 'confirmation',
      label: '¿Confirmas establecer esta moneda como la moneda base del sistema?',
      type: 'text',
      defaultValue: 'Confirmar',
      validation: {
        custom: (value) =>
          value === 'Confirmar' ? null : 'Por favor escribe "Confirmar" para continuar',
      },
    },
  ],
};