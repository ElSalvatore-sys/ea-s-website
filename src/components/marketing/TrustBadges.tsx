import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Server, Activity, Award, Users } from 'lucide-react';
import { useLanguage } from '../../providers/LanguageProvider';

interface TrustBadge {
  id: string;
  icon: React.ElementType;
  label: string;
  description: string;
  highlight?: string;
  color: string;
}

const TrustBadges: React.FC = () => {
  const { t } = useLanguage();

  const badges: TrustBadge[] = [
    {
      id: 'gdpr',
      icon: Shield,
      label: t('marketing.trust.gdpr.label'),
      description: t('marketing.trust.gdpr.description'),
      highlight: 'DSGVO',
      color: 'from-blue-400 to-indigo-400'
    },
    {
      id: 'ssl',
      icon: Lock,
      label: t('marketing.trust.ssl.label'),
      description: t('marketing.trust.ssl.description'),
      highlight: 'SSL',
      color: 'from-green-400 to-emerald-400'
    },
    {
      id: 'german-hosted',
      icon: Server,
      label: t('marketing.trust.germanHosted.label'),
      description: t('marketing.trust.germanHosted.description'),
      highlight: '🇩🇪',
      color: 'from-gray-400 to-gray-300'
    },
    {
      id: 'uptime',
      icon: Activity,
      label: t('marketing.trust.uptime.label'),
      description: t('marketing.trust.uptime.description'),
      highlight: '99.9%',
      color: 'from-purple-400 to-pink-400'
    },
    {
      id: 'certified',
      icon: Award,
      label: t('marketing.trust.certified.label'),
      description: t('marketing.trust.certified.description'),
      color: 'from-yellow-400 to-orange-400'
    },
    {
      id: 'support',
      icon: Users,
      label: t('marketing.trust.support.label'),
      description: t('marketing.trust.support.description'),
      color: 'from-cyan-400 to-blue-400'
    }
  ];

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            {t('marketing.trust.title')}
          </h2>
          <p className="text-gray-400 max-w-3xl mx-auto">
            {t('marketing.trust.subtitle')}
          </p>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {badges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                className="relative group"
              >
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 h-full">
                  {/* Badge Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${badge.color} bg-opacity-10`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    {badge.highlight && (
                      <span className={`text-2xl font-bold bg-gradient-to-r ${badge.color} bg-clip-text text-transparent`}>
                        {badge.highlight}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {badge.label}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {badge.description}
                  </p>

                  {/* Hover Effect */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${badge.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300 pointer-events-none`}
                  />

                  {/* Animated Border */}
                  <motion.div
                    className={`absolute inset-0 rounded-2xl pointer-events-none`}
                    style={{
                      background: `linear-gradient(45deg, transparent, transparent)`,
                      backgroundSize: '200% 200%',
                    }}
                    animate={{
                      backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Compliance Logos Section */}
        <div className="mt-12 pt-12 border-t border-white/10">
          <div className="text-center mb-8">
            <p className="text-sm text-gray-400 uppercase tracking-wider">
              {t('marketing.trust.compliance')}
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-8">
            {/* GDPR Badge */}
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
              <Shield className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-semibold text-gray-300">DSGVO/GDPR</span>
            </div>

            {/* German Quality Badge */}
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
              <Award className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-semibold text-gray-300">German Quality</span>
            </div>

            {/* Made in Germany */}
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
              <span className="text-lg">🇩🇪</span>
              <span className="text-sm font-semibold text-gray-300">Made in Germany</span>
            </div>

            {/* SSL Secured */}
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
              <Lock className="w-5 h-5 text-green-400" />
              <span className="text-sm font-semibold text-gray-300">256-bit SSL</span>
            </div>
          </div>
        </div>

        {/* Security Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-12 p-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl border border-white/10"
        >
          <div className="flex items-start gap-4">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Shield className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">
                {t('marketing.trust.statement.title')}
              </h3>
              <p className="text-sm text-gray-400">
                {t('marketing.trust.statement.description')}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TrustBadges;