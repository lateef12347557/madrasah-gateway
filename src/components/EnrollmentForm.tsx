import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import FormSection from './FormSection';
import FormField from './FormField';
import { addStudent, StudentData } from '@/lib/studentStore';
import { User, Users, GraduationCap, BookMarked, Calendar, MessageSquare } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface EnrollmentFormProps {
  onSubmitSuccess: () => void;
}

const COUNTRIES = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'ae', label: 'United Arab Emirates' },
  { value: 'sa', label: 'Saudi Arabia' },
  { value: 'pk', label: 'Pakistan' },
  { value: 'in', label: 'India' },
  { value: 'bd', label: 'Bangladesh' },
  { value: 'eg', label: 'Egypt' },
  { value: 'my', label: 'Malaysia' },
  { value: 'id', label: 'Indonesia' },
  { value: 'other', label: 'Other' },
];

const TIMEZONES = [
  { value: 'est', label: 'EST (UTC-5)' },
  { value: 'cst', label: 'CST (UTC-6)' },
  { value: 'mst', label: 'MST (UTC-7)' },
  { value: 'pst', label: 'PST (UTC-8)' },
  { value: 'gmt', label: 'GMT (UTC+0)' },
  { value: 'gst', label: 'GST (UTC+4)' },
  { value: 'pkt', label: 'PKT (UTC+5)' },
  { value: 'ist', label: 'IST (UTC+5:30)' },
  { value: 'sgt', label: 'SGT (UTC+8)' },
  { value: 'aest', label: 'AEST (UTC+10)' },
];

const LANGUAGES = [
  { value: 'english', label: 'English' },
  { value: 'arabic', label: 'Arabic' },
  { value: 'urdu', label: 'Urdu' },
  { value: 'bengali', label: 'Bengali' },
  { value: 'malay', label: 'Malay' },
  { value: 'indonesian', label: 'Indonesian' },
  { value: 'turkish', label: 'Turkish' },
  { value: 'french', label: 'French' },
  { value: 'other', label: 'Other' },
];

const LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

const QURAN_ABILITIES = [
  { value: 'cannot_read', label: 'Cannot read Arabic' },
  { value: 'basic', label: 'Basic reading (slow)' },
  { value: 'fluent', label: 'Fluent reading' },
  { value: 'memorizing', label: 'Currently memorizing' },
];

