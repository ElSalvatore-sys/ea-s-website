import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Users, CheckCircle, Award, TrendingUp } from 'lucide-react';
import { gdprAnalytics } from '../../lib/gdpr-analytics';
import { OPTIMIZATION_EVENTS } from '../../lib/analytics/event-definitions';

interface RecentBooking {
  name: string;
  service: string;
  timeAgo: string;
  location?: string;
}

interface SocialProofProps {
  rating?: number;
  reviewCount?: number;
  totalBookings?: number;
  recentBookings?: RecentBooking[];
  certifications?: string[];
  variant?: 'ratings' | 'activity' | 'ticker' | 'combined';
  className?: string;
  autoRotate?: boolean;
}

const SocialProof: React.FC<SocialProofProps> = ({
  rating = 4.8,
  reviewCount = 127,
  totalBookings = 1543,
  recentBookings = [],
  certifications = [],
  variant = 'combined',
  className = '',
  autoRotate = true
}) => {
  const [currentBooking, setCurrentBooking] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hasTrackedView, setHasTrackedView] = useState(false);

  // Default recent bookings if none provided
  const defaultBookings: RecentBooking[] = [
    { name: 'Maria S.', service: 'Smart Home Consultation', timeAgo: '2 hours ago', location: 'Wiesbaden' },
    { name: 'Thomas K.', service: 'Restaurant AI Setup', timeAgo: '3 hours ago', location: 'Frankfurt' },
    { name: 'Lisa M.', service: 'Business Automation', timeAgo: '5 hours ago', location: 'Mainz' }
  ];

  const bookings = recentBookings.length > 0 ? recentBookings : defaultBookings;

  useEffect(() => {
    // Show after delay
    const timer = setTimeout(() => {
      setIsVisible(true);

      // Track view
      if (!hasTrackedView) {
        gdprAnalytics.trackEvent(OPTIMIZATION_EVENTS.VIEW_SOCIAL_PROOF, {
          variant,
          hasRatings: rating > 0,
          hasActivity: totalBookings > 0,
          hasRecentBookings: bookings.length > 0
        });
        setHasTrackedView(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!autoRotate || bookings.length <= 1) return;

    // Rotate recent bookings
    const interval = setInterval(() => {
      setCurrentBooking((prev) => (prev + 1) % bookings.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [bookings.length, autoRotate]);

  // Track conversion when clicked
  const handleClick = () => {
    gdprAnalytics.trackEvent(OPTIMIZATION_EVENTS.SOCIAL_PROOF_CONVERSION, {
      variant,
      elementClicked: 'social_proof'
    });
  };

  // Render rating stars
  const renderStars = () => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < fullStars
                ? 'fill-yellow-400 text-yellow-400'
                : i === fullStars && hasHalfStar
                ? 'fill-yellow-400/50 text-yellow-400'
                : 'fill-gray-600 text-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };

  // Render ratings variant
  const renderRatings = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-3 px-4 py-2 bg-black/50 backdrop-blur-lg border border-white/10 rounded-lg"
      onClick={handleClick}
    >
      {renderStars()}
      <div className="text-sm">
        <span className="font-bold text-white">{rating}</span>
        <span className="text-gray-400 ml-1">({reviewCount} reviews)</span>
      </div>
    </motion.div>
  );

  // Render activity variant
  const renderActivity = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-lg border border-white/10 rounded-lg"
      onClick={handleClick}
    >
      <Users className="w-4 h-4 text-purple-400" />
      <span className="text-sm">
        <span className="font-bold text-white">{totalBookings.toLocaleString()}</span>
        <span className="text-gray-300 ml-1">successful bookings</span>
      </span>
    </motion.div>
  );

  // Render booking ticker variant
  const renderTicker = () => (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentBooking}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-3 px-4 py-2 bg-green-900/30 backdrop-blur-lg border border-green-500/30 rounded-lg"
        onClick={handleClick}
      >
        <CheckCircle className="w-4 h-4 text-green-400" />
        <div className="text-sm">
          <span className="font-medium text-white">
            {bookings[currentBooking].name}
          </span>
          <span className="text-gray-400 ml-1">
            booked {bookings[currentBooking].service}
          </span>
          {bookings[currentBooking].location && (
            <span className="text-gray-500 ml-1">
              in {bookings[currentBooking].location}
            </span>
          )}
          <span className="text-gray-500 ml-1">
            • {bookings[currentBooking].timeAgo}
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  );

  // Render combined variant
  const renderCombined = () => (
    <div className="space-y-3">
      {/* Ratings and reviews */}
      <div className="flex items-center justify-between gap-4">
        {renderRatings()}

        {/* Trust badges */}
        {certifications.length > 0 && (
          <div className="flex items-center gap-2">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-1 px-2 py-1 bg-blue-900/30 rounded-md"
              >
                <Award className="w-3 h-3 text-blue-400" />
                <span className="text-xs text-blue-300">{cert}</span>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Activity counter */}
      <div className="flex items-center justify-between gap-4">
        {renderActivity()}

        {/* Trending indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-1 px-3 py-1 bg-orange-900/30 rounded-md"
        >
          <TrendingUp className="w-3 h-3 text-orange-400" />
          <span className="text-xs text-orange-300">High demand today</span>
        </motion.div>
      </div>

      {/* Recent booking ticker */}
      {bookings.length > 0 && renderTicker()}
    </div>
  );

  if (!isVisible) return null;

  return (
    <div className={`social-proof ${className}`}>
      {variant === 'ratings' && renderRatings()}
      {variant === 'activity' && renderActivity()}
      {variant === 'ticker' && renderTicker()}
      {variant === 'combined' && renderCombined()}
    </div>
  );
};

export default SocialProof;