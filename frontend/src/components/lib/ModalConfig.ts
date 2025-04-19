import { FieldConfig } from './FieldConfig';

export interface ModalConfig {
  title: string;
  fields: FieldConfig[];
  submitText?: string;
  cancelText?: string;
}