import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Building, User, Mail, FileText, Check, AlertCircle, Loader, TrendingUp, Users, Sparkles, ChevronRight, Phone, Timer, Star, Award, Zap } from 'lucide-react';
import { useLanguage } from '../../providers/LanguageProvider';

interface BookingFormData {
  service: string;
  date: string;
  time: string;
  company: string;
  name: string;
  email: string;
  phone: string;
  requirements: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
  popular?: boolean;
  discountAvailable?: boolean;
}

interface BookingResponse {
  success: boolean;
  bookingId: string;
  confirmationMessage: string;
  preparationChecklist: string[];
  estimatedDuration: string;
  followUpActions: string[];
  valueProposition: string;
  estimatedCost: string;
  savings: string;
  realTimeMetrics: {
    slotsBookedToday: number;
    satisfactionRate: number;
    averageResponseTime: string;
    upcomingAvailability: number;
  };
}

const BookingDemoEnhanced: React.FC = () => {
  const { language } = useLanguage();
  const [formData, setFormData] = useState<BookingFormData>({
    service: '',
    date: '',
    time: '',
    company: '',
    name: '',
    email: '',
    phone: '',
    requirements: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingResponse, setBookingResponse] = useState<BookingResponse | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [liveBookingCount, setLiveBookingCount] = useState(Math.floor(Math.random() * 5) + 12);
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);
  const [selectedSlotAnimation, setSelectedSlotAnimation] = useState(false);
  const [realTimeBookings, setRealTimeBookings] = useState<string[]>([]);
  const [recommendedSlot, setRecommendedSlot] = useState<string | null>(null);

  const services = {
    en: [
      'Enterprise AI Integration',
      'Smart Living Consultation', 
      'KFC-Style Automation Setup',
      'Local AI Privacy Solution',
      'Digital Transformation Strategy'
    ],
    de: [
      'Enterprise KI-Integration',
      'Smart Living Beratung',
      'KFC-Style Automatisierung',
      'Lokale KI-Datenschutz Lösung',
      'Digitale Transformationsstrategie'
    ],
    ar: [
      'تكامل الذكاء الاصطناعي للمؤسسات',
      'استشارة المعيشة الذكية',
      'إعداد أتمتة بنمط KFC',
      'حل خصوصية الذكاء الاصطناعي المحلي',
      'استراتيجية التحول الرقمي'
    ]
  };

  const labels = {
    en: {
      title: 'Book Your EA-S Demo',
      subtitle: 'Experience the same AI technology powering KFC globally',
      service: 'Select Service',
      date: 'Choose Date',
      time: 'Select Time Slot',
      company: 'Company Name',
      name: 'Your Name',
      email: 'Business Email',
      phone: 'Phone Number',
      requirements: 'Tell us your goals',
      submit: 'Confirm Booking',
      processing: 'Securing your slot...',
      confirmation: 'Demo Booked!',
      confirmationText: 'Your EA-S demonstration has been successfully scheduled.',
      newRequest: 'Book Another Demo',
      step1: 'Service & Date',
      step2: 'Contact Details',
      step3: 'Confirmation',
      available: 'Available',
      popular: 'Popular',
      recommended: 'AI Recommended',
      loadingSlots: 'Finding best times...',
      liveUpdate: 'demos booked today',
    },
    de: {
      title: 'EA-S Demo buchen',
      subtitle: 'Erleben Sie dieselbe KI-Technologie, die KFC weltweit antreibt',
      service: 'Service auswählen',
      date: 'Datum wählen',
      time: 'Zeitslot auswählen',
      company: 'Firmenname',
      name: 'Ihr Name',
      email: 'Geschäftliche E-Mail',
      phone: 'Telefonnummer',
      requirements: 'Erzählen Sie uns Ihre Ziele',
      submit: 'Buchung bestätigen',
      processing: 'Ihr Slot wird gesichert...',
      confirmation: 'Demo gebucht!',
      confirmationText: 'Ihre EA-S Demonstration wurde erfolgreich geplant.',
      newRequest: 'Weitere Demo buchen',
      step1: 'Service & Datum',
      step2: 'Kontaktdaten',
      step3: 'Bestätigung',
      available: 'Verfügbar',
      popular: 'Beliebt',
      recommended: 'KI-Empfohlen',
      loadingSlots: 'Beste Zeiten finden...',
      liveUpdate: 'Demos heute gebucht',
    },
    ar: {
      title: 'احجز عرض EA-S التوضيحي',
      subtitle: 'اختبر نفس تكنولوجيا الذكاء الاصطناعي التي تشغل KFC عالمياً',
      service: 'اختر الخدمة',
      date: 'اختر التاريخ',
      time: 'اختر الوقت',
      company: 'اسم الشركة',
      name: 'اسمك',
      email: 'البريد الإلكتروني للعمل',
      phone: 'رقم الهاتف',
      requirements: 'أخبرنا عن أهدافك',
      submit: 'تأكيد الحجز',
      processing: 'جاري تأمين موعدك...',
      confirmation: 'تم حجز العرض!',
      confirmationText: 'تم جدولة عرض EA-S التوضيحي بنجاح.',
      newRequest: 'حجز عرض آخر',
      step1: 'الخدمة والتاريخ',
      step2: 'بيانات الاتصال',
      step3: 'التأكيد',
      available: 'متاح',
      popular: 'شائع',
      recommended: 'موصى به بالذكاء الاصطناعي',
      loadingSlots: 'البحث عن أفضل الأوقات...',
      liveUpdate: 'عروض محجوزة اليوم',
    }
  };

  const t = labels[language as keyof typeof labels];

  // Enhanced real-time booking updates with animations
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveBookingCount(prev => {
        const change = Math.random() > 0.6 ? 1 : 0;
        if (change > 0) {
          const cities = ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'London', 'Paris'];
          const randomCity = cities[Math.floor(Math.random() * cities.length)];
          const newBooking = `${randomCity}: EA-S demo booked`;
          setRealTimeBookings(prev => [newBooking, ...prev.slice(0, 2)]);
        }
        return prev + change;
      });
    }, 7000);
    
    return () => clearInterval(interval);
  }, []);

  // Clear real-time bookings after display
  useEffect(() => {
    if (realTimeBookings.length > 0) {
      const timer = setTimeout(() => {
        setRealTimeBookings(prev => prev.slice(1));
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [realTimeBookings]);

  // Fetch available slots when date changes
  useEffect(() => {
    if (formData.date) {
      fetchAvailableSlots(formData.date);
    }
  }, [formData.date]);

  const fetchAvailableSlots = async (date: string) => {
    setIsLoadingSlots(true);
    setAvailableSlots([]);
    setRecommendedSlot(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1200)); // Simulate API call
      
      const slots = [
        { time: '09:00', available: true, popular: false },
        { time: '10:00', available: true, popular: true },
        { time: '11:00', available: false, popular: true },
        { time: '14:00', available: true, popular: false },
        { time: '15:00', available: true, popular: false },
        { time: '16:00', available: false, popular: true },
        { time: '17:00', available: true, popular: false }
      ];
      
      setAvailableSlots(slots);
      setRecommendedSlot('14:00');
    } catch (error) {
      console.error('Error fetching slots:', error);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      const mockResponse: BookingResponse = {
        success: true,
        bookingId: `EAS-${Date.now()}`,
        confirmationMessage: "Your EA-S demonstration has been successfully booked. We'll showcase the same technology powering KFC globally.",
        preparationChecklist: [
          "Brief overview of your current challenges",
          "List of automation goals",
          "Questions about KFC partnership",
          "Smart Living requirements (if applicable)"
        ],
        estimatedDuration: "45 minutes",
        followUpActions: [
          "Detailed proposal within 24 hours",
          "Custom implementation roadmap"
        ],
        valueProposition: "Experience the AI technology trusted by KFC for 1M+ daily transactions, now available for your business and home.",
        estimatedCost: "Free consultation",
        savings: "Potential ROI: 300% in first year",
        realTimeMetrics: {
          slotsBookedToday: liveBookingCount,
          satisfactionRate: 98,
          averageResponseTime: "< 1 hour",
          upcomingAvailability: 15
        }
      };
      
      setBookingResponse(mockResponse);
      setShowConfirmation(true);
      setCurrentStep(3);
    } catch (error) {
      console.error('Booking error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewRequest = () => {
    setShowConfirmation(false);
    setFormData({
      service: '',
      date: '',
      time: '',
      company: '',
      name: '',
      email: '',
      phone: '',
      requirements: ''
    });
    setCurrentStep(1);
    setBookingResponse(null);
  };

  const getStepClass = (step: number) => {
    if (step < currentStep) return 'bg-green-500 text-white border-green-500';
    if (step === currentStep) return 'bg-gradient-to-r from-purple-600 to-blue-600 text-white border-purple-500';
    return 'bg-gray-600/20 text-gray-400 border-gray-600';
  };

  // Confirmation Screen
  if (showConfirmation && bookingResponse) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-gradient-to-br from-gray-900 via-purple-900/20 to-blue-900/20 backdrop-blur-xl rounded-2xl border border-white/10 p-8 max-w-4xl mx-auto shadow-2xl"
      >
        <div className="text-center mb-8">
          <motion.div 
            className="relative inline-block mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5, type: "spring", stiffness: 200 }}
          >
            <motion.div 
              className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-green-500/50"
              animate={{ 
                boxShadow: [
                  "0 0 20px rgba(34, 197, 94, 0.5)",
                  "0 0 30px rgba(34, 197, 94, 0.8)",
                  "0 0 20px rgba(34, 197, 94, 0.5)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Check className="w-10 h-10 text-white" />
            </motion.div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-2 -right-2" />
            </motion.div>
          </motion.div>
          <motion.h3 
            className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {t.confirmation}
          </motion.h3>
          <motion.p 
            className="text-lg text-gray-300 mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {bookingResponse.confirmationMessage}
          </motion.p>
          <motion.p 
            className="text-sm text-blue-400 font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Booking ID: {bookingResponse.bookingId}
          </motion.p>
        </div>

        {/* Real-time metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Users, value: bookingResponse.realTimeMetrics.slotsBookedToday, label: t.liveUpdate, color: "from-blue-500/20 to-blue-600/20", iconColor: "text-blue-400" },
            { icon: Star, value: `${bookingResponse.realTimeMetrics.satisfactionRate}%`, label: "Satisfaction", color: "from-green-500/20 to-green-600/20", iconColor: "text-green-400" },
            { icon: Timer, value: bookingResponse.realTimeMetrics.averageResponseTime, label: "Response", color: "from-purple-500/20 to-purple-600/20", iconColor: "text-purple-400" },
            { icon: Calendar, value: bookingResponse.realTimeMetrics.upcomingAvailability, label: "Available", color: "from-orange-500/20 to-orange-600/20", iconColor: "text-orange-400" }
          ].map((metric, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className={`bg-gradient-to-br ${metric.color} backdrop-blur-sm rounded-xl p-4 text-center border border-white/10 hover:border-white/20 transition-colors`}
            >
              <metric.icon className={`w-6 h-6 ${metric.iconColor} mx-auto mb-2`} />
              <motion.p 
                className="text-2xl font-bold text-white"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1 + index * 0.1, type: "spring" }}
              >
                {metric.value}
              </motion.p>
              <p className="text-xs text-gray-400">{metric.label}</p>
            </motion.div>
          ))}
        </div>

        <motion.button
          onClick={handleNewRequest}
          className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-purple-500/25"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          {t.newRequest}
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="bg-gradient-to-br from-gray-900 via-purple-900/20 to-blue-900/20 backdrop-blur-xl rounded-2xl border border-white/10 p-8 max-w-4xl mx-auto shadow-2xl relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header with live counter */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <motion.h2 
              className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {t.title}
            </motion.h2>
            <motion.p 
              className="text-gray-400 mt-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              {t.subtitle}
            </motion.p>
          </div>
          <motion.div 
            className="text-center"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div 
              className="bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-xl px-4 py-2 shadow-lg shadow-purple-500/25 border border-purple-400/30"
              animate={{ 
                boxShadow: [
                  "0 0 20px rgba(147, 51, 234, 0.25)",
                  "0 0 30px rgba(147, 51, 234, 0.4)",
                  "0 0 20px rgba(147, 51, 234, 0.25)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <motion.p 
                className="text-2xl font-bold"
                animate={{ 
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {liveBookingCount}
              </motion.p>
              <p className="text-xs opacity-90">{t.liveUpdate}</p>
            </motion.div>
          </motion.div>
        </div>

        {/* Progress Steps */}
        <motion.div 
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex-1 flex items-center">
              <motion.div 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500 border-2 ${getStepClass(step)}`}
                whileHover={{ scale: 1.1 }}
                animate={step === currentStep ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 1, repeat: step === currentStep ? Infinity : 0 }}
              >
                {step < currentStep ? <Check className="w-5 h-5" /> : step}
              </motion.div>
              {step < 3 && (
                <motion.div 
                  className={`flex-1 h-1 mx-2 transition-all duration-500 ${
                    step < currentStep ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gray-600/30'
                  }`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: step < currentStep ? 1 : 0.3 }}
                  transition={{ duration: 0.8 }}
                />
              )}
            </div>
          ))}
        </motion.div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Service & Date */}
        {currentStep === 1 && (
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.4 }}
          >
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Building className="inline w-4 h-4 mr-1" />
                {t.service}
              </label>
              <select
                required
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
              >
                <option value="" className="bg-gray-800 text-gray-200">Select a service...</option>
                {services[language as keyof typeof services].map((service) => (
                  <option key={service} value={service} className="bg-gray-800 text-gray-200">
                    {service}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Calendar className="inline w-4 h-4 mr-1" />
                {t.date}
              </label>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value, time: '' })}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
              />
            </div>

            {/* Time Slot Selection with Animations */}
            {formData.date && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Clock className="inline w-4 h-4 mr-1" />
                  {t.time}
                </label>
                
                {isLoadingSlots ? (
                  <motion.div 
                    className="text-center py-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Loader className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-2" />
                    <p className="text-sm text-gray-400">{t.loadingSlots}</p>
                  </motion.div>
                ) : (
                  <motion.div 
                    className="grid grid-cols-3 md:grid-cols-4 gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {availableSlots.map((slot, index) => (
                      <motion.button
                        key={slot.time}
                        type="button"
                        disabled={!slot.available}
                        onClick={() => {
                          setFormData({ ...formData, time: slot.time });
                          setSelectedSlotAnimation(true);
                          setTimeout(() => setSelectedSlotAnimation(false), 600);
                        }}
                        onHoverStart={() => setHoveredSlot(slot.time)}
                        onHoverEnd={() => setHoveredSlot(null)}
                        className={`
                          relative p-3 rounded-xl border-2 transition-all duration-300 backdrop-blur-sm
                          ${!slot.available 
                            ? 'bg-gray-500/10 border-gray-600/30 text-gray-500 cursor-not-allowed' 
                            : formData.time === slot.time
                              ? 'bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-purple-400 text-white shadow-2xl shadow-purple-500/25'
                              : 'bg-white/5 border-white/20 text-gray-300 hover:border-purple-400/50 hover:bg-white/10'
                          }
                        `}
                        whileHover={{ scale: slot.available ? 1.05 : 1 }}
                        whileTap={{ scale: slot.available ? 0.95 : 1 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <motion.p 
                          className="font-semibold text-lg"
                          animate={formData.time === slot.time && selectedSlotAnimation ? {
                            scale: [1, 1.2, 1],
                            color: ['#ffffff', '#f59e0b', '#ffffff']
                          } : {}}
                          transition={{ duration: 0.6 }}
                        >
                          {slot.time}
                        </motion.p>
                        <p className="text-xs mt-1 opacity-80">
                          {slot.available ? t.available : 'Booked'}
                        </p>
                        {hoveredSlot === slot.time && slot.available && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl border border-purple-400/50 backdrop-blur-sm"
                          />
                        )}
                        {recommendedSlot === slot.time && slot.available && (
                          <motion.div 
                            className="absolute -bottom-6 left-0 right-0 text-center"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                          >
                            <motion.span 
                              className="text-xs bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent font-semibold flex items-center justify-center"
                              animate={{ 
                                scale: [1, 1.05, 1]
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <Award className="w-3 h-3 mr-1 text-yellow-400" />
                              {t.recommended}
                            </motion.span>
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </div>
            )}

            <div className="flex justify-end">
              <motion.button
                type="button"
                disabled={!formData.service || !formData.date || !formData.time}
                onClick={() => setCurrentStep(2)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-200 flex items-center shadow-lg hover:shadow-purple-500/25"
                whileHover={{ scale: formData.service && formData.date && formData.time ? 1.02 : 1 }}
                whileTap={{ scale: formData.service && formData.date && formData.time ? 0.98 : 1 }}
              >
                Continue
                <ChevronRight className="w-4 h-4 ml-2" />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Contact Details */}
        {currentStep === 2 && (
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.4 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Building className="inline w-4 h-4 mr-1" />
                  {t.company}
                </label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                  placeholder="Your Company Ltd."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <User className="inline w-4 h-4 mr-1" />
                  {t.name}
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                  placeholder="John Smith"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Mail className="inline w-4 h-4 mr-1" />
                  {t.email}
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                  placeholder="john@company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Phone className="inline w-4 h-4 mr-1" />
                  {t.phone}
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                  placeholder="+1 234 567 8900"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <FileText className="inline w-4 h-4 mr-1" />
                {t.requirements}
              </label>
              <textarea
                rows={4}
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                placeholder="Tell us about your automation goals, whether you're interested in enterprise solutions like KFC uses, or Smart Living for your home..."
              />
            </div>

            <div className="flex justify-between">
              <motion.button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-6 py-3 bg-white/10 backdrop-blur-sm text-gray-300 rounded-xl hover:bg-white/20 transition-all duration-200 border border-white/20"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Back
              </motion.button>
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-200 flex items-center shadow-lg hover:shadow-purple-500/25"
                whileHover={{ scale: !isSubmitting ? 1.02 : 1 }}
                whileTap={{ scale: !isSubmitting ? 0.98 : 1 }}
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="mr-2"
                    >
                      <Loader className="w-4 h-4" />
                    </motion.div>
                    {t.processing}
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    {t.submit}
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </form>

      {/* Real-time booking notifications */}
      <AnimatePresence>
        {realTimeBookings.map((booking, index) => (
          <motion.div
            key={booking + index}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -300, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="fixed top-4 right-4 bg-gradient-to-r from-green-500/90 to-emerald-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-xl shadow-2xl z-50 border border-green-400/30"
          >
            <div className="flex items-center gap-2">
              <motion.div 
                className="w-2 h-2 bg-green-300 rounded-full"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <span className="text-sm font-medium">{booking}</span>
              <Sparkles className="w-4 h-4 text-green-200" />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default BookingDemoEnhanced;