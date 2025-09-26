/**
 * withContentValidation HOC
 * Wraps components to provide environment-based content rendering
 */

import React, { ComponentType } from 'react';
import ContentWarning, { ContentWarningBadge } from './ContentWarning';
import { shouldShowContent } from '../utils/contentValidation';

interface ValidationOptions {
  isReady?: boolean;
  warningType?: 'missing_translation' | 'placeholder' | 'not_ready' | 'broken_asset' | 'empty_content';
  warningMessage?: string;
  hideInProduction?: boolean;
  showBadge?: boolean;
  overlayInStaging?: boolean;
}

/**
 * HOC that adds content validation and environment-based rendering
 */
function withContentValidation<P extends object>(
  Component: ComponentType<P>,
  options: ValidationOptions = {}
) {
  const {
    isReady = true,
    warningType = 'not_ready',
    warningMessage,
    hideInProduction = true,
    showBadge = true,
    overlayInStaging = true
  } = options;

  return function WithContentValidationComponent(props: P) {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const isStaging = process.env.REACT_APP_ENV === 'staging';
    const isProduction = process.env.NODE_ENV === 'production' && !isStaging;

    // Check if content should be shown
    const showContent = shouldShowContent(isReady);

    // Don't render in production if not ready and hideInProduction is true
    if (isProduction && !isReady && hideInProduction) {
      return null;
    }

    // Development mode - show with warning
    if (isDevelopment && !isReady) {
      return (
        <div className="relative">
          {showBadge && (
            <div className="absolute top-0 left-0 z-50 p-2">
              <ContentWarningBadge
                type={warningType}
                message={warningMessage || 'This content is not ready for production'}
              />
            </div>
          )}
          <div className="relative">
            <Component {...props} />
          </div>
        </div>
      );
    }

    // Staging mode - show with overlay if not ready
    if (isStaging && !isReady && overlayInStaging) {
      return (
        <div className="relative">
          <div className="absolute inset-0 bg-yellow-500/10 backdrop-blur-[1px] z-40 pointer-events-none rounded-lg">
            <div className="absolute top-2 left-2">
              <ContentWarningBadge
                type={warningType}
                message={warningMessage || 'Content pending review'}
                showInProduction={true}
              />
            </div>
          </div>
          <Component {...props} />
        </div>
      );
    }

    // Default - render normally
    return <Component {...props} />;
  };
}

/**
 * Hook to check if we're in a development environment
 */
export function useContentValidation() {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isStaging = process.env.REACT_APP_ENV === 'staging';
  const isProduction = process.env.NODE_ENV === 'production' && !isStaging;

  return {
    isDevelopment,
    isStaging,
    isProduction,
    shouldShowContent: (isReady: boolean = true) => shouldShowContent(isReady)
  };
}

/**
 * Component wrapper for conditional rendering based on content readiness
 */
export const ValidatedContent: React.FC<{
  isReady?: boolean;
  warningType?: ValidationOptions['warningType'];
  warningMessage?: string;
  hideInProduction?: boolean;
  showBadge?: boolean;
  overlayInStaging?: boolean;
  children: React.ReactNode;
}> = ({
  isReady = true,
  warningType = 'not_ready',
  warningMessage,
  hideInProduction = true,
  showBadge = true,
  overlayInStaging = true,
  children
}) => {
  const { isDevelopment, isStaging, isProduction } = useContentValidation();

  // Don't render in production if not ready
  if (isProduction && !isReady && hideInProduction) {
    return null;
  }

  // Development mode - show with warning
  if (isDevelopment && !isReady) {
    return (
      <div className="relative">
        {showBadge && (
          <div className="absolute top-0 left-0 z-50 p-2">
            <ContentWarningBadge
              type={warningType}
              message={warningMessage || 'This content is not ready for production'}
            />
          </div>
        )}
        <div className="relative">
          {children}
        </div>
      </div>
    );
  }

  // Staging mode - show with overlay
  if (isStaging && !isReady && overlayInStaging) {
    return (
      <div className="relative">
        <div className="absolute inset-0 bg-yellow-500/10 backdrop-blur-[1px] z-40 pointer-events-none rounded-lg">
          <div className="absolute top-2 left-2">
            <ContentWarningBadge
              type={warningType}
              message={warningMessage || 'Content pending review'}
              showInProduction={true}
            />
          </div>
        </div>
        {children}
      </div>
    );
  }

  // Default - render normally
  return <>{children}</>;
};

export default withContentValidation;