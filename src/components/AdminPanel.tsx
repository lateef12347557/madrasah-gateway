import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getStudents, verifyAdminPassword, StudentData } from '@/lib/studentStore';
import { Shield, Lock, AlertTriangle, Users, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AdminPanelProps {
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [students, setStudents] = useState<StudentData[]>([]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (verifyAdminPassword(password)) {
      setIsAuthenticated(true);
      setStudents(getStudents());
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
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 overflow-auto">
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden animate-scale-in">
            {/* Header */}
            <div className="bg-gradient-hero text-primary-foreground p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-foreground/10 flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-serif font-bold">Registered Students</h2>
                  <p className="text-primary-foreground/80">
                    {students.length} application{students.length !== 1 ? 's' : ''} this session
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={onClose}
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20"
              >
                Close Panel
              </Button>
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
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.map((student) => (
                        <TableRow key={student.id}>
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
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Session Warning */}
              <div className="mt-6 p-4 bg-secondary/50 rounded-lg border border-border flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-secondary-foreground flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-foreground">Session-Based Storage</p>
                  <p className="text-muted-foreground">
                    This data is stored in memory for this session only. Refreshing or closing the browser 
                    will clear all data. For production use, consider integrating a database solution.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
