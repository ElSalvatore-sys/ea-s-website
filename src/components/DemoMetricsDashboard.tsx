import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, Users, Clock, CheckCircle, Activity,
  DollarSign, Calendar, ArrowUp, ArrowDown, Minus,
  Star, Award, Target, Zap, BarChart3
} from 'lucide-react';
import { useLanguage } from '../providers/LanguageProvider';

interface Metric {
  label: string;
  value: number | string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ElementType;
  color: string;
  suffix?: string;
  prefix?: string;
}

const DemoMetricsDashboard: React.FC = () => {
  const { language } = useLanguage();

  // Real-time metrics state
  const [metrics, setMetrics] = useState<Metric[]>([
    {
      label: language === 'de' ? 'Heutige Buchungen' : 'Today\'s Bookings',
      value: 47,
      change: 15.2,
      trend: 'up',
      icon: Calendar,
      color: 'from-purple-600 to-blue-600',
      suffix: ''
    },
    {
      label: language === 'de' ? 'Umsatz' : 'Revenue',
      value: 3847,
      change: 22.5,
      trend: 'up',
      icon: DollarSign,
      color: 'from-green-600 to-emerald-600',
      prefix: '€'
    },
    {
      label: language === 'de' ? 'Durchschn. Bewertung' : 'Avg. Rating',
      value: 4.9,
      change: 0.2,
      trend: 'up',
      icon: Star,
      color: 'from-yellow-600 to-orange-600',
      suffix: '/5'
    },
    {
      label: language === 'de' ? 'Antwortzeit' : 'Response Time',
      value: 0.8,
      change: -25,
      trend: 'down',
      icon: Clock,
      color: 'from-blue-600 to-indigo-600',
      suffix: 's'
    },
    {
      label: language === 'de' ? 'Erfolgsrate' : 'Success Rate',
      value: 98.5,
      change: 2.1,
      trend: 'up',
      icon: CheckCircle,
      color: 'from-green-600 to-teal-600',
      suffix: '%'
    },
    {
      label: language === 'de' ? 'Aktive Nutzer' : 'Active Users',
      value: 1247,
      change: 0,
      trend: 'stable',
      icon: Users,
      color: 'from-purple-600 to-pink-600',
      suffix: ''
    }
  ]);

  // Real-time activity feed
  const [activities, setActivities] = useState([
    {
      id: 1,
      type: 'booking',
      message: language === 'de'
        ? 'Neue Buchung: Restaurant Zum Goldenen Hirsch'
        : 'New booking: Restaurant Zum Goldenen Hirsch',
      time: '2 min',
      icon: Calendar,
      color: 'text-green-400'
    },
    {
      id: 2,
      type: 'rating',
      message: language === 'de'
        ? '5-Sterne Bewertung von Maria Schmidt'
        : '5-star rating from Maria Schmidt',
      time: '5 min',
      icon: Star,
      color: 'text-yellow-400'
    },
    {
      id: 3,
      type: 'milestone',
      message: language === 'de'
        ? '1000. Buchung heute erreicht!'
        : '1000th booking reached today!',
      time: '12 min',
      icon: Award,
      color: 'text-purple-400'
    }
  ]);

  // Hourly booking chart data
  const [chartData, setChartData] = useState([
    { hour: '08', bookings: 12 },
    { hour: '09', bookings: 18 },
    { hour: '10', bookings: 25 },
    { hour: '11', bookings: 22 },
    { hour: '13', bookings: 28 },
    { hour: '14', bookings: 35 },
    { hour: '15', bookings: 32 },
    { hour: '16', bookings: 29 },
    { hour: '17', bookings: 24 }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update metrics
      setMetrics(prev => prev.map(metric => {
        const changeAmount = (Math.random() - 0.3) * 5;
        let newValue = metric.value;

        if (typeof newValue === 'number') {
          if (metric.prefix === '€') {
            newValue = Math.max(0, Number(newValue) + Math.floor(Math.random() * 100));
          } else if (metric.suffix === '%') {
            newValue = Math.min(100, Math.max(0, Number(newValue) + changeAmount / 10));
          } else if (metric.suffix === 's') {
            newValue = Math.max(0.1, Number(newValue) + changeAmount / 100);
          } else if (metric.suffix === '/5') {
            newValue = Math.min(5, Math.max(3, Number(newValue) + changeAmount / 100));
          } else {
            newValue = Math.max(0, Number(newValue) + Math.floor(Math.random() * 5));
          }
        }

        const newChange = changeAmount;
        const newTrend = newChange > 0.5 ? 'up' : newChange < -0.5 ? 'down' : 'stable';

        return {
          ...metric,
          value: typeof newValue === 'number' ? Math.round(newValue * 10) / 10 : newValue,
          change: Math.round(newChange * 10) / 10,
          trend: newTrend as 'up' | 'down' | 'stable'
        };
      }));

      // Update chart data
      setChartData(prev => prev.map(data => ({
        ...data,
        bookings: Math.max(5, data.bookings + Math.floor((Math.random() - 0.5) * 5))
      })));

      // Add new activity occasionally
      if (Math.random() > 0.7) {
        const newActivities = [
          {
            type: 'booking',
            message: language === 'de'
              ? `Neue Buchung: ${['Salon Berlin', 'Dr. Schmidt Praxis', 'AutoHaus München'][Math.floor(Math.random() * 3)]}`
              : `New booking: ${['Salon Berlin', 'Dr. Schmidt Practice', 'AutoHaus Munich'][Math.floor(Math.random() * 3)]}`,
            icon: Calendar,
            color: 'text-green-400'
          },
          {
            type: 'rating',
            message: language === 'de'
              ? `${Math.floor(Math.random() * 2) + 4}-Sterne Bewertung erhalten`
              : `${Math.floor(Math.random() * 2) + 4}-star rating received`,
            icon: Star,
            color: 'text-yellow-400'
          },
          {
            type: 'user',
            message: language === 'de'
              ? 'Neuer Nutzer registriert'
              : 'New user registered',
            icon: Users,
            color: 'text-blue-400'
          }
        ];

        const newActivity = {
          id: Date.now(),
          ...newActivities[Math.floor(Math.random() * newActivities.length)],
          time: language === 'de' ? 'Gerade eben' : 'Just now'
        };

        setActivities(prev => [newActivity, ...prev].slice(0, 5));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [language]);

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="h-4 w-4 text-green-400" />;
      case 'down':
        return <ArrowDown className="h-4 w-4 text-red-400" />;
      case 'stable':
        return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable', isGood: boolean = true) => {
    if (trend === 'stable') return 'text-gray-400';
    if (trend === 'up') return isGood ? 'text-green-400' : 'text-red-400';
    return isGood ? 'text-red-400' : 'text-green-400';
  };

  return (
    <div className="space-y-8">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 bg-gradient-to-r ${metric.color} rounded-xl`}>
                <metric.icon className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center gap-1">
                {getTrendIcon(metric.trend)}
                <span className={`text-sm font-medium ${
                  getTrendColor(metric.trend, metric.label !== 'Response Time')
                }`}>
                  {Math.abs(metric.change)}%
                </span>
              </div>
            </div>

            <div className="text-3xl font-bold text-white mb-1">
              {metric.prefix}{metric.value}{metric.suffix}
            </div>
            <div className="text-sm text-gray-400">{metric.label}</div>

            {/* Mini sparkline */}
            <div className="mt-4 flex items-end gap-1 h-8">
              {[...Array(7)].map((_, i) => (
                <motion.div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-purple-600/50 to-blue-600/50 rounded-t"
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.random() * 100}%` }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Chart and Activity Feed */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Booking Chart */}
        <div className="lg:col-span-2 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-400" />
              {language === 'de' ? 'Buchungen nach Stunde' : 'Bookings by Hour'}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">
                {language === 'de' ? 'Heute' : 'Today'}
              </span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            </div>
          </div>

          <div className="flex items-end gap-2 h-48">
            {chartData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  className="w-full bg-gradient-to-t from-purple-600 to-blue-600 rounded-t hover:from-purple-500 hover:to-blue-500 transition-colors cursor-pointer relative group"
                  initial={{ height: 0 }}
                  animate={{ height: `${(data.bookings / 40) * 100}%` }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {data.bookings} {language === 'de' ? 'Buchungen' : 'bookings'}
                  </div>
                </motion.div>
                <span className="text-xs text-gray-400">{data.hour}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-purple-400" />
              <span className="text-gray-300">
                {language === 'de' ? 'Ziel: 300 Buchungen' : 'Target: 300 bookings'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-400" />
              <span className="text-gray-300">
                {language === 'de' ? 'Peak: 14:00-16:00' : 'Peak: 2PM-4PM'}
              </span>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-400" />
              {language === 'de' ? 'Live-Aktivität' : 'Live Activity'}
            </h3>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </div>

          <div className="space-y-4">
            {activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3"
              >
                <div className={`p-2 bg-black/30 rounded-lg ${activity.color}`}>
                  <activity.icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-300">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <button className="w-full mt-6 py-2 bg-white/5 text-gray-300 rounded-lg text-sm hover:bg-white/10 transition-colors">
            {language === 'de' ? 'Alle anzeigen' : 'View all'}
          </button>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-2xl p-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {language === 'de' ? 'Tagesleistung' : 'Today\'s Performance'}
            </h3>
            <p className="text-gray-300">
              {language === 'de'
                ? 'Ihr System läuft mit optimaler Effizienz'
                : 'Your system is running at optimal efficiency'}
            </p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              A+
            </div>
            <div className="text-sm text-gray-400 mt-1">
              {language === 'de' ? 'Bewertung' : 'Rating'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">247</div>
            <div className="text-xs text-gray-400">
              {language === 'de' ? 'Gesamtbuchungen' : 'Total Bookings'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">€18,450</div>
            <div className="text-xs text-gray-400">
              {language === 'de' ? 'Umsatz' : 'Revenue'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">4.92</div>
            <div className="text-xs text-gray-400">
              {language === 'de' ? 'Bewertung' : 'Rating'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoMetricsDashboard;