import React from 'react';
import { BookOpen } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12 mt-16">
      <div className="container">
        <div className="flex flex-col items-center text-center">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="font-serif text-xl font-semibold">Madrasah</span>
          </div>

          {/* Decorative element */}
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-12 bg-primary-foreground/30" />
            <div className="w-1.5 h-1.5 rotate-45 bg-gold" />
            <div className="h-px w-12 bg-primary-foreground/30" />
          </div>

          {/* Quote */}
          <blockquote className="max-w-lg text-primary-foreground/80 italic mb-6">
            "Seek knowledge from the cradle to the grave."
          </blockquote>

          {/* Copyright */}
          <p className="text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} Madrasah Enrollment System. All rights reserved.
          </p>

          {/* Admin hint */}
          <p className="text-xs text-primary-foreground/40 mt-4">
            Type <code className="bg-primary-foreground/10 px-1.5 py-0.5 rounded">/admin-access</code> anywhere for admin panel
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
