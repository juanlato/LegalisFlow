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

export const BaseModal = ({
  config,
  initialData,
  isOpen,
  onClose,
  onSubmit,
  loading,
}: BaseModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm();
  const modalContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      const defaultValues = config.fields.reduce(
        (acc, field) => {
          acc[field.name] = field.defaultValue || (field.type === 'multiselect' ? [] : '');
          return acc;
        },
        {} as Record<string, any>,
      );
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
    const commonProps = {
      ...register(field.name, {
        required: field.required,
        pattern: field.validation?.pattern,
        minLength: field.validation?.minLength,
        maxLength: field.validation?.maxLength,
        min: field.validation?.min,
        max: field.validation?.max,
        validate: field.validation?.custom
          ? (value) => field.validation?.custom?.(value) || true
          : undefined,
      }),
      className: `input-field w-full ${errors[field.name] ? 'border-red-500' : ''}`,
      disabled: field.disabled,
      readOnly: field.readOnly,
      placeholder: field.placeholder,
    };
  
    switch (field.type) {
      case 'select':
        return (
          <select {...commonProps}>
            <option value="">Seleccione...</option>
            {field.options?.map((option) => (
              <option
                key={option.value}
                value={option.value}
                selected={watch(field.name) === option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        );
  
      case 'multiselect':
        return (
          <div className="max-h-60 space-y-2 overflow-y-auto rounded border p-2">
            {field.options?.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  type="checkbox"
                  id={`${field.name}-${option.value}`}
                  checked={watch(field.name)?.includes(option.value) || false}
                  onChange={(e) =>
                    handleMultiSelectChange(field.name, option.value, e.target.checked)
                  }
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                <label
                  htmlFor={`${field.name}-${option.value}`}
                  className="ml-2 text-sm text-gray-700"
                >
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
            {...commonProps}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
        );
  
      case 'number':
        return (
          <input
            type="number"
            {...commonProps}
            step={field.step}
            min={field.min}
            max={field.max}
          />
        );
  
      case 'date':
      case 'datetime-local':
        return <input type={field.type} {...commonProps} />;
  
      case 'textarea':
        return (
          <textarea
            {...commonProps}
            rows={field.rows || 3}
            className={`${commonProps.className} resize-y`}
          />
        );
  
      default:
        return <input type={field.type} {...commonProps} />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalContentRef}
        className="w-full max-w-md overflow-hidden rounded-lg bg-white shadow-xl"
      >
        <div className="p-6">
          <h2 className="mb-4 text-2xl font-bold text-gray-800">{config.title}</h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              {config.fields.map((field) => (
                <div key={field.name} className="mb-4">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {field.label}
                    {field.required && <span className="ml-1 text-red-500">*</span>}
                  </label>
                  {renderField(field)}
                  {errors[field.name] && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors[field.name]?.type === 'required' && 'Este campo es requerido'}
                      {errors[field.name]?.type === 'pattern' && 'Formato inválido'}
                      {errors[field.name]?.type === 'minLength' && `Mínimo ${field.validation?.minLength} caracteres`}
                      {errors[field.name]?.type === 'maxLength' && `Máximo ${field.validation?.maxLength} caracteres`}
                      {errors[field.name]?.type === 'min' && `El valor mínimo permitido es ${field.validation?.min}`}
                      {errors[field.name]?.type === 'max' && `El valor máximo permitido es ${field.validation?.max}`}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50"
              >
                {config.cancelText || 'Cancelar'}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg
                      className="mr-2 -ml-1 h-4 w-4 animate-spin text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Procesando...
                  </span>
                ) : (
                  config.submitText || 'Guardar'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
