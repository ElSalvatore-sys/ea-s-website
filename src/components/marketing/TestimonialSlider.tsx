import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { useLanguage } from '../../providers/LanguageProvider';

interface Testimonial {
  id: string;
  name: string;
  business: string;
  role: string;
  content: string;
  rating: number;
  imageUrl?: string;
  beforeMetric?: string;
  afterMetric?: string;
}

const TestimonialSlider: React.FC = () => {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials: Testimonial[] = [
    {
      id: 'hotel-kochbrunnen',
      name: 'Hassan Arour',
      business: 'Hotel am Kochbrunnen',
      role: 'Hotel Director',
      content: 'The booking system transformed our operations. No-shows dropped 90% with automatic deposit integration. ROI was immediate - we\'re saving thousands monthly. Staff now focuses on guest experience instead of phone bookings.',
      rating: 5,
      beforeMetric: '40+ no-shows monthly',
      afterMetric: '4 no-shows monthly'
    },
    {
      id: 'falchi-dental',
      name: 'Martin Schneider',
      business: 'Falchi Dental',
      role: 'Practice Manager',
      content: 'As the decision maker, I saw immediate ROI. 3D processing went from 3 hours to 20 minutes. Same-day crowns are now standard. The efficiency gain lets us serve 40% more patients with the same team.',
      rating: 5,
      beforeMetric: '3+ hours per procedure',
      afterMetric: '20 minutes per procedure'
    },
    {
      id: 'glenn-miller',
      name: 'Glenn Miller',
      business: 'Klavierschule Glenn Miller',
      role: 'School Founder & Director',
      content: 'The multi-language support reaches our international students perfectly. Gamified learning increased practice time by 150%. Administrative work dropped from 15 hours to 1 hour weekly. Revenue up 65%.',
      rating: 5,
      beforeMetric: '15 hours/week scheduling',
      afterMetric: '1 hour/week scheduling'
    },
    {
      id: '33eye',
      name: 'Eyerusalem',
      business: '33eye.de',
      role: 'Professional Artist',
      content: 'My new portfolio site is a game-changer. Client inquiries increased 300%, now reaching collectors worldwide. The professional design and lightning-fast loading convinced high-value clients to book immediately.',
      rating: 5,
      beforeMetric: '5 inquiries/month',
      afterMetric: '20 inquiries/month'
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlaying, testimonials.length]);

  const handlePrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handleDotClick = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="relative py-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 rounded-3xl blur-3xl" />
        
        <div className="relative">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              {t('marketing.testimonials.title')}
            </h2>
            <p className="text-gray-400">
              {t('marketing.testimonials.subtitle')}
            </p>
          </div>

          {/* Testimonial Card */}
          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Quote Icon */}
                <Quote className="w-12 h-12 text-purple-400/30 mb-6" />

                {/* Content */}
                <blockquote className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
                  "{currentTestimonial.content}"
                </blockquote>

                {/* Metrics */}
                {currentTestimonial.beforeMetric && currentTestimonial.afterMetric && (
                  <div className="flex flex-wrap gap-4 mb-8">
                    <div className="flex-1 min-w-[140px] bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                      <div className="text-xs text-red-400 mb-1">{t('marketing.testimonials.before')}</div>
                      <div className="text-sm font-semibold text-red-300">{currentTestimonial.beforeMetric}</div>
                    </div>
                    <div className="flex-1 min-w-[140px] bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                      <div className="text-xs text-green-400 mb-1">{t('marketing.testimonials.after')}</div>
                      <div className="text-sm font-semibold text-green-300">{currentTestimonial.afterMetric}</div>
                    </div>
                  </div>
                )}

                {/* Author */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">{currentTestimonial.name}</div>
                    <div className="text-sm text-gray-400">{currentTestimonial.role}</div>
                    <div className="text-sm text-gray-500">{currentTestimonial.business}</div>
                  </div>
                  
                  {/* Rating */}
                  <div className="flex gap-1">
                    {[...Array(currentTestimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'w-8 bg-gradient-to-r from-purple-400 to-blue-400'
                    : 'bg-white/20 hover:bg-white/30'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          {/* Trust Indicator */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              {t('marketing.testimonials.trustIndicator')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialSlider;