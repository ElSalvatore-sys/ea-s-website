import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Calendar, Clock, Users, Euro, TrendingDown, AlertCircle,
  CheckCircle, ChevronRight, Building2, Scissors, Stethoscope,
  Wrench, Shield, Lock, Zap, Globe, HeadphonesIcon, 
  BarChart3, Smartphone, Bell, Languages, Sun, Moon,
  CreditCard, FileText, Database, Cloud, Award, ArrowRight
} from 'lucide-react';
import { useLanguage } from '../providers/LanguageProvider';
import { useNavigate } from 'react-router-dom';
import ROICalculator from '../components/ROICalculator';

const Solutions: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [selectedIndustry, setSelectedIndustry] = useState('restaurant');

  const problems = [
    {
      icon: <TrendingDown className="w-8 h-8" />,
      title: t('solutions.problems.noShows.title'),
      description: t('solutions.problems.noShows.description'),
      stat: '30%',
      statLabel: t('solutions.problems.noShows.stat')
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: t('solutions.problems.manualScheduling.title'),
      description: t('solutions.problems.manualScheduling.description'),
      stat: '15h',
      statLabel: t('solutions.problems.manualScheduling.stat')
    },
    {
      icon: <AlertCircle className="w-8 h-8" />,
      title: t('solutions.problems.doubleBookings.title'),
      description: t('solutions.problems.doubleBookings.description'),
      stat: '12%',
      statLabel: t('solutions.problems.doubleBookings.stat')
    }
  ];

  const solutions = [
    {
      icon: <Bell className="w-6 h-6" />,
      title: t('solutions.features.reminders.title'),
      description: t('solutions.features.reminders.description')
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: t('solutions.features.mittagspause.title'),
      description: t('solutions.features.mittagspause.description')
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: t('solutions.features.holidays.title'),
      description: t('solutions.features.holidays.description')
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: t('solutions.features.gdpr.title'),
      description: t('solutions.features.gdpr.description')
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: t('solutions.features.mobile.title'),
      description: t('solutions.features.mobile.description')
    },
    {
      icon: <Languages className="w-6 h-6" />,
      title: t('solutions.features.multilingual.title'),
      description: t('solutions.features.multilingual.description')
    }
  ];

  const industries = {
    restaurant: {
      icon: <Building2 className="w-8 h-8" />,
      title: t('solutions.industries.restaurant.title'),
      features: [
        t('solutions.industries.restaurant.feature1'),
        t('solutions.industries.restaurant.feature2'),
        t('solutions.industries.restaurant.feature3'),
        t('solutions.industries.restaurant.feature4')
      ],
      caseStudy: {
        company: 'Müller\'s Restaurant München',
        quote: t('solutions.industries.restaurant.quote'),
        result: '+45% ' + t('solutions.industries.restaurant.result')
      }
    },
    salon: {
      icon: <Scissors className="w-8 h-8" />,
      title: t('solutions.industries.salon.title'),
      features: [
        t('solutions.industries.salon.feature1'),
        t('solutions.industries.salon.feature2'),
        t('solutions.industries.salon.feature3'),
        t('solutions.industries.salon.feature4')
      ],
      caseStudy: {
        company: 'Weber Beauty Salon Berlin',
        quote: t('solutions.industries.salon.quote'),
        result: '-80% ' + t('solutions.industries.salon.result')
      }
    },
    medical: {
      icon: <Stethoscope className="w-8 h-8" />,
      title: t('solutions.industries.medical.title'),
      features: [
        t('solutions.industries.medical.feature1'),
        t('solutions.industries.medical.feature2'),
        t('solutions.industries.medical.feature3'),
        t('solutions.industries.medical.feature4')
      ],
      caseStudy: {
        company: 'Dr. Schmidt Praxis Hamburg',
        quote: t('solutions.industries.medical.quote'),
        result: '20h ' + t('solutions.industries.medical.result')
      }
    },
    automotive: {
      icon: <Wrench className="w-8 h-8" />,
      title: t('solutions.industries.automotive.title'),
      features: [
        t('solutions.industries.automotive.feature1'),
        t('solutions.industries.automotive.feature2'),
        t('solutions.industries.automotive.feature3'),
        t('solutions.industries.automotive.feature4')
      ],
      caseStudy: {
        company: 'AutoService Frankfurt GmbH',
        quote: t('solutions.industries.automotive.quote'),
        result: '+60% ' + t('solutions.industries.automotive.result')
      }
    }
  };

  const technicalFeatures = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: t('solutions.technical.realtime.title'),
      description: t('solutions.technical.realtime.description')
    },
    {
      icon: <Cloud className="w-6 h-6" />,
      title: t('solutions.technical.cloud.title'),
      description: t('solutions.technical.cloud.description')
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: t('solutions.technical.backup.title'),
      description: t('solutions.technical.backup.description')
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: t('solutions.technical.encryption.title'),
      description: t('solutions.technical.encryption.description')
    }
  ];

  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [problemsRef, problemsInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [solutionsRef, solutionsInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [industriesRef, industriesInView] = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600/20 border border-purple-500/30 rounded-full mb-6">
              <CheckCircle className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-300">{t('solutions.hero.badge')}</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              {t('solutions.hero.title')}
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              {t('solutions.hero.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/contact')}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
              >
                {t('solutions.hero.cta.primary')}
              </button>
              <button
                onClick={() => document.getElementById('roi-calculator')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full font-semibold hover:bg-white/20 transition-all duration-300"
              >
                {t('solutions.hero.cta.secondary')}
              </button>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Problems Section */}
      <section ref={problemsRef} className="py-20 px-4 bg-gradient-to-b from-red-900/10 to-transparent">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={problemsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">{t('solutions.problems.title')}</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              {t('solutions.problems.subtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {problems.map((problem, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={problemsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-red-900/10 backdrop-blur-xl border border-red-500/20 rounded-2xl p-6"
              >
                <div className="text-red-400 mb-4">{problem.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{problem.title}</h3>
                <p className="text-gray-400 mb-4">{problem.description}</p>
                <div className="pt-4 border-t border-red-500/20">
                  <div className="text-3xl font-bold text-red-400">{problem.stat}</div>
                  <div className="text-sm text-gray-500">{problem.statLabel}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section ref={solutionsRef} className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={solutionsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">{t('solutions.features.title')}</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              {t('solutions.features.subtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {solutions.map((solution, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={solutionsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
              >
                <div className="p-3 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl w-fit mb-4">
                  {solution.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{solution.title}</h3>
                <p className="text-gray-400">{solution.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Solutions */}
      <section ref={industriesRef} className="py-20 px-4 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={industriesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">{t('solutions.industries.title')}</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              {t('solutions.industries.subtitle')}
            </p>
          </motion.div>

          {/* Industry Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {Object.entries(industries).map(([key, industry]) => (
              <button
                key={key}
                onClick={() => setSelectedIndustry(key)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${
                  selectedIndustry === key
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg shadow-purple-500/25'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                {industry.icon}
                <span className="font-semibold">{industry.title}</span>
              </button>
            ))}
          </div>

          {/* Industry Content */}
          <motion.div
            key={selectedIndustry}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid lg:grid-cols-2 gap-8"
          >
            <div>
              <h3 className="text-2xl font-bold mb-6">
                {t('solutions.industries.features')} {industries[selectedIndustry].title}
              </h3>
              <ul className="space-y-4">
                {industries[selectedIndustry].features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h4 className="text-xl font-semibold mb-4">{t('solutions.industries.caseStudy')}</h4>
              <div className="mb-4">
                <Award className="w-8 h-8 text-yellow-400 mb-2" />
                <div className="font-semibold text-lg">{industries[selectedIndustry].caseStudy.company}</div>
              </div>
              <blockquote className="text-gray-300 italic mb-4">
                "{industries[selectedIndustry].caseStudy.quote}"
              </blockquote>
              <div className="flex items-center gap-2 text-green-400">
                <TrendingDown className="w-5 h-5 rotate-180" />
                <span className="font-bold text-xl">{industries[selectedIndustry].caseStudy.result}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ROI Calculator Section */}
      <section id="roi-calculator" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">{t('solutions.roi.heading')}</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              {t('solutions.roi.subheading')}
            </p>
          </motion.div>

          <ROICalculator />
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20 px-4 bg-gradient-to-b from-purple-900/20 to-transparent">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">{t('solutions.caseStudies.title')}</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              {t('solutions.caseStudies.subtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                company: 'Schmidt & Partner Steuerberatung',
                industry: t('solutions.caseStudies.case1.industry'),
                challenge: t('solutions.caseStudies.case1.challenge'),
                solution: t('solutions.caseStudies.case1.solution'),
                result: t('solutions.caseStudies.case1.result'),
                metric: '85%',
                metricLabel: t('solutions.caseStudies.case1.metric')
              },
              {
                company: 'Beauty Lounge Berlin',
                industry: t('solutions.caseStudies.case2.industry'),
                challenge: t('solutions.caseStudies.case2.challenge'),
                solution: t('solutions.caseStudies.case2.solution'),
                result: t('solutions.caseStudies.case2.result'),
                metric: '€12k',
                metricLabel: t('solutions.caseStudies.case2.metric')
              },
              {
                company: 'AutoService München GmbH',
                industry: t('solutions.caseStudies.case3.industry'),
                challenge: t('solutions.caseStudies.case3.challenge'),
                solution: t('solutions.caseStudies.case3.solution'),
                result: t('solutions.caseStudies.case3.result'),
                metric: '3x',
                metricLabel: t('solutions.caseStudies.case3.metric')
              }
            ].map((study, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
              >
                <div className="mb-4">
                  <h3 className="text-xl font-semibold">{study.company}</h3>
                  <p className="text-sm text-purple-400">{study.industry}</p>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Challenge</p>
                    <p className="text-sm text-gray-400">{study.challenge}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Solution</p>
                    <p className="text-sm text-gray-400">{study.solution}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Result</p>
                    <p className="text-sm text-gray-400">{study.result}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="text-3xl font-bold text-green-400">{study.metric}</div>
                  <div className="text-sm text-gray-500">{study.metricLabel}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Features */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">{t('solutions.technical.title')}</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              {t('solutions.technical.subtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {technicalFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Compliance */}
      <section className="py-20 px-4 bg-gradient-to-br from-green-900/20 to-transparent">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-10 h-10 text-green-400" />
                <h2 className="text-4xl font-bold">{t('solutions.security.title')}</h2>
              </div>
              <p className="text-xl text-gray-400 mb-8">
                {t('solutions.security.subtitle')}
              </p>
              
              <div className="space-y-4">
                {[
                  t('solutions.security.feature1'),
                  t('solutions.security.feature2'),
                  t('solutions.security.feature3'),
                  t('solutions.security.feature4'),
                  t('solutions.security.feature5')
                ].map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: <Lock />, label: 'GDPR', desc: t('solutions.security.gdpr') },
                { icon: <Shield />, label: 'ISO 27001', desc: t('solutions.security.iso') },
                { icon: <Database />, label: 'Backup', desc: t('solutions.security.backup') },
                { icon: <FileText />, label: 'Audit', desc: t('solutions.security.audit') }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-green-900/20 backdrop-blur-xl border border-green-500/30 rounded-2xl p-6 text-center"
                >
                  <div className="w-12 h-12 mx-auto mb-3 text-green-400">
                    {item.icon}
                  </div>
                  <h4 className="font-semibold mb-1">{item.label}</h4>
                  <p className="text-xs text-gray-400">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">{t('solutions.support.title')}</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              {t('solutions.support.subtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center"
            >
              <HeadphonesIcon className="w-12 h-12 mx-auto mb-4 text-purple-400" />
              <h3 className="text-xl font-semibold mb-2">{t('solutions.support.247.title')}</h3>
              <p className="text-gray-400 mb-4">{t('solutions.support.247.description')}</p>
              <div className="text-sm text-purple-400">{t('solutions.support.247.availability')}</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center"
            >
              <FileText className="w-12 h-12 mx-auto mb-4 text-blue-400" />
              <h3 className="text-xl font-semibold mb-2">{t('solutions.support.documentation.title')}</h3>
              <p className="text-gray-400 mb-4">{t('solutions.support.documentation.description')}</p>
              <div className="text-sm text-blue-400">{t('solutions.support.documentation.resources')}</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center"
            >
              <Users className="w-12 h-12 mx-auto mb-4 text-green-400" />
              <h3 className="text-xl font-semibold mb-2">{t('solutions.support.training.title')}</h3>
              <p className="text-gray-400 mb-4">{t('solutions.support.training.description')}</p>
              <div className="text-sm text-green-400">{t('solutions.support.training.included')}</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center"
          >
            <h2 className="text-3xl font-bold mb-4">
              {t('solutions.cta.title')}
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              {t('solutions.cta.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button
                onClick={() => navigate('/contact')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-lg font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
              >
                <span>{t('solutions.cta.primary')}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-lg font-semibold hover:bg-white/20 transition-all duration-300"
              >
                <span>{t('solutions.cta.secondary')}</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>{t('solutions.cta.guarantee1')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>{t('solutions.cta.guarantee2')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>{t('solutions.cta.guarantee3')}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Solutions;