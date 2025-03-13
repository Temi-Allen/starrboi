
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CVData, Question, STARRAnswer, Step } from '../utils/types';
import { competencyQuestions, mockSTARRAnswer } from '../utils/mockData';

interface CVContextType {
  cvData: CVData | null;
  setCvData: (data: CVData | null) => void;
  selectedQuestion: Question | null;
  setSelectedQuestion: (question: Question | null) => void;
  currentStep: Step;
  setCurrentStep: (step: Step) => void;
  answer: STARRAnswer | null;
  setAnswer: (answer: STARRAnswer | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  questions: Question[];
  generateAnswer: (question: Question) => Promise<void>;
  resetState: () => void;
}

const CVContext = createContext<CVContextType | undefined>(undefined);

export const CVProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [currentStep, setCurrentStep] = useState<Step>(Step.UPLOAD);
  const [answer, setAnswer] = useState<STARRAnswer | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [questions] = useState<Question[]>(competencyQuestions);

  // This would normally connect to an API
  const generateAnswer = async (question: Question): Promise<void> => {
    setIsLoading(true);
    setSelectedQuestion(question);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, this would make an API call to generate the STARR answer
      setAnswer(mockSTARRAnswer);
      setCurrentStep(Step.ANSWERS);
    } catch (error) {
      console.error('Error generating answer:', error);
      // Would handle error state here
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setCvData(null);
    setSelectedQuestion(null);
    setAnswer(null);
    setCurrentStep(Step.UPLOAD);
  };

  return (
    <CVContext.Provider
      value={{
        cvData,
        setCvData,
        selectedQuestion,
        setSelectedQuestion,
        currentStep,
        setCurrentStep,
        answer,
        setAnswer,
        isLoading,
        setIsLoading,
        questions,
        generateAnswer,
        resetState
      }}
    >
      {children}
    </CVContext.Provider>
  );
};

export const useCV = (): CVContextType => {
  const context = useContext(CVContext);
  if (context === undefined) {
    throw new Error('useCV must be used within a CVProvider');
  }
  return context;
};
