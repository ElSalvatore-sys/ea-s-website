import React from 'react';
import { motion } from 'framer-motion';

const GradientBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base dark background */}
      <div className="absolute inset-0 bg-[#0A0A0A]" />
      
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute -top-1/2 -left-1/2 w-full h-full"
        animate={{
          x: [0, 100, 0],
          y: [0, -100, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <div className="w-[800px] h-[800px] rounded-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 blur-3xl" />
      </motion.div>
      
      <motion.div
        className="absolute -bottom-1/2 -right-1/2 w-full h-full"
        animate={{
          x: [0, -100, 0],
          y: [0, 100, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <div className="w-[800px] h-[800px] rounded-full bg-gradient-to-r from-pink-600/20 to-purple-600/20 blur-3xl" />
      </motion.div>
      
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <div className="w-[600px] h-[600px] rounded-full bg-gradient-to-r from-blue-600/10 to-indigo-600/10 blur-3xl" />
      </motion.div>
      
      {/* Grain texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Gradient mesh overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-purple-900/5 to-transparent" />
    </div>
  );
};

export default GradientBackground;