import React, { useState } from 'react';
import { Utensils, Users, BarChart3, Clock, Shield, Zap } from 'lucide-react';
import { useLanguage } from '../../providers/LanguageProvider';
import BookingWidget from '../../components/BookingWidget';

const GastronomyHospitality: React.FC = () => {
  const { t } = useLanguage();
  const [showBooking, setShowBooking] = useState(false);

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <Utensils className="h-12 w-12" />
                <h1 className="text-4xl md:text-5xl font-bold">{t('gastronomy.hero.title')}</h1>
              </div>
              <p className="text-xl text-orange-100 mb-8">
                {t('gastronomy.hero.subtitle')}
              </p>
              <button 
                onClick={() => setShowBooking(true)}
                className="bg-white text-orange-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-orange-50 transition-colors duration-300"
              >
                {t('gastronomy.hero.cta')}
              </button>
            </div>
            <div className="bg-white bg-opacity-10 rounded-2xl p-8 backdrop-blur-sm">
              <img 
                src="https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750" 
                alt="Gastronomy & Hospitality" 
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('gastronomy.solutions.title')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('gastronomy.solutions.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: t('gastronomy.solutions.reservation.title'),
                description: t('gastronomy.solutions.reservation.description'),
                features: [
                  t('gastronomy.solutions.reservation.features.dynamic'),
                  t('gastronomy.solutions.reservation.features.noshow'),
                  t('gastronomy.solutions.reservation.features.communication'),
                  t('gastronomy.solutions.reservation.features.sync')
                ]
              },
              {
                icon: BarChart3,
                title: t('gastronomy.solutions.analytics.title'),
                description: t('gastronomy.solutions.analytics.description'),
                features: [
                  t('gastronomy.solutions.analytics.features.sentiment'),
                  t('gastronomy.solutions.analytics.features.tracking'),
                  t('gastronomy.solutions.analytics.features.vip'),
                  t('gastronomy.solutions.analytics.features.recommendations')
                ]
              },
              {
                icon: Clock,
                title: t('gastronomy.solutions.service.title'),
                description: t('gastronomy.solutions.service.description'),
                features: [
                  t('gastronomy.solutions.service.features.multilang'),
                  t('gastronomy.solutions.service.features.orders'),
                  t('gastronomy.solutions.service.features.faq'),
                  t('gastronomy.solutions.service.features.complaints')
                ]
              },
              {
                icon: Shield,
                title: t('gastronomy.solutions.inventory.title'),
                description: t('gastronomy.solutions.inventory.description'),
                features: [
                  t('gastronomy.solutions.inventory.features.forecasting'),
                  t('gastronomy.solutions.inventory.features.waste'),
                  t('gastronomy.solutions.inventory.features.supplier'),
                  t('gastronomy.solutions.inventory.features.menu')
                ]
              },
              {
                icon: Zap,
                title: t('gastronomy.solutions.revenue.title'),
                description: t('gastronomy.solutions.revenue.description'),
                features: [
                  t('gastronomy.solutions.revenue.features.pricing'),
                  t('gastronomy.solutions.revenue.features.yield'),
                  t('gastronomy.solutions.revenue.features.upselling'),
                  t('gastronomy.solutions.revenue.features.forecasting')
                ]
              },
              {
                icon: Users,
                title: t('gastronomy.solutions.staff.title'),
                description: t('gastronomy.solutions.staff.description'),
                features: [
                  t('gastronomy.solutions.staff.features.scheduling'),
                  t('gastronomy.solutions.staff.features.automation'),
                  t('gastronomy.solutions.staff.features.analytics'),
                  t('gastronomy.solutions.staff.features.training')
                ]
              }
            ].map((solution, index) => {
              const IconComponent = solution.icon;
              return (
                <div key={index} className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow duration-300">
                  <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                    <IconComponent className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{solution.title}</h3>
                  <p className="text-gray-600 mb-6">{solution.description}</p>
                  <ul className="space-y-2">
                    {solution.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
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

      {/* Success Story */}
      <section className="py-20 bg-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('gastronomy.success.title')}</h2>
                <h3 className="text-2xl font-semibold text-orange-600 mb-4">{t('gastronomy.success.company')}</h3>
                <p className="text-lg text-gray-600 mb-6">
                  "{t('gastronomy.success.quote')}"
                </p>
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">40%</div>
                    <div className="text-sm text-gray-600">{t('gastronomy.success.metrics.noshows')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">25%</div>
                    <div className="text-sm text-gray-600">{t('gastronomy.success.metrics.satisfaction')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">30%</div>
                    <div className="text-sm text-gray-600">{t('gastronomy.success.metrics.efficiency')}</div>
                  </div>
                </div>
              </div>
              <div>
                <img 
                  src="https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750"
                  alt="Luxury hotel lobby" 
                  className="w-full h-80 object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Process */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('gastronomy.implementation.title')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('gastronomy.implementation.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: t('gastronomy.implementation.phase1.title'),
                description: t('gastronomy.implementation.phase1.description')
              },
              {
                step: '02',
                title: t('gastronomy.implementation.phase2.title'),
                description: t('gastronomy.implementation.phase2.description')
              },
              {
                step: '03',
                title: t('gastronomy.implementation.phase3.title'),
                description: t('gastronomy.implementation.phase3.description')
              },
              {
                step: '04',
                title: t('gastronomy.implementation.phase4.title'),
                description: t('gastronomy.implementation.phase4.description')
              }
            ].map((phase, index) => (
              <div key={index} className="text-center">
                <div className="bg-orange-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {phase.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{phase.title}</h3>
                <p className="text-gray-600">{phase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">{t('gastronomy.cta.title')}</h2>
          <p className="text-xl text-orange-100 mb-8">
            {t('gastronomy.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => {
                const event = new CustomEvent('openBookingModal');
                window.dispatchEvent(event);
              }}
              className="bg-white text-orange-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-orange-50 transition-colors duration-300"
            >
              {t('gastronomy.cta.demo')}
            </button>
            <button 
              onClick={() => {
                const link = document.createElement('a');
                link.href = 'mailto:ali.h@easolutions.de?subject=Case Study Request&body=Please send me the hospitality case study.';
                link.click();
              }}
              className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-orange-600 transition-all duration-300"
            >
              {t('gastronomy.cta.casestudy')}
            </button>
          </div>
        </div>
      </section>

      {/* Booking Widget Modal */}
      {showBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="relative max-w-4xl w-full bg-white rounded-2xl shadow-2xl my-8">
              <button 
                onClick={() => setShowBooking(false)}
                className="absolute top-4 right-4 z-10 text-gray-600 hover:text-gray-900"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="max-h-[85vh] overflow-y-auto">
                <BookingWidget
                  businessId="restaurant-consultant"
                  onClose={() => setShowBooking(false)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GastronomyHospitality;