import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Coffee, Heart, Scissors, Car, ArrowRight, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import IndustryBookingWidget from '../components/IndustryBookingWidget';
import { industryConfigs } from '../lib/industryServices';

const IndustryBookingDemo: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isGerman = i18n.language === 'de';
  const location = useLocation();
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [showWidget, setShowWidget] = useState(false);

  // Handle URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const industryParam = params.get('industry');
    if (industryParam && ['restaurant', 'medical', 'salon', 'automotive'].includes(industryParam)) {
      setSelectedIndustry(industryParam);
      setShowWidget(true);
    }
  }, [location.search]);

  const industries = [
    {
      id: 'restaurant',
      name: 'Restaurant',
      nameDE: 'Restaurant',
      icon: Coffee,
      color: '#C65D00',
      bgColor: '#FFF5F0',
      description: 'Simple table reservations',
      descriptionDE: 'Einfache Tischreservierungen',
      features: [
        'Quick booking',
        'Time slots',
        'Instant confirmation'
      ],
      featuresDE: [
        'Schnelle Buchung',
        'Zeitfenster',
        'Sofort-Bestätigung'
      ]
    },
    {
      id: 'medical',
      name: 'Medical',
      nameDE: 'Medizinisch',
      icon: Heart,
      color: '#0891B2',
      bgColor: '#F0FDFA',
      description: 'Easy appointment booking',
      descriptionDE: 'Einfache Terminbuchung',
      features: [
        'Available appointments',
        'Quick scheduling',
        'Email reminders'
      ],
      featuresDE: [
        'Verfügbare Termine',
        'Schnelle Planung',
        'E-Mail-Erinnerungen'
      ]
    },
    {
      id: 'salon',
      name: 'Hair Salon',
      nameDE: 'Friseursalon',
      icon: Scissors,
      color: '#B76E79',
      bgColor: '#FDF2F4',
      description: 'Book your appointment',
      descriptionDE: 'Buchen Sie Ihren Termin',
      features: [
        'Service selection',
        'Time availability',
        'Easy booking'
      ],
      featuresDE: [
        'Service-Auswahl',
        'Zeitverfügbarkeit',
        'Einfache Buchung'
      ]
    },
    {
      id: 'automotive',
      name: 'Automotive',
      nameDE: 'Automobil',
      icon: Car,
      color: '#1E40AF',
      bgColor: '#EFF6FF',
      description: 'Service appointments',
      descriptionDE: 'Service-Termine',
      features: [
        'Service booking',
        'Date selection',
        'Confirmation'
      ],
      featuresDE: [
        'Service-Buchung',
        'Datumswahl',
        'Bestätigung'
      ]
    }
  ];

  const handleIndustrySelect = (industryId: string) => {
    setSelectedIndustry(industryId);
    setShowWidget(true);
  };

  const handleBookingComplete = (bookingData: any) => {
    console.log('Booking completed:', bookingData);
    // Here you would typically send this to your backend
  };

  return (
    <div className="min-h-screen bg-background-primary py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {isGerman ? 'Intelligente Branchenbuchung' : 'Intelligent Industry Booking'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {isGerman
              ? 'Maßgeschneiderte Buchungserlebnisse für jede Branche mit intelligenten Funktionen und optimierten Workflows'
              : 'Tailored booking experiences for every industry with smart features and optimized workflows'}
          </p>
        </motion.div>

        {/* Industry Grid */}
        {!showWidget ? (
          <div className="grid md:grid-cols-2 gap-8">
            {industries.map((industry, index) => {
              const Icon = industry.icon;
              return (
                <motion.div
                  key={industry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-subtle hover:shadow-hover transition-all duration-300 overflow-hidden group cursor-pointer"
                  onClick={() => handleIndustrySelect(industry.id)}
                >
                  <div
                    className="p-8"
                    style={{ backgroundColor: industry.bgColor }}
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div
                        className="p-4 rounded-xl bg-white/80 backdrop-blur"
                        style={{ color: industry.color }}
                      >
                        <Icon className="w-8 h-8" />
                      </div>
                      <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {isGerman ? industry.nameDE : industry.name}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {isGerman ? industry.descriptionDE : industry.description}
                    </p>

                    <div className="space-y-2">
                      {(isGerman ? industry.featuresDE : industry.features).map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: industry.color }}
                          />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="px-8 py-4 bg-white border-t border-gray-100">
                    <button
                      className="w-full py-3 rounded-lg text-white font-medium transition-all hover:shadow-lg"
                      style={{ backgroundColor: industry.color }}
                    >
                      {isGerman ? 'Demo starten' : 'Start Demo'}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* Booking Widget */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-center"
          >
            <IndustryBookingWidget
              industryType={selectedIndustry as any}
              onClose={() => {
                setShowWidget(false);
                setSelectedIndustry(null);
              }}
              onBookingComplete={handleBookingComplete}
            />
          </motion.div>
        )}

        {/* Features Section */}
        {!showWidget && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-20 text-center"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {isGerman ? 'Warum unsere Lösung wählen?' : 'Why Choose Our Solution?'}
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {isGerman ? 'Branchenspezifisch' : 'Industry-Specific'}
                </h3>
                <p className="text-gray-600">
                  {isGerman
                    ? 'Maßgeschneiderte Funktionen für jede Branche'
                    : 'Tailored features for each industry'}
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {isGerman ? 'Intelligent & Schnell' : 'Smart & Fast'}
                </h3>
                <p className="text-gray-600">
                  {isGerman
                    ? 'Optimierte Workflows mit intelligenten Funktionen'
                    : 'Optimized workflows with smart features'}
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📈</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {isGerman ? 'Höhere Konversion' : 'Higher Conversion'}
                </h3>
                <p className="text-gray-600">
                  {isGerman
                    ? 'Reduzierte Abbrüche durch vereinfachte Prozesse'
                    : 'Reduced abandonment through simplified processes'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default IndustryBookingDemo;