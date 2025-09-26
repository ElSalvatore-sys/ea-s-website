import React, { lazy, Suspense } from 'react';
import useMobileViewport from '../hooks/useMobileViewport';
import { Loader } from 'lucide-react';

// Lazy load components for code splitting
const BookingWidget = lazy(() => import('./BookingWidgetEnhanced'));
const MobileBookingWidget = lazy(() => import('./mobile/MobileBookingWidget'));

interface BookingWidgetWrapperProps {
  businessId?: string;
  serviceId?: string;
  onClose?: () => void;
  isOpen?: boolean;
  forceMobile?: boolean; // For testing
}

const BookingWidgetWrapper: React.FC<BookingWidgetWrapperProps> = ({
  businessId,
  serviceId,
  onClose = () => {},
  isOpen = true,
  forceMobile = false
}) => {
  const viewport = useMobileViewport();

  // Determine which widget to use
  const useMobileWidget = forceMobile || viewport.isMobile || (viewport.isTablet && viewport.isTouch);

  // Loading fallback
  const LoadingFallback = () => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-2xl">
        <Loader className="w-8 h-8 animate-spin text-purple-500 mx-auto" />
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading booking system...</p>
      </div>
    </div>
  );

  return (
    <Suspense fallback={<LoadingFallback />}>
      {useMobileWidget ? (
        <MobileBookingWidget
          businessId={businessId}
          serviceId={serviceId}
          isOpen={isOpen}
          onClose={onClose}
        />
      ) : (
        <BookingWidget
          businessId={businessId}
          serviceId={serviceId}
          onClose={onClose}
        />
      )}
    </Suspense>
  );
};

export default BookingWidgetWrapper;