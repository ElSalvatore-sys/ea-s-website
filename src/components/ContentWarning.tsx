/**
 * ContentWarning Component
 * Shows visual warning badges for incomplete content in development mode
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  AlertCircle, 
  FileWarning, 
  Image,
  X,
  ChevronDown,
  ChevronUp,
  Bug
} from 'lucide-react';

interface ContentWarningProps {
  type: 'missing_translation' | 'placeholder' | 'not_ready' | 'broken_asset' | 'empty_content';
  message?: string;
  details?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  showInProduction?: boolean;
}

const ContentWarning: React.FC<ContentWarningProps> = ({
  type,
  message,
  details,
  position = 'top-right',
  showInProduction = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Only show in development by default
  if (!showInProduction && process.env.NODE_ENV === 'production') {
    return null;
  }

  if (isDismissed) {
    return null;
  }

  const getWarningConfig = () => {
    switch (type) {
      case 'missing_translation':
        return {
          icon: <AlertCircle className="w-4 h-4" />,
          color: 'bg-red-500/90 border-red-400',
          label: 'Missing Translation',
          defaultMessage: 'Translation key is showing as raw text'
        };
      case 'placeholder':
        return {
          icon: <FileWarning className="w-4 h-4" />,
          color: 'bg-yellow-500/90 border-yellow-400',
          label: 'Placeholder Content',
          defaultMessage: 'This section contains placeholder content'
        };
      case 'not_ready':
        return {
          icon: <AlertTriangle className="w-4 h-4" />,
          color: 'bg-orange-500/90 border-orange-400',
          label: 'Not Ready',
          defaultMessage: 'This section is not ready for production'
        };
      case 'broken_asset':
        return {
          icon: <Image className="w-4 h-4" />,
          color: 'bg-purple-500/90 border-purple-400',
          label: 'Broken Asset',
          defaultMessage: 'Image or asset failed to load'
        };
      case 'empty_content':
        return {
          icon: <Bug className="w-4 h-4" />,
          color: 'bg-gray-500/90 border-gray-400',
          label: 'Empty Content',
          defaultMessage: 'This section has no content'
        };
      default:
        return {
          icon: <AlertCircle className="w-4 h-4" />,
          color: 'bg-gray-500/90 border-gray-400',
          label: 'Warning',
          defaultMessage: 'Content issue detected'
        };
    }
  };

  const config = getWarningConfig();
  const positionClasses = {
    'top-left': 'top-2 left-2',
    'top-right': 'top-2 right-2',
    'bottom-left': 'bottom-2 left-2',
    'bottom-right': 'bottom-2 right-2'
  };

  return (
    <AnimatePresence>
      {!isDismissed && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className={`fixed ${positionClasses[position]} z-[9999] max-w-sm`}
        >
          <div className={`${config.color} backdrop-blur-md border rounded-lg shadow-lg overflow-hidden`}>
            {/* Header */}
            <div className="px-3 py-2 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-white">
                {config.icon}
                <span className="font-semibold text-sm">{config.label}</span>
              </div>
              <div className="flex items-center space-x-1">
                {details && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-white/80 hover:text-white transition-colors"
                    aria-label={isExpanded ? 'Collapse' : 'Expand'}
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                )}
                <button
                  onClick={() => setIsDismissed(true)}
                  className="text-white/80 hover:text-white transition-colors"
                  aria-label="Dismiss"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Message */}
            <div className="px-3 pb-2">
              <p className="text-white/90 text-xs">
                {message || config.defaultMessage}
              </p>
            </div>

            {/* Expanded Details */}
            <AnimatePresence>
              {isExpanded && details && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-t border-white/20"
                >
                  <div className="px-3 py-2">
                    <p className="text-white/80 text-xs font-mono">{details}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Badge version for inline warnings
export const ContentWarningBadge: React.FC<ContentWarningProps> = ({
  type,
  message,
  showInProduction = false
}) => {
  // Only show in development by default
  if (!showInProduction && process.env.NODE_ENV === 'production') {
    return null;
  }

  const getWarningConfig = () => {
    switch (type) {
      case 'missing_translation':
        return {
          icon: <AlertCircle className="w-3 h-3" />,
          color: 'bg-red-500 text-white',
          label: 'Missing Translation'
        };
      case 'placeholder':
        return {
          icon: <FileWarning className="w-3 h-3" />,
          color: 'bg-yellow-500 text-white',
          label: 'Placeholder'
        };
      case 'not_ready':
        return {
          icon: <AlertTriangle className="w-3 h-3" />,
          color: 'bg-orange-500 text-white',
          label: 'Not Ready'
        };
      case 'broken_asset':
        return {
          icon: <Image className="w-3 h-3" />,
          color: 'bg-purple-500 text-white',
          label: 'Broken'
        };
      case 'empty_content':
        return {
          icon: <Bug className="w-3 h-3" />,
          color: 'bg-gray-500 text-white',
          label: 'Empty'
        };
      default:
        return {
          icon: <AlertCircle className="w-3 h-3" />,
          color: 'bg-gray-500 text-white',
          label: 'Warning'
        };
    }
  };

  const config = getWarningConfig();

  return (
    <span 
      className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-xs font-medium ${config.color}`}
      title={message || config.label}
    >
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};

export default ContentWarning;