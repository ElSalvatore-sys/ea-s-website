import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search, MessageCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import { useLanguage } from '../providers/LanguageProvider';

const NotFound: React.FC = () => {
  const { t } = useLanguage();

  const handleWhatsApp = () => {
    const message = encodeURIComponent(t('notFound.whatsappMessage'));
    window.open(`https://wa.me/4915234567890?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Animated 404 */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 animate-pulse">
            404
          </h1>
          <div className="mt-4 text-2xl text-white font-semibold">
            {t('notFound.title')}
          </div>
        </div>

        {/* Message */}
        <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
          {t('notFound.description')}
        </p>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 max-w-lg mx-auto">
          <Link to="/" className="group">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <Home className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <span className="text-white text-sm">{t('notFound.homepage')}</span>
            </div>
          </Link>
          
          <Link to="/services" className="group">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <Search className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <span className="text-white text-sm">{t('notFound.services')}</span>
            </div>
          </Link>
          
          <button onClick={handleWhatsApp} className="group">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <MessageCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <span className="text-white text-sm">{t('notFound.getHelp')}</span>
            </div>
          </button>
        </div>

        {/* Primary CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button 
              variant="primary" 
              size="lg"
              icon={ArrowLeft}
              iconPosition="left"
            >
              {t('notFound.backToHomepage')}
            </Button>
          </Link>
          
          <Link to="/contact">
            <Button 
              variant="secondary" 
              size="lg"
            >
              {t('notFound.contactSupport')}
            </Button>
          </Link>
        </div>

        {/* Popular Pages */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-gray-500 text-sm mb-4">{t('notFound.popularPages')}:</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              { path: '/smart-living', label: t('nav.solutions.smartLiving') },
              { path: '/mind', label: t('nav.solutions.mind') },
              { path: '/portfolio', label: t('nav.portfolio') },
              { path: '/about', label: t('nav.about') }
            ].map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;