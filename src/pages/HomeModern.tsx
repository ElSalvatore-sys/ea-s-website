import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../providers/LanguageProvider';
import {
  Sparkles,
  ArrowRight,
  Brain,
  Zap,
  Shield,
  Globe,
  TrendingUp,
  Users,
  CheckCircle,
  Play,
  Code,
  Network,
  BarChart3,
  Rocket,
  Award,
  Clock,
  MapPin,
  MessageSquare,
  CreditCard,
  Headphones,
  Building2,
  Phone,
  Calendar,
  Monitor,
  Bot,
  Euro,
  Star,
  ExternalLink
} from 'lucide-react';
import ClientSiteTransition from '../components/ClientSiteTransition';
import ClientLogos from '../components/ClientLogos';
import CaseStudyShowcase from '../components/CaseStudyShowcase';
import InnovationLab from '../components/InnovationLab';
import TestimonialSlider from '../components/marketing/TestimonialSlider';
import HeroWithBrains from '../components/HeroWithBrains';
import { analytics, trackBookingIntent } from '../lib/analytics';

const HomeModern: React.FC = () => {
  const [scrollEngagementTracked, setScrollEngagementTracked] = useState(false);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, 50]);
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const currentLang = language === 'de' ? 'de' : 'en';

  // Track scroll engagement
  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;

      if (scrollPercent > 25 && !scrollEngagementTracked) {
        setScrollEngagementTracked(true);
        analytics.trackEvent('hero_scroll_engagement', {
          scrollPercent,
          timeOnPage: Date.now() - analytics.getSessionDuration()
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollEngagementTracked]);

  // Animation variants
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
    <div className="min-h-screen text-white overflow-hidden">
      <ClientSiteTransition />

      {/* Hero Section with Brain Illustrations */}
      <HeroWithBrains />

      {/* 2. TRUST INDICATORS - Immediately after hero */}
      <section className="py-16 relative bg-gradient-to-b from-[#1a0f2e] to-[#1a0f2e]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ClientLogos />

          {/* Trust Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 text-center"
          >
            <div className="inline-flex flex-wrap justify-center gap-4 md:gap-8 text-gray-400">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                <span>{t('home.trustBar.activeClients')}</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                <span>{t('home.trustBar.retention')}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-green-400 mr-2" />
                <span>{t('home.trustBar.germanyBased')}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. THREE CORE SERVICES - With real examples */}
      <section className="py-32 relative bg-gradient-to-b from-[#1a0033]/50 via-purple-950/20 to-[#1a0033]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {t('home.coreSolutions.title')}
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              {t('home.coreSolutions.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booking Systems */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-xl rounded-2xl border border-purple-500/20 p-8 hover:border-purple-500/40 transition-all duration-300">
                <div className="mb-6">
                  <Calendar className="w-12 h-12 text-purple-400 mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {t('home.coreSolutions.bookingSystems.title')}
                  </h3>
                  <p className="text-gray-400">
                    {t('home.coreSolutions.bookingSystems.description')}
                  </p>
                </div>

                <div className="mb-6">
                  <div className="bg-black/40 rounded-lg p-4 mb-4">
                    <p className="text-sm text-gray-500 mb-2">{t('home.coreSolutions.bookingSystems.liveAt')}</p>
                    <p className="text-lg font-semibold text-white">Hotel am Kochbrunnen</p>
                    <p className="text-sm text-green-400 mt-1">+16% {t('home.coreSolutions.bookingSystems.result')}</p>
                  </div>
                </div>

                <Link
                  to="/services/booking-systems"
                  className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors"
                >
                  {t('home.coreSolutions.bookingSystems.cta')}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </motion.div>

            {/* Custom Websites */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 backdrop-blur-xl rounded-2xl border border-blue-500/20 p-8 hover:border-blue-500/40 transition-all duration-300">
                <div className="mb-6">
                  <Monitor className="w-12 h-12 text-blue-400 mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {t('home.coreSolutions.customWebsites.title')}
                  </h3>
                  <p className="text-gray-400">
                    {t('home.coreSolutions.customWebsites.description')}
                  </p>
                </div>

                <div className="mb-6">
                  <div className="bg-black/40 rounded-lg p-4 mb-4">
                    <p className="text-sm text-gray-500 mb-2">{t('home.coreSolutions.customWebsites.reference')}</p>
                    <p className="text-lg font-semibold text-white">Glenn Miller School</p>
                    <p className="text-sm text-green-400 mt-1">2x {t('home.coreSolutions.customWebsites.result')}</p>
                  </div>
                </div>

                <Link
                  to="/services/web-development"
                  className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                >
                  {t('home.coreSolutions.customWebsites.cta')}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </motion.div>

            {/* AI Automation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 backdrop-blur-xl rounded-2xl border border-green-500/20 p-8 hover:border-green-500/40 transition-all duration-300">
                <div className="mb-6">
                  <Bot className="w-12 h-12 text-green-400 mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {t('home.coreSolutions.aiAutomation.title')}
                  </h3>
                  <p className="text-gray-400">
                    {t('home.coreSolutions.aiAutomation.description')}
                  </p>
                </div>

                <div className="mb-6">
                  <div className="bg-black/40 rounded-lg p-4 mb-4">
                    <p className="text-sm text-gray-500 mb-2">{t('home.coreSolutions.aiAutomation.successAt')}</p>
                    <p className="text-lg font-semibold text-white">Falchi Dental</p>
                    <p className="text-sm text-green-400 mt-1">15h {t('home.coreSolutions.aiAutomation.result')}</p>
                  </div>
                </div>

                <Link
                  to="/services/business-automation"
                  className="inline-flex items-center text-green-400 hover:text-green-300 transition-colors"
                >
                  {t('home.coreSolutions.aiAutomation.cta')}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. PROVEN RESULTS - Case Studies */}
      <CaseStudyShowcase />

      {/* 5. INNOVATION LAB - Our Products */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <InnovationLab />
        </div>
      </section>

      {/* 6. TESTIMONIALS - Real quotes */}
      <TestimonialSlider />

      {/* 7. PRICING PREVIEW */}
      <section className="py-32 relative bg-gradient-to-b from-black via-purple-950/10 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {t('home.pricingSection.title')}
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              {t('home.pricingSection.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter Tier */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 hover:border-purple-500/30 transition-all duration-300"
            >
              <h3 className="text-2xl font-bold text-white mb-2">Digital Starter</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-white">{t('home.pricingSection.from')}</span>
                <span className="text-4xl font-bold text-purple-400 ml-2">€120</span>
                <span className="text-gray-400">/{t('home.pricingSection.month')}</span>
              </div>
              <ul className="space-y-2 text-gray-400 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  {t('home.pricingSection.starter.feature1')}
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  {t('home.pricingSection.starter.feature2')}
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  {t('home.pricingSection.starter.feature3')}
                </li>
              </ul>
            </motion.div>

            {/* Growth Tier - Most Popular */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  {t('home.pricingSection.mostPopular')}
                </span>
              </div>
              <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-8 hover:border-purple-500/50 transition-all duration-300">
                <h3 className="text-2xl font-bold text-white mb-2">Business Growth</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">{t('home.pricingSection.from')}</span>
                  <span className="text-4xl font-bold text-purple-400 ml-2">€300</span>
                  <span className="text-gray-400">/{t('home.pricingSection.month')}</span>
                </div>
                <ul className="space-y-2 text-gray-300 mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                    {t('home.pricingSection.growth.feature1')}
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                    {t('home.pricingSection.growth.feature2')}
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                    {t('home.pricingSection.growth.feature3')}
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Enterprise Tier */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 hover:border-purple-500/30 transition-all duration-300"
            >
              <h3 className="text-2xl font-bold text-white mb-2">Enterprise Complete</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-white">{t('home.pricingSection.from')}</span>
                <span className="text-4xl font-bold text-purple-400 ml-2">€299</span>
                <span className="text-gray-400">/{t('home.pricingSection.month')}</span>
              </div>
              <ul className="space-y-2 text-gray-400 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  {t('home.pricingSection.enterprise.feature1')}
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  {t('home.pricingSection.enterprise.feature2')}
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  {t('home.pricingSection.enterprise.feature3')}
                </li>
              </ul>
            </motion.div>
          </div>

          <div className="text-center mt-12">
            <Link
              to="/pricing"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 font-medium text-lg"
            >
              {t('home.pricingSection.viewFullPricing')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 8. FAQ - 5 Real Questions */}
      <section className="py-24 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {t('home.faq.title')}
              </span>
            </h2>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                question: t('home.faq.questions.howQuickly.question'),
                answer: t('home.faq.questions.howQuickly.answer')
              },
              {
                question: t('home.faq.questions.outsideStuttgart.question'),
                answer: t('home.faq.questions.outsideStuttgart.answer')
              },
              {
                question: t('home.faq.questions.existingWebsite.question'),
                answer: t('home.faq.questions.existingWebsite.answer')
              },
              {
                question: t('home.faq.questions.calendarIntegration.question'),
                answer: t('home.faq.questions.calendarIntegration.answer')
              },
              {
                question: t('home.faq.questions.gdprCompliant.question'),
                answer: t('home.faq.questions.gdprCompliant.answer')
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-purple-500/30 transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-white mb-3">
                  {item.question}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {item.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FINAL CTA */}
      <section className="py-32 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-8" />
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                {t('home.finalCta.title')}
              </span>
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              {t('home.finalCta.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  analytics.trackConversion({
                    eventName: 'bottom_cta_conversion',
                    value: 300,
                    currency: 'EUR'
                  });
                  window.dispatchEvent(new Event('openBookingModal'));
                }}
                className="group px-10 py-5 bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg hover:shadow-purple-500/25 rounded-full font-medium text-xl transition-all duration-300 transform hover:scale-105"
              >
                {t('home.finalCta.primaryButton')}
                <Rocket className="inline-block ml-3 w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>

              <Link
                to="/portfolio"
                className="px-10 py-5 bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 rounded-full font-medium text-xl transition-all duration-300"
              >
                {t('home.finalCta.secondaryButton')}
                <ExternalLink className="inline-block ml-3 w-6 h-6" />
              </Link>
            </div>

            <p className="mt-6 text-sm text-gray-500">
              {t('home.finalCta.trustNote')}
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomeModern;