// FieldConfig.ts
export type FieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'number'
  | 'date'
  | 'datetime-local'
  | 'textarea';

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  defaultValue?: any;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;

  // Para inputs numéricos
  step?: string;
  min?: string;
  max?: string;

  // Para selects y multiselects
  options?: Array<{ value: any; label: string }>;
  optionValue?: string; // Para cuando options son objetos complejos
  optionLabel?: string; // Para cuando options son objetos complejos

  // Para textareas
  rows?: number;

  validation?: {
    pattern?: RegExp;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    custom?: (value: any) => string | null;
  };
}