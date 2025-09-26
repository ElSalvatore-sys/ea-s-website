import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building, Mail, MapPin, Phone, FileText, Scale, Shield, Globe, Briefcase } from 'lucide-react';
import { useLanguage } from '../providers/LanguageProvider';

const Impressum: React.FC = () => {
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex p-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl mb-6">
              <Scale className="h-12 w-12 text-purple-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              {t('legal.impressum.title')}
            </h1>
            <p className="text-xl text-gray-300">
              {t('legal.impressum.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            {/* Company Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl">
                  <Building className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold">{t('legal.impressum.company.title')}</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-purple-400">
                    {t('legal.impressum.company.details')}
                  </h3>
                  <div className="space-y-3 text-gray-300">
                    <p><strong className="text-white">EA Solutions</strong></p>
                    <p>Ali H.</p>
                    <p>Königstraße 78</p>
                    <p>70173 Stuttgart</p>
                    <p>Germany</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-purple-400">
                    {t('legal.impressum.contact.title')}
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-purple-400" />
                      <a href="mailto:ali.h@easolutions.de" className="text-gray-300 hover:text-white transition-colors">
                        ali.h@easolutions.de
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-purple-400" />
                      <a href="tel:+497112549350" className="text-gray-300 hover:text-white transition-colors">
                        +49 711 2549 8350
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-purple-400" />
                      <span className="text-gray-300">Stuttgart, Germany</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Registration */}
              <div className="mt-8 pt-8 border-t border-white/10">
                <h3 className="text-lg font-semibold mb-4 text-purple-400">Business Registration</h3>
                <div className="grid md:grid-cols-2 gap-6 text-gray-300">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">VAT Identification Number</p>
                    <p className="font-mono">DE123456789</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Commercial Register</p>
                    <p className="font-mono">HRB 75432 Stuttgart</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Legal Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold">{t('legal.impressum.legal.title')}</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-purple-400 mb-3">
                    {t('legal.impressum.legal.responsibility')}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {t('legal.impressum.legal.responsibility.content')}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-purple-400 mb-3">
                    {t('legal.impressum.legal.liability')}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {t('legal.impressum.legal.liability.content')}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-purple-400 mb-3">
                    {t('legal.impressum.legal.copyright')}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {t('legal.impressum.legal.copyright.content')}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Professional Associations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold">Professional Information</h2>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="inline-flex p-3 bg-white/10 rounded-xl mb-3">
                    <Shield className="h-8 w-8 text-purple-400" />
                  </div>
                  <h3 className="font-semibold mb-2">GDPR Compliant</h3>
                  <p className="text-sm text-gray-400">Full compliance with EU data protection regulations</p>
                </div>
                <div className="text-center">
                  <div className="inline-flex p-3 bg-white/10 rounded-xl mb-3">
                    <Globe className="h-8 w-8 text-blue-400" />
                  </div>
                  <h3 className="font-semibold mb-2">German Engineering</h3>
                  <p className="text-sm text-gray-400">Built and hosted in Germany</p>
                </div>
                <div className="text-center">
                  <div className="inline-flex p-3 bg-white/10 rounded-xl mb-3">
                    <Building className="h-8 w-8 text-green-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Est. 2020</h3>
                  <p className="text-sm text-gray-400">Serving German businesses since 2020</p>
                </div>
              </div>
            </motion.div>

            {/* Dispute Resolution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
            >
              <h2 className="text-2xl font-bold mb-4">{t('legal.impressum.dispute.title')}</h2>
              <p className="text-gray-300 leading-relaxed">
                {t('legal.impressum.dispute.content')}
              </p>
              <div className="mt-4 p-4 bg-purple-600/10 rounded-xl border border-purple-600/20">
                <p className="text-sm text-gray-400">
                  Online Dispute Resolution Platform: 
                  <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 ml-2">
                    https://ec.europa.eu/consumers/odr
                  </a>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Impressum;