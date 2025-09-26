import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface MobileProgressBarProps {
  currentStep: number;
  totalSteps: number;
  onStepClick?: (step: number) => void;
  showLabels?: boolean;
  className?: string;
}

const MobileProgressBar: React.FC<MobileProgressBarProps> = ({
  currentStep,
  totalSteps,
  onStepClick,
  showLabels = false,
  className = ''
}) => {
  const { t } = useTranslation();

  // Step labels
  const stepLabels = [
    t('booking.steps.service'),
    t('booking.steps.datetime'),
    t('booking.steps.contact'),
    t('booking.steps.confirm')
  ];

  return (
    <div className={`w-full ${className}`}>
      {/* Progress bar */}
      <div className="relative">
        {/* Background line */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700" />

        {/* Active progress line */}
        <motion.div
          className="absolute top-4 left-0 h-0.5 bg-purple-500"
          initial={{ width: 0 }}
          animate={{
            width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        />

        {/* Step indicators */}
        <div className="relative flex justify-between">
          {Array.from({ length: totalSteps }, (_, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isActive = stepNumber === currentStep;
            const isPending = stepNumber > currentStep;

            return (
              <div
                key={stepNumber}
                className="flex flex-col items-center"
              >
                <button
                  onClick={() => onStepClick?.(stepNumber)}
                  disabled={isPending}
                  className={`
                    relative w-8 h-8 rounded-full flex items-center justify-center
                    transition-all duration-200 touch-manipulation tap-highlight-none
                    ${isCompleted
                      ? 'bg-purple-500 text-white'
                      : isActive
                      ? 'bg-purple-500 text-white scale-110 shadow-lg'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                    }
                    ${!isPending && onStepClick
                      ? 'hover:scale-110 active:scale-95'
                      : 'cursor-default'
                    }
                  `}
                  aria-label={`Step ${stepNumber}: ${stepLabels[index]}`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span className="text-xs font-medium">{stepNumber}</span>
                  )}

                  {/* Active pulse effect */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-purple-500"
                      initial={{ scale: 1, opacity: 0.5 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: 'easeOut'
                      }}
                    />
                  )}
                </button>

                {/* Step label */}
                {showLabels && (
                  <span className={`
                    mt-2 text-xs text-center max-w-[60px]
                    ${isActive
                      ? 'text-purple-600 dark:text-purple-400 font-medium'
                      : 'text-gray-500 dark:text-gray-400'
                    }
                  `}>
                    {stepLabels[index]}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Current step description (mobile only) */}
      <div className="mt-4 text-center sm:hidden">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t('booking.stepOf', { current: currentStep, total: totalSteps })}
        </p>
        <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
          {stepLabels[currentStep - 1]}
        </p>
      </div>
    </div>
  );
};

export default MobileProgressBar;