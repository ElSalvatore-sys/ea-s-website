import React, { useState, useRef, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * High-performance image component with WebP support and lazy loading
 * Automatically serves WebP when supported, falls back to original format
 * Includes intersection observer for lazy loading on mobile
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  sizes = '100vw',
  priority = false,
  placeholder = 'empty',
  blurDataURL,
  onLoad,
  onError
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const [supportsWebP, setSupportsWebP] = useState<boolean | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);

  // Check WebP support
  useEffect(() => {
    const checkWebPSupport = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      const webpSupported = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
      setSupportsWebP(webpSupported);
    };

    checkWebPSupport();
  }, []);

  // Intersection observer for lazy loading
  useEffect(() => {
    if (priority || typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // Load 50px before image comes into view
        threshold: 0.01
      }
    );

    if (placeholderRef.current) {
      observer.observe(placeholderRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  // Generate optimized source URLs
  const getOptimizedSrc = (originalSrc: string, format?: 'webp' | 'avif') => {
    // In a real implementation, you'd have an image optimization service
    // For now, we'll assume WebP versions exist alongside original images
    if (format === 'webp' && supportsWebP) {
      const webpSrc = originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      return webpSrc;
    }
    return originalSrc;
  };

  // Generate responsive srcSet
  const generateSrcSet = (baseSrc: string, format?: 'webp') => {
    if (!width || !height) return undefined;
    
    const widths = [320, 640, 768, 1024, 1280, 1920];
    const applicableWidths = widths.filter(w => w <= width);
    
    if (applicableWidths.length === 0) applicableWidths.push(width);
    
    return applicableWidths
      .map(w => {
        const optimizedSrc = getOptimizedSrc(baseSrc, format);
        return `${optimizedSrc}?w=${w} ${w}w`;
      })
      .join(', ');
  };

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Blur placeholder using CSS
  const blurStyle = placeholder === 'blur' && blurDataURL ? {
    backgroundImage: `url(${blurDataURL})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'blur(10px)',
    transform: 'scale(1.1)' // Prevent blur edges
  } : {};

  if (!isInView) {
    return (
      <div
        ref={placeholderRef}
        className={`bg-gray-200 ${className}`}
        style={{ 
          width: width || 'auto', 
          height: height || 'auto',
          aspectRatio: width && height ? `${width}/${height}` : undefined,
          ...blurStyle
        }}
        aria-label={`Loading ${alt}`}
      >
        {placeholder === 'blur' && blurDataURL && (
          <div className="w-full h-full animate-pulse bg-gray-300 opacity-50" />
        )}
      </div>
    );
  }

  if (hasError) {
    return (
      <div 
        className={`bg-gray-300 flex items-center justify-center text-gray-500 text-sm ${className}`}
        style={{ width: width || 'auto', height: height || 'auto' }}
      >
        Failed to load image
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Blur placeholder */}
      {placeholder === 'blur' && blurDataURL && !isLoaded && (
        <div
          className="absolute inset-0"
          style={blurStyle}
        />
      )}
      
      {/* Loading shimmer */}
      {!isLoaded && placeholder === 'empty' && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" 
             style={{
               backgroundSize: '200% 100%',
               animation: 'shimmer 1.5s infinite'
             }} />
      )}

      {supportsWebP !== null && (
        <picture>
          {/* WebP source for modern browsers */}
          {supportsWebP && (
            <source
              srcSet={generateSrcSet(src, 'webp')}
              sizes={sizes}
              type="image/webp"
            />
          )}
          
          {/* Fallback source */}
          <img
            ref={imgRef}
            src={getOptimizedSrc(src)}
            srcSet={generateSrcSet(src)}
            sizes={sizes}
            alt={alt}
            width={width}
            height={height}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            onLoad={handleLoad}
            onError={handleError}
            className={`transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            } ${className}`}
            style={{
              objectFit: 'cover',
              width: '100%',
              height: '100%'
            }}
          />
        </picture>
      )}

      {/* Loading indicator */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}

// Hook for preloading critical images
export function useImagePreload(src: string, priority: boolean = false) {
  useEffect(() => {
    if (!priority || typeof window === 'undefined') return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);

    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, [src, priority]);
}

// Component for hero images with immediate loading
export function HeroImage(props: OptimizedImageProps) {
  useImagePreload(props.src, true);
  
  return (
    <OptimizedImage
      {...props}
      priority={true}
      className={`${props.className || ''} hero-image`}
    />
  );
}

export default OptimizedImage;