import React, { useEffect, useRef, useState } from 'react';
import { Search, Lightbulb, Cog, TrendingUp, CheckCircle, Users, Target, Zap } from 'lucide-react';
import { useLanguage } from '../providers/LanguageProvider';

const EAMethod: React.FC = () => {
  const { t } = useLanguage();
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const stepIndex = parseInt(entry.target.getAttribute('data-step') || '0');
            setVisibleSteps(prev => [...new Set([...prev, stepIndex])]);
          }
        });
      },
      { threshold: 0.3 }
    );

    stepsRef.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen pt-16 bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 dark:from-gray-950 dark:via-blue-950 dark:to-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">{t('method.title')}</h1>
            <p className="text-xl md:text-2xl text-gray-300 dark:text-gray-400 max-w-4xl mx-auto mb-8">
              {t('method.subtitle')}
            </p>
            <button 
              onClick={() => {
                // Scroll to contact section or open booking modal
                const contactSection = document.getElementById('contact-section');
                if (contactSection) {
                  contactSection.scrollIntoView({ behavior: 'smooth' });
                } else {
                  // Trigger booking modal
                  const event = new CustomEvent('openBookingModal');
                  window.dispatchEvent(event);
                }
              }}
              className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-blue-500 hover:to-blue-400 transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              {t('cta.start')}
            </button>
          </div>
        </div>
      </section>

      {/* Enhanced Process with Connecting Lines */}
      <section className="py-32 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 dark:text-white mb-6 tracking-tight">
              {t('method.phases.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto font-light">
              {t('method.phases.subtitle')}
            </p>
          </div>

          <div className="relative">
            {/* Animated Connection Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block" style={{ zIndex: 1 }}>
              <defs>
                <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.6" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Step 1 to Step 2 */}
              {visibleSteps.includes(0) && visibleSteps.includes(1) && (
                <path
                  d="M 20% 20% Q 50% 10% 80% 30%"
                  stroke="url(#connectionGradient)"
                  strokeWidth="3"
                  fill="none"
                  filter="url(#glow)"
                  className="animate-pulse"
                  strokeDasharray="10,5"
                  style={{
                    animation: 'drawLine 2s ease-in-out forwards, pulse 3s ease-in-out infinite'
                  }}
                />
              )}
              
              {/* Step 2 to Step 3 */}
              {visibleSteps.includes(1) && visibleSteps.includes(2) && (
                <path
                  d="M 80% 30% Q 50% 40% 20% 60%"
                  stroke="url(#connectionGradient)"
                  strokeWidth="3"
                  fill="none"
                  filter="url(#glow)"
                  className="animate-pulse"
                  strokeDasharray="10,5"
                  style={{
                    animation: 'drawLine 2s ease-in-out forwards, pulse 3s ease-in-out infinite',
                    animationDelay: '0.5s'
                  }}
                />
              )}
              
              {/* Step 3 to Step 4 */}
              {visibleSteps.includes(2) && visibleSteps.includes(3) && (
                <path
                  d="M 20% 60% Q 50% 70% 80% 90%"
                  stroke="url(#connectionGradient)"
                  strokeWidth="3"
                  fill="none"
                  filter="url(#glow)"
                  className="animate-pulse"
                  strokeDasharray="10,5"
                  style={{
                    animation: 'drawLine 2s ease-in-out forwards, pulse 3s ease-in-out infinite',
                    animationDelay: '1s'
                  }}
                />
              )}
            </svg>
            
            <div className="space-y-32 relative" style={{ zIndex: 2 }}>
              {[
                {
                  number: '01',
                  id: '1',
                  title: t('method.phase1.title'),
                  description: t('method.phase1.desc'),
                  duration: '2-4 weeks',
                  icon: Search,
                  gradient: 'from-blue-500 to-cyan-500',
                  image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
                  deliverables: ['Process mapping', 'Bottleneck analysis', 'Goal alignment', 'Technical assessment']
                },
                {
                  number: '02',
                  id: '2',
                  title: t('method.phase2.title'),
                  description: t('method.phase2.desc'),
                  duration: '3-5 weeks',
                  icon: Lightbulb,
                  gradient: 'from-green-500 to-emerald-500',
                  image: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
                  deliverables: ['AI architecture blueprint', 'Technology selection', 'Integration plan', 'Security framework']
                },
                {
                  number: '03',
                  id: '3',
                  title: t('method.phase3.title'),
                  description: t('method.phase3.desc'),
                  duration: '6-12 weeks',
                  icon: Cog,
                  gradient: 'from-orange-500 to-red-500',
                  image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
                  deliverables: ['System development', 'Integration testing', 'Staff training', 'Go-live support']
                },
                {
                  number: '04',
                  id: '4',
                  title: t('method.phase4.title'),
                  description: t('method.phase4.desc'),
                  duration: 'Ongoing',
                  icon: TrendingUp,
                  gradient: 'from-purple-500 to-pink-500',
                  image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
                  deliverables: ['Performance monitoring', 'Continuous optimization', 'Feature updates', 'Strategic guidance']
                }
              ].map((stage, index) => {
                const IconComponent = stage.icon;
                return (
                  <div
                    key={index}
                    ref={(el) => (stepsRef.current[index] = el)}
                    data-step={index}
                    className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center transition-all duration-1000 ${
                      visibleSteps.includes(index) 
                        ? 'opacity-100 translate-y-0' 
                        : 'opacity-0 translate-y-12'
                    } ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}
                  >
                    <div className={`${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                      <div className="bg-white dark:bg-gray-800 rounded-3xl p-10 border border-gray-100 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-500">
                        <div className="flex items-center justify-between mb-8">
                          <div className="flex items-center space-x-6">
                            <div className={`w-16 h-16 bg-gradient-to-br ${stage.gradient} rounded-3xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300`}>
                              <IconComponent className="h-8 w-8 text-white" />
                            </div>
                            <div className="text-6xl font-light text-gray-200 dark:text-gray-700">
                              {stage.number}
                            </div>
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-full font-medium">
                            {stage.duration}
                          </span>
                        </div>
                        
                        <h3 className="text-3xl font-medium text-gray-900 dark:text-white mb-6">
                          {stage.title}
                        </h3>
                        
                        <p className="text-gray-600 dark:text-gray-400 font-light text-lg leading-relaxed mb-8">
                          {stage.description}
                        </p>

                        <div>
                          <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
                            Key Deliverables
                          </h4>
                          <ul className="space-y-3">
                            {stage.deliverables.map((deliverable, deliverableIndex) => (
                              <li key={deliverableIndex} className="flex items-center space-x-3">
                                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                                <span className="text-gray-700 dark:text-gray-300 font-light">{t(`method.phase${stage.id}.deliverables.${deliverable.toLowerCase().replace(/[^a-z]/g, '')}`) || deliverable}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                      <div className="relative group">
                        <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl transform group-hover:scale-105 transition-transform duration-500">
                          <img 
                            src={stage.image}
                            alt={`${stage.title} process visualization`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>
                        {/* Floating elements for visual enhancement */}
                        <div className={`absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br ${stage.gradient} rounded-full opacity-60 animate-pulse`}></div>
                        <div className={`absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-br ${stage.gradient} rounded-full opacity-40 animate-pulse`} style={{ animationDelay: '1s' }}></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-center mt-20">
            <button 
              onClick={() => {
                // Navigate to why-ea page or open detailed process guide
                window.location.href = '/why-ea';
              }}
              className="inline-flex items-center bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-10 py-4 rounded-full font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors duration-300 shadow-xl"
            >
              {t('cta.learn')}
              <TrendingUp className="ml-3 h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Success Metrics */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('method.results.title')}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {t('method.results.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                metric: '95%',
                description: 'Project success rate',
                icon: Target
              },
              {
                metric: '60%',
                description: 'Average efficiency improvement',
                icon: Zap
              },
              {
                metric: '18 months',
                description: 'Average timeline to results',
                icon: TrendingUp
              },
              {
                metric: '98%',
                description: 'Client satisfaction score',
                icon: Users
              }
            ].map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center bg-white dark:bg-gray-900 rounded-xl p-8 shadow-lg">
                  <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">{stat.metric}</div>
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
          <h2 className="text-4xl font-bold mb-6">{t('method.cta.title')}</h2>
          <p className="text-xl text-blue-100 dark:text-blue-200 mb-8">
            {t('method.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => {
                const event = new CustomEvent('openBookingModal');
                window.dispatchEvent(event);
              }}
              className="bg-white text-blue-900 px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-50 transition-colors duration-300"
            >
              {t('cta.discovery')}
            </button>
            <button 
              onClick={() => {
                // Create a downloadable PDF or redirect to resource
                const link = document.createElement('a');
                link.href = 'mailto:ali.h@easolutions.de?subject=Methodology Guide Request&body=Please send me the EA Method methodology guide.';
                link.click();
              }}
              className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-blue-900 transition-all duration-300"
            >
              {t('cta.download')}
            </button>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes drawLine {
          from {
            stroke-dashoffset: 100;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default EAMethod;