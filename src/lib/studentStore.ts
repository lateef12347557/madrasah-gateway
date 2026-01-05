export interface StudentData {
  id: string;
  submittedAt: Date;
  
  // Student Information
  fullName: string;
  gender: string;
  dateOfBirth: string;
  country: string;
  timezone: string;
  nativeLanguage: string;
  
  // Parent/Guardian Info
  guardianName: string;
  relationship: string;
  whatsappNumber: string;
  email: string;
  
  // Academic Background
  level: string;
  quranReadingAbility: string;
  tajweedKnowledge: string;
  previousMadrasah: string;
  
  // Interest Areas
  interestAreas: string[];
  
  // Class Preferences
  preferredDays: string[];
  preferredTime: string;
  classType: string;
  
  // Additional
  specialNeeds: string;
  referralSource: string;
  questions: string;
}

// In-memory storage for the session
let students: StudentData[] = [];

export const addStudent = (student: Omit<StudentData, 'id' | 'submittedAt'>): StudentData => {
  const newStudent: StudentData = {
    ...student,
    id: crypto.randomUUID(),
    submittedAt: new Date(),
  };
  students.push(newStudent);
  return newStudent;
};

export const getStudents = (): StudentData[] => {
  return [...students];
};

export const clearStudents = (): void => {
  students = [];
};

export const ADMIN_PASSWORD = 'admin23435';

export const verifyAdminPassword = (password: string): boolean => {
  return password === ADMIN_PASSWORD;
};
