
import React, { useState } from 'react';
import { useCV } from '@/context/CVContext';
import { Question } from '@/utils/types';
import { Search, Filter, ChevronRight } from 'lucide-react';

const QuestionList: React.FC = () => {
  const { questions, generateAnswer, isLoading, cvData } = useCV();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Extract unique categories
  const categories = Array.from(new Set(questions.map(q => q.category)));
  
  // Filter questions by search term and category
  const filteredQuestions = questions.filter(question => {
    const matchesSearch = searchTerm === '' || 
      question.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.category.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = selectedCategory === null || 
      question.category === selectedCategory;
      
    return matchesSearch && matchesCategory;
  });

  const handleSelectQuestion = (question: Question) => {
    if (isLoading) return;
    generateAnswer(question);
  };

  // Group questions by category
  const questionsByCategory: Record<string, Question[]> = {};
  filteredQuestions.forEach(question => {
    if (!questionsByCategory[question.category]) {
      questionsByCategory[question.category] = [];
    }
    questionsByCategory[question.category].push(question);
  });

  return (
    <div className="w-full max-w-3xl mx-auto p-4 animate-slide-in">
      <div className="text-center mb-8 space-y-2">
        <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
          Step 2
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Select a Question</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Choose a competency-based question to generate a STARR format answer based on your CV.
        </p>
      </div>

      {/* CV info */}
      <div className="mb-6 p-3 bg-secondary/50 rounded-lg text-sm text-muted-foreground">
        <span className="font-medium">CV:</span> {cvData?.filename}
      </div>

      {/* Search and filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus-ring placeholder:text-muted-foreground/70"
          />
        </div>
        
        <div className="relative min-w-[180px]">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <select
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value || null)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus-ring appearance-none bg-white dark:bg-background"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Questions list */}
      <div className="space-y-6">
        {Object.entries(questionsByCategory).map(([category, questions]) => (
          <div key={category} className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              {category}
            </h3>
            <div className="space-y-2">
              {questions.map(question => (
                <QuestionCard 
                  key={question.id} 
                  question={question} 
                  onSelect={handleSelectQuestion}
                  disabled={isLoading}
                />
              ))}
            </div>
          </div>
        ))}
        
        {filteredQuestions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No questions match your search</p>
          </div>
        )}
      </div>
    </div>
  );
};

const QuestionCard: React.FC<{
  question: Question;
  onSelect: (question: Question) => void;
  disabled: boolean;
}> = ({ question, onSelect, disabled }) => {
  return (
    <button
      onClick={() => onSelect(question)}
      disabled={disabled}
      className={`
        w-full text-left p-4 rounded-lg border transition-all duration-300
        hover:border-primary/30 hover:shadow-sm card-hover focus-ring
        ${disabled ? 'opacity-70 cursor-not-allowed' : ''}
      `}
    >
      <div className="flex justify-between items-center gap-4">
        <p className="font-medium text-foreground">{question.text}</p>
        <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
      </div>
    </button>
  );
};

export default QuestionList;
