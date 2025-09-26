import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  variant?: 'default' | 'white' | 'gradient';
}

const Logo: React.FC<LogoProps> = ({ 
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
      case 'gradient':
        return {
          primary: 'url(#gradient)',
          secondary: 'url(#gradient2)',
          text: 'currentColor'
        };
      default:
        return {
          primary: '#3B82F6', // Blue for Smart Living
          secondary: '#F97316', // Orange for Gastronomy
          text: 'currentColor'
        };
    }
  };

  const colors = getColors();

  return (
    <div className="flex items-center space-x-3">
      <svg
        className={className}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#3B82F6', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#F97316', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="gradient2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#8B5CF6', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#EC4899', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        
        {/* Outer Ring - Represents Unity/Complete Solutions */}
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke={colors.primary}
          strokeWidth="2"
          fill="none"
          opacity="0.3"
        />
        
        {/* Smart Living Symbol (Left) - House/Tech */}
        <g transform="t(20, 35)">
          {/* House Shape */}
          <path
            d="M 15 15 L 5 25 L 5 35 L 25 35 L 25 25 L 15 15 Z"
            fill={colors.primary}
            opacity="0.9"
          />
          {/* Tech Dot (Smart) */}
          <circle
            cx="15"
            cy="27"
            r="3"
            fill="white"
          />
        </g>
        
        {/* Gastronomy Symbol (Right) - Fork/Plate */}
        <g transform="t(55, 35)">
          {/* Plate */}
          <circle
            cx="10"
            cy="25"
            r="10"
            fill={colors.secondary}
            opacity="0.9"
          />
          {/* Fork/Utensil simplified */}
          <rect
            x="8"
            y="18"
            width="4"
            height="14"
            fill="white"
            rx="1"
          />
        </g>
        
        {/* Center Connection - AI Brain/Network */}
        <g transform="t(50, 50)">
          {/* Central Node */}
          <circle
            cx="0"
            cy="0"
            r="8"
            fill={variant === 'gradient' ? colors.secondary : '#8B5CF6'}
            opacity="0.8"
          />
          {/* Neural Connections */}
          <circle cx="0" cy="0" r="3" fill="white" />
          
          {/* Connection Lines */}
          <line
            x1="-8"
            y1="0"
            x2="-25"
            y2="-8"
            stroke={colors.primary}
            strokeWidth="1.5"
            opacity="0.4"
          />
          <line
            x1="8"
            y1="0"
            x2="25"
            y2="-8"
            stroke={colors.secondary}
            strokeWidth="1.5"
            opacity="0.4"
          />
        </g>
        
        {/* Bottom Arc - Foundation */}
        <path
          d="M 20 75 Q 50 85 80 75"
          stroke={colors.primary}
          strokeWidth="2"
          fill="none"
          opacity="0.5"
        />
      </svg>
      
      {showText && (
        <div className="flex flex-col">
          <span className="text-2xl font-light tracking-wide" style={{ color: colors.text }}>
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

export default Logo;