const TAJWEED_LEVELS = [
  { value: 'none', label: 'No knowledge' },
  { value: 'basic', label: 'Basic rules' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

const INTEREST_AREAS = [
  { value: 'spelling', label: 'Spelling & Arabic Alphabet' },
  { value: 'arabic', label: 'Arabic Studies' },
  { value: 'hifz', label: 'Hifz (Quran Memorization)' },
  { value: 'tajweed', label: 'Tajweed' },
  { value: 'islamic_studies', label: 'Islamic Studies' },
];

const DAYS = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
];

const CLASS_TYPES = [
  { value: 'one_on_one', label: 'One-on-One' },
  { value: 'group', label: 'Group Class' },
];

const REFERRAL_SOURCES = [
  { value: 'social_media', label: 'Social Media' },
  { value: 'friend_family', label: 'Friend/Family' },
  { value: 'search_engine', label: 'Search Engine' },
  { value: 'mosque', label: 'Local Mosque' },
  { value: 'advertisement', label: 'Advertisement' },
  { value: 'other', label: 'Other' },
];

const EnrollmentForm: React.FC<EnrollmentFormProps> = ({ onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    gender: '',
    dateOfBirth: '',
    country: '',
    timezone: '',
    nativeLanguage: '',
    guardianName: '',
    relationship: '',
    whatsappNumber: '',
    email: '',
    level: '',
    quranReadingAbility: '',
    tajweedKnowledge: '',
    previousMadrasah: '',
    interestAreas: [] as string[],
    preferredDays: [] as string[],
    preferredTime: '',
    classType: '',
    specialNeeds: '',
    referralSource: '',
    questions: '',
  });

  const [declaration, setDeclaration] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.gender) newErrors.gender = 'Please select gender';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.country) newErrors.country = 'Please select country';
    if (!formData.timezone) newErrors.timezone = 'Please select timezone';
    if (!formData.nativeLanguage) newErrors.nativeLanguage = 'Please select native language';
    
    if (!formData.guardianName.trim()) newErrors.guardianName = 'Guardian name is required';
    if (!formData.relationship) newErrors.relationship = 'Please select relationship';
    if (!formData.whatsappNumber.trim()) newErrors.whatsappNumber = 'WhatsApp number is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.level) newErrors.level = 'Please select level';
    if (!formData.quranReadingAbility) newErrors.quranReadingAbility = 'Please select reading ability';
    if (!formData.tajweedKnowledge) newErrors.tajweedKnowledge = 'Please select Tajweed knowledge';

    if (formData.interestAreas.length === 0) newErrors.interestAreas = 'Please select at least one interest area';
    if (formData.preferredDays.length === 0) newErrors.preferredDays = 'Please select at least one day';
    if (!formData.preferredTime.trim()) newErrors.preferredTime = 'Please specify preferred time';
    if (!formData.classType) newErrors.classType = 'Please select class type';

    if (!declaration) newErrors.declaration = 'Please confirm the declaration';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      toast({
        title: "Please complete all required fields",
        description: "Some required information is missing. Please review the form.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await addStudent(formData as Omit<StudentData, 'id' | 'submittedAt'>);
      onSubmitSuccess();
    } catch (error) {
      console.error('Failed to submit enrollment:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Student Information */}
      <FormSection 
        title="Student Information" 
        subtitle="Please provide the student's details"
        icon={<User className="w-5 h-5" />}
      >
        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            type="text"
            label="Full Name"
            value={formData.fullName}
            onChange={(v) => updateField('fullName', v)}
            placeholder="Enter student's full name"
            required
            error={errors.fullName}
          />
          <FormField
            type="select"
            label="Gender"
            value={formData.gender}
            onChange={(v) => updateField('gender', v)}
            options={[
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
            ]}
            placeholder="Select gender"
            required
            error={errors.gender}
          />
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <FormField
            type="date"
            label="Date of Birth"
            value={formData.dateOfBirth}
            onChange={(v) => updateField('dateOfBirth', v)}
            required
            error={errors.dateOfBirth}
          />
          <FormField
            type="select"
            label="Country"
            value={formData.country}
            onChange={(v) => updateField('country', v)}
            options={COUNTRIES}
            placeholder="Select country"
            required
            error={errors.country}
          />
          <FormField
            type="select"
            label="Time Zone"
            value={formData.timezone}
            onChange={(v) => updateField('timezone', v)}
            options={TIMEZONES}
            placeholder="Select timezone"
            required
            error={errors.timezone}
          />
        </div>
        <FormField
          type="select"
          label="Native Language"
          value={formData.nativeLanguage}
          onChange={(v) => updateField('nativeLanguage', v)}
          options={LANGUAGES}
          placeholder="Select native language"
          required
          error={errors.nativeLanguage}
          className="md:w-1/2"
        />
      </FormSection>

      {/* Parent/Guardian Information */}
      <FormSection 
        title="Parent/Guardian Information" 
        subtitle="Contact details for correspondence"
        icon={<Users className="w-5 h-5" />}
      >
        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            type="text"
            label="Full Name"
            value={formData.guardianName}
            onChange={(v) => updateField('guardianName', v)}
            placeholder="Enter guardian's full name"
            required
            error={errors.guardianName}
          />
          <FormField
            type="select"
            label="Relationship to Student"
            value={formData.relationship}
            onChange={(v) => updateField('relationship', v)}
            options={[
              { value: 'father', label: 'Father' },
              { value: 'mother', label: 'Mother' },
              { value: 'guardian', label: 'Legal Guardian' },
              { value: 'other', label: 'Other' },
            ]}
            placeholder="Select relationship"
            required
            error={errors.relationship}
          />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            type="tel"
            label="WhatsApp Number"
            value={formData.whatsappNumber}
            onChange={(v) => updateField('whatsappNumber', v)}
            placeholder="+1 234 567 8900"
            required
            error={errors.whatsappNumber}
          />
          <FormField
            type="email"
            label="Email Address"
            value={formData.email}
            onChange={(v) => updateField('email', v)}
            placeholder="parent@example.com"
            required
            error={errors.email}
          />
        </div>
      </FormSection>

      {/* Academic Background */}
      <FormSection 
        title="Academic Background" 
        subtitle="Current level of Islamic education"
        icon={<GraduationCap className="w-5 h-5" />}
      >
        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            type="select"
            label="Level"
            value={formData.level}
            onChange={(v) => updateField('level', v)}
            options={LEVELS}
            placeholder="Select level"
            required
            error={errors.level}
          />
          <FormField
            type="select"
            label="Quran Reading Ability"
            value={formData.quranReadingAbility}
            onChange={(v) => updateField('quranReadingAbility', v)}
            options={QURAN_ABILITIES}
            placeholder="Select reading ability"
            required
            error={errors.quranReadingAbility}
          />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            type="select"
            label="Tajweed Knowledge"
            value={formData.tajweedKnowledge}
            onChange={(v) => updateField('tajweedKnowledge', v)}
            options={TAJWEED_LEVELS}
            placeholder="Select Tajweed level"
            required
            error={errors.tajweedKnowledge}
          />
          <FormField
            type="text"
            label="Previous Madrasah (if any)"
            value={formData.previousMadrasah}
            onChange={(v) => updateField('previousMadrasah', v)}
            placeholder="Name of previous institution"
            error={errors.previousMadrasah}
          />
        </div>
      </FormSection>

      {/* Interest Areas */}
      <FormSection 
        title="Interest Areas" 
        subtitle="Select the programs you're interested in"
        icon={<BookMarked className="w-5 h-5" />}
      >
        <FormField
          type="checkbox-group"
          label="Select all that apply"
          value={formData.interestAreas}
          onChange={(v) => updateField('interestAreas', v)}
          options={INTEREST_AREAS}
          required
          error={errors.interestAreas}
        />
      </FormSection>

      {/* Class Preferences */}
      <FormSection 
        title="Class Preferences" 
        subtitle="Your preferred schedule"
        icon={<Calendar className="w-5 h-5" />}
      >
        <FormField
          type="checkbox-group"
          label="Preferred Days"
          value={formData.preferredDays}
          onChange={(v) => updateField('preferredDays', v)}
          options={DAYS}
          required
          error={errors.preferredDays}
        />
        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            type="text"
            label="Preferred Time (with timezone)"
            value={formData.preferredTime}
            onChange={(v) => updateField('preferredTime', v)}
            placeholder="e.g., 4:00 PM - 5:00 PM EST"
            required
            error={errors.preferredTime}
          />
          <FormField
            type="radio-group"
            label="Class Type"
            value={formData.classType}
            onChange={(v) => updateField('classType', v)}
            options={CLASS_TYPES}
            required
            error={errors.classType}
          />
        </div>
      </FormSection>

      {/* Additional Information */}
      <FormSection 
        title="Additional Information" 
        subtitle="Any other details we should know"
        icon={<MessageSquare className="w-5 h-5" />}
      >
        <FormField
          type="textarea"
          label="Special Needs or Requirements"
          value={formData.specialNeeds}
          onChange={(v) => updateField('specialNeeds', v)}
          placeholder="Please let us know if there are any special accommodations needed..."
          error={errors.specialNeeds}
        />
        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            type="select"
            label="How did you hear about us?"
            value={formData.referralSource}
            onChange={(v) => updateField('referralSource', v)}
            options={REFERRAL_SOURCES}
            placeholder="Select source"
            error={errors.referralSource}
          />
        </div>
        <FormField
          type="textarea"
          label="Questions or Comments"
          value={formData.questions}
          onChange={(v) => updateField('questions', v)}
          placeholder="Any questions for our administration team..."
          error={errors.questions}
        />
      </FormSection>

      {/* Declaration */}
      <div className="bg-card rounded-xl p-6 shadow-card border border-border/50">
        <label className="flex items-start gap-4 cursor-pointer group">
          <Checkbox
            checked={declaration}
            onCheckedChange={(checked) => setDeclaration(checked as boolean)}
            className="mt-0.5"
          />
          <div>
            <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
              I confirm that the information provided is accurate
            </span>
            <p className="text-sm text-muted-foreground mt-1">
              By checking this box, I declare that all information provided in this form is true 
              and accurate to the best of my knowledge.
            </p>
          </div>
        </label>
        {errors.declaration && (
          <p className="text-sm text-destructive mt-2 animate-fade-in">{errors.declaration}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-center pt-4">
        <Button 
          type="submit" 
          variant="hero" 
          size="lg"
          disabled={isSubmitting}
          className="min-w-[200px]"
        >
          {isSubmitting ? (
            <>
              <span className="animate-pulse-soft">Submitting...</span>
            </>
          ) : (
            'Submit Application'
          )}
        </Button>
      </div>
    </form>
  );
};

export default EnrollmentForm;
