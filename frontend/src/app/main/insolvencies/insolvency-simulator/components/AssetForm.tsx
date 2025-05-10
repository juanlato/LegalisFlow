import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

interface Asset {
  id: string;
  type: string;
  description: string;
  value: number;
}

interface AssetFormProps {
  initialAssets: {
    total: number;
    details: Asset[];
  };
  onSubmit: (assets: { total: number; details: Asset[] }) => void;
}

export default function AssetForm({ initialAssets, onSubmit }: AssetFormProps) {
  const [assets, setAssets] = useState<Asset[]>(initialAssets.details || []);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      type: 'property',
      description: '',
      value: '',
    }
  });

  const addAsset = (data: any) => {
    const newAsset = {
      id: Date.now().toString(),
      type: data.type,
      description: data.description,
      value: parseFloat(data.value),
    };

    setAssets([...assets, newAsset]);
    toast.success('Activo agregado correctamente');
    reset();
  };

  const removeAsset = (id: string) => {
    setAssets(assets.filter(asset => asset.id !== id));
    toast.info('Activo eliminado');
  };

  const handleFormSubmit = () => {
    const total = assets.reduce((sum, asset) => sum + asset.value, 0);
    onSubmit({
      total,
      details: assets,
    });
  };

  const totalAssets = assets.reduce((sum, asset) => sum + asset.value, 0);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Registro de Activos</h2>
        <p className="mb-4 text-gray-600">
          Registre el valor de sus activos, excluyendo su casa de habitación personal 
          y su vehículo personal de trabajo. Esta información es necesaria para 
          determinar su condición financiera.
        </p>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Nota importante:</strong> No incluya en este registro su casa de habitación personal 
                ni su vehículo personal de trabajo, ya que estos no son considerados 
                para el proceso de insolvencia.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-md">
        <h3 className="font-medium mb-4">Agregar Nuevo Activo</h3>
        
        <form onSubmit={handleSubmit(addAsset)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Activo
              </label>
              <select
                {...register("type", { required: "Seleccione un tipo de activo" })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="property">Propiedad</option>
                <option value="vehicle">Vehículo</option>
                <option value="investment">Inversión</option>
                <option value="savings">Ahorros</option>
                <option value="other">Otro</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor Estimado
              </label>
              <input
                type="number"
                {...register("value", { 
                  required: "El valor es requerido",
                  min: { value: 1, message: "El valor debe ser mayor a cero" } 
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="0.00"
                step="0.01"
              />
              {errors.value && (
                <p className="mt-1 text-sm text-red-600">{errors.value.message as string}</p>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              {...register("description", { required: "La descripción es requerida" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Describa el activo"
              rows={2}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message as string}</p>
            )}
          </div>
          
          <div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Agregar Activo
            </button>
          </div>
        </form>
      </div>

      {assets.length > 0 && (
        <div>
          <h3 className="font-medium mb-2">Activos Registrados</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assets.map((asset) => (
                  <tr key={asset.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {asset.type === 'property' && 'Propiedad'}
                      {asset.type === 'vehicle' && 'Vehículo'}
                      {asset.type === 'investment' && 'Inversión'}
                      {asset.type === 'savings' && 'Ahorros'}
                      {asset.type === 'other' && 'Otro'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{asset.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {asset.value.toLocaleString('es-CO', {
                        style: 'currency',
                        currency: 'COP',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => removeAsset(asset.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50">
                  <td colSpan={2} className="px-6 py-3 text-right font-medium">
                    Total Activos:
                  </td>
                  <td colSpan={2} className="px-6 py-3 font-bold">
                    {totalAssets.toLocaleString('es-CO', {
                      style: 'currency',
                      currency: 'COP',
                    })}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      <div className="flex justify-between pt-6">
        <button
          onClick={() => onSubmit({ total: 0, details: [] })}
          className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
        >
          Atrás
        </button>
        <button
          onClick={handleFormSubmit}
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
