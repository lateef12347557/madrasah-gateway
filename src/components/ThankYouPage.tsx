import React from 'react';
import { CheckCircle2, MessageCircle, Mail, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ThankYouPageProps {
  onNewApplication: () => void;
}

const ThankYouPage: React.FC<ThankYouPageProps> = ({ onNewApplication }) => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16">
      <div className="max-w-2xl mx-auto text-center px-4">
        {/* Success Icon */}
        <div className="relative inline-flex mb-8">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse-soft" />
          <div className="relative w-24 h-24 rounded-full bg-gradient-hero flex items-center justify-center animate-scale-in">
            <CheckCircle2 className="w-12 h-12 text-primary-foreground" />
          </div>
        </div>

        {/* Thank You Message */}
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4 animate-slide-up">
          Thank You!
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8 animate-slide-up stagger-1">
          Your application has been successfully received.
        </p>

        {/* Information Card */}
        <div className="bg-card rounded-2xl p-8 shadow-card border border-border/50 mb-8 animate-slide-up stagger-2">
          <h2 className="text-lg font-serif font-semibold text-foreground mb-6">
            What Happens Next?
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4 text-left">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Application Review</h3>
                <p className="text-sm text-muted-foreground">
                  Our admissions team will review your application within 24-48 hours.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 text-left">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">WhatsApp Contact</h3>
                <p className="text-sm text-muted-foreground">
                  We will reach out via WhatsApp to discuss class schedules and answer any questions.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 text-left">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Email Confirmation</h3>
                <p className="text-sm text-muted-foreground">
                  You will also receive a confirmation email with further details.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative element */}
        <div className="flex items-center justify-center gap-4 mb-8 animate-fade-in stagger-3">
          <div className="h-px w-16 bg-border" />
          <div className="w-2 h-2 rotate-45 bg-gold" />
          <div className="h-px w-16 bg-border" />
        </div>

        {/* Action Button */}
        <div className="animate-fade-in stagger-4">
          <Button 
            variant="outline" 
            onClick={onNewApplication}
            className="mr-4"
          >
            Submit Another Application
          </Button>
        </div>

        {/* Note about session */}
        <p className="text-xs text-muted-foreground mt-8 animate-fade-in stagger-4">
          May Allah bless your journey of seeking knowledge.
        </p>
      </div>
    </div>
  );
};

export default ThankYouPage;
