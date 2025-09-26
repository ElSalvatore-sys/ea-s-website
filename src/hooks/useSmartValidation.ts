import { useState, useCallback, useEffect, useRef } from 'react';
import {
  validatePhoneNumber,
  validateEmail,
  validateName,
  formatPhoneNumber,
  detectCountryCode,
  getContextualErrorMessage,
  getSuccessFeedback,
  calculateFormProgress,
  debounce,
  FormField,
  ValidationFeedback
} from '../utils/formValidation';
import {
  getIndustryValidator,
  getIndustryContext,
  getAutocompleteOptions,
  validateIndustrySpecific,
  IndustryType
} from '../utils/industryValidators';

// ============================================
// TYPES
// ============================================

interface ValidationState {
  isValid: boolean;
  error?: string;
  warning?: string;
  suggestion?: string;
  formatted?: string;
  feedback?: ValidationFeedback;
  isValidating: boolean;
  hasBeenTouched: boolean;
}

interface FormState {
  [key: string]: {
    value: any;
    validation: ValidationState;
  };
}

interface UseSmartValidationOptions {
  industry?: IndustryType;
  realtime?: boolean;
  debounceMs?: number;
  showProgress?: boolean;
  autoFormat?: boolean;
  autoDetectCountry?: boolean;
}

interface ValidationResult {
  formState: FormState;
  errors: Record<string, string>;
  warnings: Record<string, string>;
  progress: number;
  isValid: boolean;
  validate: (field: string, value: any) => void;
  validateAll: () => boolean;
  reset: () => void;
  setFieldValue: (field: string, value: any) => void;
  getFieldError: (field: string) => string | undefined;
  getFieldWarning: (field: string) => string | undefined;
  getFieldSuggestion: (field: string) => string | undefined;
  getAutocomplete: (field: string) => string[];
  formatField: (field: string) => void;
}

// ============================================
// MAIN HOOK
// ============================================

