import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar, Clock, Shield, Euro, Users, CheckCircle,
  Phone, TrendingUp, ArrowRight, ChevronRight,
  Coffee, Building, Heart, Star, Zap, Award, Calculator
} from 'lucide-react';
import ROICalculatorSimplified from '../../components/ROICalculatorSimplified';
import { getSmartCTA } from '../../utils/smartCTA';
import { useLanguage } from '../../providers/LanguageProvider';

const BookingSystems: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  // Service navigation tabs
  const serviceNav = [
    { name: t('services.booking.title'), path: '/services/booking-systems', active: true },
    { name: t('services.web.title'), path: '/services/web-development', active: false },
    { name: t('services.automation.title'), path: '/services/business-automation', active: false }
  ];

  // German-specific features
  const germanFeatures = [
    {
      icon: Coffee,
      title: t('services.booking.features.mittagspause.title'),
      description: t('services.booking.features.mittagspause.description')
    },
    {
      icon: Calendar,
      title: t('bookingSystemsPage.germanHolidaysIntegrated'),
      description: t('bookingSystemsPage.allFederalStateHolidays')
    },
    {
      icon: Shield,
      title: t('bookingSystemsPage.gdprCompliant'),
      description: t('bookingSystemsPage.builtToGermanDataProtection')
    },
    {
      icon: Clock,
      title: t('bookingSystemsPage.punctualityBuiltIn'),
      description: t('bookingSystemsPage.preciseTimeSlots')
    }
  ];

  // Industry examples
  const industries = [
    {
      icon: Building,
      title: t('bookingSystemsPage.restaurantsCafes'),
      features: [
        t('bookingSystemsPage.tableReservations'),
        t('bookingSystemsPage.deliveryPickup'),
        t('bookingSystemsPage.specialEventBookings'),
        t('bookingSystemsPage.kitchenCapacityManagement')
      ],
      metric: t('bookingSystemsPage.fewerPhoneReservations')
    },
    {
      icon: Heart,
      title: t('bookingSystemsPage.beautyWellness'),
      features: [
        t('bookingSystemsPage.staffScheduling'),
        t('bookingSystemsPage.serviceDurationManagement'),
        t('bookingSystemsPage.packageComboBookings'),
        t('bookingSystemsPage.clientPreferenceTracking')
      ],
      metric: t('bookingSystemsPage.moreBookingsPerMonth')
    },
    {
      icon: Users,
      title: t('bookingSystemsPage.medicalHealthcare'),
      features: [
        t('bookingSystemsPage.patientAppointmentScheduling'),
        t('bookingSystemsPage.automatedReminderSystem'),
        t('bookingSystemsPage.prescriptionRenewalRequests'),
        t('bookingSystemsPage.emergencySlotManagement')
      ],
      metric: t('bookingSystemsPage.reductionInNoShows')
    }
  ];

  // Case studies
  const caseStudies = [
    {
      business: 'Salon Marie Stuttgart',
      industry: 'Beauty Salon',
      challenge: 'Spending 3 hours daily on phone bookings',
      solution: 'Implemented online booking with staff management',
      results: [
        '75% reduction in phone calls',
        '40% increase in new customers'
      ]
    },
    {
      business: 'Dr. Schmidt Praxis',
      industry: 'Medical Practice',
      challenge: 'High no-show rate affecting revenue',
      solution: 'Automated reminders and online rescheduling',
      results: [
        '90% online booking adoption',
        'Improved revenue recovery',
        '95% patient satisfaction score'
      ]
    },
    {
      business: 'Restaurant Zum Löwen',
      industry: 'Restaurant',
      challenge: 'Double bookings and table management chaos',
      solution: 'Digital floor plan with real-time availability',
      results: [
        '100% booking accuracy',
        '25% increase in table turnover',
        'Significant revenue increase'
      ]
    }
  ];

  // Pricing tiers
  const pricingTiers = [
    {
      name: 'Starter',
      price: '99',
      features: [
        'Up to 100 bookings/month',
        'Basic calendar integration',
        'Email confirmations',
        'Mobile responsive',
        'German holidays included'
      ]
    },
    {
      name: 'Professional',
      price: '199',
      popular: true,
      features: [
        'Unlimited bookings',
        'Staff management',
        'SMS reminders',
        'Payment integration',
        'Custom branding',
        'Analytics dashboard'
      ]
    },
    {
      name: 'Enterprise',
      price: '299',
      features: [
        'Everything in Professional',
        'Multi-location support',
        'API access',
        'Priority support',
        'Custom integrations',
        'Dedicated account manager'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-orange-900/20 to-gray-900">
      {/* Service Navigation */}
      <section className="pt-24 px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {serviceNav.map((service) => (
              <Link
                key={service.path}
                to={service.path}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  service.active
                    ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg'
                    : 'bg-white/10 backdrop-blur-xl text-white/80 hover:bg-white/20 border border-white/10'
                }`}
              >
                {service.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600/20 to-amber-600/20 backdrop-blur-xl border border-white/10 rounded-full mb-6">
            <Calendar className="w-4 h-4 text-orange-400" />
            <span className="text-sm text-orange-300">Smart Booking Solutions</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Smart Booking Systems for<br />
            <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
              German Business
            </span>
          </h1>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Eliminate phone bookings forever. Our intelligent scheduling system understands 
            Mittagspause, respects Feiertage, and runs your calendar the German way.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {(() => {
              const primaryCTA = getSmartCTA('booking-hero', 'primary', 'en');
              const secondaryCTA = getSmartCTA('booking-hero', 'secondary', 'en');
              return (
                <>
                  <button
                    onClick={primaryCTA.action}
                    className={`inline-flex items-center gap-2 px-8 py-4 ${primaryCTA.style} rounded-full font-semibold text-lg transition-all duration-300`}
                  >
                    {primaryCTA.icon && <primaryCTA.icon className="w-5 h-5" />}
                    {primaryCTA.text}
                    {!primaryCTA.icon && <ArrowRight className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={secondaryCTA.action}
                    className={`inline-flex items-center gap-2 px-8 py-4 ${secondaryCTA.style} rounded-full font-semibold text-lg transition-all duration-300`}
                  >
                    {secondaryCTA.icon && <secondaryCTA.icon className="w-5 h-5" />}
                    {secondaryCTA.text}
                    {!secondaryCTA.icon && <Calculator className="w-5 h-5" />}
                  </button>
                </>
              );
            })()}
          </div>
        </motion.div>
      </section>

      {/* German-Specific Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Built for How German Business Actually Works
            </h2>
            <p className="text-xl text-gray-300">
              Not just translated - truly designed for German operations
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {germanFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-orange-500/30 transition-all duration-300"
                >
                  <Icon className="w-10 h-10 text-orange-400 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Industry Examples */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Perfect for Every Industry
            </h2>
            <p className="text-xl text-gray-300">
              Customized booking solutions for your specific needs
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {industries.map((industry, index) => {
              const Icon = industry.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-orange-500/30 transition-all duration-300"
                >
                  <div className="inline-flex p-3 rounded-2xl bg-gradient-to-r from-orange-600/20 to-amber-600/20 mb-6">
                    <Icon className="w-8 h-8 text-orange-400" />
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-4">
                    {industry.title}
                  </h3>
                  
                  <ul className="space-y-3 mb-6">
                    {industry.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                        <span className="text-gray-400 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                      <span className="text-green-400 font-semibold">{industry.metric}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <ROICalculatorSimplified />

      {/* Case Studies */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Real Results from Real Businesses
            </h2>
            <p className="text-xl text-gray-300">
              See how German businesses transformed their operations
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {caseStudies.map((study, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-subtle hover:shadow-hover transition-shadow duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{study.business}</h3>
                    <p className="text-sm text-gray-600">{study.industry}</p>
                  </div>
                  <Award className="w-8 h-8 text-yellow-400" />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Challenge</p>
                    <p className="text-sm text-gray-600">{study.challenge}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Solution</p>
                    <p className="text-sm text-gray-600">{study.solution}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Results</p>
                    <ul className="space-y-1">
                      {study.results.map((result, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Star className="w-4 h-4 text-yellow-400 mt-0.5" />
                          <span className="text-sm text-green-600">{result}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-300">
              Start small, scale as you grow
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative ${tier.popular ? 'scale-105' : ''}`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="px-3 py-1 bg-gradient-to-r from-orange-600 to-amber-600 text-white text-sm font-semibold rounded-full">
                      MOST POPULAR
                    </span>
                  </div>
                )}
                
                <div className={`h-full bg-white/5 backdrop-blur-xl rounded-3xl p-8 border ${
                  tier.popular ? 'border-orange-500/50' : 'border-white/10'
                }`}>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {tier.name}
                  </h3>
                  
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-white">€{tier.price}</span>
                    <span className="text-gray-400">/month</span>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                        <span className="text-gray-400 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {(() => {
                    const pricingCTA = getSmartCTA('booking-pricing', tier.popular ? 'primary' : 'secondary', 'en');
                    return (
                      <button
                        onClick={pricingCTA.action}
                        className={`w-full py-3 rounded-full font-semibold transition-all duration-300 ${
                          tier.popular
                            ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white hover:from-orange-700 hover:to-amber-700'
                            : 'bg-white/10 backdrop-blur-xl text-white hover:bg-white/20 border border-white/10'
                        }`}
                      >
                        {pricingCTA.text}
                      </button>
                    );
                  })()}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-r from-orange-600/20 to-amber-600/20 backdrop-blur-xl rounded-3xl p-12 border border-white/10 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Stop Losing Money to Phone Bookings
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join hundreds of German businesses saving thousands of euros every month
            </p>
            
            {(() => {
              const ctaCTA = getSmartCTA('booking-cta', 'primary', 'en');
              return (
                <button
                  onClick={ctaCTA.action}
                  className={`inline-flex items-center gap-2 px-8 py-4 ${ctaCTA.style} rounded-full font-semibold text-lg transition-all duration-300`}
                >
                  {ctaCTA.text}
                  <ArrowRight className="w-5 h-5" />
                </button>
              );
            })()}
            
            <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Setup in 5 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default BookingSystems;