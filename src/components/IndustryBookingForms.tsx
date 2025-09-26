import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SmartInput, SmartFormProgress } from './SmartInput';
import useSmartValidation from '../hooks/useSmartValidation';
import { IndustryType } from '../utils/industryValidators';
import { Calendar, Clock, Users, Utensils, Stethoscope, Scissors, Car } from 'lucide-react';

// ============================================
// RESTAURANT BOOKING FORM
// ============================================

export const RestaurantBookingForm: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  
  const {
    formState,
    progress,
    isValid,
    setFieldValue,
    validate,
    validateAll,
    getFieldError,
    getFieldWarning,
    getFieldSuggestion,
    getAutocomplete
  } = useSmartValidation(
    ['name', 'email', 'phone', 'date', 'time', 'partySize', 'dietaryRestrictions', 'specialOccasion'],
    { industry: 'restaurant' as IndustryType }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAll()) {
      setSubmitted(true);
      // Handle form submission
      console.log('Restaurant booking submitted:', formState);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Utensils className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Reservation Confirmed!
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          We'll send you a confirmation email shortly.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-lg mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Utensils className="w-6 h-6" />
          Restaurant Reservation
        </h2>
        <p className="text-purple-100 mt-1">Book your table in seconds</p>
      </div>

      <SmartFormProgress progress={progress} className="mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SmartInput
          name="name"
          label="Your Name"
          placeholder="John Doe"
          value={formState.name?.value || ''}
          onChange={(value) => {
            setFieldValue('name', value);
            validate('name', value);
          }}
          error={getFieldError('name')}
          warning={getFieldWarning('name')}
          suggestion={getFieldSuggestion('name')}
          isValid={formState.name?.validation?.isValid}
          isValidating={formState.name?.validation?.isValidating}
          feedback={formState.name?.validation?.feedback}
          required
        />

        <SmartInput
          type="email"
          name="email"
          label="Email Address"
          placeholder="john@example.com"
          value={formState.email?.value || ''}
          onChange={(value) => {
            setFieldValue('email', value);
            validate('email', value);
          }}
          error={getFieldError('email')}
          warning={getFieldWarning('email')}
          suggestion={getFieldSuggestion('email')}
          isValid={formState.email?.validation?.isValid}
          isValidating={formState.email?.validation?.isValidating}
          feedback={formState.email?.validation?.feedback}
          required
        />

        <SmartInput
          type="tel"
          name="phone"
          label="Phone Number"
          placeholder="+49 123 456789"
          value={formState.phone?.value || ''}
          onChange={(value) => {
            setFieldValue('phone', value);
            validate('phone', value);
          }}
          error={getFieldError('phone')}
          warning={getFieldWarning('phone')}
          suggestion={getFieldSuggestion('phone')}
          isValid={formState.phone?.validation?.isValid}
          isValidating={formState.phone?.validation?.isValidating}
          feedback={formState.phone?.validation?.feedback}
          required
        />

        <SmartInput
          type="number"
          name="partySize"
          label="Party Size"
          placeholder="2"
          value={formState.partySize?.value || ''}
          onChange={(value) => {
            setFieldValue('partySize', value);
            validate('partySize', value);
          }}
          error={getFieldError('partySize')}
          warning={getFieldWarning('partySize')}
          suggestion={getFieldSuggestion('partySize')}
          isValid={formState.partySize?.validation?.isValid}
          isValidating={formState.partySize?.validation?.isValidating}
          icon={<Users className="w-4 h-4" />}
          required
        />

        <SmartInput
          type="date"
          name="date"
          label="Reservation Date"
          value={formState.date?.value || ''}
          onChange={(value) => {
            setFieldValue('date', value);
            validate('date', value);
          }}
          error={getFieldError('date')}
          warning={getFieldWarning('date')}
          isValid={formState.date?.validation?.isValid}
          isValidating={formState.date?.validation?.isValidating}
          required
        />

        <SmartInput
          type="time"
          name="time"
          label="Preferred Time"
          value={formState.time?.value || ''}
          onChange={(value) => {
            setFieldValue('time', value);
            validate('time', value);
          }}
          error={getFieldError('time')}
          warning={getFieldWarning('time')}
          isValid={formState.time?.validation?.isValid}
          isValidating={formState.time?.validation?.isValidating}
          required
        />
      </div>

      <SmartInput
        name="dietaryRestrictions"
        label="Dietary Restrictions"
        placeholder="Vegetarian, Vegan, Gluten-free, etc."
        value={formState.dietaryRestrictions?.value || ''}
        onChange={(value) => {
          setFieldValue('dietaryRestrictions', value);
          validate('dietaryRestrictions', value);
        }}
        autocompleteOptions={getAutocomplete('dietaryRestrictions')}
        isValid={formState.dietaryRestrictions?.validation?.isValid}
      />

      <SmartInput
        name="specialOccasion"
        label="Special Occasion"
        placeholder="Birthday, Anniversary, etc."
        value={formState.specialOccasion?.value || ''}
        onChange={(value) => {
          setFieldValue('specialOccasion', value);
          validate('specialOccasion', value);
        }}
        autocompleteOptions={getAutocomplete('specialOccasion')}
        isValid={formState.specialOccasion?.validation?.isValid}
      />

      <button
        type="submit"
        disabled={!isValid}
        className={`
          w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200
          ${isValid
            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg transform hover:-translate-y-0.5'
            : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          }
        `}
      >
        Reserve Table
      </button>
    </form>
  );
};

