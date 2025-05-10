import React from 'react';

interface Step {
  id: number;
  name: string;
}

interface StepNavigationProps {
  steps: Step[];
  currentStep: number;
  onStepChange: (step: number) => void;
}

export default function StepNavigation({ steps, currentStep, onStepChange }: StepNavigationProps) {
  return (
    <nav aria-label="Progress">
      <ol className="flex items-center">
        {steps.map((step, index) => (
          <li 
            key={step.id} 
            className={`relative ${index < steps.length - 1 ? 'pr-8 sm:pr-20 flex-1' : ''}`}
          >
            <div className="flex items-center">
              <button
                onClick={() => onStepChange(step.id)}
                disabled={step.id > currentStep}
                className={`h-10 w-10 flex items-center justify-center rounded-full ${
                  step.id < currentStep
                    ? 'bg-blue-600 hover:bg-blue-800'
                    : step.id === currentStep
                    ? 'bg-blue-600 ring-2 ring-blue-600 ring-offset-2'
                    : 'bg-gray-300'
                } transition-colors duration-200`}
              >
                <span className={`text-sm font-medium ${step.id <= currentStep ? 'text-white' : 'text-gray-500'}`}>
                  {step.id}
                </span>
              </button>
            </div>
            
            <div className="mt-2">
              <span className={`text-sm font-medium ${step.id <= currentStep ? 'text-blue-600' : 'text-gray-500'}`}>
                {step.name}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div className="absolute top-5 left-0 w-full flex justify-center">
                <div 
                  className={`h-0.5 w-full ${
                    step.id < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                ></div>
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
