import React from 'react';
import Logo from '../components/Logo';
import LogoMinimal from '../components/LogoMinimal';
import LogoModern from '../components/LogoModern';
import LogoAbstract from '../components/LogoAbstract';
import LogoCircular from '../components/LogoCircular';

const LogoShowcase: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-light text-center mb-12 text-gray-900 dark:text-white">
          Logo Design Options
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Logo 1: Original Complex */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
            <h3 className="text-lg font-medium mb-6 text-gray-900 dark:text-white">
              Option 1: Complex Symbol
            </h3>
            <div className="flex justify-center mb-6">
              <Logo className="h-24 w-24" />
            </div>
            <div className="flex justify-center mb-4">
              <Logo showText={true} className="h-12 w-12" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Detailed design with Smart Living house and Gastronomy symbols
            </p>
          </div>

          {/* Logo 2: Minimal EA */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border-2 border-blue-500">
            <h3 className="text-lg font-medium mb-6 text-gray-900 dark:text-white">
              Option 2: Minimal EA (Current)
            </h3>
            <div className="flex justify-center mb-6">
              <LogoMinimal className="h-24 w-24" />
            </div>
            <div className="flex justify-center mb-4">
              <LogoMinimal showText={true} className="h-12 w-12" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Clean geometric E and A letters with connecting dot
            </p>
          </div>

          {/* Logo 3: Modern Hexagon */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
            <h3 className="text-lg font-medium mb-6 text-gray-900 dark:text-white">
              Option 3: Modern Hexagon
            </h3>
            <div className="flex justify-center mb-6">
              <LogoModern className="h-24 w-24" />
            </div>
            <div className="flex justify-center mb-4">
              <LogoModern showText={true} className="h-12 w-12" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Tech-inspired hexagon container with stylized EA
            </p>
          </div>

          {/* Logo 4: Abstract Growth */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
            <h3 className="text-lg font-medium mb-6 text-gray-900 dark:text-white">
              Option 4: Abstract Growth
            </h3>
            <div className="flex justify-center mb-6">
              <LogoAbstract className="h-24 w-24" />
            </div>
            <div className="flex justify-center mb-4">
              <LogoAbstract showText={true} className="h-12 w-12" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Ascending bars representing growth and innovation
            </p>
          </div>

          {/* Logo 5: Circular Orbit */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
            <h3 className="text-lg font-medium mb-6 text-gray-900 dark:text-white">
              Option 5: Circular Orbit
            </h3>
            <div className="flex justify-center mb-6">
              <LogoCircular className="h-24 w-24" />
            </div>
            <div className="flex justify-center mb-4">
              <LogoCircular showText={true} className="h-12 w-12" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Circular design with orbital dots representing solutions
            </p>
          </div>
        </div>

        {/* Test different backgrounds */}
        <div className="mt-16">
          <h2 className="text-2xl font-light text-center mb-8 text-gray-900 dark:text-white">
            Logo on Different Backgrounds
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-8 rounded-lg">
              <LogoMinimal showText={true} className="h-10 w-10" />
            </div>
            <div className="bg-gray-900 p-8 rounded-lg">
              <LogoMinimal showText={true} variant="white" className="h-10 w-10" />
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 rounded-lg">
              <LogoMinimal showText={true} variant="white" className="h-10 w-10" />
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            To change the logo, update the import in Header.tsx to use your preferred LogoComponent
          </p>
        </div>
      </div>
    </div>
  );
};

export default LogoShowcase;