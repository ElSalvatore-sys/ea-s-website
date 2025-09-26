import React from 'react';
import { clsx } from 'clsx';

export interface SectionProps {
  children: React.ReactNode;
  className?: string;
  background?: 'white' | 'gray' | 'gradient' | 'dark';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  container?: boolean;
}

const Section: React.FC<SectionProps> = ({
  children,
  className,
  background = 'white',
  padding = 'lg',
  container = true
}) => {
  const backgrounds = {
    white: 'bg-white dark:bg-gray-900',
    gray: 'bg-gray-50 dark:bg-gray-800',
    gradient: 'bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800',
    dark: 'bg-gray-900 dark:bg-gray-950 text-white'
  };

  const paddings = {
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-20',
    xl: 'py-32'
  };

  return (
    <section className={clsx(
      backgrounds[background],
      paddings[padding],
      'transition-colors duration-300',
      className
    )}>
      {container ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      ) : (
        children
      )}
    </section>
  );
};

export default Section;