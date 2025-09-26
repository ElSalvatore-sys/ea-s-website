import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  Users,
  Clock,
  DollarSign,
  ShoppingCart,
  Activity,
  Eye,
  Target,
  BarChart3,
  PieChart,
  LineChart,
  Calendar
} from 'lucide-react';
import { gdprAnalytics } from '../../lib/gdpr-analytics';
import { FUNNEL_STAGES } from '../../lib/analytics/event-definitions';

interface DashboardMetrics {
  realTimeUsers: number;
  todayBookings: number;
  conversionRate: number;
  averageOrderValue: number;
  abandonmentRate: number;
  totalRevenue: number;
  peakHour: string;
  topService: string;
}

interface FunnelData {
  stage: string;
  count: number;
  percentage: number;
}

interface RecentBooking {
  id: string;
  service: string;
  customer: string;
  time: string;
  value: number;
  status: 'pending' | 'confirmed' | 'completed';
}

const AnalyticsDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    realTimeUsers: 0,
    todayBookings: 0,
    conversionRate: 0,
    averageOrderValue: 0,
    abandonmentRate: 0,
    totalRevenue: 0,
    peakHour: '14:00',
    topService: 'Smart Home Consultation'
  });

  const [funnelData, setFunnelData] = useState<FunnelData[]>([]);
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('today');
  const [isLive, setIsLive] = useState(true);

  // Simulate real-time data updates
  useEffect(() => {
    if (!isLive) return;

    const updateMetrics = () => {
      setMetrics(prev => ({
        realTimeUsers: Math.max(1, prev.realTimeUsers + Math.floor(Math.random() * 3 - 1)),
        todayBookings: prev.todayBookings + (Math.random() > 0.7 ? 1 : 0),
        conversionRate: Math.min(100, Math.max(0, prev.conversionRate + (Math.random() - 0.5) * 2)),
        averageOrderValue: Math.max(50, prev.averageOrderValue + (Math.random() - 0.5) * 5),
        abandonmentRate: Math.min(100, Math.max(0, prev.abandonmentRate + (Math.random() - 0.5) * 1)),
        totalRevenue: prev.totalRevenue + (Math.random() > 0.6 ? Math.floor(Math.random() * 200 + 50) : 0),
        peakHour: prev.peakHour,
        topService: prev.topService
      }));
    };

    // Initialize with realistic data
    setMetrics({
      realTimeUsers: Math.floor(Math.random() * 20 + 5),
      todayBookings: Math.floor(Math.random() * 30 + 10),
      conversionRate: Math.random() * 30 + 10,
      averageOrderValue: Math.random() * 100 + 80,
      abandonmentRate: Math.random() * 30 + 20,
      totalRevenue: Math.floor(Math.random() * 5000 + 2000),
      peakHour: '14:00',
      topService: 'Smart Home Consultation'
    });

    // Initialize funnel data
    const stages = FUNNEL_STAGES.map((stage, index) => ({
      stage: stage.name,
      count: Math.floor(Math.random() * 100 * Math.pow(0.7, index) + 50),
      percentage: 100 * Math.pow(0.7, index)
    }));
    setFunnelData(stages);

    // Initialize recent bookings
    const bookings: RecentBooking[] = [
      {
        id: '1',
        service: 'Smart Home Consultation',
        customer: 'Maria S.',
        time: '2 min ago',
        value: 149,
        status: 'confirmed'
      },
      {
        id: '2',
        service: 'Restaurant AI Setup',
        customer: 'Thomas K.',
        time: '15 min ago',
        value: 299,
        status: 'completed'
      },
      {
        id: '3',
        service: 'Business Automation',
        customer: 'Lisa M.',
        time: '1 hour ago',
        value: 199,
        status: 'pending'
      }
    ];
    setRecentBookings(bookings);

    const interval = setInterval(updateMetrics, 3000);
    return () => clearInterval(interval);
  }, [isLive]);

  // Add new booking simulation
  useEffect(() => {
    if (!isLive) return;

    const addBooking = () => {
      const services = ['Smart Home Consultation', 'Restaurant AI Setup', 'Business Automation'];
      const names = ['Anna B.', 'Max P.', 'Julia R.', 'Stefan H.', 'Nina W.'];
      const statuses: ('pending' | 'confirmed' | 'completed')[] = ['pending', 'confirmed', 'completed'];

      const newBooking: RecentBooking = {
        id: Date.now().toString(),
        service: services[Math.floor(Math.random() * services.length)],
        customer: names[Math.floor(Math.random() * names.length)],
        time: 'just now',
        value: Math.floor(Math.random() * 200 + 100),
        status: statuses[Math.floor(Math.random() * statuses.length)]
      };

      setRecentBookings(prev => [newBooking, ...prev.slice(0, 4)]);
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        addBooking();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [isLive]);

  // Render metric card
  const MetricCard = ({
    icon,
    label,
    value,
    change,
    color = 'purple'
  }: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    change?: string;
    color?: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/50 backdrop-blur-lg border border-white/10 rounded-xl p-4"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm mb-1">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${
              change.startsWith('+') ? 'text-green-400' : 'text-red-400'
            }`}>
              {change} from yesterday
            </p>
          )}
        </div>
        <div className={`p-2 bg-${color}-900/30 rounded-lg text-${color}-400`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );

  // Render funnel visualization
  const renderFunnel = () => (
    <div className="bg-gray-800/50 backdrop-blur-lg border border-white/10 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Target className="w-5 h-5 text-purple-400" />
        Conversion Funnel
      </h3>
      <div className="space-y-3">
        {funnelData.map((stage, index) => (
          <div key={stage.stage}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-300">{stage.stage}</span>
              <span className="text-sm text-gray-400">
                {stage.count} ({stage.percentage.toFixed(1)}%)
              </span>
            </div>
            <div className="h-8 bg-gray-700 rounded-lg overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stage.percentage}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
                className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Render recent bookings feed
  const renderBookingsFeed = () => (
    <div className="bg-gray-800/50 backdrop-blur-lg border border-white/10 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5 text-green-400" />
        Live Booking Feed
        {isLive && (
          <span className="ml-2 px-2 py-0.5 bg-green-900/30 text-green-400 text-xs rounded-full animate-pulse">
            LIVE
          </span>
        )}
      </h3>
      <div className="space-y-3">
        <AnimatePresence>
          {recentBookings.map((booking, index) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-white/5"
            >
              <div className="flex-1">
                <p className="text-white font-medium">{booking.customer}</p>
                <p className="text-gray-400 text-sm">{booking.service}</p>
                <p className="text-gray-500 text-xs mt-1">{booking.time}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-purple-400">€{booking.value}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  booking.status === 'completed'
                    ? 'bg-green-900/30 text-green-400'
                    : booking.status === 'confirmed'
                    ? 'bg-blue-900/30 text-blue-400'
                    : 'bg-yellow-900/30 text-yellow-400'
                }`}>
                  {booking.status}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );

  // Render heat map
  const renderHeatMap = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return (
      <div className="bg-gray-800/50 backdrop-blur-lg border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-orange-400" />
          Booking Heat Map
        </h3>
        <div className="grid grid-cols-25 gap-1 text-xs">
          <div></div>
          {hours.map(hour => (
            <div key={hour} className="text-center text-gray-500">
              {hour}
            </div>
          ))}
          {days.map(day => (
            <React.Fragment key={day}>
              <div className="text-gray-400 py-1">{day}</div>
              {hours.map(hour => {
                const intensity = Math.random();
                const color = intensity > 0.7
                  ? 'bg-purple-600'
                  : intensity > 0.4
                  ? 'bg-purple-700'
                  : intensity > 0.2
                  ? 'bg-purple-800'
                  : 'bg-gray-700';
                return (
                  <div
                    key={`${day}-${hour}`}
                    className={`h-6 rounded ${color} hover:opacity-80 cursor-pointer transition-opacity`}
                    title={`${day} ${hour}:00 - ${Math.floor(intensity * 10)} bookings`}
                  />
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
            <p className="text-gray-400">Real-time booking and conversion metrics</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Time range selector */}
            <div className="flex bg-gray-800 rounded-lg p-1">
              {(['today', 'week', 'month'] as const).map(range => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    timeRange === range
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>

            {/* Live toggle */}
            <button
              onClick={() => setIsLive(!isLive)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                isLive
                  ? 'bg-green-900/30 text-green-400 border border-green-500/30'
                  : 'bg-gray-800 text-gray-400 border border-white/10'
              }`}
            >
              <Activity className="w-4 h-4" />
              {isLive ? 'Live' : 'Paused'}
            </button>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            icon={<Users className="w-5 h-5" />}
            label="Real-time Users"
            value={metrics.realTimeUsers}
            change="+12%"
            color="blue"
          />
          <MetricCard
            icon={<ShoppingCart className="w-5 h-5" />}
            label="Today's Bookings"
            value={metrics.todayBookings}
            change="+8%"
            color="green"
          />
          <MetricCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="Conversion Rate"
            value={`${metrics.conversionRate.toFixed(1)}%`}
            change="+2.3%"
            color="purple"
          />
          <MetricCard
            icon={<DollarSign className="w-5 h-5" />}
            label="Total Revenue"
            value={`€${metrics.totalRevenue.toLocaleString()}`}
            change="+15%"
            color="yellow"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversion Funnel */}
          <div className="lg:col-span-2">
            {renderFunnel()}
          </div>

          {/* Live Booking Feed */}
          <div>
            {renderBookingsFeed()}
          </div>

          {/* Heat Map */}
          <div className="lg:col-span-3">
            {renderHeatMap()}
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-gray-800/50 backdrop-blur-lg border border-white/10 rounded-xl p-4">
            <p className="text-gray-400 text-sm mb-2">Average Order Value</p>
            <p className="text-3xl font-bold text-white">
              €{metrics.averageOrderValue.toFixed(0)}
            </p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-lg border border-white/10 rounded-xl p-4">
            <p className="text-gray-400 text-sm mb-2">Abandonment Rate</p>
            <p className="text-3xl font-bold text-orange-400">
              {metrics.abandonmentRate.toFixed(1)}%
            </p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-lg border border-white/10 rounded-xl p-4">
            <p className="text-gray-400 text-sm mb-2">Peak Hour</p>
            <p className="text-3xl font-bold text-white">
              {metrics.peakHour}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;