import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Code, Palette, Zap, Globe, Award, ArrowRight } from 'lucide-react';
import { useLanguage } from '../providers/LanguageProvider';

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  url: string;
  image: string;
  tags: string[];
  features: string[];
  industry: string;
  year: number;
}

const PortfolioShowcase: React.FC = () => {
  const { t, language } = useLanguage();

  const portfolioItems: PortfolioItem[] = [
    {
      id: 'hotel-kochbrunnen',
      title: 'Hotel am Kochbrunnen',
      description: language === 'de' 
        ? 'Automatisiertes Buchungssystem mit Anzahlungsintegration für Boutique-Hotel'
        : 'Automated booking system with deposit integration for boutique hotel',
      url: '#',
      image: '/images/portfolio/hotel-preview.jpg',
      tags: ['React', 'Node.js', 'Stripe API', 'PostgreSQL', 'Real-time Updates'],
      features: [
        language === 'de' ? 'Automatische Zimmerverwaltung' : 'Automated Room Management',
        language === 'de' ? 'Anzahlungs-Integration' : 'Deposit Payment Integration',
        language === 'de' ? 'Mitarbeiter-Dashboard' : 'Staff Management Dashboard',
        language === 'de' ? '16% Umsatzsteigerung' : '16% Revenue Increase'
      ],
      industry: language === 'de' ? 'Gastgewerbe' : 'Hospitality',
      year: 2024
    },
    {
      id: 'falchi-dental',
      title: 'Falchi Dental',
      description: language === 'de'
        ? 'Automatisierte 3D-Scanner Workflow-Integration für Zahnarztpraxis'
        : 'Automated 3D scanner workflow integration for dental practice',
      url: '#',
      image: '/images/portfolio/dental-preview.jpg',
      tags: ['Python', '3D API', 'Process Automation', 'Docker', 'Medical Tech'],
      features: [
        language === 'de' ? '3D-Scan Automatisierung' : '3D Scan Automation',
        language === 'de' ? 'Dateiverarbeitung Pipeline' : 'File Processing Pipeline',
        language === 'de' ? 'DICOM Integration' : 'DICOM Integration',
        language === 'de' ? '3h → 20min Prozesszeit' : '3h → 20min Process Time'
      ],
      industry: language === 'de' ? 'Gesundheitswesen' : 'Healthcare',
      year: 2024
    },
    {
      id: '33eye',
      title: '33eye.de',
      description: language === 'de' 
        ? 'Portfolio-Website mit 70% schnellerer Ladezeit und 300% mehr Anfragen'
        : 'Portfolio website with 70% faster load time and 300% more inquiries',
      url: 'https://33eye.de',
      image: '/images/portfolio/33eye-preview.jpg',
      tags: ['Next.js', 'Tailwind CSS', 'Image Optimization', 'SEO', 'Performance'],
      features: [
        language === 'de' ? 'Optimierte Bildergalerie' : 'Optimized Image Gallery',
        language === 'de' ? 'Performance-Kalender' : 'Performance Calendar',
        language === 'de' ? 'Internationale Reichweite' : 'International Reach',
        language === 'de' ? '300% mehr Buchungen' : '300% More Bookings'
      ],
      industry: language === 'de' ? 'Performance-Kunst' : 'Performance Art',
      year: 2025
    },
    {
      id: 'music-school',
      title: 'Klavierschule Glenn Miller',
      description: language === 'de'
        ? 'Online-Buchungssystem spart 15 Stunden pro Woche in der Verwaltung'
        : 'Online booking system saves 15 hours per week in administration',
      url: '#',
      image: '/images/portfolio/music-school-preview.jpg',
      tags: ['WordPress', 'Custom Plugin', 'Payment Gateway', 'Calendar API', 'SMS Reminders'],
      features: [
        language === 'de' ? 'Automatische Terminvergabe' : 'Automated Scheduling',
        language === 'de' ? 'SMS & Email Erinnerungen' : 'SMS & Email Reminders',
        language === 'de' ? 'Lehrer-Verfügbarkeit' : 'Teacher Availability',
        language === 'de' ? '80% weniger Ausfälle' : '80% Fewer No-Shows'
      ],
      industry: language === 'de' ? 'Musikbildung' : 'Music Education',
      year: 2024
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-4">
            <Award className="w-12 h-12 text-purple-600 dark:text-purple-400" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {language === 'de' ? 'Unsere Erfolgsgeschichten' : 'Our Success Stories'}
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {language === 'de' 
              ? 'Entdecken Sie, wie wir Unternehmen durch innovative digitale Lösungen transformiert haben'
              : 'Discover how we\'ve transformed businesses through innovative digital solutions'}
          </p>
        </motion.div>

        {/* Portfolio Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {portfolioItems.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              {/* Image Section */}
              <div className="relative h-64 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 overflow-hidden">
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.year}</span>
                </div>
                <div className="absolute bottom-4 left-4">
                  <span className="inline-block px-3 py-1 bg-purple-600 text-white text-sm rounded-full">
                    {item.industry}
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {item.description}
                </p>

                {/* Features */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {language === 'de' ? 'Hauptfunktionen:' : 'Key Features:'}
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {item.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-purple-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech Stack */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 group"
                >
                  <span>{language === 'de' ? 'Projekt ansehen' : 'View Project'}</span>
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/10 dark:to-blue-900/10 rounded-2xl p-8 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Code className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              <Palette className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <Zap className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {language === 'de' 
                ? 'Wir entwickeln Websites, Apps und digitale Lösungen'
                : 'We Build Websites, Apps, and Digital Solutions'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
              {language === 'de'
                ? 'Von der Konzeption bis zur Umsetzung - wir sind Ihr Partner für digitale Transformation und innovative Softwarelösungen.'
                : 'From concept to implementation - we are your partner for digital transformation and innovative software solutions.'}
            </p>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('openBookingModal'))}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-medium text-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
            >
              <span>{language === 'de' ? 'Projekt starten' : 'Start Your Project'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PortfolioShowcase;