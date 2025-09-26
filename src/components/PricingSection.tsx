/**
 * PricingSection Component
 * Displays pricing tiers with monthly/yearly toggle and payment integration preparation
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../providers/LanguageProvider';
import { 
  Check, 
  X, 
  Sparkles, 
  ArrowRight, 
  Shield,
  Zap,
  Building,
  Users,
  Mail,
  MessageSquare,
  BarChart3,
  Code,
  Headphones,
  Award,
  FileText,
  Download,
  HelpCircle,
  CreditCard,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { analytics } from '../lib/analytics';

interface PricingTier {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  limitations?: string[];
  isPopular?: boolean;
  icon: React.ElementType;
  color: string;
}

const PricingSection: React.FC = () => {
  const { t } = useLanguage();
  const [isYearly, setIsYearly] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Track pricing interactions
  const handlePricingToggle = (yearly: boolean) => {
    setIsYearly(yearly);
    analytics.trackEvent('pricing_toggle', {
      billingPeriod: yearly ? 'yearly' : 'monthly',
      potentialSavings: yearly ? '20%' : '0%'
    });
  };

  const handleStartTrial = (tierId: string, price: number) => {
    analytics.trackEvent('pricing_cta_click', {
      tier: tierId,
      billingPeriod: isYearly ? 'yearly' : 'monthly',
      price: price,
      action: 'start_trial'
    });
    
    // Stripe integration preparation (commented for future implementation)
    /*
    // Initialize Stripe
    const stripe = window.Stripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
    
    // Create checkout session
    fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        priceId: isYearly ? `${tierId}_yearly` : `${tierId}_monthly`,
        tier: tierId,
        billingPeriod: isYearly ? 'yearly' : 'monthly'
      })
    })
    .then(res => res.json())
    .then(session => {
      // Redirect to Stripe Checkout
      stripe.redirectToCheckout({ sessionId: session.id });
    });
    */
    
    // For now, trigger booking modal
    window.dispatchEvent(new Event('openBookingModal'));
  };

  const pricingTiers: PricingTier[] = [
    {
      id: 'starter',
      name: 'Digital Starter',
      description: t('pricing.starter.description'),
      monthlyPrice: 299,
      yearlyPrice: 249,
      icon: Zap,
      color: 'from-gray-600 to-gray-700',
      features: [
        t('pricing.starter.features.bookings'),
        t('pricing.starter.features.website'),
        t('pricing.starter.features.support'),
        t('pricing.starter.features.analytics'),
        t('pricing.starter.features.updates')
      ],
      limitations: [
        t('pricing.starter.limitations.customization'),
        t('pricing.starter.limitations.integrations'),
        t('pricing.starter.limitations.priority')
      ]
    },
    {
      id: 'growth',
      name: 'Business Growth',
      description: t('pricing.growth.description'),
      monthlyPrice: 599,
      yearlyPrice: 499,
      isPopular: true,
      icon: Award,
      color: 'from-purple-600 to-blue-600',
      features: [
        t('pricing.growth.features.everything'),
        t('pricing.growth.features.customization'),
        t('pricing.growth.features.integrations'),
        t('pricing.growth.features.priority'),
        t('pricing.growth.features.automation'),
        t('pricing.growth.features.training'),
        t('pricing.growth.features.multisite'),
        t('pricing.growth.features.api')
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise Complete',
      description: t('pricing.scale.description'),
      monthlyPrice: 999,
      yearlyPrice: 833,
      icon: Building,
      color: 'from-blue-600 to-cyan-600',
      features: [
        t('pricing.scale.features.everything'),
        t('pricing.scale.features.whitelabel'),
        t('pricing.scale.features.dedicated'),
        t('pricing.scale.features.sla'),
        t('pricing.scale.features.custom'),
        t('pricing.scale.features.onsite'),
        t('pricing.scale.features.priority'),
        t('pricing.scale.features.unlimited')
      ]
    }
  ];

  const comparisonFeatures = [
    { key: 'bookings', label: t('pricing.comparison.bookings'), starter: '500/month', growth: 'Unlimited', enterprise: 'Unlimited' },
    { key: 'websites', label: t('pricing.comparison.websites'), starter: '1', growth: '1', enterprise: 'Unlimited' },
    { key: 'support', label: t('pricing.comparison.support'), starter: 'Email', growth: 'Priority Phone + Email', enterprise: 'Dedicated Manager' },
    { key: 'analytics', label: t('pricing.comparison.analytics'), starter: 'Basic', growth: 'Advanced', enterprise: 'Custom Reports' },
    { key: 'api', label: t('pricing.comparison.api'), starter: false, growth: true, enterprise: true },
    { key: 'customization', label: t('pricing.comparison.customization'), starter: 'Templates', growth: 'Custom Design', enterprise: 'White-Label' },
    { key: 'integrations', label: t('pricing.comparison.integrations'), starter: 'Essential', growth: 'Marketing Tools', enterprise: 'Custom' },
    { key: 'sla', label: t('pricing.comparison.sla'), starter: false, growth: '99%', enterprise: '99.9%' },
    { key: 'training', label: t('pricing.comparison.training'), starter: 'Documentation', growth: 'Online', enterprise: 'On-site' },
    { key: 'updates', label: t('pricing.comparison.updates'), starter: 'Monthly', growth: 'Weekly', enterprise: 'Priority' }
  ];

  const faqs = [
    {
      question: t('pricing.faq.contract.question'),
      answer: t('pricing.faq.contract.answer')
    },
    {
      question: t('pricing.faq.cancellation.question'),
      answer: t('pricing.faq.cancellation.answer')
    },
    {
      question: t('pricing.faq.dataExport.question'),
      answer: t('pricing.faq.dataExport.answer')
    },
    {
      question: t('pricing.faq.payment.question'),
      answer: t('pricing.faq.payment.answer')
    },
    {
      question: t('pricing.faq.upgrade.question'),
      answer: t('pricing.faq.upgrade.answer')
    }
  ];

  const calculateSavings = (monthly: number, yearly: number) => {
    const yearlyCost = yearly * 12;
    const monthlyCost = monthly * 12;
    return monthlyCost - yearlyCost;
  };

  return (
    <section className="py-32 relative bg-gradient-to-b from-black via-purple-950/10 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            {t('pricing.title')}
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            {t('pricing.subtitle')}
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-lg ${!isYearly ? 'text-white' : 'text-gray-400'}`}>
              {t('pricing.monthly')}
            </span>
            <button
              onClick={() => handlePricingToggle(!isYearly)}
              className="relative w-20 h-10 bg-gray-700 rounded-full p-1 transition-colors duration-300"
              aria-label="Toggle billing period"
            >
              <motion.div
                className="absolute top-1 w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full shadow-lg"
                animate={{ left: isYearly ? '44px' : '4px' }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              />
            </button>
            <span className={`text-lg ${isYearly ? 'text-white' : 'text-gray-400'}`}>
              {t('pricing.yearly')}
            </span>
            {isYearly && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="ml-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium"
              >
                {t('pricing.save20')}
              </motion.span>
            )}
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {pricingTiers.map((tier, index) => {
            const IconComponent = tier.icon;
            const currentPrice = isYearly ? tier.yearlyPrice : tier.monthlyPrice;
            const savings = isYearly ? calculateSavings(tier.monthlyPrice, tier.yearlyPrice) : 0;

            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onHoverStart={() => setHoveredCard(tier.id)}
                onHoverEnd={() => setHoveredCard(null)}
                className="relative"
              >
                {/* Popular Badge */}
                {tier.isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="px-4 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium rounded-full shadow-lg"
                    >
                      <Sparkles className="w-4 h-4 inline mr-1" />
                      {t('pricing.mostPopular')}
                    </motion.div>
                  </div>
                )}

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`relative h-full bg-white/5 backdrop-blur-xl rounded-2xl border ${
                    tier.isPopular ? 'border-purple-500/50' : 'border-white/10'
                  } p-8 overflow-hidden`}
                >
                  {/* Hover Gradient Effect */}
                  <AnimatePresence>
                    {hoveredCard === tier.id && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`absolute inset-0 bg-gradient-to-br ${tier.color} opacity-5`}
                      />
                    )}
                  </AnimatePresence>

                  {/* Icon */}
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${tier.color} mb-6`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  {/* Tier Name & Description */}
                  <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                  <p className="text-gray-400 mb-6">{tier.description}</p>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline">
                      <span className="text-5xl font-bold text-white">€{currentPrice}</span>
                      <span className="text-gray-400 ml-2">/{t('pricing.month')}</span>
                    </div>
                    {isYearly && savings > 0 && (
                      <p className="text-green-400 text-sm mt-2">
                        {t('pricing.saveAmount', { amount: savings })}
                      </p>
                    )}
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleStartTrial(tier.id, currentPrice)}
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
                      tier.isPopular
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg hover:shadow-purple-500/25'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    } group`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      {t('pricing.startTrial')}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>

                  {/* No Credit Card Badge */}
                  <p className="text-center text-sm text-gray-400 mt-3 flex items-center justify-center gap-1">
                    <CreditCard className="w-4 h-4" />
                    {t('pricing.noCreditCard')}
                  </p>

                  {/* Features List */}
                  <div className="mt-8 pt-8 border-t border-white/10">
                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
                      {t('pricing.includedFeatures')}
                    </h4>
                    <ul className="space-y-3">
                      {tier.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Limitations */}
                    {tier.limitations && tier.limitations.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
                          {t('pricing.notIncluded')}
                        </h4>
                        <ul className="space-y-3">
                          {tier.limitations.map((limitation, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <X className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-500 text-sm">{limitation}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            {t('pricing.compareFeatures')}
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 text-gray-400 font-medium">
                    {t('pricing.features')}
                  </th>
                  <th className="text-center py-4 px-4">
                    <div className="text-white font-medium">{t('pricing.starter.name')}</div>
                    <div className="text-gray-400 text-sm">€{isYearly ? 47 : 59}/{t('pricing.month')}</div>
                  </th>
                  <th className="text-center py-4 px-4">
                    <div className="text-white font-medium">{t('pricing.professional.name')}</div>
                    <div className="text-gray-400 text-sm">€{isYearly ? 79 : 99}/{t('pricing.month')}</div>
                  </th>
                  <th className="text-center py-4 px-4">
                    <div className="text-white font-medium">{t('pricing.enterprise.name')}</div>
                    <div className="text-gray-400 text-sm">€{isYearly ? 119 : 149}/{t('pricing.month')}</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, idx) => (
                  <tr key={feature.key} className="border-b border-white/5">
                    <td className="py-4 px-4 text-gray-300">{feature.label}</td>
                    <td className="text-center py-4 px-4">
                      {typeof feature.starter === 'boolean' ? (
                        feature.starter ? (
                          <Check className="w-5 h-5 text-green-400 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-gray-500 mx-auto" />
                        )
                      ) : (
                        <span className="text-gray-300">{feature.starter}</span>
                      )}
                    </td>
                    <td className="text-center py-4 px-4">
                      {typeof feature.professional === 'boolean' ? (
                        feature.professional ? (
                          <Check className="w-5 h-5 text-green-400 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-gray-500 mx-auto" />
                        )
                      ) : (
                        <span className="text-gray-300">{feature.professional}</span>
                      )}
                    </td>
                    <td className="text-center py-4 px-4">
                      {typeof feature.enterprise === 'boolean' ? (
                        feature.enterprise ? (
                          <Check className="w-5 h-5 text-green-400 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-gray-500 mx-auto" />
                        )
                      ) : (
                        <span className="text-gray-300">{feature.enterprise}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* FAQs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            {t('pricing.faq.title')}
          </h3>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <span className="text-white font-medium">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: expandedFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <HelpCircle className="w-5 h-5 text-gray-400" />
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
                      <p className="text-gray-400">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <p className="text-gray-400 mb-4">
            {t('pricing.customNeeds')}
          </p>
          <button
            onClick={() => window.dispatchEvent(new Event('openBookingModal'))}
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 group"
          >
            <MessageSquare className="w-5 h-5" />
            {t('pricing.contactSales')}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;