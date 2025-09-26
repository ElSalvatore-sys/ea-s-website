import React, { useState, useEffect } from 'react';
import { X, Calendar, Phone, Mail, User, Building, Target, Clock, DollarSign, Users, MessageSquare, AlertCircle, TrendingUp, Award, Star } from 'lucide-react';
import { useLanguage } from '../providers/LanguageProvider';
import { validateForm, bookingFormSchema, ValidationErrors, hasErrors, sanitizeFormData } from '../utils/validation';
import { analytics } from '../lib/analytics';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose }) => {
  const { t, language } = useLanguage();
  const [step, setStep] = useState(1);
  const [availableSlots] = useState(Math.floor(Math.random() * 2) + 2); // 2-3 slots
  const [nextAvailable] = useState(Math.floor(Math.random() * 3) + 2); // 2-4 days
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    employees: '',
    industry: '',
    budget: '',
    timeline: '',
    goals: '',
    challenges: '',
    message: ''
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Track modal open
  useEffect(() => {
    if (isOpen) {
      analytics.trackEvent('booking_modal_open', { step: 1 });
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleBlur = (field: string) => {
    setTouched({
      ...touched,
      [field]: true
    });
    
    // Validate single field on blur
    const fieldErrors = validateForm({ [field]: formData[field] }, { [field]: bookingFormSchema[field] || [] });
    if (fieldErrors[field]) {
      setErrors({
        ...errors,
        [field]: fieldErrors[field]
      });
    }
  };

  const validateStep = (stepNumber: number): boolean => {
    let fieldsToValidate: string[] = [];
    
    switch (stepNumber) {
      case 1:
        fieldsToValidate = ['name', 'email', 'company'];
        break;
      case 2:
        fieldsToValidate = ['employees', 'industry'];
        break;
      case 3:
        fieldsToValidate = ['goals', 'challenges'];
        break;
    }
    
    const stepData: { [key: string]: any } = {};
    const stepSchema: any = {};
    
    fieldsToValidate.forEach(field => {
      stepData[field] = formData[field];
      if (bookingFormSchema[field]) {
        stepSchema[field] = bookingFormSchema[field];
      }
    });
    
    const stepErrors = validateForm(stepData, stepSchema);
    
    // Update errors and touched state
    setErrors({ ...errors, ...stepErrors });
    
    const touchedFields: { [key: string]: boolean } = {};
    fieldsToValidate.forEach(field => {
      touchedFields[field] = true;
    });
    setTouched({ ...touched, ...touchedFields });
    
    return !hasErrors(stepErrors);
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
      analytics.trackEvent('booking_step_complete', { 
        step, 
        nextStep: step + 1,
        data: formData 
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const validationErrors = validateForm(formData, bookingFormSchema);
    setErrors(validationErrors);
    
    // Mark all fields as touched
    const allTouched: { [key: string]: boolean } = {};
    Object.keys(bookingFormSchema).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);
    
    if (hasErrors(validationErrors)) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Sanitize form data
    const sanitizedData = sanitizeFormData(formData);
    // Create email content
    const emailSubject = `AI Strategy Call Request - ${sanitizedData.company}`;
    const emailBody = `
New AI Strategy Call Request:

Contact Information:
- Name: ${sanitizedData.name}
- Email: ${sanitizedData.email}
- Company: ${sanitizedData.company}
- Phone: ${sanitizedData.phone}

Company Details:
- Number of Employees: ${sanitizedData.employees}
- Industry: ${sanitizedData.industry}
- Budget Range: ${sanitizedData.budget}
- Timeline: ${sanitizedData.timeline}

Business Information:
- Goals: ${sanitizedData.goals}
- Current Challenges: ${sanitizedData.challenges}
- Additional Message: ${sanitizedData.message}
    `;
    
    // Track conversion
    analytics.trackConversion({
      eventName: 'consultation_booked',
      value: formData.budget === '500k+' ? 5000 : 
             formData.budget === '100k-500k' ? 2000 :
             formData.budget === '50k-100k' ? 1000 :
             formData.budget === '10k-50k' ? 500 : 100,
      currency: 'EUR',
      metadata: sanitizedData
    });
    
    // Open email client
    window.location.href = `mailto:ali.h@easolutions.de?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    
    // Close modal
    onClose();
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      company: '',
      phone: '',
      employees: '',
      industry: '',
      budget: '',
      timeline: '',
      goals: '',
      challenges: '',
      message: ''
    });
    setStep(1);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-20 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-elevated max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 font-inter">
                {t('header.cta')}
              </h2>
              <p className="text-gray-600 mt-1 font-inter">
                {step === 1 ? t('booking.step1') : step === 2 ? t('booking.step2') : t('booking.step3')}
              </p>
              
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center">
              {[1, 2, 3].map((stepNumber) => (
                <React.Fragment key={stepNumber}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNumber 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 bg-gray-600 text-gray-600 text-gray-400'
                  }`}>
                    {stepNumber}
                  </div>
                  {stepNumber < 3 && (
                    <div className={`flex-1 h-1 mx-2 ${
                      step > stepNumber ? 'bg-blue-600' : 'bg-gray-200 bg-gray-600'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 text-gray-300 mb-2">
                    <User className="inline h-4 w-4 mr-1" />
                    {t('contact.form.name')} *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('name')}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white bg-gray-900 text-gray-900 text-white ${
                      touched.name && errors.name 
                        ? 'border-red-500 border-red-500' 
                        : 'border-gray-300 border-gray-600'
                    }`}
                    placeholder={t('booking.name')}
                  />
                  {touched.name && errors.name && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 text-gray-300 mb-2">
                    <Mail className="inline h-4 w-4 mr-1" />
                    {t('contact.form.email')} *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('email')}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white bg-gray-900 text-gray-900 text-white ${
                      touched.email && errors.email 
                        ? 'border-red-500 border-red-500' 
                        : 'border-gray-300 border-gray-600'
                    }`}
                    placeholder="john@company.com"
                  />
                  {touched.email && errors.email && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 text-gray-300 mb-2">
                    <Building className="inline h-4 w-4 mr-1" />
                    {t('contact.form.company')} *
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('company')}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white bg-gray-900 text-gray-900 text-white ${
                      touched.company && errors.company 
                        ? 'border-red-500 border-red-500' 
                        : 'border-gray-300 border-gray-600'
                    }`}
                    placeholder={t('booking.company')}
                  />
                  {touched.company && errors.company && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.company}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 text-gray-300 mb-2">
                    <Phone className="inline h-4 w-4 mr-1" />
                    {t('contact.form.phone')}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('phone')}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white bg-gray-900 text-gray-900 text-white ${
                      touched.phone && errors.phone 
                        ? 'border-red-500 border-red-500' 
                        : 'border-gray-300 border-gray-600'
                    }`}
                    placeholder="+49 123 456 7890"
                  />
                  {touched.phone && errors.phone && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 text-gray-300 mb-2">
                    <Users className="inline h-4 w-4 mr-1" />
                    {t('contact.form.employees')} *
                  </label>
                  <select
                    name="employees"
                    value={formData.employees}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('employees')}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white bg-gray-900 text-gray-900 text-white ${
                      touched.employees && errors.employees 
                        ? 'border-red-500 border-red-500' 
                        : 'border-gray-300 border-gray-600'
                    }`}
                  >
                    <option value="">{t('booking.employees.select')}</option>
                    <option value="1-10">{t('booking.employees.1-10')}</option>
                    <option value="11-50">{t('booking.employees.11-50')}</option>
                    <option value="51-200">{t('booking.employees.51-200')}</option>
                    <option value="201-1000">{t('booking.employees.201-1000')}</option>
                    <option value="1000+">{t('booking.employees.1000+')}</option>
                  </select>
                  {touched.employees && errors.employees && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.employees}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 text-gray-300 mb-2">
                    <Building className="inline h-4 w-4 mr-1" />
                    {t('contact.form.industry')} *
                  </label>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('industry')}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white bg-gray-900 text-gray-900 text-white ${
                      touched.industry && errors.industry 
                        ? 'border-red-500 border-red-500' 
                        : 'border-gray-300 border-gray-600'
                    }`}
                  >
                    <option value="">{t('booking.industry.select')}</option>
                    <option value="hospitality">{t('booking.industry.hospitality')}</option>
                    <option value="manufacturing">{t('booking.industry.manufacturing')}</option>
                    <option value="healthcare">{t('booking.industry.healthcare')}</option>
                    <option value="finance">{t('booking.industry.finance')}</option>
                    <option value="retail">{t('booking.industry.retail')}</option>
                    <option value="technology">{t('booking.industry.technology')}</option>
                    <option value="other">{t('booking.industry.other')}</option>
                  </select>
                  {touched.industry && errors.industry && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.industry}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 text-gray-300 mb-2">
                    <DollarSign className="inline h-4 w-4 mr-1" />
                    {t('contact.form.budget')}
                  </label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white bg-gray-900 text-gray-900 text-white"
                  >
                    <option value="">{t('booking.budget.select') || 'Select budget range'}</option>
                    <option value="under-10k">{t('booking.budget.under-10k')}</option>
                    <option value="10k-50k">{t('booking.budget.10k-50k')}</option>
                    <option value="50k-100k">{t('booking.budget.50k-100k')}</option>
                    <option value="100k-500k">{t('booking.budget.100k-500k')}</option>
                    <option value="500k+">{t('booking.budget.500k+')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 text-gray-300 mb-2">
                    <Clock className="inline h-4 w-4 mr-1" />
                    {t('contact.form.timeline')}
                  </label>
                  <select
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white bg-gray-900 text-gray-900 text-white"
                  >
                    <option value="">{t('booking.timeline.select') || 'Select timeline'}</option>
                    <option value="asap">{t('booking.timeline.asap')}</option>
                    <option value="1-3months">{t('booking.timeline.1-3months')}</option>
                    <option value="3-6months">{t('booking.timeline.3-6months')}</option>
                    <option value="6-12months">{t('booking.timeline.6-12months')}</option>
                    <option value="12months+">{t('booking.timeline.12months+')}</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 text-gray-300 mb-2">
                  <Target className="inline h-4 w-4 mr-1" />
                  {t('contact.form.goals')} *
                </label>
                <textarea
                  name="goals"
                  rows={3}
                  value={formData.goals}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('goals')}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white bg-gray-900 text-gray-900 text-white ${
                    touched.goals && errors.goals 
                      ? 'border-red-500 border-red-500' 
                      : 'border-gray-300 border-gray-600'
                  }`}
                  placeholder={t('booking.goals')}
                />
                {touched.goals && errors.goals && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.goals}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 text-gray-300 mb-2">
                  <MessageSquare className="inline h-4 w-4 mr-1" />
                  {t('contact.form.challenges')} *
                </label>
                <textarea
                  name="challenges"
                  rows={3}
                  value={formData.challenges}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('challenges')}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white bg-gray-900 text-gray-900 text-white ${
                    touched.challenges && errors.challenges 
                      ? 'border-red-500 border-red-500' 
                      : 'border-gray-300 border-gray-600'
                  }`}
                  placeholder={t('booking.challenges')}
                />
                {touched.challenges && errors.challenges && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.challenges}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 text-gray-300 mb-2">
                  <MessageSquare className="inline h-4 w-4 mr-1" />
                  {t('contact.form.message')}
                </label>
                <textarea
                  name="message"
                  rows={3}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white bg-gray-900 text-gray-900 text-white"
                  placeholder={t('booking.additional')}
                />
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 border-gray-700">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-6 py-2 border border-gray-300 border-gray-600 text-gray-700 text-gray-300 rounded-lg hover:bg-gray-50 hover:bg-gray-700 transition-colors"
              >
                Previous
              </button>
            )}
            
            <div className="ml-auto">
              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium animate-pulse"
                  disabled={isSubmitting}
                >
                  {isSubmitting 
                    ? t('booking.submitting')
                    : t('booking.cta.secure') || '✓ Secure Free Consultation'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;