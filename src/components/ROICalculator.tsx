import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, Clock, Euro, Users, Calendar } from 'lucide-react';
import { useLanguage } from '../providers/LanguageProvider';

const ROICalculator: React.FC = () => {
  const { t } = useLanguage();

  // Calculator inputs
  const [businessSize, setBusinessSize] = useState(100); // appointments per month
  const [noShowRate, setNoShowRate] = useState(20); // percentage
  const [averageValue, setAverageValue] = useState(50); // euros per appointment
  const [hoursScheduling, setHoursScheduling] = useState(10); // hours per week on scheduling

  // Calculate ROI metrics
  const calculations = useMemo(() => {
    // Revenue recovered from reduced no-shows (70% reduction as stated)
    const currentNoShows = businessSize * (noShowRate / 100);
    const reducedNoShows = currentNoShows * 0.7; // 70% reduction
    const revenueRecovered = reducedNoShows * averageValue;

    // Time saved per month (4 weeks)
    const timeSavedMonthly = hoursScheduling * 4 * 0.8; // 80% time reduction
    const timeCostSaved = timeSavedMonthly * 35; // €35/hour average

    // Efficiency gains
    const additionalCapacity = timeSavedMonthly * 2; // 2 appointments per hour
    const additionalRevenue = additionalCapacity * averageValue;

    // Total monthly benefit
    const totalMonthlyBenefit = revenueRecovered + timeCostSaved + additionalRevenue;
    const yearlyBenefit = totalMonthlyBenefit * 12;
    const roi = ((totalMonthlyBenefit - 49) / 49) * 100; // Based on €49/month professional plan

    return {
      revenueRecovered: Math.round(revenueRecovered),
      timeSavedMonthly: Math.round(timeSavedMonthly),
      timeCostSaved: Math.round(timeCostSaved),
      additionalRevenue: Math.round(additionalRevenue),
      totalMonthlyBenefit: Math.round(totalMonthlyBenefit),
      yearlyBenefit: Math.round(yearlyBenefit),
      roi: Math.round(roi),
      paybackDays: Math.ceil(49 / (totalMonthlyBenefit / 30))
    };
  }, [businessSize, noShowRate, averageValue, hoursScheduling]);

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl">
          <Calculator className="w-6 h-6" />
        </div>
        <h3 className="text-2xl font-bold">{t('solutions.roi.title')}</h3>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div>
            <label className="flex items-center justify-between mb-2">
              <span className="text-gray-300">{t('solutions.roi.inputs.appointments')}</span>
              <span className="text-xl font-semibold text-purple-400">{businessSize}</span>
            </label>
            <input
              type="range"
              min="50"
              max="500"
              step="10"
              value={businessSize}
              onChange={(e) => setBusinessSize(Number(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #9333ea 0%, #9333ea ${((businessSize - 50) / 450) * 100}%, rgba(255,255,255,0.1) ${((businessSize - 50) / 450) * 100}%, rgba(255,255,255,0.1) 100%)`
              }}
            />
          </div>

          <div>
            <label className="flex items-center justify-between mb-2">
              <span className="text-gray-300">{t('solutions.roi.inputs.noShowRate')}</span>
              <span className="text-xl font-semibold text-purple-400">{noShowRate}%</span>
            </label>
            <input
              type="range"
              min="5"
              max="40"
              step="5"
              value={noShowRate}
              onChange={(e) => setNoShowRate(Number(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #9333ea 0%, #9333ea ${((noShowRate - 5) / 35) * 100}%, rgba(255,255,255,0.1) ${((noShowRate - 5) / 35) * 100}%, rgba(255,255,255,0.1) 100%)`
              }}
            />
          </div>

          <div>
            <label className="flex items-center justify-between mb-2">
              <span className="text-gray-300">{t('solutions.roi.inputs.averageValue')}</span>
              <span className="text-xl font-semibold text-purple-400">€{averageValue}</span>
            </label>
            <input
              type="range"
              min="20"
              max="200"
              step="10"
              value={averageValue}
              onChange={(e) => setAverageValue(Number(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #9333ea 0%, #9333ea ${((averageValue - 20) / 180) * 100}%, rgba(255,255,255,0.1) ${((averageValue - 20) / 180) * 100}%, rgba(255,255,255,0.1) 100%)`
              }}
            />
          </div>

          <div>
            <label className="flex items-center justify-between mb-2">
              <span className="text-gray-300">{t('solutions.roi.inputs.hoursScheduling')}</span>
              <span className="text-xl font-semibold text-purple-400">{hoursScheduling}h</span>
            </label>
            <input
              type="range"
              min="5"
              max="30"
              step="1"
              value={hoursScheduling}
              onChange={(e) => setHoursScheduling(Number(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #9333ea 0%, #9333ea ${((hoursScheduling - 5) / 25) * 100}%, rgba(255,255,255,0.1) ${((hoursScheduling - 5) / 25) * 100}%, rgba(255,255,255,0.1) 100%)`
              }}
            />
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          <motion.div
            key={calculations.totalMonthlyBenefit}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300">{t('solutions.roi.results.monthlyBenefit')}</span>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-green-400">
              €{calculations.totalMonthlyBenefit.toLocaleString()}
              <span className="text-sm text-gray-400 ml-2">/month</span>
            </div>
            <div className="text-sm text-gray-400 mt-1">
              {t('solutions.roi.results.yearlyBenefit')}: €{calculations.yearlyBenefit.toLocaleString()}
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <Euro className="w-5 h-5 text-blue-400 mb-2" />
              <div className="text-xl font-semibold">€{calculations.revenueRecovered}</div>
              <div className="text-xs text-gray-400">{t('solutions.roi.results.revenueRecovered')}</div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <Clock className="w-5 h-5 text-purple-400 mb-2" />
              <div className="text-xl font-semibold">{calculations.timeSavedMonthly}h</div>
              <div className="text-xs text-gray-400">{t('solutions.roi.results.timeSaved')}</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400">{t('solutions.roi.results.roi')}</div>
                <div className="text-2xl font-bold text-green-400">{calculations.roi}%</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400">{t('solutions.roi.results.payback')}</div>
                <div className="text-2xl font-bold text-green-400">
                  {calculations.paybackDays} {t('solutions.roi.results.days')}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            <p className="text-sm text-gray-400 mb-3">
              {t('solutions.roi.disclaimer')}
            </p>
            <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300">
              {t('solutions.roi.cta')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ROICalculator;