import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Calendar, Clock, AlertTriangle, CheckCircle, TrendingUp, Users, BarChart } from 'lucide-react';
import { useLanguage } from '../../providers/LanguageProvider';

interface ComparisonItem {
  icon: React.ElementType;
  before: string;
  after: string;
  color: string;
}

const BeforeAfterComparison: React.FC = () => {
  const { t } = useLanguage();
  const [isAfter, setIsAfter] = useState(false);

  const comparisons: ComparisonItem[] = [
    {
      icon: Phone,
      before: t('marketing.comparison.phone.before'),
      after: t('marketing.comparison.phone.after'),
      color: isAfter ? 'text-green-400' : 'text-red-400'
    },
    {
      icon: Calendar,
      before: t('marketing.comparison.calendar.before'),
      after: t('marketing.comparison.calendar.after'),
      color: isAfter ? 'text-green-400' : 'text-orange-400'
    },
    {
      icon: Clock,
      before: t('marketing.comparison.time.before'),
      after: t('marketing.comparison.time.after'),
      color: isAfter ? 'text-green-400' : 'text-yellow-400'
    },
    {
      icon: AlertTriangle,
      before: t('marketing.comparison.errors.before'),
      after: t('marketing.comparison.errors.after'),
      color: isAfter ? 'text-green-400' : 'text-red-400'
    },
    {
      icon: Users,
      before: t('marketing.comparison.customers.before'),
      after: t('marketing.comparison.customers.after'),
      color: isAfter ? 'text-green-400' : 'text-purple-400'
    },
    {
      icon: BarChart,
      before: t('marketing.comparison.analytics.before'),
      after: t('marketing.comparison.analytics.after'),
      color: isAfter ? 'text-green-400' : 'text-gray-400'
    }
  ];

  const beforeScenario = {
    title: t('marketing.comparison.before.title'),
    subtitle: t('marketing.comparison.before.subtitle'),
    bgColor: 'from-red-500/20 to-orange-500/20',
    borderColor: 'border-red-500/30',
    iconBg: 'bg-red-500/20',
    stats: [
      { value: '40+', label: t('marketing.comparison.before.stat1') },
      { value: '25%', label: t('marketing.comparison.before.stat2') },
      { value: '3h', label: t('marketing.comparison.before.stat3') }
    ]
  };

  const afterScenario = {
    title: t('marketing.comparison.after.title'),
    subtitle: t('marketing.comparison.after.subtitle'),
    bgColor: 'from-green-500/20 to-emerald-500/20',
    borderColor: 'border-green-500/30',
    iconBg: 'bg-green-500/20',
    stats: [
      { value: '95%', label: t('marketing.comparison.after.stat1') },
      { value: '70%', label: t('marketing.comparison.after.stat2') },
      { value: '24/7', label: t('marketing.comparison.after.stat3') }
    ]
  };

  const currentScenario = isAfter ? afterScenario : beforeScenario;

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            {t('marketing.comparison.title')}
          </h2>
          <p className="text-gray-400 max-w-3xl mx-auto mb-8">
            {t('marketing.comparison.subtitle')}
          </p>

          {/* Toggle Switch */}
          <div className="inline-flex items-center gap-4 p-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl">
            <button
              onClick={() => setIsAfter(false)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                !isAfter
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t('marketing.comparison.toggleBefore')}
            </button>
            <button
              onClick={() => setIsAfter(true)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                isAfter
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t('marketing.comparison.toggleAfter')}
            </button>
          </div>
        </div>

        {/* Main Comparison Section */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Scenario Card */}
          <motion.div
            key={isAfter ? 'after' : 'before'}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className={`relative bg-gradient-to-br ${currentScenario.bgColor} backdrop-blur-xl border ${currentScenario.borderColor} rounded-2xl p-8`}
          >
            {/* Scenario Header */}
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">
                {currentScenario.title}
              </h3>
              <p className="text-gray-300">
                {currentScenario.subtitle}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {currentScenario.stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Visual Chaos/Order Representation */}
            <div className="relative h-48 rounded-lg bg-black/20 overflow-hidden">
              <AnimatePresence mode="wait">
                {!isAfter ? (
                  // Chaos Animation
                  <motion.div
                    key="chaos"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-12 h-12 bg-red-500/20 rounded-full blur-xl"
                        animate={{
                          x: [0, Math.random() * 200 - 100, 0],
                          y: [0, Math.random() * 100 - 50, 0],
                          scale: [1, Math.random() + 0.5, 1],
                        }}
                        transition={{
                          duration: Math.random() * 3 + 2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      />
                    ))}
                    <Phone className="w-16 h-16 text-red-400 animate-pulse" />
                  </motion.div>
                ) : (
                  // Order Animation
                  <motion.div
                    key="order"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="grid grid-cols-3 gap-4">
                      {[...Array(6)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                          className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center"
                        >
                          <CheckCircle className="w-6 h-6 text-green-400" />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Comparison Items */}
          <div className="space-y-4">
            {comparisons.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4"
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${currentScenario.iconBg}`}>
                      <Icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <div className="flex-1">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={isAfter ? 'after' : 'before'}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <p className="text-sm text-gray-300">
                            {isAfter ? item.after : item.before}
                          </p>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ROI Calculator Teaser */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 p-8 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl border border-white/10"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {t('marketing.comparison.roi.title')}
              </h3>
              <p className="text-gray-400">
                {t('marketing.comparison.roi.description')}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  {isAfter ? '320%' : '0%'}
                </div>
                <div className="text-sm text-gray-400">ROI</div>
              </div>
              <TrendingUp className={`w-8 h-8 ${isAfter ? 'text-green-400' : 'text-gray-400'}`} />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BeforeAfterComparison;