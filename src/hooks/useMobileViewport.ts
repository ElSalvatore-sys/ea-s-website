import { useState, useEffect } from 'react';
import { useWindowSize, useDebounce } from 'react-use';

interface MobileViewport {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouch: boolean;
  viewportWidth: number;
  viewportHeight: number;
  orientation: 'portrait' | 'landscape';
  deviceType: 'mobile' | 'tablet' | 'desktop';
  isSmallScreen: boolean;
  isMediumScreen: boolean;
  isLargeScreen: boolean;
}

export const useMobileViewport = (): MobileViewport => {
  const { width = 0, height = 0 } = useWindowSize();
  const debouncedWidth = useDebounce(width, 100);
  const debouncedHeight = useDebounce(height, 100);

  const [viewport, setViewport] = useState<MobileViewport>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isTouch: false,
    viewportWidth: 0,
    viewportHeight: 0,
    orientation: 'portrait',
    deviceType: 'desktop',
    isSmallScreen: false,
    isMediumScreen: false,
    isLargeScreen: false
  });

  useEffect(() => {
    const updateViewport = () => {
      const vw = debouncedWidth || window.innerWidth;
      const vh = debouncedHeight || window.innerHeight;

      // Device detection based on viewport width
      const mobile = vw < 768;
      const tablet = vw >= 768 && vw < 1024;
      const desktop = vw >= 1024;

      // Touch detection
      const hasTouch = 'ontouchstart' in window ||
                      navigator.maxTouchPoints > 0 ||
                      window.matchMedia('(hover: none)').matches;

      // Orientation
      const orientation = vw > vh ? 'landscape' : 'portrait';

      // Device type
      let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';
      if (mobile) deviceType = 'mobile';
      else if (tablet) deviceType = 'tablet';

      // Screen size breakpoints
      const small = vw < 640;
      const medium = vw >= 640 && vw < 1024;
      const large = vw >= 1024;

      setViewport({
        isMobile: mobile,
        isTablet: tablet,
        isDesktop: desktop,
        isTouch: hasTouch,
        viewportWidth: vw,
        viewportHeight: vh,
        orientation,
        deviceType,
        isSmallScreen: small,
        isMediumScreen: medium,
        isLargeScreen: large
      });
    };

    updateViewport();

    // Add resize listener
    const handleResize = () => updateViewport();
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [debouncedWidth, debouncedHeight]);

  return viewport;
};

export default useMobileViewport;