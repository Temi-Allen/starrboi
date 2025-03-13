
import React from 'react';
import { useCV } from '@/context/CVContext';
import { Step } from '@/utils/types';

const Header: React.FC = () => {
  const { currentStep, resetState } = useCV();
  
  return (
    <header className="w-full py-6 px-4 sm:px-6 md:px-8 flex justify-between items-center glass fixed top-0 z-50 animate-fade-in">
      <div className="flex items-center space-x-2">
        <div className="bg-primary/10 p-2 rounded-lg">
          <div className="w-6 h-6 bg-primary rounded-md"></div>
        </div>
        <div className="font-medium text-lg md:text-xl">STARR Generator</div>
      </div>
      
      <nav className="hidden md:flex items-center space-x-1">
        <StepIndicator 
          step={Step.UPLOAD} 
          currentStep={currentStep} 
          label="Upload CV" 
        />
        <Divider />
        <StepIndicator 
          step={Step.QUESTIONS} 
          currentStep={currentStep} 
          label="Select Question" 
        />
        <Divider />
        <StepIndicator 
          step={Step.ANSWERS} 
          currentStep={currentStep} 
          label="View Answers" 
        />
      </nav>
      
      <button 
        onClick={resetState}
        className="text-sm text-primary focus-ring rounded-md px-3 py-1.5 transition-all hover:bg-primary/5"
      >
        Restart
      </button>
    </header>
  );
};

const StepIndicator: React.FC<{ 
  step: Step; 
  currentStep: Step; 
  label: string; 
}> = ({ step, currentStep, label }) => {
  const isActive = currentStep === step;
  const isPast = getStepOrder(currentStep) > getStepOrder(step);
  
  return (
    <div className="flex items-center space-x-2">
      <div className={`
        w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300
        ${isActive ? 'bg-primary text-white' : ''}
        ${isPast ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'}
      `}>
        {getStepNumber(step)}
      </div>
      <span className={`hidden lg:inline text-sm transition-colors duration-300 ${isActive ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
        {label}
      </span>
    </div>
  );
};

const Divider: React.FC = () => (
  <div className="w-6 h-px bg-border mx-1"></div>
);

// Helper functions
function getStepOrder(step: Step): number {
  switch (step) {
    case Step.UPLOAD: return 1;
    case Step.QUESTIONS: return 2;
    case Step.ANSWERS: return 3;
    default: return 0;
  }
}

function getStepNumber(step: Step): number {
  return getStepOrder(step);
}

export default Header;
