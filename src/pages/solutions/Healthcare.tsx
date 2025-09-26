import React from 'react';
import { Heart, Stethoscope, Brain, Activity, FileText, Users } from 'lucide-react';
import { useLanguage } from '../../providers/LanguageProvider';

const Healthcare: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-500 to-rose-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <Heart className="h-12 w-12" />
                <h1 className="text-4xl md:text-5xl font-bold">{t('healthcare.hero.title')}</h1>
              </div>
              <p className="text-xl text-pink-100 mb-8">
                {t('healthcare.hero.subtitle')}
              </p>
              <button 
                onClick={() => {
                  const event = new CustomEvent('openBookingModal');
                  window.dispatchEvent(event);
                }}
                className="bg-white text-pink-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-pink-50 transition-colors duration-300"
              >
                {t('healthcare.hero.cta')}
              </button>
            </div>
            <div className="bg-white bg-opacity-10 rounded-2xl p-8 backdrop-blur-sm">
              <img 
                src="https://images.pexels.com/photos/236380/pexels-photo-236380.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750" 
                alt="Modern healthcare technology" 
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('healthcare.solutions.title')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('healthcare.solutions.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Stethoscope,
                title: t('healthcare.solutions.diagnostic.title'),
                description: t('healthcare.solutions.diagnostic.description'),
                features: [t('healthcare.solutions.diagnostic.features.imaging'), t('healthcare.solutions.diagnostic.features.symptoms'), t('healthcare.solutions.diagnostic.features.differential'), t('healthcare.solutions.diagnostic.features.stratification')]
              },
              {
                icon: Users,
                title: t('healthcare.solutions.management.title'),
                description: t('healthcare.solutions.management.description'),
                features: [t('healthcare.solutions.management.features.pathways'), t('healthcare.solutions.management.features.scheduling'), t('healthcare.solutions.management.features.adherence'), t('healthcare.solutions.management.features.communication')]
              },
              {
                icon: FileText,
                title: t('healthcare.solutions.documentation.title'),
                description: t('healthcare.solutions.documentation.description'),
                features: [t('healthcare.solutions.documentation.features.transcription'), t('healthcare.solutions.documentation.features.generation'), t('healthcare.solutions.documentation.features.coding'), t('healthcare.solutions.documentation.features.assurance')]
              },
              {
                icon: Activity,
                title: t('healthcare.solutions.monitoring.title'),
                description: t('healthcare.solutions.monitoring.description'),
                features: [t('healthcare.solutions.monitoring.features.vitals'), t('healthcare.solutions.monitoring.features.alerts'), t('healthcare.solutions.monitoring.features.analysis'), t('healthcare.solutions.monitoring.features.preventive')]
              },
              {
                icon: Brain,
                title: t('healthcare.solutions.research.title'),
                description: t('healthcare.solutions.research.description'),
                features: [t('healthcare.solutions.research.features.molecular'), t('healthcare.solutions.research.features.trials'), t('healthcare.solutions.research.features.biomarkers'), t('healthcare.solutions.research.features.automation')]
              },
              {
                icon: Heart,
                title: t('healthcare.solutions.personalized.title'),
                description: t('healthcare.solutions.personalized.description'),
                features: [t('healthcare.solutions.personalized.features.genomic'), t('healthcare.solutions.personalized.features.personalization'), t('healthcare.solutions.personalized.features.prediction'), t('healthcare.solutions.personalized.features.dosing')]
              }
            ].map((solution, index) => {
              const IconComponent = solution.icon;
              return (
                <div key={index} className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow duration-300">
                  <div className="bg-pink-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                    <IconComponent className="h-6 w-6 text-pink-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{solution.title}</h3>
                  <p className="text-gray-600 mb-6">{solution.description}</p>
                  <ul className="space-y-2">
                    {solution.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-pink-600 rounded-full"></div>
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

      {/* Impact Metrics */}
      <section className="py-20 bg-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('healthcare.impact.title')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('healthcare.impact.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                metric: '35%',
                description: t('healthcare.impact.accuracy'),
                icon: Stethoscope
              },
              {
                metric: '50%',
                description: t('healthcare.impact.documentation'),
                icon: FileText
              },
              {
                metric: '25%',
                description: t('healthcare.impact.readmission'),
                icon: Heart
              },
              {
                metric: '60%',
                description: t('healthcare.impact.treatment'),
                icon: Activity
              }
            ].map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-8 text-center shadow-lg">
                  <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-pink-600" />
                  </div>
                  <div className="text-4xl font-bold text-pink-600 mb-2">{stat.metric}</div>
                  <p className="text-gray-600">{stat.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Success Story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('healthcare.success.title')}</h2>
                  <h3 className="text-2xl font-semibold text-pink-600 mb-4">{t('healthcare.success.company')}</h3>
                <h3 className="text-2xl font-semibold text-pink-600 mb-4">Falchi Dental Wiesbaden</h3>
                <p className="text-gray-700 mb-6">
                    "{t('healthcare.success.quote')}"
                  improvements in treatment accuracy and patient satisfaction, while reducing diagnostic time by 40%."
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">✓</span>
                    </div>
                      <span className="text-gray-700">{t('healthcare.success.results.time')}</span>
                    <span className="text-gray-700">40% reduction in diagnostic time</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">✓</span>
                    </div>
                      <span className="text-gray-700">{t('healthcare.success.results.accuracy')}</span>
                    <span className="text-gray-700">95% improvement in treatment accuracy</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">✓</span>
                    </div>
                      <span className="text-gray-700">{t('healthcare.success.results.experience')}</span>
                    <span className="text-gray-700">Enhanced patient experience</span>
                  </div>
                </div>
              </div>
              <div>
                <img 
                  src="https://images.pexels.com/photos/305568/pexels-photo-305568.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750"
                  alt="Modern dental practice with AI technology" 
                  className="w-full h-80 object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance & Security */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">{t('healthcare.compliance.title')}</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t('healthcare.compliance.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: t('healthcare.compliance.hipaa.title'),
                description: t('healthcare.compliance.hipaa.description')
              },
              {
                title: t('healthcare.compliance.fda.title'),
                description: t('healthcare.compliance.fda.description')
              },
              {
                title: t('healthcare.compliance.security.title'),
                description: t('healthcare.compliance.security.description')
              },
              {
                title: t('healthcare.compliance.audit.title'),
                description: t('healthcare.compliance.audit.description')
              },
              {
                title: t('healthcare.compliance.privacy.title'),
                description: t('healthcare.compliance.privacy.description')
              },
              {
                title: t('healthcare.compliance.integration.title'),
                description: t('healthcare.compliance.integration.description')
              }
            ].map((feature, index) => (
              <div key={index} className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3 text-pink-400">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-pink-500 to-rose-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">{t('healthcare.cta.title')}</h2>
          <p className="text-xl text-pink-100 mb-8">
            {t('healthcare.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => {
                const event = new CustomEvent('openBookingModal');
                window.dispatchEvent(event);
              }}
              className="bg-white text-pink-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-pink-50 transition-colors duration-300"
            >
              {t('healthcare.cta.demo')}
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-pink-600 transition-all duration-300">
              {t('healthcare.cta.guide')}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Healthcare;