import { supabase } from "@/integrations/supabase/client";

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

export const addStudent = async (student: Omit<StudentData, 'id' | 'submittedAt'>): Promise<StudentData> => {
  const { data, error } = await supabase
    .from('student_enrollments')
    .insert({
      full_name: student.fullName,
      gender: student.gender,
      date_of_birth: student.dateOfBirth,
      country: student.country,
      timezone: student.timezone,
      native_language: student.nativeLanguage,
      guardian_name: student.guardianName,
      relationship: student.relationship,
      whatsapp_number: student.whatsappNumber,
      email: student.email,
      level: student.level,
      quran_reading_ability: student.quranReadingAbility,
      tajweed_knowledge: student.tajweedKnowledge,
      previous_madrasah: student.previousMadrasah || null,
      interest_areas: student.interestAreas,
      preferred_days: student.preferredDays,
      preferred_time: student.preferredTime,
      class_type: student.classType,
      special_needs: student.specialNeeds || null,
      referral_source: student.referralSource || null,
      questions: student.questions || null,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    submittedAt: new Date(data.submitted_at),
    fullName: data.full_name,
    gender: data.gender,
    dateOfBirth: data.date_of_birth,
    country: data.country,
    timezone: data.timezone,
    nativeLanguage: data.native_language,
    guardianName: data.guardian_name,
    relationship: data.relationship,
    whatsappNumber: data.whatsapp_number,
    email: data.email,
    level: data.level,
    quranReadingAbility: data.quran_reading_ability,
    tajweedKnowledge: data.tajweed_knowledge,
    previousMadrasah: data.previous_madrasah || '',
    interestAreas: data.interest_areas,
    preferredDays: data.preferred_days,
    preferredTime: data.preferred_time,
    classType: data.class_type,
    specialNeeds: data.special_needs || '',
    referralSource: data.referral_source || '',
    questions: data.questions || '',
  };
};

export const getStudents = async (): Promise<StudentData[]> => {
  const { data, error } = await supabase
    .from('student_enrollments')
    .select('*')
    .order('submitted_at', { ascending: false });

  if (error) throw error;

  return data.map((row) => ({
    id: row.id,
    submittedAt: new Date(row.submitted_at),
    fullName: row.full_name,
    gender: row.gender,
    dateOfBirth: row.date_of_birth,
    country: row.country,
    timezone: row.timezone,
    nativeLanguage: row.native_language,
    guardianName: row.guardian_name,
    relationship: row.relationship,
    whatsappNumber: row.whatsapp_number,
    email: row.email,
    level: row.level,
    quranReadingAbility: row.quran_reading_ability,
    tajweedKnowledge: row.tajweed_knowledge,
    previousMadrasah: row.previous_madrasah || '',
    interestAreas: row.interest_areas,
    preferredDays: row.preferred_days,
    preferredTime: row.preferred_time,
    classType: row.class_type,
    specialNeeds: row.special_needs || '',
    referralSource: row.referral_source || '',
    questions: row.questions || '',
  }));
};

export interface AdminUser {
  id: string;
  username: string;
  createdAt: Date;
}

export const verifyAdminPassword = async (password: string): Promise<{ success: boolean; admin?: AdminUser }> => {
  const { data, error } = await supabase
    .from('admin_users')
    .select('*')
    .eq('password_hash', password)
    .maybeSingle();

  if (error || !data) {
    return { success: false };
  }

  return {
    success: true,
    admin: {
      id: data.id,
      username: data.username,
      createdAt: new Date(data.created_at),
    },
  };
};

export const getAdmins = async (): Promise<AdminUser[]> => {
  const { data, error } = await supabase
    .from('admin_users')
    .select('id, username, created_at')
    .order('created_at', { ascending: true });

  if (error) throw error;

  return data.map((row) => ({
    id: row.id,
    username: row.username,
    createdAt: new Date(row.created_at),
  }));
};

export const addAdmin = async (username: string, password: string): Promise<AdminUser> => {
  const { data, error } = await supabase
    .from('admin_users')
    .insert({ username, password_hash: password })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    username: data.username,
    createdAt: new Date(data.created_at),
  };
};

export const deleteAdmin = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('admin_users')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
