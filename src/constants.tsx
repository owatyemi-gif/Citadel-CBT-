
import { Level, Department } from '@/types';

export const JSS_SUBJECTS = [
  'Mathematics',
  'English',
  'Civic Education',
  'Basic Science',
  'Basic Tech',
  'Business Studies'
];

export const SSS_COMPULSORY = ['Mathematics', 'English'];
export const SSS_SCIENCE = ['Physics', 'Chemistry', 'Biology'];
export const SSS_ARTS = ['Government', 'CRK', 'Literature in English'];

export const ALL_SSS_SUBJECTS = [
  ...SSS_COMPULSORY,
  ...SSS_SCIENCE,
  ...SSS_ARTS
];

export const GET_DEPT_FOR_SSS = (subject: string): Department => {
  if (SSS_SCIENCE.includes(subject)) return Department.SCIENCE;
  if (SSS_ARTS.includes(subject)) return Department.ARTS;
  return Department.GENERAL;
};
