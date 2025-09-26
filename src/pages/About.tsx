import React from 'react';
import { motion } from 'framer-motion';
import {
  Users, Target, Award, Globe, Shield, Zap,
  Heart, Star, TrendingUp, Code, Sparkles, ArrowRight,
  CheckCircle, Building, Calendar, Mail, Phone,
  Rocket, Brain, Globe2, Euro
} from 'lucide-react';
import { useLanguage } from '../providers/LanguageProvider';
import CompanyJourney from '../components/CompanyJourney';

const About: React.FC = () => {
  const { t } = useLanguage();

  const values = [
    {
      icon: Code,
      title: t('about.values.build.title'),
      description: t('about.values.build.desc'),
      color: 'from-purple-600 to-blue-600'
    },
    {
      icon: Zap,
      title: t('about.values.solve.title'),
      description: t('about.values.solve.desc'),
      color: 'from-blue-600 to-cyan-600'
    },
    {
      icon: Target,
      title: t('about.values.deliver.title'),
      description: t('about.values.deliver.desc'),
      color: 'from-cyan-600 to-green-600'
    },
    {
      icon: TrendingUp,
      title: t('about.values.measure.title'),
      description: t('about.values.measure.desc'),
      color: 'from-green-600 to-emerald-600'
    }
  ];

  const projects = [
    {
      name: t('about.projects.lingxm.name'),
      description: t('about.projects.lingxm.desc'),
      impact: t('about.projects.lingxm.impact'),
      icon: Brain,
      color: 'from-purple-600 to-blue-600'
    },
    {
      name: t('about.projects.mindai.name'),
      description: t('about.projects.mindai.desc'),
      impact: t('about.projects.mindai.impact'),
      icon: Globe2,
      color: 'from-blue-600 to-cyan-600'
    },
    {
      name: t('about.projects.lingxm_travel.name'),
      description: t('about.projects.lingxm_travel.desc'),
      impact: t('about.projects.lingxm_travel.impact'),
      icon: Rocket,
      color: 'from-cyan-600 to-green-600'
    }
  ];

  const numbers = [
    { value: t('about.numbers.team'), label: t('about.numbers.team_label') },
    { value: t('about.numbers.clients'), label: t('about.numbers.clients_label') },
    { value: t('about.numbers.revenue'), label: t('about.numbers.revenue_label') },
    { value: t('about.numbers.projects'), label: t('about.numbers.projects_label') }
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
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {t('about.hero.title')}
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
              {t('about.hero.subtitle')}
            </p>

            <div className="flex flex-wrap justify-center gap-8 text-center">
              {numbers.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="text-4xl font-bold text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-3xl border border-white/10 p-12"
          >
            <Building className="h-16 w-16 text-purple-400 mb-6" />
            <h2 className="text-3xl font-bold text-white mb-6">
              {t('about.story.title')}
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed mb-6">
              {t('about.story.description')}
            </p>
            <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl p-6 border border-purple-500/30">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="h-6 w-6 text-green-400" />
                <span className="text-2xl font-bold text-green-400">16% Revenue Increase</span>
              </div>
              <p className="text-gray-300">
                {t('about.story.hotel_success')}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20 bg-gradient-to-br from-purple-900/20 to-blue-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            {t('about.values.title')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-purple-500/30 transition-all duration-300"
                >
                  <div className={`inline-flex p-3 bg-gradient-to-r ${value.color} rounded-xl mb-4`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-400">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Projects Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            {t('about.projects.title')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.map((project, index) => {
              const Icon = project.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-8 hover:border-purple-500/30 transition-all duration-300"
                >
                  <div className={`inline-flex p-4 bg-gradient-to-r ${project.color} rounded-xl mb-6`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-3">
                    {project.name}
                  </h3>
                  <p className="text-gray-300 mb-4">
                    {project.description}
                  </p>
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-semibold">{project.impact}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Company Journey Section */}
      <CompanyJourney />

      {/* Contact CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-12"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              {t('about.cta.title')}
            </h2>
            <p className="text-xl text-white/90 mb-8">
              {t('about.cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('openBookingModal'))}
                className="inline-flex items-center px-8 py-4 bg-white text-purple-600 rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 font-semibold"
              >
                {t('about.cta.button')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <a 
                href="mailto:info@ea-s.com"
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-full hover:bg-white/10 transition-all duration-300 font-semibold"
              >
                <Mail className="mr-2 h-5 w-5" />
                {t('about.cta.contact')}
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;