// ============================================
// MEDICAL APPOINTMENT FORM
// ============================================

export const MedicalAppointmentForm: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  
  const {
    formState,
    progress,
    isValid,
    setFieldValue,
    validate,
    validateAll,
    getFieldError,
    getFieldWarning,
    getFieldSuggestion,
    getAutocomplete
  } = useSmartValidation(
    ['name', 'email', 'phone', 'date', 'time', 'insuranceNumber', 'symptoms', 'emergencyContact'],
    { industry: 'medical' as IndustryType }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAll()) {
      setSubmitted(true);
      console.log('Medical appointment submitted:', formState);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Stethoscope className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Appointment Scheduled!
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          We'll send you a confirmation with appointment details.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-4 rounded-lg mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Stethoscope className="w-6 h-6" />
          Medical Appointment
        </h2>
        <p className="text-blue-100 mt-1">Schedule your appointment online</p>
      </div>

      <SmartFormProgress progress={progress} className="mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SmartInput
          name="name"
          label="Full Name"
          placeholder="John Doe"
          value={formState.name?.value || ''}
          onChange={(value) => {
            setFieldValue('name', value);
            validate('name', value);
          }}
          error={getFieldError('name')}
          warning={getFieldWarning('name')}
          suggestion={getFieldSuggestion('name')}
          isValid={formState.name?.validation?.isValid}
          isValidating={formState.name?.validation?.isValidating}
          feedback={formState.name?.validation?.feedback}
          required
        />

        <SmartInput
          name="insuranceNumber"
          label="Insurance Number"
          placeholder="KK-123456789"
          value={formState.insuranceNumber?.value || ''}
          onChange={(value) => {
            setFieldValue('insuranceNumber', value);
            validate('insuranceNumber', value);
          }}
          error={getFieldError('insuranceNumber')}
          warning={getFieldWarning('insuranceNumber')}
          isValid={formState.insuranceNumber?.validation?.isValid}
          isValidating={formState.insuranceNumber?.validation?.isValidating}
          required
        />

        <SmartInput
          type="email"
          name="email"
          label="Email Address"
          placeholder="john@example.com"
          value={formState.email?.value || ''}
          onChange={(value) => {
            setFieldValue('email', value);
            validate('email', value);
          }}
          error={getFieldError('email')}
          warning={getFieldWarning('email')}
          suggestion={getFieldSuggestion('email')}
          isValid={formState.email?.validation?.isValid}
          isValidating={formState.email?.validation?.isValidating}
          feedback={formState.email?.validation?.feedback}
          required
        />

        <SmartInput
          type="tel"
          name="phone"
          label="Phone Number"
          placeholder="+49 123 456789"
          value={formState.phone?.value || ''}
          onChange={(value) => {
            setFieldValue('phone', value);
            validate('phone', value);
          }}
          error={getFieldError('phone')}
          warning={getFieldWarning('phone')}
          suggestion={getFieldSuggestion('phone')}
          isValid={formState.phone?.validation?.isValid}
          isValidating={formState.phone?.validation?.isValidating}
          feedback={formState.phone?.validation?.feedback}
          required
        />

        <SmartInput
          type="date"
          name="date"
          label="Preferred Date"
          value={formState.date?.value || ''}
          onChange={(value) => {
            setFieldValue('date', value);
            validate('date', value);
          }}
          error={getFieldError('date')}
          warning={getFieldWarning('date')}
          isValid={formState.date?.validation?.isValid}
          isValidating={formState.date?.validation?.isValidating}
          required
        />

        <SmartInput
          type="time"
          name="time"
          label="Preferred Time"
          value={formState.time?.value || ''}
          onChange={(value) => {
            setFieldValue('time', value);
            validate('time', value);
          }}
          error={getFieldError('time')}
          warning={getFieldWarning('time')}
          isValid={formState.time?.validation?.isValid}
          isValidating={formState.time?.validation?.isValidating}
          required
        />
      </div>

      <SmartInput
        name="symptoms"
        label="Symptoms or Reason for Visit"
        placeholder="Describe your symptoms or reason for appointment"
        value={formState.symptoms?.value || ''}
        onChange={(value) => {
          setFieldValue('symptoms', value);
          validate('symptoms', value);
        }}
        autocompleteOptions={getAutocomplete('symptoms')}
        isValid={formState.symptoms?.validation?.isValid}
        inputClassName="min-h-[80px]"
        required
      />

      <SmartInput
        type="tel"
        name="emergencyContact"
        label="Emergency Contact"
        placeholder="+49 123 456789"
        value={formState.emergencyContact?.value || ''}
        onChange={(value) => {
          setFieldValue('emergencyContact', value);
          validate('emergencyContact', value);
        }}
        error={getFieldError('emergencyContact')}
        isValid={formState.emergencyContact?.validation?.isValid}
      />

      <button
        type="submit"
        disabled={!isValid}
        className={`
          w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200
          ${isValid
            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-lg transform hover:-translate-y-0.5'
            : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          }
        `}
      >
        Schedule Appointment
      </button>
    </form>
  );
};

