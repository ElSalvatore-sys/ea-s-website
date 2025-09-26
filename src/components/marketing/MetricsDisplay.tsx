import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Phone, Clock, UserX, Zap } from 'lucide-react';
import { useLanguage } from '../../providers/LanguageProvider';

interface Metric {
  id: string;
  value: number;
  suffix: string;
  label: string;
  icon: React.ElementType;
  color: string;
  description: string;
}

const MetricsDisplay: React.FC = () => {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [hasAnimated, setHasAnimated] = useState(false);

  const metrics: Metric[] = [
    {
      id: 'phone-reduction',
      value: 95,
      suffix: '%',
      label: t('marketing.metrics.phoneReduction.label'),
      icon: Phone,
      color: 'from-red-400 to-pink-400',
      description: t('marketing.metrics.phoneReduction.description')
    },
    {
      id: 'time-saved',
      value: 10,
      suffix: '+',
      label: t('marketing.metrics.timeSaved.label'),
      icon: Clock,
      color: 'from-blue-400 to-cyan-400',
      description: t('marketing.metrics.timeSaved.description')
    },
    {
      id: 'no-shows',
      value: 70,
      suffix: '%',
      label: t('marketing.metrics.noShows.label'),
      icon: UserX,
      color: 'from-purple-400 to-indigo-400',
      description: t('marketing.metrics.noShows.description')
    },
    {
      id: 'setup-time',
      value: 2,
      suffix: ' min',
      label: t('marketing.metrics.setupTime.label'),
      icon: Zap,
      color: 'from-green-400 to-emerald-400',
      description: t('marketing.metrics.setupTime.description')
    }
  ];

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isInView, hasAnimated]);

  const CountUp: React.FC<{ end: number; suffix: string; duration?: number }> = ({ 
    end, 
    suffix, 
    duration = 2 
  }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!hasAnimated) return;

      const startTime = Date.now();
      const endTime = startTime + duration * 1000;

      const updateCount = () => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / (endTime - startTime), 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentCount = Math.floor(end * easeOutQuart);
        
        setCount(currentCount);

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        }
      };

      requestAnimationFrame(updateCount);
    }, [hasAnimated]);

    return (
      <span className="tabular-nums">
        {count}{suffix}
      </span>
    );
  };

  return (
    <div ref={ref} className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            {t('marketing.metrics.title')}
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {t('marketing.metrics.subtitle')}
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, y: 20 }}
                animate={hasAnimated ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="relative group"
              >
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                  {/* Icon */}
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${metric.color} bg-opacity-10 mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Value */}
                  <div className={`text-4xl font-bold mb-2 bg-gradient-to-r ${metric.color} bg-clip-text text-transparent`}>
                    {hasAnimated ? (
                      <CountUp end={metric.value} suffix={metric.suffix} />
                    ) : (
                      <span>0{metric.suffix}</span>
                    )}
                  </div>

                  {/* Label */}
                  <div className="text-white font-semibold mb-2">
                    {metric.label}
                  </div>

                  {/* Description */}
                  <div className="text-sm text-gray-400">
                    {metric.description}
                  </div>

                  {/* Animated Background */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}
                  />
                </div>

                {/* Floating particles effect */}
                {hasAnimated && (
                  <motion.div
                    className={`absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-br ${metric.color} rounded-full blur-xl`}
                    animate={{
                      y: [-10, -20, -10],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: index * 0.5,
                    }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={hasAnimated ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-gray-400 mb-6">
            {t('marketing.metrics.cta')}
          </p>
          <button className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105">
            {t('marketing.metrics.button')}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default MetricsDisplay;