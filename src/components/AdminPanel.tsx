import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getStudents, verifyAdminPassword, StudentData, getAdmins, addAdmin, deleteAdmin, AdminUser } from '@/lib/studentStore';
import { exportStudentApplication, exportEnrollmentReport } from '@/lib/pdfExport';
import StudentDetailCard from '@/components/StudentDetailCard';
import { Shield, Lock, AlertTriangle, Users, X, FileDown, FileText, Search, Eye, UserPlus, Trash2, Settings } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AdminPanelProps {
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [students, setStudents] = useState<StudentData[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);
  const [activeTab, setActiveTab] = useState('students');
  
  // New admin form
  const [newAdminUsername, setNewAdminUsername] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);

  const loadAdmins = async () => {
    try {
      const data = await getAdmins();
      setAdmins(data);
    } catch (err) {
      console.error('Failed to fetch admins:', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAdmins();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await verifyAdminPassword(password);
    if (result.success && result.admin) {
      setIsAuthenticated(true);
      setCurrentAdmin(result.admin);
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
        description: `Welcome, ${result.admin.username}!`,
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

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminUsername.trim() || !newAdminPassword.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    setIsAddingAdmin(true);
    try {
      await addAdmin(newAdminUsername.trim(), newAdminPassword);
      toast({
        title: "Success",
        description: "New admin added successfully.",
      });
      setNewAdminUsername('');
      setNewAdminPassword('');
      loadAdmins();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message?.includes('duplicate') ? "Username already exists." : "Failed to add admin.",
        variant: "destructive",
      });
    } finally {
      setIsAddingAdmin(false);
    }
  };

  const handleDeleteAdmin = async (admin: AdminUser) => {
    if (admins.length <= 1) {
      toast({
        title: "Error",
        description: "Cannot delete the last admin.",
        variant: "destructive",
      });
      return;
    }

    if (admin.id === currentAdmin?.id) {
      toast({
        title: "Error",
        description: "Cannot delete yourself.",
        variant: "destructive",
      });
      return;
    }

    try {
      await deleteAdmin(admin.id);
      toast({
        title: "Success",
        description: "Admin deleted successfully.",
      });
      loadAdmins();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete admin.",
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
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-serif font-bold">Admin Dashboard</h2>
                    <p className="text-primary-foreground/80">
                      Logged in as {currentAdmin?.username}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    onClick={onClose}
                    className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20"
                  >
                    Close Panel
                  </Button>
                </div>
              </div>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="border-b border-border px-6 pt-4">
                  <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="students" className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Students ({students.length})
                    </TabsTrigger>
                    <TabsTrigger value="admins" className="flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Admins ({admins.length})
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Students Tab */}
                <TabsContent value="students" className="mt-0">

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

                  {/* Export Button */}
                  <div className="flex justify-end">
                    <Button 
                      variant="outline" 
                      onClick={() => exportEnrollmentReport(filteredStudents)}
                      disabled={filteredStudents.length === 0}
                    >
                      <FileDown className="w-4 h-4 mr-2" />
                      Export Report
                    </Button>
                  </div>
                </div>
                </TabsContent>

                {/* Admins Tab */}
                <TabsContent value="admins" className="mt-0">
                  <div className="p-6 space-y-6">
                    {/* Add New Admin Form */}
                    <div className="bg-muted/30 rounded-lg p-4 border border-border">
                      <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
                        <UserPlus className="w-4 h-4" />
                        Add New Admin
                      </h3>
                      <form onSubmit={handleAddAdmin} className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                          <Label htmlFor="newUsername" className="sr-only">Username</Label>
                          <Input
                            id="newUsername"
                            placeholder="Username"
                            value={newAdminUsername}
                            onChange={(e) => setNewAdminUsername(e.target.value)}
                          />
                        </div>
                        <div className="flex-1">
                          <Label htmlFor="newPassword" className="sr-only">Password</Label>
                          <Input
                            id="newPassword"
                            type="password"
                            placeholder="Password"
                            value={newAdminPassword}
                            onChange={(e) => setNewAdminPassword(e.target.value)}
                          />
                        </div>
                        <Button type="submit" disabled={isAddingAdmin}>
                          <UserPlus className="w-4 h-4 mr-2" />
                          Add Admin
                        </Button>
                      </form>
                    </div>

                    {/* Admins List */}
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Username</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {admins.map((admin) => (
                            <TableRow key={admin.id}>
                              <TableCell className="font-medium">
                                {admin.username}
                                {admin.id === currentAdmin?.id && (
                                  <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">You</span>
                                )}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {admin.createdAt.toLocaleDateString()}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteAdmin(admin)}
                                  disabled={admin.id === currentAdmin?.id || admins.length <= 1}
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                  title={admin.id === currentAdmin?.id ? "Cannot delete yourself" : "Delete admin"}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Info */}
                    <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 flex items-start gap-3">
                      <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-foreground">Admin Security</p>
                        <p className="text-muted-foreground">
                          Each admin has a unique password. You cannot delete the last admin or yourself.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
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
