import React, { useEffect } from 'react';
import { 
  Rocket, 
  Shield, 
  Zap, 
  TrendingUp, 
  CheckCircle, 
  Star, 
  Users,
  Target,
  Brain,
  Globe,
  Lightbulb,
  Award
} from 'lucide-react';
import { useLanguage } from '../providers/LanguageProvider';

const WhyEA: React.FC = () => {
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pt-16 bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 dark:from-gray-950 dark:via-blue-950 dark:to-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">{t('nav.why')}</h1>
            <p className="text-xl md:text-2xl text-gray-300 dark:text-gray-400 max-w-4xl mx-auto mb-8">
              {t('why.advantage.subtitle')}
            </p>
            <button 
              onClick={() => {
                const event = new CustomEvent('openBookingModal');
                window.dispatchEvent(event);
              }}
              className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-blue-500 hover:to-blue-400 transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              {t('cta.experience')}
            </button>
          </div>
        </div>
      </section>

      {/* Core Differentiators */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('why.advantage.title')}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {t('why.advantage.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Rocket,
                title: t('why.bespoke.title'),
                description: t('why.bespoke.desc'),
                details: [
                  'Maßgeschneiderte KI-Modelle für Ihre Daten',
                  'Angepasste Benutzeroberflächen und Workflows',
                  'Branchenspezifische Optimierung',
                  'Proprietäre Algorithmusentwicklung'
                ],
                gradient: 'from-blue-500 to-purple-600'
              },
              {
                icon: Brain,
                title: t('why.expertise.title'),
                description: t('why.expertise.desc'),
                details: [
                  'Erfahrene KI-Ingenieure',
                  'Geschäftsstrategie-Experten',
                  'Branchenspezialisten',
                  'Kontinuierliche Weiterbildung'
                ],
                gradient: 'from-green-500 to-teal-600'
              },
              {
                icon: TrendingUp,
                title: t('why.impact.title'),
                description: t('why.impact.desc'),
                details: [
                  'Garantierte Ergebnisse innerhalb von 18 Monaten',
                  'Leistungsbasierte Preisoptionen',
                  'Kontinuierliche Optimierung',
                  'Transparente Erfolgsmetriken'
                ],
                gradient: 'from-orange-500 to-red-600'
              }
            ].map((advantage, index) => {
              const IconComponent = advantage.icon;
              return (
                <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700">
                  <div className={`w-16 h-16 bg-gradient-to-br ${advantage.gradient} rounded-full flex items-center justify-center mb-6 shadow-lg`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{advantage.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">{advantage.description}</p>
                  <ul className="space-y-2">
                    {advantage.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 bg-blue-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('why.comparison.title')}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {t('why.comparison.subtitle')}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">{t('why.comparison.feature')}</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-blue-900 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20">{t('why.comparison.ea')}</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-gray-300">{t('why.comparison.generic')}</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-gray-300">{t('why.comparison.traditional')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {[
                    {
                      feature: t('why.comparison.custom'),
                      ea: t('why.comparison.custom.ea'),
                      generic: t('why.comparison.custom.generic'),
                      traditional: t('why.comparison.custom.traditional')
                    },
                    {
                      feature: t('why.comparison.expertise.title'),
                      ea: t('why.comparison.expertise.ea'),
                      generic: t('why.comparison.expertise.generic'),
                      traditional: t('why.comparison.expertise.traditional')
                    },
                    {
                      feature: t('why.comparison.speed'),
                      ea: t('why.comparison.speed.ea'),
                      generic: t('why.comparison.speed.generic'),
                      traditional: t('why.comparison.speed.traditional')
                    },
                    {
                      feature: t('why.comparison.support'),
                      ea: t('why.comparison.support.ea'),
                      generic: t('why.comparison.support.generic'),
                      traditional: t('why.comparison.support.traditional')
                    },
                    {
                      feature: t('why.comparison.guarantee'),
                      ea: t('why.comparison.guarantee.ea'),
                      generic: t('why.comparison.guarantee.generic'),
                      traditional: t('why.comparison.guarantee.traditional')
                    },
                    {
                      feature: t('why.comparison.security'),
                      ea: t('why.comparison.security.ea'),
                      generic: t('why.comparison.security.generic'),
                      traditional: t('why.comparison.security.traditional')
                    }
                  ].map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{row.feature}</td>
                      <td className="px-6 py-4 text-sm text-center font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20">{row.ea}</td>
                      <td className="px-6 py-4 text-sm text-center text-gray-600 dark:text-gray-400">{row.generic}</td>
                      <td className="px-6 py-4 text-sm text-center text-gray-600 dark:text-gray-400">{row.traditional}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Client Success Stories */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Client Success Stories</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Real results from real clients who chose EA Solutions for their AI transformation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                company: 'Hotel am Kochbrunnen',
                industry: 'Hospitality',
                challenge: 'High no-show rates and inefficient booking management',
                solution: 'AI-powered reservation system with predictive analytics',
                results: ['40% reduction in no-shows', '25% increase in customer satisfaction', '30% operational efficiency gain'],
                testimonial: 'EA Solutions transformed our guest experience completely.'
              },
              {
                company: 'Falchi Dental',
                industry: 'Healthcare',
                challenge: 'Time-consuming diagnostic processes and patient management',
                solution: 'Intelligent diagnostic support and automated patient workflows',
                results: ['40% faster diagnostics', '95% accuracy improvement', '60% admin time reduction'],
                testimonial: 'The AI diagnostic tools have revolutionized our practice.'
              },
              {
                company: 'Klavierschule Glenn Miller',
                industry: 'Education',
                challenge: 'Manual scheduling and student management inefficiencies',
                solution: 'AI-powered booking system with intelligent schedule optimization',
                results: ['Automated booking system', 'Smart schedule creator', '40-60% cost savings vs big companies'],
                testimonial: 'The intelligent platform has streamlined our entire operation.'
              }
            ].map((story, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center space-x-2 mb-4">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{story.company}</h3>
                <div className="text-sm text-blue-600 dark:text-blue-400 font-semibold mb-4">{story.industry}</div>
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Challenge:</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{story.challenge}</p>
                </div>
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Solution:</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{story.solution}</p>
                </div>
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Results:</h4>
                  <ul className="space-y-1">
                    {story.results.map((result, resultIndex) => (
                      <li key={resultIndex} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{result}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <blockquote className="text-gray-600 dark:text-gray-400 italic border-l-4 border-blue-500 pl-4">
                  "{story.testimonial}"
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Expertise */}
      <section className="py-20 bg-blue-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">World-Class Expertise</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Our team brings together the best minds in AI, engineering, and business strategy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                stat: '15+',
                description: 'Years average AI experience',
                icon: Users
              },
              {
                stat: '6+',
                description: 'Successful AI implementations',
                icon: Target
              },
              {
                stat: '10+',
                description: 'Industry verticals served',
                icon: Award
              },
              {
                stat: '24/7',
                description: 'Global support coverage',
                icon: Globe
              }
            ].map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center bg-white dark:bg-gray-900 rounded-xl p-8 shadow-lg">
                  <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">{stat.stat}</div>
                  <p className="text-gray-600 dark:text-gray-400">{stat.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-blue-800 dark:from-blue-950 dark:to-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">{t('why.cta.title')}</h2>
          <p className="text-xl text-blue-100 dark:text-blue-200 mb-8">
            {t('why.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => {
                const event = new CustomEvent('openBookingModal');
                window.dispatchEvent(event);
              }}
              className="bg-white text-blue-900 px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-50 transition-colors duration-300"
            >
              {t('cta.schedule')}
            </button>
            <button 
              onClick={() => {
                const link = document.createElement('a');
                link.href = 'mailto:ali.h@easolutions.de?subject=Portfolio Request&body=Please send me your company portfolio and case studies.';
                link.click();
              }}
              className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-blue-900 transition-all duration-300"
            >
              {t('cta.portfolio')}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WhyEA;