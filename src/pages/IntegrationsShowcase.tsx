import React from 'react';
import { motion } from 'framer-motion';
import {
  Hotel,
  Calendar,
  Users,
  TrendingUp,
  Clock,
  Euro,
  CheckCircle,
  Smartphone,
  Globe,
  Shield,
  Zap,
  MessageSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';

const IntegrationsShowcase: React.FC = () => {
  const caseStudy = {
    client: 'Hotel am Kochbrunnen',
    location: 'Wiesbaden, Germany',
    category: 'Hospitality',
    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1600&q=80', // Hotel exterior image
    challenge: 'Modernize booking system and increase direct bookings',
    solution: 'AI-powered booking platform with personalized recommendations',
    results: {
      revenue: '+16%',
      revenueLabel: 'Revenue increase',
      revenueDetail: '€***,***/year additional revenue',
      noShow: '-90%',
      noShowLabel: 'No-Show Reduction',
      noShowDetail: 'From €**,*** to €*,***/month lost',
      efficiency: '70% faster',
      efficiencyLabel: 'Booking Time',
      efficiencyDetail: 'From 5 min to 90 seconds',
      hours: '15h/week',
      hoursLabel: 'Staff Hours Saved',
      hoursDetail: '€*,***/month in labor costs'
    },
    testimonial: {
      quote: "The booking system transformed operations. No-shows dropped 90% with deposit integration. The ROI was immediate - we saved €**,***/month in lost bookings.",
      author: 'Hassan Arour',
      position: 'Hotel Director'
    },
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe API', 'WhatsApp Business API']
  };

  const features = [
    {
      icon: Calendar,
      title: '24/7 Online Booking',
      description: 'Guests can book rooms, spa services, and restaurant reservations anytime'
    },
    {
      icon: Smartphone,
      title: 'Mobile-First Design',
      description: 'Optimized for smartphones with one-tap booking and digital check-in'
    },
    {
      icon: Globe,
      title: 'Multi-Language Support',
      description: 'Available in German, English, French, and Arabic for international guests'
    },
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'PCI-compliant payment processing with automated deposit handling'
    },
    {
      icon: MessageSquare,
      title: 'WhatsApp Integration',
      description: 'Automated confirmations and reminders via WhatsApp Business API'
    },
    {
      icon: Zap,
      title: 'Real-Time Availability',
      description: 'Instant room availability updates across all channels'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 pt-20">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Success Story: {caseStudy.client}
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              How we transformed a traditional luxury hotel into a digital-first hospitality leader
            </p>
          </motion.div>
        </div>
      </div>

      {/* Case Study Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          {/* Hotel Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="relative rounded-2xl overflow-hidden shadow-2xl"
          >
            <img
              src={caseStudy.image}
              alt={caseStudy.client}
              className="w-full h-[400px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Hotel className="w-5 h-5" />
                <span className="text-sm font-medium">Luxury Hotel</span>
              </div>
              <h3 className="text-2xl font-bold mb-1">{caseStudy.client}</h3>
              <p className="text-white/80">{caseStudy.location}</p>
            </div>
          </motion.div>

          {/* Challenge & Solution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-sm font-semibold text-purple-400 mb-2">Challenge</h3>
              <p className="text-xl text-white font-semibold mb-2">{caseStudy.challenge}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-blue-400 mb-2">Solution</h3>
              <p className="text-xl text-white font-semibold mb-4">{caseStudy.solution}</p>
            </div>

            {/* Key Results */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4"
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <span className="text-2xl font-bold text-green-400">{caseStudy.results.revenue}</span>
                </div>
                <p className="text-sm text-gray-400">{caseStudy.results.revenueLabel}</p>
                <p className="text-xs text-gray-500 mt-1">{caseStudy.results.revenueDetail}</p>
              </motion.div>

              <motion.div
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4"
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  <span className="text-2xl font-bold text-blue-400">{caseStudy.results.noShow}</span>
                </div>
                <p className="text-sm text-gray-400">{caseStudy.results.noShowLabel}</p>
                <p className="text-xs text-gray-500 mt-1">{caseStudy.results.noShowDetail}</p>
              </motion.div>

              <motion.div
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4"
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-purple-400" />
                  <span className="text-2xl font-bold text-purple-400">{caseStudy.results.efficiency}</span>
                </div>
                <p className="text-sm text-gray-400">{caseStudy.results.efficiencyLabel}</p>
                <p className="text-xs text-gray-500 mt-1">{caseStudy.results.efficiencyDetail}</p>
              </motion.div>

              <motion.div
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4"
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Euro className="w-5 h-5 text-yellow-400" />
                  <span className="text-2xl font-bold text-yellow-400">{caseStudy.results.hours}</span>
                </div>
                <p className="text-sm text-gray-400">{caseStudy.results.hoursLabel}</p>
                <p className="text-xs text-gray-500 mt-1">{caseStudy.results.hoursDetail}</p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-16"
        >
          <blockquote className="text-xl text-white/90 italic mb-4">
            "{caseStudy.testimonial.quote}"
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">HA</span>
            </div>
            <div>
              <p className="text-white font-semibold">{caseStudy.testimonial.author}</p>
              <p className="text-gray-400 text-sm">{caseStudy.testimonial.position}</p>
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Implemented Features
            </span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
              >
                <feature.icon className="w-10 h-10 text-purple-400 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Technologies Used */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mb-16"
        >
          <h3 className="text-sm font-semibold text-gray-400 mb-4">Technologies Used</h3>
          <div className="flex flex-wrap gap-3 justify-center">
            {caseStudy.technologies.map((tech, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center bg-gradient-to-r from-purple-900/30 to-blue-900/30 backdrop-blur-xl border border-white/10 rounded-2xl p-12"
        >
          <h2 className="text-3xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Ready to Transform Your Business?
            </span>
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of German businesses saving time and increasing revenue with our AI-powered booking solutions
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/contact"
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
            >
              Start Free Trial
            </Link>
            <Link
              to="/demo-booking"
              className="px-8 py-3 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-full hover:bg-white/20 transition-all"
            >
              Book Demo
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default IntegrationsShowcase;