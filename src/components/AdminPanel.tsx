import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getStudents, verifyAdminPassword, StudentData } from '@/lib/studentStore';
import { exportStudentApplication, exportEnrollmentReport } from '@/lib/pdfExport';
import StudentDetailCard from '@/components/StudentDetailCard';
import { Shield, Lock, AlertTriangle, Users, X, FileDown, FileText, Search, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AdminPanelProps {
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [students, setStudents] = useState<StudentData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (verifyAdminPassword(password)) {
      setIsAuthenticated(true);
      try {
        const data = await getStudents();
        setStudents(data);
      } catch (err) {
        console.error('Failed to fetch students:', err);
        toast({
          title: "Error",
          description: "Failed to load student data.",
          variant: "destructive",
        });
      }
      setError('');
      toast({
        title: "Access Granted",
        description: "Welcome to the admin panel.",
      });
    } else {
      setError('Invalid password. Access denied.');
      toast({
        title: "Access Denied",
        description: "Incorrect password.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  const filteredStudents = useMemo(() => {
    let result = students;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(student => 
        student.fullName.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query) ||
        student.guardianName.toLowerCase().includes(query) ||
        student.whatsappNumber.includes(query)
      );
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      result = result.filter(student => {
        const submittedDate = new Date(student.submittedAt);
        
        switch (dateFilter) {
          case 'today':
            return submittedDate >= today;
          case 'week':
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return submittedDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return submittedDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    return result;
  }, [students, searchQuery, dateFilter]);

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-card rounded-2xl shadow-card border border-border max-w-md w-full p-8 animate-scale-in">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-serif font-bold text-foreground">Admin Access</h2>
                <p className="text-sm text-muted-foreground">Secure authentication required</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="transition-all duration-200"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm animate-fade-in">
                <AlertTriangle className="w-4 h-4" />
                {error}
              </div>
            )}

            <Button type="submit" variant="hero" className="w-full">
              Authenticate
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-6">
            Only authorized personnel may access student data.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 overflow-auto">
        <div className="min-h-screen p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden animate-scale-in">
              {/* Header */}
              <div className="bg-gradient-hero text-primary-foreground p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-foreground/10 flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-serif font-bold">Registered Students</h2>
                    <p className="text-primary-foreground/80">
                      {filteredStudents.length} of {students.length} application{students.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => exportEnrollmentReport(filteredStudents)}
                    disabled={filteredStudents.length === 0}
                    className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20"
                  >
                    <FileDown className="w-4 h-4 mr-2" />
                    Export Report
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={onClose}
                    className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20"
                  >
                    Close Panel
                  </Button>
                </div>
              </div>

              {/* Search and Filters */}
              <div className="p-4 border-b border-border bg-muted/30">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, email, guardian, or phone..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">Last 7 Days</SelectItem>
                      <SelectItem value="month">Last 30 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {students.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-2">No Applications Yet</h3>
                    <p className="text-muted-foreground">
                      Student applications will appear here once submitted.
                    </p>
                  </div>
                ) : filteredStudents.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-2">No Results Found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search or filter criteria.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Submitted</TableHead>
                          <TableHead>Student Name</TableHead>
                          <TableHead>Gender</TableHead>
                          <TableHead>Guardian</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>WhatsApp</TableHead>
                          <TableHead>Level</TableHead>
                          <TableHead>Interests</TableHead>
                          <TableHead>Class Type</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredStudents.map((student) => (
                          <TableRow 
                            key={student.id}
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => setSelectedStudent(student)}
                          >
                            <TableCell className="text-xs text-muted-foreground">
                              {formatDate(student.submittedAt)}
                            </TableCell>
                            <TableCell className="font-medium">{student.fullName}</TableCell>
                            <TableCell className="capitalize">{student.gender}</TableCell>
                            <TableCell>{student.guardianName}</TableCell>
                            <TableCell>{student.email}</TableCell>
                            <TableCell>{student.whatsappNumber}</TableCell>
                            <TableCell className="capitalize">{student.level}</TableCell>
                            <TableCell className="text-xs">
                              {student.interestAreas.map(area => 
                                area.replace(/_/g, ' ')
                              ).join(', ')}
                            </TableCell>
                            <TableCell className="capitalize">
                              {student.classType.replace(/_/g, ' ')}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedStudent(student);
                                  }}
                                  title="View Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    exportStudentApplication(student);
                                  }}
                                  title="Download PDF"
                                >
                                  <FileText className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {/* Persistent Storage Info */}
                <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20 flex items-start gap-3">
                  <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-foreground">Persistent Database Storage</p>
                    <p className="text-muted-foreground">
                      All student enrollments are securely stored in the database. 
                      Data persists across browser sessions and page refreshes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <StudentDetailCard 
          student={selectedStudent} 
          onClose={() => setSelectedStudent(null)} 
        />
      )}
    </>
  );
};

export default AdminPanel;
