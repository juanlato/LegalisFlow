import { ModalConfig } from '@/components/lib/ModalConfig';

export const createInsolvencyTariffConfig: ModalConfig = {
  title: 'Crear Nueva Tarifa de Insolvencia',
  submitText: 'Crear Tarifa',
  fields: [
    {
      name: 'code',
      label: 'Código',
      type: 'text',
      required: true,
      placeholder: 'Ej: TARIFF-001',
      validation: {
        minLength: 3,
        maxLength: 50,
      },
    },
    {
      name: 'unitReferenceId',
      label: 'Unidad de Referencia',
      type: 'select',
      required: false,
      options: [], // Se cargarán dinámicamente
      optionValue: 'id',
      optionLabel: 'name',
    },
    {
      name: 'lowerLimit',
      label: 'Límite Inferior',
      type: 'number',
      required: true,
      min: '0',
      placeholder: 'Ej: 0',
      validation: {
        min: 0,
      },
    },
    {
      name: 'upperLimit',
      label: 'Límite Superior',
      type: 'number',
      required: true,
      min: '0',
      placeholder: 'Ej: 50000000',
      validation: {
        min: 0,
        /*custom: (value, formValues) => 
          value <= formValues?.lowerLimit 
            ? 'El límite superior debe ser mayor que el límite inferior' 
            : null,*/
      },
    },
    {
      name: 'value',
      label: 'Valor',
      type: 'number',
      required: true,
      min: '0',
      placeholder: 'Ej: 35000000',
      validation: {
        min: 1,
      },
    },
    {
      name: 'valueMaxLaw',
      label: 'Valor Máximo según Ley',
      type: 'number',
      required: true,
      min: '0',
      placeholder: 'Ej: 40000000',
      validation: {
        min: 1,
      },
    },
  ],
};

export const editInsolvencyTariffConfig: ModalConfig = {
  title: 'Editar Tarifa de Insolvencia',
  submitText: 'Actualizar Tarifa',
  fields: [
    {
      name: 'code',
      label: 'Código',
      type: 'text',
      required: true,
      validation: {
        minLength: 3,
        maxLength: 50,
      },
    },
    {
      name: 'unitReferenceId',
      label: 'Unidad de Referencia',
      type: 'select',
      required: false,
      options: [], // Se cargarán dinámicamente
      optionValue: 'id',
      optionLabel: 'name',
    },
    {
      name: 'lowerLimit',
      label: 'Límite Inferior',
      type: 'number',
      required: true,
      min: '0',
      validation: {
        min: 0,
      },
    },
    {
      name: 'upperLimit',
      label: 'Límite Superior',
      type: 'number',
      required: true,
      min: '0',
      validation: {
        min: 0,
        /*custom: (value, formValues) => 
          value <= formValues?.lowerLimit 
            ? 'El límite superior debe ser mayor que el límite inferior' 
            : null,*/
      },
    },
    {
      name: 'value',
      label: 'Valor',
      type: 'number',
      required: true,
      min: '0',
      validation: {
        min: 1,
      },
    },
    {
      name: 'valueMaxLaw',
      label: 'Valor Máximo según Ley',
      type: 'number',
      required: true,
      min: '0',
      validation: {
        min: 1,
      },
    },
  ],
};

export const deleteInsolvencyTariffConfig: ModalConfig = {
  title: 'Confirmar Eliminación',
  submitText: 'Eliminar',
  cancelText: 'Cancelar',
  fields: [
    {
      name: 'confirmation',
      label: '¿Estás seguro de eliminar esta tarifa de insolvencia?',
      type: 'text',
      defaultValue: 'Eliminar tarifa',
      validation: {
        custom: (value) =>
          value === 'Eliminar tarifa' ? null : 'Por favor escribe "Eliminar tarifa" para confirmar',
      },
    },
  ],
};