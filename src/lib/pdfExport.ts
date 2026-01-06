import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { StudentData } from './studentStore';

export const exportStudentApplication = (student: StudentData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Student Enrollment Application', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, 28, { align: 'center' });
  
  let yPosition = 40;
  
  // Student Information Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Student Information', 14, yPosition);
  yPosition += 8;
  
  const studentInfo = [
    ['Full Name', student.fullName],
    ['Gender', student.gender.charAt(0).toUpperCase() + student.gender.slice(1)],
    ['Date of Birth', student.dateOfBirth],
    ['Country', student.country],
    ['Timezone', student.timezone],
    ['Native Language', student.nativeLanguage],
  ];
  
  autoTable(doc, {
    startY: yPosition,
    head: [],
    body: studentInfo,
    theme: 'striped',
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 } },
  });
  
  yPosition = (doc as any).lastAutoTable.finalY + 10;
  
  // Guardian Information Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Parent/Guardian Information', 14, yPosition);
  yPosition += 8;
  
  const guardianInfo = [
    ['Guardian Name', student.guardianName],
    ['Relationship', student.relationship],
    ['WhatsApp Number', student.whatsappNumber],
    ['Email', student.email],
  ];
  
  autoTable(doc, {
    startY: yPosition,
    head: [],
    body: guardianInfo,
    theme: 'striped',
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 } },
  });
  
  yPosition = (doc as any).lastAutoTable.finalY + 10;
  
  // Academic Background Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Academic Background', 14, yPosition);
  yPosition += 8;
  
  const academicInfo = [
    ['Level', student.level.charAt(0).toUpperCase() + student.level.slice(1)],
    ['Quran Reading Ability', student.quranReadingAbility.replace(/_/g, ' ')],
    ['Tajweed Knowledge', student.tajweedKnowledge.replace(/_/g, ' ')],
    ['Previous Madrasah', student.previousMadrasah || 'N/A'],
  ];
  
  autoTable(doc, {
    startY: yPosition,
    head: [],
    body: academicInfo,
    theme: 'striped',
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 } },
  });
  
  yPosition = (doc as any).lastAutoTable.finalY + 10;
  
  // Class Preferences Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Class Preferences', 14, yPosition);
  yPosition += 8;
  
  const classInfo = [
    ['Interest Areas', student.interestAreas.map(a => a.replace(/_/g, ' ')).join(', ')],
    ['Preferred Days', student.preferredDays.join(', ')],
    ['Preferred Time', student.preferredTime.replace(/_/g, ' ')],
    ['Class Type', student.classType.replace(/_/g, ' ')],
  ];
  
  autoTable(doc, {
    startY: yPosition,
    head: [],
    body: classInfo,
    theme: 'striped',
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 } },
  });
  
  yPosition = (doc as any).lastAutoTable.finalY + 10;
  
  // Additional Information Section
  if (student.specialNeeds || student.referralSource || student.questions) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Additional Information', 14, yPosition);
    yPosition += 8;
    
    const additionalInfo: string[][] = [];
    if (student.specialNeeds) additionalInfo.push(['Special Needs', student.specialNeeds]);
    if (student.referralSource) additionalInfo.push(['Referral Source', student.referralSource]);
    if (student.questions) additionalInfo.push(['Questions', student.questions]);
    
    autoTable(doc, {
      startY: yPosition,
      head: [],
      body: additionalInfo,
      theme: 'striped',
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 } },
    });
  }
  
  // Footer
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text(`Application ID: ${student.id}`, 14, pageHeight - 10);
  doc.text(`Submitted: ${new Date(student.submittedAt).toLocaleString()}`, pageWidth - 14, pageHeight - 10, { align: 'right' });
  
  doc.save(`enrollment-${student.fullName.replace(/\s+/g, '-').toLowerCase()}.pdf`);
};

export const exportEnrollmentReport = (students: StudentData[]) => {
  const doc = new jsPDF('landscape');
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Student Enrollment Report', pageWidth / 2, 15, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${new Date().toLocaleString()} | Total Students: ${students.length}`, pageWidth / 2, 22, { align: 'center' });
  
  // Table Data
  const tableData = students.map(student => [
    new Date(student.submittedAt).toLocaleDateString(),
    student.fullName,
    student.gender.charAt(0).toUpperCase() + student.gender.slice(1),
    student.guardianName,
    student.email,
    student.whatsappNumber,
    student.level.charAt(0).toUpperCase() + student.level.slice(1),
    student.interestAreas.map(a => a.replace(/_/g, ' ')).join(', '),
    student.classType.replace(/_/g, ' '),
  ]);
  
  autoTable(doc, {
    startY: 30,
    head: [['Date', 'Student', 'Gender', 'Guardian', 'Email', 'WhatsApp', 'Level', 'Interests', 'Class Type']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [34, 139, 34], textColor: 255 },
    styles: { fontSize: 8 },
    columnStyles: {
      0: { cellWidth: 22 },
      1: { cellWidth: 30 },
      2: { cellWidth: 18 },
      3: { cellWidth: 30 },
      4: { cellWidth: 45 },
      5: { cellWidth: 30 },
      6: { cellWidth: 20 },
      7: { cellWidth: 45 },
      8: { cellWidth: 25 },
    },
  });
  
  doc.save(`enrollment-report-${new Date().toISOString().split('T')[0]}.pdf`);
};
