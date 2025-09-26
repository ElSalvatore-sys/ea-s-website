import React from 'react';

interface LogoMinimalProps {
  className?: string;
  showText?: boolean;
  variant?: 'default' | 'white' | 'dark' | 'light';
}

const LogoMinimal: React.FC<LogoMinimalProps> = ({ 
  className = "h-10 w-10", 
  showText = false,
  variant = 'default' 
}) => {
  const getColors = () => {
    switch(variant) {
      case 'white':
        return {
          text: '#ffffff',
          accent: '#ffffff'
        };
      case 'dark':
        return {
          text: '#111827',
          accent: '#6366F1'
        };
      case 'light':
        return {
          text: '#e5e7eb',
          accent: '#818cf8'
        };
      default:
        return {
          text: 'currentColor',
          accent: '#6366F1'
        };
    }
  };

  const colors = getColors();

  return (
    <div className="flex items-center space-x-2">
      <svg
        className={className}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* E Letter - Minimalist geometric design */}
        <g>
          {/* Main E structure */}
          <path
            d="M 12 12 L 12 36 L 28 36 M 12 12 L 28 12 M 12 24 L 24 24"
            stroke={colors.text}
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          
          {/* A Letter integrated */}
          <path
            d="M 28 36 L 36 12 M 32 24 L 36 24"
            stroke={colors.accent}
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          
          {/* Connecting dot - represents AI/Tech */}
          <circle
            cx="24"
            cy="24"
            r="2"
            fill={colors.accent}
          />
        </g>
      </svg>
      
      {showText && (
        <div className="flex flex-col">
          <span className="text-xl font-light tracking-wider" style={{ color: colors.text }}>
            EA Solutions
          </span>
        </div>
      )}
    </div>
  );
};

export default LogoMinimal;