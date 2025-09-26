import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle, Info, X, Phone, Mail, User, Calendar, Clock } from 'lucide-react';
import { getValidationAnimation, getValidationColor } from '../hooks/useSmartValidation';
import { ValidationFeedback } from '../utils/formValidation';

// ============================================
// TYPES
// ============================================

interface SmartInputProps {
  type?: 'text' | 'email' | 'tel' | 'date' | 'time' | 'number';
  name: string;
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  error?: string;
  warning?: string;
  suggestion?: string;
  isValid?: boolean;
  isValidating?: boolean;
  feedback?: ValidationFeedback;
  autocompleteOptions?: string[];
  icon?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  showSuccessAnimation?: boolean;
  autoFormat?: boolean;
}

// ============================================
// SMART INPUT COMPONENT
// ============================================

export const SmartInput: React.FC<SmartInputProps> = ({
  type = 'text',
  name,
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  error,
  warning,
  suggestion,
  isValid,
  isValidating,
  feedback,
  autocompleteOptions = [],
  icon,
  required = false,
  disabled = false,
  className = '',
  inputClassName = '',
  showSuccessAnimation = true,
  autoFormat = true
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [selectedAutocompleteIndex, setSelectedAutocompleteIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get icon based on input type
  const getIcon = () => {
    if (icon) return icon;
    switch (type) {
      case 'tel':
        return <Phone className="w-4 h-4" />;
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'date':
        return <Calendar className="w-4 h-4" />;
      case 'time':
        return <Clock className="w-4 h-4" />;
      default:
        if (name.toLowerCase().includes('name')) {
          return <User className="w-4 h-4" />;
        }
        return null;
    }
  };

  // Handle autocomplete selection
  const handleAutocompleteSelect = (option: string) => {
    onChange(option);
    setShowAutocomplete(false);
    setSelectedAutocompleteIndex(-1);
    inputRef.current?.focus();
  };

  // Handle keyboard navigation in autocomplete
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (autocompleteOptions.length > 0 && showAutocomplete) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedAutocompleteIndex(prev => 
          prev < autocompleteOptions.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedAutocompleteIndex(prev => 
          prev > 0 ? prev - 1 : autocompleteOptions.length - 1
        );
      } else if (e.key === 'Enter' && selectedAutocompleteIndex >= 0) {
        e.preventDefault();
        handleAutocompleteSelect(autocompleteOptions[selectedAutocompleteIndex]);
      } else if (e.key === 'Escape') {
        setShowAutocomplete(false);
        setSelectedAutocompleteIndex(-1);
      }
    }
  };

  // Handle focus
  const handleFocus = () => {
    setIsFocused(true);
    if (autocompleteOptions.length > 0) {
      setShowAutocomplete(true);
    }
    onFocus?.();
  };

  // Handle blur
  const handleBlur = () => {
    setIsFocused(false);
    // Delay hiding autocomplete to allow click events
    setTimeout(() => setShowAutocomplete(false), 200);
    onBlur?.();
  };

  // Get border color based on validation state
  const getBorderColor = () => {
    if (!isFocused && !error && !warning && !isValid) return 'border-gray-300 dark:border-gray-600';
    if (isValidating) return 'border-blue-400 dark:border-blue-500';
    if (error) return 'border-red-500 dark:border-red-400';
    if (warning) return 'border-yellow-500 dark:border-yellow-400';
    if (isValid) return 'border-green-500 dark:border-green-400';
    if (isFocused) return 'border-purple-500 dark:border-purple-400';
    return 'border-gray-300 dark:border-gray-600';
  };

  // Get background color for input
  const getBackgroundColor = () => {
    if (disabled) return 'bg-gray-100 dark:bg-gray-800';
    return 'bg-white dark:bg-gray-900';
  };

  return (
    <div className={`relative ${className}`}>
      {/* Label */}
      {label && (
        <label 
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Icon */}
        {getIcon() && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {getIcon()}
          </div>
        )}

        {/* Input Field */}
        <input
          ref={inputRef}
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full px-3 py-2 rounded-lg transition-all duration-200
            ${getIcon() ? 'pl-10' : ''}
            ${isValidating || isValid || error || warning ? 'pr-10' : ''}
            ${getBorderColor()}
            ${getBackgroundColor()}
            border focus:outline-none focus:ring-2 focus:ring-purple-500/20
            text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
            disabled:cursor-not-allowed disabled:opacity-50
            ${inputClassName}
          `}
        />

        {/* Validation Status Icon */}
        <AnimatePresence>
          {(isValidating || isValid || error || warning) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {isValidating && (
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              )}
              {!isValidating && isValid && showSuccessAnimation && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.3 }}
                >
                  <Check className="w-5 h-5 text-green-500" />
                </motion.div>
              )}
              {!isValidating && error && (
                <AlertCircle className="w-5 h-5 text-red-500" />
              )}
              {!isValidating && !error && warning && (
                <Info className="w-5 h-5 text-yellow-500" />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Autocomplete Dropdown */}
      <AnimatePresence>
        {showAutocomplete && autocompleteOptions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-48 overflow-y-auto"
          >
            {autocompleteOptions.map((option, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleAutocompleteSelect(option)}
                className={`
                  w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700
                  ${selectedAutocompleteIndex === index ? 'bg-gray-100 dark:bg-gray-700' : ''}
                  ${index === 0 ? 'rounded-t-lg' : ''}
                  ${index === autocompleteOptions.length - 1 ? 'rounded-b-lg' : ''}
                  text-gray-900 dark:text-white text-sm
                `}
              >
                {option}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error/Warning/Suggestion Messages */}
      <AnimatePresence>
        {(error || warning || suggestion) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-1"
          >
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {error}
              </p>
            )}
            {!error && warning && (
              <p className="text-sm text-yellow-600 dark:text-yellow-400 flex items-center gap-1">
                <Info className="w-3 h-3" />
                {warning}
              </p>
            )}
            {!error && suggestion && (
              <p className="text-sm text-blue-600 dark:text-blue-400 flex items-center gap-1">
                <Info className="w-3 h-3" />
                {suggestion}
                {suggestion.includes('Did you mean') && (
                  <button
                    type="button"
                    onClick={() => {
                      const match = suggestion.match(/Did you mean (.+)\?/);
                      if (match) onChange(match[1]);
                    }}
                    className="underline ml-1 hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    Use this
                  </button>
                )}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Feedback */}
      <AnimatePresence>
        {feedback && feedback.type === 'success' && showSuccessAnimation && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="mt-1"
          >
            <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
              <Check className="w-3 h-3" />
              {feedback.message}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================
// SMART FORM PROGRESS COMPONENT
// ============================================

interface SmartFormProgressProps {
  progress: number;
  steps?: string[];
  currentStep?: number;
  showPercentage?: boolean;
  className?: string;
}

export const SmartFormProgress: React.FC<SmartFormProgressProps> = ({
  progress,
  steps = [],
  currentStep = 0,
  showPercentage = true,
  className = ''
}) => {
  return (
    <div className={`w-full ${className}`}>
      {/* Progress Bar */}
      <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
        />
      </div>

      {/* Progress Text */}
      {showPercentage && (
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
          {progress}% Complete
        </div>
      )}

      {/* Steps */}
      {steps.length > 0 && (
        <div className="mt-4 flex justify-between">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`
                text-xs font-medium
                ${index <= currentStep ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400 dark:text-gray-600'}
              `}
            >
              {step}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SmartInput;