import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, Clock, Users, CheckCircle, Zap, Shield, 
  CreditCard, Bell, BarChart3, Globe, Smartphone, 
  RefreshCw, Star, TrendingUp, Coffee, Sun, Building,
  ArrowRight, ChevronRight, Sparkles, Rocket
} from 'lucide-react';
import { useLanguage } from '../providers/LanguageProvider';
import { useNavigate } from 'react-router-dom';

const Features: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const bookingFeatures = [
    {
      icon: Calendar,
      title: t('features.booking.instant.title'),
      description: t('features.booking.instant.desc'),
      color: 'from-purple-600 to-blue-600'
    },
    {
      icon: Clock,
      title: t('features.booking.availability.title'),
      description: t('features.booking.availability.desc'),
      color: 'from-blue-600 to-cyan-600'
    },
    {
      icon: Bell,
      title: t('features.booking.reminders.title'),
      description: t('features.booking.reminders.desc'),
      color: 'from-green-600 to-emerald-600'
    },
    {
      icon: CreditCard,
      title: t('features.booking.payments.title'),
      description: t('features.booking.payments.desc'),
      color: 'from-pink-600 to-rose-600'
    }
  ];

  const managementFeatures = [
    {
      icon: Calendar,
      title: t('features.management.calendar.title'),
      description: t('features.management.calendar.desc'),
      color: 'from-indigo-600 to-purple-600'
    },
    {
      icon: Users,
      title: t('features.management.staff.title'),
      description: t('features.management.staff.desc'),
      color: 'from-orange-600 to-red-600'
    },
    {
      icon: BarChart3,
      title: t('features.management.analytics.title'),
      description: t('features.management.analytics.desc'),
      color: 'from-teal-600 to-cyan-600'
    },
    {
      icon: RefreshCw,
      title: t('features.management.integration.title'),
      description: t('features.management.integration.desc'),
      color: 'from-violet-600 to-indigo-600'
    }
  ];

  const germanFeatures = [
    {
      icon: Sun,
      title: t('features.german.holidays.title'),
      description: t('features.german.holidays.desc'),
      color: 'from-yellow-600 to-orange-600'
    },
    {
      icon: Coffee,
      title: t('features.german.mittagspause.title'),
      description: t('features.german.mittagspause.desc'),
      color: 'from-amber-600 to-yellow-600'
    },
    {
      icon: Shield,
      title: t('features.german.gdpr.title'),
      description: t('features.german.gdpr.desc'),
      color: 'from-gray-600 to-slate-600'
    },
    {
      icon: Building,
      title: t('features.german.invoice.title'),
      description: t('features.german.invoice.desc'),
      color: 'from-emerald-600 to-green-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 pt-16">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 animate-pulse" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-xl rounded-2xl border border-white/10 mb-6">
              <Sparkles className="h-8 w-8 text-purple-400" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {t('features.hero.title')}
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
              {t('features.hero.subtitle')}
            </p>
            
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('openBookingModal'))}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
            >
              <Rocket className="mr-2 h-5 w-5" />
              {t('features.hero.cta')}
            </button>
          </motion.div>
        </div>
      </section>

      {/* Smart Booking System */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              {t('features.booking.title')}
            </h2>
            <p className="text-xl text-gray-300">
              {t('features.booking.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {bookingFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-8 hover:border-purple-500/50 transition-all duration-300"
              >
                <div className={`inline-flex p-3 bg-gradient-to-r ${feature.color} rounded-xl mb-4`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Management */}
      <section className="py-20 bg-gradient-to-br from-purple-900/20 to-blue-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              {t('features.management.title')}
            </h2>
            <p className="text-xl text-gray-300">
              {t('features.management.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {managementFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-8 hover:border-blue-500/50 transition-all duration-300"
              >
                <div className={`inline-flex p-3 bg-gradient-to-r ${feature.color} rounded-xl mb-4`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* German Excellence Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-black to-red-900/50 rounded-2xl mb-6">
              <span className="text-2xl mr-2">🇩🇪</span>
              <Shield className="h-8 w-8 text-yellow-400" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              {t('features.german.title')}
            </h2>
            <p className="text-xl text-gray-300">
              {t('features.german.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {germanFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-yellow-500/50 transition-all duration-300 group"
              >
                <div className={`inline-flex p-3 bg-gradient-to-r ${feature.color} rounded-xl mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 bg-gradient-to-br from-purple-900/20 to-blue-900/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose Our Booking System?
            </h2>
            <p className="text-xl text-gray-300">
              See how we compare to traditional methods
            </p>
          </div>

          <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-6 text-gray-400">Feature</th>
                  <th className="text-center p-6 text-gray-400">Traditional</th>
                  <th className="text-center p-6 text-white bg-gradient-to-br from-purple-600/20 to-blue-600/20">Our System</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/10">
                  <td className="p-6 text-white">24/7 Availability</td>
                  <td className="text-center p-6">
                    <span className="text-red-400">✗</span>
                  </td>
                  <td className="text-center p-6 bg-gradient-to-br from-purple-600/10 to-blue-600/10">
                    <span className="text-green-400">✓</span>
                  </td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-6 text-white">Automatic Reminders</td>
                  <td className="text-center p-6">
                    <span className="text-red-400">✗</span>
                  </td>
                  <td className="text-center p-6 bg-gradient-to-br from-purple-600/10 to-blue-600/10">
                    <span className="text-green-400">✓</span>
                  </td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-6 text-white">Online Payments</td>
                  <td className="text-center p-6">
                    <span className="text-red-400">✗</span>
                  </td>
                  <td className="text-center p-6 bg-gradient-to-br from-purple-600/10 to-blue-600/10">
                    <span className="text-green-400">✓</span>
                  </td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-6 text-white">No-Show Rate</td>
                  <td className="text-center p-6 text-gray-400">15-20%</td>
                  <td className="text-center p-6 bg-gradient-to-br from-purple-600/10 to-blue-600/10 text-green-400">
                    {'<2%'}
                  </td>
                </tr>
                <tr>
                  <td className="p-6 text-white">Time Per Booking</td>
                  <td className="text-center p-6 text-gray-400">5-10 min</td>
                  <td className="text-center p-6 bg-gradient-to-br from-purple-600/10 to-blue-600/10 text-green-400">
                    30 sec
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-12"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join 15+ German businesses already saving 20+ hours weekly
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('openBookingModal'))}
                className="inline-flex items-center px-8 py-4 bg-white text-purple-600 rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 font-semibold"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button 
                onClick={() => navigate('/pricing')}
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-full hover:bg-white/10 transition-all duration-300 font-semibold"
              >
                View Pricing
                <ChevronRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Features;