import { ModalConfig } from "@/components/lib/ModalConfig"; 

export const createUserConfig: ModalConfig = {
  title: 'Crear Nuevo Usuario',
  submitText: 'Crear Usuario',
  fields: [
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      validation: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      },
    },
    {
      name: 'password',
      label: 'Contraseña',
      type: 'password',
      required: true,
      validation: {
        minLength: 8,
      },
    },
    {
      name: 'isActive',
      label: 'Usuario Activo',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'roleId',
      label: 'Rol',
      type: 'select',
      required: true,
      options: [],
    },
  ],
};

export const editUserConfig: ModalConfig = {
  title: 'Editar Usuario',
  submitText: 'Actualizar Usuario',
  fields: [
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      validation: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      },
    },
    {
      name: 'isActive',
      label: 'Usuario Activo',
      type: 'checkbox',
    },
    {
      name: 'roleId',
      label: 'Rol',
      type: 'select',
      required: true,
      options: [],
    },
  ],
};

export const assignRoleUserConfig: ModalConfig = {
  title: 'Asignar Rol al Usuario',
  submitText: 'Selecionar Rol',
  fields: [   
    {
      name: 'roleId',
      label: 'Seleccionar Rol',
      type: 'select',
      required: true,
      options: [],
    },
  ],
};

export const deleteUserConfig: ModalConfig = {
  title: 'Confirmar Eliminación',
  submitText: 'Eliminar',
  cancelText: 'Cancelar',
  fields: [
    {
      name: 'confirmation',
      label: '¿Estás seguro de eliminar este usuario?',
      type: 'text',
      defaultValue: 'Eliminar usuario',
      validation: {
        custom: (value) => value === 'Eliminar usuario' ? null : 'Por favor escribe "Eliminar usuario" para confirmar',
      },
    },
  ],
};

export const filterUserConfig: ModalConfig = {
  title: 'Filtrar Usuarios',
  submitText: 'Aplicar Filtros',
  fields: [
    {
      name: 'email',
      label: 'Buscar por email',
      type: 'text',
    },
    {
      name: 'isActive',
      label: 'Estado',
      type: 'select',
      options: [
        { value: '', label: 'Todos' },
      ],
    },
    {
      name: 'roleId',
      label: 'Rol',
      type: 'select',
      options: [
        { value: '', label: 'Todos los roles' },
      ],
    },
  ],
};