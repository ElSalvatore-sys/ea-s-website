import React from 'react';

interface LogoAbstractProps {
  className?: string;
  showText?: boolean;
  variant?: 'default' | 'white' | 'dark';
}

const LogoAbstract: React.FC<LogoAbstractProps> = ({ 
  className = "h-10 w-10", 
  showText = false,
  variant = 'default' 
}) => {
  const getColors = () => {
    switch(variant) {
      case 'white':
        return {
          gradient1: '#ffffff',
          gradient2: '#ffffff',
          text: '#ffffff'
        };
      case 'dark':
        return {
          gradient1: '#1F2937',
          gradient2: '#4B5563',
          text: '#1F2937'
        };
      default:
        return {
          gradient1: '#3B82F6',
          gradient2: '#F97316',
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
          <linearGradient id="abstractGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: colors.gradient1, stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: colors.gradient2, stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        
        {/* Abstract geometric shapes forming EA */}
        <g>
          {/* Three ascending bars representing growth */}
          <rect x="8" y="28" width="6" height="12" fill={colors.gradient1} opacity="0.7" rx="1" />
          <rect x="17" y="20" width="6" height="20" fill={colors.gradient1} opacity="0.85" rx="1" />
          <rect x="26" y="12" width="6" height="28" fill="url(#abstractGrad)" rx="1" />
          
          {/* Connecting arc - represents unity/connection */}
          <path
            d="M 14 24 Q 24 16 34 24"
            stroke={colors.gradient2}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          
          {/* Innovation dot */}
          <circle cx="36" cy="16" r="3" fill={colors.gradient2} opacity="0.8" />
        </g>
      </svg>
      
      {showText && (
        <div className="flex flex-col">
          <span className="text-2xl font-extralight" style={{ color: colors.text }}>
            EA
          </span>
          <span className="text-xs font-light tracking-[0.2em] opacity-60" style={{ color: colors.text }}>
            SOLUTIONS
          </span>
        </div>
      )}
    </div>
  );
};

export default LogoAbstract;