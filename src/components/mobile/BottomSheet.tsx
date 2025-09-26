import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, PanInfo, useAnimation } from 'framer-motion';
import { X } from 'lucide-react';
import { useSpring, animated } from 'react-spring';
import { useDrag } from '@use-gesture/react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  snapPoints?: number[]; // Percentage heights (e.g., [25, 50, 90])
  initialSnap?: number;
  showHandle?: boolean;
  closeOnOverlayClick?: boolean;
  closeThreshold?: number; // Percentage of height to trigger close
  className?: string;
}

const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  children,
  title,
  snapPoints = [90],
  initialSnap = 0,
  showHandle = true,
  closeOnOverlayClick = true,
  closeThreshold = 20,
  className = ''
}) => {
  const [currentSnapIndex, setCurrentSnapIndex] = useState(initialSnap);
  const sheetRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Get viewport height for calculations
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
  const currentSnapHeight = (snapPoints[currentSnapIndex] / 100) * viewportHeight;

  // Spring animation for smooth dragging
  const [{ y }, api] = useSpring(() => ({
    y: viewportHeight,
    config: { tension: 300, friction: 30 }
  }));

  // Handle drag gestures
  const bind = useDrag(
    ({ down, movement: [, my], velocity: [, vy], direction: [, dy], cancel }) => {
      // If dragging up past the top snap point, add resistance
      if (my < -currentSnapHeight) {
        cancel();
        return;
      }

      // While dragging
      if (down) {
        api.start({ y: my, immediate: true });
      } else {
        // After release, determine action based on velocity and position
        const dragPercentage = (my / viewportHeight) * 100;

        // Close if dragged down past threshold
        if (dragPercentage > closeThreshold || vy > 0.5) {
          api.start({ y: viewportHeight });
          setTimeout(onClose, 300);
          return;
        }

        // Snap to nearest point
        let targetSnapIndex = currentSnapIndex;
        let minDistance = Infinity;

        snapPoints.forEach((point, index) => {
          const snapY = ((100 - point) / 100) * viewportHeight;
          const distance = Math.abs(my - snapY);
          if (distance < minDistance) {
            minDistance = distance;
            targetSnapIndex = index;
          }
        });

        setCurrentSnapIndex(targetSnapIndex);
        const targetY = ((100 - snapPoints[targetSnapIndex]) / 100) * viewportHeight;
        api.start({ y: targetY });
      }
    },
    {
      from: () => [0, y.get()],
      filterTaps: true,
      bounds: { top: -currentSnapHeight, bottom: viewportHeight },
      rubberband: true
    }
  );

  // Open/close animations
  useEffect(() => {
    if (isOpen) {
      const targetY = ((100 - snapPoints[initialSnap]) / 100) * viewportHeight;
      api.start({ y: targetY });
    } else {
      api.start({ y: viewportHeight });
    }
  }, [isOpen, api, snapPoints, initialSnap, viewportHeight]);

  // Prevent body scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 z-[9998]"
            onClick={closeOnOverlayClick ? onClose : undefined}
          />

          {/* Bottom Sheet */}
          <animated.div
            ref={sheetRef}
            {...bind()}
            style={{
              transform: y.to((y) => `translateY(${y}px)`),
              touchAction: 'none'
            }}
            className={`
              fixed left-0 right-0 bottom-0 z-[9999]
              bg-white dark:bg-gray-900
              rounded-t-3xl shadow-2xl
              max-h-[95vh]
              ${className}
            `}
          >
            {/* Handle */}
            {showHandle && (
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
              </div>
            )}

            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {title}
                </h3>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            )}

            {/* Content */}
            <div
              ref={contentRef}
              className="overflow-y-auto overscroll-contain"
              style={{
                maxHeight: `${currentSnapHeight - 100}px`,
                WebkitOverflowScrolling: 'touch'
              }}
            >
              <div className="px-6 py-4">
                {children}
              </div>
            </div>
          </animated.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BottomSheet;