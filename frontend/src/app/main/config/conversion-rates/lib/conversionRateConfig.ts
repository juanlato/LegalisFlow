// app/(dashboard)/conversion-rates/lib/conversionRateConfig.ts
import { ModalConfig } from '@/components/lib/ModalConfig';

// conversionRateConfig.ts
export const createConversionRateConfig: ModalConfig = {
    title: 'Crear Nueva Tasa de Conversión',
    submitText: 'Crear Tasa',
    fields: [
      {
        name: 'value',
        label: 'Valor',
        type: 'number',
        required: true,
        step: '0.000001',
        min: '0.000001',
        placeholder: 'Ej: 0.85',
        validation: {
          min: 0.000001,
          custom: (value) => (value <= 0 ? 'El valor debe ser mayor a 0' : null),
        },
      },
      {
        name: 'currencyOriginId',
        label: 'Moneda Origen',
        type: 'select',
        required: true,
        options: [], // Se cargarán dinámicamente
        optionValue: 'id',
        optionLabel: 'code',
        validation: {
          custom: (value: any, formValues?: any) =>
            value === formValues?.currencyDestinationId
              ? 'Las monedas origen y destino deben ser diferentes'
              : null,
        },
      },
      {
        name: 'currencyDestinationId',
        label: 'Moneda Destino',
        type: 'select',
        required: true,
        options: [], // Se cargarán dinámicamente
        optionValue: 'id',
        optionLabel: 'code',
        validation: {
            custom: (value: any, formValues?: any) =>
                value === formValues?.currencyDestinationId
                  ? 'Las monedas origen y destino deben ser diferentes'
                  : null,
            },
      },
    ],
  };
  
  export const editConversionRateConfig: ModalConfig = {
    title: 'Editar Tasa de Conversión',
    submitText: 'Actualizar Tasa',
    fields: [
      {
        name: 'value',
        label: 'Valor',
        type: 'number',
        required: true,
        step: '0.000001',
        min: '0.000001',
        validation: {
          min: 0.000001,
          custom: (value) => (value <= 0 ? 'El valor debe ser mayor a 0' : null),
        },
      },
      {
        name: 'currencyOriginId',
        label: 'Moneda Origen',
        type: 'select',
        required: true,
        options: [], // Se cargarán dinámicamente
        optionValue: 'id',
        optionLabel: 'code',
        disabled: true, // No permitir cambiar las monedas en edición
      },
      {
        name: 'currencyDestinationId',
        label: 'Moneda Destino',
        type: 'select',
        required: true,
        options: [], // Se cargarán dinámicamente
        optionValue: 'id',
        optionLabel: 'code',
        disabled: true, // No permitir cambiar las monedas en edición
      },
      {
        name: 'fechaActualizacion',
        label: 'Fecha de Actualización',
        type: 'datetime-local',
        readOnly: true,
      },
    ],
  };

export const deleteConversionRateConfig: ModalConfig = {
  title: 'Confirmar Eliminación',
  submitText: 'Eliminar',
  cancelText: 'Cancelar',
  fields: [
    {
      name: 'confirmation',
      label: '¿Estás seguro de eliminar esta tasa de conversión?',
      type: 'text',
      defaultValue: 'Eliminar tasa',
      validation: {
        custom: (value) =>
          value === 'Eliminar tasa' ? null : 'Por favor escribe "Eliminar tasa" para confirmar',
      },
    },
  ],
};