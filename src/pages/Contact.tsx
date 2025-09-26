import React, { useState, useEffect } from 'react';
import { Mail, MapPin, Phone, Send, User, Building, MessageSquare, Users, Target, Clock, DollarSign, AlertCircle } from 'lucide-react';
import { useLanguage } from '../components/LanguageSelector';
import { validateForm, contactFormSchema, ValidationErrors, hasErrors, sanitizeFormData } from '../utils/validation';

const Contact: React.FC = () => {
  const { translate } = useLanguage();
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const validationErrors = validateForm(formData, contactFormSchema);
    setErrors(validationErrors);
    
    // Mark all fields as touched
    const allTouched: { [key: string]: boolean } = {};
    Object.keys(contactFormSchema).forEach(key => {
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
    const emailSubject = `Contact Form Submission - ${sanitizedData.company}`;
    const emailBody = `
New Contact Form Submission:

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
    
    // Open email client
    window.location.href = `mailto:ali.h@easolutions.de?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    
    // Reset form after submission
    setTimeout(() => {
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
      setErrors({});
      setTouched({});
      setIsSubmitting(false);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
    const fieldErrors = validateForm({ [field]: formData[field] }, { [field]: contactFormSchema[field] || [] });
    if (fieldErrors[field]) {
      setErrors({
        ...errors,
        [field]: fieldErrors[field]
      });
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 dark:from-gray-950 dark:via-blue-950 dark:to-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">{translate('contact.title')}</h1>
              <p className="text-xl md:text-2xl text-gray-300 dark:text-gray-400 mb-8">
                {translate('contact.subtitle')}
              </p>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-600 dark:bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 dark:text-gray-500">{translate('contact.email')}</div>
                    <a href="mailto:ali.h@easolutions.de" className="text-lg font-semibold hover:text-blue-400 dark:hover:text-blue-300 transition-colors">
                      ali.h@easolutions.de
                    </a>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-600 dark:bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 dark:text-gray-500">{translate('contact.location')}</div>
                    <div className="text-lg font-semibold">Wiesbaden, Germany</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white bg-opacity-10 dark:bg-white dark:bg-opacity-5 rounded-2xl p-8 backdrop-blur-sm">
              <img 
                src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750" 
                alt="AI consultation meeting" 
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{translate('contact.form.title')}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {translate('contact.form.subtitle')}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 md:p-12 border border-gray-100 dark:border-gray-700">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {translate('contact.form.name')} *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={() => handleBlur('name')}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white dark:bg-gray-900 text-gray-900 dark:text-white ${
                        touched.name && errors.name
                          ? 'border-red-500 dark:border-red-500'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="Your full name"
                    />
                  </div>
                  {touched.name && errors.name && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {translate('contact.form.email')} *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={() => handleBlur('email')}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white dark:bg-gray-900 text-gray-900 dark:text-white ${
                        touched.email && errors.email
                          ? 'border-red-500 dark:border-red-500'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="your@email.com"
                    />
                  </div>
                  {touched.email && errors.email && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {translate('contact.form.company')}
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      onBlur={() => handleBlur('company')}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white dark:bg-gray-900 text-gray-900 dark:text-white ${
                        touched.company && errors.company
                          ? 'border-red-500 dark:border-red-500'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="Your company name"
                    />
                  </div>
                  {touched.company && errors.company && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.company}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {translate('contact.form.phone')}
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={() => handleBlur('phone')}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white dark:bg-gray-900 text-gray-900 dark:text-white ${
                        touched.phone && errors.phone
                          ? 'border-red-500 dark:border-red-500'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="+49 123 456 7890"
                    />
                  </div>
                  {touched.phone && errors.phone && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.phone}
                    </p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="employees" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {translate('contact.form.employees')}
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <select
                      id="employees"
                      name="employees"
                      value={formData.employees}
                      onChange={handleChange}
                      onBlur={() => handleBlur('employees')}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white dark:bg-gray-900 text-gray-900 dark:text-white ${
                        touched.employees && errors.employees
                          ? 'border-red-500 dark:border-red-500'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <option value="">{translate('booking.employees.select') || 'Select range'}</option>
                      <option value="1-10">{translate('booking.employees.1-10')}</option>
                      <option value="11-50">{translate('booking.employees.11-50')}</option>
                      <option value="51-200">{translate('booking.employees.51-200')}</option>
                      <option value="201-1000">{translate('booking.employees.201-1000')}</option>
                      <option value="1000+">{translate('booking.employees.1000+')}</option>
                    </select>
                  </div>
                  {touched.employees && errors.employees && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.employees}
                    </p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="industry" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {translate('contact.form.industry')}
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <select
                      id="industry"
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                      onBlur={() => handleBlur('industry')}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white dark:bg-gray-900 text-gray-900 dark:text-white ${
                        touched.industry && errors.industry
                          ? 'border-red-500 dark:border-red-500'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <option value="">{translate('booking.industry.select') || 'Select industry'}</option>
                      <option value="hospitality">{translate('booking.industry.hospitality')}</option>
                      <option value="manufacturing">{translate('booking.industry.manufacturing')}</option>
                      <option value="healthcare">{translate('booking.industry.healthcare')}</option>
                      <option value="finance">{translate('booking.industry.finance')}</option>
                      <option value="retail">{translate('booking.industry.retail')}</option>
                      <option value="technology">{translate('booking.industry.technology')}</option>
                      <option value="other">{translate('booking.industry.other')}</option>
                    </select>
                  </div>
                  {touched.industry && errors.industry && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.industry}
                    </p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {translate('contact.form.budget')}
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <select
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      onBlur={() => handleBlur('budget')}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white dark:bg-gray-900 text-gray-900 dark:text-white ${
                        touched.budget && errors.budget
                          ? 'border-red-500 dark:border-red-500'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <option value="">{translate('booking.budget.select') || 'Select budget range'}</option>
                      <option value="under-10k">{translate('booking.budget.under-10k')}</option>
                      <option value="10k-50k">{translate('booking.budget.10k-50k')}</option>
                      <option value="50k-100k">{translate('booking.budget.50k-100k')}</option>
                      <option value="100k-500k">{translate('booking.budget.100k-500k')}</option>
                      <option value="500k+">{translate('booking.budget.500k+')}</option>
                    </select>
                  </div>
                  {touched.budget && errors.budget && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.budget}
                    </p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {translate('contact.form.timeline')}
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <select
                      id="timeline"
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleChange}
                      onBlur={() => handleBlur('timeline')}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white dark:bg-gray-900 text-gray-900 dark:text-white ${
                        touched.timeline && errors.timeline
                          ? 'border-red-500 dark:border-red-500'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <option value="">{translate('booking.timeline.select') || 'Select timeline'}</option>
                      <option value="asap">{translate('booking.timeline.asap')}</option>
                      <option value="1-3months">{translate('booking.timeline.1-3months')}</option>
                      <option value="3-6months">{translate('booking.timeline.3-6months')}</option>
                      <option value="6-12months">{translate('booking.timeline.6-12months')}</option>
                      <option value="12months+">{translate('booking.timeline.12months+')}</option>
                    </select>
                  </div>
                  {touched.timeline && errors.timeline && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.timeline}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="goals" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {translate('contact.form.goals')}
                </label>
                <div className="relative">
                  <Target className="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  <textarea
                    id="goals"
                    name="goals"
                    rows={3}
                    value={formData.goals}
                    onChange={handleChange}
                    onBlur={() => handleBlur('goals')}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white ${
                      touched.goals && errors.goals
                        ? 'border-red-500 dark:border-red-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="What are your main business goals for AI implementation?"
                  />
                </div>
                {touched.goals && errors.goals && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.goals}
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="challenges" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {translate('contact.form.challenges')}
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  <textarea
                    id="challenges"
                    name="challenges"
                    rows={3}
                    value={formData.challenges}
                    onChange={handleChange}
                    onBlur={() => handleBlur('challenges')}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white ${
                      touched.challenges && errors.challenges
                        ? 'border-red-500 dark:border-red-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="What are your current operational challenges?"
                  />
                </div>
                {touched.challenges && errors.challenges && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.challenges}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {translate('contact.form.message')}
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    placeholder="Any additional information you'd like to share..."
                  />
                </div>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center bg-gradient-to-r from-blue-900 to-blue-700 dark:from-blue-600 dark:to-blue-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-blue-800 hover:to-blue-600 dark:hover:from-blue-500 dark:hover:to-blue-400 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? 'Submitting...' : translate('contact.form.submit')}
                  <Send className="ml-2 h-5 w-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-20 bg-blue-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{translate('contact.options.title')}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {translate('contact.options.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
              <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Phone className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{translate('contact.options.call.title')}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {translate('contact.options.call.desc')}
              </p>
              <button 
                onClick={() => {
                  const event = new CustomEvent('openBookingModal');
                  window.dispatchEvent(event);
                }}
                className="bg-blue-900 dark:bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-800 dark:hover:bg-blue-500 transition-colors duration-300"
              >
                {translate('cta.book')}
              </button>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
              <div className="bg-green-100 dark:bg-green-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{translate('contact.options.email.title')}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {translate('contact.options.email.desc')}
              </p>
              <a
                href="mailto:ali.h@easolutions.de"
                className="inline-block bg-green-600 dark:bg-green-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 dark:hover:bg-green-600 transition-colors duration-300"
              >
                {translate('contact.options.email.cta')}
              </a>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
              <div className="bg-purple-100 dark:bg-purple-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{translate('contact.options.chat.title')}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {translate('contact.options.chat.desc')}
              </p>
              <button 
                onClick={() => {
                  // Open the chatbot
                  const chatButton = document.querySelector('[aria-label="Open chat"]') as HTMLButtonElement;
                  if (chatButton) {
                    chatButton.click();
                  }
                }}
                className="bg-purple-600 dark:bg-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors duration-300"
              >
                {translate('contact.livechat')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Quick answers to common questions about working with EA Solutions.
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: 'How long does a typical AI implementation take?',
                answer: 'Implementation timelines vary based on project complexity, but most projects are completed within 3-6 months from initial consultation to full deployment.'
              },
              {
                question: 'Do you work with companies of all sizes?',
                answer: 'Yes, we work with businesses ranging from innovative startups to large enterprises. Our solutions are tailored to fit your specific needs and budget.'
              },
              {
                question: 'What industries do you specialize in?',
                answer: 'We have deep expertise across hospitality, manufacturing, finance, healthcare, retail, and smart living sectors, with custom solutions for other industries.'
              },
              {
                question: 'How do you ensure data security and privacy?',
                answer: 'We implement enterprise-grade security measures including end-to-end encryption, secure data handling protocols, and compliance with industry standards like GDPR and HIPAA.'
              },
              {
                question: 'What kind of ongoing support do you provide?',
                answer: 'We provide continuous monitoring, optimization, and enhancement services to ensure your AI systems evolve with your business needs and deliver sustained value.'
              }
            ].map((faq, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{faq.question}</h3>
                <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-blue-900 dark:from-gray-950 dark:to-blue-950 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Business?</h2>
          <p className="text-xl text-gray-300 dark:text-gray-400 mb-8">
            Don't let your competitors get ahead. Start your AI transformation journey today.
          </p>
          <button className="bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-500 dark:to-blue-400 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-blue-500 hover:to-blue-400 dark:hover:from-blue-400 dark:hover:to-blue-300 transition-all duration-300 transform hover:scale-105 shadow-xl">
            Book Your AI Strategy Call Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default Contact;