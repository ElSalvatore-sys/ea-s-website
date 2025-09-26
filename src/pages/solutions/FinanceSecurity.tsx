import React from 'react';
import { Shield, Lock, TrendingUp, AlertTriangle, FileCheck, Eye } from 'lucide-react';
import { useLanguage } from '../../providers/LanguageProvider';

const FinanceSecurity: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <Shield className="h-12 w-12" />
                <h1 className="text-4xl md:text-5xl font-bold">{t('finance.hero.title')}</h1>
              </div>
              <p className="text-xl text-green-100 mb-8">
                {t('finance.hero.subtitle')}
              </p>
              <button 
                onClick={() => {
                  const event = new CustomEvent('openBookingModal');
                  window.dispatchEvent(event);
                }}
                className="bg-white text-green-700 px-8 py-4 rounded-full text-lg font-semibold hover:bg-green-50 transition-colors duration-300"
              >
                {t('finance.hero.cta')}
              </button>
            </div>
            <div className="bg-white bg-opacity-10 rounded-2xl p-8 backdrop-blur-sm">
              <img 
                src="https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750" 
                alt="Financial security and data protection" 
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Key Solutions */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('finance.solutions.title')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('finance.solutions.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: AlertTriangle,
                title: 'Advanced Fraud Detection',
                description: 'Real-time transaction monitoring with machine learning algorithms that identify suspicious patterns and prevent fraud.',
                features: ['Real-time transaction analysis', 'Behavioral pattern recognition', 'Anomaly detection', 'Risk scoring systems']
              },
              {
                icon: TrendingUp,
                title: 'Risk Assessment & Management',
                description: 'Comprehensive risk evaluation systems that assess credit, market, and operational risks with unprecedented accuracy.',
                features: ['Credit risk modeling', 'Market risk analysis', 'Portfolio optimization', 'Stress testing automation']
              },
              {
                icon: FileCheck,
                title: 'Regulatory Compliance',
                description: 'Automated compliance monitoring and reporting systems that ensure adherence to financial regulations.',
                features: ['AML compliance monitoring', 'KYC automation', 'Regulatory reporting', 'Audit trail management']
              },
              {
                icon: Lock,
                title: 'Cybersecurity Intelligence',
                description: 'AI-powered security systems that detect and respond to cyber threats before they impact your operations.',
                features: ['Threat detection', 'Network monitoring', 'Incident response', 'Security analytics']
              },
              {
                icon: Eye,
                title: 'Anti-Money Laundering',
                description: 'Sophisticated AML systems that identify complex money laundering schemes and suspicious activities.',
                features: ['Transaction monitoring', 'Network analysis', 'Case management', 'Suspicious activity reporting']
              },
              {
                icon: Shield,
                title: 'Data Protection & Privacy',
                description: 'Comprehensive data protection solutions that ensure customer privacy and regulatory compliance.',
                features: ['Data encryption', 'Privacy compliance', 'Access control', 'Data loss prevention']
              }
            ].map((solution, index) => {
              const IconComponent = solution.icon;
              return (
                <div key={index} className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow duration-300">
                  <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                    <IconComponent className="h-6 w-6 text-green-700" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{solution.title}</h3>
                  <p className="text-gray-600 mb-6">{solution.description}</p>
                  <ul className="space-y-2">
                    {solution.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Security Metrics */}
      <section className="py-20 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('finance.results.title')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('finance.results.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                metric: '99.7%',
                description: 'Fraud detection accuracy',
                icon: AlertTriangle
              },
              {
                metric: '85%',
                description: 'Reduction in false positives',
                icon: TrendingUp
              },
              {
                metric: '60%',
                description: 'Faster compliance reporting',
                icon: FileCheck
              },
              {
                metric: '95%',
                description: 'Threat detection rate',
                icon: Shield
              }
            ].map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-8 text-center shadow-lg">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-green-700" />
                  </div>
                  <div className="text-4xl font-bold text-green-700 mb-2">{stat.metric}</div>
                  <p className="text-gray-600">{stat.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Compliance Standards */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Regulatory Compliance Excellence</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our solutions are designed to meet the highest regulatory standards and industry requirements.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              'PCI DSS',
              'GDPR',
              'SOX',
              'Basel III',
              'MiFID II',
              'FATCA',
              'AML',
              'KYC',
              'ISO 27001',
              'COSO',
              'NIST',
              'SWIFT'
            ].map((standard, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 text-center hover:bg-green-50 transition-colors duration-300">
                <span className="font-semibold text-gray-800">{standard}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Study */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Case Study: Major Bank Transforms Fraud Detection</h2>
              <p className="text-lg text-gray-300 mb-6">
                A leading European bank partnered with EA Solutions to implement advanced fraud detection 
                systems that reduced fraud losses by 90% while improving customer experience.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <span>90% reduction in fraud losses</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <span>75% decrease in false positives</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <span>Real-time transaction monitoring</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <span>Improved customer satisfaction scores</span>
                </div>
              </div>
            </div>
            <div>
              <img 
                src="https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750"
                alt="Financial data analysis" 
                className="w-full h-80 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">{t('finance.cta.title')}</h2>
          <p className="text-xl text-green-100 mb-8">
            {t('finance.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => {
                const event = new CustomEvent('openBookingModal');
                window.dispatchEvent(event);
              }}
              className="bg-white text-green-700 px-8 py-4 rounded-full text-lg font-semibold hover:bg-green-50 transition-colors duration-300"
            >
              {t('finance.cta.assessment')}
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-green-700 transition-all duration-300">
              {t('finance.cta.guide')}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FinanceSecurity;