import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building, TrendingUp, Zap, Users, Award, Sparkles,
  ExternalLink, Euro, Clock, CheckCircle, ArrowRight,
  Brain, GraduationCap, Stethoscope, Languages, Home
} from 'lucide-react';
import { useLanguage } from '../providers/LanguageProvider';

interface JourneyMilestone {
  year: string;
  title: string;
  event: string;
  metric: string;
  details?: string;
  link?: { text: string; url: string };
  icon: React.ElementType;
  color: string;
  revenue?: string;
}

const CompanyJourney: React.FC = () => {
  const { t } = useLanguage();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const milestones: JourneyMilestone[] = [
    {
      year: '2020',
      title: 'Started with Hotel am Kochbrunnen',
      event: 'First automated booking system deployment',
      metric: '16% revenue increase',
      details: 'Immediate 16% revenue increase proved our concept - reduced no-shows by 90%',
      link: { text: 'View case study', url: '/portfolio#hotel-kochbrunnen' },
      icon: Building,
      color: 'from-purple-600 to-blue-600',
      revenue: '+16%'
    },
    {
      year: '2021',
      title: 'Dental Innovation Breakthrough',
      event: 'Launched Falchi Dental 3D automation',
      metric: '3hrs → 20min',
      details: 'Reduced 3-hour processes to 20 minutes - revolutionary dental workflow',
      link: { text: 'See the system', url: '/portfolio#falchi-dental' },
      icon: Zap,
      color: 'from-blue-600 to-cyan-600'
    },
    {
      year: '2022',
      title: 'Education Sector Entry',
      event: 'Built Glenn Miller School platform',
      metric: '200+ weekly bookings',
      details: 'Triple language support: DE/EN/FR - Managing 200+ weekly bookings',
      link: { text: 'Visit site', url: 'https://klavierschule-glennmiller.de' },
      icon: Users,
      color: 'from-cyan-600 to-green-600'
    },
    {
      year: '2023',
      title: 'MindAI Development Begins',
      event: 'Started Europe\'s first local-only smart home AI',
      metric: '100% privacy',
      details: 'Zero cloud dependency for complete privacy - revolutionizing home automation',
      icon: Award,
      color: 'from-green-600 to-emerald-600'
    },
    {
      year: '2024',
      title: 'LingXM Platform Launch',
      event: '500M+ corpus sentences database',
      metric: '14 languages',
      details: '14 languages supported with 3 active development teams',
      icon: TrendingUp,
      color: 'from-emerald-600 to-purple-600',
      revenue: '500M+ sentences'
    },
    {
      year: '2025',
      title: 'Scaling Innovation',
      event: 'LingXM Travel for medical practices',
      metric: '80% time reduction',
      details: '80% time reduction for doctors - Next: AI-powered senior care solutions',
      icon: Sparkles,
      color: 'from-purple-600 to-pink-600'
    }
  ];

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/20 to-black" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              {t('journey.title')}
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            {t('journey.subtitle')}
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-purple-600 via-blue-600 to-purple-600 opacity-20" />
          
          {/* Milestones */}
          <div className="space-y-24">
            {milestones.map((milestone, index) => {
              const Icon = milestone.icon;
              const isLeft = index % 2 === 0;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`relative flex items-center ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Content */}
                  <div className={`w-1/2 ${isLeft ? 'pr-12 text-right' : 'pl-12 text-left'}`}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="inline-block"
                    >
                      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                        {/* Year badge */}
                        <div className={`inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r ${milestone.color} rounded-full mb-4`}>
                          <Clock className="w-4 h-4 text-white" />
                          <span className="text-white font-bold">{milestone.year}</span>
                        </div>
                        
                        {/* Title */}
                        <h3 className="text-2xl font-bold text-white mb-2">
                          {milestone.title}
                        </h3>
                        
                        {/* Event */}
                        <p className="text-gray-300 mb-3">
                          {milestone.event}
                        </p>
                        
                        {/* Metric */}
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          <span className="text-green-400 font-semibold">
                            {milestone.metric}
                          </span>
                        </div>
                        
                        {/* Revenue/Progress badge if applicable */}
                        {milestone.revenue && (
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-600/30 rounded-lg mb-3">
                            {milestone.revenue.includes('%') ? (
                              <TrendingUp className="w-4 h-4 text-green-400" />
                            ) : milestone.revenue.includes('sentences') ? (
                              <Languages className="w-4 h-4 text-green-400" />
                            ) : (
                              <Euro className="w-4 h-4 text-green-400" />
                            )}
                            <span className="text-green-400 font-bold">{milestone.revenue}</span>
                          </div>
                        )}
                        
                        {/* Progress Indicator Bar */}
                        <div className="w-full bg-white/5 rounded-full h-2 mb-3">
                          <motion.div 
                            className={`h-2 rounded-full bg-gradient-to-r ${milestone.color}`}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${(parseInt(milestone.year) - 2019) * 16.66}%` }}
                            transition={{ duration: 1, delay: index * 0.2 }}
                            viewport={{ once: true }}
                          />
                        </div>
                        
                        {/* Details (shown on hover) */}
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ 
                            height: hoveredIndex === index ? 'auto' : 0,
                            opacity: hoveredIndex === index ? 1 : 0
                          }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          {milestone.details && (
                            <p className="text-sm text-gray-400 mb-3">
                              {milestone.details}
                            </p>
                          )}
                          
                          {/* Link */}
                          {milestone.link && (
                            <a
                              href={milestone.link.url}
                              target={milestone.link.url.startsWith('http') ? '_blank' : undefined}
                              rel={milestone.link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                              className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
                            >
                              <span className="text-sm">{milestone.link.text}</span>
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>
                  
                  {/* Center icon */}
                  <div className="absolute left-1/2 transform -translate-x-1/2">
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className={`w-16 h-16 bg-gradient-to-r ${milestone.color} rounded-full flex items-center justify-center shadow-lg shadow-purple-500/25`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </motion.div>
                  </div>
                  
                  {/* Empty space for alternating layout */}
                  <div className="w-1/2" />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <h3 className="text-3xl font-bold text-white mb-6">
            {t('journey.cta.title')}
          </h3>
          <p className="text-xl text-gray-400 mb-8">
            {t('journey.cta.subtitle')}
          </p>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('openBookingModal'))}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
          >
            <span>{t('journey.cta.button')}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default CompanyJourney;