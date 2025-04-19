import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Función para manejar errores de API
export function handleApiError(error: unknown) {
  if (error instanceof Error) {
    console.error('Error:', error.message);
    return error.message;
  }
  return 'Ocurrió un error desconocido';
}