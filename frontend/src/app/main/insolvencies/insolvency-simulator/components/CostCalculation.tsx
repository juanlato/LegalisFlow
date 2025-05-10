import React from 'react';

interface CalculationResult {
  estimatedCost: number;
  tariffApplied: any | null;
  details: {
    totalDebt?: number;
    valueMaxLaw?: number;
    tariffRange?: string;
    message?: string;
  };
}

interface CostCalculationProps {
  calculationResult: CalculationResult;
  onAccept: () => void;
  onBack: () => void;
}

export default function CostCalculation({ 
  calculationResult, 
  onAccept, 
  onBack 
}: CostCalculationProps) {

  if (!calculationResult.tariffApplied) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Resultado del Cálculo</h2>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  {calculationResult.details.message || 'No se pudo calcular el costo para su caso. Por favor, contacte directamente con nuestros asesores.'}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between pt-6">
          <button
            onClick={onBack}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
          >
            Atrás
          </button>
          <button
            onClick={onAccept}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Continuar de Todas Formas
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Cálculo de Costos</h2>
        <p className="mb-4 text-gray-600">
          Basado en la información proporcionada, hemos calculado el costo aproximado 
          de su proceso de insolvencia:
        </p>
      </div>

      <div className="bg-white border rounded-lg shadow-sm p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total Deuda</h3>
              <p className="text-lg font-semibold">
                {calculationResult.details.totalDebt?.toLocaleString('es-CO', {
                  style: 'currency',
                  currency: 'COP',
                })}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Rango Aplicable</h3>
              <p className="text-lg font-semibold">{calculationResult.details.tariffRange}</p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Costo Estimado</h3>
                <p className="text-2xl font-bold text-green-600">
                  {calculationResult.estimatedCost.toLocaleString('es-CO', {
                    style: 'currency',
                    currency: 'COP',
                  })}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Valor Máximo Legal</h3>
                <p className="text-lg font-semibold">
                  {calculationResult.details.valueMaxLaw?.toLocaleString('es-CO', {
                    style: 'currency',
                    currency: 'COP',
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>Nota:</strong> Este es un cálculo aproximado basado en la información proporcionada. 
              El valor final puede variar dependiendo del análisis detallado de su caso.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <button
          onClick={onBack}
          className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
        >
          Atrás
        </button>
        <button
          onClick={onAccept}
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          Aceptar y Continuar
        </button>
      </div>
    </div>
  );
}
