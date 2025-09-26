import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, MapPin, Phone, Send, User, Building, 
  MessageSquare, Clock, Sparkles, ChevronRight,
  Globe, Shield, Zap
} from 'lucide-react';
import { useLanguage } from '../providers/LanguageProvider';

const ContactModern: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const emailSubject = `EA-S Contact: ${formData.company || formData.name}`;
    const emailBody = `
New Contact Form Submission:

Name: ${formData.name}
Email: ${formData.email}
Company: ${formData.company}
Message: ${formData.message}
    `;
    
    window.location.href = `mailto:ali.h@easolutions.de?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    
    setTimeout(() => {
      setFormData({ name: '', email: '', company: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactMethods = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: t('contact.email'),
      value: 'ali.h@easolutions.de',
      link: 'mailto:ali.h@easolutions.de',
      color: 'from-purple-600 to-blue-600'
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: t('contact.phone'),
      value: '+49 711 2549 8350',
      link: 'tel:+497112549350',
      color: 'from-blue-600 to-cyan-600'
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: t('contact.location'),
      value: 'Stuttgart, Germany',
      link: null,
      color: 'from-green-600 to-emerald-600'
    }
  ];

  const reasons = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: t('contact.reasons.fast.title'),
      description: t('contact.reasons.fast.desc')
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: t('contact.reasons.private.title'),
      description: t('contact.reasons.private.desc')
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: t('contact.reasons.german.title'),
      description: 'Built in Stuttgart, optimized for German business needs'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              {t('contact.hero.title')}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t('contact.hero.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 mb-20">
            {contactMethods.map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                {method.link ? (
                  <a
                    href={method.link}
                    className="block p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300 group"
                  >
                    <div className={`inline-flex p-3 bg-gradient-to-r ${method.color} rounded-xl mb-4`}>
                      {method.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{method.title}</h3>
                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                      {method.value}
                    </p>
                  </a>
                ) : (
                  <div className="block p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
                    <div className={`inline-flex p-3 bg-gradient-to-r ${method.color} rounded-xl mb-4`}>
                      {method.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{method.title}</h3>
                    <p className="text-gray-400">{method.value}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                <h2 className="text-3xl font-bold mb-2">{t('contact.form.sendMessage')}</h2>
                <p className="text-gray-400 mb-8">
                  {t('contact.form.description')}
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t('contact.form.nameLabel')}
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                        placeholder={t('contact.form.namePlaceholder')}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t('contact.form.emailLabel')}
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                        placeholder={t('contact.form.emailPlaceholder')}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t('contact.form.companyLabel')}
                    </label>
                    <div className="relative">
                      <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                        placeholder={t('contact.form.companyPlaceholder')}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t('contact.form.messageLabel')}
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-gray-500" />
                      <textarea
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                        placeholder={t('contact.form.messagePlaceholder')}
                      />
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 disabled:opacity-50"
                  >
                    <span>{isSubmitting ? t('contact.form.sending') : t('contact.form.send')}</span>
                    <Send className="w-5 h-5" />
                  </motion.button>
                </form>
              </div>
            </motion.div>

            {/* Why Choose EA-S */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold mb-8">{t('contact.why.title')}</h2>
                <div className="space-y-6">
                  {reasons.map((reason, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex gap-4"
                    >
                      <div className="flex-shrink-0 p-3 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-xl">
                        {reason.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{reason.title}</h3>
                        <p className="text-gray-400">{reason.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* CTA Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
              >
                <Sparkles className="w-12 h-12 text-purple-400 mb-4" />
                <h3 className="text-2xl font-bold mb-4">
                  {t('contact.cta.ready')}
                </h3>
                <p className="text-gray-300 mb-6">
                  {t('contact.cta.schedule')}
                </p>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('openBookingModal'))}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                >
                  <span>{t('contact.cta.book')}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-20 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">{t('contact.trust.title')}</h2>
            <p className="text-gray-400 mb-8">
              {t('contact.trust.subtitle')}
            </p>
            <div className="space-y-4">
              <div className="flex flex-wrap justify-center gap-8">
                <div className="text-gray-500">{t('contact.trust.enterprise')}</div>
                <div className="text-gray-500">•</div>
                <div className="text-gray-500">{t('contact.trust.german')}</div>
                <div className="text-gray-500">•</div>
                <div className="text-gray-500">{t('contact.trust.private')}</div>
              </div>
              <div className="text-center space-y-2">
                <p className="text-gray-400">{t('contact.trust.serving')}</p>
                <p className="text-gray-400">{t('contact.trust.built')}</p>
                <div className="flex justify-center gap-6 mt-4 text-sm text-gray-500">
                  <span>VAT ID: DE123456789</span>
                  <span>•</span>
                  <span>HRB 75432 Stuttgart</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ContactModern;