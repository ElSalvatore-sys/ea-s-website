import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, X, Star, Zap, Shield, Users, 
  CreditCard, Headphones, Code, BarChart3,
  ArrowRight, ChevronDown, ChevronUp, Sparkles,
  Globe, Clock, Building, Plus, Infinity, FileText
} from 'lucide-react';
import { useLanguage } from '../providers/LanguageProvider';
import { useNavigate } from 'react-router-dom';
import { getSmartCTA } from '../utils/smartCTA';

const Pricing: React.FC = () => {
  const { t, language } = useLanguage();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const navigate = useNavigate();
  const currentLang = language === 'de' ? 'de' : 'en';

  const plans = [
    {
      id: 'starter',
      name: 'DIGITAL STARTER',
      price: '€39',
      period: language === 'de' ? '/Monat' : '/month',
      description: language === 'de' 
        ? 'Buchungssystem ODER Basis-Website (wählen Sie eines)'
        : 'Booking system OR basic website (choose one)',
      ideal: language === 'de'
        ? 'Perfekt für: Kleine Unternehmen, die digital starten'
        : 'Perfect for: Small businesses going digital',
      features: [
        { 
          text: language === 'de' ? 'Buchungssystem ODER Basis-Website' : 'Booking system OR basic website',
          included: true 
        },
        { 
          text: language === 'de' ? 'Bis zu 500 Buchungen/Monat' : 'Up to 500 bookings/month',
          included: true 
        },
        { 
          text: language === 'de' ? '5 Mitarbeiterkonten' : '5 staff accounts',
          included: true 
        },
        { 
          text: language === 'de' ? 'E-Mail Support' : 'Email support',
          included: true 
        },
        { 
          text: language === 'de' ? 'Mobil optimiert' : 'Mobile responsive',
          included: true 
        },
        { 
          text: language === 'de' ? 'Basis-Analyse Dashboard' : 'Basic analytics',
          included: true 
        },
        { 
          text: language === 'de' ? 'SSL-Zertifikat' : 'SSL certificate',
          included: true 
        },
        { 
          text: language === 'de' ? 'DSGVO-konform' : 'GDPR compliant',
          included: true 
        },
        { 
          text: language === 'de' ? 'WhatsApp/SMS Benachrichtigungen' : 'WhatsApp/SMS notifications',
          included: false 
        },
        { 
          text: language === 'de' ? 'API-Zugang' : 'API access',
          included: false 
        },
        { 
          text: language === 'de' ? 'Individuelle Gestaltung' : 'Custom design',
          included: false 
        }
      ],
      popular: false,
      color: 'from-gray-600 to-gray-700'
    },
    {
      id: 'growth',
      name: 'BUSINESS GROWTH',
      price: '€99',
      period: language === 'de' ? '/Monat' : '/month',
      description: language === 'de'
        ? 'Buchungssystem UND professionelle Website'
        : 'Booking system AND professional website',
      ideal: language === 'de'
        ? 'Beliebt bei: Wachsende Unternehmen mit Ambitionen'
        : 'Popular with: Growing businesses with ambitions',
      features: [
        { 
          text: language === 'de' ? 'Buchungssystem UND Website' : 'Booking system AND website',
          included: true 
        },
        { 
          text: language === 'de' ? 'Unbegrenzte Buchungen' : 'Unlimited bookings',
          included: true 
        },
        { 
          text: language === 'de' ? 'Unbegrenzte Mitarbeiterkonten' : 'Unlimited staff accounts',
          included: true 
        },
        { 
          text: language === 'de' ? 'Priorität Telefon + E-Mail Support' : 'Priority phone + email support',
          included: true 
        },
        { 
          text: language === 'de' ? 'Individuelle Gestaltung (keine Vorlagen)' : 'Custom design (not templates)',
          included: true 
        },
        { 
          text: language === 'de' ? 'Erweitertes Analyse-Dashboard' : 'Advanced analytics dashboard',
          included: true 
        },
        { 
          text: language === 'de' ? 'WhatsApp/SMS Benachrichtigungen' : 'WhatsApp/SMS notifications',
          included: true 
        },
        { 
          text: language === 'de' ? 'API-Zugang' : 'API access',
          included: true 
        },
        { 
          text: language === 'de' ? 'Marketing-Integrationen' : 'Marketing integrations',
          included: true 
        },
        { 
          text: language === 'de' ? 'Mehrere Standorte' : 'Multiple locations',
          included: false 
        },
        { 
          text: language === 'de' ? 'Dedizierter Account Manager' : 'Dedicated account manager',
          included: false 
        }
      ],
      popular: true,
      color: 'from-purple-600 to-blue-600'
    },
    {
      id: 'enterprise',
      name: 'ENTERPRISE COMPLETE',
      price: '€299',
      period: language === 'de' ? '/Monat' : '/month',
      description: language === 'de'
        ? 'Alles aus Business Growth PLUS Enterprise-Features'
        : 'Everything in Business Growth PLUS enterprise features',
      ideal: language === 'de'
        ? 'Für: Unternehmen mit mehreren Standorten'
        : 'For: Businesses with multiple locations',
      features: [
        { 
          text: language === 'de' ? 'Alles aus Business Growth' : 'Everything in Business Growth',
          included: true 
        },
        { 
          text: language === 'de' ? 'Mehrere Standorte/Filialen' : 'Multiple locations/branches',
          included: true 
        },
        { 
          text: language === 'de' ? 'Individuelle Automatisierungs-Workflows' : 'Custom automation workflows',
          included: true 
        },
        { 
          text: language === 'de' ? 'Dedizierter Account Manager' : 'Dedicated account manager',
          included: true 
        },
        { 
          text: language === 'de' ? 'SLA-Garantie (99,9% Verfügbarkeit)' : 'SLA guarantee (99.9% uptime)',
          included: true 
        },
        { 
          text: language === 'de' ? 'Individuelle Feature-Entwicklung' : 'Custom feature development',
          included: true 
        },
        { 
          text: language === 'de' ? 'Vor-Ort-Schulung' : 'On-site training',
          included: true 
        },
        { 
          text: language === 'de' ? 'White-Label-Optionen' : 'White-label options',
          included: true 
        },
        { 
          text: language === 'de' ? 'Priorität bei neuen Features' : 'Priority for new features',
          included: true 
        },
        { 
          text: language === 'de' ? 'Quartalsbericht & Strategie-Calls' : 'Quarterly reports & strategy calls',
          included: true 
        }
      ],
      popular: false,
      color: 'from-blue-600 to-cyan-600'
    }
  ];

  const comparisonFeatures = [
    {
      category: language === 'de' ? 'Was ist enthalten' : 'What\'s Included',
      features: [
        {
          name: language === 'de' ? 'Buchungssystem' : 'Booking System',
          starter: language === 'de' ? 'ODER Website' : 'OR Website',
          growth: '✓',
          enterprise: '✓'
        },
        {
          name: language === 'de' ? 'Professionelle Website' : 'Professional Website',
          starter: language === 'de' ? 'ODER Buchung' : 'OR Booking',
          growth: '✓',
          enterprise: '✓'
        },
        {
          name: language === 'de' ? 'Individuelle Gestaltung' : 'Custom Design',
          starter: language === 'de' ? 'Vorlagen' : 'Templates',
          growth: '✓',
          enterprise: '✓'
        },
        {
          name: language === 'de' ? 'Mobile App' : 'Mobile App',
          starter: '-',
          growth: language === 'de' ? 'Web-App' : 'Web App',
          enterprise: language === 'de' ? 'Native Apps' : 'Native Apps'
        }
      ]
    },
    {
      category: language === 'de' ? 'Kapazität & Limits' : 'Capacity & Limits',
      features: [
        {
          name: language === 'de' ? 'Monatliche Buchungen' : 'Monthly Bookings',
          starter: '500',
          growth: language === 'de' ? 'Unbegrenzt' : 'Unlimited',
          enterprise: language === 'de' ? 'Unbegrenzt' : 'Unlimited'
        },
        {
          name: language === 'de' ? 'Mitarbeiterkonten' : 'Staff Accounts',
          starter: '5',
          growth: language === 'de' ? 'Unbegrenzt' : 'Unlimited',
          enterprise: language === 'de' ? 'Unbegrenzt' : 'Unlimited'
        },
        {
          name: language === 'de' ? 'Standorte/Filialen' : 'Locations/Branches',
          starter: '1',
          growth: '1',
          enterprise: language === 'de' ? 'Unbegrenzt' : 'Unlimited'
        },
        {
          name: language === 'de' ? 'Speicherplatz' : 'Storage Space',
          starter: '10 GB',
          growth: '100 GB',
          enterprise: '1 TB'
        }
      ]
    },
    {
      category: language === 'de' ? 'Support & Service' : 'Support & Service',
      features: [
        {
          name: language === 'de' ? 'Support-Kanäle' : 'Support Channels',
          starter: 'Email',
          growth: language === 'de' ? 'Email + Telefon' : 'Email + Phone',
          enterprise: language === 'de' ? 'Alle + Dediziert' : 'All + Dedicated'
        },
        {
          name: language === 'de' ? 'Reaktionszeit' : 'Response Time',
          starter: '48h',
          growth: '4h',
          enterprise: '1h'
        },
        {
          name: language === 'de' ? 'Account Manager' : 'Account Manager',
          starter: '-',
          growth: '-',
          enterprise: '✓'
        },
        {
          name: language === 'de' ? 'Vor-Ort-Schulung' : 'On-site Training',
          starter: '-',
          growth: language === 'de' ? 'Online' : 'Online',
          enterprise: '✓'
        }
      ]
    },
    {
      category: language === 'de' ? 'Technische Features' : 'Technical Features',
      features: [
        {
          name: language === 'de' ? 'API-Zugang' : 'API Access',
          starter: '-',
          growth: '✓',
          enterprise: language === 'de' ? 'Erweitert' : 'Advanced'
        },
        {
          name: language === 'de' ? 'WhatsApp/SMS' : 'WhatsApp/SMS',
          starter: '-',
          growth: '✓',
          enterprise: '✓'
        },
        {
          name: language === 'de' ? 'Marketing-Tools' : 'Marketing Tools',
          starter: language === 'de' ? 'Basis' : 'Basic',
          growth: '✓',
          enterprise: language === 'de' ? 'Erweitert' : 'Advanced'
        },
        {
          name: language === 'de' ? 'Automatisierung' : 'Automation',
          starter: '-',
          growth: language === 'de' ? 'Vordefiniert' : 'Pre-defined',
          enterprise: language === 'de' ? 'Individuell' : 'Custom'
        },
        {
          name: language === 'de' ? 'White-Label' : 'White-Label',
          starter: '-',
          growth: '-',
          enterprise: '✓'
        },
        {
          name: language === 'de' ? 'SLA-Garantie' : 'SLA Guarantee',
          starter: '-',
          growth: '99%',
          enterprise: '99.9%'
        }
      ]
    }
  ];

  const addOns = [
    {
      icon: Globe,
      name: language === 'de' ? 'Zusätzliche Website' : 'Additional Website',
      price: '€199',
      period: language === 'de' ? '/Monat' : '/month',
      description: language === 'de' 
        ? 'Für mehrere Standorte oder Marken'
        : 'For multiple locations or brands'
    },
    {
      icon: Zap,
      name: language === 'de' ? 'Extra Automatisierungs-Workflows' : 'Extra Automation Workflows',
      price: '€99',
      period: language === 'de' ? '/Workflow' : '/workflow',
      description: language === 'de'
        ? 'Zusätzliche Prozessautomatisierung'
        : 'Additional process automation'
    },
    {
      icon: Code,
      name: language === 'de' ? 'Individuelle Entwicklung' : 'Custom Development',
      price: '€150',
      period: language === 'de' ? '/Stunde' : '/hour',
      description: language === 'de'
        ? 'Maßgeschneiderte Funktionen und Integrationen'
        : 'Tailored features and integrations'
    }
  ];

  const faqs = [
    {
      question: language === 'de' 
        ? 'Was ist der genaue Unterschied zwischen den Paketen?'
        : 'What exactly is the difference between the packages?',
      answer: language === 'de'
        ? 'DIGITAL STARTER: Sie wählen ENTWEDER ein Buchungssystem ODER eine Website (nicht beides). Ideal für den Einstieg mit 500 Buchungen/Monat. BUSINESS GROWTH: Sie erhalten BEIDE Services (Buchung UND Website) plus unbegrenzte Buchungen und individuelle Gestaltung. ENTERPRISE COMPLETE: Alles aus Growth PLUS mehrere Standorte, dedizierter Manager und maßgeschneiderte Entwicklung.'
        : 'DIGITAL STARTER: You choose EITHER a booking system OR a website (not both). Perfect for starting with 500 bookings/month. BUSINESS GROWTH: You get BOTH services (booking AND website) plus unlimited bookings and custom design. ENTERPRISE COMPLETE: Everything from Growth PLUS multiple locations, dedicated manager and custom development.'
    },
    {
      question: language === 'de'
        ? 'Gibt es eine Mindestvertragslaufzeit?'
        : 'Is there a minimum contract period?',
      answer: language === 'de'
        ? 'Nein! Alle Pakete sind monatlich kündbar mit einer Frist von 30 Tagen. Keine versteckten Kosten, keine langfristigen Verpflichtungen. Sie behalten die volle Kontrolle.'
        : 'No! All packages can be cancelled monthly with 30 days notice. No hidden costs, no long-term commitments. You stay in full control.'
    },
    {
      question: language === 'de'
        ? 'Wie schnell können wir starten?'
        : 'How quickly can we start?',
      answer: language === 'de'
        ? 'Nach Ihrer Bestellung richten wir Ihr System innerhalb von 48 Stunden ein. Für DIGITAL STARTER ist Ihr Buchungssystem oder Ihre Website in 5-7 Tagen live. Bei BUSINESS GROWTH und ENTERPRISE dauert die individuelle Einrichtung 10-14 Tage.'
        : 'After your order, we set up your system within 48 hours. For DIGITAL STARTER, your booking system or website is live in 5-7 days. For BUSINESS GROWTH and ENTERPRISE, custom setup takes 10-14 days.'
    },
    {
      question: language === 'de'
        ? 'Was passiert mit meinen Daten bei Kündigung?'
        : 'What happens to my data if I cancel?',
      answer: language === 'de'
        ? 'Ihre Daten gehören Ihnen! Bei Kündigung exportieren wir alle Ihre Daten kostenlos in Standardformaten (CSV, JSON, PDF). Sie erhalten außerdem eine vollständige Sicherungskopie Ihrer Website. Nichts geht verloren.'
        : 'Your data belongs to you! When cancelling, we export all your data free of charge in standard formats (CSV, JSON, PDF). You also receive a complete backup of your website. Nothing is lost.'
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
              <CreditCard className="h-8 w-8 text-purple-400" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {language === 'de' ? 'Eine Lösung, Alle Services' : 'One Solution, All Services'}
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
              {language === 'de' 
                ? 'Wählen Sie das perfekte Paket für Ihre digitale Transformation. Buchungssysteme, Websites und Automatisierung - alles aus einer Hand.'
                : 'Choose the perfect package for your digital transformation. Booking systems, websites, and automation - all from one provider.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                      <Star className="h-4 w-4 mr-1" />
                      {language === 'de' ? 'Am beliebtesten' : 'Most Popular'}
                    </div>
                  </div>
                )}
                
                <div className={`h-full bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl border ${
                  plan.popular ? 'border-purple-500/50' : 'border-white/10'
                } p-8 hover:border-purple-500/30 transition-all duration-300 ${
                  plan.popular ? 'transform scale-105' : ''
                }`}>
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-2">
                      {plan.description}
                    </p>
                    <p className="text-purple-400 text-xs">
                      {plan.ideal}
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold text-white">
                        {plan.price}
                      </span>
                      <span className="text-gray-400 ml-2">
                        {plan.period}
                      </span>
                    </div>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        {feature.included ? (
                          <Check className="h-5 w-5 text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                        ) : (
                          <X className="h-5 w-5 text-gray-600 mr-3 flex-shrink-0 mt-0.5" />
                        )}
                        <span className={feature.included ? 'text-gray-300' : 'text-gray-600'}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                  
                  {(() => {
                    const ctaContext = plan.popular ? 'pricing-popular' : 'pricing-standard';
                    const pricingCTA = getSmartCTA(ctaContext, 'primary', currentLang);
                    return (
                      <button 
                        onClick={pricingCTA.action}
                        className={`w-full py-3 rounded-full font-medium transition-all duration-300 ${
                          plan.popular 
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg hover:shadow-purple-500/25 transform hover:scale-105' 
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                      >
                        {pricingCTA.text}
                      </button>
                    );
                  })()}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Custom Enterprise Option */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 backdrop-blur-xl rounded-2xl border border-yellow-500/30 p-8">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-6 md:mb-0">
                  <div className="flex items-center mb-3">
                    <Building className="h-6 w-6 text-yellow-400 mr-3" />
                    <h3 className="text-2xl font-bold text-white">
                      {language === 'de' ? 'Enterprise Lösung' : 'Custom Enterprise'}
                    </h3>
                  </div>
                  <p className="text-gray-300 mb-2">
                    {language === 'de' 
                      ? 'Maßgeschneiderte Lösungen für Großunternehmen mit speziellen Anforderungen'
                      : 'Tailored solutions for large enterprises with special requirements'}
                  </p>
                  <p className="text-yellow-400 text-sm">
                    {language === 'de'
                      ? 'Unbegrenzte Ressourcen • SLA-Garantien • On-Premise Option'
                      : 'Unlimited resources • SLA guarantees • On-premise option'}
                  </p>
                </div>
                <button
                  onClick={() => window.location.href = 'mailto:enterprise@ea-s.com'}
                  className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-8 py-3 rounded-full font-medium hover:shadow-lg hover:shadow-yellow-500/25 transition-all duration-300 whitespace-nowrap"
                >
                  {language === 'de' ? 'Kontakt aufnehmen' : 'Contact Sales'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 bg-gradient-to-br from-purple-900/20 to-blue-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              {language === 'de' ? 'Detaillierter Vergleich' : 'Detailed Comparison'}
            </h2>
            <p className="text-xl text-gray-300">
              {language === 'de' 
                ? 'Sehen Sie genau, was in jedem Paket enthalten ist'
                : 'See exactly what\'s included in each package'}
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-white font-semibold">
                      {language === 'de' ? 'Funktionen' : 'Features'}
                    </th>
                    <th className="px-6 py-4 text-center text-white font-semibold">
                      DIGITAL STARTER
                    </th>
                    <th className="px-6 py-4 text-center text-white font-semibold">
                      <div className="flex items-center justify-center">
                        BUSINESS GROWTH
                        <Star className="h-4 w-4 ml-2 text-purple-400" />
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-white font-semibold">
                      ENTERPRISE COMPLETE
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((category, categoryIdx) => (
                    <React.Fragment key={categoryIdx}>
                      <tr className="bg-white/5">
                        <td colSpan={4} className="px-6 py-3 text-purple-400 font-semibold text-sm">
                          {category.category}
                        </td>
                      </tr>
                      {category.features.map((feature, featureIdx) => (
                        <tr key={featureIdx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 text-gray-300">
                            {feature.name}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {feature.starter === '✓' ? (
                              <Check className="h-5 w-5 text-green-400 mx-auto" />
                            ) : feature.starter === '-' ? (
                              <X className="h-5 w-5 text-gray-600 mx-auto" />
                            ) : (
                              <span className="text-gray-400">{feature.starter}</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center bg-purple-600/5">
                            {feature.growth === '✓' ? (
                              <Check className="h-5 w-5 text-green-400 mx-auto" />
                            ) : feature.growth === '-' ? (
                              <X className="h-5 w-5 text-gray-600 mx-auto" />
                            ) : (
                              <span className="text-gray-300 font-medium">{feature.growth}</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {feature.enterprise === '✓' ? (
                              <Check className="h-5 w-5 text-green-400 mx-auto" />
                            ) : feature.enterprise === '-' ? (
                              <X className="h-5 w-5 text-gray-600 mx-auto" />
                            ) : feature.enterprise === (language === 'de' ? 'Unbegrenzt' : 'Unlimited') ? (
                              <div className="flex items-center justify-center text-purple-400">
                                <Infinity className="h-5 w-5" />
                              </div>
                            ) : (
                              <span className="text-gray-300 font-medium">{feature.enterprise}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Add-ons Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              {language === 'de' ? 'Service Add-ons' : 'Service Add-ons'}
            </h2>
            <p className="text-xl text-gray-300">
              {language === 'de'
                ? 'Erweitern Sie Ihr Paket mit zusätzlichen Services'
                : 'Extend your package with additional services'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {addOns.map((addon, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-xl border border-white/10 p-6 hover:border-purple-500/30 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl">
                    <addon.icon className="h-6 w-6 text-purple-400" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{addon.price}</div>
                    <div className="text-sm text-gray-400">{addon.period}</div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {addon.name}
                </h3>
                <p className="text-gray-400 text-sm">
                  {addon.description}
                </p>
                <button className="mt-4 flex items-center text-purple-400 hover:text-purple-300 transition-colors">
                  <Plus className="h-4 w-4 mr-1" />
                  {language === 'de' ? 'Hinzufügen' : 'Add to plan'}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* All Plans Include - German Business Features */}
      <section className="py-20 bg-gradient-to-br from-purple-900/20 to-blue-900/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-xl rounded-3xl border border-green-500/30 p-8 md:p-12">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center p-3 bg-green-600/20 rounded-2xl mb-4">
                <Check className="h-8 w-8 text-green-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                {language === 'de' 
                  ? 'In allen Paketen enthalten'
                  : 'All Plans Include'}
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                {language === 'de'
                  ? 'Speziell entwickelt für deutsche Unternehmen mit lokalen Anforderungen'
                  : 'Specifically designed for German businesses with local requirements'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Clock,
                  title: language === 'de' ? 'Deutsche Geschäftszeiten & Feiertage' : 'German business hours & holidays',
                  description: language === 'de' 
                    ? 'Automatische Mittagspause, alle Feiertage integriert'
                    : 'Automatic lunch break blocking, all holidays integrated'
                },
                {
                  icon: FileText,
                  title: language === 'de' ? 'DATEV-Integration bereit' : 'DATEV integration ready',
                  description: language === 'de'
                    ? 'Nahtlose Verbindung zu Ihrer Buchhaltung'
                    : 'Seamless connection to your accounting'
                },
                {
                  icon: Users,
                  title: language === 'de' ? 'Lokales Stuttgart Support-Team' : 'Local Stuttgart support team',
                  description: language === 'de'
                    ? 'Persönlicher Support in Ihrer Zeitzone'
                    : 'Personal support in your timezone'
                },
                {
                  icon: Shield,
                  title: language === 'de' ? 'DSGVO/GDPR konform' : 'GDPR/DSGVO compliant',
                  description: language === 'de'
                    ? 'Höchste deutsche Datenschutzstandards'
                    : 'Highest German data protection standards'
                },
                {
                  icon: Globe,
                  title: language === 'de' ? 'Deutsche Server' : 'German servers',
                  description: language === 'de'
                    ? 'Ihre Daten bleiben in Deutschland'
                    : 'Your data stays in Germany'
                },
                {
                  icon: CreditCard,
                  title: language === 'de' ? 'Deutsche Rechnungsstellung' : 'German invoicing standards',
                  description: language === 'de'
                    ? 'Korrekte Rechnungsnummern, USt-ID, etc.'
                    : 'Proper invoice numbers, VAT ID, etc.'
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start space-x-3"
                >
                  <div className="flex-shrink-0 p-2 bg-green-600/20 rounded-lg">
                    <feature.icon className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-8 pt-8 border-t border-green-500/20 text-center">
              <p className="text-green-400 font-medium">
                {language === 'de'
                  ? '✓ Keine versteckten Kosten • ✓ Monatlich kündbar • ✓ Kostenlose Migration'
                  : '✓ No hidden costs • ✓ Monthly cancellation • ✓ Free migration'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              {language === 'de' ? 'Häufige Fragen' : 'Frequently Asked Questions'}
            </h2>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-xl border border-white/10"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors rounded-xl"
                >
                  <span className="text-lg font-medium text-white">
                    {faq.question}
                  </span>
                  {expandedFaq === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                
                <AnimatePresence>
                  {expandedFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 pb-4"
                    >
                      <p className="text-gray-300">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
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
                ? 'Bereit für Ihre digitale Transformation?'
                : 'Ready for Your Digital Transformation?'}
            </h2>
            <p className="text-xl text-white/90 mb-8">
              {language === 'de'
                ? 'Starten Sie mit einer kostenlosen Beratung und finden Sie das perfekte Paket.'
                : 'Start with a free consultation and find the perfect package.'}
            </p>
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('openBookingModal'))}
              className="inline-flex items-center px-8 py-4 bg-white text-purple-600 rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 font-semibold"
            >
              {language === 'de' ? 'Kostenlose Beratung buchen' : 'Book Free Consultation'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <p className="text-white/70 mt-6 text-sm">
              {language === 'de'
                ? 'Keine Kreditkarte erforderlich • Kostenlose Beratung • Maßgeschneiderte Empfehlung'
                : 'No credit card required • Free consultation • Tailored recommendation'}
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;