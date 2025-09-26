import React from 'react';
import { motion } from 'framer-motion';
import { X, Minus, Square, ChevronLeft, ChevronRight, RotateCw, Home, Search, Lock } from 'lucide-react';

interface MacBrowserMockupProps {
  url?: string;
  children?: React.ReactNode;
  imageUrl?: string;
  alt?: string;
  className?: string;
  showAddressBar?: boolean;
}

const MacBrowserMockup: React.FC<MacBrowserMockupProps> = ({
  url = 'klavierschule-glennmiller.de',
  children,
  imageUrl,
  alt = 'Website Preview',
  className = '',
  showAddressBar = true
}) => {
  return (
    <div className={`relative bg-gray-900 rounded-xl shadow-2xl overflow-hidden ${className}`}>
      {/* Mac Window Title Bar */}
      <div className="bg-gradient-to-b from-gray-800 to-gray-850 px-4 py-3 flex items-center justify-between border-b border-gray-700">
        {/* Traffic Lights */}
        <div className="flex items-center gap-2">
          <button className="group w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors flex items-center justify-center">
            <X className="w-2 h-2 text-red-900 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <button className="group w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors flex items-center justify-center">
            <Minus className="w-2 h-2 text-yellow-900 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <button className="group w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors flex items-center justify-center">
            <Square className="w-1.5 h-1.5 text-green-900 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>

        {/* Title */}
        <div className="absolute left-1/2 transform -translate-x-1/2 text-gray-400 text-xs font-medium">
          {alt}
        </div>

        {/* Empty space for balance */}
        <div className="w-16"></div>
      </div>

      {/* Browser Navigation Bar */}
      {showAddressBar && (
        <div className="bg-gray-850 px-4 py-2 flex items-center gap-3 border-b border-gray-700">
          {/* Navigation Buttons */}
          <div className="flex items-center gap-1">
            <button className="p-1 rounded hover:bg-gray-700 transition-colors">
              <ChevronLeft className="w-4 h-4 text-gray-400" />
            </button>
            <button className="p-1 rounded hover:bg-gray-700 transition-colors">
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
            <button className="p-1 rounded hover:bg-gray-700 transition-colors">
              <RotateCw className="w-3.5 h-3.5 text-gray-400" />
            </button>
            <button className="p-1 rounded hover:bg-gray-700 transition-colors">
              <Home className="w-3.5 h-3.5 text-gray-400" />
            </button>
          </div>

          {/* Address Bar */}
          <div className="flex-1 flex items-center gap-2 bg-gray-900 rounded-md px-3 py-1.5">
            <Lock className="w-3 h-3 text-green-500" />
            <span className="text-gray-300 text-sm font-normal select-none">{url}</span>
          </div>

          {/* Search Icon */}
          <button className="p-1 rounded hover:bg-gray-700 transition-colors">
            <Search className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      )}

      {/* Browser Content Area */}
      <div className="relative bg-white overflow-hidden">
        {children ? (
          children
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt={alt}
            className="w-full h-full object-cover object-top"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              // Create a placeholder when image fails to load
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `
                  <div class="flex items-center justify-center h-[400px] bg-gradient-to-br from-gray-100 to-gray-200">
                    <div class="text-center">
                      <div class="mb-4">
                        <svg class="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p class="text-gray-500 font-medium">${alt}</p>
                      <p class="text-gray-400 text-sm mt-1">${url}</p>
                    </div>
                  </div>
                `;
              }
            }}
          />
        ) : (
          // Default placeholder with website preview
          <div className="h-[400px] bg-white overflow-hidden">
            {/* Fake website header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 h-20 flex items-center px-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg"></div>
                <div>
                  <div className="h-3 bg-white/60 rounded w-32 mb-2"></div>
                  <div className="h-2 bg-white/40 rounded w-48"></div>
                </div>
              </div>
              <div className="ml-auto flex gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-2 bg-white/40 rounded w-16"></div>
                ))}
              </div>
            </div>

            {/* Fake website hero */}
            <div className="p-8">
              <div className="max-w-4xl mx-auto">
                <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mb-6"></div>

                <div className="flex gap-4 mb-8">
                  <div className="h-10 bg-purple-600 rounded-lg w-32"></div>
                  <div className="h-10 bg-gray-300 rounded-lg w-32"></div>
                </div>

                {/* Fake content grid */}
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-gray-100 rounded-lg p-4">
                      <div className="h-24 bg-gray-200 rounded mb-3"></div>
                      <div className="h-3 bg-gray-300 rounded w-3/4 mb-2"></div>
                      <div className="h-2 bg-gray-200 rounded w-full"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MacBrowserMockup;