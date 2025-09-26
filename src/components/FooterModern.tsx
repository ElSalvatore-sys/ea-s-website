import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../providers/LanguageProvider';
import { 
  Sparkles,
  Github,
  Twitter,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  ArrowUpRight,
  Heart,
  Shield,
  Send,
  CheckCircle
} from 'lucide-react';
import LogoMinimal from './LogoMinimal';
import Sitemap from './Sitemap';

interface FooterModernProps {
  onBookingClick: () => void;
}

const FooterModern: React.FC<FooterModernProps> = ({ onBookingClick }) => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    setIsSubscribed(true);
    setTimeout(() => {
      setIsSubscribed(false);
      setEmail('');
    }, 3000);
  };

  const footerLinks = {
    company: [
      { labelKey: 'footer.company.about', label: 'About Us', path: '/about' },
      { labelKey: 'footer.company.contact', label: 'Contact', path: '/contact' },
      { labelKey: 'footer.company.portfolio', label: 'Portfolio', path: '/portfolio' },
      { labelKey: 'footer.company.services', label: 'Services', path: '/services' },
    ],
  };

  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
  ];

  return (
    <footer className="relative bg-black border-t border-white/10">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Sitemap Section */}
        <Sitemap />

        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-2">
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  {t('footer.newsletter.title')}
                </span>
              </h3>
              <p className="text-gray-400">
                {t('footer.newsletter.subtitle')}
              </p>
            </div>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('footer.newsletter.placeholder')}
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                required
              />
              <motion.button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isSubscribed ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    {t('footer.newsletter.subscribed')}
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    {t('footer.newsletter.subscribe')}
                  </>
                )}
              </motion.button>
            </form>
          </div>
        </div>

        {/* Top CTA section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 pb-12 border-b border-white/10">
          <div className="mb-6 md:mb-0">
            <h3 className="text-3xl font-bold mb-2">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {t('footer.cta.title')}
              </span>
            </h3>
            <p className="text-gray-400">{t('footer.cta.subtitle')}</p>
          </div>
          <motion.button
            onClick={onBookingClick}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 group flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles className="w-4 h-4" />
            {t('footer.cta.button')}
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </motion.button>
        </div>

        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Logo and description */}
          <div>
            <Link to="/" className="inline-block mb-4">
              <LogoMinimal showText={true} variant="light" className="h-10 w-10" />
            </Link>
            <p className="text-gray-400 text-sm mb-6 max-w-xs">
              {t('footer.company.serving')}<br/>
              {t('footer.company.built')}
            </p>
            
            {/* Trust Badges */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-lg">🇩🇪</span>
                <span className="text-gray-300">{t('footer.badges.madeInGermany')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">{t('footer.badges.gdpr')}</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4 mt-6">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={t(`footer.social.${social.label.toLowerCase()}`) || social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Company links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              {t('footer.sections.company')}
            </h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white text-sm transition-colors duration-300 flex items-center gap-1 group"
                  >
                    {t(link.labelKey) || link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info Bar */}
        <div className="py-6 border-t border-white/10 mb-6">
          <div className="flex flex-wrap gap-6 justify-center text-sm">
            <a
              href="mailto:ea-s@ea.de"
              className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              ea-s@ea.de
            </a>
            <a
              href="tel:+4917663062016"
              className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              +49 176 6306 2016
            </a>
            <span className="text-gray-400 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {t('footer.contact.location')}
            </span>
          </div>
        </div>

        {/* Bottom section */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © {currentYear} EA Solutions. {t('footer.copyright')}
            </p>
            <div className="flex items-center gap-6">
              <Link to="/impressum" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
                {t('footer.impressum')}
              </Link>
              <Link to="/datenschutz" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
                {t('footer.privacy')}
              </Link>
              <p className="text-gray-500 text-sm flex items-center gap-1">
                <span className="text-lg">🆔🇩🇪</span>
                {t('footer.developed')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterModern;