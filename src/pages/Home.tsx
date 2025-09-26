import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar,
  Code,
  Zap,
  Check,
  ArrowRight,
  Globe,
  Shield,
  Users,
  Clock,
  Building,
  Rocket,
  ChevronRight,
  BarChart3,
  Cpu,
  Award,
  TrendingUp
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Home: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

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

  // Service Pillars
  const services = [
    {
      icon: Calendar,
      title: 'Intelligent Booking Systems',
      description: 'Eliminate phone bookings with German-smart scheduling',
      keyPoint: 'Respects Mittagspause & holidays automatically',
      color: 'from-purple-600 to-blue-600',
      link: '/demo-booking'
    },
    {
      icon: Code,
      title: 'Custom Websites & Apps',
      description: 'Professional digital presence that converts visitors',
      keyPoint: 'Mobile-first, SEO-optimized, lightning fast',
      color: 'from-blue-600 to-cyan-600',
      link: '/portfolio'
    },
    {
      icon: Zap,
      title: 'Process Automation',
      description: 'AI-powered tools to eliminate repetitive tasks',
      keyPoint: 'Save 20+ hours weekly on routine operations',
      color: 'from-cyan-600 to-green-600',
      link: '/solutions'
    }
  ];

  // Unified Benefits
  const benefits = [
    {
      icon: Building,
      title: 'German Business Logic Built-In',
      description: 'Holidays, hours, and culture understood perfectly'
    },
    {
      icon: Users,
      title: 'One Partner for All Digital Needs',
      description: 'No juggling vendors - everything under one roof'
    },
    {
      icon: Award,
      title: 'Proven Results Across Industries',
      description: '15+ happy clients from salon to enterprise'
    },
    {
      icon: Shield,
      title: 'Local Support, Global Standards',
      description: 'German support team, world-class technology'
    }
  ];

  // Portfolio items
  const portfolioItems = [
    {
      type: 'website',
      name: 'Klavierschule Glenmiller',
      url: 'klavierschule-glenmiller.de',
      metric: '2x Conversions',
      description: 'Modern music school website',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop'
    },
    {
      type: 'website',
      name: '33eye Design Studio',
      url: '33eye.de',
      metric: '150% Traffic Increase',
      description: 'Creative agency portfolio',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop'
    },
    {
      type: 'booking',
      name: 'Beauty Salon Pro',
      metric: '75% Fewer Calls',
      description: 'Automated appointment system',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop'
    },
    {
      type: 'booking',
      name: 'Medical Practice Plus',
      metric: '90% Online Bookings',
      description: 'Patient scheduling solution',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop'
    }
  ];

  // Pricing tiers
  const pricingTiers = [
    {
      name: 'Starter',
      price: '299',
      description: 'Perfect for small businesses',
      features: [
        'Booking System OR Website',
        'Up to 100 bookings/month',
        'Basic customization',
        'Email support',
        'Mobile responsive'
      ],
      highlighted: false
    },
    {
      name: 'Professional',
      price: '599',
      description: 'Growing businesses',
      features: [
        'Booking System + Website',
        'Unlimited bookings',
        'Full customization',
        'Priority support',
        'SEO optimization',
        'Analytics dashboard'
      ],
      highlighted: true
    },
    {
      name: 'Enterprise',
      price: '999',
      description: 'Complete digital transformation',
      features: [
        'Everything in Professional',
        '+ Business Automation',
        'Custom integrations',
        'Dedicated account manager',
        'Advanced AI features',
        'White-label options'
      ],
      highlighted: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        </div>

        <motion.div 
          className="relative max-w-7xl mx-auto text-center z-10"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Pre-headline */}
          <motion.div 
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full mb-6"
          >
            <Rocket className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-gray-300">
              DIGITAL EXCELLENCE • GERMAN ENGINEERING
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.h1 
            variants={fadeInUp}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
          >
            Digital Solutions Built for How<br />
            German Business Actually Works
          </motion.h1>

          {/* Subheadline */}
          <motion.p 
            variants={fadeInUp}
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12"
          >
            From smart booking systems to custom websites and business automation - 
            we understand Mittagspause, respect Feiertage, and speak your language
          </motion.p>

          {/* CTAs */}
          <motion.div 
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/solutions"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold text-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 group"
            >
              Explore Solutions
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-full font-semibold text-lg hover:bg-white/20 transition-all duration-300"
            >
              View Portfolio
              <ChevronRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Three Service Pillars */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Three Ways We Transform Your Business
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Choose one service or combine them all for maximum impact
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 rounded-3xl blur-xl transition-opacity duration-300"
                    style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }} />
                  
                  <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 h-full">
                    <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-r ${service.color} mb-6`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-4">
                      {service.title}
                    </h3>
                    
                    <p className="text-gray-300 mb-4">
                      {service.description}
                    </p>
                    
                    <div className="flex items-start gap-2 mb-6">
                      <Check className="w-5 h-5 text-green-400 mt-0.5" />
                      <span className="text-sm text-gray-400">
                        {service.keyPoint}
                      </span>
                    </div>
                    
                    <Link
                      to={service.link}
                      className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      Learn more
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Unified Benefits */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why German Businesses Choose EA Solutions
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We're not just another tech company - we're your local digital partner
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
                >
                  <Icon className="w-10 h-10 text-purple-400 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {benefit.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Portfolio Showcase */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Real Results for Real Businesses
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              From local shops to growing enterprises - see what we've built
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {portfolioItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10"
              >
                <div className="aspect-w-16 aspect-h-12 bg-gradient-to-br from-purple-600/20 to-blue-600/20 p-8 flex items-center justify-center">
                  {item.type === 'website' ? (
                    <Globe className="w-16 h-16 text-purple-400" />
                  ) : (
                    <Calendar className="w-16 h-16 text-blue-400" />
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs px-2 py-1 bg-purple-600/20 text-purple-400 rounded-full">
                      {item.type === 'website' ? 'Website' : 'Booking'}
                    </span>
                    <span className="text-xs px-2 py-1 bg-green-600/20 text-green-400 rounded-full font-semibold">
                      {item.metric}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {item.name}
                  </h3>
                  
                  {item.url && (
                    <p className="text-sm text-purple-400 mb-2">
                      {item.url}
                    </p>
                  )}
                  
                  <p className="text-sm text-gray-400">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-full font-semibold hover:bg-white/20 transition-all duration-300"
            >
              View Full Portfolio
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Single Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Start with what you need, scale as you grow
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
                className={`relative ${tier.highlighted ? 'scale-105' : ''}`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="px-3 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold rounded-full">
                      MOST POPULAR
                    </span>
                  </div>
                )}
                
                <div className={`h-full bg-white/5 backdrop-blur-xl rounded-3xl p-8 border ${
                  tier.highlighted ? 'border-purple-500/50' : 'border-white/10'
                }`}>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {tier.name}
                  </h3>
                  
                  <p className="text-gray-400 mb-6">
                    {tier.description}
                  </p>
                  
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-white">€{tier.price}</span>
                    <span className="text-gray-400">/month</span>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-400 mt-0.5" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button
                    onClick={() => navigate('/contact')}
                    className={`w-full py-3 rounded-full font-semibold transition-all duration-300 ${
                      tier.highlighted
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg hover:shadow-purple-500/25'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    Get Started
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-xl rounded-3xl p-12 border border-white/10">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join 15+ German businesses that have already modernized their operations with EA Solutions
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/contact')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold text-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
              >
                Start Your Journey
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/demo-booking')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-full font-semibold text-lg hover:bg-white/20 transition-all duration-300"
              >
                See Demo
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;