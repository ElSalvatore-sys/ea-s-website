import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../providers/LanguageProvider';
import { ArrowRight, TrendingUp, Users, Clock, Euro, Star, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import MacBrowserMockup from './MacBrowserMockup';
import DynamicWebsitePreview from './DynamicWebsitePreview';

interface CaseStudy {
  id: string;
  client: string;
  industry: string;
  imageUrl: string;
  websiteUrl?: string;
  logo?: string;
  challenge: string;
  solution: string;
  results: {
    metric: string;
    value: string;
    improvement: string;
    icon: React.ElementType;
  }[];
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
  technologies: string[];
  color: string;
}

const CaseStudyShowcase: React.FC = () => {
  const { t } = useLanguage();

  const caseStudies: CaseStudy[] = [
    {
      id: 'hotel-kochbrunnen',
      client: 'Hotel am Kochbrunnen',
      industry: 'Hospitality',
      imageUrl: '/images/clients/hotel-kochbrunnen-hero.jpg',
      websiteUrl: 'hotelamkochbrunnen.de',
      logo: '/images/clients/hotel-kochbrunnen-logo.png',
      challenge: t('caseStudies.hotelKochbrunnen.challenge'),
      solution: t('caseStudies.hotelKochbrunnen.solution'),
      results: [
        {
          metric: 'Revenue Increase',
          value: '+16%',
          improvement: '€***,***/year additional revenue',
          icon: TrendingUp
        },
        {
          metric: 'No-Show Reduction',
          value: '-90%',
          improvement: 'From €**,*** to €*,***/month loss',
          icon: Users
        },
        {
          metric: 'Booking Time',
          value: '70% faster',
          improvement: 'From 5 min to 90 seconds',
          icon: Clock
        },
        {
          metric: 'Staff Hours Saved',
          value: '15h/week',
          improvement: '€*,***/month in labor costs',
          icon: Euro
        }
      ],
      testimonial: {
        quote: "The booking system transformed operations. No-shows dropped 90% with deposit integration. The ROI was immediate - we saved €**,***/month in lost bookings.",
        author: "Hassan Arour",
        role: "Hotel Director"
      },
      technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe API', 'WhatsApp Business API'],
      color: '#8B7355'
    },
    {
      id: 'falchi-dental',
      client: 'Falchi Dental',
      industry: 'Healthcare',
      imageUrl: '/images/clients/falchi-dental-hero.jpg',
      websiteUrl: 'falchi.de',
      logo: '/images/clients/falchi-dental-logo.png',
      challenge: t('caseStudies.falchiDental.challenge'),
      solution: t('caseStudies.falchiDental.solution'),
      results: [
        {
          metric: '3D Processing Time',
          value: '89% faster',
          improvement: 'From 3 hours to 20 minutes',
          icon: Clock
        },
        {
          metric: 'Patient Wait Time',
          value: '-65%',
          improvement: 'Same-day crown fittings',
          icon: Users
        },
        {
          metric: 'Monthly Revenue',
          value: '+€**,***',
          improvement: 'Through efficiency gains',
          icon: Euro
        },
        {
          metric: 'Patient Satisfaction',
          value: '4.9/5',
          improvement: 'Up from 4.2/5',
          icon: Star
        }
      ],
      testimonial: {
        quote: "Martin Schneider made the decision to implement this system, and it revolutionized our practice. 3D processing went from 3 hours to 20 minutes. Same-day crowns are now standard.",
        author: "Dr. Marco Falchi",
        role: "Lead Dentist"
      },
      technologies: ['Python', 'TensorFlow', 'WebGL', 'Three.js', 'DICOM Processing'],
      color: '#00BFA6'
    },
    {
      id: 'glenn-miller',
      client: 'Glenn Miller Music School',
      industry: 'Education',
      imageUrl: '/images/clients/glenn-miller-hero.jpg',
      websiteUrl: 'klavierschule-glennmiller.de',
      logo: '/images/clients/glenn-miller-logo.png',
      challenge: t('caseStudies.glennMiller.challenge'),
      solution: t('caseStudies.glennMiller.solution'),
      results: [
        {
          metric: 'Student Retention',
          value: '+40%',
          improvement: 'Through gamified learning',
          icon: Users
        },
        {
          metric: 'Practice Time',
          value: '+2.5h/week',
          improvement: 'Average per student',
          icon: Clock
        },
        {
          metric: 'New Enrollments',
          value: '+65%',
          improvement: 'Via online platform',
          icon: TrendingUp
        },
        {
          metric: 'Revenue Growth',
          value: '+€***,***',
          improvement: 'Annual increase',
          icon: Euro
        }
      ],
      testimonial: {
        quote: "Our triple-language support (German, English, Russian) reaches more students. The gamified learning increased practice time by 2.5 hours/week. This technology transformed music education.",
        author: "Glenn Miller",
        role: "School Founder & Director"
      },
      technologies: ['Vue.js', 'Web Audio API', 'Machine Learning', 'PostgreSQL', 'WebRTC'],
      color: '#FF6B35'
    }
  ];

  return (
    <section className="py-20 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            {t('caseStudies.title')}
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            {t('caseStudies.subtitle')}
          </p>
        </motion.div>

        {/* Case Studies */}
        {caseStudies.map((study, index) => (
          <motion.div
            key={study.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: index * 0.2 }}
            className={`mb-32 ${index % 2 === 0 ? '' : ''}`}
          >
            {/* Full-width alternating layout */}
            <div className={`grid lg:grid-cols-2 gap-0 ${index % 2 === 0 ? '' : 'lg:grid-flow-dense'}`}>
              {/* Image Side - Mac Browser Mockup */}
              <div className={`relative flex items-center justify-center p-8 bg-gradient-to-br from-gray-900 via-purple-900/10 to-gray-900 ${index % 2 === 0 ? '' : 'lg:col-start-2'}`}>
                <div className="w-full max-w-2xl">
                  <MacBrowserMockup
                    url={study.websiteUrl}
                    showAddressBar={true}
                  >
                    <DynamicWebsitePreview
                      title={study.client}
                      url={study.websiteUrl}
                      primaryColor={study.color === '#8B7355' ? 'from-amber-700 to-amber-900' : study.color === '#00BFA6' ? 'from-teal-600 to-cyan-600' : 'from-amber-600 to-orange-600'}
                      type={study.id === 'hotel-kochbrunnen' ? 'hotel' : study.id === 'falchi-dental' ? 'dental' : 'music'}
                    />
                  </MacBrowserMockup>
                </div>
              </div>

              {/* Content Side */}
              <div className={`bg-gradient-to-br from-white/5 to-transparent p-12 lg:p-16 ${index % 2 === 0 ? '' : 'lg:col-start-1'}`}>
                <div className="max-w-xl">
                  {/* Client Info */}
                  <div className="mb-6">
                    <span className="text-sm text-gray-400 uppercase tracking-wider">{study.industry}</span>
                    <h3 className="text-3xl font-bold text-white mt-2">{study.client}</h3>
                  </div>

                  {/* Challenge & Solution */}
                  <div className="mb-8 space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-purple-400 mb-2">Challenge</h4>
                      <p className="text-gray-300">{study.challenge}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-blue-400 mb-2">Solution</h4>
                      <p className="text-gray-300">{study.solution}</p>
                    </div>
                  </div>

                  {/* Results Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {study.results.map((result, idx) => {
                      const Icon = result.icon;
                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.1 * idx }}
                          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-4"
                        >
                          <div className="flex items-start gap-3">
                            <Icon className="w-5 h-5 text-purple-400 mt-1" />
                            <div>
                              <div className="text-2xl font-bold text-white">{result.value}</div>
                              <div className="text-xs text-gray-400 mt-1">{result.metric}</div>
                              <div className="text-xs text-gray-500 mt-1">{result.improvement}</div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Testimonial */}
                  {study.testimonial && (
                    <div className="mb-8 p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg">
                      <p className="text-gray-300 italic mb-4">"{study.testimonial.quote}"</p>
                      <div>
                        <div className="font-semibold text-white">{study.testimonial.author}</div>
                        <div className="text-sm text-gray-400">{study.testimonial.role}</div>
                      </div>
                    </div>
                  )}

                  {/* Technologies */}
                  <div className="mb-8">
                    <h4 className="text-sm font-semibold text-gray-400 mb-3">Technologies Used</h4>
                    <div className="flex flex-wrap gap-2">
                      {study.technologies.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-xs text-gray-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <Link
                    to={`/portfolio#${study.id}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 group"
                  >
                    View Full Case Study
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <h3 className="text-2xl font-bold text-white mb-4">
            {t('caseStudies.cta.title')}
          </h3>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            {t('caseStudies.cta.description')}
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 group"
          >
            <BarChart3 className="w-5 h-5" />
            Get Your Free Analysis
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CaseStudyShowcase;