import React from 'react';
import { cn } from '@/lib/utils';

interface FormSectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({ 
  title, 
  subtitle, 
  children, 
  className,
  icon 
}) => {
  return (
    <div className={cn(
      "bg-card rounded-xl p-6 shadow-card border border-border/50 animate-fade-in",
      className
    )}>
      <div className="flex items-center gap-3 mb-6">
        {icon && (
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-xl font-serif font-semibold text-foreground">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

export default FormSection;
