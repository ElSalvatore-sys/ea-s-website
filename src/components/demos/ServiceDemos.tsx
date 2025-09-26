import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Calendar, 
  FileText, 
  Send, 
  Bot, 
  CheckCircle,
  Clock,
  Users,
  TrendingUp,
  Zap
} from 'lucide-react';
import { useLanguage } from '../../providers/LanguageProvider';
import { analytics } from '../../lib/analytics';

interface ServiceDemoProps {
  type: 'chatbot' | 'booking' | 'document';
}

export const ServiceDemo: React.FC<ServiceDemoProps> = ({ type }) => {
  const { language } = useLanguage();
  const [isActive, setIsActive] = useState(false);
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [interactionStartTime, setInteractionStartTime] = useState<number>(0);
  
  // Track demo view on mount
  React.useEffect(() => {
    analytics.trackEvent('service_demo_view', {
      demoType: type,
      demoTitle: type === 'chatbot' ? 'AI Chatbot Demo' : 
                 type === 'booking' ? 'Booking System Demo' :
                 'Document Analysis Demo'
    });
  }, [type]);

  const handleInteraction = () => {
    const startTime = Date.now();
    setInteractionStartTime(startTime);
    setIsActive(true);
    
    // Track demo interaction start
    analytics.trackEvent('demo_interaction_start', {
      demoType: type,
      inputValue: message,
      inputLength: message.length,
      timestamp: startTime
    });
    
    setTimeout(() => {
      let responseText = '';
      if (type === 'chatbot') {
        responseText = language === 'de' 
          ? '🤖 Hallo! Ich bin Ihr KI-Assistent. Wie kann ich Ihnen heute helfen?'
          : '🤖 Hello! I\'m your AI assistant. How can I help you today?';
      } else if (type === 'booking') {
        responseText = language === 'de'
          ? '✅ Termin erfolgreich gebucht! Bestätigung wurde per E-Mail gesendet.'
          : '✅ Appointment successfully booked! Confirmation sent via email.';
      } else if (type === 'document') {
        responseText = language === 'de'
          ? '📊 Dokument analysiert: 2.450 Wörter, Sentiment: Positiv, 5 Schlüsselthemen identifiziert'
          : '📊 Document analyzed: 2,450 words, Sentiment: Positive, 5 key topics identified';
      }
      setResponse(responseText);
      
      // Track demo completion
      const completionTime = Date.now();
      const interactionDuration = completionTime - interactionStartTime;
      
      analytics.trackEvent('demo_interaction_complete', {
        demoType: type,
        response: responseText,
        interactionDuration,
        inputValue: message,
        success: true
      });
      setIsActive(false);
    }, 1500);
  };

  const getDemoContent = () => {
    switch(type) {
      case 'chatbot':
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <Bot className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium">
                {language === 'de' ? 'KI-Chatbot Demo' : 'AI Chatbot Demo'}
              </span>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    // Track typing in chatbot demo
                    if (e.target.value.length > 5 && e.target.value.length % 10 === 0) {
                      analytics.trackEvent('demo_input_typing', {
                        demoType: type,
                        inputLength: e.target.value.length
                      });
                    }
                  }}
                  onFocus={() => {
                    analytics.trackEvent('demo_input_focus', {
                      demoType: type
                    });
                  }}
                  placeholder={language === 'de' ? 'Nachricht eingeben...' : 'Type a message...'}
                  className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 rounded-lg text-sm border border-gray-200 dark:border-gray-600"
                />
                <button
                  onClick={handleInteraction}
                  disabled={isActive}
                  className="p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              {response && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-sm"
                >
                  {response}
                </motion.div>
              )}
            </div>
          </div>
        );

      case 'booking':
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-medium">
                {language === 'de' ? 'Buchungssystem Demo' : 'Booking System Demo'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {['10:00', '14:00', '16:00'].map((time) => (
                <button
                  key={time}
                  onClick={handleInteraction}
                  disabled={isActive}
                  className="p-2 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {time}
                </button>
              ))}
            </div>
            {response && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-sm flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4 text-green-500" />
                {response}
              </motion.div>
            )}
          </div>
        );

      case 'document':
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium">
                {language === 'de' ? 'Dokumentenanalyse Demo' : 'Document Analysis Demo'}
              </span>
            </div>
            <button
              onClick={handleInteraction}
              disabled={isActive}
              className="w-full p-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors disabled:opacity-50"
            >
              <div className="flex items-center justify-center gap-2">
                {isActive ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Zap className="w-4 h-4" />
                    </motion.div>
                    <span className="text-sm">
                      {language === 'de' ? 'Analysiere...' : 'Analyzing...'}
                    </span>
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    <span className="text-sm">
                      {language === 'de' ? 'Dokument analysieren' : 'Analyze Document'}
                    </span>
                  </>
                )}
              </div>
            </button>
            {response && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm"
              >
                {response}
              </motion.div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="px-2 py-1 bg-green-500/20 text-green-600 dark:text-green-400 text-xs rounded-full font-medium">
          {language === 'de' ? 'Interaktive Demo' : 'Interactive Demo'}
        </span>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          <span>{language === 'de' ? 'Live testen' : 'Try it live'}</span>
        </div>
      </div>
      {getDemoContent()}
    </motion.div>
  );
};

interface QuickStatsProps {
  stats: {
    value: string;
    label: string;
    icon: React.ElementType;
  }[];
}

export const QuickStats: React.FC<QuickStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-3 gap-3 mt-6">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-3 rounded-lg text-center"
          >
            <IconComponent className="w-5 h-5 text-purple-600 dark:text-purple-400 mx-auto mb-1" />
            <div className="text-lg font-bold text-gray-900 dark:text-white">{stat.value}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">{stat.label}</div>
          </motion.div>
        );
      })}
    </div>
  );
};