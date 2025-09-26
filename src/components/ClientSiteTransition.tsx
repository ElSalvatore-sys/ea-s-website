import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ClientSite {
  id: string;
  name: string;
  url: string;
  primaryColor: string;
  secondaryColor: string;
  pattern: 'dots' | 'lines' | 'grid' | 'waves';
}

const ClientSiteTransition: React.FC = () => {
  const [currentSiteIndex, setCurrentSiteIndex] = useState(0);

  const clientSites: ClientSite[] = [
    {
      id: 'hotel-kochbrunnen',
      name: 'Hotel am Kochbrunnen',
      url: 'hotelkochbrunnen.de',
      primaryColor: '#8B7355',
      secondaryColor: '#D4AF37',
      pattern: 'waves'
    },
    {
      id: 'falchi-dental',
      name: 'Falchi Dental',
      url: 'falchi-dental.de',
      primaryColor: '#00BFA6',
      secondaryColor: '#00ACC1',
      pattern: 'dots'
    },
    {
      id: 'glenn-miller',
      name: 'Glenn Miller Music School',
      url: 'glenn-miller.de',
      primaryColor: '#FF6B35',
      secondaryColor: '#F7931E',
      pattern: 'lines'
    },
    {
      id: '33eye',
      name: '33eye Photography',
      url: '33eye.de',
      primaryColor: '#E91E63',
      secondaryColor: '#9C27B0',
      pattern: 'grid'
    },
    {
      id: 'ristorante-toscana',
      name: 'Ristorante Toscana',
      url: 'toscana-wiesbaden.de',
      primaryColor: '#4CAF50',
      secondaryColor: '#8BC34A',
      pattern: 'waves'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSiteIndex((prevIndex) => (prevIndex + 1) % clientSites.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [clientSites.length]);

  const currentSite = clientSites[currentSiteIndex];

  const getPattern = (pattern: string) => {
    switch (pattern) {
      case 'dots':
        return (
          <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="2" fill="currentColor" opacity="0.1" />
          </pattern>
        );
      case 'lines':
        return (
          <pattern id="lines" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <line x1="0" y1="20" x2="40" y2="20" stroke="currentColor" strokeWidth="1" opacity="0.1" />
            <line x1="20" y1="0" x2="20" y2="40" stroke="currentColor" strokeWidth="1" opacity="0.1" />
          </pattern>
        );
      case 'grid':
        return (
          <pattern id="grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.1" />
          </pattern>
        );
      case 'waves':
        return (
          <pattern id="waves" x="0" y="0" width="100" height="20" patternUnits="userSpaceOnUse">
            <path d="M0 10 Q 25 0 50 10 T 100 10" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.1" />
          </pattern>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base dark background */}
      <div className="absolute inset-0 bg-[#0A0A0A]" />
      
      {/* Animated client site transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSite.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {/* Primary gradient overlay */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse at center, ${currentSite.primaryColor}20, transparent 70%)`
            }}
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Secondary gradient overlay */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse at 70% 30%, ${currentSite.secondaryColor}15, transparent 60%)`
            }}
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Pattern overlay */}
          <svg className="absolute inset-0 w-full h-full" style={{ color: currentSite.primaryColor }}>
            <defs>
              {getPattern(currentSite.pattern)}
            </defs>
            <rect width="100%" height="100%" fill={`url(#${currentSite.pattern})`} />
          </svg>

          {/* Floating elements representing client's industry */}
          <div className="absolute inset-0">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: currentSite.primaryColor,
                  opacity: 0.3,
                  left: `${20 + i * 15}%`,
                  top: `${30 + i * 10}%`,
                }}
                animate={{
                  y: [-20, 20, -20],
                  x: [-10, 10, -10],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 10 + i * 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.5,
                }}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Client indicator */}
      <div className="absolute bottom-4 left-4 z-10">
        <motion.div
          key={currentSite.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="flex items-center gap-2"
        >
          <div 
            className="w-2 h-2 rounded-full"
            style={{ background: currentSite.primaryColor }}
          />
          <span className="text-xs text-white/30 font-mono">
            {currentSite.url}
          </span>
        </motion.div>
      </div>

      {/* Progress indicators */}
      <div className="absolute bottom-4 right-4 flex gap-1 z-10">
        {clientSites.map((site, index) => (
          <motion.div
            key={site.id}
            className="w-8 h-1 rounded-full overflow-hidden bg-white/10"
            whileHover={{ scale: 1.2 }}
            onClick={() => setCurrentSiteIndex(index)}
          >
            <motion.div
              className="h-full"
              style={{ background: site.primaryColor }}
              initial={{ width: 0 }}
              animate={{ 
                width: index === currentSiteIndex ? '100%' : '0%' 
              }}
              transition={{ 
                duration: index === currentSiteIndex ? 8 : 0.3,
                ease: "linear"
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Subtle noise texture */}
      <div 
        className="absolute inset-0 opacity-[0.02] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};

export default ClientSiteTransition;