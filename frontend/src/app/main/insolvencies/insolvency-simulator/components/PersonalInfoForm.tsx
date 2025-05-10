import React from 'react';
import { useForm } from 'react-hook-form';

interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  idNumber: string;
  address: string;
  city?: string;
  birthDate?: string;
  occupation?: string;
  acceptTerms: boolean;
}

interface PersonalInfoFormProps {
  initialValues: Partial<PersonalInfo>;
  onSubmit: (data: PersonalInfo) => void;
  onBack: () => void;
  isLoading: boolean;
}

export default function PersonalInfoForm({
  initialValues,
  onSubmit,
  onBack,
  isLoading,
}: PersonalInfoFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: initialValues.name || '',
      email: initialValues.email || '',
      phone: initialValues.phone || '',
      idNumber: initialValues.idNumber || '',
      address: initialValues.address || '',
      city: initialValues.city || '',
      birthDate: initialValues.birthDate || '',
      occupation: initialValues.occupation || '',
      acceptTerms: false,
    },
  });

  const handleFormSubmit = (data: any) => {
    onSubmit(data);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Datos Personales</h2>
        <p className="mb-4 text-gray-600">
          Para completar su simulación, necesitamos algunos datos personales. Esta información
          será utilizada para registrar su solicitud de insolvencia.
        </p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre Completo *
            </label>
            <input
              type="text"
              {...register("name", { required: "El nombre es requerido" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Ingrese su nombre completo"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message as string}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo Electrónico *
            </label>
            <input
              type="email"
              {...register("email", { 
                required: "El correo electrónico es requerido",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Correo electrónico inválido"
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="correo@ejemplo.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message as string}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número de Documento de Identidad *
            </label>
            <input
              type="text"
              {...register("idNumber", { required: "El número de documento es requerido" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Ej. 1234567890"
            />
            {errors.idNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.idNumber.message as string}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono Celular *
            </label>
            <input
              type="tel"
              {...register("phone", { required: "El número de teléfono es requerido" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Ej. 3001234567"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message as string}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dirección *
            </label>
            <input
              type="text"
              {...register("address", { required: "La dirección es requerida" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Ingrese su dirección"
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">{errors.address.message as string}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ciudad
            </label>
            <input
              type="text"
              {...register("city")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Ingrese su ciudad"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Nacimiento
            </label>
            <input
              type="date"
              {...register("birthDate")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ocupación
            </label>
            <input
              type="text"
              {...register("occupation")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Ingrese su ocupación"
            />
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                {...register("acceptTerms", { required: "Debe aceptar los términos y condiciones" })}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="acceptTerms" className="text-sm text-gray-700">
                Acepto los términos y condiciones y autorizo el tratamiento de mis datos personales *
              </label>
              {errors.acceptTerms && (
                <p className="mt-1 text-sm text-red-600">{errors.acceptTerms.message as string}</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={onBack}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
            disabled={isLoading}
          >
            Atrás
          </button>
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400"
            disabled={isLoading}
          >
            {isLoading ? 'Enviando...' : 'Enviar Solicitud'}
          </button>
        </div>
      </form>
    </div>
  );
}
