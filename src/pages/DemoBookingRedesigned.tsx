import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Clock, Users, CheckCircle, 
  ChevronRight, Star, MapPin, Phone, Mail,
  ArrowRight, Sparkles, CreditCard, Coffee,
  Scissors, Car, Heart, ChevronLeft, Check
} from 'lucide-react';
import { useLanguage } from '../providers/LanguageProvider';

const DemoBookingRedesigned: React.FC = () => {
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const services = [
    {
      id: 'restaurant',
      icon: Coffee,
      name: 'Restaurant Table',
      duration: '2 hours',
      price: 'Free',
      color: 'from-orange-500 to-red-500',
      description: 'Book a table at your favorite restaurant'
    },
    {
      id: 'salon',
      icon: Scissors,
      name: 'Hair Salon',
      duration: '1 hour',
      price: '€50',
      color: 'from-pink-500 to-purple-500',
      description: 'Professional haircut and styling'
    },
    {
      id: 'automotive',
      icon: Car,
      name: 'Car Service',
      duration: '3 hours',
      price: '€120',
      color: 'from-blue-500 to-cyan-500',
      description: 'Complete vehicle maintenance'
    },
    {
      id: 'medical',
      icon: Heart,
      name: 'Medical Checkup',
      duration: '45 min',
      price: '€80',
      color: 'from-green-500 to-emerald-500',
      description: 'General health examination'
    }
  ];

  // Generate next 14 days
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        date: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('en', { weekday: 'short' }),
        dayNum: date.getDate(),
        month: date.toLocaleDateString('en', { month: 'short' }),
        isWeekend: date.getDay() === 0 || date.getDay() === 6
      });
    }
    return dates;
  };

  const dates = generateDates();

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
  ];

  const handleBooking = () => {
    // Create booking
    const booking = {
      service: selectedService,
      date: selectedDate,
      time: selectedTime,
      customer: customerInfo,
      timestamp: new Date().toISOString()
    };

    // Dispatch event for booking widget
    window.dispatchEvent(new CustomEvent('demoBookingCreated', { 
      detail: {
        customerName: customerInfo.name,
        service: services.find(s => s.id === selectedService)?.name,
        date: selectedDate,
        time: selectedTime
      }
    }));

    // Show success
    setStep(5);
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        // Service Selection
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {t('demo.booking.selectService')}
              </h2>
              <p className="text-gray-400">
                Choose the service you'd like to book
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <motion.button
                    key={service.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedService(service.id);
                      setStep(2);
                    }}
                    className={`relative p-6 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl border-2 transition-all duration-300 text-left group ${
                      selectedService === service.id 
                        ? 'border-purple-500 shadow-lg shadow-purple-500/20' 
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${service.color} opacity-10 rounded-2xl`} />
                    
                    <div className="relative">
                      <div className={`inline-flex p-3 bg-gradient-to-r ${service.color} rounded-xl mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      
                      <h3 className="text-xl font-semibold text-white mb-1">
                        {service.name}
                      </h3>
                      <p className="text-gray-400 text-sm mb-3">
                        {service.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-gray-300 flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {service.duration}
                          </span>
                          <span className="text-purple-400 font-semibold">
                            {service.price}
                          </span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        );

      case 2:
        // Date Selection
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  {t('demo.booking.selectDate')}
                </h2>
                <p className="text-gray-400">
                  When would you like to book?
                </p>
              </div>
              <button
                onClick={() => setStep(1)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-3">
              {dates.map((date) => (
                <motion.button
                  key={date.date}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedDate(date.date);
                    setStep(3);
                  }}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    selectedDate === date.date
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 border-transparent text-white'
                      : date.isWeekend
                      ? 'bg-orange-500/10 border-orange-500/30 hover:border-orange-500/50 text-orange-400'
                      : 'bg-white/5 border-white/10 hover:border-white/30 text-white'
                  }`}
                >
                  <div className="text-xs opacity-70 mb-1">{date.day}</div>
                  <div className="text-2xl font-bold">{date.dayNum}</div>
                  <div className="text-xs opacity-70">{date.month}</div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        );

      case 3:
        // Time Selection
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  {t('demo.booking.selectTime')}
                </h2>
                <p className="text-gray-400">
                  Available time slots for {selectedDate}
                </p>
              </div>
              <button
                onClick={() => setStep(2)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {timeSlots.map((time) => {
                const isLunch = time >= '12:00' && time < '14:00';
                const isBooked = Math.random() > 0.7; // Simulate some booked slots
                
                return (
                  <motion.button
                    key={time}
                    whileHover={{ scale: isBooked || isLunch ? 1 : 1.05 }}
                    whileTap={{ scale: isBooked || isLunch ? 1 : 0.95 }}
                    onClick={() => {
                      if (!isBooked && !isLunch) {
                        setSelectedTime(time);
                        setStep(4);
                      }
                    }}
                    disabled={isBooked || isLunch}
                    className={`py-3 px-4 rounded-xl border-2 transition-all duration-300 font-medium ${
                      selectedTime === time
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 border-transparent text-white'
                        : isBooked
                        ? 'bg-red-500/10 border-red-500/20 text-red-400/50 cursor-not-allowed'
                        : isLunch
                        ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400/50 cursor-not-allowed'
                        : 'bg-white/5 border-white/10 hover:border-white/30 text-white'
                    }`}
                  >
                    {time}
                    {isLunch && <span className="block text-xs mt-1">Lunch</span>}
                    {isBooked && <span className="block text-xs mt-1">Booked</span>}
                  </motion.button>
                );
              })}
            </div>

            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-white/20 rounded" />
                <span className="text-gray-400">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500/20 rounded" />
                <span className="text-gray-400">Mittagspause</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500/20 rounded" />
                <span className="text-gray-400">Booked</span>
              </div>
            </div>
          </motion.div>
        );

      case 4:
        // Customer Information
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Your Information
                </h2>
                <p className="text-gray-400">
                  Please provide your contact details
                </p>
              </div>
              <button
                onClick={() => setStep(3)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                  placeholder="+49 123 456 7890"
                />
              </div>
            </div>

            {/* Booking Summary */}
            <div className="bg-gradient-to-br from-purple-600/10 to-blue-600/10 rounded-xl p-6 border border-purple-500/20">
              <h3 className="text-lg font-semibold text-white mb-4">Booking Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Service:</span>
                  <span className="text-white">
                    {services.find(s => s.id === selectedService)?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Date:</span>
                  <span className="text-white">{selectedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Time:</span>
                  <span className="text-white">{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Duration:</span>
                  <span className="text-white">
                    {services.find(s => s.id === selectedService)?.duration}
                  </span>
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between">
                  <span className="text-gray-400">Total:</span>
                  <span className="text-xl font-bold text-white">
                    {services.find(s => s.id === selectedService)?.price}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleBooking}
              disabled={!customerInfo.name || !customerInfo.email}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <CheckCircle className="h-5 w-5" />
              {t('demo.booking.confirm')}
            </button>
          </motion.div>
        );

      case 5:
        // Success
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex p-6 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full mb-6"
            >
              <Check className="h-12 w-12 text-white" />
            </motion.div>
            
            <h2 className="text-3xl font-bold text-white mb-4">
              {t('demo.booking.success')}
            </h2>
            <p className="text-gray-400 mb-8">
              {t('demo.booking.successMessage')}
            </p>

            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10 text-left max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-white mb-4">Booking Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Booking ID:</span>
                  <span className="text-white font-mono">#{Date.now().toString(36).toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Service:</span>
                  <span className="text-white">
                    {services.find(s => s.id === selectedService)?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Date & Time:</span>
                  <span className="text-white">{selectedDate} at {selectedTime}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setStep(1);
                setSelectedService(null);
                setSelectedDate(null);
                setSelectedTime(null);
                setCustomerInfo({ name: '', email: '', phone: '' });
              }}
              className="mt-8 px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
            >
              Book Another Appointment
            </button>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 pt-16">
      {/* Hero Section */}
      <section className="relative py-12 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-xl rounded-2xl border border-white/10 mb-6">
              <Sparkles className="h-8 w-8 text-purple-400" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {t('demo.booking.title')}
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t('demo.booking.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto px-4 mb-8">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                step > s 
                  ? 'bg-green-500 text-white' 
                  : step === s 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25' 
                  : 'bg-white/10 text-gray-400'
              }`}>
                {step > s ? <Check className="h-5 w-5" /> : s}
              </div>
              {s < 4 && (
                <div className={`w-full h-1 mx-2 transition-all duration-300 ${
                  step > s ? 'bg-green-500' : 'bg-white/10'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm text-gray-400">
          <span>Service</span>
          <span>Date</span>
          <span>Time</span>
          <span>Details</span>
        </div>
      </div>

      {/* Booking Form */}
      <div className="max-w-4xl mx-auto px-4 pb-20">
        <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-3xl border border-white/10 p-8">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default DemoBookingRedesigned;