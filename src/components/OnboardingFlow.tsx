import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTranslation } from 'react-i18next';
import {
  UserPlus,
  Building2,
  Package,
  Settings2,
  Rocket,
  Clock,
  Check,
  Quote,
  ArrowRight,
  Star
} from 'lucide-react';
import BookingModal from './BookingModal';

const OnboardingFlow: React.FC = () => {
  const { t } = useTranslation();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const steps = [
    {
      icon: UserPlus,
      title: t('home.onboarding.step1.title'),
      description: t('home.onboarding.step1.description'),
      time: t('home.onboarding.step1.time'),
      color: 'from-purple-600 to-blue-600'
    },
    {
      icon: Building2,
      title: t('home.onboarding.step2.title'),
      description: t('home.onboarding.step2.description'),
      time: t('home.onboarding.step2.time'),
      color: 'from-blue-600 to-cyan-600'
    },
    {
      icon: Package,
      title: t('home.onboarding.step3.title'),
      description: t('home.onboarding.step3.description'),
      time: t('home.onboarding.step3.time'),
      color: 'from-cyan-600 to-teal-600'
    },
    {
      icon: Settings2,
      title: t('home.onboarding.step4.title'),
      description: t('home.onboarding.step4.description'),
      time: t('home.onboarding.step4.time'),
      color: 'from-teal-600 to-green-600'
    },
    {
      icon: Rocket,
      title: t('home.onboarding.step5.title'),
      description: t('home.onboarding.step5.description'),
      time: t('home.onboarding.step5.time'),
      color: 'from-green-600 to-emerald-600'
    }
  ];

  const testimonials = [
    {
      quote: t('home.onboarding.testimonial1.quote'),
      author: t('home.onboarding.testimonial1.author'),
      company: t('home.onboarding.testimonial1.company'),
      position: 1
    },
    {
      quote: t('home.onboarding.testimonial2.quote'),
      author: t('home.onboarding.testimonial2.author'),
      company: t('home.onboarding.testimonial2.company'),
      position: 2
    },
    {
      quote: t('home.onboarding.testimonial3.quote'),
      author: t('home.onboarding.testimonial3.author'),
      company: t('home.onboarding.testimonial3.company'),
      position: 4
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Clock className="h-4 w-4" />
            {t('home.onboarding.badge')}
          </motion.div>
          <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t('home.onboarding.title')}
          </motion.h2>
          <motion.p variants={itemVariants} className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('home.onboarding.subtitle')}
          </motion.p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('home.onboarding.progress.title')}
              </h3>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {t('home.onboarding.progress.total')}
              </span>
            </div>
            <div className="relative">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={inView ? { width: "100%" } : {}}
                  transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">{t('home.onboarding.progress.start')}</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">{t('home.onboarding.progress.live')}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="relative max-w-5xl mx-auto">
          {/* Vertical Line (Desktop) */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-purple-600 to-emerald-600" />

          {/* Steps */}
          {steps.map((step, index) => {
            const testimonial = testimonials.find(t => t.position === index);
            const Icon = step.icon;

            return (
              <React.Fragment key={index}>
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  className={`relative flex items-center mb-12 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Content */}
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                      <div className={`flex items-center gap-4 mb-4 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                        <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${step.color} text-white rounded-xl`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {step.title}
                          </h3>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {step.time}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Step Number (Center) */}
                  <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className={`w-12 h-12 bg-gradient-to-br ${step.color} text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg`}
                    >
                      {index + 1}
                    </motion.div>
                  </div>

                  {/* Mobile Step Number */}
                  <div className="md:hidden absolute -left-4 top-6">
                    <div className={`w-8 h-8 bg-gradient-to-br ${step.color} text-white rounded-full flex items-center justify-center font-bold text-sm`}>
                      {index + 1}
                    </div>
                  </div>

                  {/* Empty space for desktop layout */}
                  <div className="hidden md:block flex-1" />
                </motion.div>

                {/* Testimonial */}
                {testimonial && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: index * 0.2 + 0.1, duration: 0.6 }}
                    className="mb-12 max-w-3xl mx-auto"
                  >
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-6 relative">
                      <Quote className="absolute top-4 left-4 h-8 w-8 text-purple-200 dark:text-purple-700" />
                      <div className="relative z-10 pl-8">
                        <p className="text-gray-700 dark:text-gray-300 italic mb-4">
                          "{testimonial.quote}"
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {testimonial.author}
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            • {testimonial.company}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1, duration: 0.6 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {t('home.onboarding.cta.title')}
            </h3>
            <p className="text-white/90 mb-6">
              {t('home.onboarding.cta.subtitle')}
            </p>
            <button
              onClick={() => setShowBookingModal(true)}
              className="inline-flex items-center gap-2 bg-white text-purple-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              {t('home.onboarding.cta.button')}
              <ArrowRight className="h-5 w-5" />
            </button>
            <div className="mt-4 flex items-center justify-center gap-4 text-white/80 text-sm">
              <span className="flex items-center gap-1">
                <Check className="h-4 w-4" />
                {t('home.onboarding.cta.feature1')}
              </span>
              <span className="flex items-center gap-1">
                <Check className="h-4 w-4" />
                {t('home.onboarding.cta.feature2')}
              </span>
              <span className="flex items-center gap-1">
                <Check className="h-4 w-4" />
                {t('home.onboarding.cta.feature3')}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Booking Modal */}
      <BookingModal isOpen={showBookingModal} onClose={() => setShowBookingModal(false)} />
    </section>
  );
};

export default OnboardingFlow;