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
  { value: 'af', label: 'Afghanistan' },
  { value: 'al', label: 'Albania' },
  { value: 'dz', label: 'Algeria' },
  { value: 'ad', label: 'Andorra' },
  { value: 'ao', label: 'Angola' },
  { value: 'ag', label: 'Antigua and Barbuda' },
  { value: 'ar', label: 'Argentina' },
  { value: 'am', label: 'Armenia' },
  { value: 'au', label: 'Australia' },
  { value: 'at', label: 'Austria' },
  { value: 'az', label: 'Azerbaijan' },
  { value: 'bs', label: 'Bahamas' },
  { value: 'bh', label: 'Bahrain' },
  { value: 'bd', label: 'Bangladesh' },
  { value: 'bb', label: 'Barbados' },
  { value: 'by', label: 'Belarus' },
  { value: 'be', label: 'Belgium' },
  { value: 'bz', label: 'Belize' },
  { value: 'bj', label: 'Benin' },
  { value: 'bt', label: 'Bhutan' },
  { value: 'bo', label: 'Bolivia' },
  { value: 'ba', label: 'Bosnia and Herzegovina' },
  { value: 'bw', label: 'Botswana' },
  { value: 'br', label: 'Brazil' },
  { value: 'bn', label: 'Brunei' },
  { value: 'bg', label: 'Bulgaria' },
  { value: 'bf', label: 'Burkina Faso' },
  { value: 'bi', label: 'Burundi' },
  { value: 'cv', label: 'Cabo Verde' },
  { value: 'kh', label: 'Cambodia' },
  { value: 'cm', label: 'Cameroon' },
  { value: 'ca', label: 'Canada' },
  { value: 'cf', label: 'Central African Republic' },
  { value: 'td', label: 'Chad' },
  { value: 'cl', label: 'Chile' },
  { value: 'cn', label: 'China' },
  { value: 'co', label: 'Colombia' },
  { value: 'km', label: 'Comoros' },
  { value: 'cg', label: 'Congo' },
  { value: 'cd', label: 'Congo (DRC)' },
  { value: 'cr', label: 'Costa Rica' },
  { value: 'ci', label: "Côte d'Ivoire" },
  { value: 'hr', label: 'Croatia' },
  { value: 'cu', label: 'Cuba' },
  { value: 'cy', label: 'Cyprus' },
  { value: 'cz', label: 'Czechia' },
  { value: 'dk', label: 'Denmark' },
  { value: 'dj', label: 'Djibouti' },
  { value: 'dm', label: 'Dominica' },
  { value: 'do', label: 'Dominican Republic' },
  { value: 'ec', label: 'Ecuador' },
  { value: 'eg', label: 'Egypt' },
  { value: 'sv', label: 'El Salvador' },
  { value: 'gq', label: 'Equatorial Guinea' },
  { value: 'er', label: 'Eritrea' },
  { value: 'ee', label: 'Estonia' },
  { value: 'sz', label: 'Eswatini' },
  { value: 'et', label: 'Ethiopia' },
  { value: 'fj', label: 'Fiji' },
  { value: 'fi', label: 'Finland' },
  { value: 'fr', label: 'France' },
  { value: 'ga', label: 'Gabon' },
  { value: 'gm', label: 'Gambia' },
  { value: 'ge', label: 'Georgia' },
  { value: 'de', label: 'Germany' },
  { value: 'gh', label: 'Ghana' },
  { value: 'gr', label: 'Greece' },
  { value: 'gd', label: 'Grenada' },
  { value: 'gt', label: 'Guatemala' },
  { value: 'gn', label: 'Guinea' },
  { value: 'gw', label: 'Guinea-Bissau' },
  { value: 'gy', label: 'Guyana' },
  { value: 'ht', label: 'Haiti' },
  { value: 'hn', label: 'Honduras' },
  { value: 'hu', label: 'Hungary' },
  { value: 'is', label: 'Iceland' },
  { value: 'in', label: 'India' },
  { value: 'id', label: 'Indonesia' },
  { value: 'ir', label: 'Iran' },
  { value: 'iq', label: 'Iraq' },
  { value: 'ie', label: 'Ireland' },
  { value: 'il', label: 'Israel' },
  { value: 'it', label: 'Italy' },
  { value: 'jm', label: 'Jamaica' },
  { value: 'jp', label: 'Japan' },
  { value: 'jo', label: 'Jordan' },
  { value: 'kz', label: 'Kazakhstan' },
  { value: 'ke', label: 'Kenya' },
  { value: 'ki', label: 'Kiribati' },
  { value: 'kp', label: 'North Korea' },
  { value: 'kr', label: 'South Korea' },
  { value: 'kw', label: 'Kuwait' },
  { value: 'kg', label: 'Kyrgyzstan' },
  { value: 'la', label: 'Laos' },
  { value: 'lv', label: 'Latvia' },
  { value: 'lb', label: 'Lebanon' },
  { value: 'ls', label: 'Lesotho' },
  { value: 'lr', label: 'Liberia' },
  { value: 'ly', label: 'Libya' },
  { value: 'li', label: 'Liechtenstein' },
  { value: 'lt', label: 'Lithuania' },
  { value: 'lu', label: 'Luxembourg' },
  { value: 'mg', label: 'Madagascar' },
  { value: 'mw', label: 'Malawi' },
  { value: 'my', label: 'Malaysia' },
  { value: 'mv', label: 'Maldives' },
  { value: 'ml', label: 'Mali' },
  { value: 'mt', label: 'Malta' },
  { value: 'mh', label: 'Marshall Islands' },
  { value: 'mr', label: 'Mauritania' },
  { value: 'mu', label: 'Mauritius' },
  { value: 'mx', label: 'Mexico' },
  { value: 'fm', label: 'Micronesia' },
  { value: 'md', label: 'Moldova' },
  { value: 'mc', label: 'Monaco' },
  { value: 'mn', label: 'Mongolia' },
  { value: 'me', label: 'Montenegro' },
  { value: 'ma', label: 'Morocco' },
  { value: 'mz', label: 'Mozambique' },
  { value: 'mm', label: 'Myanmar' },
  { value: 'na', label: 'Namibia' },
  { value: 'nr', label: 'Nauru' },
  { value: 'np', label: 'Nepal' },
  { value: 'nl', label: 'Netherlands' },
  { value: 'nz', label: 'New Zealand' },
  { value: 'ni', label: 'Nicaragua' },
  { value: 'ne', label: 'Niger' },
  { value: 'ng', label: 'Nigeria' },
  { value: 'mk', label: 'North Macedonia' },
  { value: 'no', label: 'Norway' },
  { value: 'om', label: 'Oman' },
  { value: 'pk', label: 'Pakistan' },
  { value: 'pw', label: 'Palau' },
  { value: 'ps', label: 'Palestine' },
  { value: 'pa', label: 'Panama' },
  { value: 'pg', label: 'Papua New Guinea' },
  { value: 'py', label: 'Paraguay' },
  { value: 'pe', label: 'Peru' },
  { value: 'ph', label: 'Philippines' },
  { value: 'pl', label: 'Poland' },
  { value: 'pt', label: 'Portugal' },
  { value: 'qa', label: 'Qatar' },
  { value: 'ro', label: 'Romania' },
  { value: 'ru', label: 'Russia' },
  { value: 'rw', label: 'Rwanda' },
  { value: 'kn', label: 'Saint Kitts and Nevis' },
  { value: 'lc', label: 'Saint Lucia' },
  { value: 'vc', label: 'Saint Vincent and the Grenadines' },
  { value: 'ws', label: 'Samoa' },
  { value: 'sm', label: 'San Marino' },
  { value: 'st', label: 'Sao Tome and Principe' },
  { value: 'sa', label: 'Saudi Arabia' },
  { value: 'sn', label: 'Senegal' },
  { value: 'rs', label: 'Serbia' },
  { value: 'sc', label: 'Seychelles' },
  { value: 'sl', label: 'Sierra Leone' },
  { value: 'sg', label: 'Singapore' },
  { value: 'sk', label: 'Slovakia' },
  { value: 'si', label: 'Slovenia' },
  { value: 'sb', label: 'Solomon Islands' },
  { value: 'so', label: 'Somalia' },
  { value: 'za', label: 'South Africa' },
  { value: 'ss', label: 'South Sudan' },
  { value: 'es', label: 'Spain' },
  { value: 'lk', label: 'Sri Lanka' },
  { value: 'sd', label: 'Sudan' },
  { value: 'sr', label: 'Suriname' },
  { value: 'se', label: 'Sweden' },
  { value: 'ch', label: 'Switzerland' },
  { value: 'sy', label: 'Syria' },
  { value: 'tw', label: 'Taiwan' },
  { value: 'tj', label: 'Tajikistan' },
  { value: 'tz', label: 'Tanzania' },
  { value: 'th', label: 'Thailand' },
  { value: 'tl', label: 'Timor-Leste' },
  { value: 'tg', label: 'Togo' },
  { value: 'to', label: 'Tonga' },
  { value: 'tt', label: 'Trinidad and Tobago' },
  { value: 'tn', label: 'Tunisia' },
  { value: 'tr', label: 'Turkey' },
  { value: 'tm', label: 'Turkmenistan' },
  { value: 'tv', label: 'Tuvalu' },
  { value: 'ug', label: 'Uganda' },
  { value: 'ua', label: 'Ukraine' },
  { value: 'ae', label: 'United Arab Emirates' },
  { value: 'gb', label: 'United Kingdom' },
  { value: 'us', label: 'United States' },
  { value: 'uy', label: 'Uruguay' },
  { value: 'uz', label: 'Uzbekistan' },
  { value: 'vu', label: 'Vanuatu' },
  { value: 'va', label: 'Vatican City' },
  { value: 've', label: 'Venezuela' },
  { value: 'vn', label: 'Vietnam' },
  { value: 'ye', label: 'Yemen' },
  { value: 'zm', label: 'Zambia' },
  { value: 'zw', label: 'Zimbabwe' },
];