// ============================================
// SALON BOOKING FORM
// ============================================

export const SalonBookingForm: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  
  const {
    formState,
    progress,
    isValid,
    setFieldValue,
    validate,
    validateAll,
    getFieldError,
    getFieldWarning,
    getFieldSuggestion,
    getAutocomplete
  } = useSmartValidation(
    ['name', 'email', 'phone', 'date', 'time', 'service', 'stylistPreference', 'allergies'],
    { industry: 'salon' as IndustryType }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAll()) {
      setSubmitted(true);
      console.log('Salon booking submitted:', formState);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Scissors className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Appointment Booked!
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          We look forward to seeing you!
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white p-4 rounded-lg mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Scissors className="w-6 h-6" />
          Salon Appointment
        </h2>
        <p className="text-pink-100 mt-1">Book your beauty appointment</p>
      </div>

      <SmartFormProgress progress={progress} className="mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SmartInput
          name="name"
          label="Your Name"
          placeholder="Jane Doe"
          value={formState.name?.value || ''}
          onChange={(value) => {
            setFieldValue('name', value);
            validate('name', value);
          }}
          error={getFieldError('name')}
          warning={getFieldWarning('name')}
          suggestion={getFieldSuggestion('name')}
          isValid={formState.name?.validation?.isValid}
          isValidating={formState.name?.validation?.isValidating}
          feedback={formState.name?.validation?.feedback}
          required
        />

        <SmartInput
          type="email"
          name="email"
          label="Email Address"
          placeholder="jane@example.com"
          value={formState.email?.value || ''}
          onChange={(value) => {
            setFieldValue('email', value);
            validate('email', value);
          }}
          error={getFieldError('email')}
          warning={getFieldWarning('email')}
          suggestion={getFieldSuggestion('email')}
          isValid={formState.email?.validation?.isValid}
          isValidating={formState.email?.validation?.isValidating}
          feedback={formState.email?.validation?.feedback}
          required
        />

        <SmartInput
          type="tel"
          name="phone"
          label="Phone Number"
          placeholder="+49 123 456789"
          value={formState.phone?.value || ''}
          onChange={(value) => {
            setFieldValue('phone', value);
            validate('phone', value);
          }}
          error={getFieldError('phone')}
          warning={getFieldWarning('phone')}
          suggestion={getFieldSuggestion('phone')}
          isValid={formState.phone?.validation?.isValid}
          isValidating={formState.phone?.validation?.isValidating}
          feedback={formState.phone?.validation?.feedback}
          required
        />

        <SmartInput
          name="service"
          label="Service"
          placeholder="Haircut, Color, etc."
          value={formState.service?.value || ''}
          onChange={(value) => {
            setFieldValue('service', value);
            validate('service', value);
          }}
          autocompleteOptions={getAutocomplete('service')}
          error={getFieldError('service')}
          warning={getFieldWarning('service')}
          isValid={formState.service?.validation?.isValid}
          required
        />

        <SmartInput
          type="date"
          name="date"
          label="Preferred Date"
          value={formState.date?.value || ''}
          onChange={(value) => {
            setFieldValue('date', value);
            validate('date', value);
          }}
          error={getFieldError('date')}
          warning={getFieldWarning('date')}
          isValid={formState.date?.validation?.isValid}
          isValidating={formState.date?.validation?.isValidating}
          required
        />

        <SmartInput
          type="time"
          name="time"
          label="Preferred Time"
          value={formState.time?.value || ''}
          onChange={(value) => {
            setFieldValue('time', value);
            validate('time', value);
          }}
          error={getFieldError('time')}
          warning={getFieldWarning('time')}
          isValid={formState.time?.validation?.isValid}
          isValidating={formState.time?.validation?.isValidating}
          required
        />
      </div>

      <SmartInput
        name="stylistPreference"
        label="Stylist Preference"
        placeholder="Any stylist or specific name"
        value={formState.stylistPreference?.value || ''}
        onChange={(value) => {
          setFieldValue('stylistPreference', value);
          validate('stylistPreference', value);
        }}
        autocompleteOptions={getAutocomplete('stylistPreference')}
        isValid={formState.stylistPreference?.validation?.isValid}
      />

      <SmartInput
        name="allergies"
        label="Allergies or Sensitivities"
        placeholder="Any allergies to hair products?"
        value={formState.allergies?.value || ''}
        onChange={(value) => {
          setFieldValue('allergies', value);
          validate('allergies', value);
        }}
        warning={getFieldWarning('allergies')}
        isValid={formState.allergies?.validation?.isValid}
      />

      <button
        type="submit"
        disabled={!isValid}
        className={`
          w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200
          ${isValid
            ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:shadow-lg transform hover:-translate-y-0.5'
            : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          }
        `}
      >
        Book Appointment
      </button>
    </form>
  );
};

