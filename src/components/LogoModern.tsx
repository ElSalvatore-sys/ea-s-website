import React from 'react';

interface LogoModernProps {
  className?: string;
  showText?: boolean;
  variant?: 'default' | 'white' | 'dark';
}

const LogoModern: React.FC<LogoModernProps> = ({ 
  className = "h-10 w-10", 
  showText = false,
  variant = 'default' 
}) => {
  const getColors = () => {
    switch(variant) {
      case 'white':
        return {
          primary: '#ffffff',
          secondary: '#ffffff',
          text: '#ffffff'
        };
      case 'dark':
        return {
          primary: '#1F2937',
          secondary: '#6366F1',
          text: '#1F2937'
        };
      default:
        return {
          primary: '#3B82F6',
          secondary: '#F97316',
          text: 'currentColor'
        };
    }
  };

  const colors = getColors();

  return (
    <div className="flex items-center space-x-3">
      <svg
        className={className}
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Hexagon Container - Tech/Modern feel */}
        <path
          d="M 30 5 L 50 17.5 L 50 42.5 L 30 55 L 10 42.5 L 10 17.5 Z"
          stroke={colors.primary}
          strokeWidth="2"
          fill="none"
          opacity="0.3"
        />
        
        {/* EA Monogram - Interconnected design */}
        <g>
          {/* E - Stylized with three horizontal bars */}
          <rect x="18" y="20" width="12" height="2" fill={colors.primary} />
          <rect x="18" y="29" width="10" height="2" fill={colors.primary} />
          <rect x="18" y="38" width="12" height="2" fill={colors.primary} />
          <rect x="18" y="20" width="2" height="20" fill={colors.primary} />
          
          {/* A - Modern angular design */}
          <path
            d="M 32 40 L 38 20 L 44 40 M 34 32 L 42 32"
            stroke={colors.secondary}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>
        
        {/* Tech dots - representing AI nodes */}
        <circle cx="30" cy="30" r="1.5" fill="#8B5CF6" />
        <circle cx="25" cy="25" r="1" fill={colors.primary} opacity="0.5" />
        <circle cx="35" cy="35" r="1" fill={colors.secondary} opacity="0.5" />
      </svg>
      
      {showText && (
        <div className="flex flex-col">
          <span className="text-2xl font-light tracking-tight" style={{ color: colors.text }}>
            EA
          </span>
          <span className="text-xs font-light tracking-[0.3em] uppercase opacity-70" style={{ color: colors.text }}>
            Solutions
          </span>
        </div>
      )}
    </div>
  );
};

export default LogoModern;