const TIMEZONES = [
  { value: 'utc-12', label: 'UTC-12:00 (Baker Island)' },
  { value: 'utc-11', label: 'UTC-11:00 (American Samoa)' },
  { value: 'utc-10', label: 'UTC-10:00 (Hawaii)' },
  { value: 'utc-9', label: 'UTC-09:00 (Alaska)' },
  { value: 'utc-8', label: 'UTC-08:00 (Pacific Time)' },
  { value: 'utc-7', label: 'UTC-07:00 (Mountain Time)' },
  { value: 'utc-6', label: 'UTC-06:00 (Central Time)' },
  { value: 'utc-5', label: 'UTC-05:00 (Eastern Time)' },
  { value: 'utc-4', label: 'UTC-04:00 (Atlantic Time)' },
  { value: 'utc-3', label: 'UTC-03:00 (Brazil)' },
  { value: 'utc-2', label: 'UTC-02:00 (Mid-Atlantic)' },
  { value: 'utc-1', label: 'UTC-01:00 (Azores)' },
  { value: 'utc+0', label: 'UTC+00:00 (London, GMT)' },
  { value: 'utc+1', label: 'UTC+01:00 (Central Europe)' },
  { value: 'utc+2', label: 'UTC+02:00 (Eastern Europe)' },
  { value: 'utc+3', label: 'UTC+03:00 (Moscow, Arabia)' },
  { value: 'utc+4', label: 'UTC+04:00 (Gulf, UAE)' },
  { value: 'utc+5', label: 'UTC+05:00 (Pakistan)' },
  { value: 'utc+5:30', label: 'UTC+05:30 (India)' },
  { value: 'utc+6', label: 'UTC+06:00 (Bangladesh)' },
  { value: 'utc+7', label: 'UTC+07:00 (Thailand, Vietnam)' },
  { value: 'utc+8', label: 'UTC+08:00 (China, Singapore)' },
  { value: 'utc+9', label: 'UTC+09:00 (Japan, Korea)' },
  { value: 'utc+10', label: 'UTC+10:00 (Sydney)' },
  { value: 'utc+11', label: 'UTC+11:00 (Solomon Islands)' },
  { value: 'utc+12', label: 'UTC+12:00 (New Zealand)' },
];

