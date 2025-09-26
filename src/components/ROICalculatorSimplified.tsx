import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Clock, Euro, Users, 
  Sparkles, ArrowRight, Zap
} from 'lucide-react';
import { useLanguage } from '../providers/LanguageProvider';

const ROICalculatorSimplified: React.FC = () => {
  const { t, language } = useLanguage();
  
  // Simplified inputs - only 3 essential fields
  const [inputs, setInputs] = useState({
    monthlyBookings: 100,
    avgBookingValue: 50,
    hoursPerWeek: 10
  });

  const [results, setResults] = useState({
    monthlySavings: 0,
    yearlySavings: 0,
    hoursSaved: 0,
    roi: 0
  });

  // Calculate ROI in real-time
  useEffect(() => {
    const { monthlyBookings, avgBookingValue, hoursPerWeek } = inputs;
    
    // Revenue calculations - more conservative
    const monthlyRevenue = monthlyBookings * avgBookingValue;
    // Diminishing returns: higher revenue = lower percentage gain
    const revenueMultiplier = monthlyRevenue > 10000 ? 0.05 : 
                             monthlyRevenue > 5000 ? 0.08 : 0.10;
    const increasedRevenue = monthlyRevenue * revenueMultiplier;
    
    // Time savings - more realistic
    const actualHoursSaved = Math.min(hoursPerWeek * 0.6, 15); // Max 15 hours/week saved
    const monthlyHoursSaved = actualHoursSaved * 4;
    const hourlyCost = 15; // More reasonable hourly cost for admin work
    const timeSavings = monthlyHoursSaved * hourlyCost;
    
    // Reduced no-show savings (3% improvement on bookings)
    const noShowSavings = monthlyBookings * avgBookingValue * 0.03;
    
    // Total savings
    const totalMonthlySavings = increasedRevenue + timeSavings + noShowSavings;
    const yearlyTotal = totalMonthlySavings * 12;
    
    // ROI calculation (assuming €99/month cost)
    const monthlyCost = 99;
    let roiPercent = ((totalMonthlySavings - monthlyCost) / monthlyCost) * 100;
    
    // Cap ROI at 200% for credibility
    roiPercent = Math.min(roiPercent, 200);
    
    setResults({
      monthlySavings: Math.round(totalMonthlySavings),
      yearlySavings: Math.round(yearlyTotal),
      hoursSaved: Math.round(monthlyHoursSaved * 12),
      roi: Math.round(Math.max(roiPercent, 10)) // Minimum 10% ROI
    });
  }, [inputs]);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat(language === 'de' ? 'de-DE' : 'en-US').format(num);
  };

  return (
    <section className="py-12 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-xl rounded-2xl border border-white/10 mb-6">
            <TrendingUp className="h-8 w-8 text-purple-400" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              {language === 'de' ? 'ROI in 30 Sekunden' : 'ROI in 30 Seconds'}
            </span>
          </h2>
          <p className="text-xl text-gray-300">
            {language === 'de' 
              ? 'Sehen Sie Ihre Einsparungen mit nur 3 Eingaben' 
              : 'See your savings with just 3 inputs'}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-3xl border border-white/10 p-6"
          >
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Zap className="h-6 w-6 text-yellow-400" />
              {language === 'de' ? 'Ihre Daten' : 'Your Data'}
            </h3>

            <div className="space-y-8">
              {/* Monthly Bookings */}
              <div>
                <div className="flex justify-between mb-3">
                  <label className="text-white font-medium">
                    {language === 'de' ? 'Buchungen pro Monat' : 'Monthly Bookings'}
                  </label>
                  <span className="text-purple-400 font-bold text-xl">
                    {inputs.monthlyBookings}
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="500"
                  value={inputs.monthlyBookings}
                  onChange={(e) => setInputs({...inputs, monthlyBookings: parseInt(e.target.value)})}
                  className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #9333ea 0%, #9333ea ${(inputs.monthlyBookings - 10) / 490 * 100}%, rgba(255,255,255,0.1) ${(inputs.monthlyBookings - 10) / 490 * 100}%, rgba(255,255,255,0.1) 100%)`
                  }}
                />
                <div className="flex justify-between mt-2 text-xs text-gray-400">
                  <span>10</span>
                  <span>500</span>
                </div>
              </div>

              {/* Average Booking Value */}
              <div>
                <div className="flex justify-between mb-3">
                  <label className="text-white font-medium">
                    {language === 'de' ? 'Durchschnittlicher Buchungswert' : 'Average Booking Value'}
                  </label>
                  <span className="text-purple-400 font-bold text-xl">
                    €{inputs.avgBookingValue}
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="200"
                  value={inputs.avgBookingValue}
                  onChange={(e) => setInputs({...inputs, avgBookingValue: parseInt(e.target.value)})}
                  className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(inputs.avgBookingValue - 10) / 190 * 100}%, rgba(255,255,255,0.1) ${(inputs.avgBookingValue - 10) / 190 * 100}%, rgba(255,255,255,0.1) 100%)`
                  }}
                />
                <div className="flex justify-between mt-2 text-xs text-gray-400">
                  <span>€10</span>
                  <span>€200</span>
                </div>
              </div>

              {/* Hours per Week */}
              <div>
                <div className="flex justify-between mb-3">
                  <label className="text-white font-medium">
                    {language === 'de' ? 'Stunden pro Woche für Buchungen' : 'Hours per Week on Bookings'}
                  </label>
                  <span className="text-purple-400 font-bold text-xl">
                    {inputs.hoursPerWeek}h
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="40"
                  value={inputs.hoursPerWeek}
                  onChange={(e) => setInputs({...inputs, hoursPerWeek: parseInt(e.target.value)})}
                  className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #10b981 0%, #10b981 ${(inputs.hoursPerWeek - 1) / 39 * 100}%, rgba(255,255,255,0.1) ${(inputs.hoursPerWeek - 1) / 39 * 100}%, rgba(255,255,255,0.1) 100%)`
                  }}
                />
                <div className="flex justify-between mt-2 text-xs text-gray-400">
                  <span>1h</span>
                  <span>40h</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Results Panel */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-purple-600/10 to-blue-600/10 backdrop-blur-xl rounded-3xl border border-purple-500/20 p-8"
          >
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-yellow-400" />
              {language === 'de' ? 'Ihre Einsparungen' : 'Your Savings'}
            </h3>

            <div className="space-y-6">
              {/* Monthly Savings */}
              <motion.div 
                key={results.monthlySavings}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-2xl p-6 border border-green-500/30"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm mb-1">
                      {language === 'de' ? 'Monatliche Einsparungen' : 'Monthly Savings'}
                    </p>
                    <p className="text-3xl font-bold text-white">
                      €{formatNumber(results.monthlySavings)}
                    </p>
                  </div>
                  <Euro className="h-10 w-10 text-green-400" />
                </div>
              </motion.div>

              {/* Yearly Savings */}
              <motion.div 
                key={results.yearlySavings}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl p-6 border border-purple-500/30"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm mb-1">
                      {language === 'de' ? 'Jährliche Einsparungen' : 'Yearly Savings'}
                    </p>
                    <p className="text-4xl font-bold text-white">
                      €{formatNumber(results.yearlySavings)}
                    </p>
                  </div>
                  <TrendingUp className="h-10 w-10 text-purple-400" />
                </div>
              </motion.div>

              <div className="grid grid-cols-2 gap-4">
                {/* Hours Saved */}
                <motion.div 
                  key={results.hoursSaved}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-xl p-4 border border-blue-500/30"
                >
                  <Clock className="h-6 w-6 text-blue-400 mb-2" />
                  <p className="text-2xl font-bold text-white">
                    {formatNumber(results.hoursSaved)}h
                  </p>
                  <p className="text-xs text-gray-400">
                    {language === 'de' ? 'Stunden gespart/Jahr' : 'Hours saved/year'}
                  </p>
                </motion.div>

                {/* ROI */}
                <motion.div 
                  key={results.roi}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-xl p-4 border border-yellow-500/30"
                >
                  <Zap className="h-6 w-6 text-yellow-400 mb-2" />
                  <p className="text-2xl font-bold text-white">
                    {results.roi}%
                  </p>
                  <p className="text-xs text-gray-400">
                    ROI
                  </p>
                </motion.div>
              </div>

              {/* CTA Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.dispatchEvent(new CustomEvent('openBookingModal'))}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 flex items-center justify-center gap-2 mt-6"
              >
                {language === 'de' 
                  ? 'Jetzt €99/Monat sparen' 
                  : 'Start Saving €99/month'}
                <ArrowRight className="h-5 w-5" />
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Trust Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mt-8"
        >
          <p className="text-gray-400 text-sm">
            {language === 'de' 
              ? '✓ 14 Tage kostenlos testen • ✓ Keine Kreditkarte erforderlich • ✓ Jederzeit kündbar' 
              : '✓ 14-day free trial • ✓ No credit card required • ✓ Cancel anytime'}
          </p>
        </motion.div>
      </div>

      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 20px rgba(147, 51, 234, 0.5);
        }
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 20px rgba(147, 51, 234, 0.5);
        }
      `}</style>
    </section>
  );
};

export default ROICalculatorSimplified;