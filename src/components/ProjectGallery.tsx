import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2, X, Monitor, Smartphone } from 'lucide-react';

interface ProjectImage {
  url: string;
  alt: string;
  caption?: string;
  device?: 'desktop' | 'mobile';
}

interface ProjectGalleryProps {
  images: ProjectImage[];
  projectName: string;
}

const ProjectGallery: React.FC<ProjectGalleryProps> = ({ images, projectName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const currentImage = images[currentIndex];

  // Generate placeholder image URL with project-specific styling
  const getPlaceholderUrl = (image: ProjectImage) => {
    const width = image.device === 'mobile' ? 375 : 1440;
    const height = image.device === 'mobile' ? 812 : 900;
    const bgColor = '1a1a2e';
    const textColor = 'ffffff';
    const text = encodeURIComponent(image.alt || projectName);
    
    return `https://via.placeholder.com/${width}x${height}/${bgColor}/${textColor}?text=${text}`;
  };

  return (
    <div className="space-y-6">
      {/* Main Image Display */}
      <div className="relative group">
        {/* Device Frame */}
        <div className={`relative ${currentImage.device === 'mobile' ? 'max-w-sm mx-auto' : ''}`}>
          {currentImage.device === 'mobile' ? (
            // Mobile Frame
            <div className="relative mx-auto" style={{ maxWidth: '375px' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-[3rem] shadow-2xl" />
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-1/3 h-5 bg-black rounded-full" />
              <div className="relative p-2 pt-8">
                <div className="bg-black rounded-[2.5rem] p-2 shadow-inner">
                  <motion.img
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    src={currentImage.url || getPlaceholderUrl(currentImage)}
                    alt={currentImage.alt}
                    className="w-full rounded-[2rem]"
                    onError={(e) => {
                      e.currentTarget.src = getPlaceholderUrl(currentImage);
                    }}
                  />
                </div>
              </div>
              <Smartphone className="absolute top-2 right-2 w-4 h-4 text-gray-500" />
            </div>
          ) : (
            // Desktop Frame
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-t-lg" />
              <div className="bg-gray-800 rounded-t-lg p-2 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                </div>
                <div className="flex-1 bg-gray-700 rounded px-3 py-1 text-xs text-gray-400 truncate">
                  {projectName}.de
                </div>
                <Monitor className="w-4 h-4 text-gray-500" />
              </div>
              <div className="bg-black rounded-b-lg overflow-hidden">
                <motion.img
                  key={currentIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  src={currentImage.url || getPlaceholderUrl(currentImage)}
                  alt={currentImage.alt}
                  className="w-full"
                  onError={(e) => {
                    e.currentTarget.src = getPlaceholderUrl(currentImage);
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Fullscreen Button */}
        <button
          onClick={() => setIsFullscreen(true)}
          className="absolute top-2 right-2 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Image Caption */}
        {currentImage.caption && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <p className="text-white text-sm">{currentImage.caption}</p>
          </div>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentIndex(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentIndex
                  ? 'border-purple-500 shadow-lg shadow-purple-500/25'
                  : 'border-white/10 hover:border-white/30'
              }`}
            >
              <img
                src={image.url || getPlaceholderUrl(image)}
                alt={image.alt}
                className="w-24 h-16 object-cover"
                onError={(e) => {
                  e.currentTarget.src = getPlaceholderUrl(image);
                }}
              />
              {index === currentIndex && (
                <motion.div
                  layoutId="thumbnail-indicator"
                  className="absolute inset-0 bg-purple-600/20"
                />
              )}
            </motion.button>
          ))}
        </div>
      )}

      {/* Image Counter */}
      {images.length > 1 && (
        <div className="flex justify-center gap-1">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-purple-500 w-8'
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      )}

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setIsFullscreen(false)}
          >
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              src={currentImage.url || getPlaceholderUrl(currentImage)}
              alt={currentImage.alt}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
              onError={(e) => {
                e.currentTarget.src = getPlaceholderUrl(currentImage);
              }}
            />

            {/* Fullscreen Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectGallery;