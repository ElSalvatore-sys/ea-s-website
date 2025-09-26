import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Lock,
  CheckCircle,
  Clock,
  RefreshCw,
  Award,
  Zap,
  HeartHandshake,
  ShieldCheck
} from 'lucide-react';
import { gdprAnalytics } from '../../lib/gdpr-analytics';
import { OPTIMIZATION_EVENTS } from '../../lib/analytics/event-definitions';

interface TrustBadge {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

interface TrustBadgesProps {
  showSSL?: boolean;
  showGuarantee?: boolean;
  showInstant?: boolean;
  showSupport?: boolean;
  showGDPR?: boolean;
  variant?: 'compact' | 'detailed' | 'floating';
  position?: 'top' | 'bottom' | 'inline';
  className?: string;
  onBadgeClick?: (badgeId: string) => void;
}

const TrustBadges: React.FC<TrustBadgesProps> = ({
  showSSL = true,
  showGuarantee = true,
  showInstant = true,
  showSupport = true,
  showGDPR = true,
  variant = 'compact',
  position = 'inline',
  className = '',
  onBadgeClick
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredBadge, setHoveredBadge] = useState<string | null>(null);
  const [hasTrackedView, setHasTrackedView] = useState(false);

  // Define trust badges
  const badges: TrustBadge[] = [
    {
      id: 'ssl',
      icon: <Lock className="w-4 h-4" />,
      title: 'SSL Secured',
      description: '256-bit encryption protects your data',
      color: 'text-green-400'
    },
    {
      id: 'guarantee',
      icon: <ShieldCheck className="w-4 h-4" />,
      title: 'Money-Back Guarantee',
      description: '100% satisfaction or full refund',
      color: 'text-blue-400'
    },
    {
      id: 'instant',
      icon: <Zap className="w-4 h-4" />,
      title: 'Instant Confirmation',
      description: 'Booking confirmed immediately',
      color: 'text-yellow-400'
    },
    {
      id: 'support',
      icon: <HeartHandshake className="w-4 h-4" />,
      title: '24/7 Support',
      description: 'Always here to help you',
      color: 'text-purple-400'
    },
    {
      id: 'gdpr',
      icon: <Shield className="w-4 h-4" />,
      title: 'GDPR Compliant',
      description: 'Your privacy is protected',
      color: 'text-indigo-400'
    }
  ];

  // Filter badges based on props
  const activeBadges = badges.filter(badge => {
    switch (badge.id) {
      case 'ssl': return showSSL;
      case 'guarantee': return showGuarantee;
      case 'instant': return showInstant;
      case 'support': return showSupport;
      case 'gdpr': return showGDPR;
      default: return false;
    }
  });

  useEffect(() => {
    // Show badges after delay
    const timer = setTimeout(() => {
      setIsVisible(true);

      // Track view
      if (!hasTrackedView) {
        gdprAnalytics.trackEvent(OPTIMIZATION_EVENTS.VIEW_TRUST_BADGE, {
          variant,
          position,
          badgeCount: activeBadges.length,
          badgeTypes: activeBadges.map(b => b.id)
        });
        setHasTrackedView(true);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Handle badge click
  const handleBadgeClick = (badgeId: string) => {
    gdprAnalytics.trackEvent(OPTIMIZATION_EVENTS.TRUST_SIGNAL_CONVERSION, {
      badgeId,
      variant,
      position
    });

    if (onBadgeClick) {
      onBadgeClick(badgeId);
    }
  };

  // Render compact variant
  const renderCompact = () => (
    <div className="flex items-center gap-3 flex-wrap">
      {activeBadges.map((badge, index) => (
        <motion.div
          key={badge.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="group relative"
          onMouseEnter={() => setHoveredBadge(badge.id)}
          onMouseLeave={() => setHoveredBadge(null)}
          onClick={() => handleBadgeClick(badge.id)}
        >
          <div className="flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur-lg border border-white/10 rounded-lg cursor-pointer transition-all hover:bg-white/5 hover:border-white/20">
            <div className={badge.color}>
              {badge.icon}
            </div>
            <span className="text-xs font-medium text-gray-300">
              {badge.title}
            </span>
          </div>

          {/* Tooltip on hover */}
          {hoveredBadge === badge.id && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 rounded-lg shadow-xl z-50 whitespace-nowrap"
            >
              <p className="text-xs text-gray-300">{badge.description}</p>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                <div className="w-2 h-2 bg-gray-900 rotate-45" />
              </div>
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );

  // Render detailed variant
  const renderDetailed = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {activeBadges.map((badge, index) => (
        <motion.div
          key={badge.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="p-4 bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-lg border border-white/10 rounded-xl cursor-pointer transition-all hover:from-white/10 hover:to-white/5 hover:border-white/20"
          onClick={() => handleBadgeClick(badge.id)}
        >
          <div className="flex items-start gap-3">
            <div className={`p-2 bg-black/30 rounded-lg ${badge.color}`}>
              {badge.icon}
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm mb-1">
                {badge.title}
              </h4>
              <p className="text-xs text-gray-400">
                {badge.description}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  // Render floating variant
  const renderFloating = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`fixed ${
        position === 'bottom' ? 'bottom-4' : 'top-20'
      } right-4 z-40 space-y-2 max-w-xs`}
    >
      {activeBadges.slice(0, 3).map((badge, index) => (
        <motion.div
          key={badge.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.2 }}
          className="flex items-center gap-3 px-4 py-3 bg-black/70 backdrop-blur-lg border border-white/20 rounded-lg shadow-xl cursor-pointer transition-all hover:bg-black/80 hover:border-white/30"
          onClick={() => handleBadgeClick(badge.id)}
        >
          <div className={`${badge.color} flex-shrink-0`}>
            {badge.icon}
          </div>
          <div>
            <p className="text-sm font-medium text-white">
              {badge.title}
            </p>
            <p className="text-xs text-gray-400">
              {badge.description}
            </p>
          </div>
        </motion.div>
      ))}

      {/* Pulsing indicator */}
      <motion.div
        className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [1, 0.7, 1]
        }}
        transition={{
          duration: 2,
          repeat: Infinity
        }}
      />
    </motion.div>
  );

  if (!isVisible || activeBadges.length === 0) return null;

  return (
    <div className={`trust-badges ${className}`}>
      {variant === 'compact' && renderCompact()}
      {variant === 'detailed' && renderDetailed()}
      {variant === 'floating' && renderFloating()}
    </div>
  );
};

export default TrustBadges;