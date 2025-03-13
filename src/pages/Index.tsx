
import React from 'react';
import { CVProvider, useCV } from '@/context/CVContext';
import Header from '@/components/Header';
import CVUpload from '@/components/CVUpload';
import QuestionList from '@/components/QuestionList';
import AnswerGenerator from '@/components/AnswerGenerator';
import Footer from '@/components/Footer';
import { Step } from '@/utils/types';

const StepContent: React.FC = () => {
  const { currentStep } = useCV();
  
  switch (currentStep) {
    case Step.UPLOAD:
      return <CVUpload />;
    case Step.QUESTIONS:
      return <QuestionList />;
    case Step.ANSWERS:
      return <AnswerGenerator />;
    default:
      return <CVUpload />;
  }
};

const Index: React.FC = () => {
  return (
    <CVProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-24 pb-12">
          <StepContent />
        </main>
        <Footer />
      </div>
    </CVProvider>
  );
};

export default Index;
