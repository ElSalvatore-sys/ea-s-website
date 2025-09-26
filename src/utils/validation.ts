// Form validation utilities

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean;
  message: string;
}

export interface ValidationSchema {
  [field: string]: ValidationRule[];
}

export interface ValidationErrors {
  [field: string]: string;
}

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone validation regex (international format)
const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;

// URL validation regex
const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

// Common validation rules
export const validators = {
  required: (message = 'This field is required'): ValidationRule => ({
    required: true,
    message
  }),

  email: (message = 'Please enter a valid email address'): ValidationRule => ({
    pattern: emailRegex,
    message
  }),

  phone: (message = 'Please enter a valid phone number'): ValidationRule => ({
    pattern: phoneRegex,
    message
  }),

  url: (message = 'Please enter a valid URL'): ValidationRule => ({
    pattern: urlRegex,
    message
  }),

  minLength: (min: number, message?: string): ValidationRule => ({
    minLength: min,
    message: message || `Must be at least ${min} characters`
  }),

  maxLength: (max: number, message?: string): ValidationRule => ({
    maxLength: max,
    message: message || `Must be no more than ${max} characters`
  }),

  pattern: (pattern: RegExp, message: string): ValidationRule => ({
    pattern,
    message
  }),

  custom: (validator: (value: any) => boolean, message: string): ValidationRule => ({
    custom: validator,
    message
  })
};

// Validate a single field
export const validateField = (value: any, rules: ValidationRule[]): string | null => {
  for (const rule of rules) {
    // Check required
    if (rule.required && (!value || value.toString().trim() === '')) {
      return rule.message;
    }

    // Skip other validations if field is empty and not required
    if (!value || value.toString().trim() === '') {
      continue;
    }

    const stringValue = value.toString().trim();

    // Check minLength
    if (rule.minLength && stringValue.length < rule.minLength) {
      return rule.message;
    }

    // Check maxLength
    if (rule.maxLength && stringValue.length > rule.maxLength) {
      return rule.message;
    }

    // Check pattern
    if (rule.pattern && !rule.pattern.test(stringValue)) {
      return rule.message;
    }

    // Check custom validation
    if (rule.custom && !rule.custom(value)) {
      return rule.message;
    }
  }

  return null;
};

// Validate entire form
export const validateForm = (
  formData: { [key: string]: any },
  schema: ValidationSchema
): ValidationErrors => {
  const errors: ValidationErrors = {};

  Object.keys(schema).forEach(field => {
    const error = validateField(formData[field], schema[field]);
    if (error) {
      errors[field] = error;
    }
  });

  return errors;
};

// Check if form has errors
export const hasErrors = (errors: ValidationErrors): boolean => {
  return Object.keys(errors).length > 0;
};

// Common validation schemas
export const bookingFormSchema: ValidationSchema = {
  name: [
    validators.required('Name is required'),
    validators.minLength(2, 'Name must be at least 2 characters'),
    validators.maxLength(100, 'Name must be less than 100 characters')
  ],
  email: [
    validators.required('Email is required'),
    validators.email('Please enter a valid email address')
  ],
  company: [
    validators.required('Company name is required'),
    validators.minLength(2, 'Company name must be at least 2 characters')
  ],
  phone: [
    validators.phone('Please enter a valid phone number')
  ],
  employees: [
    validators.required('Please select number of employees')
  ],
  industry: [
    validators.required('Please select your industry')
  ],
  goals: [
    validators.required('Please describe your business goals'),
    validators.minLength(10, 'Please provide more detail about your goals')
  ],
  challenges: [
    validators.required('Please describe your current challenges'),
    validators.minLength(10, 'Please provide more detail about your challenges')
  ]
};

export const contactFormSchema: ValidationSchema = {
  name: [
    validators.required('Name is required'),
    validators.minLength(2, 'Name must be at least 2 characters'),
    validators.maxLength(100, 'Name must be less than 100 characters')
  ],
  email: [
    validators.required('Email is required'),
    validators.email('Please enter a valid email address')
  ],
  company: [
    validators.required('Company name is required')
  ],
  phone: [
    validators.phone('Please enter a valid phone number')
  ],
  employees: [
    validators.required('Please select number of employees')
  ],
  industry: [
    validators.required('Please select your industry')
  ],
  budget: [
    validators.required('Please select your budget range')
  ],
  timeline: [
    validators.required('Please select your project timeline')
  ],
  goals: [
    validators.required('Please describe your business goals'),
    validators.minLength(10, 'Please provide more detail about your goals')
  ],
  challenges: [
    validators.required('Please describe your current challenges'),
    validators.minLength(10, 'Please provide more detail about your challenges')
  ]
};

// Form sanitization utilities
export const sanitizeInput = (value: string): string => {
  return value
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '');
};

export const sanitizeFormData = (formData: { [key: string]: any }): { [key: string]: any } => {
  const sanitized: { [key: string]: any } = {};
  
  Object.keys(formData).forEach(key => {
    const value = formData[key];
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else {
      sanitized[key] = value;
    }
  });

  return sanitized;
};