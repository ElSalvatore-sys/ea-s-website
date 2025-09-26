import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="text-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-pulse"></div>
          <div className="w-20 h-20 border-4 border-blue-600 rounded-full animate-spin absolute top-0 left-0 border-t-transparent"></div>
        </div>
        <p className="mt-6 text-white text-lg font-semibold animate-pulse">
          Loading EA-S Solutions...
        </p>
      </div>
    </div>
  );
};

export default Loading;