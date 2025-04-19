// lib/roleConfig.ts
import { ModalConfig } from "@/components/lib/ModalConfig";

export const createRoleConfig: ModalConfig = {
  title: 'Crear Nuevo Rol',
  submitText: 'Crear Rol',
  fields: [
    {
      name: 'name',
      label: 'Nombre del Rol',
      type: 'text',
      required: true,
    },
    {
      name: 'permissionIds',
      label: 'Permisos',
      type: 'multiselect',
      options: [], // Se llenará dinámicamente
      required: false,
    },
  ],
};

export const editRoleConfig: ModalConfig = {
  title: 'Editar Rol',
  submitText: 'Actualizar Rol',
  fields: [
    {
      name: 'name',
      label: 'Nombre del Rol',
      type: 'text',
      required: true,
    },
    {
      name: 'permissionIds',
      label: 'Permisos',
      type: 'multiselect',
      options: [], // Se llenará dinámicamente
      required: false,
    },
  ],
};

export const deleteRoleConfig: ModalConfig = {
  title: 'Confirmar Eliminación',
  submitText: 'Eliminar',
  cancelText: 'Cancelar',
  fields: [
    {
      name: 'confirmation',
      label: '¿Estás seguro de eliminar este rol?',
      type: 'text',
      defaultValue: 'Eliminar rol',
      validation: {
        custom: (value) => value === 'Eliminar rol' ? null : 'Por favor escribe "Eliminar rol" para confirmar',
      },
    },
  ],
};

export const assignPermissionsConfig: ModalConfig = {
  title: 'Asignar Permisos al Rol',
  submitText: 'Asignar Permisos',
  fields: [
    {
      name: 'permissionIds',
      label: 'Seleccionar Permisos',
      type: 'multiselect',
      options: [], // Se llenará dinámicamente
      required: true,
    },
  ],
};