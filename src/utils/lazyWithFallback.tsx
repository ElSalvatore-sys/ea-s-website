import React, { lazy, Suspense, ComponentType } from 'react';

// Fallback component for failed loads
const LoadError: React.FC<{ error?: Error; retry?: () => void }> = ({ error, retry }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-900">
    <div className="text-center p-8">
      <h2 className="text-2xl font-bold text-white mb-4">
        Failed to load page
      </h2>
      <p className="text-gray-400 mb-6">
        {error?.message || 'Something went wrong while loading this page.'}
      </p>
      {retry && (
        <button
          onClick={retry}
          className="px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  </div>
);

// Enhanced lazy loading with error boundary
export function lazyWithFallback<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>
): React.LazyExoticComponent<T> {
  return lazy(() =>
    factory().catch((error) => {
      console.error('Failed to load component:', error);
      // Return a fallback component
      return {
        default: (() => <LoadError error={error} />) as T,
      };
    })
  );
}

// Alternative: Create a placeholder component for missing pages
export const createPlaceholderComponent = (name: string) => {
  return () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-white mb-4">
          {name} - Coming Soon
        </h2>
        <p className="text-gray-400">
          This page is currently under development.
        </p>
      </div>
    </div>
  );
};