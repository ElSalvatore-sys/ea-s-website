import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { motion } from 'framer-motion';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  priority?: boolean;
  animate?: boolean;
  placeholder?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  animate = false,
  placeholder
}) => {
  // Generate placeholder URL if not provided
  const placeholderSrc = placeholder || `${src}?w=50&blur=10`;
  
  // If priority, load immediately without lazy loading
  if (priority) {
    return animate ? (
      <motion.img
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        src={src}
        alt={alt}
        className={className}
        width={width}
        height={height}
        loading="eager"
      />
    ) : (
      <img
        src={src}
        alt={alt}
        className={className}
        width={width}
        height={height}
        loading="eager"
      />
    );
  }

  // Lazy load with blur effect
  const imageElement = (
    <LazyLoadImage
      src={src}
      alt={alt}
      effect="blur"
      className={className}
      width={width}
      height={height}
      placeholderSrc={placeholderSrc}
      threshold={100}
    />
  );

  // Add animation wrapper if requested
  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        {imageElement}
      </motion.div>
    );
  }

  return imageElement;
};

export default LazyImage;