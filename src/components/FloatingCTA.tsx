import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, Calendar, X } from 'lucide-react';
import { clsx } from 'clsx';
import { useLanguage } from '../providers/LanguageProvider';

const FloatingCTA: React.FC = () => {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleWhatsApp = () => {
    const message = encodeURIComponent('Hi! I\'m interested in EA-S AI solutions for my business.');
    window.open(`https://wa.me/4915234567890?text=${message}`, '_blank');
  };

  const handleCall = () => {
    window.location.href = 'tel:+4915234567890';
  };

  const handleBooking = () => {
    const event = new CustomEvent('openBookingModal');
    window.dispatchEvent(event);
    setIsExpanded(false);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Main Floating Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <div className={clsx(
          'transition-all duration-300 transform',
          isExpanded ? 'scale-110' : 'scale-100'
        )}>
          {!isExpanded ? (
            <button
              onClick={() => setIsExpanded(true)}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full p-4 shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 animate-pulse"
              aria-label="Contact options"
            >
              <MessageCircle className="h-6 w-6" />
            </button>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 space-y-3 min-w-[200px]">
              <button
                onClick={() => setIsExpanded(false)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
              
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
                {t('floatingCTA.getStarted')}
              </h3>
              
              <button
                onClick={handleWhatsApp}
                className="w-full flex items-center space-x-3 bg-green-500 text-white rounded-lg px-4 py-3 hover:bg-green-600 transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                <span>{t('floatingCTA.whatsapp')}</span>
              </button>
              
              <button
                onClick={handleCall}
                className="w-full flex items-center space-x-3 bg-blue-500 text-white rounded-lg px-4 py-3 hover:bg-blue-600 transition-colors"
              >
                <Phone className="h-5 w-5" />
                <span>{t('floatingCTA.callNow')}</span>
              </button>
              
              <button
                onClick={handleBooking}
                className="w-full flex items-center space-x-3 bg-purple-500 text-white rounded-lg px-4 py-3 hover:bg-purple-600 transition-colors"
              >
                <Calendar className="h-5 w-5" />
                <span>{t('floatingCTA.bookDemo')}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Header CTA - Mobile Only */}
      <div className="fixed top-0 left-0 right-0 z-30 lg:hidden bg-gradient-to-r from-green-500 to-green-600 text-white p-2 text-center">
        <button
          onClick={handleWhatsApp}
          className="flex items-center justify-center space-x-2 mx-auto"
        >
          <MessageCircle className="h-4 w-4" />
          <span className="text-sm font-semibold">{t('floatingCTA.whatsappHeader')}</span>
        </button>
      </div>
    </>
  );
};

export default FloatingCTA;