import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, Play, Calculator, Eye, PhoneCall } from 'lucide-react';
import { useLanguage } from '../providers/LanguageProvider';
import { getSmartCTA, CTAContext, CTAAction } from '../utils/smartCTA';
import { analytics } from '../lib/analytics';

interface SmartCTAProps {
  context: CTAContext;
  action?: CTAAction;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  trackingData?: Record<string, any>;
  children?: React.ReactNode;
}

export const SmartCTA: React.FC<SmartCTAProps> = ({
  context,
  action = 'primary',
  variant = 'primary',
  size = 'md',
  className = '',
  trackingData = {},
  children
}) => {
  const { language } = useLanguage();
  const currentLang = language === 'de' ? 'de' : 'en';
  const cta = getSmartCTA(context, action, currentLang);

  // Size classes
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  };

  // Variant classes
  const variantClasses = {
    primary: 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg hover:shadow-purple-500/25',
    secondary: 'bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20',
    ghost: 'bg-transparent text-white hover:bg-white/10'
  };

  const handleClick = () => {
    // Track analytics
    if (cta.analytics) {
      analytics.trackEvent(cta.analytics.eventName, {
        ...cta.analytics.metadata,
        ...trackingData,
        context,
        action,
        ctaText: cta.text[currentLang]
      });
    } else {
      // Default tracking
      analytics.trackEvent('smart_cta_click', {
        context,
        action,
        ctaText: cta.text[currentLang],
        ...trackingData
      });
    }

    // Execute action
    cta.action();
  };

  // Select icon based on context
  const IconComponent = cta.icon || (() => {
    switch (context) {
      case 'booking-hero':
      case 'booking-pricing':
        return Play;
      case 'web-hero':
        return Eye;
      case 'automation-hero':
        return Calculator;
      case 'contact-hero':
        return PhoneCall;
      default:
        return action === 'primary' ? ArrowRight : ChevronRight;
    }
  })();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className={`
        inline-flex items-center justify-center gap-2
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        rounded-full font-semibold
        transition-all duration-300
        transform hover:scale-105
        ${className}
      `}
    >
      {children || cta.text[currentLang]}
      <IconComponent className={`${size === 'sm' ? 'w-4 h-4' : size === 'xl' ? 'w-6 h-6' : 'w-5 h-5'}`} />
    </motion.button>
  );
};

interface SmartCTAGroupProps {
  context: CTAContext;
  className?: string;
  primarySize?: 'sm' | 'md' | 'lg' | 'xl';
  secondarySize?: 'sm' | 'md' | 'lg' | 'xl';
  direction?: 'row' | 'column';
  showTertiary?: boolean;
}

export const SmartCTAGroup: React.FC<SmartCTAGroupProps> = ({
  context,
  className = '',
  primarySize = 'lg',
  secondarySize = 'lg',
  direction = 'row',
  showTertiary = false
}) => {
  const directionClasses = direction === 'row' 
    ? 'flex-row' 
    : 'flex-col';

  return (
    <div className={`flex ${directionClasses} gap-4 ${className}`}>
      <SmartCTA 
        context={context} 
        action="primary" 
        variant="primary"
        size={primarySize}
      />
      <SmartCTA 
        context={context} 
        action="secondary" 
        variant="secondary"
        size={secondarySize}
      />
      {showTertiary && (
        <SmartCTA 
          context={context} 
          action="tertiary" 
          variant="ghost"
          size={secondarySize}
        />
      )}
    </div>
  );
};

export default SmartCTA;