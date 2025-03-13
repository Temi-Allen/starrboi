
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CVData, Question, STARRAnswer, Step, GenerateQuestionsResponse } from '../utils/types';
import { competencyQuestions, mockSTARRAnswer } from '../utils/mockData';
import { toast } from "@/components/ui/use-toast";

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
  setQuestions: (questions: Question[]) => void;
  generateAnswer: (question: Question) => Promise<void>;
  generateQuestions: (cvText: string) => Promise<void>;
  resetState: () => void;
}

const CVContext = createContext<CVContextType | undefined>(undefined);

export const CVProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [currentStep, setCurrentStep] = useState<Step>(Step.UPLOAD);
  const [answer, setAnswer] = useState<STARRAnswer | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [questions, setQuestions] = useState<Question[]>(competencyQuestions);
  const [extractedCompanies, setExtractedCompanies] = useState<string[]>([]);

  // Generate STARR questions based on CV text
  const generateQuestions = async (cvText: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      // In a real app, this would make an API call to an AI service
      // For now we'll simulate generating questions based on CV content
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Extract keywords from CV to categorize questions
      const keywords = extractKeywordsFromCV(cvText);
      
      // Extract companies from CV
      const companies = extractCompaniesFromCV(cvText);
      setExtractedCompanies(companies);
      
      // Generate custom questions based on CV keywords
      const generatedQuestions = generateCustomQuestions(keywords);
      
      setQuestions(generatedQuestions);
      setCurrentStep(Step.QUESTIONS);
      toast({
        title: "Questions Generated",
        description: "We've analyzed your CV and created relevant questions."
      });
    } catch (error) {
      console.error('Error generating questions:', error);
      toast({
        title: "Error",
        description: "Failed to generate questions. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Extract company names from CV text
  const extractCompaniesFromCV = (cvText: string): string[] => {
    // In a real implementation, this would use NLP or regex to extract company names
    // For this demo, we'll do some basic extraction
    const companyRegex = /\|\s*([^|]+?)\s*\|/g;
    const matches = [...cvText.matchAll(companyRegex)];
    const companies = matches.map(match => match[1].trim());
    
    // Filter out non-company matches (like dates or roles)
    const filteredCompanies = companies.filter(company => 
      !company.match(/^\d{4}\s*-\s*\d{4}$/) && // Filter out date ranges
      !company.match(/^\d{4}\s*-\s*Present$/) && // Filter out date ranges with "Present"
      company.length > 1 // Skip very short strings
    );
    
    // Return unique company names
    return [...new Set(filteredCompanies)];
  };

  // This function extracts keywords from CV text for categorization
  const extractKeywordsFromCV = (cvText: string): Record<string, number> => {
    // In a real implementation, this would use NLP techniques to extract relevant skills and experiences
    // For this demo, we'll do some basic keyword matching
    const keywordCategories = {
      'leadership': ['lead', 'manage', 'direct', 'supervise', 'head', 'coordinate'],
      'problem solving': ['solve', 'resolve', 'solution', 'troubleshoot', 'fix', 'debug', 'analyze'],
      'teamwork': ['team', 'collaborate', 'cooperate', 'partnership', 'group'],
      'communication': ['communicate', 'present', 'write', 'speak', 'articulate', 'negotiate'],
      'adaptability': ['adapt', 'flexible', 'adjust', 'change', 'versatile'],
      'technical': ['develop', 'program', 'code', 'design', 'engineer', 'technical', 'software'],
      'project management': ['project', 'deadline', 'timeline', 'milestone', 'plan', 'schedule'],
      'customer service': ['customer', 'client', 'service', 'support', 'help']
    };
    
    const counts: Record<string, number> = {};
    
    // Count occurrences of keywords in each category
    Object.entries(keywordCategories).forEach(([category, keywords]) => {
      const categoryCount = keywords.reduce((count, keyword) => {
        const regex = new RegExp(`\\b${keyword}\\w*\\b`, 'gi');
        const matches = cvText.match(regex) || [];
        return count + matches.length;
      }, 0);
      
      if (categoryCount > 0) {
        counts[category] = categoryCount;
      }
    });
    
    // Ensure we have at least some categories
    if (Object.keys(counts).length === 0) {
      // Default categories if no matches found
      counts['leadership'] = 1;
      counts['problem solving'] = 1;
      counts['teamwork'] = 1;
    }
    
    return counts;
  };

  // Generate custom questions based on extracted keywords
  const generateCustomQuestions = (keywords: Record<string, number>): Question[] => {
    // Sort categories by frequency
    const sortedCategories = Object.entries(keywords)
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0]);
    
    const questions: Question[] = [];
    let questionId = 1;
    
    // Define question templates for each category
    const questionTemplates: Record<string, string[]> = {
      'leadership': [
        "Describe a situation where you had to lead a team through a challenging project.",
        "Tell me about a time when you had to make an unpopular decision as a leader.",
        "Give an example of how you motivated your team during a difficult period."
      ],
      'problem solving': [
        "Tell me about a complex problem you solved at work.",
        "Describe a situation where you had to think creatively to overcome an obstacle.",
        "Give an example of how you identified and resolved a process issue in your work."
      ],
      'teamwork': [
        "Describe a successful team project you worked on and your contribution.",
        "Tell me about a time when you had to work with someone difficult in a team.",
        "Give an example of how you supported a team member who was struggling."
      ],
      'communication': [
        "Tell me about a situation where your communication skills made a difference.",
        "Describe a time when you had to explain a complex concept to someone.",
        "Give an example of how you handled a communication breakdown."
      ],
      'adaptability': [
        "Describe a time when you had to adapt to a significant change at work.",
        "Tell me about a situation where you had to learn a new skill quickly.",
        "Give an example of how you remained flexible when plans changed unexpectedly."
      ],
      'technical': [
        "Describe a challenging technical problem you solved.",
        "Tell me about a technical project you're particularly proud of.",
        "Give an example of how you used technology to improve a process or outcome."
      ],
      'project management': [
        "Describe a project you managed and how you ensured it was completed on time.",
        "Tell me about a time when you had to handle multiple competing priorities.",
        "Give an example of how you recovered a project that was falling behind schedule."
      ],
      'customer service': [
        "Describe a situation where you went above and beyond for a customer.",
        "Tell me about a difficult customer interaction and how you handled it.",
        "Give an example of how you improved customer satisfaction in your role."
      ]
    };
    
    // Generate 2-3 questions for each of the top 3-4 categories
    sortedCategories.slice(0, 4).forEach(category => {
      const templates = questionTemplates[category] || [
        `Tell me about your experience with ${category}.`,
        `Describe a situation where you demonstrated ${category} skills.`,
        `Give an example of how you've applied ${category} in your work.`
      ];
      
      // Select 2 random questions from the templates
      const shuffled = [...templates].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 2);
      
      selected.forEach(text => {
        questions.push({
          id: String(questionId++),
          category: category.charAt(0).toUpperCase() + category.slice(1),
          text
        });
      });
    });
    
    // Make sure we have at least 6 questions
    if (questions.length < 6) {
      // Add some general questions
      const generalQuestions = [
        {
          id: String(questionId++),
          category: 'General',
          text: 'Tell me about a significant achievement in your career.'
        },
        {
          id: String(questionId++),
          category: 'General',
          text: 'Describe a challenging situation you faced at work and how you overcame it.'
        },
        {
          id: String(questionId++),
          category: 'General',
          text: 'Give an example of a time you showed initiative in your role.'
        }
      ];
      
      questions.push(...generalQuestions.slice(0, 6 - questions.length));
    }
    
    return questions;
  };

  // This would normally connect to an API
  const generateAnswer = async (question: Question): Promise<void> => {
    setIsLoading(true);
    setSelectedQuestion(question);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, this would make an API call to generate the STARR answer
      // For this demo, we'll customize the mockSTARRAnswer with company info
      const customAnswer = { ...mockSTARRAnswer };
      
      // If we have extracted companies, use the first one in the answer
      if (extractedCompanies.length > 0) {
        const company = extractedCompanies[0];
        customAnswer.situation = customAnswer.situation.replace(
          "my previous company", 
          company
        );
      }
      
      setAnswer(customAnswer);
      setCurrentStep(Step.ANSWERS);
    } catch (error) {
      console.error('Error generating answer:', error);
      toast({
        title: "Error",
        description: "Failed to generate answer. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setCvData(null);
    setSelectedQuestion(null);
    setAnswer(null);
    setCurrentStep(Step.UPLOAD);
    setQuestions(competencyQuestions);
    setExtractedCompanies([]);
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
        setQuestions,
        generateAnswer,
        generateQuestions,
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
