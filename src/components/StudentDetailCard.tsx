import React from 'react';
import { StudentData } from '@/lib/studentStore';
import { exportStudentApplication } from '@/lib/pdfExport';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, User, Users, BookOpen, Calendar, X } from 'lucide-react';

interface StudentDetailCardProps {
  student: StudentData;
  onClose: () => void;
}

const StudentDetailCard: React.FC<StudentDetailCardProps> = ({ student, onClose }) => {
  const formatDate = (date: Date) => new Date(date).toLocaleString();

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-card border border-border max-w-3xl w-full max-h-[90vh] overflow-auto animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-hero text-primary-foreground p-6 flex items-center justify-between sticky top-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-foreground/10 flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold">{student.fullName}</h2>
              <p className="text-primary-foreground/80 text-sm">
                Submitted: {formatDate(student.submittedAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportStudentApplication(student)}
              className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20"
            >
              <FileText className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Student Information */}
          <section>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground mb-4">
              <User className="w-5 h-5 text-primary" />
              Student Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailItem label="Full Name" value={student.fullName} />
              <DetailItem label="Gender" value={student.gender} capitalize />
              <DetailItem label="Date of Birth" value={student.dateOfBirth} />
              <DetailItem label="Country" value={student.country} />
              <DetailItem label="Timezone" value={student.timezone} />
              <DetailItem label="Native Language" value={student.nativeLanguage} />
            </div>
          </section>

          {/* Guardian Information */}
          <section>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground mb-4">
              <Users className="w-5 h-5 text-primary" />
              Parent/Guardian Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailItem label="Guardian Name" value={student.guardianName} />
              <DetailItem label="Relationship" value={student.relationship} capitalize />
              <DetailItem label="WhatsApp Number" value={student.whatsappNumber} />
              <DetailItem label="Email" value={student.email} />
            </div>
          </section>

          {/* Academic Background */}
          <section>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground mb-4">
              <BookOpen className="w-5 h-5 text-primary" />
              Academic Background
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailItem label="Level" value={student.level} capitalize />
              <DetailItem label="Quran Reading Ability" value={student.quranReadingAbility.replace(/_/g, ' ')} capitalize />
              <DetailItem label="Tajweed Knowledge" value={student.tajweedKnowledge.replace(/_/g, ' ')} capitalize />
              <DetailItem label="Previous Madrasah" value={student.previousMadrasah || 'N/A'} />
            </div>
          </section>

          {/* Class Preferences */}
          <section>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground mb-4">
              <Calendar className="w-5 h-5 text-primary" />
              Class Preferences
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Interest Areas</p>
                <div className="flex flex-wrap gap-1">
                  {student.interestAreas.map((area, i) => (
                    <Badge key={i} variant="secondary" className="capitalize">
                      {area.replace(/_/g, ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Preferred Days</p>
                <div className="flex flex-wrap gap-1">
                  {student.preferredDays.map((day, i) => (
                    <Badge key={i} variant="outline" className="capitalize">
                      {day}
                    </Badge>
                  ))}
                </div>
              </div>
              <DetailItem label="Preferred Time" value={student.preferredTime.replace(/_/g, ' ')} capitalize />
              <DetailItem label="Class Type" value={student.classType.replace(/_/g, ' ')} capitalize />
            </div>
          </section>

          {/* Additional Information */}
          {(student.specialNeeds || student.referralSource || student.questions) && (
            <section>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Additional Information
              </h3>
              <div className="space-y-4">
                {student.specialNeeds && (
                  <DetailItem label="Special Needs / Requirements" value={student.specialNeeds} fullWidth />
                )}
                {student.referralSource && (
                  <DetailItem label="Referral Source" value={student.referralSource} />
                )}
                {student.questions && (
                  <DetailItem label="Questions / Comments" value={student.questions} fullWidth />
                )}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

const DetailItem: React.FC<{ 
  label: string; 
  value: string; 
  capitalize?: boolean;
  fullWidth?: boolean;
}> = ({ label, value, capitalize, fullWidth }) => (
  <div className={`bg-muted/50 rounded-lg p-3 ${fullWidth ? 'md:col-span-2' : ''}`}>
    <p className="text-xs text-muted-foreground mb-1">{label}</p>
    <p className={`text-sm font-medium text-foreground ${capitalize ? 'capitalize' : ''}`}>
      {value}
    </p>
  </div>
);

export default StudentDetailCard;
