import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import EnrollmentForm from '@/components/EnrollmentForm';
import ThankYouPage from '@/components/ThankYouPage';
import AdminPanel from '@/components/AdminPanel';
import Footer from '@/components/Footer';

const Index: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [typedCommand, setTypedCommand] = useState('');

  // Listen for admin command
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Build up the command
      const newCommand = typedCommand + e.key;
      
      // Check if it matches the admin command
      if ('/admin-access'.startsWith(newCommand)) {
        setTypedCommand(newCommand);
        
        if (newCommand === '/admin-access') {
          setShowAdmin(true);
          setTypedCommand('');
        }
      } else {
        // Reset if it doesn't match
        setTypedCommand(e.key === '/' ? '/' : '');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [typedCommand]);

  const handleSubmitSuccess = () => {
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewApplication = () => {
    setIsSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-12">
        {isSubmitted ? (
          <ThankYouPage onNewApplication={handleNewApplication} />
        ) : (
          <div className="max-w-4xl mx-auto">
            <EnrollmentForm onSubmitSuccess={handleSubmitSuccess} />
          </div>
        )}
      </main>

      <Footer />

      {/* Admin Panel Modal */}
      {showAdmin && (
        <AdminPanel onClose={() => setShowAdmin(false)} />
      )}
    </div>
  );
};

export default Index;
