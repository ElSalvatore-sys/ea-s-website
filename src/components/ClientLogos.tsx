import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../providers/LanguageProvider';

interface ClientLogo {
  name: string;
  imagePath?: string;
  fallbackText: string;
  url?: string;
}

const ClientLogos: React.FC = () => {
  const { t } = useLanguage();

  const clients: ClientLogo[] = [
    {
      name: 'Hotel am Kochbrunnen',
      fallbackText: 'HOTEL',
      url: '#'
    },
    {
      name: 'Falchi Dental',
      fallbackText: 'FALCHI',
      url: '#'
    },
    {
      name: 'Glenn Miller School',
      fallbackText: 'GLENN MILLER',
      url: '#'
    },
    {
      name: 'Eyerusalem (33eye.de)',
      fallbackText: 'EYERUSALEM',
      url: 'https://33eye.de'
    }
  ];

  return (
    <section className="py-12 bg-gradient-to-b from-[#1a0f2e]/50 to-[#1a0f2e]/30 border-y border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <p className="text-sm text-gray-400 uppercase tracking-wider mb-2">
            {t('clients.trustedBy')}
          </p>
          <h3 className="text-xl font-semibold text-white">
            {t('clients.powering')}
          </h3>
        </motion.div>

        {/* Logo scroll */}
        <div className="relative overflow-hidden">
          <div className="flex space-x-16 animate-scroll-logos">
            {[...clients, ...clients].map((client, index) => (
              <motion.div
                key={`${client.name}-${index}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex-shrink-0"
              >
                <a
                  href={client.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <div className="h-16 flex items-center justify-center px-6 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-300">
                    {client.imagePath ? (
                      <img
                        src={client.imagePath}
                        alt={client.name}
                        className="h-8 object-contain filter grayscale opacity-60 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            const span = document.createElement('span');
                            span.className = 'text-white/60 font-semibold text-sm group-hover:text-white transition-colors';
                            span.textContent = client.fallbackText;
                            parent.appendChild(span);
                          }
                        }}
                      />
                    ) : (
                      <span className="text-white/60 font-semibold text-sm group-hover:text-white transition-colors">
                        {client.fallbackText}
                      </span>
                    )}
                  </div>
                </a>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-white">15+</div>
            <div className="text-xs text-gray-400">{t('clients.stats.activeClients')}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">98%</div>
            <div className="text-xs text-gray-400">{t('clients.stats.clientRetention')}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">4.8★</div>
            <div className="text-xs text-gray-400">{t('clients.stats.rating')}</div>
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes scroll-logos {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll-logos {
          animation: scroll-logos 30s linear infinite;
        }
        
        .animate-scroll-logos:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default ClientLogos;