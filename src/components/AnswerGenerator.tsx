
import React, { useState } from 'react';
import { useCV } from '@/context/CVContext';
import { Step } from '@/utils/types';
import { Copy, Download, ArrowLeft } from 'lucide-react';

const AnswerGenerator: React.FC = () => {
  const { answer, selectedQuestion, setCurrentStep, isLoading } = useCV();
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  
  if (isLoading) {
    return <AnswerLoading />;
  }
  
  if (!answer || !selectedQuestion) {
    return <div>No answer available</div>;
  }
  
  const handleCopySection = (section: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };
  
  const handleCopyAll = () => {
    const fullAnswer = Object.values(answer).join('\n\n');
    navigator.clipboard.writeText(fullAnswer);
    setCopiedSection('all');
    setTimeout(() => setCopiedSection(null), 2000);
  };
  
  const handleDownload = () => {
    const fullAnswer = `
      # STARR Answer for: ${selectedQuestion.text}
      
      ## Situation
      ${answer.situation}
      
      ## Task
      ${answer.task}
      
      ## Action
      ${answer.action}
      
      ## Result
      ${answer.result}
      
      ## Reflection
      ${answer.reflection}
    `;
    
    const blob = new Blob([fullAnswer], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'STARR-Answer.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 animate-slide-in">
      <div className="flex items-center mb-6">
        <button
          onClick={() => setCurrentStep(Step.QUESTIONS)}
          className="text-muted-foreground hover:text-foreground flex items-center gap-1 focus-ring rounded-md p-1"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to questions</span>
        </button>
      </div>
      
      <div className="text-center mb-8 space-y-2">
        <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
          Step 3
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Your STARR Answer</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Use this professionally crafted response for your competency-based interview.
        </p>
      </div>

      <div className="mb-6 p-4 bg-muted rounded-lg">
        <h2 className="font-medium text-lg mb-1">Question:</h2>
        <p>{selectedQuestion.text}</p>
      </div>
      
      <div className="space-y-6 mb-8">
        <AnswerSection 
          title="Situation" 
          content={answer.situation} 
          onCopy={() => handleCopySection('situation', answer.situation)}
          isCopied={copiedSection === 'situation'}
        />
        
        <AnswerSection 
          title="Task" 
          content={answer.task} 
          onCopy={() => handleCopySection('task', answer.task)}
          isCopied={copiedSection === 'task'}
        />
        
        <AnswerSection 
          title="Action" 
          content={answer.action} 
          onCopy={() => handleCopySection('action', answer.action)}
          isCopied={copiedSection === 'action'}
        />
        
        <AnswerSection 
          title="Result" 
          content={answer.result} 
          onCopy={() => handleCopySection('result', answer.result)}
          isCopied={copiedSection === 'result'}
        />
        
        <AnswerSection 
          title="Reflection" 
          content={answer.reflection} 
          onCopy={() => handleCopySection('reflection', answer.reflection)}
          isCopied={copiedSection === 'reflection'}
        />
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        <button
          onClick={handleCopyAll}
          className="px-4 py-2 rounded-lg border bg-secondary hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2 focus-ring"
        >
          <Copy className="h-4 w-4" />
          {copiedSection === 'all' ? 'Copied!' : 'Copy All'}
        </button>
        
        <button
          onClick={handleDownload}
          className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 focus-ring"
        >
          <Download className="h-4 w-4" />
          Download
        </button>
      </div>
    </div>
  );
};

const AnswerSection: React.FC<{
  title: string;
  content: string;
  onCopy: () => void;
  isCopied: boolean;
}> = ({ title, content, onCopy, isCopied }) => {
  return (
    <div className="border rounded-lg overflow-hidden transition-all duration-300 hover:shadow-sm hover:border-primary/20">
      <div className="flex items-center justify-between bg-muted/50 px-4 py-2 border-b">
        <h3 className="font-medium">{title}</h3>
        <button
          onClick={onCopy}
          className="text-muted-foreground hover:text-foreground p-1 rounded focus-ring"
        >
          {isCopied ? (
            <span className="text-sm text-primary">Copied!</span>
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      </div>
      <div className="p-4">
        <p className="text-foreground">{content}</p>
      </div>
    </div>
  );
};

const AnswerLoading: React.FC = () => {
  return (
    <div className="w-full max-w-3xl mx-auto p-4 animate-slide-in">
      <div className="text-center mb-8 space-y-2">
        <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
          Step 3
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Generating Your Answer</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Creating a personalized STARR format response based on your CV<span className="loading-dots"></span>
        </p>
      </div>
      
      <div className="space-y-4 mb-8">
        {['Situation', 'Task', 'Action', 'Result', 'Reflection'].map((section, index) => (
          <div key={section} className="border rounded-lg overflow-hidden animate-pulse">
            <div className="flex items-center justify-between bg-muted/50 px-4 py-2 border-b">
              <h3 className="font-medium">{section}</h3>
            </div>
            <div className="p-4 space-y-2">
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-11/12"></div>
              <div className="h-4 bg-muted rounded w-10/12"></div>
              {index < 2 && <div className="h-4 bg-muted rounded w-9/12"></div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnswerGenerator;
