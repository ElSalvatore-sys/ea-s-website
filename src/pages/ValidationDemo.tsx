import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  RestaurantBookingForm,
  MedicalAppointmentForm,
  SalonBookingForm,
  AutomotiveServiceForm
} from '../components/IndustryBookingForms';
import { Utensils, Stethoscope, Scissors, Car } from 'lucide-react';

type IndustryTab = 'restaurant' | 'medical' | 'salon' | 'automotive';

const ValidationDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<IndustryTab>('restaurant');

  const tabs = [
    { id: 'restaurant' as IndustryTab, label: 'Restaurant', icon: Utensils, color: 'from-purple-600 to-blue-600' },
    { id: 'medical' as IndustryTab, label: 'Medical', icon: Stethoscope, color: 'from-blue-600 to-cyan-600' },
    { id: 'salon' as IndustryTab, label: 'Salon', icon: Scissors, color: 'from-pink-600 to-purple-600' },
    { id: 'automotive' as IndustryTab, label: 'Automotive', icon: Car, color: 'from-gray-700 to-gray-900' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Intelligent Form Validation Demo
          </h1>
          <p className="text-gray-400 text-lg">
            Experience smart, contextual validation tailored to your industry
          </p>
        </motion.div>

        {/* Industry Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  px-6 py-3 rounded-lg font-semibold transition-all duration-200
                  flex items-center gap-2
                  ${activeTab === tab.id
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                    : 'bg-white/10 text-gray-300 hover:bg-white/20 backdrop-blur-md'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </motion.button>
            );
          })}
        </div>

        {/* Form Container */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10"
        >
          {activeTab === 'restaurant' && <RestaurantBookingForm />}
          {activeTab === 'medical' && <MedicalAppointmentForm />}
          {activeTab === 'salon' && <SalonBookingForm />}
          {activeTab === 'automotive' && <AutomotiveServiceForm />}
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 border border-white/10">
            <h3 className="text-white font-semibold mb-2">🎯 Smart Detection</h3>
            <p className="text-gray-400 text-sm">
              Auto-detects country codes, formats phone numbers, and suggests corrections
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 border border-white/10">
            <h3 className="text-white font-semibold mb-2">✨ Real-time Feedback</h3>
            <p className="text-gray-400 text-sm">
              Instant validation with contextual messages and helpful suggestions
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 border border-white/10">
            <h3 className="text-white font-semibold mb-2">🏭 Industry Specific</h3>
            <p className="text-gray-400 text-sm">
              Tailored validation rules and autocomplete for each business type
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ValidationDemo;