import React, { useState, useEffect } from 'react';
import HeaderModern from './HeaderModern';
import FooterModern from './FooterModern';
import BookingModal from './BookingModal';
import { Calendar } from 'lucide-react';
import { useTheme } from './ThemeProvider';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const { isDark } = useTheme();

  // Listen for custom booking modal events
  useEffect(() => {
    const handleOpenBookingModal = () => {
      setIsBookingModalOpen(true);
    };

    window.addEventListener('openBookingModal', handleOpenBookingModal);

    return () => {
      window.removeEventListener('openBookingModal', handleOpenBookingModal);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-300">
      <HeaderModern onBookingClick={() => setIsBookingModalOpen(true)} />
      <main className="flex-grow">
        {children}
      </main>
      <FooterModern onBookingClick={() => setIsBookingModalOpen(true)} />
      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)} 
      />
      {/* Floating Consultation Button */}
      <button
        onClick={() => setIsBookingModalOpen(true)}
        className="fixed bottom-4 right-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 z-40 group"
        aria-label="Book Consultation"
      >
        <Calendar className="h-6 w-6" />
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Book Free Consultation
        </span>
      </button>
    </div>
  );
};

export default Layout;