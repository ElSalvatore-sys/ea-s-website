import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Clock, Users, CheckCircle, AlertCircle, Info, 
  RefreshCw, TrendingUp, Shield, Zap, Coffee, XCircle,
  ChevronRight, Star, MapPin, Phone, Mail, Menu, 
  ArrowRight, Activity, Award, Globe, Sun
} from 'lucide-react';
import { useLanguage } from '../providers/LanguageProvider';
import { useNavigate } from 'react-router-dom';
import BookingWidget from '../components/BookingWidget';
import { isGermanHoliday, getGermanBusinessHours, isMittagspause } from '../utils/germanHolidays';

interface DemoBooking {
  id: string;
  customerName: string;
  service: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: Date;
}

interface Tooltip {
  id: string;
  title: string;
  description: string;
  position: { x: number; y: number };
}

const DemoBooking: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [demoBookings, setDemoBookings] = useState<DemoBooking[]>([]);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [showTutorial, setShowTutorial] = useState(true);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    responseTime: 42,
    uptime: 99.9,
    successRate: 98.7,
    activeUsers: 127
  });
  const [highlightFeature, setHighlightFeature] = useState<string | null>(null);
  const bookingListRef = useRef<HTMLDivElement>(null);

  // Simulate real-time metrics updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPerformanceMetrics(prev => ({
        responseTime: Math.max(20, Math.min(60, prev.responseTime + (Math.random() - 0.5) * 10)),
        uptime: 99.9,
        successRate: Math.max(95, Math.min(100, prev.successRate + (Math.random() - 0.5) * 2)),
        activeUsers: Math.max(100, Math.min(200, prev.activeUsers + Math.floor((Math.random() - 0.5) * 20)))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Load demo bookings from localStorage
  useEffect(() => {
    const savedBookings = localStorage.getItem('demoBookings');
    if (savedBookings) {
      setDemoBookings(JSON.parse(savedBookings));
    }
  }, []);

  // Listen for booking events from the widget
  useEffect(() => {
    const handleNewBooking = (event: CustomEvent) => {
      const newBooking: DemoBooking = {
        id: `DEMO-${Date.now()}`,
        customerName: event.detail.customerName || t('demo.booking.guestName'),
        service: event.detail.service || t('demo.booking.defaultService'),
        date: event.detail.date || new Date().toLocaleDateString(),
        time: event.detail.time || new Date().toLocaleTimeString(),
        status: 'confirmed',
        createdAt: new Date()
      };

      setDemoBookings(prev => {
        const updated = [newBooking, ...prev].slice(0, 10); // Keep only last 10
        localStorage.setItem('demoBookings', JSON.stringify(updated));
        return updated;
      });

      // Highlight the new booking
      setHighlightFeature('new-booking');
      setTimeout(() => setHighlightFeature(null), 3000);

      // Scroll to top of booking list
      if (bookingListRef.current) {
        bookingListRef.current.scrollTop = 0;
      }
    };

    window.addEventListener('demoBookingCreated', handleNewBooking as EventListener);
    return () => {
      window.removeEventListener('demoBookingCreated', handleNewBooking as EventListener);
    };
  }, [t]);

  const resetDemo = () => {
    setDemoBookings([]);
    localStorage.removeItem('demoBookings');
    setShowTutorial(true);
  };

  const tooltips: Tooltip[] = [
    {
      id: 'mittagspause',
      title: t('demo.tooltips.mittagspause.title'),
      description: t('demo.tooltips.mittagspause.description'),
      position: { x: 200, y: 300 }
    },
    {
      id: 'holidays',
      title: t('demo.tooltips.holidays.title'),
      description: t('demo.tooltips.holidays.description'),
      position: { x: 200, y: 400 }
    },
    {
      id: 'realtime',
      title: t('demo.tooltips.realtime.title'),
      description: t('demo.tooltips.realtime.description'),
      position: { x: 800, y: 200 }
    }
  ];

  // Check current time for Mittagspause
  const now = new Date();
  const currentHour = now.getHours();
  const isMittagspauseNow = currentHour >= 12 && currentHour < 14;
  const isHolidayToday = isGermanHoliday(now);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{t('demo.title')}</h1>
              <p className="text-gray-400">{t('demo.subtitle')}</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={resetDemo}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300"
              >
                <RefreshCw className="w-4 h-4" />
                {t('demo.reset')}
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
              >
                {t('demo.cta.useForBusiness')}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tutorial Banner */}
      <AnimatePresence>
        {showTutorial && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-b border-white/10"
          >
            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Info className="w-5 h-5 text-blue-400" />
                  <p className="text-sm">{t('demo.tutorial.message')}</p>
                </div>
                <button
                  onClick={() => setShowTutorial(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Split Screen Layout */}
      <div className="flex flex-col lg:flex-row h-[calc(100vh-200px)]">
        {/* Left Side - Mock Restaurant Website */}
        <div className="lg:w-1/2 h-full overflow-y-auto bg-white text-gray-900">
          <div className="relative">
            {/* Mock Restaurant Header */}
            <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white">
              <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <Coffee className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Restaurant Goldener Löwe</h2>
                      <p className="text-sm opacity-90">{t('demo.restaurant.tagline')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Menu className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>

            {/* Restaurant Info Bar */}
            <div className="bg-amber-50 border-b border-amber-200 px-6 py-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-amber-600" />
                    <span>Hauptstraße 42, 65189 Wiesbaden</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4 text-amber-600" />
                    <span>+49 611 123456</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-semibold">4.8</span>
                  <span className="text-gray-500">(327 {t('demo.restaurant.reviews')})</span>
                </div>
              </div>
            </div>

            {/* German Feature Indicators */}
            <div className="bg-white px-6 py-4 space-y-3">
              {isMittagspauseNow && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                  onMouseEnter={() => setActiveTooltip('mittagspause')}
                  onMouseLeave={() => setActiveTooltip(null)}
                >
                  <Coffee className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="font-semibold text-yellow-900">{t('demo.features.mittagspause.active')}</p>
                    <p className="text-sm text-yellow-700">{t('demo.features.mittagspause.hours')}</p>
                  </div>
                </motion.div>
              )}

              {isHolidayToday && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg"
                  onMouseEnter={() => setActiveTooltip('holidays')}
                  onMouseLeave={() => setActiveTooltip(null)}
                >
                  <Sun className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="font-semibold text-red-900">{t('demo.features.holiday.active')}</p>
                    <p className="text-sm text-red-700">{t('demo.features.holiday.message')}</p>
                  </div>
                </motion.div>
              )}

              <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <Clock className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-semibold text-green-900">{t('demo.features.hours.title')}</p>
                  <p className="text-sm text-green-700">
                    Mo-Fr: 09:00-22:00 ({t('demo.features.hours.lunchBreak')} 12:00-14:00)
                  </p>
                  <p className="text-sm text-green-700">Sa-So: 10:00-23:00</p>
                </div>
              </div>
            </div>

            {/* Booking Widget Section */}
            <div className="px-6 py-6 bg-gray-50">
              <h3 className="text-xl font-bold mb-4">{t('demo.restaurant.bookTable')}</h3>
              <div className="bg-white rounded-lg shadow-lg p-4">
                <BookingWidget 
                  businessId="demo-restaurant"
                  onClose={() => {}}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Admin Dashboard */}
        <div className="lg:w-1/2 h-full bg-gradient-to-br from-gray-900 to-gray-800 border-l border-white/10">
          <div className="h-full flex flex-col">
            {/* Admin Header */}
            <div className="bg-black/50 border-b border-white/10 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-400" />
                    {t('demo.admin.title')}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">{t('demo.admin.subtitle')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-400">{t('demo.admin.live')}</span>
                </div>
              </div>
            </div>

            {/* Booking Stats */}
            <div className="grid grid-cols-4 gap-4 px-6 py-4 bg-black/30">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{demoBookings.length}</div>
                <div className="text-xs text-gray-400">{t('demo.admin.stats.total')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {demoBookings.filter(b => b.status === 'confirmed').length}
                </div>
                <div className="text-xs text-gray-400">{t('demo.admin.stats.confirmed')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {demoBookings.filter(b => b.status === 'pending').length}
                </div>
                <div className="text-xs text-gray-400">{t('demo.admin.stats.pending')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">€{demoBookings.length * 45}</div>
                <div className="text-xs text-gray-400">{t('demo.admin.stats.revenue')}</div>
              </div>
            </div>

            {/* Bookings List */}
            <div ref={bookingListRef} className="flex-1 overflow-y-auto px-6 py-4">
              <h4 className="text-sm font-semibold text-gray-400 mb-4">{t('demo.admin.bookings.title')}</h4>
              
              {demoBookings.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 mx-auto text-gray-600 mb-4" />
                  <p className="text-gray-400">{t('demo.admin.bookings.empty')}</p>
                  <p className="text-sm text-gray-500 mt-2">{t('demo.admin.bookings.hint')}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence>
                    {demoBookings.map((booking, index) => (
                      <motion.div
                        key={booking.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.1 }}
                        className={`bg-white/5 backdrop-blur-xl border rounded-lg p-4 ${
                          highlightFeature === 'new-booking' && index === 0 
                            ? 'border-green-400 shadow-lg shadow-green-400/20' 
                            : 'border-white/10'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-xs font-mono text-gray-500">#{booking.id}</span>
                              <span className={`px-2 py-0.5 text-xs rounded-full ${
                                booking.status === 'confirmed' 
                                  ? 'bg-green-400/20 text-green-400'
                                  : booking.status === 'pending'
                                  ? 'bg-yellow-400/20 text-yellow-400'
                                  : 'bg-red-400/20 text-red-400'
                              }`}>
                                {booking.status}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">{t('demo.admin.bookings.customer')}:</span>
                                <p className="font-semibold">{booking.customerName}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">{t('demo.admin.bookings.service')}:</span>
                                <p className="font-semibold">{booking.service}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">{t('demo.admin.bookings.date')}:</span>
                                <p className="font-semibold">{booking.date}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">{t('demo.admin.bookings.time')}:</span>
                                <p className="font-semibold">{booking.time}</p>
                              </div>
                            </div>
                          </div>
                          <div className="ml-4">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics Footer */}
      <div className="bg-black/80 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-yellow-400" />
              <div>
                <div className="text-sm text-gray-400">{t('demo.metrics.responseTime')}</div>
                <div className="font-bold text-yellow-400">{performanceMetrics.responseTime.toFixed(0)}ms</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-green-400" />
              <div>
                <div className="text-sm text-gray-400">{t('demo.metrics.uptime')}</div>
                <div className="font-bold text-green-400">{performanceMetrics.uptime}%</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <div>
                <div className="text-sm text-gray-400">{t('demo.metrics.successRate')}</div>
                <div className="font-bold text-blue-400">{performanceMetrics.successRate.toFixed(1)}%</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-purple-400" />
              <div>
                <div className="text-sm text-gray-400">{t('demo.metrics.activeUsers')}</div>
                <div className="font-bold text-purple-400">{performanceMetrics.activeUsers}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Tooltips */}
      <AnimatePresence>
        {activeTooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed z-50 bg-black/90 backdrop-blur-xl border border-white/20 rounded-lg p-4 max-w-xs"
            style={{
              top: tooltips.find(t => t.id === activeTooltip)?.position.y,
              left: tooltips.find(t => t.id === activeTooltip)?.position.x
            }}
          >
            <h4 className="font-semibold mb-2 text-white">
              {tooltips.find(t => t.id === activeTooltip)?.title}
            </h4>
            <p className="text-sm text-gray-300">
              {tooltips.find(t => t.id === activeTooltip)?.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DemoBooking;