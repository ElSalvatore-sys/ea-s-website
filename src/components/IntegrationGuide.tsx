import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserPlus,
  Code,
  Globe,
  Copy,
  Check,
  HelpCircle,
  ChevronRight,
  Monitor,
  Smartphone,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle,
  ExternalLink
} from 'lucide-react';

const IntegrationGuide: React.FC = () => {
  const { t } = useTranslation();
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const embedCode = `<script src="https://ea-s.info/widget.js?business=YOUR_ID"></script>`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(embedCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const steps = [
    {
      number: 1,
      icon: UserPlus,
      title: t('integration_guide.step1.title'),
      description: t('integration_guide.step1.description'),
      color: 'from-purple-500 to-purple-600'
    },
    {
      number: 2,
      icon: Code,
      title: t('integration_guide.step2.title'),
      description: t('integration_guide.step2.description'),
      color: 'from-blue-500 to-blue-600'
    },
    {
      number: 3,
      icon: Globe,
      title: t('integration_guide.step3.title'),
      description: t('integration_guide.step3.description'),
      color: 'from-green-500 to-green-600'
    }
  ];

  const faqs = [
    {
      question: t('integration_guide.faq.q1'),
      answer: t('integration_guide.faq.a1')
    },
    {
      question: t('integration_guide.faq.q2'),
      answer: t('integration_guide.faq.a2')
    },
    {
      question: t('integration_guide.faq.q3'),
      answer: t('integration_guide.faq.a3')
    },
    {
      question: t('integration_guide.faq.q4'),
      answer: t('integration_guide.faq.a4')
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full text-purple-700 dark:text-purple-300 text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4 mr-2" />
            {t('integration_guide.badge')}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t('integration_guide.title')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('integration_guide.subtitle')}
          </p>
        </motion.div>

        {/* Steps Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setActiveStep(step.number)}
              className={`relative cursor-pointer group ${
                activeStep === step.number ? 'scale-105' : ''
              } transition-all duration-300`}
            >
              <div className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 ${
                activeStep === step.number ? 'ring-2 ring-purple-500' : ''
              }`}>
                {/* Step Number Badge */}
                <div className={`absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br ${step.color} text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg`}>
                  {step.number}
                </div>

                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon className="h-8 w-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {step.description}
                </p>

                {/* Arrow Indicator */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
                    <ChevronRight className="h-8 w-8 text-gray-400 dark:text-gray-600" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Code Snippet Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 mb-16 shadow-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">
              {t('integration_guide.code_snippet.title')}
            </h3>
            <button
              onClick={handleCopyCode}
              className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300"
            >
              <AnimatePresence mode="wait">
                {copiedCode ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="flex items-center"
                  >
                    <Check className="h-5 w-5 mr-2 text-green-400" />
                    <span className="text-green-400">{t('integration_guide.code_snippet.copied')}</span>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="flex items-center"
                  >
                    <Copy className="h-5 w-5 mr-2" />
                    <span>{t('integration_guide.code_snippet.copy')}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>

          {/* Code Display */}
          <div className="bg-black/30 rounded-lg p-6 overflow-x-auto">
            <pre className="text-sm md:text-base">
              <code className="language-html">
                <span className="text-gray-500">&lt;</span>
                <span className="text-purple-400">script</span>
                <span className="text-gray-500"> </span>
                <span className="text-green-400">src</span>
                <span className="text-gray-500">=</span>
                <span className="text-yellow-400">"https://ea-s.info/widget.js?business=YOUR_ID"</span>
                <span className="text-gray-500">&gt;&lt;/</span>
                <span className="text-purple-400">script</span>
                <span className="text-gray-500">&gt;</span>
              </code>
            </pre>
          </div>

          <p className="text-gray-400 text-sm mt-4">
            <AlertCircle className="inline h-4 w-4 mr-1" />
            {t('integration_guide.code_snippet.note')}
          </p>
        </motion.div>

        {/* Before/After Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h3 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            {t('integration_guide.before_after.title')}
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Before */}
            <div className="relative">
              <div className="absolute -top-3 left-4 bg-red-500 text-white px-4 py-1 rounded-full text-sm font-medium z-10">
                {t('integration_guide.before_after.before')}
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
                {/* Browser Bar */}
                <div className="bg-gray-100 dark:bg-gray-700 p-3 flex items-center space-x-2">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="flex-1 bg-white dark:bg-gray-600 rounded px-3 py-1 text-xs text-gray-600 dark:text-gray-300">
                    www.your-business.de
                  </div>
                </div>
                {/* Website Content */}
                <div className="p-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-[300px]">
                  <div className="space-y-4">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                    <div className="mt-8 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center">
                      <p className="text-gray-500 dark:text-gray-400">
                        {t('integration_guide.before_after.no_booking')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* After */}
            <div className="relative">
              <div className="absolute -top-3 left-4 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium z-10">
                {t('integration_guide.before_after.after')}
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
                {/* Browser Bar */}
                <div className="bg-gray-100 dark:bg-gray-700 p-3 flex items-center space-x-2">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="flex-1 bg-white dark:bg-gray-600 rounded px-3 py-1 text-xs text-gray-600 dark:text-gray-300">
                    www.your-business.de
                  </div>
                </div>
                {/* Website Content with Widget */}
                <div className="p-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-[300px]">
                  <div className="space-y-4">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                    <div className="mt-8">
                      {/* Mock Booking Widget */}
                      <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg p-6 text-white shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-semibold">{t('integration_guide.before_after.widget_title')}</h4>
                          <CheckCircle className="h-6 w-6" />
                        </div>
                        <div className="space-y-3">
                          <div className="bg-white/20 rounded p-2 text-sm">
                            {t('integration_guide.before_after.widget_demo')}
                          </div>
                          <button className="w-full bg-white text-purple-600 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                            {t('integration_guide.before_after.book_now')}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile View Preview */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-700 dark:text-blue-300 text-sm">
              <Smartphone className="h-4 w-4 mr-2" />
              {t('integration_guide.before_after.mobile_ready')}
            </div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
        >
          <div className="flex items-center mb-6">
            <HelpCircle className="h-8 w-8 text-purple-600 dark:text-purple-400 mr-3" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('integration_guide.faq.title')}
            </h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="font-medium text-gray-900 dark:text-white">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: expandedFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="h-5 w-5 text-gray-500 transform rotate-90" />
                  </motion.div>
                </button>
                
                <AnimatePresence>
                  {expandedFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-4"
                    >
                      <p className="text-gray-600 dark:text-gray-300">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Support Link */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-center text-gray-600 dark:text-gray-300">
              {t('integration_guide.faq.need_help')}{' '}
              <a href="/contact" className="text-purple-600 dark:text-purple-400 hover:underline inline-flex items-center">
                {t('integration_guide.faq.contact_support')}
                <ExternalLink className="h-4 w-4 ml-1" />
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default IntegrationGuide;