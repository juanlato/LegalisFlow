import { ModalConfig } from '@/components/lib/ModalConfig';

export const createUnitReferenceConfig: ModalConfig = {
  title: 'Crear Nueva Unidad de Referencia',
  submitText: 'Crear Unidad',
  fields: [
    {
      name: 'code',
      label: 'Código',
      type: 'text',
      required: true,
      placeholder: 'Ej: SMMLV',
      validation: {
        //required: 'El código es obligatorio',
      },
    },
    {
      name: 'name',
      label: 'Nombre',
      type: 'text',
      required: true,
      placeholder: 'Ej: Salario Mínimo Mensual Legal Vigente',
      validation: {
        //required: 'El nombre es obligatorio',
      },
    },
    {
      name: 'value',
      label: 'Valor',
      type: 'number',
      required: true,
      step: '0.01',
      min: '0.01',
      placeholder: 'Ej: 1160000',
      validation: {
        min: 0.01,
        custom: (value) => (value <= 0 ? 'El valor debe ser mayor a 0' : null),
      },
    },
    {
      name: 'currencyId',
      label: 'Moneda',
      type: 'select',
      required: true,
      options: [], // Se cargarán dinámicamente
      validation: {
        //required: 'La moneda es obligatoria',
      },
    },
  ],
};

export const editUnitReferenceConfig: ModalConfig = {
  title: 'Editar Unidad de Referencia',
  submitText: 'Actualizar Unidad',
  fields: [
    {
      name: 'code',
      label: 'Código',
      type: 'text',
      required: true,
      validation: {
        //required: 'El código es obligatorio',
      },
    },
    {
      name: 'name',
      label: 'Nombre',
      type: 'text',
      required: true,
      validation: {
        //required: 'El nombre es obligatorio',
      },
    },
    {
      name: 'value',
      label: 'Valor',
      type: 'number',
      required: true,
      step: '0.01',
      min: '0.01',
      validation: {
        min: 0.01,
        custom: (value) => (value <= 0 ? 'El valor debe ser mayor a 0' : null),
      },
    },
    {
      name: 'currencyId',
      label: 'Moneda',
      type: 'select',
      required: true,
      options: [], // Se cargarán dinámicamente
      validation: {
        //required: 'La moneda es obligatoria',
      },
    },
  ],
};

export const deleteUnitReferenceConfig: ModalConfig = {
  title: 'Confirmar Eliminación',
  submitText: 'Eliminar',
  cancelText: 'Cancelar',
  fields: [
    {
      name: 'confirmation',
      label: '¿Estás seguro de eliminar esta unidad de referencia?',
      type: 'text',
      defaultValue: 'Eliminar unidad',
      validation: {
        custom: (value) =>
          value === 'Eliminar unidad' ? null : 'Por favor escribe "Eliminar unidad" para confirmar',
      },
    },
  ],
};