import React, { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';
import './animations.css';

interface SuccessNotificationProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

const SuccessNotification: React.FC<SuccessNotificationProps> = ({ 
  message, 
  onClose, 
  duration = 3000 
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="success-notification">
      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
      <span className="text-gray-900 font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-auto text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default SuccessNotification;