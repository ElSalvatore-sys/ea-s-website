import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Maximize2, Minimize2 } from 'lucide-react';

interface TouchOptimizedDemoProps {
  demos: {
    id: string;
    title: string;
    description: string;
    component: React.ReactNode;
    thumbnail?: string;
    category: string;
  }[];
  initialDemo?: number;
  onDemoChange?: (index: number) => void;
}

/**
 * Touch-optimized demo component with swipe gestures
 * Optimized for mobile performance with 60fps animations
 */
export function TouchOptimizedDemo({ 
  demos, 
  initialDemo = 0, 
  onDemoChange 
}: TouchOptimizedDemoProps) {
  const [currentIndex, setCurrentIndex] = useState(initialDemo);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Swipe threshold for mobile (30% of screen width)
  const swipeThreshold = typeof window !== 'undefined' ? window.innerWidth * 0.3 : 100;

  // Navigate between demos
  const navigateToDemo = useCallback((index: number) => {
    const newIndex = Math.max(0, Math.min(demos.length - 1, index));
    setCurrentIndex(newIndex);
    onDemoChange?.(newIndex);
  }, [demos.length, onDemoChange]);

  // Handle swipe gestures
  const handlePanEnd = useCallback((event: any, info: PanInfo) => {
    const { offset, velocity } = info;
    const swipeDistance = Math.abs(offset.x);
    const swipeVelocity = Math.abs(velocity.x);

    // Determine if swipe was strong enough
    if (swipeDistance > swipeThreshold || swipeVelocity > 500) {
      if (offset.x > 0) {
        // Swipe right - previous demo
        navigateToDemo(currentIndex - 1);
      } else {
        // Swipe left - next demo
        navigateToDemo(currentIndex + 1);
      }
    }
    setIsDragging(false);
  }, [currentIndex, navigateToDemo, swipeThreshold]);

  // Touch event handlers for better mobile experience
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setIsDragging(true);
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const difference = touchStartX - touchEndX;
    const threshold = 50; // Minimum swipe distance

    if (Math.abs(difference) > threshold) {
      if (difference > 0) {
        // Swipe left - next demo
        navigateToDemo(currentIndex + 1);
      } else {
        // Swipe right - previous demo
        navigateToDemo(currentIndex - 1);
      }
    }
    setIsDragging(false);
  }, [touchStartX, currentIndex, navigateToDemo]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        navigateToDemo(currentIndex - 1);
      } else if (e.key === 'ArrowRight') {
        navigateToDemo(currentIndex + 1);
      } else if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, navigateToDemo]);

  const currentDemo = demos[currentIndex];

  return (
    <div 
      ref={containerRef}
      className={`relative ${isFullscreen 
        ? 'fixed inset-0 z-50 bg-gray-900' 
        : 'w-full max-w-6xl mx-auto'
      }`}
    >
      {/* Demo Container */}
      <motion.div
        className="relative bg-gray-800 rounded-xl overflow-hidden shadow-2xl"
        layoutId="demo-container"
        animate={{ 
          scale: isFullscreen ? 1 : 1,
          height: isFullscreen ? '100vh' : 'auto'
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gray-700 border-b border-gray-600">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold text-white">
              {currentDemo?.title}
            </h3>
            <span className="px-2 py-1 text-xs bg-purple-600 text-white rounded-full">
              {currentDemo?.category}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Demo counter */}
            <span className="text-sm text-gray-300">
              {currentIndex + 1} / {demos.length}
            </span>
            
            {/* Fullscreen toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 hover:bg-gray-600 rounded-lg transition-colors touch-manipulation"
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? (
                <Minimize2 className="w-5 h-5 text-gray-300" />
              ) : (
                <Maximize2 className="w-5 h-5 text-gray-300" />
              )}
            </button>
            
            {/* Close button (fullscreen only) */}
            {isFullscreen && (
              <button
                onClick={() => setIsFullscreen(false)}
                className="p-2 hover:bg-gray-600 rounded-lg transition-colors touch-manipulation"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-300" />
              </button>
            )}
          </div>
        </div>

        {/* Demo Content */}
        <motion.div
          className={`relative ${isFullscreen ? 'h-[calc(100vh-80px)]' : 'h-96 md:h-[32rem]'} overflow-hidden`}
          drag={!isFullscreen ? 'x' : false}
          dragConstraints={{ left: 0, right: 0 }}
          onPanEnd={handlePanEnd}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          whileDrag={{ cursor: 'grabbing' }}
        >
          <AnimatePresence mode="wait" custom={currentIndex}>
            <motion.div
              key={currentIndex}
              custom={currentIndex}
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
                opacity: { duration: 0.2 }
              }}
              className="absolute inset-0 flex items-center justify-center p-6"
            >
              {currentDemo?.component}
            </motion.div>
          </AnimatePresence>

          {/* Navigation buttons - desktop only */}
          <div className="hidden md:block">
            {currentIndex > 0 && (
              <button
                onClick={() => navigateToDemo(currentIndex - 1)}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 rounded-full transition-colors backdrop-blur-sm touch-manipulation"
                aria-label="Previous demo"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
            )}
            
            {currentIndex < demos.length - 1 && (
              <button
                onClick={() => navigateToDemo(currentIndex + 1)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 rounded-full transition-colors backdrop-blur-sm touch-manipulation"
                aria-label="Next demo"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            )}
          </div>
        </motion.div>

        {/* Demo Description */}
        <div className="p-4 bg-gray-700 border-t border-gray-600">
          <p className="text-gray-300 text-sm leading-relaxed">
            {currentDemo?.description}
          </p>
        </div>

        {/* Mobile swipe indicator */}
        <div className="flex justify-center py-2 md:hidden">
          <div className="flex space-x-1">
            {demos.map((_, index) => (
              <button
                key={index}
                onClick={() => navigateToDemo(index)}
                className={`w-2 h-2 rounded-full transition-colors touch-manipulation ${
                  index === currentIndex ? 'bg-purple-500' : 'bg-gray-500'
                }`}
                aria-label={`Go to demo ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Demo thumbnails - mobile optimized */}
      <div className="mt-6 overflow-x-auto pb-2">
        <div className="flex space-x-3 px-1">
          {demos.map((demo, index) => (
            <button
              key={demo.id}
              onClick={() => navigateToDemo(index)}
              className={`flex-shrink-0 p-3 rounded-lg transition-all touch-manipulation ${
                index === currentIndex 
                  ? 'bg-purple-600 text-white shadow-lg' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <div className="text-sm font-medium truncate max-w-[120px]">
                {demo.title}
              </div>
              <div className="text-xs opacity-75 mt-1">
                {demo.category}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Swipe hint for mobile users */}
      {!isFullscreen && (
        <div className="mt-4 text-center md:hidden">
          <p className="text-xs text-gray-500">
            👆 Swipe left or right to navigate demos
          </p>
        </div>
      )}
    </div>
  );
}

export default TouchOptimizedDemo;