// ============================================
// AUTOMOTIVE SERVICE FORM
// ============================================

export const AutomotiveServiceForm: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  
  const {
    formState,
    progress,
    isValid,
    setFieldValue,
    validate,
    validateAll,
    getFieldError,
    getFieldWarning,
    getFieldSuggestion,
    getAutocomplete
  } = useSmartValidation(
    ['name', 'email', 'phone', 'date', 'time', 'licensePlate', 'vin', 'serviceType', 'mileage'],
    { industry: 'automotive' as IndustryType }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAll()) {
      setSubmitted(true);
      console.log('Automotive service submitted:', formState);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Car className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Service Scheduled!
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          We'll see you at the scheduled time.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gradient-to-r from-gray-700 to-gray-900 text-white p-4 rounded-lg mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Car className="w-6 h-6" />
          Automotive Service
        </h2>
        <p className="text-gray-300 mt-1">Schedule your vehicle service</p>
      </div>

      <SmartFormProgress progress={progress} className="mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SmartInput
          name="name"
          label="Your Name"
          placeholder="John Doe"
          value={formState.name?.value || ''}
          onChange={(value) => {
            setFieldValue('name', value);
            validate('name', value);
          }}
          error={getFieldError('name')}
          warning={getFieldWarning('name')}
          suggestion={getFieldSuggestion('name')}
          isValid={formState.name?.validation?.isValid}
          isValidating={formState.name?.validation?.isValidating}
          feedback={formState.name?.validation?.feedback}
          required
        />

        <SmartInput
          type="email"
          name="email"
          label="Email Address"
          placeholder="john@example.com"
          value={formState.email?.value || ''}
          onChange={(value) => {
            setFieldValue('email', value);
            validate('email', value);
          }}
          error={getFieldError('email')}
          warning={getFieldWarning('email')}
          suggestion={getFieldSuggestion('email')}
          isValid={formState.email?.validation?.isValid}
          isValidating={formState.email?.validation?.isValidating}
          feedback={formState.email?.validation?.feedback}
          required
        />

        <SmartInput
          type="tel"
          name="phone"
          label="Phone Number"
          placeholder="+49 123 456789"
          value={formState.phone?.value || ''}
          onChange={(value) => {
            setFieldValue('phone', value);
            validate('phone', value);
          }}
          error={getFieldError('phone')}
          warning={getFieldWarning('phone')}
          suggestion={getFieldSuggestion('phone')}
          isValid={formState.phone?.validation?.isValid}
          isValidating={formState.phone?.validation?.isValidating}
          feedback={formState.phone?.validation?.feedback}
          required
        />

        <SmartInput
          name="licensePlate"
          label="License Plate"
          placeholder="WI-AB 1234"
          value={formState.licensePlate?.value || ''}
          onChange={(value) => {
            setFieldValue('licensePlate', value);
            validate('licensePlate', value);
          }}
          error={getFieldError('licensePlate')}
          isValid={formState.licensePlate?.validation?.isValid}
          isValidating={formState.licensePlate?.validation?.isValidating}
          icon={<Car className="w-4 h-4" />}
          required
        />

        <SmartInput
          type="date"
          name="date"
          label="Service Date"
          value={formState.date?.value || ''}
          onChange={(value) => {
            setFieldValue('date', value);
            validate('date', value);
          }}
          error={getFieldError('date')}
          warning={getFieldWarning('date')}
          isValid={formState.date?.validation?.isValid}
          isValidating={formState.date?.validation?.isValidating}
          required
        />

        <SmartInput
          type="time"
          name="time"
          label="Drop-off Time"
          value={formState.time?.value || ''}
          onChange={(value) => {
            setFieldValue('time', value);
            validate('time', value);
          }}
          error={getFieldError('time')}
          warning={getFieldWarning('time')}
          isValid={formState.time?.validation?.isValid}
          isValidating={formState.time?.validation?.isValidating}
          required
        />
      </div>

      <SmartInput
        name="vin"
        label="VIN (Vehicle Identification Number)"
        placeholder="WBA1234567890"
        value={formState.vin?.value || ''}
        onChange={(value) => {
          setFieldValue('vin', value);
          validate('vin', value);
        }}
        error={getFieldError('vin')}
        isValid={formState.vin?.validation?.isValid}
      />

      <SmartInput
        name="serviceType"
        label="Service Type"
        placeholder="Oil change, Inspection, etc."
        value={formState.serviceType?.value || ''}
        onChange={(value) => {
          setFieldValue('serviceType', value);
          validate('serviceType', value);
        }}
        autocompleteOptions={getAutocomplete('serviceType')}
        error={getFieldError('serviceType')}
        isValid={formState.serviceType?.validation?.isValid}
        required
      />

      <SmartInput
        type="number"
        name="mileage"
        label="Current Mileage"
        placeholder="50000"
        value={formState.mileage?.value || ''}
        onChange={(value) => {
          setFieldValue('mileage', value);
          validate('mileage', value);
        }}
        isValid={formState.mileage?.validation?.isValid}
      />

      <button
        type="submit"
        disabled={!isValid}
        className={`
          w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200
          ${isValid
            ? 'bg-gradient-to-r from-gray-700 to-gray-900 text-white hover:shadow-lg transform hover:-translate-y-0.5'
            : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          }
        `}
      >
        Schedule Service
      </button>
    </form>
  );
};

export default {
  RestaurantBookingForm,
  MedicalAppointmentForm,
  SalonBookingForm,
  AutomotiveServiceForm
};