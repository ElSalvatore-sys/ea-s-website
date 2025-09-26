import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  HelpCircle, Book, CreditCard, Link, Code, Settings,
  Search, Mail, MessageSquare, Phone, ArrowRight, ChevronRight
} from 'lucide-react';
import { useLanguage } from '../providers/LanguageProvider';

const SupportCenter: React.FC = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    {
      icon: Book,
      title: t('support.categories.getting_started.title'),
      description: t('support.categories.getting_started.desc'),
      articles: 12,
      color: 'from-purple-600 to-blue-600'
    },
    {
      icon: HelpCircle,
      title: t('support.categories.bookings.title'),
      description: t('support.categories.bookings.desc'),
      articles: 18,
      color: 'from-blue-600 to-cyan-600'
    },
    {
      icon: CreditCard,
      title: t('support.categories.payments.title'),
      description: t('support.categories.payments.desc'),
      articles: 8,
      color: 'from-green-600 to-emerald-600'
    },
    {
      icon: Link,
      title: t('support.categories.integrations.title'),
      description: t('support.categories.integrations.desc'),
      articles: 15,
      color: 'from-orange-600 to-red-600'
    },
    {
      icon: Code,
      title: t('support.categories.api.title'),
      description: t('support.categories.api.desc'),
      articles: 22,
      color: 'from-pink-600 to-rose-600'
    },
    {
      icon: Settings,
      title: t('support.categories.account.title'),
      description: t('support.categories.account.desc'),
      articles: 10,
      color: 'from-indigo-600 to-purple-600'
    }
  ];

  const popularArticles = [
    t('support.popular.article1'),
    t('support.popular.article2'),
    t('support.popular.article3'),
    t('support.popular.article4'),
    t('support.popular.article5')
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 pt-16">
      {/* Hero with Search */}
      <section className="relative py-20 overflow-hidden">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {t('support.hero.title')}
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-12">
              {t('support.hero.subtitle')}
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('support.hero.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 transition-all"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            {t('support.categories.title')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-purple-500/50 transition-all duration-300 cursor-pointer group"
              >
                <div className={`inline-flex p-3 bg-gradient-to-r ${category.color} rounded-xl mb-4 group-hover:scale-110 transition-transform`}>
                  <category.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {category.title}
                </h3>
                <p className="text-gray-400 mb-4">
                  {category.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{category.articles} articles</span>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-20 bg-gradient-to-br from-purple-900/20 to-blue-900/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            {t('support.popular.title')}
          </h2>
          
          <div className="space-y-4">
            {popularArticles.map((article, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-xl border border-white/10 p-4 hover:border-purple-500/50 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-white group-hover:text-purple-400 transition-colors">
                    {article}
                  </span>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              {t('support.contact.title')}
            </h2>
            <p className="text-xl text-gray-300">
              {t('support.contact.description')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-8 text-center hover:border-purple-500/50 transition-all"
            >
              <Mail className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {t('support.contact.email.title')}
              </h3>
              <p className="text-gray-400 mb-4">
                {t('support.contact.email.desc')}
              </p>
              <button className="text-purple-400 hover:text-purple-300 transition-colors">
                {t('support.contact.email.cta')} →
              </button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-8 text-center hover:border-purple-500/50 transition-all"
            >
              <MessageSquare className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {t('support.contact.chat.title')}
              </h3>
              <p className="text-gray-400 mb-4">
                {t('support.contact.chat.desc')}
              </p>
              <button className="text-blue-400 hover:text-blue-300 transition-colors">
                {t('support.contact.chat.cta')} →
              </button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-8 text-center hover:border-purple-500/50 transition-all"
            >
              <Phone className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {t('support.contact.phone.title')}
              </h3>
              <p className="text-gray-400 mb-4">
                {t('support.contact.phone.desc')}
              </p>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('openBookingModal'))}
                className="text-green-400 hover:text-green-300 transition-colors"
              >
                {t('support.contact.phone.cta')} →
              </button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SupportCenter;