export const useSmartValidation = (
  fields: string[],
  options: UseSmartValidationOptions = {}
): ValidationResult => {
  const {
    industry,
    realtime = true,
    debounceMs = 300,
    showProgress = true,
    autoFormat = true,
    autoDetectCountry = true
  } = options;

  // Initialize form state
  const initialState: FormState = {};
  fields.forEach(field => {
    initialState[field] = {
      value: '',
      validation: {
        isValid: false,
        isValidating: false,
        hasBeenTouched: false
      }
    };
  });

  const [formState, setFormState] = useState<FormState>(initialState);
  const [countryCode, setCountryCode] = useState('+49');
  const validationTimeouts = useRef<Record<string, NodeJS.Timeout>>({});

  // Auto-detect country code on mount
  useEffect(() => {
    if (autoDetectCountry) {
      const detected = detectCountryCode();
      setCountryCode(detected);
    }
  }, [autoDetectCountry]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(validationTimeouts.current).forEach(timeout => {
        clearTimeout(timeout);
      });
    };
  }, []);

  // Core validation function
  const performValidation = useCallback((field: string, value: any): ValidationState => {
    let validation: ValidationState = {
      isValid: false,
      isValidating: false,
      hasBeenTouched: true
    };

    // Handle empty values
    if (!value || value === '') {
      validation.error = getContextualErrorMessage(field, industry);
      return validation;
    }

    // Field-specific validation
    switch (field) {
      case 'phone':
      case 'phoneNumber':
      case 'mobile':
        const phoneResult = validatePhoneNumber(value);
        validation.isValid = phoneResult.isValid;
        validation.formatted = phoneResult.formatted;
        validation.suggestion = phoneResult.suggestion;
        if (!phoneResult.isValid) {
          validation.error = getContextualErrorMessage('phone', industry);
        } else {
          validation.feedback = getSuccessFeedback('phone');
        }
        break;

      case 'email':
      case 'emailAddress':
        const emailResult = validateEmail(value);
        validation.isValid = emailResult.isValid;
        validation.suggestion = emailResult.suggestion;
        validation.warning = emailResult.warning;
        if (!emailResult.isValid) {
          validation.error = getContextualErrorMessage('email', industry);
        } else {
          validation.feedback = getSuccessFeedback('email');
        }
        break;

      case 'name':
      case 'fullName':
      case 'firstName':
      case 'lastName':
        const nameResult = validateName(value);
        validation.isValid = nameResult.isValid;
        validation.formatted = nameResult.formatted;
        if (nameResult.suggestions && nameResult.suggestions.length > 0) {
          validation.suggestion = nameResult.suggestions[0];
        }
        if (!nameResult.isValid) {
          validation.error = getContextualErrorMessage('name', industry);
        } else {
          validation.feedback = getSuccessFeedback('name');
        }
        break;

      case 'date':
      case 'appointmentDate':
      case 'bookingDate':
        const dateValue = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        validation.isValid = dateValue >= today;
        if (!validation.isValid) {
          validation.error = 'Please select a future date';
        } else {
          validation.feedback = getSuccessFeedback('date');
        }
        break;

      case 'time':
      case 'appointmentTime':
      case 'bookingTime':
        validation.isValid = value && value.length > 0;
        if (!validation.isValid) {
          validation.error = getContextualErrorMessage('time', industry);
        } else {
          validation.feedback = getSuccessFeedback('time');
        }
        break;

      default:
        // Industry-specific validation
        if (industry) {
          const industryResult = validateIndustrySpecific(field, value, industry);
          validation.isValid = industryResult.isValid;
          validation.error = industryResult.error;
          validation.warning = industryResult.warning;
          validation.suggestion = industryResult.suggestion;
          if (industryResult.isValid) {
            validation.feedback = {
              type: 'success',
              message: `${field} verified`,
              animation: 'checkmark'
            };
          }
        } else {
          // Generic validation for unknown fields
          validation.isValid = value && value.toString().length > 0;
        }
        break;
    }

    return validation;
  }, [industry, countryCode]);

  // Validate with debouncing for real-time validation
  const validate = useCallback((field: string, value: any) => {
    // Clear existing timeout
    if (validationTimeouts.current[field]) {
      clearTimeout(validationTimeouts.current[field]);
    }

    // Set field as validating
    setFormState(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        value,
        validation: {
          ...prev[field].validation,
          isValidating: realtime,
          hasBeenTouched: true
        }
      }
    }));

    // Perform validation
    const performValidationAndUpdate = () => {
      const validation = performValidation(field, value);
      
      setFormState(prev => ({
        ...prev,
        [field]: {
          value: autoFormat && validation.formatted ? validation.formatted : value,
          validation
        }
      }));
    };

    if (realtime) {
      // Debounced validation for real-time mode
      validationTimeouts.current[field] = setTimeout(
        performValidationAndUpdate,
        debounceMs
      );
    } else {
      // Immediate validation for non-realtime mode
      performValidationAndUpdate();
    }
  }, [performValidation, realtime, debounceMs, autoFormat]);

  // Validate all fields
  const validateAll = useCallback((): boolean => {
    let allValid = true;
    const newState = { ...formState };

    fields.forEach(field => {
      const value = newState[field].value;
      const validation = performValidation(field, value);
      newState[field] = {
        value,
        validation
      };
      if (!validation.isValid) {
        allValid = false;
      }
    });

    setFormState(newState);
    return allValid;
  }, [formState, fields, performValidation]);

  // Reset form
  const reset = useCallback(() => {
    setFormState(initialState);
  }, []);

  // Set field value
  const setFieldValue = useCallback((field: string, value: any) => {
    setFormState(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        value
      }
    }));

    if (realtime) {
      validate(field, value);
    }
  }, [validate, realtime]);

  // Get field error
  const getFieldError = useCallback((field: string): string | undefined => {
    return formState[field]?.validation?.error;
  }, [formState]);

  // Get field warning
  const getFieldWarning = useCallback((field: string): string | undefined => {
    return formState[field]?.validation?.warning;
  }, [formState]);

  // Get field suggestion
  const getFieldSuggestion = useCallback((field: string): string | undefined => {
    return formState[field]?.validation?.suggestion;
  }, [formState]);

  // Get autocomplete options
  const getAutocomplete = useCallback((field: string): string[] => {
    if (!industry) return [];
    return getAutocompleteOptions(field, industry);
  }, [industry]);

  // Format field value
  const formatField = useCallback((field: string) => {
    const currentValue = formState[field]?.value;
    if (!currentValue) return;

    let formatted = currentValue;
    
    if (field === 'phone' || field === 'phoneNumber' || field === 'mobile') {
      formatted = formatPhoneNumber(currentValue, countryCode);
    } else if (field === 'name' || field === 'fullName') {
      const nameResult = validateName(currentValue);
      formatted = nameResult.formatted;
    }

    setFieldValue(field, formatted);
  }, [formState, countryCode, setFieldValue]);

  // Calculate progress
  const progress = showProgress ? calculateFormProgress(
    fields.map(field => ({
      name: field,
      value: formState[field]?.value,
      required: true,
      valid: formState[field]?.validation?.isValid || false
    }))
  ) : 0;

  // Aggregate errors and warnings
  const errors: Record<string, string> = {};
  const warnings: Record<string, string> = {};
  let isValid = true;

  fields.forEach(field => {
    const validation = formState[field]?.validation;
    if (validation?.error) {
      errors[field] = validation.error;
      isValid = false;
    }
    if (validation?.warning) {
      warnings[field] = validation.warning;
    }
  });

  return {
    formState,
    errors,
    warnings,
    progress,
    isValid,
    validate,
    validateAll,
    reset,
    setFieldValue,
    getFieldError,
    getFieldWarning,
    getFieldSuggestion,
    getAutocomplete,
    formatField
  };
};

// ============================================
// ANIMATION HELPERS
// ============================================

export const getValidationAnimation = (feedback?: ValidationFeedback): string => {
  if (!feedback) return '';
  
  switch (feedback.animation) {
    case 'checkmark':
      return 'animate-checkmark';
    case 'shake':
      return 'animate-shake';
    case 'pulse':
      return 'animate-pulse';
    case 'slide':
      return 'animate-slide-in';
    default:
      return '';
  }
};

export const getValidationColor = (validation: ValidationState): string => {
  if (!validation.hasBeenTouched) return 'border-gray-300';
  if (validation.isValidating) return 'border-blue-400';
  if (validation.error) return 'border-red-500';
  if (validation.warning) return 'border-yellow-500';
  if (validation.isValid) return 'border-green-500';
  return 'border-gray-300';
};

// ============================================
// EXPORT DEFAULT
// ============================================

export default useSmartValidation;