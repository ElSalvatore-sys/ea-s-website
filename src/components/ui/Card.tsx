import React from 'react';
import { clsx } from 'clsx';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
  glass?: boolean;
  badge?: string;
  badgeColor?: 'red' | 'green' | 'blue' | 'yellow' | 'purple';
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  hover = true,
  gradient = false,
  glass = false,
  badge,
  badgeColor = 'red'
}) => {
  const badgeColors = {
    red: 'bg-red-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500'
  };

  return (
    <div
      className={clsx(
        'relative rounded-2xl overflow-hidden',
        hover && 'transition-all duration-300 hover:shadow-2xl hover:-translate-y-2',
        gradient && 'bg-gradient-to-br from-gray-900 to-gray-800',
        glass && 'bg-white/10 backdrop-blur-xl border border-white/20',
        !gradient && !glass && 'bg-white dark:bg-gray-800 shadow-lg',
        className
      )}
    >
      {badge && (
        <div className={clsx(
          'absolute top-4 right-4 z-10 text-white px-3 py-1 rounded-full text-xs font-bold',
          badgeColors[badgeColor]
        )}>
          {badge}
        </div>
      )}
      {children}
    </div>
  );
};

// Named exports for sub-components
export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={clsx('p-6 pb-0', className)}>{children}</div>
);

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <h3 className={clsx('text-2xl font-semibold text-gray-900 dark:text-white', className)}>{children}</h3>
);

export const CardDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <p className={clsx('text-gray-600 dark:text-gray-400 mt-1', className)}>{children}</p>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={clsx('p-6', className)}>{children}</div>
);

// Export Card as both default and named export
export { Card };
export default Card;