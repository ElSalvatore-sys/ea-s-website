import React from 'react';

interface LogoCircularProps {
  className?: string;
  showText?: boolean;
  variant?: 'default' | 'white' | 'dark';
}

const LogoCircular: React.FC<LogoCircularProps> = ({ 
  className = "h-10 w-10", 
  showText = false,
  variant = 'default' 
}) => {
  const getColors = () => {
    switch(variant) {
      case 'white':
        return {
          ring: '#ffffff',
          accent: '#ffffff',
          text: '#ffffff'
        };
      case 'dark':
        return {
          ring: '#1F2937',
          accent: '#6366F1',
          text: '#1F2937'
        };
      default:
        return {
          ring: '#E5E7EB',
          accent: '#6366F1',
          text: 'currentColor'
        };
    }
  };

  const colors = getColors();

  return (
    <div className="flex items-center space-x-3">
      <svg
        className={className}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="circGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#3B82F6', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#8B5CF6', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#F97316', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        
        {/* Outer circle */}
        <circle
          cx="24"
          cy="24"
          r="22"
          stroke={colors.ring}
          strokeWidth="1"
          fill="none"
        />
        
        {/* Inner circle with gradient */}
        <circle
          cx="24"
          cy="24"
          r="20"
          fill="url(#circGrad)"
          opacity="0.1"
        />
        
        {/* EA letters - modern, bold */}
        <g>
          {/* E */}
          <path
            d="M 14 18 L 14 30 L 22 30 M 14 18 L 22 18 M 14 24 L 20 24"
            stroke={variant === 'default' ? '#1F2937' : colors.accent}
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          
          {/* A */}
          <path
            d="M 26 30 L 30 18 L 34 30 M 27.5 26 L 32.5 26"
            stroke={variant === 'default' ? '#1F2937' : colors.accent}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>
        
        {/* Orbit dots - representing solutions */}
        <circle cx="24" cy="6" r="2" fill="#3B82F6" opacity="0.8" />
        <circle cx="42" cy="24" r="2" fill="#F97316" opacity="0.8" />
        <circle cx="24" cy="42" r="2" fill="#8B5CF6" opacity="0.8" />
        <circle cx="6" cy="24" r="2" fill="#10B981" opacity="0.8" />
      </svg>
      
      {showText && (
        <div className="flex flex-col">
          <span className="text-2xl font-medium tracking-tight" style={{ color: colors.text }}>
            EA
          </span>
          <span className="text-xs font-light tracking-widest opacity-70" style={{ color: colors.text }}>
            SOLUTIONS
          </span>
        </div>
      )}
    </div>
  );
};

export default LogoCircular;