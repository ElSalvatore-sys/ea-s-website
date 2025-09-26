import React from 'react';
import { motion } from 'framer-motion';
import { 
  Link, Calendar, CreditCard, Mail, MessageSquare, 
  Video, Database, Cloud, ArrowRight, CheckCircle
} from 'lucide-react';
import { useLanguage } from '../providers/LanguageProvider';

const IntegrationGuide: React.FC = () => {
  const { t } = useLanguage();

  const integrations = [
    {
      icon: Calendar,
      name: t('integration.popular.google.title'),
      description: t('integration.popular.google.desc'),
      color: 'from-blue-600 to-blue-700',
      setup: '5 min'
    },
    {
      icon: Calendar,
      name: t('integration.popular.outlook.title'),
      description: t('integration.popular.outlook.desc'),
      color: 'from-indigo-600 to-indigo-700',
      setup: '5 min'
    },
    {
      icon: CreditCard,
      name: t('integration.popular.stripe.title'),
      description: t('integration.popular.stripe.desc'),
      color: 'from-purple-600 to-purple-700',
      setup: '10 min'
    },
    {
      icon: Mail,
      name: t('integration.popular.mailchimp.title'),
      description: t('integration.popular.mailchimp.desc'),
      color: 'from-yellow-600 to-yellow-700',
      setup: '5 min'
    },
    {
      icon: MessageSquare,
      name: t('integration.popular.slack.title'),
      description: t('integration.popular.slack.desc'),
      color: 'from-green-600 to-green-700',
      setup: '3 min'
    },
    {
      icon: Video,
      name: t('integration.popular.zoom.title'),
      description: t('integration.popular.zoom.desc'),
      color: 'from-blue-600 to-cyan-600',
      setup: '5 min'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 pt-16">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-xl rounded-2xl border border-white/10 mb-6">
              <Link className="h-8 w-8 text-purple-400" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {t('integration.hero.title')}
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
              {t('integration.hero.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Popular Integrations */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            {t('integration.popular.title')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {integrations.map((integration, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-8 hover:border-purple-500/50 transition-all duration-300"
              >
                <div className={`inline-flex p-3 bg-gradient-to-r ${integration.color} rounded-xl mb-4`}>
                  <integration.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">
                  {integration.name}
                </h3>
                <p className="text-gray-300 mb-4">
                  {integration.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Setup: {integration.setup}</span>
                  <button className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors">
                    Connect
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Integration */}
      <section className="py-20 bg-gradient-to-br from-purple-900/20 to-blue-900/20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            {t('integration.custom.title')}
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            {t('integration.custom.description')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-xl border border-white/10 p-6">
              <Database className="h-8 w-8 text-purple-400 mx-auto mb-3" />
              <h3 className="text-white font-medium mb-2">{t('integration.custom.webhook')}</h3>
            </div>
            <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-xl border border-white/10 p-6">
              <Cloud className="h-8 w-8 text-blue-400 mx-auto mb-3" />
              <h3 className="text-white font-medium mb-2">{t('integration.custom.api')}</h3>
            </div>
            <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-xl border border-white/10 p-6">
              <Link className="h-8 w-8 text-green-400 mx-auto mb-3" />
              <h3 className="text-white font-medium mb-2">{t('integration.custom.zapier')}</h3>
            </div>
          </div>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('openBookingModal'))}
            className="mt-8 inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
          >
            {t('integration.custom.contact')}
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default IntegrationGuide;