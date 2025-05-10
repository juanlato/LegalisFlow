import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

interface Debt {
  id: string;
  creditor: string;
  creditorType: string;
  amount: number;
  description?: string;
}

interface DebtFormProps {
  initialDebts: Debt[];
  onSubmit: (debts: Debt[]) => void;
}

export default function DebtForm({ initialDebts = [], onSubmit }: DebtFormProps) {
  const [debts, setDebts] = useState<Debt[]>(initialDebts);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      creditor: '',
      creditorType: 'bank',
      amount: '',
      description: '',
    }
  });

  const addDebt = (data: any) => {
    const newDebt = {
      id: Date.now().toString(),
      creditor: data.creditor,
      creditorType: data.creditorType,
      amount: parseFloat(data.amount),
      description: data.description
    };

    setDebts([...debts, newDebt]);
    toast.success('Deuda agregada correctamente');
    reset();
  };

  const removeDebt = (id: string) => {
    setDebts(debts.filter(debt => debt.id !== id));
    toast.info('Deuda eliminada');
  };

  const handleFormSubmit = () => {
    if (debts.length === 0) {
      toast.error('Debe registrar al menos una deuda');
      return;
    }
    onSubmit(debts);
  };

  const totalDebt = debts.reduce((sum, debt) => sum + debt.amount, 0);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Registro de Deudas</h2>
        <p className="mb-4 text-gray-600">
          Registre todas sus deudas actuales con sus respectivos acreedores para 
          determinar si califica para un proceso de insolvencia.
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded-md">
        <h3 className="font-medium mb-4">Agregar Nueva Deuda</h3>
        
        <form onSubmit={handleSubmit(addDebt)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Acreedor
              </label>
              <input
                type="text"
                {...register("creditor", { required: "El nombre del acreedor es requerido" })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Nombre del acreedor"
              />
              {errors.creditor && (
                <p className="mt-1 text-sm text-red-600">{errors.creditor.message as string}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Acreedor
              </label>
              <select
                {...register("creditorType", { required: "Seleccione un tipo de acreedor" })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="bank">Banco</option>
                <option value="credit_card">Tarjeta de Crédito</option>
                <option value="loan">Préstamo Personal</option>
                <option value="service">Servicio</option>
                <option value="other">Otro</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monto de la Deuda
            </label>
            <input
              type="number"
              {...register("amount", { 
                required: "El monto es requerido",
                min: { value: 1, message: "El valor debe ser mayor a cero" } 
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="0.00"
              step="0.01"
            />
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount.message as string}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción (Opcional)
            </label>
            <textarea
              {...register("description")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Detalles adicionales sobre la deuda"
              rows={2}
            />
          </div>
          
          <div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Agregar Deuda
            </button>
          </div>
        </form>
      </div>

      {debts.length > 0 && (
        <div>
          <h3 className="font-medium mb-2">Deudas Registradas</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acreedor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {debts.map((debt) => (
                  <tr key={debt.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{debt.creditor}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {debt.creditorType === 'bank' && 'Banco'}
                      {debt.creditorType === 'credit_card' && 'Tarjeta de Crédito'}
                      {debt.creditorType === 'loan' && 'Préstamo Personal'}
                      {debt.creditorType === 'service' && 'Servicio'}
                      {debt.creditorType === 'other' && 'Otro'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {debt.amount.toLocaleString('es-CO', {
                        style: 'currency',
                        currency: 'COP',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => removeDebt(debt.id)}
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
                    Total Deudas:
                  </td>
                  <td colSpan={2} className="px-6 py-3 font-bold">
                    {totalDebt.toLocaleString('es-CO', {
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

      <div className="flex justify-end pt-6">
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
