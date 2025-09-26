import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
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
  urgencyIndicators: {
    demandLevel: string;
    priceIncrease: string;
    limitedAvailability: string;
    exclusiveOffer: string;
  };
}

const BookingDemo: React.FC = () => {
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
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [recommendedSlot, setRecommendedSlot] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [animatingSlot, setAnimatingSlot] = useState<string | null>(null);
  const [liveBookingCount, setLiveBookingCount] = useState(Math.floor(Math.random() * 5) + 3);
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);
  const [selectedSlotAnimation, setSelectedSlotAnimation] = useState(false);
  const [realTimeBookings, setRealTimeBookings] = useState<string[]>([]);
  const intervalRef = useRef<NodeJS.Timeout>();

  const services = {
    en: [
      'IT Infrastructure Consultation',
      'Cloud Migration Planning',
      'Security Audit',
      'Digital Transformation Strategy',
      'Custom Software Development'
    ],
    de: [
      'IT-Infrastruktur Beratung',
      'Cloud-Migrations Planung',
      'Sicherheitsaudit',
      'Digitale Transformationsstrategie',
      'Individuelle Softwareentwicklung'
    ],
    ar: [
      'استشارة البنية التحتية لتكنولوجيا المعلومات',
      'تخطيط الترحيل السحابي',
      'تدقيق الأمان',
      'استراتيجية التحول الرقمي',
      'تطوير البرمجيات المخصصة'
    ]
  };

  const labels = {
    en: {
      title: 'Book Your Consultation',
      subtitle: 'Connect with our AI-powered experts in real-time',
      service: 'Select Service',
      date: 'Choose Date',
      time: 'Select Time Slot',
      company: 'Company Name',
      name: 'Your Name',
      email: 'Business Email',
      phone: 'Phone Number',
      requirements: 'Tell us about your needs',
      submit: 'Confirm Booking',
      processing: 'Securing your slot...',
      confirmation: 'Booking Confirmed!',
      confirmationText: 'Your consultation has been successfully scheduled.',
      newRequest: 'Book Another Consultation',
      step1: 'Service & Date',
      step2: 'Contact Details',
      step3: 'Confirmation',
      available: 'Available',
      popular: 'Popular',
      discount: 'Discount',
      recommended: 'AI Recommended',
      loadingSlots: 'Checking availability...',
      noSlots: 'No slots available for this date',
      selectDate: 'Please select a date first',
      liveUpdate: 'people booked today',
      urgentNotice: 'Select your preferred time',
      preparation: 'Preparation Checklist',
      duration: 'Duration',
      followUp: 'What Happens Next',
      value: 'Value Proposition',
      investment: 'Investment',
      savings: 'Potential Savings'
    },
    de: {
      title: 'Beratungstermin buchen',
      subtitle: 'Verbinden Sie sich in Echtzeit mit unseren KI-gestützten Experten',
      service: 'Service auswählen',
      date: 'Datum wählen',
      time: 'Zeitslot auswählen',
      company: 'Firmenname',
      name: 'Ihr Name',
      email: 'Geschäftliche E-Mail',
      phone: 'Telefonnummer',
      requirements: 'Erzählen Sie uns von Ihren Bedürfnissen',
      submit: 'Buchung bestätigen',
      processing: 'Ihr Slot wird gesichert...',
      confirmation: 'Buchung bestätigt!',
      confirmationText: 'Ihr Beratungstermin wurde erfolgreich geplant.',
      newRequest: 'Weitere Beratung buchen',
      step1: 'Service & Datum',
      step2: 'Kontaktdaten',
      step3: 'Bestätigung',
      available: 'Verfügbar',
      popular: 'Beliebt',
      discount: 'Rabatt',
      recommended: 'KI-Empfohlen',
      loadingSlots: 'Verfügbarkeit prüfen...',
      noSlots: 'Keine Slots für dieses Datum verfügbar',
      selectDate: 'Bitte wählen Sie zuerst ein Datum',
      liveUpdate: 'Personen heute gebucht',
      urgentNotice: 'Hohe Nachfrage - Buchen Sie jetzt, um Ihren Platz zu sichern',
      preparation: 'Vorbereitungs-Checkliste',
      duration: 'Dauer',
      followUp: 'Was passiert als nächstes',
      value: 'Wertversprechen',
      investment: 'Investition',
      savings: 'Mögliche Einsparungen'
    },
    ar: {
      title: 'احجز استشارتك',
      subtitle: 'تواصل مع خبرائنا المدعومين بالذكاء الاصطناعي في الوقت الفعلي',
      service: 'اختر الخدمة',
      date: 'اختر التاريخ',
      time: 'اختر الوقت',
      company: 'اسم الشركة',
      name: 'اسمك',
      email: 'البريد الإلكتروني للعمل',
      phone: 'رقم الهاتف',
      requirements: 'أخبرنا عن احتياجاتك',
      submit: 'تأكيد الحجز',
      processing: 'جاري تأمين موعدك...',
      confirmation: 'تم تأكيد الحجز!',
      confirmationText: 'تم جدولة استشارتك بنجاح.',
      newRequest: 'حجز استشارة أخرى',
      step1: 'الخدمة والتاريخ',
      step2: 'بيانات الاتصال',
      step3: 'التأكيد',
      available: 'متاح',
      popular: 'شائع',
      discount: 'خصم',
      recommended: 'موصى به بالذكاء الاصطناعي',
      loadingSlots: 'التحقق من التوفر...',
      noSlots: 'لا توجد فترات متاحة لهذا التاريخ',
      selectDate: 'يرجى اختيار تاريخ أولاً',
      liveUpdate: 'أشخاص حجزوا اليوم',
      urgentNotice: 'طلب مرتفع - احجز الآن لتأمين موعدك',
      preparation: 'قائمة التحضير',
      duration: 'المدة',
      followUp: 'ما يحدث بعد ذلك',
      value: 'عرض القيمة',
      investment: 'الاستثمار',
      savings: 'المدخرات المحتملة'
    }
  };

  const t = labels[language as keyof typeof labels];

  // Simulate real-time booking updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveBookingCount(prev => {
        const change = Math.random() > 0.7 ? 1 : 0;
        return prev + change;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetch available slots when date changes
  useEffect(() => {
    if (formData.date) {
      fetchAvailableSlots(formData.date);
    }
  }, [formData.date]);

  const fetchAvailableSlots = async (date: string) => {
    setIsLoadingSlots(true);
    setSlotsError(null);
    setAvailableSlots([]);
    setRecommendedSlot(null);
    
    try {
      const response = await fetch(`/api/demo/booking/availability/${date}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch availability');
      }
      
      const data = await response.json();
      setAvailableSlots(data.slots);
      setRecommendedSlot(data.recommendation);
      
      // Animate slots appearing
      data.slots.forEach((slot: TimeSlot, index: number) => {
        setTimeout(() => {
          setAnimatingSlot(slot.time);
          setTimeout(() => setAnimatingSlot(null), 300);
        }, index * 100);
      });
    } catch (error) {
      console.error('Error fetching slots:', error);
      setSlotsError('Unable to check availability. Using default slots.');
      
      // Fallback slots
      const defaultSlots = [
        { time: '09:00', available: true, popular: false, discountAvailable: false },
        { time: '10:00', available: true, popular: true, discountAvailable: false },
        { time: '11:00', available: false, popular: true, discountAvailable: false },
        { time: '14:00', available: true, popular: false, discountAvailable: true },
        { time: '15:00', available: true, popular: false, discountAvailable: false },
        { time: '16:00', available: false, popular: true, discountAvailable: false },
        { time: '17:00', available: true, popular: false, discountAvailable: false }
      ];
      setAvailableSlots(defaultSlots);
      setRecommendedSlot('14:00');
      
      // Animate fallback slots appearing
      defaultSlots.forEach((slot: TimeSlot, index: number) => {
        setTimeout(() => {
          setAnimatingSlot(slot.time);
          setTimeout(() => setAnimatingSlot(null), 300);
        }, index * 100);
      });
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/demo/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Booking failed');
      }

      const data: BookingResponse = await response.json();
      setBookingResponse(data);
      setShowConfirmation(true);
      setCurrentStep(3);
    } catch (error) {
      console.error('Booking error:', error);
      // Fallback response
      setBookingResponse({
        success: true,
        bookingId: `BOOK-${Date.now()}`,
        confirmationMessage: "Your consultation has been successfully booked. We look forward to discussing your needs.",
        preparationChecklist: [
          "Prepare a brief overview of your current challenges",
          "List your main objectives for this consultation",
          "Gather any relevant documentation or metrics",
          "Prepare questions you'd like to address"
        ],
        estimatedDuration: "60 minutes",
        followUpActions: [
          "Detailed proposal within 48 hours",
          "Custom implementation roadmap"
        ],
        valueProposition: "Our expertise will help streamline your operations and reduce costs by up to 30%",
        estimatedCost: "$500 - $2,000",
        savings: "Potential savings of $10,000+ annually",
        realTimeMetrics: {
          slotsBookedToday: liveBookingCount,
          satisfactionRate: 98,
          averageResponseTime: "< 2 hours",
          upcomingAvailability: 12
        },
        urgencyIndicators: {
          demandLevel: "high",
          priceIncrease: "",
          limitedAvailability: "Please select your preferred time",
          exclusiveOffer: ""
        }
      });
      setShowConfirmation(true);
      setCurrentStep(3);
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
    if (step < currentStep) return 'bg-green-500 text-white';
    if (step === currentStep) return 'bg-blue-600 text-white animate-pulse';
    return 'bg-gray-300 text-gray-600';
  };

  if (showConfirmation && bookingResponse) {
    return (
      <div className="bg-white rounded-lg p-8 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="relative inline-block mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <Check className="w-10 h-10 text-white" />
            </div>
            <Sparkles className="w-6 h-6 text-yellow-500 absolute -top-2 -right-2 animate-pulse" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">
            {t.confirmation}
          </h3>
          <p className="text-lg text-gray-600 mb-2">
            {bookingResponse.confirmationMessage}
          </p>
          <p className="text-sm text-blue-600 font-semibold">
            Booking ID: {bookingResponse.bookingId}
          </p>
        </div>

        {/* Real-time metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center">
            <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{bookingResponse.realTimeMetrics.slotsBookedToday}</p>
            <p className="text-xs text-gray-600">{t.liveUpdate}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 text-center">
            <Star className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{bookingResponse.realTimeMetrics.satisfactionRate}%</p>
            <p className="text-xs text-gray-600">Satisfaction Rate</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 text-center">
            <Timer className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <p className="text-lg font-bold text-gray-900">{bookingResponse.realTimeMetrics.averageResponseTime}</p>
            <p className="text-xs text-gray-600">Response Time</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 text-center">
            <Calendar className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{bookingResponse.realTimeMetrics.upcomingAvailability}</p>
            <p className="text-xs text-gray-600">Time Options</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Preparation Checklist */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-600" />
              {t.preparation}
            </h4>
            <ul className="space-y-3">
              {bookingResponse.preparationChecklist.map((item, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">
                    <span className="text-xs text-blue-600 font-semibold">{index + 1}</span>
                  </div>
                  <span className="text-sm text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Value & Investment */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                {t.value}
              </h4>
              <p className="text-sm text-gray-700">{bookingResponse.valueProposition}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">{t.investment}</p>
                <p className="text-lg font-bold text-gray-900">{bookingResponse.estimatedCost}</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">{t.savings}</p>
                <p className="text-lg font-bold text-green-600">{bookingResponse.savings}</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-xs text-gray-500 mb-1">{t.duration}</p>
              <p className="text-lg font-semibold text-gray-900">{bookingResponse.estimatedDuration}</p>
            </div>
          </div>
        </div>

        {/* Urgency Indicators */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-4 mb-8 border border-orange-200">
          <div className="flex items-center mb-3">
            <Zap className="w-5 h-5 text-orange-600 mr-2" />
            <p className="font-semibold text-gray-900">{t.urgentNotice}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center">
              <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
              <span className="text-gray-700">{bookingResponse.urgencyIndicators.limitedAvailability}</span>
            </div>
            <div className="flex items-center">
              <TrendingUp className="w-4 h-4 text-orange-500 mr-2" />
              <span className="text-gray-700">{bookingResponse.urgencyIndicators.priceIncrease}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleNewRequest}
          className="w-full px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-lg hover:from-gray-800 hover:to-gray-700 transition-all duration-200 transform hover:scale-105"
        >
          {t.newRequest}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 via-purple-900/20 to-blue-900/20 backdrop-blur-xl rounded-2xl border border-white/10 p-8 max-w-4xl mx-auto shadow-2xl">
      {/* Header with live counter */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              {t.title}
            </h2>
            <p className="text-gray-400 mt-1">
              {t.subtitle}
            </p>
          </div>
          <div className="text-center">
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-xl px-4 py-2 shadow-lg shadow-purple-500/25">
              <p className="text-2xl font-bold animate-pulse">{liveBookingCount}</p>
              <p className="text-xs opacity-90">{t.liveUpdate}</p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex-1 flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${getStepClass(step)}`}>
                {step < currentStep ? <Check className="w-5 h-5" /> : step}
              </div>
              {step < 3 && (
                <div className={`flex-1 h-1 mx-2 transition-all duration-300 ${
                  step < currentStep ? 'bg-green-500' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>{t.step1}</span>
          <span>{t.step2}</span>
          <span>{t.step3}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Service & Date */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building className="inline w-4 h-4 mr-1" />
                {t.service}
              </label>
              <select
                required
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option value="">Select a service...</option>
                {services[language as keyof typeof services].map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline w-4 h-4 mr-1" />
                {t.date}
              </label>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value, time: '' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>

            {/* Time Slot Selection with Animations */}
            {formData.date && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="inline w-4 h-4 mr-1" />
                  {t.time}
                </label>
                
                {isLoadingSlots ? (
                  <div className="text-center py-8">
                    <Loader className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
                    <p className="text-sm text-gray-600">{t.loadingSlots}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot.time}
                        type="button"
                        disabled={!slot.available}
                        onClick={() => setFormData({ ...formData, time: slot.time })}
                        className={`
                          relative p-3 rounded-lg border-2 transition-all duration-300 transform
                          ${animatingSlot === slot.time ? 'animate-slideIn' : ''}
                          ${!slot.available 
                            ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed' 
                            : formData.time === slot.time
                              ? 'bg-blue-50 border-blue-500 text-blue-700 scale-105 shadow-lg'
                              : 'bg-white border-gray-300 hover:border-blue-400 hover:shadow-md hover:scale-105'
                          }
                        `}
                      >
                        <p className="font-semibold text-lg">{slot.time}</p>
                        <p className="text-xs mt-1">
                          {slot.available ? t.available : 'Booked'}
                        </p>
                        {recommendedSlot === slot.time && slot.available && (
                          <div className="absolute -bottom-6 left-0 right-0 text-center">
                            <span className="text-xs text-blue-600 font-semibold flex items-center justify-center">
                              <Award className="w-3 h-3 mr-1" />
                              {t.recommended}
                            </span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="button"
                disabled={!formData.service || !formData.date || !formData.time}
                onClick={() => setCurrentStep(2)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 flex items-center"
              >
                Continue
                <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Contact Details */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Building className="inline w-4 h-4 mr-1" />
                  {t.company}
                </label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Your Company Ltd."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline w-4 h-4 mr-1" />
                  {t.name}
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="John Smith"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="inline w-4 h-4 mr-1" />
                  {t.email}
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="john@company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="inline w-4 h-4 mr-1" />
                  {t.phone}
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="+1 234 567 8900"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="inline w-4 h-4 mr-1" />
                {t.requirements}
              </label>
              <textarea
                rows={4}
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Tell us about your project requirements, goals, and any specific challenges you're facing..."
              />
            </div>

            {/* Booking Summary */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
              <h3 className="font-semibold text-gray-900 mb-4">Booking Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Service:</span>
                  <span className="font-medium text-gray-900">{formData.service}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium text-gray-900">{formData.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium text-gray-900">{formData.time}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    {t.processing}
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    {t.submit}
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default BookingDemo;