import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Clock, User, Mail, Phone, ChevronLeft, ChevronRight,
  Check, Loader, Coffee, Sparkles, Zap, Users
} from 'lucide-react';
import { useLanguage } from '../providers/LanguageProvider';

interface BookingDemoUltraProps {
  onClose?: () => void;
}

const BookingDemoUltra: React.FC<BookingDemoUltraProps> = ({ onClose }) => {
  const { language } = useLanguage();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingId, setBookingId] = useState('');

  // Booking data
  const [bookingData, setBookingData] = useState({
    service: '',
    date: '',
    time: '',
    name: '',
    email: '',
    phone: ''
  });

  // Simple services
  const services = [
    {
      id: 'consultation',
      name: language === 'de' ? 'KI-Beratung' : 'AI Consultation',
      description: language === 'de'
        ? 'Kostenlose Strategieberatung'
        : 'Free strategy consultation',
      duration: '60 min',
      icon: Sparkles
    },
    {
      id: 'booking-setup',
      name: language === 'de' ? 'Buchungssystem Setup' : 'Booking System Setup',
      description: language === 'de'
        ? 'Installation und Konfiguration'
        : 'Installation and configuration',
      duration: '120 min',
      icon: Calendar
    },
    {
      id: 'automation',
      name: language === 'de' ? 'Automatisierung' : 'Automation',
      description: language === 'de'
        ? 'Prozessautomatisierung'
        : 'Process automation',
      duration: '90 min',
      icon: Zap
    },
    {
      id: 'training',
      name: language === 'de' ? 'Schulung' : 'Training',
      description: language === 'de'
        ? 'Team-Training'
        : 'Team training',
      duration: '180 min',
      icon: Users
    }
  ];

  // Simple time slots
  const timeSlots = [
    '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'
  ];

  // Generate next 7 days
  const generateDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const dates = generateDates();

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    };
    return date.toLocaleDateString(language === 'de' ? 'de-DE' : 'en-US', options);
  };

  const handleNextStep = () => {
    if (step === 1 && !bookingData.service) return;
    if (step === 2 && (!bookingData.date || !bookingData.time)) return;
    if (step === 3 && (!bookingData.name || !bookingData.email || !bookingData.phone)) return;

    if (step === 3) {
      handleBookingSubmit();
    } else {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleBookingSubmit = async () => {
    setLoading(true);

    // Simulate booking submission
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate booking ID
    const id = 'EA' + Math.random().toString(36).substr(2, 9).toUpperCase();
    setBookingId(id);
    setBookingComplete(true);
    setLoading(false);
    setStep(4);
  };

  const selectedService = services.find(s => s.id === bookingData.service);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex items-center ${s < 3 ? 'flex-1' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step >= s
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'bg-white/10 text-gray-400'
                }`}
              >
                {bookingComplete && s <= 3 ? <Check className="h-4 w-4" /> : s}
              </div>
              {s < 3 && (
                <div
                  className={`flex-1 h-1 mx-2 transition-all ${
                    step > s ? 'bg-gradient-to-r from-purple-600 to-blue-600' : 'bg-white/10'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-400">
          <span>{language === 'de' ? 'Service' : 'Service'}</span>
          <span>{language === 'de' ? 'Zeit' : 'Time'}</span>
          <span>{language === 'de' ? 'Kontakt' : 'Contact'}</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Service Selection */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">
                {language === 'de' ? 'Service wählen' : 'Choose Service'}
              </h2>
              <p className="text-gray-400">
                {language === 'de'
                  ? 'Wählen Sie den gewünschten Service'
                  : 'Select your desired service'}
              </p>
            </div>

            <div className="grid gap-3">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <button
                    key={service.id}
                    onClick={() => setBookingData({ ...bookingData, service: service.id })}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      bookingData.service === service.id
                        ? 'border-purple-600 bg-purple-600/10'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${
                        bookingData.service === service.id
                          ? 'bg-purple-600'
                          : 'bg-white/10'
                      }`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-1">{service.name}</h3>
                        <p className="text-sm text-gray-400 mb-1">{service.description}</p>
                        <p className="text-xs text-gray-500">{service.duration}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleNextStep}
                disabled={!bookingData.service}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {language === 'de' ? 'Weiter' : 'Continue'}
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Date & Time Selection */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">
                {language === 'de' ? 'Datum & Zeit' : 'Date & Time'}
              </h2>
              <p className="text-gray-400">
                {selectedService?.name}
              </p>
            </div>

            {/* Date Selection */}
            <div>
              <h3 className="text-sm font-semibold text-gray-300 mb-3">
                {language === 'de' ? 'Datum wählen' : 'Select Date'}
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {dates.map((date, index) => (
                  <button
                    key={index}
                    onClick={() => setBookingData({ ...bookingData, date: date.toISOString() })}
                    className={`p-3 rounded-lg text-center transition-all ${
                      bookingData.date === date.toISOString()
                        ? 'bg-purple-600 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    <div className="text-xs font-semibold">{formatDate(date)}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            <div>
              <h3 className="text-sm font-semibold text-gray-300 mb-3">
                {language === 'de' ? 'Zeit wählen' : 'Select Time'}
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {timeSlots.map((time) => {
                  const isAvailable = Math.random() > 0.3; // Simulate availability
                  return (
                    <button
                      key={time}
                      onClick={() => isAvailable && setBookingData({ ...bookingData, time })}
                      disabled={!isAvailable}
                      className={`p-3 rounded-lg transition-all ${
                        bookingData.time === time
                          ? 'bg-purple-600 text-white'
                          : isAvailable
                          ? 'bg-white/10 text-gray-300 hover:bg-white/20'
                          : 'bg-white/5 text-gray-600 cursor-not-allowed'
                      }`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handlePrevStep}
                className="flex-1 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all flex items-center justify-center gap-2"
              >
                <ChevronLeft className="h-5 w-5" />
                {language === 'de' ? 'Zurück' : 'Back'}
              </button>
              <button
                onClick={handleNextStep}
                disabled={!bookingData.date || !bookingData.time}
                className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {language === 'de' ? 'Weiter' : 'Continue'}
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Contact Information */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">
                {language === 'de' ? 'Kontaktdaten' : 'Contact Information'}
              </h2>
              <p className="text-gray-400">
                {language === 'de'
                  ? 'Bitte geben Sie Ihre Kontaktdaten ein'
                  : 'Please enter your contact details'}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <User className="inline h-4 w-4 mr-1" />
                  {language === 'de' ? 'Name' : 'Name'}
                </label>
                <input
                  type="text"
                  value={bookingData.name}
                  onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                  placeholder={language === 'de' ? 'Max Mustermann' : 'John Doe'}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Mail className="inline h-4 w-4 mr-1" />
                  {language === 'de' ? 'E-Mail' : 'Email'}
                </label>
                <input
                  type="email"
                  value={bookingData.email}
                  onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                  placeholder={language === 'de' ? 'max@beispiel.de' : 'john@example.com'}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Phone className="inline h-4 w-4 mr-1" />
                  {language === 'de' ? 'Telefon' : 'Phone'}
                </label>
                <input
                  type="tel"
                  value={bookingData.phone}
                  onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                  placeholder={language === 'de' ? '+49 123 456789' : '+1 234 567 8900'}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-600"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handlePrevStep}
                className="flex-1 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all flex items-center justify-center gap-2"
              >
                <ChevronLeft className="h-5 w-5" />
                {language === 'de' ? 'Zurück' : 'Back'}
              </button>
              <button
                onClick={handleBookingSubmit}
                disabled={!bookingData.name || !bookingData.email || !bookingData.phone || loading}
                className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    {language === 'de' ? 'Wird gebucht...' : 'Booking...'}
                  </>
                ) : (
                  <>
                    {language === 'de' ? 'Buchung bestätigen' : 'Confirm Booking'}
                    <Check className="h-5 w-5" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && bookingComplete && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full mx-auto"
            >
              <Check className="h-10 w-10 text-white" />
            </motion.div>

            <div>
              <h3 className="text-3xl font-bold text-white mb-2">
                {language === 'de' ? 'Buchung bestätigt!' : 'Booking Confirmed!'}
              </h3>
              <p className="text-gray-300 text-lg mb-2">
                {language === 'de'
                  ? 'Sie erhalten in Kürze eine SMS-Erinnerung'
                  : 'You will receive an SMS reminder shortly'}
              </p>
              <p className="text-gray-400">
                {language === 'de' ? 'Buchungsnummer:' : 'Booking ID:'} <span className="text-purple-400 font-mono">#{bookingId}</span>
              </p>
            </div>

            {/* Booking Details */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 text-left max-w-md mx-auto">
              <h4 className="text-lg font-bold text-white mb-4">
                {language === 'de' ? 'Buchungsdetails' : 'Booking Details'}
              </h4>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">{language === 'de' ? 'Service:' : 'Service:'}</span>
                  <span className="text-white">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">{language === 'de' ? 'Datum:' : 'Date:'}</span>
                  <span className="text-white">{bookingData.date && formatDate(new Date(bookingData.date))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">{language === 'de' ? 'Zeit:' : 'Time:'}</span>
                  <span className="text-white">{bookingData.time}</span>
                </div>
                <div className="border-t border-white/10 pt-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">{language === 'de' ? 'Name:' : 'Name:'}</span>
                    <span className="text-white">{bookingData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{language === 'de' ? 'Telefon:' : 'Phone:'}</span>
                    <span className="text-white">{bookingData.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setStep(1);
                setBookingData({
                  service: '',
                  date: '',
                  time: '',
                  name: '',
                  email: '',
                  phone: ''
                });
                setBookingComplete(false);
                if (onClose) onClose();
              }}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              {language === 'de' ? 'Neue Buchung' : 'New Booking'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookingDemoUltra;