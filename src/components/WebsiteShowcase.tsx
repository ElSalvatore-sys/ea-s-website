import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ExternalLink, Globe, Zap, Shield, Clock, 
  Smartphone, Code2, Palette, Star, Quote,
  CheckCircle, TrendingUp, Award, Eye,
  ChevronLeft, ChevronRight, Monitor
} from 'lucide-react';
import { useLanguage } from '../providers/LanguageProvider';
import WebsitePreview from './WebsitePreview';

interface WebsiteProject {
  id: string;
  title: string;
  url: string;
  description: string;
  client: string;
  year: number;
  screenshots: string[];
  currentScreenshot?: number;
  technologies: string[];
  metrics: {
    loadTime: string;
    pageSpeed: number;
    seoScore: number;
    mobileOptimized: boolean;
  };
  testimonial: {
    text: string;
    author: string;
    role: string;
  };
  features: string[];
  primaryColor: string;
}

const WebsiteShowcase: React.FC = () => {
  const { language, t } = useLanguage();
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [screenshotIndices, setScreenshotIndices] = useState<{ [key: string]: number }>({});

  const websites: WebsiteProject[] = [
    {
      id: 'klavierschule',
      title: 'Klavierschule Glenn Miller',
      url: 'https://klavierschule-glennmiller.de',
      description: language === 'de'
        ? 'Ausgezeichnetes Projekt 2024 - Moderne Website für Musikschule mit integriertem Buchungssystem'
        : 'Featured Project 2024 - Modern website for music school with integrated booking system',
      client: 'Glenn Miller Music Academy',
      year: 2024,
      screenshots: [
        'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800', // Piano keys
        'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800'  // Music lesson
      ],
      currentScreenshot: 0,
      technologies: ['WordPress', 'PHP', 'MySQL', 'JavaScript', 'CSS3', 'Elementor'],
      metrics: {
        loadTime: '1.8s',
        pageSpeed: 96,
        seoScore: 100,
        mobileOptimized: true
      },
      testimonial: {
        text: language === 'de'
          ? 'EA-S hat unsere Online-Präsenz revolutioniert. Die Buchungen sind um 300% gestiegen und wir sparen täglich 3 Stunden Verwaltungszeit.'
          : 'EA-S revolutionized our online presence. Bookings increased by 300% and we save 3 hours of admin time daily.',
        author: 'Glenn Miller',
        role: language === 'de' ? 'Schulleiter' : 'School Director'
      },
      features: [
        language === 'de' ? 'Online-Terminbuchung' : 'Online Appointment Booking',
        language === 'de' ? 'Kursplan-Integration' : 'Course Schedule Integration',
        language === 'de' ? 'Lehrer-Profile' : 'Teacher Profiles',
        language === 'de' ? 'Zahlungsintegration' : 'Payment Integration'
      ],
      primaryColor: 'from-amber-600 to-orange-600'
    },
    {
      id: '33eye',
      title: '33eye.de',
      url: 'https://33eye.de',
      description: language === 'de'
        ? 'Aktuelles Projekt 2025 - Künstler-Portfolio für internationale Kontorsionistin'
        : 'Latest Project 2025 - Artist portfolio for international contortionist',
      client: 'Eyerusalem - Performance Artist',
      year: 2025,
      screenshots: [
        'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200', // Real performance photo
        'website-mockup-gallery', // Gallery page mockup
        'website-mockup-booking'  // Booking page mockup
      ],
      currentScreenshot: 0,
      technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Vercel'],
      metrics: {
        loadTime: '1.2s',
        pageSpeed: 98,
        seoScore: 100,
        mobileOptimized: true
      },
      testimonial: {
        text: language === 'de'
          ? 'Die neue Website hat meine internationale Reichweite verdoppelt. Buchungsanfragen kommen jetzt aus der ganzen Welt!'
          : 'The new website doubled my international reach. Booking requests now come from all over the world!',
        author: 'Eyerusalem',
        role: language === 'de' ? 'Kontorsionskünstlerin' : 'Contortion Artist'
      },
      features: [
        language === 'de' ? 'Responsive Galerie' : 'Responsive Gallery',
        language === 'de' ? 'Performance-Kalender' : 'Performance Calendar',
        language === 'de' ? 'Video-Showcase' : 'Video Showcase',
        language === 'de' ? 'Mehrsprachig (DE/EN)' : 'Multilingual (DE/EN)'
      ],
      primaryColor: 'from-purple-600 to-pink-600'
    },
    {
      id: 'falchi-dental',
      title: 'Falchi Dental 3D Lab',
      url: 'https://falchi-dental.de',
      description: language === 'de'
        ? 'Dental 3D-Automatisierung - Revolutionäre Workflow-Optimierung für Dentallabore'
        : 'Dental 3D Automation - Revolutionary workflow optimization for dental labs',
      client: 'Falchi Dental',
      year: 2023,
      screenshots: [
        'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800', // Dental 3D
        'https://images.unsplash.com/photo-1609207825181-52d3214556dd?w=800'  // Dental tech
      ],
      currentScreenshot: 0,
      technologies: ['Python', 'Django', 'PostgreSQL', 'Docker', 'AI/ML', 'REST API'],
      metrics: {
        loadTime: '1.5s',
        pageSpeed: 95,
        seoScore: 98,
        mobileOptimized: true
      },
      testimonial: {
        text: language === 'de'
          ? 'EA-S hat unsere 3D-Druckprozesse komplett automatisiert. Was früher 3 Stunden dauerte, ist jetzt in 20 Minuten fertig!'
          : 'EA-S completely automated our 3D printing processes. What used to take 3 hours now takes just 20 minutes!',
        author: 'Dr. Marco Falchi',
        role: language === 'de' ? 'Laborleiter' : 'Lab Director'
      },
      features: [
        language === 'de' ? '3D-Druck Automatisierung' : '3D Print Automation',
        language === 'de' ? 'Workflow-Optimierung' : 'Workflow Optimization',
        language === 'de' ? 'Echtzeit-Überwachung' : 'Real-time Monitoring',
        language === 'de' ? 'Qualitätskontrolle' : 'Quality Control'
      ],
      primaryColor: 'from-teal-600 to-cyan-600'
    }
  ];

  // Cycle through screenshots on hover
  useEffect(() => {
    if (hoveredProject) {
      const interval = setInterval(() => {
        setScreenshotIndices(prev => ({
          ...prev,
          [hoveredProject]: ((prev[hoveredProject] || 0) + 1) %
            (hoveredProject === 'klavierschule' || hoveredProject === 'falchi-dental' ? 2 : 3)
        }));
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [hoveredProject]);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % 3); // Cycle through all 3 testimonials
    }, 8000); // Slower rotation - 8 seconds
    return () => clearInterval(interval);
  }, [websites.length]);

  const MetricCard: React.FC<{ icon: React.ElementType; label: string; value: string | number; color: string }> = 
    ({ icon: Icon, label, value, color }) => (
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10"
      >
        <Icon className={`w-6 h-6 ${color} mb-2`} />
        <p className="text-xs text-gray-400 mb-1">{label}</p>
        <p className="text-lg font-bold text-white">{value}</p>
      </motion.div>
    );

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        {/* Split Screen Preview */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {websites.slice(0, 2).map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
              className="relative group"
            >
              {/* Browser Frame */}
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/20 relative">
                {/* Year Badge */}
                <div className={`absolute -top-3 -right-3 z-10 px-4 py-2 rounded-full font-bold text-sm ${
                  project.year === 2024
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-orange-500/25'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25'
                }`}>
                  {project.year === 2024 ? t('websiteShowcase.featured2024') : t('websiteShowcase.latest2025')}
                </div>
                {/* Browser Header */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                  </div>
                  <div className="flex-1 bg-black/20 rounded-lg px-3 py-1">
                    <span className="text-xs text-gray-400">{project.url}</span>
                  </div>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-white" />
                  </a>
                </div>

                {/* Website Preview with cycling screenshots */}
                <div className="relative aspect-video rounded-lg overflow-hidden bg-black/40">
                  <AnimatePresence mode="wait">
                    {project.id === '33eye' ? (
                      // Hybrid approach for 33eye - mix of mockups and real photos
                      (() => {
                        const currentScreenshot = project.screenshots[screenshotIndices[project.id] || 0];
                        const isWebMockup = currentScreenshot.startsWith('website-mockup');
                        
                        if (isWebMockup) {
                          const mockupType = currentScreenshot.split('-')[2] as 'homepage' | 'gallery' | 'booking';
                          return (
                            <motion.div
                              key={`${project.id}-${screenshotIndices[project.id] || 0}`}
                              className="w-full h-full"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.5 }}
                            >
                              <WebsitePreview 
                                projectId={project.id}
                                screenshotType={mockupType}
                              />
                            </motion.div>
                          );
                        } else {
                          return (
                            <motion.div
                              key={`${project.id}-${screenshotIndices[project.id] || 0}`}
                              className="relative w-full h-full"
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.5 }}
                            >
                              <img
                                src={currentScreenshot}
                                alt="Eyerusalem - Contortion Performance"
                                className="w-full h-full object-cover"
                              />
                              {/* Overlay for performance photo */}
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                                <p className="text-white font-semibold">Eyerusalem in Performance</p>
                                <p className="text-gray-300 text-sm">World-Class Contortion Artist</p>
                              </div>
                            </motion.div>
                          );
                        }
                      })()
                    ) : (
                      <motion.img
                        key={`${project.id}-${screenshotIndices[project.id] || 0}`}
                        src={project.screenshots[screenshotIndices[project.id] || 0]}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                      />
                    )}
                  </AnimatePresence>
                  
                  {/* Hover Overlay */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-6"
                  >
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
                      <p className="text-gray-200 mb-4">{project.description}</p>
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${project.primaryColor} text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300`}
                      >
                        {language === 'de' ? 'Live Website besuchen' : 'Visit Live Website'}
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </motion.div>

                  {/* Screenshot indicators */}
                  <div className="absolute bottom-4 right-4 flex gap-1">
                    {project.screenshots.map((_, idx) => (
                      <div
                        key={idx}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          idx === (screenshotIndices[project.id] || 0) 
                            ? 'bg-white w-6' 
                            : 'bg-white/40'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Technology Stack */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-xl rounded-full text-xs text-purple-300 border border-purple-500/30"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Project Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 + 0.2 }}
                className="mt-6 bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-400">{language === 'de' ? 'Kunde' : 'Client'}</p>
                    <p className="text-white font-semibold">{project.client}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">{language === 'de' ? 'Jahr' : 'Year'}</p>
                    <p className="text-white font-semibold">{project.year}</p>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2">
                  {project.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-white text-center mb-8">
            {language === 'de' ? 'Performance Metriken' : 'Performance Metrics'}
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard 
              icon={Clock} 
              label={language === 'de' ? 'Ladezeit' : 'Load Time'} 
              value="<2s" 
              color="text-green-400"
            />
            <MetricCard 
              icon={Zap} 
              label="PageSpeed" 
              value="95+" 
              color="text-yellow-400"
            />
            <MetricCard 
              icon={TrendingUp} 
              label="SEO Score" 
              value="100" 
              color="text-blue-400"
            />
            <MetricCard 
              icon={Smartphone} 
              label={language === 'de' ? 'Mobile' : 'Mobile'} 
              value="✓" 
              color="text-purple-400"
            />
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/10"
        >
          <Quote className="w-12 h-12 text-purple-400 mb-6 mx-auto" />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTestimonial}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <p className="text-xl md:text-2xl text-white mb-6 italic">
                "{websites[activeTestimonial].testimonial.text}"
              </p>
              <div>
                <p className="text-white font-semibold">
                  {websites[activeTestimonial].testimonial.author}
                </p>
                <p className="text-gray-400">
                  {websites[activeTestimonial].testimonial.role}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Testimonial navigation */}
          <div className="flex justify-center gap-2 mt-6">
            {websites.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTestimonial(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  idx === activeTestimonial 
                    ? 'bg-purple-400 w-8' 
                    : 'bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <h3 className="text-3xl font-bold text-white mb-4">
            {language === 'de' 
              ? 'Bereit für Ihr eigenes Erfolgsprojekt?' 
              : 'Ready for Your Own Success Story?'}
          </h3>
          <p className="text-xl text-gray-300 mb-8">
            {language === 'de'
              ? 'Lassen Sie uns gemeinsam Ihre Vision verwirklichen'
              : "Let's bring your vision to life together"}
          </p>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('openBookingModal'))}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold text-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
          >
            {language === 'de' ? 'Projekt starten' : 'Start Your Project'}
            <ChevronRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default WebsiteShowcase;