import React, { useEffect, useState } from 'react';
import { 
  Code, 
  Smartphone, 
  MessageSquare, 
  Calendar, 
  BarChart3, 
  Zap, 
  CheckCircle, 
  Star, 
  ArrowRight,
  ExternalLink,
  Globe,
  Palette,
  Shield,
  Users,
  TrendingUp,
  Clock,
  DollarSign,
  Play,
  Download,
  FileText,
  TestTube
} from 'lucide-react';
import { useLanguage } from '../providers/LanguageProvider';
import BundlePackages from '../components/BundlePackages';
import { useNavigate, Link } from 'react-router-dom';
import { ServiceDemo, QuickStats } from '../components/demos/ServiceDemos';

const Services: React.FC = () => {
  const [selectedPackage, setSelectedPackage] = useState('professional');
  const [billingCycle, setBillingCycle] = useState<'one-time' | 'monthly' | 'annual'>('one-time');
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const services = [
    // Core Services - Our Three Pillars
    {
      icon: Calendar,
      title: 'Smart Booking Systems',
      description: 'Professional booking systems designed specifically for German service businesses. Handle appointments, reduce no-shows, and save time.',
      features: [
        'German business hours & Mittagspause',
        'Automated reminders (SMS & Email)',
        'Payment integration',
        'Calendar synchronization',
        'Customer management',
        'Real-time availability'
      ],
      gradient: 'from-purple-500 to-blue-500',
      link: '/services/booking-systems',
      isPrimary: true
    },
    {
      icon: Code,
      title: 'Professional Website Development',
      description: 'Modern, conversion-focused websites that establish your professional online presence and bring in new customers.',
      features: [
        'Mobile-responsive design',
        'SEO optimization for German market',
        'Fast loading times',
        'Content management system',
        'GDPR compliant',
        'Analytics & tracking'
      ],
      gradient: 'from-blue-500 to-cyan-500',
      link: '/services/web-development',
      isPrimary: true
    },
    {
      icon: BarChart3,
      title: 'Business Automation Solutions',
      description: 'Smart automation that eliminates repetitive tasks, improves efficiency, and lets you focus on growing your business.',
      features: [
        'Workflow automation',
        'Customer communication',
        'Data synchronization',
        'Report generation',
        'Process optimization',
        'Integration with existing tools'
      ],
      gradient: 'from-green-500 to-emerald-500',
      link: '/services/business-automation',
      isPrimary: true
    },
    // Additional Services
    {
      icon: MessageSquare,
      title: 'Customer Support Automation',
      description: 'Intelligent support systems that handle customer inquiries automatically, 24/7.',
      features: [
        'Automated responses',
        'Multi-language support',
        'Ticket management',
        'FAQ automation',
        'Email integration',
        'Performance analytics'
      ],
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: Globe,
      title: 'E-commerce Solutions',
      description: 'Complete online shop solutions with inventory management and payment processing.',
      features: [
        'Product catalog',
        'Shopping cart',
        'Payment processing',
        'Inventory management',
        'Order tracking',
        'Customer accounts'
      ],
      gradient: 'from-pink-500 to-rose-500'
    },
    {
      icon: Smartphone,
      title: 'Mobile Solutions',
      description: 'Mobile-optimized solutions and progressive web apps for on-the-go access.',
      features: [
        'Progressive web apps',
        'Mobile optimization',
        'Offline functionality',
        'Push notifications',
        'Touch-optimized UI',
        'Cross-device sync'
      ],
      gradient: 'from-indigo-500 to-purple-500'
    }
  ];

  const packages = [
    {
      id: 'starter',
      name: 'Starter Package',
      price: '€2,999',
      originalPrice: '€4,999',
      savings: '€2,000',
      description: 'Perfect for small businesses and startups',
      features: [
        'Custom website (up to 5 pages)',
        'Mobile responsive design',
        'Basic SEO optimization',
        'Contact form integration',
        'Google Analytics setup',
        '3 months support',
        'Basic AI chatbot',
        'Social media integration'
      ],
      deliveryTime: '2-3 weeks',
      popular: false,
      gradient: 'from-gray-500 to-gray-600'
    },
    {
      id: 'professional',
      name: 'Professional Package',
      price: '€7,999',
      originalPrice: '€12,999',
      savings: '€5,000',
      description: 'Comprehensive solution for growing businesses',
      features: [
        'Custom website (up to 15 pages)',
        'Advanced AI chatbot with NLP',
        'Smart booking system',
        'Payment integration',
        'Advanced analytics dashboard',
        'CMS with training',
        '6 months support',
        'SEO optimization',
        'Performance optimization',
        'Security features'
      ],
      deliveryTime: '4-6 weeks',
      popular: true,
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      id: 'enterprise',
      name: 'Enterprise Package',
      price: '€19,999',
      originalPrice: '€34,999',
      savings: '€15,000',
      description: 'Complete digital transformation for large organizations',
      features: [
        'Custom web application',
        'Mobile app (iOS & Android)',
        'Advanced AI integration',
        'Custom booking system',
        'Business intelligence platform',
        'Multi-language support',
        '12 months support',
        'Staff training included',
        'API development',
        'Third-party integrations',
        'Advanced security',
        'Scalable architecture'
      ],
      deliveryTime: '8-12 weeks',
      popular: false,
      gradient: 'from-purple-600 to-pink-600'
    },
    {
      id: 'custom',
      name: 'Custom Solution',
      price: 'From €25,000',
      originalPrice: null,
      savings: null,
      description: 'Tailored solutions for unique requirements',
      features: [
        'Fully customized development',
        'Unlimited pages/features',
        'Advanced AI capabilities',
        'Custom integrations',
        'Dedicated project manager',
        'Priority support',
        'Ongoing maintenance',
        'Performance guarantees',
        'Scalability planning',
        'Security audits'
      ],
      deliveryTime: '12+ weeks',
      popular: false,
      gradient: 'from-indigo-600 to-purple-700'
    }
  ];

  const testimonials = [
    {
      name: 'Glenn Miller',
      role: 'Founder',
      company: 'Klavierschule Glenn Miller',
      quote: 'EA Solutions built us an incredible website with AI booking system. The intelligent scheduling has transformed our operations completely.',
      rating: 5,
      avatar: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=150',
      results: ['AI booking system', 'Automated scheduling', '40-60% cost savings']
    },
    {
      name: 'Hassan Arour',
      role: 'General Manager',
      company: 'Hotel am Kochbrunnen',
      quote: 'The website and booking system integration exceeded our expectations. Professional, efficient, and cost-effective.',
      rating: 5,
      avatar: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=150',
      results: ['Seamless integration', 'Professional design', 'Excellent support']
    },
    {
      name: 'Martin Schneider',
      role: 'Practice Owner',
      company: 'Falchi Dental',
      quote: 'The AI-powered patient management system has streamlined our entire practice. Outstanding quality at unbeatable prices.',
      rating: 5,
      avatar: 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=150',
      results: ['Patient management', 'Streamlined operations', 'Great value']
    }
  ];

  const process = [
    {
      step: '01',
      title: 'Discovery & Planning',
      description: 'We analyze your requirements, target audience, and business goals to create a comprehensive project plan.',
      duration: '1 week',
      icon: Users
    },
    {
      step: '02',
      title: 'Design & Prototyping',
      description: 'Our designers create stunning mockups and interactive prototypes for your approval.',
      duration: '1-2 weeks',
      icon: Palette
    },
    {
      step: '03',
      title: 'AI-Assisted Development',
      description: 'Our developers build your solution using AI-assisted coding for faster, more efficient development.',
      duration: '2-8 weeks',
      icon: Code
    },
    {
      step: '04',
      title: 'Testing & Optimization',
      description: 'Comprehensive testing ensures your solution works perfectly across all devices and scenarios.',
      duration: '1 week',
      icon: Shield
    },
    {
      step: '05',
      title: 'Launch & Support',
      description: 'We handle the launch and provide ongoing support to ensure your success.',
      duration: 'Ongoing',
      icon: Zap
    }
  ];

  return (
    <div className="min-h-screen pt-16 bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-20 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t('services.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto mb-8">
              {t('services.hero.subtitle')}
            </p>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-3xl mx-auto mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold mb-2">40-60%</div>
                  <div className="text-blue-100">{t('services.hero.stats.savings')}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">2-12</div>
                  <div className="text-blue-100">{t('services.hero.stats.delivery')}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">100%</div>
                  <div className="text-blue-100">{t('services.hero.stats.integration')}</div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-50 transition-colors duration-300 shadow-lg">
                {t('services.hero.cta.quote')}
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300">
                <Play className="mr-2 h-5 w-5 inline" />
                {t('services.hero.cta.portfolio')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Project */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('services.featured.title')}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('services.featured.subtitle')}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 lg:p-12">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center overflow-hidden shadow-lg">
                    <img 
                      src="https://klavierschule-glennmiller.de/wp-content/uploads/2024/12/cropped-Klavierschule-Glenn-Miller-Logo-32x32.png" 
                      alt="Klavierschule Glenn Miller logo"
                      className="w-8 h-8 object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.innerHTML = '<div class="w-8 h-8 bg-gradient-to-br from-gray-900 to-black rounded-lg flex items-center justify-center"><svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg></div>';
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{t('services.featured.piano.title')}</h3>
                    <p className="text-blue-600 dark:text-blue-400">{t('services.featured.piano.subtitle')}</p>
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  {t('services.featured.piano.description')}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { icon: Calendar, label: t('services.featured.features.booking'), color: 'text-blue-500' },
                    { icon: MessageSquare, label: t('services.featured.features.chatbot'), color: 'text-green-500' },
                    { icon: Users, label: t('services.featured.features.management'), color: 'text-purple-500' },
                    { icon: BarChart3, label: t('services.featured.features.analytics'), color: 'text-orange-500' }
                  ].map((feature, index) => {
                    const IconComponent = feature.icon;
                    return (
                      <div key={index} className="flex items-center space-x-2">
                        <IconComponent className={`h-5 w-5 ${feature.color}`} />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{feature.label}</span>
                      </div>
                    );
                  })}
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <a 
                    href="https://klavierschule-glennmiller.de" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    {t('services.featured.visit')}
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                  <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                    {t('services.featured.savings')}
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-8 lg:p-12 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎹</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Complete Success</div>
                  <div className="text-gray-600 dark:text-gray-400">AI-powered transformation</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('services.list.title')}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {t('services.list.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Code,
                title: t('services.development.title'),
                description: t('services.development.description'),
                features: [
                  t('services.development.features.assisted'),
                  t('services.development.features.responsive'),
                  t('services.development.features.seo'),
                  t('services.development.features.performance'),
                  t('services.development.features.cms'),
                  t('services.development.features.analytics')
                ],
                gradient: 'from-green-500 to-teal-600'
              },
              {
                icon: Smartphone,
                title: t('services.mobile.title'),
                description: t('services.mobile.description'),
                features: [
                  t('services.mobile.features.ios'),
                  t('services.mobile.features.crossplatform'),
                  t('services.mobile.features.ai'),
                  t('services.mobile.features.notifications'),
                  t('services.mobile.features.offline'),
                  t('services.mobile.features.optimization')
                ],
                gradient: 'from-green-500 to-teal-600'
              },
              {
                icon: MessageSquare,
                title: t('services.chatbots.title'),
                description: t('services.chatbots.description'),
                features: [
                  t('services.chatbots.features.nlp'),
                  t('services.chatbots.features.multilang'),
                  t('services.chatbots.features.integration'),
                  t('services.chatbots.features.support'),
                  t('services.chatbots.features.learning'),
                  t('services.chatbots.features.reporting')
                ],
                gradient: 'from-purple-500 to-pink-500'
              },
              {
                icon: Calendar,
                title: t('services.booking.title'),
                description: t('services.booking.description'),
                features: [
                  t('services.booking.features.availability'),
                  t('services.booking.features.scheduling'),
                  t('services.booking.features.payment'),
                  t('services.booking.features.reminders'),
                  t('services.booking.features.calendar'),
                  t('services.booking.features.dashboard')
                ],
                gradient: 'from-orange-500 to-red-600'
              },
              {
                icon: BarChart3,
                title: t('services.analytics.title'),
                description: t('services.analytics.description'),
                features: [
                  t('services.analytics.features.visualization'),
                  t('services.analytics.features.predictive'),
                  t('services.analytics.features.reporting'),
                  t('services.analytics.features.kpi'),
                  t('services.analytics.features.integration'),
                  t('services.analytics.features.mobile')
                ],
                gradient: 'from-indigo-500 to-purple-600'
              },
              {
                icon: Globe,
                title: t('services.ecommerce.title'),
                description: t('services.ecommerce.description'),
                features: [
                  t('services.ecommerce.features.catalog'),
                  t('services.ecommerce.features.recommendations'),
                  t('services.ecommerce.features.payment'),
                  t('services.ecommerce.features.inventory'),
                  t('services.ecommerce.features.tracking'),
                  t('services.ecommerce.features.analytics')
                ],
                gradient: 'from-pink-500 to-rose-600'
              }
            ].map((service, index) => {
              const IconComponent = service.icon;
              return (
                <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700">
                  <div className={`w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{service.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {/* Add interactive demo for specific services */}
                  {service.title.includes('Chatbot') && <ServiceDemo type="chatbot" />}
                  {service.title.includes('Booking') && <ServiceDemo type="booking" />}
                  {service.title.includes('Analytics') && (
                    <QuickStats 
                      stats={[
                        { value: '98%', label: 'Accuracy', icon: TrendingUp },
                        { value: '<50ms', label: 'Response', icon: Clock },
                        { value: '24/7', label: 'Uptime', icon: Shield }
                      ]} 
                    />
                  )}
                  
                  {/* Add Learn More button for services with dedicated pages */}
                  {service.link && (
                    <Link 
                      to={service.link}
                      className="mt-6 inline-flex items-center justify-center w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300"
                    >
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Packages */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('services.packages.title')}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
              {t('services.packages.subtitle')}
            </p>
            
            {/* Billing Cycle Toggle */}
            <div className="flex items-center justify-center space-x-6 bg-white dark:bg-gray-900 rounded-full p-1 shadow-lg max-w-md mx-auto">
              <button
                onClick={() => setBillingCycle('one-time')}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  billingCycle === 'one-time'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                One-Time
              </button>
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  billingCycle === 'monthly'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`relative px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  billingCycle === 'annual'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Annual
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Save 25%
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                id: 'starter',
                name: t('services.packages.starter.name'),
                price: billingCycle === 'monthly' ? '€39/mo' : billingCycle === 'annual' ? '€399' : '€999',
                originalPrice: billingCycle === 'monthly' ? '€59/mo' : billingCycle === 'annual' ? '€599' : '€1,499',
                savings: billingCycle === 'monthly' ? '€20/mo' : billingCycle === 'annual' ? '€200' : '€500',
                description: t('services.packages.starter.description'),
                features: [
                  t('services.packages.starter.features.website'),
                  t('services.packages.starter.features.responsive'),
                  t('services.packages.starter.features.seo'),
                  t('services.packages.starter.features.contact'),
                  t('services.packages.starter.features.analytics'),
                  t('services.packages.starter.features.support'),
                  t('services.packages.starter.features.chatbot'),
                  t('services.packages.starter.features.social')
                ],
                deliveryTime: t('services.packages.starter.delivery'),
                popular: false,
                gradient: 'from-gray-500 to-gray-600'
              },
              {
                id: 'professional',
                name: t('services.packages.professional.name'),
                price: billingCycle === 'monthly' ? '€99/mo' : billingCycle === 'annual' ? '€999' : '€2,499',
                originalPrice: billingCycle === 'monthly' ? '€149/mo' : billingCycle === 'annual' ? '€1,499' : '€3,999',
                savings: billingCycle === 'monthly' ? '€50/mo' : billingCycle === 'annual' ? '€500' : '€1,500',
                description: t('services.packages.professional.description'),
                features: [
                  t('services.packages.professional.features.website'),
                  t('services.packages.professional.features.chatbot'),
                  t('services.packages.professional.features.booking'),
                  t('services.packages.professional.features.payment'),
                  t('services.packages.professional.features.analytics'),
                  t('services.packages.professional.features.cms'),
                  t('services.packages.professional.features.support'),
                  t('services.packages.professional.features.seo'),
                  t('services.packages.professional.features.performance'),
                  t('services.packages.professional.features.security')
                ],
                deliveryTime: t('services.packages.professional.delivery'),
                popular: true,
                gradient: 'from-blue-500 to-purple-600'
              },
              {
                id: 'enterprise',
                name: t('services.packages.enterprise.name'),
                price: billingCycle === 'monthly' ? '€1,999/mo' : billingCycle === 'annual' ? '€14,999' : '€19,999',
                originalPrice: billingCycle === 'monthly' ? '€2,999/mo' : billingCycle === 'annual' ? '€19,999' : '€34,999',
                savings: billingCycle === 'monthly' ? '€1,000/mo' : billingCycle === 'annual' ? '€5,000' : '€15,000',
                description: t('services.packages.enterprise.description'),
                features: [
                  t('services.packages.enterprise.features.webapp'),
                  t('services.packages.enterprise.features.mobile'),
                  t('services.packages.enterprise.features.ai'),
                  t('services.packages.enterprise.features.booking'),
                  t('services.packages.enterprise.features.bi'),
                  t('services.packages.enterprise.features.multilang'),
                  t('services.packages.enterprise.features.support'),
                  t('services.packages.enterprise.features.training'),
                  t('services.packages.enterprise.features.api'),
                  t('services.packages.enterprise.features.integrations'),
                  t('services.packages.enterprise.features.security'),
                  t('services.packages.enterprise.features.architecture')
                ],
                deliveryTime: t('services.packages.enterprise.delivery'),
                popular: false,
                gradient: 'from-purple-600 to-pink-600'
              },
              {
                id: 'custom',
                name: t('services.packages.custom.name'),
                price: billingCycle === 'monthly' ? 'From €2,500/mo' : billingCycle === 'annual' ? 'From €22,500' : 'From €25,000',
                originalPrice: null,
                savings: billingCycle === 'annual' ? '10% off' : null,
                description: t('services.packages.custom.description'),
                features: [
                  t('services.packages.custom.features.development'),
                  t('services.packages.custom.features.unlimited'),
                  t('services.packages.custom.features.ai'),
                  t('services.packages.custom.features.integrations'),
                  t('services.packages.custom.features.manager'),
                  t('services.packages.custom.features.support'),
                  t('services.packages.custom.features.maintenance'),
                  t('services.packages.custom.features.guarantees'),
                  t('services.packages.custom.features.scalability'),
                  t('services.packages.custom.features.audits')
                ],
                deliveryTime: t('services.packages.custom.delivery'),
                popular: false,
                gradient: 'from-indigo-600 to-purple-700'
              }
            ].map((pkg) => (
              <div
                key={pkg.id}
                className={`relative bg-white dark:bg-gray-900 rounded-3xl p-8 border-2 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl ${
                  pkg.popular 
                    ? 'border-blue-500 shadow-2xl scale-105' 
                    : 'border-gray-200 dark:border-gray-700 hover:shadow-xl hover:border-blue-300'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg">
                      {t('mind.pricing.popular')}
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{pkg.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">{pkg.price}</span>
                    {pkg.originalPrice && (
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <span className="line-through">{pkg.originalPrice}</span>
                        <span className="text-green-600 dark:text-green-400 ml-2 font-medium">Save {pkg.savings}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">{pkg.description}</p>
                  <div className="flex items-center justify-center space-x-2 mt-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">{pkg.deliveryTime}</span>
                  </div>
                  {billingCycle === 'annual' && (
                    <div className="mt-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-medium">
                      Annual billing: Save 25% + Priority Support
                    </div>
                  )}
                  {billingCycle === 'monthly' && (
                    <div className="mt-3 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-medium">
                      Cancel anytime, no commitment
                    </div>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setSelectedPackage(pkg.id)}
                  className={`w-full py-4 rounded-full font-medium transition-all duration-300 ${
                    pkg.popular
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 shadow-lg'
                      : selectedPackage === pkg.id
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {pkg.id === 'custom' ? t('services.packages.custom.cta') : t('services.packages.cta')}
                </button>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {t('services.packages.note')}
            </p>
            <div className="flex justify-center space-x-8 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>{t('services.packages.features.secure')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4" />
                <span>{t('services.packages.features.fast')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>{t('services.packages.features.support')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bundle Packages */}
      <BundlePackages />

      {/* Development Process */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('services.process.title')}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {t('services.process.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {[
              {
                step: '01',
                title: t('services.process.discovery.title'),
                description: t('services.process.discovery.description'),
                duration: t('services.process.discovery.duration'),
                icon: Users
              },
              {
                step: '02',
                title: t('services.process.design.title'),
                description: t('services.process.design.description'),
                duration: t('services.process.design.duration'),
                icon: Palette
              },
              {
                step: '03',
                title: t('services.process.development.title'),
                description: t('services.process.development.description'),
                duration: t('services.process.development.duration'),
                icon: Code
              },
              {
                step: '04',
                title: t('services.process.testing.title'),
                description: t('services.process.testing.description'),
                duration: t('services.process.testing.duration'),
                icon: Shield
              },
              {
                step: '05',
                title: t('services.process.launch.title'),
                description: t('services.process.launch.description'),
                duration: t('services.process.launch.duration'),
                icon: Zap
              }
            ].map((phase, index) => {
              const IconComponent = phase.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {phase.step}
                  </div>
                  <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{phase.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{phase.description}</p>
                  <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">{phase.duration}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('services.testimonials.title')}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {t('services.testimonials.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Glenn Miller',
                role: 'Founder',
                company: 'Klavierschule Glenn Miller',
                quote: t('services.testimonials.glenn.quote'),
                rating: 5,
                avatar: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=150',
                results: [t('services.testimonials.glenn.results.booking'), t('services.testimonials.glenn.results.scheduling'), t('services.testimonials.glenn.results.savings')]
              },
              {
                name: 'Hassan Arour',
                role: 'General Manager',
                company: 'Hotel am Kochbrunnen',
                quote: t('services.testimonials.hassan.quote'),
                rating: 5,
                avatar: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=150',
                results: [t('services.testimonials.hassan.results.integration'), t('services.testimonials.hassan.results.design'), t('services.testimonials.hassan.results.support')]
              },
              {
                name: 'Martin Schneider',
                role: 'Practice Owner',
                company: 'Falchi Dental',
                quote: t('services.testimonials.martin.quote'),
                rating: 5,
                avatar: 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=150',
                results: [t('services.testimonials.martin.results.management'), t('services.testimonials.martin.results.operations'), t('services.testimonials.martin.results.value')]
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center space-x-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <blockquote className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
                
                <div className="space-y-2 mb-6">
                  {testimonial.results.map((result, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{result}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</div>
                    <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">{testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demos Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Experience Our Solutions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Try our interactive demos to see how our enterprise solutions can transform your business operations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Booking System Demo */}
            <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <Calendar className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Smart Scheduling
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Professional appointment booking system with intelligent scheduling
              </p>
              <button 
                onClick={() => navigate('/demos#booking')}
                className="flex items-center text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700"
              >
                <TestTube className="w-4 h-4 mr-2" />
                Try Demo
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>

            {/* Document Processing Demo */}
            <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <FileText className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Document Analysis
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                AI-powered document processing with intelligent insights
              </p>
              <button 
                onClick={() => navigate('/demos#document')}
                className="flex items-center text-green-600 dark:text-green-400 font-medium hover:text-green-700"
              >
                <TestTube className="w-4 h-4 mr-2" />
                Try Demo
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>

            {/* Chatbot Demo */}
            <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <MessageSquare className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Business Assistant
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Intelligent chatbot for automated business support
              </p>
              <button 
                onClick={() => navigate('/demos#chatbot')}
                className="flex items-center text-purple-600 dark:text-purple-400 font-medium hover:text-purple-700"
              >
                <TestTube className="w-4 h-4 mr-2" />
                Try Demo
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">{t('services.cta.title')}</h2>
          <p className="text-xl text-blue-100 mb-8">
            {t('services.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-50 transition-colors duration-300">
              {t('services.cta.consultation')}
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300">
              <Download className="mr-2 h-5 w-5 inline" />
              {t('services.cta.portfolio')}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;