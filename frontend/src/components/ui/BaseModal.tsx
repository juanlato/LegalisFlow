'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { ModalConfig } from '../lib/ModalConfig';
import { FieldConfig } from '../lib/FieldConfig';

interface BaseModalProps {
  config: ModalConfig;
  initialData?: Record<string, any>;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, any>) => void;
  loading?: boolean;
}

export const BaseModal = ({ config, initialData, isOpen, onClose, onSubmit, loading }: BaseModalProps) => {
  const { register, handleSubmit, reset, formState: { errors }, setValue, watch } = useForm();
  const modalContentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      const defaultValues = config.fields.reduce((acc, field) => {
        acc[field.name] = field.defaultValue || (field.type === 'multiselect' ? [] : '');
        return acc;
      }, {} as Record<string, any>);
      reset(defaultValues);
    }
  }, [initialData, config.fields, reset, isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalContentRef.current && !modalContentRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const handleMultiSelectChange = (fieldName: string, optionValue: any, isChecked: boolean) => {
    const currentValues = watch(fieldName) || [];
    let newValues;
    
    if (isChecked) {
      newValues = [...currentValues, optionValue];
    } else {
      newValues = currentValues.filter((val: any) => val !== optionValue);
    }
    
    setValue(fieldName, newValues);
  };

  const renderField = (field: FieldConfig) => {
    switch (field.type) {
      case 'select':
        return (
          <select
            {...register(field.name, { required: field.required })}
            className="form-select mt-1 block w-full"
          >
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'multiselect':
        return (
          <div className="space-y-2 max-h-60 overflow-y-auto p-2 border rounded">
            {field.options?.map(option => (
              <div key={option.value} className="flex items-center">
                <input
                  type="checkbox"
                  id={`${field.name}-${option.value}`}
                  checked={watch(field.name)?.includes(option.value) || false}
                  onChange={(e) => handleMultiSelectChange(field.name, option.value, e.target.checked)}
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                <label htmlFor={`${field.name}-${option.value}`} className="ml-2 text-sm text-gray-700">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );
      case 'checkbox':
        return (
          <input
            type="checkbox"
            {...register(field.name)}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
        );
      default:
        return (
          <input
            type={field.type}
            {...register(field.name, { 
              required: field.required,
              pattern: field.validation?.pattern,
              minLength: field.validation?.minLength,
              maxLength: field.validation?.maxLength,
            })}
            className="w-full input-field"
          />
        );
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalContentRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden"
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">{config.title}</h2>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              {config.fields.map(field => (
                <div key={field.name} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {renderField(field)}
                  {errors[field.name] && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors[field.name]?.type === 'required' && 'Este campo es requerido'}
                      {errors[field.name]?.type === 'pattern' && 'Formato inválido'}
                      {errors[field.name]?.type === 'minLength' && `Mínimo ${field.validation?.minLength} caracteres`}
                      {errors[field.name]?.type === 'maxLength' && `Máximo ${field.validation?.maxLength} caracteres`}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                {config.cancelText || 'Cancelar'}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                  </span>
                ) : config.submitText || 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};