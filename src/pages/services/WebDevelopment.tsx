import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Code2, Smartphone, Globe, Zap, Shield, Rocket,
  ArrowRight, Check, X, ChevronRight, Sparkles,
  Palette, Search, ShoppingCart, Users, TrendingUp,
  Clock, Euro, Star, Award, Github, Figma, Eye
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getSmartCTA } from '../../utils/smartCTA';
import WebsiteShowcase from '../../components/WebsiteShowcase';
import { useLanguage } from '../../providers/LanguageProvider';

const WebDevelopment: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const serviceTabs = [
    { id: 'overview', label: t('services.web.tabs.overview'), icon: Globe },
    { id: 'technologies', label: t('services.web.tabs.technologies'), icon: Code2 },
    { id: 'process', label: t('services.web.tabs.process'), icon: Rocket },
    { id: 'portfolio', label: t('services.web.tabs.portfolio'), icon: Award },
    { id: 'pricing', label: t('services.web.tabs.pricing'), icon: Euro }
  ];

  const technologies = [
    {
      category: t('services.web.tech.frontend'),
      items: ['React', 'Vue.js', 'Angular', 'Next.js', 'TypeScript', 'Tailwind CSS']
    },
    {
      category: t('services.web.tech.backend'),
      items: ['Node.js', 'Python', 'PHP', 'Ruby on Rails', 'Java', '.NET']
    },
    {
      category: t('services.web.tech.mobile'),
      items: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'PWA']
    },
    {
      category: t('services.web.tech.database'),
      items: ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Firebase']
    },
    {
      category: t('services.web.tech.cloud'),
      items: ['AWS', 'Google Cloud', 'Azure', 'Vercel', 'Netlify']
    },
    {
      category: t('services.web.tech.tools'),
      items: ['Docker', 'Kubernetes', 'CI/CD', 'Git', 'Webpack', 'Vite']
    }
  ];

  const developmentProcess = [
    {
      phase: 'Discovery',
      duration: '1-2 Wochen',
      activities: [
        'Requirements Analysis',
        'Competitive Research',
        'Tech Stack Selection',
        'Project Timeline'
      ]
    },
    {
      phase: 'Design',
      duration: '2-3 Wochen',
      activities: [
        'Wireframing',
        'UI/UX Design',
        'Prototyping',
        'Design System'
      ]
    },
    {
      phase: 'Development',
      duration: '4-8 Wochen',
      activities: [
        'Frontend Development',
        'Backend Development',
        'API Integration',
        'Testing'
      ]
    },
    {
      phase: 'Launch',
      duration: '1 Woche',
      activities: [
        'Deployment',
        'Performance Optimization',
        'SEO Setup',
        'Analytics Integration'
      ]
    }
  ];

  const portfolioProjects = [
    {
      name: 'E-Commerce Platform',
      client: 'Fashion Retailer',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
      tech: ['Next.js', 'Stripe', 'PostgreSQL'],
      results: [
        '250% Revenue Increase',
        '0.8s Load Time',
        '45% Higher Conversion'
      ]
    },
    {
      name: 'SaaS Dashboard',
      client: 'Analytics Startup',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
      tech: ['React', 'D3.js', 'Node.js'],
      results: [
        '10k+ Active Users',
        '99.9% Uptime',
        '4.8/5 User Rating'
      ]
    },
    {
      name: 'Mobile Banking App',
      client: 'FinTech Company',
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800',
      tech: ['React Native', 'GraphQL', 'AWS'],
      results: [
        '500k Downloads',
        'Bank-Level Security',
        '4.7 App Store Rating'
      ]
    }
  ];

  const pricingPlans = [
    {
      name: 'Landing Page',
      price: 'from €1,999',
      duration: '2-3 Wochen',
      features: [
        'Responsive Design',
        'SEO Optimization',
        'Contact Form',
        'Analytics Setup',
        'SSL Certificate',
        '3 Months Support'
      ],
      color: 'from-blue-600 to-cyan-600'
    },
    {
      name: 'Corporate Website',
      price: 'from €4,999',
      duration: '4-6 Wochen',
      features: [
        'Up to 15 Pages',
        'CMS Integration',
        'Multi-language',
        'Blog System',
        'Advanced SEO',
        '6 Months Support'
      ],
      color: 'from-purple-600 to-pink-600',
      popular: true
    },
    {
      name: 'E-Commerce',
      price: 'from €9,999',
      duration: '8-12 Wochen',
      features: [
        'Online Store',
        'Payment Integration',
        'Inventory Management',
        'Customer Accounts',
        'Shipping Integration',
        '12 Months Support'
      ],
      color: 'from-green-600 to-emerald-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-xl rounded-2xl border border-white/10 mb-6">
              <Code2 className="h-8 w-8 text-blue-400" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              {t('services.web.title')}
              <span className="block text-3xl md:text-4xl mt-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {t('services.web.subtitle')}
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              {t('services.web.description')}
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              {(() => {
                const primaryCTA = getSmartCTA('web-hero', 'primary', language);
                const secondaryCTA = getSmartCTA('web-hero', 'secondary', language);
                return (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={primaryCTA.action}
                      className={`px-8 py-4 ${primaryCTA.style} rounded-xl font-semibold transition-all duration-300 flex items-center gap-2`}
                    >
                      {primaryCTA.text}
                      {primaryCTA.icon ? <primaryCTA.icon className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={secondaryCTA.action}
                      className={`px-8 py-4 ${secondaryCTA.style} rounded-xl font-semibold transition-all duration-300 flex items-center gap-2`}
                    >
                      {secondaryCTA.text}
                      <ChevronRight className="h-5 w-5" />
                    </motion.button>
                  </>
                );
              })()}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Web Projects Section - Immediately Visible */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-xl rounded-full border border-white/10 mb-6">
              <Globe className="h-5 w-5 text-purple-400" />
              <span className="text-purple-400 font-semibold">{t('services.web.liveProjects')}</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t('services.web.featuredProjects')}
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover our award-winning projects 2024 & 2025
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600/20 to-yellow-600/20 backdrop-blur-xl rounded-full border border-orange-400/30">
                <Award className="h-5 w-5 text-orange-400" />
                <span className="text-orange-300 font-semibold">Klavierschule Glenn Miller - Best of 2024</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-full border border-purple-400/30">
                <Sparkles className="h-5 w-5 text-purple-400" />
                <span className="text-purple-300 font-semibold">33eye.de - Innovation 2025</span>
              </div>
            </div>
          </motion.div>

          {/* Website Showcase Component */}
          <div className="-mx-4 sm:-mx-6 lg:-mx-8">
            <WebsiteShowcase />
          </div>
        </div>
      </section>

      {/* Service Tabs Navigation */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4">
            {serviceTabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/10'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                {tab.label}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {[
                {
                  icon: Smartphone,
                  title: t('webDevelopmentPage.responsiveDesign'),
                  description: t('webDevelopmentPage.perfectDisplayAllDevices')
                },
                {
                  icon: Zap,
                  title: t('webDevelopmentPage.lightningFast'),
                  description: t('webDevelopmentPage.optimizedPerformance')
                },
                {
                  icon: Shield,
                  title: t('webDevelopmentPage.secureGdpr'),
                  description: t('webDevelopmentPage.highestSecurityStandards')
                },
                {
                  icon: Search,
                  title: t('webDevelopmentPage.seoOptimized'),
                  description: t('webDevelopmentPage.builtForSearchEngines')
                },
                {
                  icon: Palette,
                  title: t('webDevelopmentPage.modernDesign'),
                  description: t('webDevelopmentPage.contemporaryDesign')
                },
                {
                  icon: Users,
                  title: t('webDevelopmentPage.userCentric'),
                  description: t('webDevelopmentPage.intuitiveUserGuidance')
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-blue-500/30 transition-all duration-300"
                >
                  <feature.icon className="h-12 w-12 text-blue-400 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'technologies' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {technologies.map((tech, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
                >
                  <h3 className="text-xl font-semibold text-white mb-4">{tech.category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {tech.items.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-blue-300 rounded-lg text-sm border border-blue-500/30"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'process' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {developmentProcess.map((phase, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                      <span className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full text-white font-bold">
                        {index + 1}
                      </span>
                      {phase.phase}
                    </h3>
                    <span className="px-4 py-2 bg-blue-600/20 text-blue-300 rounded-lg">
                      {phase.duration}
                    </span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    {phase.activities.map((activity, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-gray-300">
                        <Check className="h-5 w-5 text-green-400" />
                        {activity}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'portfolio' && (
            <div className="-mx-4 sm:-mx-6 lg:-mx-8">
              <WebsiteShowcase />
            </div>
          )}

          {activeTab === 'pricing' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid md:grid-cols-3 gap-8"
            >
              {pricingPlans.map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative bg-white/5 backdrop-blur-xl rounded-2xl p-8 border ${
                    plan.popular ? 'border-blue-500/50' : 'border-white/10'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="px-4 py-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full text-sm font-semibold">
                        {'Popular'}
                      </span>
                    </div>
                  )}
                  
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="text-3xl font-bold text-white mb-2">
                    {plan.price}
                  </div>
                  <div className="text-gray-400 mb-6">{plan.duration}</div>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-gray-300">
                        <Check className="h-5 w-5 text-green-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  {(() => {
                    const pricingCTA = getSmartCTA('web-pricing', plan.popular ? 'primary' : 'secondary', 'en');
                    return (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={pricingCTA.action}
                        className={`w-full py-3 bg-gradient-to-r ${plan.color} text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300`}
                      >
                        {pricingCTA.text}
                      </motion.button>
                    );
                  })()}
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-xl rounded-3xl p-12 border border-white/10"
          >
            <Sparkles className="h-12 w-12 text-yellow-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t('webDevelopmentPage.readyForNextWebProject')}
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              {t('webDevelopmentPage.letsShowYourVision')}
            </p>
            {(() => {
              const ctaCTA = getSmartCTA('web-cta', 'primary', 'en');
              return (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={ctaCTA.action}
                  className={`px-8 py-4 ${ctaCTA.style} rounded-xl font-semibold transition-all duration-300 inline-flex items-center gap-2`}
                >
                  {ctaCTA.text}
                  <ArrowRight className="h-5 w-5" />
                </motion.button>
              );
            })()}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default WebDevelopment;