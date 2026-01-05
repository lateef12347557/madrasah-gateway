import React from 'react';
import { BookOpen } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-hero text-primary-foreground py-16 md:py-24 relative overflow-hidden">
      {/* Geometric pattern overlay */}
      <div className="absolute inset-0 geometric-pattern opacity-30" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
      
      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary-foreground/10 backdrop-blur-sm mb-8 animate-fade-in">
            <BookOpen className="w-10 h-10" />
          </div>
          
          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 animate-slide-up">
            Madrasah Enrollment
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto animate-slide-up stagger-1">
            Begin your journey of Islamic education. Complete the form below to register 
            for our comprehensive Quran and Islamic Studies programs.
          </p>
          
          {/* Decorative line */}
          <div className="flex items-center justify-center gap-4 mt-8 animate-fade-in stagger-2">
            <div className="h-px w-16 bg-gold/50" />
            <div className="w-2 h-2 rotate-45 bg-gold" />
            <div className="h-px w-16 bg-gold/50" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
