
export enum Level {
  JSS = 'JSS',
  SSS = 'SSS'
}

export enum Department {
  GENERAL = 'General',
  SCIENCE = 'Science',
  ARTS = 'Arts'
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  subject: string;
  level: Level;
  department?: Department;
  topic: string;
  questions: Question[];
  createdAt: number;
}

export interface User {
  role: 'admin' | 'student';
  name: string;
}

export interface QuizResult {
  quizId: string;
  score: number;
  total: number;
  answers: number[];
  timestamp: number;
}
