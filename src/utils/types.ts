
export interface Question {
  id: string;
  category: string;
  text: string;
}

export interface CVData {
  text: string;
  filename: string;
}

export interface STARRAnswer {
  situation: string;
  task: string;
  action: string;
  result: string;
  reflection: string;
}

export enum Step {
  UPLOAD = 'upload',
  QUESTIONS = 'questions',
  ANSWERS = 'answers'
}

export interface GenerateQuestionsResponse {
  questions: Question[];
  success: boolean;
  error?: string;
}

