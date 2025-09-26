import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../providers/LanguageProvider';
import { 
  Code2, 
  GitBranch, 
  Terminal, 
  Clock, 
  Users, 
  Zap,
  Database,
  Shield,
  Cpu,
  Globe,
  CheckCircle,
  Circle,
  AlertCircle
} from 'lucide-react';

interface Project {
  id: string;
  client: string;
  type: string;
  status: 'planning' | 'development' | 'testing' | 'deploying';
  progress: number;
  startDate: string;
  estimatedCompletion: string;
  technologies: string[];
  features: string[];
  team: number;
  commits: number;
  linesOfCode: number;
  testsWritten: number;
  colorScheme: {
    primary: string;
    secondary: string;
  };
}

const CurrentlyBuilding: React.FC = () => {
  const { t } = useLanguage();
  const [selectedProject, setSelectedProject] = useState(0);
  const [liveMetrics, setLiveMetrics] = useState({
    commits: 0,
    linesOfCode: 0,
    testsWritten: 0
  });

  const projects: Project[] = [
    {
      id: 'ai-customer-service',
      client: 'Major German Bank',
      type: 'AI Customer Service Platform',
      status: 'development',
      progress: 65,
      startDate: '2024-01-15',
      estimatedCompletion: '2024-03-30',
      technologies: ['GPT-4', 'Python', 'FastAPI', 'PostgreSQL', 'Docker'],
      features: [
        'Multi-language support (DE/EN/FR)',
        '24/7 automated responses',
        'Sentiment analysis',
        'Escalation to human agents'
      ],
      team: 4,
      commits: 342,
      linesOfCode: 45680,
      testsWritten: 189,
      colorScheme: {
        primary: '#00BFA6',
        secondary: '#00ACC1'
      }
    },
    {
      id: 'smart-factory',
      client: 'Automotive Supplier',
      type: 'Smart Factory Dashboard',
      status: 'testing',
      progress: 85,
      startDate: '2023-12-01',
      estimatedCompletion: '2024-02-28',
      technologies: ['React', 'Node.js', 'InfluxDB', 'Grafana', 'MQTT'],
      features: [
        'Real-time production metrics',
        'Predictive maintenance',
        'Quality control AI',
        'Energy optimization'
      ],
      team: 6,
      commits: 567,
      linesOfCode: 78920,
      testsWritten: 412,
      colorScheme: {
        primary: '#FF6B35',
        secondary: '#F7931E'
      }
    },
    {
      id: 'healthcare-platform',
      client: 'Medical Practice Network',
      type: 'Patient Management System',
      status: 'planning',
      progress: 25,
      startDate: '2024-02-01',
      estimatedCompletion: '2024-05-15',
      technologies: ['Vue.js', 'Django', 'PostgreSQL', 'Redis', 'AWS'],
      features: [
        'Appointment scheduling',
        'Electronic health records',
        'Prescription management',
        'Insurance processing'
      ],
      team: 5,
      commits: 89,
      linesOfCode: 12340,
      testsWritten: 45,
      colorScheme: {
        primary: '#E91E63',
        secondary: '#9C27B0'
      }
    }
  ];

  const currentProject = projects[selectedProject];

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMetrics(prev => ({
        commits: prev.commits + Math.floor(Math.random() * 3),
        linesOfCode: prev.linesOfCode + Math.floor(Math.random() * 150),
        testsWritten: prev.testsWritten + Math.floor(Math.random() * 2)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: Project['status']) => {
    switch (status) {
      case 'planning':
        return <Circle className="w-4 h-4 text-yellow-400" />;
      case 'development':
        return <Code2 className="w-4 h-4 text-blue-400 animate-pulse" />;
      case 'testing':
        return <AlertCircle className="w-4 h-4 text-orange-400" />;
      case 'deploying':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
    }
  };

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'planning':
        return 'text-yellow-400';
      case 'development':
        return 'text-blue-400';
      case 'testing':
        return 'text-orange-400';
      case 'deploying':
        return 'text-green-400';
    }
  };

  return (
    <section className="py-20 bg-[#0A0A0A] relative overflow-hidden">
      {/* Animated background code */}
      <div className="absolute inset-0 opacity-5">
        <pre className="text-xs text-green-400 animate-scroll">
          {`function deployToProduction() {
  const tests = runAllTests();
  if (tests.passed) {
    buildProject();
    optimizeBundle();
    deployToCloud();
    notifyClient();
  }
}

class SmartFactory {
  constructor() {
    this.sensors = new IoTNetwork();
    this.ai = new PredictiveModel();
    this.dashboard = new RealtimeUI();
  }
  
  async monitorProduction() {
    const metrics = await this.sensors.collect();
    const predictions = this.ai.analyze(metrics);
    this.dashboard.update(predictions);
  }
}

const patientManagement = {
  appointments: new SchedulingEngine(),
  records: new SecureDatabase(),
  billing: new InsuranceProcessor(),
  notifications: new MessageQueue()
};`}
        </pre>
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
            <Terminal className="w-6 h-6 text-green-400 animate-pulse" />
            <span className="text-green-400 font-mono text-sm">LIVE DEVELOPMENT</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Currently Building
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Real-time view of projects in active development
          </p>
        </motion.div>

        {/* Project Selector */}
        <div className="flex justify-center gap-2 mb-12">
          {projects.map((project, index) => (
            <button
              key={project.id}
              onClick={() => setSelectedProject(index)}
              className={`px-4 py-2 rounded-lg border transition-all duration-300 ${
                selectedProject === index
                  ? 'bg-white/10 border-white/20 text-white'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-2">
                {getStatusIcon(project.status)}
                <span className="text-sm font-medium">{project.type}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Main Project Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentProject.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid lg:grid-cols-3 gap-8"
          >
            {/* Project Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{currentProject.type}</h3>
                    <p className="text-gray-400">Client: {currentProject.client}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(currentProject.status)}
                    <span className={`font-medium ${getStatusColor(currentProject.status)}`}>
                      {currentProject.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Progress</span>
                    <span>{currentProject.progress}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${currentProject.progress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${currentProject.colorScheme.primary}, ${currentProject.colorScheme.secondary})`
                      }}
                    />
                  </div>
                </div>

                {/* Timeline */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-400">Started</span>
                    <p className="text-white font-medium">{currentProject.startDate}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400">Est. Completion</span>
                    <p className="text-white font-medium">{currentProject.estimatedCompletion}</p>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  Features in Development
                </h4>
                <div className="space-y-3">
                  {currentProject.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                      <span className="text-gray-300">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Technologies */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Database className="w-5 h-5 text-purple-400" />
                  Tech Stack
                </h4>
                <div className="flex flex-wrap gap-2">
                  {currentProject.technologies.map((tech, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-sm text-white"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Metrics */}
            <div className="space-y-6">
              {/* Team Status */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  Team Activity
                </h4>
                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-gray-400">Active Developers</span>
                    <p className="text-2xl font-bold text-white">{currentProject.team}</p>
                  </div>
                  <div className="flex -space-x-2">
                    {[...Array(currentProject.team)].map((_, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 border-2 border-gray-900 flex items-center justify-center"
                      >
                        <span className="text-xs text-white font-bold">
                          {String.fromCharCode(65 + i)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Live Code Metrics */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-green-400" />
                  Development Metrics
                </h4>
                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-gray-400">Total Commits</span>
                    <motion.p
                      key={liveMetrics.commits}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      className="text-2xl font-bold text-white"
                    >
                      {currentProject.commits + liveMetrics.commits}
                    </motion.p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400">Lines of Code</span>
                    <motion.p
                      key={liveMetrics.linesOfCode}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      className="text-2xl font-bold text-white"
                    >
                      {(currentProject.linesOfCode + liveMetrics.linesOfCode).toLocaleString()}
                    </motion.p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400">Tests Written</span>
                    <motion.p
                      key={liveMetrics.testsWritten}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      className="text-2xl font-bold text-white"
                    >
                      {currentProject.testsWritten + liveMetrics.testsWritten}
                    </motion.p>
                  </div>
                </div>
              </div>

              {/* Security Status */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  Security
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Vulnerabilities</span>
                    <span className="text-green-400 font-medium">0 Critical</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Code Coverage</span>
                    <span className="text-white font-medium">87%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Last Audit</span>
                    <span className="text-white font-medium">2 days ago</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Terminal Output */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 bg-black/50 backdrop-blur-xl border border-white/10 rounded-xl p-6 font-mono text-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-gray-400 ml-2">deployment.log</span>
          </div>
          <div className="space-y-2 text-green-400">
            <div>[2024-02-10 14:32:45] Running test suite...</div>
            <div>[2024-02-10 14:32:48] ✓ All 412 tests passed</div>
            <div>[2024-02-10 14:32:49] Building production bundle...</div>
            <div>[2024-02-10 14:33:12] ✓ Bundle size: 1.2MB (gzipped)</div>
            <div>[2024-02-10 14:33:13] Deploying to staging environment...</div>
            <div className="animate-pulse">[2024-02-10 14:33:15] ▶ Deployment in progress...</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CurrentlyBuilding;