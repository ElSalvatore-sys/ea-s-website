import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Cpu, Zap, TrendingUp, Clock, Euro, Shield,
  ArrowRight, Check, ChevronRight, Sparkles,
  GitBranch, Database, Cloud, Bot, Brain,
  BarChart3, Package, Settings, Users, Award, Calculator
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getSmartCTA } from '../../utils/smartCTA';
import { useLanguage } from '../../providers/LanguageProvider';

const BusinessAutomation: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const serviceTabs = [
    { id: 'overview', label: t('services.automation.tabs.overview'), icon: Cpu },
    { id: 'solutions', label: t('services.automation.tabs.solutions'), icon: Package },
    { id: 'benefits', label: t('services.automation.tabs.benefits'), icon: TrendingUp },
    { id: 'case-studies', label: t('services.automation.tabs.caseStudies'), icon: Award },
    { id: 'pricing', label: t('services.automation.tabs.pricing'), icon: Euro }
  ];

  const automationSolutions = [
    {
      title: t('services.automation.solutions.workflow.title'),
      icon: GitBranch,
      description: t('services.automation.solutions.workflow.description'),
      examples: [
        'Invoice Processing',
        'Approval Workflows',
        'Data Synchronization',
        'Email Campaigns'
      ]
    },
    {
      title: t('services.automation.solutions.customer.title'),
      icon: Users,
      description: t('services.automation.solutions.customer.description'),
      examples: [
        'Contact Management',
        'Follow-up Sequences',
        'Quote Generation',
        'Pipeline Tracking'
      ]
    },
    {
      title: t('services.automation.solutions.integration.title'),
      icon: Database,
      description: t('services.automation.solutions.integration.description'),
      examples: [
        'API Connections',
        'Data Pipelines',
        'Real-time Sync',
        'Central Dashboard'
      ]
    },
    {
      title: 'Smart Analytics',
      icon: Brain,
      description: 'Data-driven insights for better decisions',
      examples: [
        'Predictive Forecasting',
        'Customer Support',
        'Pattern Recognition',
        'Trend Analysis'
      ]
    },
    {
      title: 'Reporting & Analytics',
      icon: BarChart3,
      description: 'Automated reports and real-time dashboards',
      examples: [
        'KPI Dashboards',
        'Automated Reports',
        'Data Visualization',
        'Performance Tracking'
      ]
    },
    {
      title: 'Cloud & Infrastructure',
      icon: Cloud,
      description: 'Scalable cloud solutions and DevOps',
      examples: [
        'CI/CD Pipelines',
        'Infrastructure as Code',
        'Auto-scaling',
        'Monitoring & Alerts'
      ]
    }
  ];

  const benefits = [
    {
      metric: '75% Time Savings',
      description: 'Drastically reduce manual work'
    },
    {
      metric: '40% Cost Reduction',
      description: 'Sustainably lower operational costs'
    },
    {
      metric: '99.9% Accuracy',
      description: 'Eliminate human errors'
    },
    {
      metric: '24/7 Operation',
      description: 'Processes run around the clock'
    },
    {
      metric: '5x Scalability',
      description: 'Grow without additional resources'
    },
    {
      metric: 'ROI < 6 Months',
      description: 'Quick return on investment'
    }
  ];

  const caseStudies = [
    {
      company: 'Logistics Company',
      challenge: 'Manual order processing led to delays',
      solution: 'Automated order processing with smart route optimization',
      results: [
        '85% faster processing',
        '60% fewer errors',
        '€200k savings/year'
      ],
      color: 'from-purple-600 to-pink-600'
    },
    {
      company: 'E-Commerce Retailer',
      challenge: 'Inefficient inventory management and manual price adjustments',
      solution: 'Automatic inventory management with dynamic pricing',
      results: [
        '35% higher margin',
        '50% less overstock',
        '3x ROI in 4 months'
      ],
      color: 'from-blue-600 to-cyan-600'
    },
    {
      company: 'Financial Services',
      challenge: 'Slow credit approvals and high compliance costs',
      solution: 'Smart risk assessment and automated compliance workflows',
      results: [
        '90% faster approval',
        '70% lower compliance costs',
        '25% more closures'
      ],
      color: 'from-green-600 to-emerald-600'
    }
  ];

  const pricingPlans = [
    {
      name: 'Automation Starter',
      price: '€999/Monat',
      description: 'For small teams and first automations',
      features: [
        'Up to 5 workflows',
        '1,000 executions/month',
        'Standard integrations',
        'Email support',
        'Basic analytics'
      ],
      color: 'from-blue-600 to-cyan-600'
    },
    {
      name: 'Business Pro',
      price: '€2.499/Monat',
      description: 'For growing companies with complex processes',
      features: [
        'Unlimited workflows',
        '10,000 executions/month',
        'Premium integrations',
        'Priority support',
        'Advanced analytics',
        'Custom API access'
      ],
      color: 'from-purple-600 to-pink-600',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'Tailored solutions for large enterprises',
      features: [
        'Everything unlimited',
        'Dedicated infrastructure',
        'Custom development',
        '24/7 Support & SLA',
        'On-premise option',
        'Personal success manager'
      ],
      color: 'from-green-600 to-emerald-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-2xl border border-white/10 mb-6">
              <Cpu className="h-8 w-8 text-purple-400" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              {'Smart Business Automation'}
              <span className="block text-3xl md:text-4xl mt-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {'Work Smarter, Not Harder'}
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Save 20+ hours per week. Automate repetitive tasks, connect your tools, and let smart workflows handle the rest while you focus on growth.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              {(() => {
                const primaryCTA = getSmartCTA('automation-hero', 'primary', 'en');
                const secondaryCTA = getSmartCTA('automation-hero', 'secondary', 'en');
                return (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={primaryCTA.action}
                      className={`px-8 py-4 ${primaryCTA.style} rounded-xl font-semibold transition-all duration-300 flex items-center gap-2`}
                    >
                      {primaryCTA.text}
                      <ArrowRight className="h-5 w-5" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={secondaryCTA.action}
                      className={`px-8 py-4 ${secondaryCTA.style} rounded-xl font-semibold transition-all duration-300 flex items-center gap-2`}
                    >
                      {secondaryCTA.icon && <secondaryCTA.icon className="h-5 w-5" />}
                      {secondaryCTA.text}
                      {!secondaryCTA.icon && <Calculator className="h-5 w-5" />}
                    </motion.button>
                  </>
                );
              })()}
            </div>

            {/* Trust Badge */}
            <div className="mt-8 flex items-center justify-center gap-2 text-gray-400">
              <Shield className="h-5 w-5" />
              <span className="text-sm">
                GDPR compliant • ISO 27001 certified • Made in Germany
              </span>
            </div>
          </motion.div>
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
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25'
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
              {automationSolutions.map((solution, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-300"
                >
                  <solution.icon className="h-12 w-12 text-purple-400 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">{solution.title}</h3>
                  <p className="text-gray-400 mb-4">{solution.description}</p>
                  <ul className="space-y-2">
                    {solution.examples.map((example, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-gray-300 text-sm">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                        {example}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'solutions' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Integration Partners */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-6">
                  {'Seamless Integration with Your Tools'}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {['Salesforce', 'SAP', 'Microsoft 365', 'Slack', 'Google Workspace', 'Shopify', 
                    'HubSpot', 'Stripe', 'QuickBooks', 'Zendesk', 'Jira', 'AWS'].map((tool) => (
                    <div
                      key={tool}
                      className="bg-white/10 rounded-lg p-3 text-center text-gray-300 hover:bg-white/20 transition-all duration-300"
                    >
                      {tool}
                    </div>
                  ))}
                </div>
              </div>

              {/* Process Flow */}
              <div className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/20">
                <h3 className="text-2xl font-bold text-white mb-6">
                  {'Our Implementation Process'}
                </h3>
                <div className="grid md:grid-cols-4 gap-4">
                  {[
                    { step: 1, title: 'Analysis', time: '1 Woche' },
                    { step: 2, title: 'Design', time: '2 Wochen' },
                    { step: 3, title: 'Development', time: '4-8 Wochen' },
                    { step: 4, title: 'Optimization', time: 'Laufend' }
                  ].map((phase) => (
                    <div key={phase.step} className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
                        {phase.step}
                      </div>
                      <h4 className="text-white font-semibold mb-1">{phase.title}</h4>
                      <p className="text-gray-400 text-sm">{phase.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'benefits' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20"
                >
                  <div className="text-3xl font-bold text-white mb-2">{benefit.metric}</div>
                  <p className="text-gray-300">{benefit.description}</p>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'case-studies' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {caseStudies.map((study, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10"
                >
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-4">{study.company}</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-purple-400 font-semibold mb-2">
                            {'Challenge:'}
                          </h4>
                          <p className="text-gray-300">{study.challenge}</p>
                        </div>
                        <div>
                          <h4 className="text-purple-400 font-semibold mb-2">
                            {'Solution:'}
                          </h4>
                          <p className="text-gray-300">{study.solution}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className={`bg-gradient-to-r ${study.color} p-8 rounded-2xl w-full`}>
                        <h4 className="text-white font-semibold mb-4">
                          {'Results:'}
                        </h4>
                        <ul className="space-y-3">
                          {study.results.map((result, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-white">
                              <Check className="h-5 w-5 text-green-400" />
                              <span className="font-semibold">{result}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
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
                    plan.popular ? 'border-purple-500/50' : 'border-white/10'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="px-4 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm font-semibold">
                        {'Popular'}
                      </span>
                    </div>
                  )}
                  
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="text-3xl font-bold text-white mb-2">
                    {plan.price}
                  </div>
                  <p className="text-gray-400 mb-6">{plan.description}</p>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-gray-300">
                        <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  {(() => {
                    const pricingCTA = getSmartCTA('automation-pricing', plan.popular ? 'primary' : 'secondary', 'en');
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

      {/* ROI Calculator CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-xl rounded-3xl p-12 border border-white/10 text-center"
          >
            <Bot className="h-12 w-12 text-yellow-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Calculate Your Savings Potential
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Discover how much time and money you can save with automation.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              {(() => {
                const ctaCTA = getSmartCTA('automation-cta', 'primary', 'en');
                return (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={ctaCTA.action}
                    className={`px-8 py-4 ${ctaCTA.style} rounded-xl font-semibold transition-all duration-300 inline-flex items-center gap-2`}
                  >
                    {ctaCTA.text}
                    <TrendingUp className="h-5 w-5" />
                  </motion.button>
                );
              })()}
              
              <Link
                to="/approach"
                className="px-8 py-4 bg-white/10 backdrop-blur-xl text-white rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 inline-flex items-center gap-2 border border-white/20"
              >
                {'Our Approach'}
                <ChevronRight className="h-5 w-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default BusinessAutomation;