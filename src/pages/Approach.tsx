import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Lightbulb, Hammer, TrendingUp, 
  CheckCircle, ArrowRight, Users, Award, 
  Shield, Euro, Clock, Globe, 
  Building2, Scissors, Stethoscope, Wrench,
  ShoppingBag, GraduationCap, Utensils, Home,
  Target, Sparkles, HandshakeIcon, BarChart3
} from 'lucide-react';
import { useLanguage } from '../providers/LanguageProvider';
import { useNavigate } from 'react-router-dom';
import { getSmartCTA } from '../utils/smartCTA';

const Approach: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [activeProcess, setActiveProcess] = useState(0);
  const currentLang = language === 'de' ? 'de' : 'en';

  const processSteps = [
    {
      icon: Search,
      number: '01',
      title: language === 'de' ? 'Entdeckung' : 'Discovery',
      subtitle: language === 'de' 
        ? 'Ihre einzigartigen Herausforderungen verstehen'
        : 'Understanding your unique challenges',
      description: language === 'de'
        ? 'Wir beginnen mit einem kostenlosen Beratungsgespräch, um Ihre Geschäftsprozesse, Schmerzpunkte und Ziele zu verstehen. Unser Team analysiert Ihre aktuelle Situation und identifiziert Optimierungspotenziale.'
        : 'We start with a free consultation to understand your business processes, pain points, and goals. Our team analyzes your current situation and identifies optimization opportunities.',
      duration: language === 'de' ? '1-2 Tage' : '1-2 Days',
      deliverables: [
        language === 'de' ? 'Bedarfsanalyse' : 'Needs Analysis',
        language === 'de' ? 'Prozess-Mapping' : 'Process Mapping',
        language === 'de' ? 'Machbarkeitsstudie' : 'Feasibility Study'
      ]
    },
    {
      icon: Lightbulb,
      number: '02',
      title: language === 'de' ? 'Strategie' : 'Strategy',
      subtitle: language === 'de'
        ? 'Die perfekte Lösung entwerfen'
        : 'Designing the perfect solution',
      description: language === 'de'
        ? 'Basierend auf unserer Analyse entwickeln wir eine maßgeschneiderte Strategie. Wir präsentieren Ihnen einen detaillierten Plan mit klaren Meilensteinen, Zeitrahmen und erwarteten Ergebnissen.'
        : 'Based on our analysis, we develop a customized strategy. We present you with a detailed plan including clear milestones, timelines, and expected outcomes.',
      duration: language === 'de' ? '3-5 Tage' : '3-5 Days',
      deliverables: [
        language === 'de' ? 'Lösungskonzept' : 'Solution Blueprint',
        language === 'de' ? 'Projektplan' : 'Project Roadmap',
        language === 'de' ? 'ROI-Prognose' : 'ROI Forecast'
      ]
    },
    {
      icon: Hammer,
      number: '03',
      title: language === 'de' ? 'Implementierung' : 'Implementation',
      subtitle: language === 'de'
        ? 'Mit deutscher Präzision bauen'
        : 'Building with German precision',
      description: language === 'de'
        ? 'Unser erfahrenes Team setzt die Lösung mit höchster Qualität um. Wir arbeiten agil, halten Sie kontinuierlich auf dem Laufenden und passen uns flexibel an Ihre Bedürfnisse an.'
        : 'Our experienced team implements the solution with the highest quality standards. We work agile, keep you continuously updated, and flexibly adapt to your needs.',
      duration: language === 'de' ? '2-8 Wochen' : '2-8 Weeks',
      deliverables: [
        language === 'de' ? 'Fertige Lösung' : 'Complete Solution',
        language === 'de' ? 'Schulung' : 'Training',
        language === 'de' ? 'Dokumentation' : 'Documentation'
      ]
    },
    {
      icon: TrendingUp,
      number: '04',
      title: language === 'de' ? 'Optimierung' : 'Optimization',
      subtitle: language === 'de'
        ? 'Kontinuierliche Verbesserung'
        : 'Continuous improvement',
      description: language === 'de'
        ? 'Nach dem Launch überwachen wir die Performance, sammeln Feedback und optimieren kontinuierlich. Ihr Erfolg ist unser Erfolg - wir bleiben Ihr Partner für langfristiges Wachstum.'
        : 'After launch, we monitor performance, gather feedback, and continuously optimize. Your success is our success - we remain your partner for long-term growth.',
      duration: language === 'de' ? 'Fortlaufend' : 'Ongoing',
      deliverables: [
        language === 'de' ? 'Performance-Reports' : 'Performance Reports',
        language === 'de' ? 'A/B-Tests' : 'A/B Testing',
        language === 'de' ? 'Updates & Support' : 'Updates & Support'
      ]
    }
  ];

  const reasons = [
    {
      icon: Globe,
      title: language === 'de' ? 'Lokale Expertise' : 'Local Expertise',
      description: language === 'de'
        ? 'Wir verstehen deutsche Geschäftskultur, Regularien und Marktanforderungen. DSGVO, GoBD, und lokale Feiertage sind für uns selbstverständlich.'
        : 'We understand German business culture, regulations, and market requirements. GDPR, GoBD, and local holidays are second nature to us.',
      highlight: language === 'de' ? '100% DSGVO-konform' : '100% GDPR compliant'
    },
    {
      icon: Award,
      title: language === 'de' ? 'Bewährte Ergebnisse' : 'Proven Results',
      description: language === 'de'
        ? 'Über 15 erfolgreiche Projekte sprechen für sich. Von kleinen Startups bis zu etablierten Mittelständlern - wir liefern messbare Ergebnisse.'
        : 'Over 15 successful projects speak for themselves. From small startups to established medium-sized companies - we deliver measurable results.',
      highlight: language === 'de' ? '15+ erfolgreiche Projekte' : '15+ successful projects'
    },
    {
      icon: HandshakeIcon,
      title: language === 'de' ? 'Full-Service Ansatz' : 'Full-Service Approach',
      description: language === 'de'
        ? 'Ein Partner für alles: Buchungssysteme, Websites, Automatisierung. Keine Koordination zwischen verschiedenen Agenturen nötig.'
        : 'One partner for everything: booking systems, websites, automation. No coordination between different agencies needed.',
      highlight: language === 'de' ? 'Alles aus einer Hand' : 'Everything from one source'
    },
    {
      icon: Euro,
      title: language === 'de' ? 'Transparente Preise' : 'Transparent Pricing',
      description: language === 'de'
        ? 'Keine versteckten Gebühren, keine Überraschungen. Klare Pakete mit festen Preisen und flexiblen Add-ons für Ihre Bedürfnisse.'
        : 'No hidden fees, no surprises. Clear packages with fixed prices and flexible add-ons for your needs.',
      highlight: language === 'de' ? 'Keine versteckten Kosten' : 'No hidden fees'
    }
  ];

  const industries = [
    {
      icon: Utensils,
      name: language === 'de' ? 'Gastronomie' : 'Restaurants',
      description: language === 'de' 
        ? 'Tischreservierungen, Lieferservice-Integration, digitale Speisekarten'
        : 'Table reservations, delivery integration, digital menus',
      solutions: [
        language === 'de' ? 'Online-Reservierungen' : 'Online Reservations',
        language === 'de' ? 'Mittagspausen-Management' : 'Lunch Break Management',
        language === 'de' ? 'Stammkunden-System' : 'Regular Customer System'
      ],
      caseStudy: language === 'de' ? '75% weniger Telefon-Reservierungen' : '75% fewer phone reservations'
    },
    {
      icon: Scissors,
      name: language === 'de' ? 'Beauty & Wellness' : 'Beauty & Wellness',
      description: language === 'de'
        ? 'Terminbuchung, Paketangebote, Kundenverwaltung'
        : 'Appointment booking, package deals, customer management',
      solutions: [
        language === 'de' ? 'Service-Katalog' : 'Service Catalog',
        language === 'de' ? 'Mitarbeiter-Planung' : 'Staff Scheduling',
        language === 'de' ? 'Umsell-Automatisierung' : 'Upsell Automation'
      ],
      caseStudy: language === 'de' ? '€12k jährliche Einsparungen' : '€12k annual savings'
    },
    {
      icon: Stethoscope,
      name: language === 'de' ? 'Gesundheitswesen' : 'Healthcare',
      description: language === 'de'
        ? 'Patiententermine, Recall-System, digitale Anamnese'
        : 'Patient appointments, recall system, digital medical history',
      solutions: [
        language === 'de' ? 'Arzt-Terminbuchung' : 'Doctor Appointments',
        language === 'de' ? 'Rezept-Verwaltung' : 'Prescription Management',
        language === 'de' ? 'Videosprechstunden' : 'Video Consultations'
      ],
      caseStudy: language === 'de' ? '0 Doppelbuchungen' : '0 double bookings'
    },
    {
      icon: Wrench,
      name: language === 'de' ? 'Handwerk & Service' : 'Trades & Services',
      description: language === 'de'
        ? 'Auftragsplanung, Ressourcenverwaltung, Kostenvoranschläge'
        : 'Job scheduling, resource management, cost estimates',
      solutions: [
        language === 'de' ? 'Werkstatt-Termine' : 'Workshop Appointments',
        language === 'de' ? 'Ersatzteil-Tracking' : 'Parts Tracking',
        language === 'de' ? 'Fahrzeug-Historie' : 'Vehicle History'
      ],
      caseStudy: language === 'de' ? '3x mehr Kapazität' : '3x more capacity'
    },
    {
      icon: GraduationCap,
      name: language === 'de' ? 'Bildung & Training' : 'Education & Training',
      description: language === 'de'
        ? 'Kursbuchungen, Teilnehmerverwaltung, Online-Schulungen'
        : 'Course bookings, participant management, online training',
      solutions: [
        language === 'de' ? 'Kurs-Anmeldungen' : 'Course Registrations',
        language === 'de' ? 'Wartelisten-Management' : 'Waitlist Management',
        language === 'de' ? 'Zertifikat-Ausstellung' : 'Certificate Issuance'
      ],
      caseStudy: language === 'de' ? '90% Automatisierung' : '90% automation'
    },
    {
      icon: Home,
      name: language === 'de' ? 'Immobilien' : 'Real Estate',
      description: language === 'de'
        ? 'Besichtigungstermine, Interessentenverwaltung, Dokumentation'
        : 'Viewing appointments, lead management, documentation',
      solutions: [
        language === 'de' ? 'Besichtigungs-Kalender' : 'Viewing Calendar',
        language === 'de' ? 'Interessenten-Scoring' : 'Lead Scoring',
        language === 'de' ? 'Dokument-Portal' : 'Document Portal'
      ],
      caseStudy: language === 'de' ? '50% schnellere Vermittlung' : '50% faster transactions'
    }
  ];

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
              <Target className="h-8 w-8 text-purple-400" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {language === 'de' ? 'Wie Wir Arbeiten' : 'How We Work'}
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
              {language === 'de' 
                ? 'Von der ersten Idee bis zum messbaren Erfolg - unser bewährter Prozess garantiert Ergebnisse, die Ihr Geschäft transformieren.'
                : 'From initial idea to measurable success - our proven process guarantees results that transform your business.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Process Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              {language === 'de' ? 'Unser Prozess' : 'Our Process'}
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {language === 'de'
                ? 'Vier Schritte zu Ihrer digitalen Transformation'
                : 'Four steps to your digital transformation'}
            </p>
          </div>

          {/* Process Timeline */}
          <div className="relative mb-12">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-purple-600 to-blue-600 rounded-full" />
            
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex items-center mb-16 ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}
              >
                <div className="flex-1">
                  <div className={`${index % 2 === 0 ? 'lg:pr-12' : 'lg:pl-12'}`}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setActiveProcess(index)}
                      className={`bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-8 border cursor-pointer transition-all duration-300 ${
                        activeProcess === index 
                          ? 'border-purple-500/50 shadow-lg shadow-purple-500/25' 
                          : 'border-white/10 hover:border-purple-500/30'
                      }`}
                    >
                      <div className="flex items-center mb-4">
                        <div className="text-4xl font-bold text-purple-400 mr-4">
                          {step.number}
                        </div>
                        <div className="p-3 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl">
                          <step.icon className="h-6 w-6 text-purple-400" />
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {step.title}
                      </h3>
                      <p className="text-purple-400 mb-4">
                        {step.subtitle}
                      </p>
                      <p className="text-gray-300 mb-6">
                        {step.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div>
                          <span className="text-gray-400">
                            {language === 'de' ? 'Dauer: ' : 'Duration: '}
                          </span>
                          <span className="text-white font-medium">
                            {step.duration}
                          </span>
                        </div>
                        <ArrowRight className={`h-5 w-5 transition-transform ${
                          activeProcess === index ? 'translate-x-2 text-purple-400' : 'text-gray-400'
                        }`} />
                      </div>

                      {/* Deliverables (shown when active) */}
                      {activeProcess === index && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-6 pt-6 border-t border-white/10"
                        >
                          <p className="text-sm text-gray-400 mb-3">
                            {language === 'de' ? 'Ergebnisse:' : 'Deliverables:'}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {step.deliverables.map((item, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  </div>
                </div>
                
                {/* Center dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full border-4 border-gray-900 z-10" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose EA Solutions */}
      <section className="py-20 bg-gradient-to-br from-purple-900/20 to-blue-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              {language === 'de' ? 'Warum EA Solutions?' : 'Why Choose EA Solutions?'}
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {language === 'de'
                ? 'Vier überzeugende Gründe für eine Partnerschaft mit uns'
                : 'Four compelling reasons to partner with us'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {reasons.map((reason, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-8 hover:border-purple-500/30 transition-all duration-300"
              >
                <div className="flex items-start">
                  <div className="p-3 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl mr-4">
                    <reason.icon className="h-6 w-6 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-3">
                      {reason.title}
                    </h3>
                    <p className="text-gray-300 mb-4">
                      {reason.description}
                    </p>
                    <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                      <span className="text-sm text-purple-300 font-medium">
                        {reason.highlight}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { 
                value: '15+', 
                label: language === 'de' ? 'Erfolgreiche Projekte' : 'Successful Projects' 
              },
              { 
                value: '98%', 
                label: language === 'de' ? 'Kundenzufriedenheit' : 'Customer Satisfaction' 
              },
              { 
                value: '24/7', 
                label: language === 'de' ? 'Support verfügbar' : 'Support Available' 
              },
              { 
                value: '100%', 
                label: language === 'de' ? 'DSGVO-konform' : 'GDPR Compliant' 
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              {language === 'de' ? 'Branchen, die wir bedienen' : 'Industries We Serve'}
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {language === 'de'
                ? 'Maßgeschneiderte Lösungen für jede Branche - wir verstehen Ihre spezifischen Anforderungen'
                : 'Tailored solutions for every industry - we understand your specific requirements'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((industry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-purple-500/30 transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl mr-3">
                    <industry.icon className="h-6 w-6 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {industry.name}
                  </h3>
                </div>

                <p className="text-gray-400 mb-4">
                  {industry.description}
                </p>

                <div className="space-y-2 mb-4">
                  {industry.solutions.map((solution, idx) => (
                    <div key={idx} className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                      <span className="text-gray-300">{solution}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center">
                    <BarChart3 className="h-4 w-4 text-purple-400 mr-2" />
                    <span className="text-sm text-purple-300 font-medium">
                      {industry.caseStudy}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
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
            <Sparkles className="h-12 w-12 text-white mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-6">
              {language === 'de' 
                ? 'Bereit, Ihr Geschäft zu transformieren?'
                : 'Ready to Transform Your Business?'}
            </h2>
            <p className="text-xl text-white/90 mb-8">
              {language === 'de'
                ? 'Lassen Sie uns gemeinsam Ihre digitale Zukunft gestalten.'
                : "Let's shape your digital future together."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {(() => {
                const primaryCTA = getSmartCTA('approach-process', 'primary', currentLang);
                return (
                  <button
                    onClick={primaryCTA.action}
                    className="inline-flex items-center px-8 py-4 bg-white text-purple-600 rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 font-semibold"
                  >
                    {primaryCTA.text[currentLang]}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                );
              })()}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Approach;