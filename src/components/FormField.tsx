import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

interface BaseFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
}

interface InputFieldProps extends BaseFieldProps {
  type: 'text' | 'email' | 'tel' | 'date';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

interface TextareaFieldProps extends BaseFieldProps {
  type: 'textarea';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

interface SelectFieldProps extends BaseFieldProps {
  type: 'select';
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}

interface CheckboxGroupProps extends BaseFieldProps {
  type: 'checkbox-group';
  value: string[];
  onChange: (value: string[]) => void;
  options: { value: string; label: string }[];
}

interface RadioGroupProps extends BaseFieldProps {
  type: 'radio-group';
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

type FormFieldProps = InputFieldProps | TextareaFieldProps | SelectFieldProps | CheckboxGroupProps | RadioGroupProps;

const FormField: React.FC<FormFieldProps> = (props) => {
  const { label, required, error, className } = props;

  const renderField = () => {
    switch (props.type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'date':
        return (
          <Input
            type={props.type}
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
            placeholder={props.placeholder}
            className={cn(
              "transition-all duration-200 focus:ring-2 focus:ring-primary/20",
              error && "border-destructive"
            )}
          />
        );
      
      case 'textarea':
        return (
          <Textarea
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
            placeholder={props.placeholder}
            rows={props.rows || 3}
            className={cn(
              "transition-all duration-200 focus:ring-2 focus:ring-primary/20 resize-none",
              error && "border-destructive"
            )}
          />
        );
      
      case 'select':
        return (
          <Select value={props.value} onValueChange={props.onChange}>
            <SelectTrigger className={cn(
              "transition-all duration-200",
              error && "border-destructive"
            )}>
              <SelectValue placeholder={props.placeholder || "Select an option"} />
            </SelectTrigger>
            <SelectContent>
              {props.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'checkbox-group':
        return (
          <div className="grid grid-cols-2 gap-3">
            {props.options.map((option) => (
              <label
                key={option.value}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200",
                  props.value.includes(option.value)
                    ? "bg-primary/5 border-primary"
                    : "bg-background border-border hover:border-primary/50"
                )}
              >
                <Checkbox
                  checked={props.value.includes(option.value)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      props.onChange([...props.value, option.value]);
                    } else {
                      props.onChange(props.value.filter((v) => v !== option.value));
                    }
                  }}
                />
                <span className="text-sm font-medium">{option.label}</span>
              </label>
            ))}
          </div>
        );
      
      case 'radio-group':
        return (
          <RadioGroup value={props.value} onValueChange={props.onChange} className="grid grid-cols-2 gap-3">
            {props.options.map((option) => (
              <label
                key={option.value}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200",
                  props.value === option.value
                    ? "bg-primary/5 border-primary"
                    : "bg-background border-border hover:border-primary/50"
                )}
              >
                <RadioGroupItem value={option.value} />
                <span className="text-sm font-medium">{option.label}</span>
              </label>
            ))}
          </RadioGroup>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {renderField()}
      {error && (
        <p className="text-sm text-destructive animate-fade-in">{error}</p>
      )}
    </div>
  );
};

export default FormField;
