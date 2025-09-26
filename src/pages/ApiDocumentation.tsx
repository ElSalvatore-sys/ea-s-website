import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Code, Terminal, Book, Key, Globe, 
  Shield, Zap, Copy, Check, ChevronRight,
  Database, Cloud, Lock, ArrowRight
} from 'lucide-react';
import { useLanguage } from '../providers/LanguageProvider';

const ApiDocumentation: React.FC = () => {
  const { t } = useLanguage();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const codeExamples = {
    auth: `curl -X GET https://api.ea-s-booking.com/v1/bookings \
  -H "Authorization: Bearer YOUR_API_KEY"`,
    createBooking: `curl -X POST https://api.ea-s-booking.com/v1/bookings \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "service_id": "123",
    "customer_email": "customer@example.com",
    "date": "2024-02-15",
    "time": "14:00"
  }'`,
    listBookings: `const response = await fetch('https://api.ea-s-booking.com/v1/bookings', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
});
const bookings = await response.json();`
  };

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
              <Code className="h-8 w-8 text-purple-400" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {t('api.hero.title')}
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
              {t('api.hero.subtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('openBookingModal'))}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
              >
                <Key className="mr-2 h-5 w-5" />
                {t('api.hero.getStarted')}
              </button>
              <a 
                href="#endpoints"
                className="inline-flex items-center px-8 py-4 border-2 border-white/20 text-white rounded-full hover:bg-white/10 transition-all duration-300"
              >
                <Book className="mr-2 h-5 w-5" />
                {t('api.hero.viewDocs')}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">{t('api.overview.title')}</h2>
              <p className="text-gray-300 mb-6">{t('api.overview.intro')}</p>
              
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-xl border border-white/10 p-4">
                  <div className="text-sm text-gray-400 mb-1">{t('api.overview.baseUrl')}</div>
                  <code className="text-purple-400">https://api.ea-s-booking.com</code>
                </div>
                <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-xl border border-white/10 p-4">
                  <div className="text-sm text-gray-400 mb-1">{t('api.overview.version')}</div>
                  <code className="text-purple-400">v1</code>
                </div>
                <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-xl border border-white/10 p-4">
                  <div className="text-sm text-gray-400 mb-1">{t('api.overview.auth')}</div>
                  <code className="text-purple-400">Bearer Token</code>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">{t('api.authentication.title')}</h3>
              <p className="text-gray-300 mb-4">{t('api.authentication.description')}</p>
              
              <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">{t('api.authentication.example')}</span>
                  <button
                    onClick={() => copyToClipboard(codeExamples.auth, 'auth')}
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    {copiedCode === 'auth' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
                <pre className="text-sm text-gray-300 overflow-x-auto">
                  <code>{codeExamples.auth}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Endpoints */}
      <section id="endpoints" className="py-20 bg-gradient-to-br from-purple-900/20 to-blue-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white text-center mb-12">{t('api.endpoints.title')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Bookings */}
            <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-xl border border-white/10 p-6">
              <h3 className="text-xl font-semibold text-white mb-4">{t('api.endpoints.bookings.title')}</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-300">
                  <span className="text-green-400 mr-2">GET</span>
                  /bookings
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="text-blue-400 mr-2">POST</span>
                  /bookings
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="text-green-400 mr-2">GET</span>
                  /bookings/:id
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="text-yellow-400 mr-2">PUT</span>
                  /bookings/:id
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="text-red-400 mr-2">DELETE</span>
                  /bookings/:id
                </li>
              </ul>
            </div>

            {/* Customers */}
            <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-xl border border-white/10 p-6">
              <h3 className="text-xl font-semibold text-white mb-4">{t('api.endpoints.customers.title')}</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-300">
                  <span className="text-green-400 mr-2">GET</span>
                  /customers
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="text-blue-400 mr-2">POST</span>
                  /customers
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="text-green-400 mr-2">GET</span>
                  /customers/:id
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="text-yellow-400 mr-2">PUT</span>
                  /customers/:id
                </li>
              </ul>
            </div>

            {/* Availability */}
            <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-xl border border-white/10 p-6">
              <h3 className="text-xl font-semibold text-white mb-4">{t('api.endpoints.availability.title')}</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-300">
                  <span className="text-green-400 mr-2">GET</span>
                  /availability
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="text-green-400 mr-2">GET</span>
                  /availability/slots
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="text-blue-400 mr-2">POST</span>
                  /availability/block
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SDKs */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">{t('api.sdks.title')}</h2>
            <p className="text-xl text-gray-300">{t('api.sdks.description')}</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['JavaScript', 'Python', 'PHP', 'Ruby'].map((lang) => (
              <motion.div
                key={lang}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-xl border border-white/10 p-6 text-center hover:border-purple-500/50 transition-all cursor-pointer"
              >
                <Terminal className="h-8 w-8 text-purple-400 mx-auto mb-3" />
                <h3 className="text-white font-medium">{lang}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ApiDocumentation;