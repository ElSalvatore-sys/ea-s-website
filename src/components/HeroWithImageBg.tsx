import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../providers/LanguageProvider';
import { analytics } from '../lib/analytics';

const HeroWithImageBg: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: 'url(/hero-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Gradient overlay to blend with the image */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/30" />

      {/* Content overlay - positioned to not overlap with brain illustrations */}
      <motion.div
        className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="text-center">
          {/* Main Headline - positioned to match image layout */}
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-8"
            variants={fadeInUp}
            style={{ marginTop: '-10vh' }}
          >
            <div className="leading-[1.1]">
              <div className="text-white drop-shadow-2xl">
                {language === 'de' ? 'Enterprise KI' : 'Enterprise AI'}
              </div>
              <div className="bg-gradient-to-r from-fuchsia-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl">
                {language === 'de' ? 'Die Antreibt' : 'That Powers'}
              </div>
              <div className="text-white drop-shadow-2xl">
                {language === 'de' ? 'Echte Ergebnisse' : 'Real Results'}
              </div>
            </div>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-lg md:text-xl text-gray-200 mb-12 max-w-2xl mx-auto leading-relaxed drop-shadow-xl"
            variants={fadeInUp}
          >
            {language === 'de'
              ? 'Transformieren Sie Ihr Unternehmen mit modernster KI, Automatisierung und digitalen Lösungen von unserem Standort in Wiesbaden.'
              : 'Transform your business with cutting-edge AI, automation, and digital solutions delivered from our base in Wiesbaden.'}
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={fadeInUp}
          >
            <button
              onClick={() => {
                analytics.trackEvent('hero_cta_click', {
                  ctaType: 'primary',
                  ctaText: 'Start Free Trial',
                  position: 'primary'
                });
                navigate('/contact');
              }}
              className="group px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white hover:shadow-lg hover:shadow-purple-500/25 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
            >
              {t('hero.cta.primary')}
              <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => {
                analytics.trackEvent('hero_cta_click', {
                  ctaType: 'secondary',
                  ctaText: 'Learn More',
                  position: 'secondary'
                });
                navigate('/about');
              }}
              className="group px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white hover:bg-white/20 rounded-full font-medium text-lg transition-all duration-300"
            >
              {t('hero.cta.secondary')}
              <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom gradient fade for smooth transition */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#1a0f2e] to-transparent" />
    </section>
  );
};

export default HeroWithImageBg;