import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, TrendingUp, Users, Clock, CheckCircle,
  Coffee, Scissors, Car, Heart, Building, ArrowRight,
  Calendar, Euro, Phone, ChevronRight, Globe,
  Code2, Cpu, Music, ShoppingBag, Stethoscope,
  Wrench, Sparkles, ExternalLink, Tag, Image
} from 'lucide-react';
import { useLanguage } from '../providers/LanguageProvider';
import { useNavigate } from 'react-router-dom';
import ProjectGallery from '../components/ProjectGallery';

const Portfolio: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: language === 'de' ? 'Alle' : 'All', count: 6 },
    { id: 'booking', label: language === 'de' ? 'Buchungssysteme' : 'Booking Systems', count: 4 },
    { id: 'website', label: language === 'de' ? 'Websites' : 'Websites', count: 2 },
    { id: 'automation', label: language === 'de' ? 'Automatisierung' : 'Automation', count: 0 }
  ];

  interface ProjectImage {
    url: string;
    alt: string;
    caption?: string;
    device?: 'desktop' | 'mobile';
  }

  interface Project {
    id: number;
    category: string;
    type: string;
    icon: any;
    name: string;
    industry: string;
    location: string;
    challenge: string;
    solution: string;
    results: { metric: string; label: string; }[];
    technologies: string[];
    testimonial: string;
    author: string;
    role: string;
    gradient: string;
    url?: string;
    images?: ProjectImage[];
    showGallery?: boolean;
  }

  const [expandedProject, setExpandedProject] = useState<number | null>(null);

  const projects: Project[] = [
    // Website Projects
    {
      id: 1,
      category: 'website',
      type: 'Website Development',
      icon: Music,
      name: 'Klavierschule Glenn Miller',
      industry: language === 'de' ? 'Musikbildung' : 'Music Education',
      location: 'Stuttgart',
      challenge: language === 'de' 
        ? 'Benötigte moderne Plattform für Musikunterricht mit integrierter Buchungsfunktion'
        : 'Needed modern platform for music lessons with integrated booking',
      solution: language === 'de'
        ? 'Maßgeschneiderte Website mit Buchungsintegration und Schülerverwaltung'
        : 'Custom website with booking integration and student management',
      results: [
        { metric: '2x', label: language === 'de' ? 'Schüleranmeldungen' : 'Student Enrollments' },
        { metric: '100%', label: language === 'de' ? 'Online-Zahlungen' : 'Online Payments' },
        { metric: '50%', label: language === 'de' ? 'Weniger Verwaltung' : 'Less Admin Work' }
      ],
      technologies: ['React', 'Next.js', 'Stripe', 'Tailwind CSS'],
      testimonial: language === 'de'
        ? "Die neue Website hat unsere Musikschule transformiert. Schüler können jetzt einfach online buchen und bezahlen."
        : "The new website transformed our music school. Students can now easily book and pay online.",
      author: "Glenn Miller",
      role: language === 'de' ? 'Gründer' : 'Founder',
      gradient: 'from-purple-600 to-pink-600',
      url: 'https://klavierschule-glennmiller.de',
      images: [
        {
          url: '/images/portfolio/klavierschule-homepage.jpg',
          alt: 'Klavierschule Glenn Miller Homepage',
          caption: 'Elegant homepage showcasing music education services',
          device: 'desktop'
        },
        {
          url: '/images/portfolio/klavierschule-booking.jpg',
          alt: 'Online Lesson Booking System',
          caption: 'Integrated booking system for music lessons',
          device: 'desktop'
        },
        {
          url: '/images/portfolio/klavierschule-mobile.jpg',
          alt: 'Mobile-Optimized Experience',
          caption: 'Responsive design for students on-the-go',
          device: 'mobile'
        }
      ]
    },
    {
      id: 2,
      category: 'website',
      type: 'E-Commerce Platform',
      icon: ShoppingBag,
      name: '33eye.de',
      industry: language === 'de' ? 'Mode & Einzelhandel' : 'Fashion & Retail',
      location: 'Berlin',
      challenge: language === 'de'
        ? 'Veraltete E-Commerce-Plattform mit schlechter Mobile-Performance'
        : 'Outdated e-commerce platform with poor mobile performance',
      solution: language === 'de'
        ? 'Moderne responsive Website mit KI-gestützten Produktempfehlungen'
        : 'Modern responsive website with AI-powered product recommendations',
      results: [
        { metric: '150%', label: language === 'de' ? 'Conversion-Steigerung' : 'Conversion Increase' },
        { metric: '3x', label: language === 'de' ? 'Mobile Traffic' : 'Mobile Traffic' },
        { metric: '€45k', label: language === 'de' ? 'Zusatzumsatz/Monat' : 'Extra Revenue/Month' }
      ],
      technologies: ['Vue.js', 'Shopify API', 'AI Integration', 'PWA'],
      testimonial: language === 'de'
        ? "Die KI-Empfehlungen haben unseren Umsatz explodieren lassen. Beste Investition ever!"
        : "The AI recommendations made our sales explode. Best investment ever!",
      author: "Eyerusalem",
      role: 'Professional Artist',
      gradient: 'from-blue-600 to-cyan-600',
      url: 'https://33eye.de',
      images: [
        {
          url: '/images/portfolio/33eye-homepage.jpg',
          alt: '33eye.de Homepage - Modern Fashion E-Commerce',
          caption: 'Clean, modern homepage with AI-powered product recommendations',
          device: 'desktop'
        },
        {
          url: '/images/portfolio/33eye-products.jpg',
          alt: '33eye.de Product Catalog',
          caption: 'Intuitive product browsing with smart filters',
          device: 'desktop'
        },
        {
          url: '/images/portfolio/33eye-mobile.jpg',
          alt: '33eye.de Mobile Experience',
          caption: 'Fully responsive mobile shopping experience',
          device: 'mobile'
        },
        {
          url: '/images/portfolio/33eye-checkout.jpg',
          alt: '33eye.de Checkout Process',
          caption: 'Streamlined checkout with multiple payment options',
          device: 'desktop'
        }
      ]
    },
    // Booking System Projects
    {
      id: 3,
      category: 'booking',
      type: 'Restaurant Booking',
      icon: Coffee,
      name: 'Restaurant Zum Goldenen Hirsch',
      industry: language === 'de' ? 'Gastronomie' : 'Hospitality',
      location: 'München',
      challenge: language === 'de'
        ? 'Telefon klingelte ständig während des Service, Personal überlastet'
        : 'Phone constantly ringing during service, staff overwhelmed',
      solution: language === 'de'
        ? 'Smart Booking System mit Tischverwaltung und automatischen Bestätigungen'
        : 'Smart booking system with table management and automatic confirmations',
      results: [
        { metric: '75%', label: language === 'de' ? 'Weniger Anrufe' : 'Fewer Phone Calls' },
        { metric: '2x', label: language === 'de' ? 'Tischumsatz' : 'Table Turnover' },
        { metric: '€8k', label: language === 'de' ? 'Monatliche Einsparung' : 'Monthly Savings' }
      ],
      technologies: ['Custom Booking Engine', 'SMS Integration', 'Table Management'],
      testimonial: language === 'de'
        ? "Endlich können wir uns aufs Kochen konzentrieren statt aufs Telefon!"
        : "Finally we can focus on cooking instead of the phone!",
      author: "Antonio Marcelli",
      role: language === 'de' ? 'Inhaber' : 'Owner',
      gradient: 'from-orange-600 to-red-600'
    },
    {
      id: 4,
      category: 'booking',
      type: 'Beauty & Wellness',
      icon: Scissors,
      name: 'Beauty Lounge Berlin',
      industry: language === 'de' ? 'Beauty & Wellness' : 'Beauty & Wellness',
      location: 'Berlin',
      challenge: language === 'de'
        ? 'Doppelbuchungen und verpasste Termine führten zu Umsatzverlusten'
        : 'Double bookings and missed appointments led to revenue loss',
      solution: language === 'de'
        ? 'Automatisierte Terminplanung mit intelligenten Erinnerungen'
        : 'Automated scheduling with intelligent reminders',
      results: [
        { metric: '€12k', label: language === 'de' ? 'Jährliche Einsparung' : 'Annual Savings' },
        { metric: '87%', label: language === 'de' ? 'Weniger No-Shows' : 'Fewer No-Shows' },
        { metric: '100%', label: language === 'de' ? 'Online-Buchungen' : 'Online Bookings' }
      ],
      technologies: ['Calendar Sync', 'WhatsApp Notifications', 'Payment Integration'],
      testimonial: language === 'de'
        ? "Unsere Stylisten lieben es! Keine Buchungschaos mehr, nur zufriedene Kunden."
        : "Our stylists love it! No more booking chaos, just happy customers.",
      author: "Marina Seidel",
      role: language === 'de' ? 'Geschäftsführerin' : 'Manager',
      gradient: 'from-pink-600 to-purple-600'
    },
    {
      id: 5,
      category: 'booking',
      type: 'Medical Practice',
      icon: Stethoscope,
      name: 'Dr. Schmidt Praxis',
      industry: language === 'de' ? 'Gesundheitswesen' : 'Healthcare',
      location: 'Frankfurt',
      challenge: language === 'de'
        ? 'Komplexe Terminplanung mit verschiedenen Behandlungstypen'
        : 'Complex appointment scheduling with different treatment types',
      solution: language === 'de'
        ? 'Medizinisches Buchungssystem mit DSGVO-Konformität'
        : 'Medical-grade booking system with GDPR compliance',
      results: [
        { metric: '0', label: language === 'de' ? 'Doppelbuchungen' : 'Double Bookings' },
        { metric: '30h', label: language === 'de' ? 'Wöchentlich gespart' : 'Saved Weekly' },
        { metric: '95%', label: language === 'de' ? 'Patientenzufriedenheit' : 'Patient Satisfaction' }
      ],
      technologies: ['GDPR-Compliant System', 'Patient Portal', 'Insurance Integration'],
      testimonial: language === 'de'
        ? "Perfekt für medizinische Praxen. DSGVO-konform und unglaublich effizient."
        : "Perfect for medical practices. GDPR compliant and incredibly efficient.",
      author: "Dr. Marco Falchi",
      role: language === 'de' ? 'Praxisinhaber' : 'Practice Owner',
      gradient: 'from-green-600 to-emerald-600'
    },
    {
      id: 6,
      category: 'booking',
      type: 'Automotive Service',
      icon: Wrench,
      name: 'AutoHaus Berlin',
      industry: language === 'de' ? 'Automobilservice' : 'Automotive Service',
      location: 'Berlin',
      challenge: language === 'de'
        ? 'Ineffiziente Werkstattauslastung und manuelle Terminvergabe'
        : 'Inefficient workshop capacity and manual appointment scheduling',
      solution: language === 'de'
        ? 'Service-Bay-Optimierungssystem mit Ressourcenplanung'
        : 'Service bay optimization system with resource planning',
      results: [
        { metric: '3x', label: language === 'de' ? 'Kapazitätssteigerung' : 'Capacity Increase' },
        { metric: '40%', label: language === 'de' ? 'Mehr Buchungen' : 'More Bookings' },
        { metric: '€25k', label: language === 'de' ? 'Zusatzumsatz/Monat' : 'Extra Revenue/Month' }
      ],
      technologies: ['Resource Planning', 'Automated Reminders', 'Service Tracking'],
      testimonial: language === 'de'
        ? "Game-Changer für unsere Werkstatt. Kunden buchen Services rund um die Uhr."
        : "Game-changer for our workshop. Customers book services 24/7.",
      author: "Thomas Becker",
      role: language === 'de' ? 'Werkstattleiter' : 'Workshop Manager',
      gradient: 'from-blue-600 to-indigo-600'
    }
  ];


  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 pt-16">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-xl rounded-2xl border border-white/10 mb-6">
              <Sparkles className="h-8 w-8 text-purple-400" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {language === 'de' 
                  ? 'Bewährte Erfolge in jeder Branche' 
                  : 'Proven Results Across Every Industry'}
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
              {language === 'de'
                ? 'Von Buchungssystemen bis zu maßgeschneiderten Websites - entdecken Sie, wie wir Unternehmen transformieren.'
                : 'From booking systems to custom websites - discover how we transform businesses.'}
            </p>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((cat) => (
                <motion.button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                    selectedCategory === cat.id
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/10'
                  }`}
                >
                  {cat.label}
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
                    {cat.count}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredProjects.map((project, index) => {
              const Icon = project.icon;
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden hover:border-purple-500/30 transition-all duration-300 group"
                >
                  {/* Header with gradient */}
                  <div className={`h-2 bg-gradient-to-r ${project.gradient}`} />
                  
                  <div className="p-8">
                    {/* Show Gallery Button for projects with images */}
                    {project.images && project.images.length > 0 && (
                      <button
                        onClick={() => setExpandedProject(expandedProject === project.id ? null : project.id)}
                        className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-400 rounded-lg hover:from-purple-600/30 hover:to-blue-600/30 transition-all border border-purple-500/30"
                      >
                        <Image className="w-4 h-4" />
                        {expandedProject === project.id ? 'Hide Screenshots' : `View ${project.images.length} Screenshots`}
                      </button>
                    )}

                    {/* Image Gallery */}
                    {project.images && expandedProject === project.id && (
                      <div className="mb-6">
                        <ProjectGallery images={project.images} projectName={project.name} />
                      </div>
                    )}
                    {/* Company and Industry */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`inline-flex p-3 bg-gradient-to-r ${project.gradient} rounded-xl`}>
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-gray-300 border border-white/20">
                              {project.type}
                            </span>
                          </div>
                        </div>
                        
                        <h3 className="text-2xl font-bold text-white mb-2">
                          {project.name}
                        </h3>
                        
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <Building className="h-4 w-4" />
                            {project.industry}
                          </span>
                          <span>•</span>
                          <span>{project.location}</span>
                        </div>
                      </div>
                      
                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <ExternalLink className="h-5 w-5 text-gray-400" />
                        </a>
                      )}
                    </div>

                    {/* Challenge & Solution */}
                    <div className="space-y-4 mb-6">
                      <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20">
                        <h4 className="text-sm font-semibold text-red-400 mb-2">
                          {language === 'de' ? 'Herausforderung' : 'Challenge'}
                        </h4>
                        <p className="text-gray-300 text-sm">
                          {project.challenge}
                        </p>
                      </div>
                      
                      <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
                        <h4 className="text-sm font-semibold text-green-400 mb-2">
                          {language === 'de' ? 'Lösung' : 'Solution'}
                        </h4>
                        <p className="text-gray-300 text-sm">
                          {project.solution}
                        </p>
                      </div>
                    </div>

                    {/* Results */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {project.results.map((result, idx) => (
                        <div key={idx} className="text-center bg-black/30 rounded-xl p-3">
                          <div className="text-2xl font-bold text-white mb-1">
                            {result.metric}
                          </div>
                          <div className="text-xs text-gray-400">
                            {result.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.technologies.map((tech, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-blue-300 rounded-lg text-xs border border-blue-500/30"
                        >
                          <Tag className="h-3 w-3" />
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Testimonial */}
                    <div className="bg-black/30 rounded-xl p-4 mb-4">
                      <p className="text-gray-300 italic mb-3">
                        "{project.testimonial}"
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-purple-400">
                            {project.author}
                          </p>
                          <p className="text-xs text-gray-500">
                            {project.role}
                          </p>
                        </div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* View Case Study Button */}
                    <button className="w-full py-3 bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-400 rounded-xl hover:from-purple-600/30 hover:to-blue-600/30 transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-purple-500/20">
                      {language === 'de' ? 'Fallstudie ansehen' : 'View Case Study'}
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Show message if no projects in category */}
          {filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="inline-flex p-4 bg-white/5 rounded-full mb-4">
                <Cpu className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {language === 'de' ? 'Projekte in Arbeit' : 'Projects Coming Soon'}
              </h3>
              <p className="text-gray-400">
                {language === 'de' 
                  ? 'Neue Automatisierungsprojekte werden bald hinzugefügt.'
                  : 'New automation projects will be added soon.'}
              </p>
            </motion.div>
          )}
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-12"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              {language === 'de' 
                ? 'Bereit, Ihre Erfolgsgeschichte zu schreiben?'
                : 'Ready to Be Our Next Success Story?'}
            </h2>
            <p className="text-xl text-white/90 mb-8">
              {language === 'de'
                ? 'Schließen Sie sich über 15 Unternehmen an, die bereits mit uns wachsen'
                : 'Join 15+ businesses already growing with us'}
            </p>
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('openBookingModal'))}
              className="inline-flex items-center px-8 py-4 bg-white text-purple-600 rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 font-semibold"
            >
              {language === 'de' ? 'Projekt starten' : 'Start Your Project'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;