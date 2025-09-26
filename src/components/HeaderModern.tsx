import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import LogoMinimal from './LogoMinimal';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '../providers/LanguageProvider';

interface HeaderModernProps {
  onBookingClick: () => void;
}

const HeaderModern: React.FC<HeaderModernProps> = ({ onBookingClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();
  const servicesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
        setIsServicesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const serviceItems = [
    { 
      path: '/services/booking-systems', 
      labelKey: 'nav.servicesMenu.booking',
      label: 'Booking Systems',
      descriptionKey: 'nav.servicesMenu.bookingDesc',
      description: 'AI-powered scheduling and booking solutions'
    },
    { 
      path: '/services/web-development', 
      labelKey: 'nav.servicesMenu.web',
      label: 'Website Development',
      descriptionKey: 'nav.servicesMenu.webDesc',
      description: 'Modern, responsive web applications'
    },
    { 
      path: '/services/business-automation', 
      labelKey: 'nav.servicesMenu.automation',
      label: 'Business Automation',
      descriptionKey: 'nav.servicesMenu.automationDesc',
      description: 'Streamline and automate your processes'
    }
  ];

  const navItems = [
    { path: '/', labelKey: 'nav.home', label: 'Home' },
    {
      path: '/services',
      labelKey: 'nav.services',
      label: 'Services',
      isDropdown: true,
      dropdownItems: serviceItems
    },
    {
      path: '/demos',
      labelKey: 'nav.demo',
      label: 'Demo',
      hasNew: true
    },
    { path: '/portfolio', labelKey: 'nav.portfolio', label: 'Portfolio' },
    { path: '/pricing', labelKey: 'nav.pricing', label: 'Pricing' },
    { path: '/about', labelKey: 'nav.about', label: 'About' },
    { path: '/contact', labelKey: 'nav.contact', label: 'Contact' }
  ];

  return (
    <>
      <motion.header 
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-black/90 backdrop-blur-xl border-b border-white/10' 
            : 'bg-black/50 backdrop-blur-md'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <LogoMinimal showText={true} variant="light" className="h-10 w-10" />
                <motion.div
                  className="absolute -inset-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                item.isDropdown ? (
                  <div key={item.path} className="relative" ref={servicesRef}>
                    <button
                      onClick={() => setIsServicesOpen(!isServicesOpen)}
                      onMouseEnter={() => setIsServicesOpen(true)}
                      className="flex items-center gap-1 px-1 py-2 text-gray-300 hover:text-white transition-colors duration-200 font-medium text-sm tracking-wide"
                    >
                      {t(item.labelKey) || item.label}
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isServicesOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    <AnimatePresence>
                      {isServicesOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-72 bg-black/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
                          onMouseLeave={() => setIsServicesOpen(false)}
                        >
                          {item.dropdownItems?.map((subItem, index) => (
                            <Link
                              key={subItem.path}
                              to={subItem.path}
                              onClick={() => setIsServicesOpen(false)}
                              className="block px-6 py-4 hover:bg-white/5 transition-colors duration-200 border-b border-white/5 last:border-0"
                            >
                              <div className="text-white font-medium mb-1">
                                {t(subItem.labelKey) || subItem.label}
                              </div>
                              <div className="text-gray-400 text-xs">
                                {t(subItem.descriptionKey) || subItem.description}
                              </div>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-1 py-2 text-gray-300 hover:text-white transition-colors duration-200 font-medium text-sm tracking-wide relative ${
                      location.pathname === item.path ? 'text-white' : ''
                    }`}
                  >
                    {t(item.labelKey) || item.label}
                    {item.hasNew && (
                      <span className="absolute -top-2 -right-6 px-1.5 py-0.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-[10px] font-bold rounded-full animate-pulse">
                        NEW
                      </span>
                    )}
                  </Link>
                )
              ))}
            </div>

            {/* CTA Button and Language Selector */}
            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <LanguageSwitcher />
              
              <motion.button
                onClick={onBookingClick}
                className="hidden md:flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-medium text-sm hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>{t('cta.consultation')}</span>
                <ArrowRight className="h-4 w-4" />
              </motion.button>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden relative p-2 text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="h-6 w-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-6 w-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/10"
            >
              <div className="px-4 py-6 space-y-2">
                {navItems.map((item, index) => (
                  <div key={item.path}>
                    {item.isDropdown ? (
                      <div>
                        <button
                          onClick={() => setIsServicesOpen(!isServicesOpen)}
                          className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300"
                        >
                          <span>{t(item.labelKey) || item.label}</span>
                          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isServicesOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        <AnimatePresence>
                          {isServicesOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="ml-4 mt-2 space-y-1"
                            >
                              {item.dropdownItems?.map((subItem) => (
                                <Link
                                  key={subItem.path}
                                  to={subItem.path}
                                  onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    setIsServicesOpen(false);
                                  }}
                                  className="block px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-300"
                                >
                                  {t(subItem.labelKey) || subItem.label}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`block px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300 relative ${
                          location.pathname === item.path ? 'text-white bg-white/10' : ''
                        }`}
                      >
                        <span className="flex items-center justify-between">
                          {t(item.labelKey) || item.label}
                          {item.hasNew && (
                            <span className="px-2 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-[10px] font-bold rounded-full animate-pulse">
                              NEW
                            </span>
                          )}
                        </span>
                      </Link>
                    )}
                  </div>
                ))}
                
                {/* Language Selector in Mobile Menu */}
                <div className="px-4 py-3">
                  <LanguageSwitcher />
                </div>
                
                <motion.button
                  onClick={() => {
                    onBookingClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="flex items-center justify-center gap-2">
                    {t('cta.consultation')}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Spacer for fixed header */}
      <div className="h-24" />
    </>
  );
};

export default HeaderModern;