const LANGUAGES = [
  { value: 'afrikaans', label: 'Afrikaans' },
  { value: 'albanian', label: 'Albanian' },
  { value: 'amharic', label: 'Amharic' },
  { value: 'arabic', label: 'Arabic' },
  { value: 'armenian', label: 'Armenian' },
  { value: 'azerbaijani', label: 'Azerbaijani' },
  { value: 'basque', label: 'Basque' },
  { value: 'belarusian', label: 'Belarusian' },
  { value: 'bengali', label: 'Bengali' },
  { value: 'bosnian', label: 'Bosnian' },
  { value: 'bulgarian', label: 'Bulgarian' },
  { value: 'burmese', label: 'Burmese' },
  { value: 'catalan', label: 'Catalan' },
  { value: 'chinese_mandarin', label: 'Chinese (Mandarin)' },
  { value: 'chinese_cantonese', label: 'Chinese (Cantonese)' },
  { value: 'croatian', label: 'Croatian' },
  { value: 'czech', label: 'Czech' },
  { value: 'danish', label: 'Danish' },
  { value: 'dutch', label: 'Dutch' },
  { value: 'english', label: 'English' },
  { value: 'estonian', label: 'Estonian' },
  { value: 'farsi', label: 'Farsi (Persian)' },
  { value: 'filipino', label: 'Filipino (Tagalog)' },
  { value: 'finnish', label: 'Finnish' },
  { value: 'french', label: 'French' },
  { value: 'galician', label: 'Galician' },
  { value: 'georgian', label: 'Georgian' },
  { value: 'german', label: 'German' },
  { value: 'greek', label: 'Greek' },
  { value: 'gujarati', label: 'Gujarati' },
  { value: 'haitian_creole', label: 'Haitian Creole' },
  { value: 'hausa', label: 'Hausa' },
  { value: 'hebrew', label: 'Hebrew' },
  { value: 'hindi', label: 'Hindi' },
  { value: 'hungarian', label: 'Hungarian' },
  { value: 'icelandic', label: 'Icelandic' },
  { value: 'igbo', label: 'Igbo' },
  { value: 'indonesian', label: 'Indonesian' },
  { value: 'irish', label: 'Irish' },
  { value: 'italian', label: 'Italian' },
  { value: 'japanese', label: 'Japanese' },
  { value: 'javanese', label: 'Javanese' },
  { value: 'kannada', label: 'Kannada' },
  { value: 'kazakh', label: 'Kazakh' },
  { value: 'khmer', label: 'Khmer' },
  { value: 'korean', label: 'Korean' },
  { value: 'kurdish', label: 'Kurdish' },
  { value: 'kyrgyz', label: 'Kyrgyz' },
  { value: 'lao', label: 'Lao' },
  { value: 'latvian', label: 'Latvian' },
  { value: 'lithuanian', label: 'Lithuanian' },
  { value: 'macedonian', label: 'Macedonian' },
  { value: 'malay', label: 'Malay' },
  { value: 'malayalam', label: 'Malayalam' },
  { value: 'maltese', label: 'Maltese' },
  { value: 'maori', label: 'Maori' },
  { value: 'marathi', label: 'Marathi' },
  { value: 'mongolian', label: 'Mongolian' },
  { value: 'nepali', label: 'Nepali' },
  { value: 'norwegian', label: 'Norwegian' },
  { value: 'odia', label: 'Odia' },
  { value: 'pashto', label: 'Pashto' },
  { value: 'polish', label: 'Polish' },
  { value: 'portuguese', label: 'Portuguese' },
  { value: 'punjabi', label: 'Punjabi' },
  { value: 'romanian', label: 'Romanian' },
  { value: 'russian', label: 'Russian' },
  { value: 'samoan', label: 'Samoan' },
  { value: 'serbian', label: 'Serbian' },
  { value: 'sindhi', label: 'Sindhi' },
  { value: 'sinhala', label: 'Sinhala' },
  { value: 'slovak', label: 'Slovak' },
  { value: 'slovenian', label: 'Slovenian' },
  { value: 'somali', label: 'Somali' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'swahili', label: 'Swahili' },
  { value: 'swedish', label: 'Swedish' },
  { value: 'tamil', label: 'Tamil' },
  { value: 'telugu', label: 'Telugu' },
  { value: 'thai', label: 'Thai' },
  { value: 'turkish', label: 'Turkish' },
  { value: 'ukrainian', label: 'Ukrainian' },
  { value: 'urdu', label: 'Urdu' },
  { value: 'uzbek', label: 'Uzbek' },
  { value: 'vietnamese', label: 'Vietnamese' },
  { value: 'welsh', label: 'Welsh' },
  { value: 'xhosa', label: 'Xhosa' },
  { value: 'yiddish', label: 'Yiddish' },
  { value: 'yoruba', label: 'Yoruba' },
  { value: 'zulu', label: 'Zulu' },
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
            label="Time Zone (Optional)"
            value={formData.timezone}
            onChange={(v) => updateField('timezone', v)}
            options={TIMEZONES}
            placeholder="Select timezone"
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
