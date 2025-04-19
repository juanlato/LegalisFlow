// src/modules/auth/interfaces/user-payload.interface.ts

export interface UserPayload {
    sub: string;          // ID del usuario (subject)
    email: string;        // Email del usuario
    tenantId: string;      // ID del tenant al que pertenece
    role?: string;         // Nombre del rol (opcional)
    permissions: string[]; // Lista de permisos del usuario
  }