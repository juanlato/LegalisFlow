'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify'; 

import { getInsolvencyTariffs } from '@/lib/api/insolvencyTariffs';

import StepNavigation from './components/StepNavigation';
import DebtForm from './components/DebtForm';
import AssetForm from './components/AssetForm';
import CostCalculation from './components/CostCalculation';
import PersonalInfoForm from './components/PersonalInfoForm';



//import { submitInsolvencySimulation } from './api/simulations';

export default function InsolvencySimulatorPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [insolvencyTariffs, setInsolvencyTariffs] = useState<any[]>([]); 
  const [simulationData, setSimulationData] = useState<any>({
    debts: [],
    assets: {
      total: 0,
      details: [],
    },
    calculatedCost: {
      estimatedCost: 0,
      tariffApplied: null,
      details: {}
    },
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      idNumber: '',
      address: ''
    }
  });

  useEffect(() => {
    const fetchTariffs = async () => {
      try {
        const params = {
            page: 0,
            limit: 100,             
          };
    
        const response = await getInsolvencyTariffs(params); 
        setInsolvencyTariffs(response.data);
      } catch (error) {
        console.error('Error fetching insolvency tariffs:', error);
        toast.error('No se pudieron cargar las tarifas de insolvencia');
      }
    };

    fetchTariffs();
  }, []);

  const calculateInsolvencyCost = () => {
    // Calculate total debt
    const totalDebt = simulationData.debts.reduce((sum, debt) => sum + debt.amount, 0);
    
    // Find applicable tariff
    const applicableTariff = insolvencyTariffs.find(
      tariff => totalDebt >= tariff.lowerLimit && totalDebt <= tariff.upperLimit
    );

    if (!applicableTariff) {
      return {
        estimatedCost: 0,
        tariffApplied: null,
        details: {
          totalDebt,
          message: 'No se encontró una tarifa aplicable para este monto de deuda'
        }
      };
    }

    return {
      estimatedCost: applicableTariff.value,
      tariffApplied: applicableTariff,
      details: {
        totalDebt,
        valueMaxLaw: applicableTariff.valueMaxLaw,
        tariffRange: `${applicableTariff.lowerLimit} - ${applicableTariff.upperLimit}`
      }
    };
  };

  const handleStepChange = (step : any) => {
    // Validate current step before proceeding
    if (step > currentStep) {
      if (currentStep === 1 && simulationData.debts.length === 0) {
        toast.error('Debe registrar al menos una deuda');
        return;
      }
      
      if (currentStep === 2 && simulationData.assets.total <= 0) {
        toast.error('Debe registrar el valor de sus activos');
        return;
      }
      
      // Before step 3, calculate the cost
      if (step === 3) {
        const costCalculation = calculateInsolvencyCost();
        setSimulationData(prev => ({
          ...prev,
          calculatedCost: costCalculation
        }));
      }
    }
    
    setCurrentStep(step);
  };

  const handleDebtsSubmit = (debts) => {
    setSimulationData(prev => ({ ...prev, debts }));
    handleStepChange(2);
  };

  const handleAssetsSubmit = (assets) => {
    setSimulationData(prev => ({ ...prev, assets }));
    handleStepChange(3);
  };

  const handleCostAccept = () => {
    handleStepChange(4);
  };

  const handlePersonalInfoSubmit = async (personalInfo) => {
    setIsLoading(true);
    try {
      const finalData = {
        ...simulationData,
        personalInfo
      };
      
      //await submitInsolvencySimulation(finalData);
      toast.success('¡Su solicitud de simulación ha sido registrada con éxito!');
      router.push('/main/insolvencies/dashboard');
    } catch (error) {
      console.error('Error submitting simulation:', error);
      toast.error('Error al enviar la simulación. Por favor intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Simulador de Insolvencia
      </h1>
      
      <StepNavigation 
        currentStep={currentStep}
        onStepChange={handleStepChange}
        steps={[
          { id: 1, name: 'Registro de Deudas' },
          { id: 2, name: 'Registro de Activos' },
          { id: 3, name: 'Cálculo de Costos' },
          { id: 4, name: 'Datos Personales' }
        ]}
      />

      <div className="bg-white shadow-lg rounded-lg p-6 mt-6">
        {currentStep === 1 && (
          <DebtForm 
            initialDebts={simulationData.debts}
            onSubmit={handleDebtsSubmit}
          />
        )}
        
        {currentStep === 2 && (
          <AssetForm 
            initialAssets={simulationData.assets}
            onSubmit={handleAssetsSubmit}
          />
        )}
        
        {currentStep === 3 && (
          <CostCalculation 
            calculationResult={simulationData.calculatedCost}
            onAccept={handleCostAccept}
            onBack={() => handleStepChange(2)}
          />
        )}
        
        {currentStep === 4 && (
          <PersonalInfoForm 
            initialValues={simulationData.personalInfo}
            onSubmit={handlePersonalInfoSubmit}
            onBack={() => handleStepChange(3)}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
}