/**
 * Real-Time Analytics Dashboard Component
 * Displays comprehensive revenue intelligence metrics
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Eye, 
  Clock, 
  Target,
  Activity,
  Zap,
  Award,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { analytics } from '../lib/analytics';

interface AnalyticsMetric {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon: React.ElementType;
  color: string;
  description?: string;
}

const AnalyticsDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<AnalyticsMetric[]>([]);
  const [funnelData, setFunnelData] = useState<Record<string, number>>({});
  const [revenueAttribution, setRevenueAttribution] = useState<Record<string, number>>({});
  const [kfcEffectiveness, setKfcEffectiveness] = useState<Record<string, any>>({});
  const [cohortAnalysis, setCohortAnalysis] = useState<Record<string, any>>({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Update metrics every 5 seconds
    const interval = setInterval(updateMetrics, 5000);
    updateMetrics(); // Initial load

    return () => clearInterval(interval);
  }, []);

  const updateMetrics = () => {
    const sessionRevenue = analytics.getSessionRevenue();
    const sessionDuration = analytics.getSessionDuration();
    const pageViews = analytics.getPageViews();
    const trafficInfo = analytics.getTrafficInfo();
    const funnelRates = analytics.getFunnelConversionRates();
    const attribution = analytics.getRevenueAttribution();
    const kfcData = analytics.getKFCMentionEffectiveness();
    const cohort = analytics.getCohortAnalysis();

    setFunnelData(funnelRates);
    setRevenueAttribution(attribution);
    setKfcEffectiveness(kfcData);
    setCohortAnalysis(cohort);

    const newMetrics: AnalyticsMetric[] = [
      {
        title: 'Session Revenue',
        value: `€${sessionRevenue}`,
        change: Math.random() * 20 - 10, // Simulated change
        changeType: sessionRevenue > 100 ? 'increase' : 'neutral',
        icon: DollarSign,
        color: 'text-green-400',
        description: 'Total value generated this session'
      },
      {
        title: 'Predicted LTV',
        value: `€${cohort.predictedLTV || 0}`,
        change: Math.random() * 15,
        changeType: 'increase',
        icon: TrendingUp,
        color: 'text-blue-400',
        description: 'Predicted customer lifetime value'
      },
      {
        title: 'Engagement Score',
        value: cohort.engagementScore || 0,
        change: Math.random() * 10,
        changeType: cohort.engagementScore > 50 ? 'increase' : 'neutral',
        icon: Activity,
        color: 'text-purple-400',
        description: 'User engagement intensity'
      },
      {
        title: 'Time on Site',
        value: `${Math.round(sessionDuration / 1000 / 60)}m`,
        change: 0,
        changeType: 'neutral',
        icon: Clock,
        color: 'text-orange-400',
        description: 'Current session duration'
      },
      {
        title: 'Page Views',
        value: pageViews,
        change: 0,
        changeType: 'neutral',
        icon: Eye,
        color: 'text-indigo-400',
        description: 'Pages visited this session'
      },
      {
        title: 'KFC Influence',
        value: `${kfcData.kfcInfluenceScore || 0}%`,
        change: kfcData.kfcMentions > 0 ? 25 : 0,
        changeType: kfcData.kfcMentions > 0 ? 'increase' : 'neutral',
        icon: Award,
        color: 'text-yellow-400',
        description: 'Revenue attributed to KFC mentions'
      },
      {
        title: 'Funnel Progress',
        value: `${Object.keys(funnelRates).length}/5`,
        change: Object.keys(funnelRates).length > 2 ? 15 : 0,
        changeType: Object.keys(funnelRates).length > 2 ? 'increase' : 'neutral',
        icon: Target,
        color: 'text-pink-400',
        description: 'Funnel steps completed'
      },
      {
        title: 'Traffic Source',
        value: trafficInfo.source,
        icon: Users,
        color: 'text-cyan-400',
        description: `Medium: ${trafficInfo.medium}`
      }
    ];

    setMetrics(newMetrics);
  };

  const getChangeIcon = (changeType?: string) => {
    switch (changeType) {
      case 'increase': return <ArrowUp className="w-4 h-4 text-green-400" />;
      case 'decrease': return <ArrowDown className="w-4 h-4 text-red-400" />;
      default: return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatFunnelStep = (step: string) => {
    return step.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' → ');
  };

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="mb-2 p-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        title="Toggle Analytics Dashboard"
      >
        <BarChart3 className="w-6 h-6" />
      </button>

      {/* Dashboard Panel */}
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.9, x: 20 }}
          className="bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-6 w-96 max-h-[80vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-400" />
              Revenue Analytics
            </h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ×
            </button>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {metrics.map((metric, index) => {
              const IconComponent = metric.icon;
              return (
                <motion.div
                  key={metric.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 rounded-xl p-3 border border-white/10 hover:border-purple-500/30 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <IconComponent className={`w-5 h-5 ${metric.color}`} />
                    {metric.change !== undefined && (
                      <div className="flex items-center gap-1 text-xs">
                        {getChangeIcon(metric.changeType)}
                        <span className={
                          metric.changeType === 'increase' ? 'text-green-400' :
                          metric.changeType === 'decrease' ? 'text-red-400' :
                          'text-gray-400'
                        }>
                          {Math.abs(metric.change).toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="text-xl font-bold text-white mb-1">
                    {metric.value}
                  </div>
                  <div className="text-xs text-gray-400">
                    {metric.title}
                  </div>
                  {metric.description && (
                    <div className="text-xs text-gray-500 mt-1">
                      {metric.description}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Funnel Analysis */}
          {Object.keys(funnelData).length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-400" />
                Conversion Funnel
              </h4>
              <div className="space-y-2">
                {Object.entries(funnelData).map(([step, rate]) => (
                  <div key={step} className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">{formatFunnelStep(step)}</span>
                    <span className={`font-medium ${
                      rate > 50 ? 'text-green-400' : 
                      rate > 25 ? 'text-yellow-400' : 
                      'text-red-400'
                    }`}>
                      {rate.toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* KFC Effectiveness */}
          {kfcEffectiveness.kfcMentions > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                <Award className="w-4 h-4 text-yellow-400" />
                KFC Partnership Impact
              </h4>
              <div className="bg-yellow-500/10 rounded-lg p-3 border border-yellow-500/20">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Mentions</span>
                  <span className="text-white font-medium">{kfcEffectiveness.kfcMentions}</span>
                </div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Value Generated</span>
                  <span className="text-yellow-400 font-medium">€{kfcEffectiveness.valueFromKFCMentions}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Converted After KFC</span>
                  <span className={`font-medium ${kfcEffectiveness.convertedAfterKFCMention ? 'text-green-400' : 'text-gray-400'}`}>
                    {kfcEffectiveness.convertedAfterKFCMention ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Revenue Attribution */}
          {Object.values(revenueAttribution).some(val => val > 0) && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-400" />
                Revenue Attribution
              </h4>
              <div className="space-y-1">
                {Object.entries(revenueAttribution)
                  .filter(([_, value]) => value > 0)
                  .map(([source, value]) => (
                    <div key={source} className="flex items-center justify-between text-xs">
                      <span className="text-gray-400 capitalize">{source}</span>
                      <span className="text-green-400 font-medium">€{value}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Action Recommendations */}
          <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
            <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-purple-400" />
              AI Recommendations
            </h4>
            <div className="space-y-2 text-xs">
              {cohortAnalysis.engagementScore > 80 && (
                <div className="text-green-400">
                  🚀 High engagement detected - show premium features
                </div>
              )}
              {kfcEffectiveness.kfcMentions > 0 && !kfcEffectiveness.convertedAfterKFCMention && (
                <div className="text-yellow-400">
                  💡 KFC mention seen but no conversion - follow up needed
                </div>
              )}
              {metrics.find(m => m.title === 'Time on Site')?.value === '0m' ? null : (
                <div className="text-blue-400">
                  📊 Session duration indicates strong interest - optimize for conversion
                </div>
              )}
              {Object.keys(funnelData).length < 3 && (
                <div className="text-orange-400">
                  ⚡ User in early funnel stage - show value proposition
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 text-xs text-gray-500 text-center">
            Updates every 5 seconds • Revenue Intelligence by EA-S
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;