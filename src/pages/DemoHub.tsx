import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Clock, Users, Sparkles, ChevronRight, Play,
  TrendingUp, Zap, Shield, CheckCircle, ArrowRight,
  Coffee, Heart, Scissors, Car, Smartphone,
  Monitor, Award, Activity, Globe, Star, Rocket
} from 'lucide-react';
import { useLanguage } from '../providers/LanguageProvider';
import { useNavigate } from 'react-router-dom';
import BookingDemoUltra from '../components/BookingDemoUltra';
import DemoMetricsDashboard from '../components/DemoMetricsDashboard';

const DemoHub: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [showBookingDemo, setShowBookingDemo] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [liveMetrics, setLiveMetrics] = useState({
    bookingsToday: 142,
    satisfactionRate: 98.5,
    averageResponseTime: 0.8,
    activeUsers: 1247
  });

  // Simulate live metrics updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMetrics(prev => ({
        bookingsToday: prev.bookingsToday + Math.floor(Math.random() * 3),
        satisfactionRate: Math.min(100, prev.satisfactionRate + (Math.random() - 0.3) * 0.5),
        averageResponseTime: Math.max(0.3, Math.min(2, prev.averageResponseTime + (Math.random() - 0.5) * 0.2)),
        activeUsers: Math.max(800, Math.min(2000, prev.activeUsers + Math.floor((Math.random() - 0.5) * 50)))
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const industries = [
    {
      id: 'restaurant',
      name: language === 'de' ? 'Restaurant' : 'Restaurant',
      icon: Coffee,
      color: 'from-orange-600 to-red-600',
      features: ['Table Reservations', 'Party Size Selection', 'Special Occasions', 'Dietary Requirements']
    },
    {
      id: 'salon',
      name: language === 'de' ? 'Friseursalon' : 'Hair Salon',
      icon: Scissors,
      color: 'from-pink-600 to-purple-600',
      features: ['Stylist Selection', 'Service Packages', 'Length-Based Pricing', 'Add-on Services']
    },
    {
      id: 'medical',
      name: language === 'de' ? 'Arztpraxis' : 'Medical Practice',
      icon: Heart,
      color: 'from-blue-600 to-cyan-600',
      features: ['Insurance Integration', 'Symptom Pre-screening', 'Emergency Slots', 'Patient History']
    },
    {
      id: 'automotive',
      name: language === 'de' ? 'Autowerkstatt' : 'Auto Service',
      icon: Car,
      color: 'from-gray-600 to-slate-600',
      features: ['Vehicle Information', 'Service History', 'Mileage Tracking', 'Pickup Service']
    }
  ];

  const features = [
    {
      title: language === 'de' ? 'KI-gestützte Terminoptimierung' : 'AI-Powered Scheduling',
      description: language === 'de'
        ? 'Intelligente Zeitslots basierend auf Geschäftsmustern'
        : 'Smart time slots based on business patterns',
      icon: Zap,
      gradient: 'from-yellow-600 to-orange-600'
    },
    {
      title: language === 'de' ? 'Deutsche Geschäftslogik' : 'German Business Logic',
      description: language === 'de'
        ? 'Mittagspause & Feiertage automatisch blockiert'
        : 'Mittagspause & holidays automatically blocked',
      icon: Shield,
      gradient: 'from-green-600 to-emerald-600'
    },
    {
      title: language === 'de' ? 'Echtzeit-Synchronisation' : 'Real-Time Sync',
      description: language === 'de'
        ? 'Sofortige Updates über alle Kanäle'
        : 'Instant updates across all channels',
      icon: Activity,
      gradient: 'from-blue-600 to-indigo-600'
    },
    {
      title: language === 'de' ? 'Multi-Kanal Buchungen' : 'Multi-Channel Bookings',
      description: language === 'de'
        ? 'Website, Mobile App, Social Media'
        : 'Website, Mobile App, Social Media',
      icon: Globe,
      gradient: 'from-purple-600 to-pink-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10" />
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, -30, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"
            animate={{
              x: [0, -50, 0],
              y: [0, 30, 0],
              scale: [1, 1.3, 1]
            }}
            transition={{ duration: 12, repeat: Infinity }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            {/* Live Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/20 backdrop-blur-xl rounded-full border border-red-500/30 mb-8"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-red-400 font-medium text-sm">
                {language === 'de' ? 'LIVE DEMO' : 'LIVE DEMO'}
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {language === 'de'
                  ? 'Erleben Sie die Zukunft der Buchungen'
                  : 'Experience the Future of Bookings'}
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
              {language === 'de'
                ? 'Testen Sie unser KI-gestütztes Buchungssystem mit echten deutschen Geschäftsregeln - live und interaktiv'
                : 'Try our AI-powered booking system with real German business rules - live and interactive'}
            </p>

            {/* Live Metrics Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
              <motion.div
                className="bg-black/50 backdrop-blur-xl rounded-2xl p-4 border border-white/10"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl font-bold text-white mb-1">
                  {liveMetrics.bookingsToday}
                </div>
                <div className="text-xs text-gray-400">
                  {language === 'de' ? 'Buchungen heute' : 'Bookings Today'}
                </div>
              </motion.div>

              <motion.div
                className="bg-black/50 backdrop-blur-xl rounded-2xl p-4 border border-white/10"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl font-bold text-white mb-1">
                  {liveMetrics.satisfactionRate.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-400">
                  {language === 'de' ? 'Zufriedenheit' : 'Satisfaction'}
                </div>
              </motion.div>

              <motion.div
                className="bg-black/50 backdrop-blur-xl rounded-2xl p-4 border border-white/10"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl font-bold text-white mb-1">
                  {liveMetrics.averageResponseTime.toFixed(1)}s
                </div>
                <div className="text-xs text-gray-400">
                  {language === 'de' ? 'Antwortzeit' : 'Response Time'}
                </div>
              </motion.div>

              <motion.div
                className="bg-black/50 backdrop-blur-xl rounded-2xl p-4 border border-white/10"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl font-bold text-white mb-1">
                  {liveMetrics.activeUsers.toLocaleString()}
                </div>
                <div className="text-xs text-gray-400">
                  {language === 'de' ? 'Aktive Nutzer' : 'Active Users'}
                </div>
              </motion.div>
            </div>

            {/* Main CTA Buttons */}
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <motion.button
                onClick={() => setShowBookingDemo(true)}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-semibold text-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="h-6 w-6" />
                {language === 'de' ? 'Live Demo starten' : 'Start Live Demo'}
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.button
                onClick={() => navigate('/industry-booking-demo')}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-semibold text-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="h-6 w-6" />
                {language === 'de' ? 'Branchen-Demos starten' : 'Start Industry Demos'}
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interactive Booking Demo */}
      <AnimatePresence>
        {showBookingDemo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowBookingDemo(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative max-w-6xl w-full max-h-[90vh] overflow-auto bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 rounded-3xl border border-white/20 shadow-2xl"
            >
              <button
                onClick={() => setShowBookingDemo(false)}
                className="absolute top-6 right-6 p-2 bg-white/10 backdrop-blur-xl rounded-full hover:bg-white/20 transition-colors z-10"
              >
                <ChevronRight className="h-6 w-6 text-white rotate-90" />
              </button>

              <BookingDemoUltra onClose={() => setShowBookingDemo(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Key Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {language === 'de' ? 'Leistungsstarke Funktionen' : 'Powerful Features'}
              </span>
            </h2>
            <p className="text-xl text-gray-300">
              {language === 'de'
                ? 'Alles was Sie für perfekte Terminverwaltung brauchen'
                : 'Everything you need for perfect appointment management'}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-300"
              >
                <div className={`inline-flex p-3 bg-gradient-to-r ${feature.gradient} rounded-xl mb-4`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry-Specific Demos */}
      <section className="py-20 bg-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {language === 'de' ? 'Branchen-spezifische Lösungen' : 'Industry-Specific Solutions'}
              </span>
            </h2>
            <p className="text-xl text-gray-300">
              {language === 'de'
                ? 'Maßgeschneidert für Ihre Branche'
                : 'Tailored for your industry'}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {industries.map((industry, index) => (
              <motion.div
                key={industry.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => {
                  setSelectedIndustry(industry.id);
                  navigate(`/industry-booking-demo?industry=${industry.id}`);
                }}
                className="cursor-pointer group"
              >
                <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-300 h-full">
                  <div className={`inline-flex p-4 bg-gradient-to-r ${industry.color} rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <industry.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{industry.name}</h3>
                  <ul className="space-y-2">
                    {industry.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-gray-300 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex items-center gap-2 text-purple-400 group-hover:text-purple-300 transition-colors">
                    <span className="text-sm font-medium">
                      {language === 'de' ? 'Demo ansehen' : 'View Demo'}
                    </span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Metrics Dashboard */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {language === 'de' ? 'Echtzeit-Metriken' : 'Real-Time Metrics'}
              </span>
            </h2>
            <p className="text-xl text-gray-300">
              {language === 'de'
                ? 'Verfolgen Sie Ihre Leistung in Echtzeit'
                : 'Track your performance in real-time'}
            </p>
          </motion.div>

          <DemoMetricsDashboard />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900/50 to-blue-900/50">
        <div className="max-w-4xl mx-auto text-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="bg-black/50 backdrop-blur-xl rounded-3xl p-12 border border-white/20"
          >
            <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-xl rounded-2xl border border-white/10 mb-6">
              <Rocket className="h-10 w-10 text-purple-400" />
            </div>

            <h2 className="text-4xl font-bold text-white mb-6">
              {language === 'de'
                ? 'Bereit, Ihr Geschäft zu transformieren?'
                : 'Ready to Transform Your Business?'}
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              {language === 'de'
                ? 'Starten Sie noch heute mit unserem KI-gestützten Buchungssystem'
                : 'Start today with our AI-powered booking system'}
            </p>

            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <motion.button
                onClick={() => window.dispatchEvent(new CustomEvent('openBookingModal'))}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {language === 'de' ? 'Kostenlose Beratung' : 'Free Consultation'}
                <ArrowRight className="h-5 w-5" />
              </motion.button>

              <motion.button
                onClick={() => navigate('/pricing')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {language === 'de' ? 'Preise ansehen' : 'View Pricing'}
                <Star className="h-5 w-5 text-yellow-500" />
              </motion.button>
            </div>

            <div className="mt-8 flex items-center justify-center gap-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                {language === 'de' ? '14 Tage kostenlos' : '14-day free trial'}
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                {language === 'de' ? 'Keine Kreditkarte' : 'No credit card'}
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                {language === 'de' ? 'Sofort starten' : 'Start instantly'}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default DemoHub;