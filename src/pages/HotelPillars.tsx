import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft,
  Key,
  BarChart3,
  Thermometer,
  Lock,
  TrendingUp,
  Smartphone,
  Users,
  Globe,
  CheckCircle,
  ExternalLink,
  Zap,
  Shield,
  MessageSquare,
  Calendar
} from 'lucide-react';

const HotelPillars: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const pillars = [
    {
      id: 1,
      icon: Key,
      title: 'Friction-Free Guest Journey',
      description: 'Keyless check-in/out via QR & NFC, AI-concierge available in-room, at reception, and on WhatsApp with multilingual voice commands',
      metric: '99.9% uptime',
      features: [
        'QR code & NFC keyless entry',
        'AI concierge in multiple languages',
        'WhatsApp integration',
        'Voice command support',
        'Seamless check-in/out process'
      ],
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      id: 2,
      icon: BarChart3,
      title: 'Fully-Automated Back Office',
      description: 'e-Invoice generator, GoBD-compliant workflows, real-time PMS & OTA sync, saving ~40 hrs/month',
      metric: '40hrs/month saved',
      features: [
        'Automated invoice generation',
        'GoBD compliance workflows',
        'Real-time PMS synchronization',
        'OTA channel management',
        'Financial reporting automation'
      ],
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      id: 3,
      icon: Thermometer,
      title: 'Smart Building Control',
      description: 'IoT occupancy-based HVAC, cutting energy costs by 25%',
      metric: '25% energy savings',
      features: [
        'IoT occupancy sensors',
        'Automated HVAC control',
        'Energy optimization algorithms',
        'Mobile app control',
        'Predictive maintenance'
      ],
      gradient: 'from-orange-500 to-red-500'
    },
    {
      id: 4,
      icon: Lock,
      title: 'Security & Compliance',
      description: 'Zero-trust network, GDPR-proof data lake with automatic PII masking',
      metric: '99 Lighthouse score',
      features: [
        'Zero-trust security architecture',
        'GDPR-compliant data handling',
        'Automatic PII masking',
        'Continuous security monitoring',
        'Compliance reporting'
      ],
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      id: 5,
      icon: TrendingUp,
      title: 'Revenue-Driving AI',
      description: 'Context-aware RAG system, upsell engine, sentiment analysis',
      metric: 'Increased revenue',
      features: [
        'Context-aware recommendations',
        'Automated upselling',
        'Guest sentiment analysis',
        'Revenue optimization',
        'Personalized offers'
      ],
      gradient: 'from-indigo-500 to-purple-500'
    },
    {
      id: 6,
      icon: Smartphone,
      title: 'Seamless Booking',
      description: 'Mobile-first website with 99 Lighthouse score, one-tap booking',
      metric: 'Direct bookings up',
      features: [
        'Mobile-first design',
        'One-tap booking process',
        'Apple/Google Pay integration',
        'Real-time availability',
        'Instant confirmation'
      ],
      gradient: 'from-teal-500 to-blue-500'
    },
    {
      id: 7,
      icon: Users,
      title: 'Staff Orchestration',
      description: 'AI-driven housekeeping routes, automated maintenance tickets',
      metric: 'Optimized workflows',
      features: [
        'AI-optimized housekeeping routes',
        'Automated maintenance scheduling',
        'Staff task management',
        'Performance analytics',
        'Resource allocation'
      ],
      gradient: 'from-pink-500 to-rose-500'
    },
    {
      id: 8,
      icon: Globe,
      title: 'Scalable Architecture',
      description: 'Containerized microservices, GitOps CI/CD, disaster recovery',
      metric: 'Future-proof',
      features: [
        'Containerized microservices',
        'GitOps CI/CD pipeline',
        'Disaster recovery systems',
        'Auto-scaling capabilities',
        'High availability design'
      ],
      gradient: 'from-cyan-500 to-teal-500'
    }
  ];

  return (
    <div className="min-h-screen pt-16 bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <section className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4 mb-6">
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-orange-100 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="text-4xl">🏨</div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold">Hotel am Kochbrunnen</h1>
                <p className="text-xl text-orange-100">8 Integrated AI Pillars</p>
              </div>
            </div>
            
            <p className="text-lg text-orange-100 max-w-3xl mx-auto mb-8">
              Our flagship hospitality transformation showcasing how 8 integrated AI pillars 
              transformed traditional hotel operations into an intelligent ecosystem.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://hotelamkochbrunnen.de"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-white text-orange-600 px-6 py-3 rounded-full font-semibold hover:bg-orange-50 transition-colors"
              >
                Visit Hotel Website
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
              <button className="border-2 border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-orange-600 transition-all duration-300">
                Book Your Hotel Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Stats */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { metric: '40hrs', description: 'Monthly time saved', icon: Zap },
              { metric: '99.9%', description: 'System uptime', icon: Shield },
              { metric: '25%', description: 'Energy savings', icon: Thermometer },
              { metric: '8', description: 'Integrated pillars', icon: Globe }
            ].map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="bg-white dark:bg-gray-900 rounded-xl p-6 text-center shadow-lg">
                  <div className="bg-orange-100 dark:bg-orange-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">{stat.metric}</div>
                  <p className="text-gray-600 dark:text-gray-400">{stat.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pillars Grid */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">The 8 AI Pillars</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Each pillar represents a critical component of the hotel's intelligent ecosystem, 
              working together to create an unprecedented guest experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pillars.map((pillar) => {
              const IconComponent = pillar.icon;
              return (
                <div
                  key={pillar.id}
                  className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${pillar.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-orange-600 dark:text-orange-400 font-medium">Pillar {pillar.id}</div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{pillar.title}</h3>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                    {pillar.description}
                  </p>

                  <div className="mb-6">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Key Features:</div>
                    <ul className="space-y-2">
                      {pillar.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Impact</div>
                    <div className="text-lg font-bold text-orange-600 dark:text-orange-400">{pillar.metric}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Integration Overview */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Seamless Integration</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              All 8 pillars work together as a unified intelligent system, creating synergies 
              that amplify the benefits of each individual component.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Guest Experience</h3>
                <p className="text-gray-600 dark:text-gray-400">Pillars 1, 5, and 6 work together to create a seamless guest journey from booking to checkout.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 dark:bg-green-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Operations</h3>
                <p className="text-gray-600 dark:text-gray-400">Pillars 2, 3, and 7 optimize hotel operations, reducing costs and improving efficiency.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 dark:bg-purple-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Infrastructure</h3>
                <p className="text-gray-600 dark:text-gray-400">Pillars 4 and 8 provide the secure, scalable foundation that supports all other systems.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Hotel?</h2>
          <p className="text-xl text-orange-100 mb-8">
            See how the 8-pillar AI transformation can revolutionize your hospitality business 
            just like Hotel am Kochbrunnen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-orange-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-orange-50 transition-colors duration-300">
              Book Your Hotel Demo
            </button>
            <Link
              to="/solutions/gastronomy-hospitality"
              className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-orange-600 transition-all duration-300 inline-flex items-center justify-center"
            >
              Explore Hospitality Solutions
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HotelPillars;