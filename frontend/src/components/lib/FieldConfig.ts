export type FieldType = 'text' | 'email' | 'password' | 'select'| 'multiselect' | 'checkbox' | 'number';

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  defaultValue?: any;
  options?: Array<{ value: any; label: string }>; // Para selects
  validation?: {
    pattern?: RegExp;
    minLength?: number;
    maxLength?: number;
    custom?: (value: any) => string | null; // Mensaje de error o null si válido
  };
}