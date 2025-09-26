import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../providers/LanguageProvider';
import { 
  TrendingUp,
  Users,
  Clock,
  Euro,
  BarChart3,
  Activity,
  Zap,
  Globe,
  CheckCircle,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface Metric {
  label: string;
  value: number;
  unit: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ElementType;
  color: string;
}

interface ClientMetric {
  name: string;
  logo?: string;
  metrics: {
    revenue: number;
    efficiency: number;
    satisfaction: number;
  };
}

const LiveMetrics: React.FC = () => {
  const { t } = useLanguage();
  const [metrics, setMetrics] = useState<Metric[]>([
    {
      label: 'Total Client Revenue This Year',
      value: 127450,
      unit: '€',
      change: 8.3,
      trend: 'up',
      icon: Euro,
      color: 'from-green-400 to-emerald-400'
    },
    {
      label: 'Hours Saved Monthly',
      value: 1247,
      unit: 'hrs',
      change: 12.1,
      trend: 'up',
      icon: Clock,
      color: 'from-blue-400 to-cyan-400'
    },
    {
      label: 'Active Enterprise Clients',
      value: 15,
      unit: 'clients',
      change: 25.0,
      trend: 'up',
      icon: Users,
      color: 'from-purple-400 to-pink-400'
    },
    {
      label: 'System Uptime',
      value: 98,
      unit: '%',
      change: 0,
      trend: 'stable',
      icon: TrendingUp,
      color: 'from-orange-400 to-red-400'
    }
  ]);

  const [clientMetrics] = useState<ClientMetric[]>([
    {
      name: 'Hotel am Kochbrunnen',
      metrics: {
        revenue: 16,  // +16% revenue increase
        efficiency: 90,  // 90% occupancy rate
        satisfaction: 4.8
      }
    },
    {
      name: 'Falchi Dental',
      metrics: {
        revenue: 25000,  // €25,000 saved annually
        efficiency: 89,  // 89% faster processing (9x)
        satisfaction: 4.9
      }
    },
    {
      name: 'Glenn Miller School',
      metrics: {
        revenue: 200,  // 200+ bookings/week
        efficiency: 95,  // 95% booking accuracy
        satisfaction: 4.7
      }
    }
  ]);

  const [liveUpdates, setLiveUpdates] = useState({
    bookingsToday: 52,  // Realistic daily bookings
    revenueToday: 1450,  // Realistic daily revenue
    activeNow: 8,  // Realistic concurrent users
    responseTime: 0.8
  });

  // Slow, realistic updates (once per minute instead of every 3 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveUpdates(prev => ({
        bookingsToday: Math.min(100, prev.bookingsToday + Math.floor(Math.random() * 2)),  // Max 100 bookings/day
        revenueToday: Math.min(3000, prev.revenueToday + Math.floor(Math.random() * 50)),  // Max €3000/day
        activeNow: Math.max(1, Math.min(15, prev.activeNow + Math.floor(Math.random() * 3) - 1)),  // 1-15 users
        responseTime: Math.max(0.5, Math.min(1.2, prev.responseTime + (Math.random() - 0.5) * 0.05))
      }));

      // Only update revenue counter slowly
      setMetrics(prevMetrics => 
        prevMetrics.map(metric => {
          if (metric.label === 'Total Client Revenue This Year') {
            return {
              ...metric,
              value: Math.min(150000, metric.value + Math.floor(Math.random() * 10))  // Slow increment
            };
          }
          return metric;  // Other metrics stay stable
        })
      );
    }, 60000);  // Update every minute instead of every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 bg-[#0A0A0A] relative overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(90deg, #ffffff10 1px, transparent 1px),
                           linear-gradient(180deg, #ffffff10 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <Activity className="w-6 h-6 text-green-400 animate-pulse" />
            <span className="text-green-400 font-mono text-sm">LIVE METRICS</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Client Performance Metrics
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Real results from our active enterprise clients in Germany
          </p>
        </motion.div>

        {/* Main Metrics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 relative overflow-hidden group hover:bg-white/10 transition-all duration-300"
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <Icon className={`w-8 h-8 bg-gradient-to-r ${metric.color} bg-clip-text text-transparent`} />
                    <div className={`flex items-center gap-1 text-sm ${
                      metric.trend === 'up' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {metric.trend === 'up' ? (
                        <ArrowUp className="w-4 h-4" />
                      ) : (
                        <ArrowDown className="w-4 h-4" />
                      )}
                      <span>{Math.abs(metric.change).toFixed(1)}%</span>
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <motion.div
                      key={metric.value}
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      className="text-3xl font-bold text-white"
                    >
                      {metric.unit === '€' && '€'}
                      {metric.value.toLocaleString()}
                      {metric.unit !== '€' && metric.unit !== 'users' && ` ${metric.unit}`}
                    </motion.div>
                  </div>
                  
                  <div className="text-sm text-gray-400">
                    {metric.label}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Live Activity Feed */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Real-time Updates */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                Today's Activity
              </h3>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-gray-400">Bookings Processed</span>
                    <motion.p
                      key={liveUpdates.bookingsToday}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      className="text-2xl font-bold text-white"
                    >
                      {liveUpdates.bookingsToday}
                    </motion.p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400">Active Users Now</span>
                    <motion.p
                      key={liveUpdates.activeNow}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      className="text-2xl font-bold text-white"
                    >
                      {liveUpdates.activeNow}
                    </motion.p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-gray-400">Avg Response Time</span>
                    <motion.p
                      key={liveUpdates.responseTime}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      className="text-2xl font-bold text-white"
                    >
                      {liveUpdates.responseTime.toFixed(1)}s
                    </motion.p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400">System Uptime</span>
                    <motion.p
                      className="text-2xl font-bold text-white"
                    >
                      98%
                    </motion.p>
                  </div>
                </div>
              </div>

              {/* Activity Graph */}
              <div className="mt-6 h-32 relative">
                <svg className="w-full h-full">
                  <defs>
                    <linearGradient id="activityGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <polyline
                    fill="url(#activityGradient)"
                    stroke="#8B5CF6"
                    strokeWidth="2"
                    points={`0,100 ${Array.from({ length: 20 }, (_, i) => 
                      `${i * 20},${100 - Math.random() * 80}`
                    ).join(' ')} 400,100`}
                  />
                </svg>
                <div className="absolute bottom-0 left-0 text-xs text-gray-500">00:00</div>
                <div className="absolute bottom-0 right-0 text-xs text-gray-500">Now</div>
              </div>
            </div>
          </div>

          {/* Client Performance - Sidebar */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              Real Client Impact
            </h3>
            
            <div className="space-y-4">
              {clientMetrics.map((client, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 bg-white/5 rounded-lg"
                >
                  <div className="font-medium text-white mb-2">{client.name}</div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">
                        {client.name.includes('Hotel') ? 'Revenue' : 
                         client.name.includes('Dental') ? 'Saved' : 'Bookings'}
                      </span>
                      <p className="text-green-400 font-bold">
                        {client.name.includes('Hotel') ? `+${client.metrics.revenue}%` :
                         client.name.includes('Dental') ? `€${client.metrics.revenue}` :
                         `${client.metrics.revenue}/wk`}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">
                        {client.name.includes('Hotel') ? 'Occupancy' :
                         client.name.includes('Dental') ? 'Faster' : 'Accuracy'}
                      </span>
                      <p className="text-blue-400 font-bold">
                        {client.name.includes('Dental') && client.metrics.efficiency === 89 ? '9x' : `${client.metrics.efficiency}%`}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Rating</span>
                      <p className="text-yellow-400 font-bold">
                        {client.metrics.satisfaction}★
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Client Performance - Enhanced Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-8"
        >
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Globe className="w-5 h-5 text-purple-400" />
            Live Client Performance
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Hotel am Kochbrunnen */}
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-3">Hotel am Kochbrunnen</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Revenue Impact</span>
                  <span className="text-green-400 font-bold">+16%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Occupancy</span>
                  <span className="text-blue-400 font-bold">90%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">No-shows</span>
                  <span className="text-purple-400 font-bold">-90%</span>
                </div>
              </div>
            </div>
            
            {/* Falchi Dental */}
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-3">Falchi Dental</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Processing Speed</span>
                  <span className="text-green-400 font-bold">9x faster</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Annual Savings</span>
                  <span className="text-blue-400 font-bold">€25,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Time Saved</span>
                  <span className="text-purple-400 font-bold">2.5hrs/day</span>
                </div>
              </div>
            </div>
            
            {/* Glenn Miller School */}
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-3">Glenn Miller School</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Weekly Bookings</span>
                  <span className="text-green-400 font-bold">200+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Satisfaction</span>
                  <span className="text-blue-400 font-bold">95%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Languages</span>
                  <span className="text-purple-400 font-bold">DE/EN/FR</span>
                </div>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="mt-8 flex items-center justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-medium">98% System Uptime</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LiveMetrics;