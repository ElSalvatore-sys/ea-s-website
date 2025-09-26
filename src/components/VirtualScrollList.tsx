import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

interface VirtualScrollListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
  className?: string;
  onScroll?: (scrollTop: number) => void;
}

/**
 * High-performance virtual scrolling component optimized for mobile
 * Renders only visible items to maintain 60fps on low-end devices
 */
export function VirtualScrollList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 3,
  className = '',
  onScroll
}: VirtualScrollListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  // Calculate visible range with overscan for smooth scrolling
  const visibleRange = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight),
      items.length - 1
    );

    return {
      start: Math.max(0, startIndex - overscan),
      end: Math.min(items.length - 1, endIndex + overscan)
    };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);

  // Get visible items for rendering
  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end + 1);
  }, [items, visibleRange]);

  // Optimized scroll handler with debouncing
  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const newScrollTop = event.currentTarget.scrollTop;
    
    // Use RAF for smooth updates on mobile
    requestAnimationFrame(() => {
      setScrollTop(newScrollTop);
      onScroll?.(newScrollTop);
    });

    // Track scrolling state for performance optimizations
    isScrolling.current = true;
    
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    scrollTimeoutRef.current = setTimeout(() => {
      isScrolling.current = false;
    }, 150);
  }, [onScroll]);

  // Touch optimization - prevent momentum scrolling issues on iOS
  const touchStartY = useRef(0);
  
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    // Prevent overscroll bounce on iOS for better performance
    const container = containerRef.current;
    if (!container) return;

    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - touchStartY.current;

    if ((scrollTop === 0 && deltaY > 0) || 
        (scrollTop + clientHeight >= scrollHeight && deltaY < 0)) {
      e.preventDefault();
    }
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const totalHeight = items.length * itemHeight;
  const offsetY = visibleRange.start * itemHeight;

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      {/* Total height spacer */}
      <div style={{ height: totalHeight, position: 'relative' }}>
        {/* Visible items container */}
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div
              key={visibleRange.start + index}
              style={{ height: itemHeight }}
              className="flex-shrink-0"
            >
              {renderItem(item, visibleRange.start + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Hook for managing virtual scroll with intersection observer
export function useVirtualScroll<T>(
  items: T[],
  containerRef: React.RefObject<HTMLElement>
) {
  const [visibleItems, setVisibleItems] = useState<T[]>([]);
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Load more items when reaching bottom
            setIsAtBottom(true);
          } else {
            setIsAtBottom(false);
          }
        });
      },
      { threshold: 0.1 }
    );

    // Create sentinel element at bottom
    const sentinel = document.createElement('div');
    sentinel.style.height = '1px';
    container.appendChild(sentinel);
    observer.observe(sentinel);

    return () => {
      observer.disconnect();
      if (container.contains(sentinel)) {
        container.removeChild(sentinel);
      }
    };
  }, [containerRef]);

  return { visibleItems, isAtBottom };
}

export default VirtualScrollList;