import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Users, TrendingUp, AlertCircle } from 'lucide-react';
import { gdprAnalytics } from '../../lib/gdpr-analytics';
import { OPTIMIZATION_EVENTS } from '../../lib/analytics/event-definitions';

interface UrgencyIndicatorProps {
  availableSlots?: number;
  viewingUsers?: number;
  bookingsToday?: number;
  lastBookedMinutes?: number;
  variant?: 'scarcity' | 'popularity' | 'timing' | 'mixed';
  className?: string;
  onConversion?: () => void;
}

const UrgencyIndicator: React.FC<UrgencyIndicatorProps> = ({
  availableSlots = 3,
  viewingUsers = 5,
  bookingsToday = 12,
  lastBookedMinutes = 15,
  variant = 'mixed',
  className = '',
  onConversion
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [hasTrackedView, setHasTrackedView] = useState(false);

  // Generate urgency messages based on variant
  const getUrgencyMessages = () => {
    const messages = [];

    // Scarcity messages
    if ((variant === 'scarcity' || variant === 'mixed') && availableSlots <= 5) {
      messages.push({
        icon: <AlertCircle className="w-4 h-4" />,
        text: availableSlots === 1
          ? 'Last slot available today!'
          : `Only ${availableSlots} slots left today`,
        color: availableSlots <= 2 ? 'text-red-500' : 'text-orange-500',
        urgencyLevel: availableSlots <= 2 ? 'high' : 'medium'
      });
    }

    // Popularity messages
    if ((variant === 'popularity' || variant === 'mixed') && viewingUsers > 2) {
      messages.push({
        icon: <Users className="w-4 h-4" />,
        text: `${viewingUsers} others viewing this time`,
        color: 'text-blue-500',
        urgencyLevel: 'medium'
      });
    }

    // Activity messages
    if ((variant === 'popularity' || variant === 'mixed') && bookingsToday > 5) {
      messages.push({
        icon: <TrendingUp className="w-4 h-4" />,
        text: `${bookingsToday} bookings today - high demand`,
        color: 'text-purple-500',
        urgencyLevel: 'medium'
      });
    }

    // Timing messages
    if ((variant === 'timing' || variant === 'mixed') && lastBookedMinutes < 30) {
      messages.push({
        icon: <Clock className="w-4 h-4" />,
        text: `Last booking ${lastBookedMinutes} minutes ago`,
        color: 'text-green-500',
        urgencyLevel: 'low'
      });
    }

    return messages;
  };

  const messages = getUrgencyMessages();

  useEffect(() => {
    // Show indicator after a delay
    const showTimer = setTimeout(() => {
      setIsVisible(true);

      // Track view
      if (!hasTrackedView && messages.length > 0) {
        gdprAnalytics.trackEvent(OPTIMIZATION_EVENTS.VIEW_URGENCY_MESSAGE, {
          variant,
          messageCount: messages.length,
          urgencyLevel: messages[0]?.urgencyLevel
        });
        setHasTrackedView(true);
      }
    }, 2000);

    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (messages.length <= 1) return;

    // Rotate messages if multiple
    const rotationInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 4000);

    return () => clearInterval(rotationInterval);
  }, [messages.length]);

  // Handle click tracking
  const handleClick = () => {
    gdprAnalytics.trackEvent(OPTIMIZATION_EVENTS.URGENCY_CONVERSION, {
      variant,
      message: messages[currentMessage]?.text,
      urgencyLevel: messages[currentMessage]?.urgencyLevel
    });

    if (onConversion) {
      onConversion();
    }
  };

  if (messages.length === 0) return null;

  const currentMsg = messages[currentMessage];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className={`urgency-indicator ${className}`}
          onClick={handleClick}
        >
          <div className="flex items-center gap-2 px-3 py-2 bg-black/50 backdrop-blur-lg border border-white/10 rounded-lg">
            <motion.div
              key={currentMessage}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 500,
                damping: 15
              }}
              className={currentMsg.color}
            >
              {currentMsg.icon}
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.span
                key={currentMessage}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="text-sm font-medium text-white"
              >
                {currentMsg.text}
              </motion.span>
            </AnimatePresence>

            {/* Pulse animation for high urgency */}
            {currentMsg.urgencyLevel === 'high' && (
              <motion.div
                className="absolute inset-0 rounded-lg border border-red-500/50"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.5, 0, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity
                }}
              />
            )}
          </div>

          {/* Progress indicator for multiple messages */}
          {messages.length > 1 && (
            <div className="flex gap-1 justify-center mt-2">
              {messages.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 w-6 rounded-full transition-colors ${
                    index === currentMessage
                      ? 'bg-purple-500'
                      : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UrgencyIndicator;