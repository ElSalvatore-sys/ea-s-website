import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, UserCheck, FileText, Mail, Globe, Server } from 'lucide-react';
import { useLanguage } from '../providers/LanguageProvider';

const Datenschutz: React.FC = () => {
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex p-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl mb-6">
              <Shield className="h-12 w-12 text-blue-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {t('legal.privacy.title')}
            </h1>
            <p className="text-xl text-gray-300">
              {t('legal.privacy.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Key Principles */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: Lock,
                title: t('legal.privacy.security'),
                description: t('legal.privacy.security.desc'),
                color: 'from-purple-600 to-blue-600'
              },
              {
                icon: Eye,
                title: t('legal.privacy.transparency'),
                description: t('legal.privacy.transparency.desc'),
                color: 'from-blue-600 to-cyan-600'
              },
              {
                icon: UserCheck,
                title: t('legal.privacy.rights'),
                description: t('legal.privacy.rights.desc'),
                color: 'from-green-600 to-emerald-600'
              }
            ].map((item, index) => {
              const IconComponent = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <div className={`inline-flex p-3 bg-gradient-to-r ${item.color} rounded-xl mb-4`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-400">{item.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            {/* Data Collection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl">
                  <Database className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold">{t('legal.privacy.section1.title')}</h2>
              </div>
              <p className="text-gray-300 leading-relaxed mb-6">
                {t('legal.privacy.section1.content')}
              </p>
              <div className="bg-purple-600/10 rounded-xl p-4 border border-purple-600/20">
                <h3 className="font-semibold mb-3 text-purple-400">What We Collect:</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Contact information (name, email, phone) when you reach out to us</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Usage data to improve our services (with your consent)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Technical data necessary for service provision</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Data Usage */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl">
                  <Eye className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold">{t('legal.privacy.section2.title')}</h2>
              </div>
              <p className="text-gray-300 leading-relaxed mb-6">
                {t('legal.privacy.section2.content')}
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-600/10 rounded-xl p-4 border border-blue-600/20">
                  <h3 className="font-semibold mb-2 text-blue-400">We Use Data To:</h3>
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li>• Provide our services</li>
                    <li>• Improve user experience</li>
                    <li>• Send important updates</li>
                    <li>• Ensure security</li>
                  </ul>
                </div>
                <div className="bg-red-600/10 rounded-xl p-4 border border-red-600/20">
                  <h3 className="font-semibold mb-2 text-red-400">We Never:</h3>
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li>• Sell your data</li>
                    <li>• Share without consent</li>
                    <li>• Use for advertising</li>
                    <li>• Store unnecessarily</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Data Protection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl">
                  <Lock className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold">{t('legal.privacy.section3.title')}</h2>
              </div>
              <p className="text-gray-300 leading-relaxed mb-6">
                {t('legal.privacy.section3.content')}
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white/5 rounded-xl">
                  <Server className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <h4 className="font-semibold mb-1">German Servers</h4>
                  <p className="text-xs text-gray-400">Data stays in Germany</p>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-xl">
                  <Shield className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <h4 className="font-semibold mb-1">256-bit Encryption</h4>
                  <p className="text-xs text-gray-400">Bank-level security</p>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-xl">
                  <Globe className="h-8 w-8 text-green-400 mx-auto mb-2" />
                  <h4 className="font-semibold mb-1">GDPR Compliant</h4>
                  <p className="text-xs text-gray-400">Full EU compliance</p>
                </div>
              </div>
            </motion.div>

            {/* Your Rights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl">
                  <UserCheck className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold">Your GDPR Rights</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 text-purple-400">You Have The Right To:</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>Access your personal data</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>Correct inaccurate data</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>Request data deletion</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>Export your data</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>Withdraw consent anytime</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3 text-purple-400">How To Exercise Rights:</h3>
                  <p className="text-gray-300 mb-4">
                    Simply contact us at any time to exercise your data protection rights. We will respond within 30 days as required by GDPR.
                  </p>
                  <a 
                    href="mailto:ali.h@easolutions.de" 
                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600/20 rounded-lg border border-purple-600/30 hover:bg-purple-600/30 transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                    Contact Data Protection
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
            >
              <h2 className="text-2xl font-bold mb-6">{t('legal.privacy.contact.title')}</h2>
              <p className="text-gray-300 mb-6">
                {t('legal.privacy.contact.content')}
              </p>
              <div className="bg-purple-600/10 rounded-xl p-6 border border-purple-600/20">
                <div className="space-y-3">
                  <p className="text-gray-300">
                    <strong className="text-white">EA Solutions</strong>
                  </p>
                  <p className="text-gray-300">Ali H.</p>
                  <p className="text-gray-300">Königstraße 78<br/>70173 Stuttgart<br/>Germany</p>
                  <div className="pt-3 space-y-2">
                    <p className="text-gray-300">
                      <span className="text-gray-400">Email:</span> ali.h@easolutions.de
                    </p>
                    <p className="text-gray-300">
                      <span className="text-gray-400">Phone:</span> +49 711 2549 8350
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-green-600/10 rounded-xl border border-green-600/20">
                <p className="text-sm text-gray-300">
                  <span className="text-green-400 font-semibold">Last Updated:</span> January 2025
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Datenschutz;