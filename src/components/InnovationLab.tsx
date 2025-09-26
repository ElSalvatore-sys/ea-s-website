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
  AlertCircle,
  Brain,
  Languages,
  Stethoscope,
  Home,
  Cloud,
  Lock,
  Rocket,
  ExternalLink,
  ArrowRight
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string;
  status: 'development' | 'beta' | 'launching';
  progress: number;
  launchDate: string;
  technologies: string[];
  features: string[];
  team: number;
  metrics: {
    label: string;
    value: string;
  }[];
  highlights: string[];
  icon: React.ElementType;
  colorScheme: {
    primary: string;
    secondary: string;
  };
  earlyAccessLink?: string;
}

const InnovationLab: React.FC = () => {
  const { t } = useLanguage();
  const [selectedProject, setSelectedProject] = useState(0);
  const [liveProgress, setLiveProgress] = useState({
    commits: 0,
    features: 0,
    tests: 0
  });

  const projects: Project[] = [
    {
      id: 'lingxm',
      name: 'LingXM',
      tagline: t('innovationLab.projects.lingxm.tagline'),
      description: t('innovationLab.projects.lingxm.description'),
      status: 'development',
      progress: 75,
      launchDate: 'Q2 2025',
      technologies: ['React', 'Python', 'FastAPI', 'PostgreSQL', 'Docker', 'TypeScript', 'Redis'],
      features: [
        t('innovationLab.projects.lingxm.features.0'),
        t('innovationLab.projects.lingxm.features.1'),
        t('innovationLab.projects.lingxm.features.2'),
        t('innovationLab.projects.lingxm.features.3'),
        t('innovationLab.projects.lingxm.features.4'),
        t('innovationLab.projects.lingxm.features.5')
      ],
      team: 3,
      metrics: [
        { label: 'Sentences', value: '500M+' },
        { label: 'Languages', value: '14' },
        { label: 'Variations', value: '14 per sentence' },
        { label: 'Developers', value: '3 full-time' }
      ],
      highlights: [
        t('innovationLab.projects.lingxm.highlights.0'),
        t('innovationLab.projects.lingxm.highlights.1'),
        t('innovationLab.projects.lingxm.highlights.2')
      ],
      icon: Languages,
      colorScheme: {
        primary: '#3B82F6',
        secondary: '#8B5CF6'
      },
      earlyAccessLink: '/lingxm-early-access'
    },
    {
      id: 'lingxm-travel',
      name: 'LingXM Travel',
      tagline: t('innovationLab.projects.lingxmTravel.tagline'),
      description: t('innovationLab.projects.lingxmTravel.description'),
      status: 'beta',
      progress: 60,
      launchDate: 'Q1 2025',
      technologies: ['Python', 'FastAPI', 'OpenAI API', 'Claude API', 'PostgreSQL', 'Docker', 'FHIR'],
      features: [
        t('innovationLab.projects.lingxmTravel.features.0'),
        t('innovationLab.projects.lingxmTravel.features.1'),
        t('innovationLab.projects.lingxmTravel.features.2'),
        t('innovationLab.projects.lingxmTravel.features.3'),
        t('innovationLab.projects.lingxmTravel.features.4'),
        t('innovationLab.projects.lingxmTravel.features.5')
      ],
      team: 2,
      metrics: [
        { label: 'Time Saved', value: '80%' },
        { label: 'Beta Practices', value: '3' },
        { label: 'Patients/Day', value: '150+' },
        { label: 'Languages', value: '7' }
      ],
      highlights: [
        t('innovationLab.projects.lingxmTravel.highlights.0'),
        t('innovationLab.projects.lingxmTravel.highlights.1'),
        t('innovationLab.projects.lingxmTravel.highlights.2')
      ],
      icon: Stethoscope,
      colorScheme: {
        primary: '#10B981',
        secondary: '#06B6D4'
      },
      earlyAccessLink: '/lingxm-travel-beta'
    },
    {
      id: 'mindai',
      name: 'MindAI',
      tagline: t('innovationLab.projects.mindai.tagline'),
      description: t('innovationLab.projects.mindai.description'),
      status: 'development',
      progress: 35,
      launchDate: 'Q1-Q2 2026',
      technologies: ['Python', 'Local LLMs', 'Home Assistant', 'Docker', 'Edge Computing', 'Whisper', 'Ollama'],
      features: [
        t('innovationLab.projects.mindai.features.0'),
        t('innovationLab.projects.mindai.features.1'),
        t('innovationLab.projects.mindai.features.2'),
        t('innovationLab.projects.mindai.features.3'),
        t('innovationLab.projects.mindai.features.4'),
        t('innovationLab.projects.mindai.features.5')
      ],
      team: 4,
      metrics: [
        { label: 'Privacy', value: '100% Local' },
        { label: 'Latency', value: '<100ms' },
        { label: 'Devices', value: '500+ compatible' },
        { label: 'Team', value: '4 engineers' }
      ],
      highlights: [
        t('innovationLab.projects.mindai.highlights.0'),
        t('innovationLab.projects.mindai.highlights.1'),
        t('innovationLab.projects.mindai.highlights.2')
      ],
      icon: Brain,
      colorScheme: {
        primary: '#EC4899',
        secondary: '#F59E0B'
      },
      earlyAccessLink: '/mindai-waitlist'
    }
  ];

  const currentProject = projects[selectedProject];

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveProgress(prev => ({
        commits: prev.commits + Math.floor(Math.random() * 5),
        features: prev.features + (Math.random() > 0.7 ? 1 : 0),
        tests: prev.tests + Math.floor(Math.random() * 3)
      }));
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: Project['status']) => {
    switch (status) {
      case 'development':
        return <Code2 className="w-4 h-4 text-blue-400 animate-pulse" />;
      case 'beta':
        return <AlertCircle className="w-4 h-4 text-orange-400" />;
      case 'launching':
        return <Rocket className="w-4 h-4 text-green-400" />;
    }
  };

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'development':
        return 'text-blue-400';
      case 'beta':
        return 'text-orange-400';
      case 'launching':
        return 'text-green-400';
    }
  };

  const getStatusLabel = (status: Project['status']) => {
    switch (status) {
      case 'development':
        return t('innovationLab.status.development');
      case 'beta':
        return t('innovationLab.status.beta');
      case 'launching':
        return t('innovationLab.status.launching');
    }
  };

  return (
    <section className="py-20 bg-[#0A0A0A] relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/20 rounded-full"
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight
            }}
            animate={{ 
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
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
            <Rocket className="w-6 h-6 text-purple-400 animate-pulse" />
            <span className="text-purple-400 font-mono text-sm uppercase tracking-wider">{t('innovationLab.title')}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            {t('innovationLab.subtitle')}
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            {t('innovationLab.description')}
          </p>
        </motion.div>

        {/* Project Selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {projects.map((project, index) => {
            const Icon = project.icon;
            return (
              <button
                key={project.id}
                onClick={() => setSelectedProject(index)}
                className={`px-4 py-3 rounded-lg border transition-all duration-300 ${
                  selectedProject === index
                    ? 'bg-white/10 border-white/20 text-white shadow-lg shadow-purple-500/20'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <div className="text-left">
                    <div className="text-sm font-bold">{project.name}</div>
                    <div className="text-xs opacity-70">{project.tagline}</div>
                  </div>
                  {getStatusIcon(project.status)}
                </div>
              </button>
            );
          })}
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
                    <h3 className="text-3xl font-bold text-white mb-2">{currentProject.name}</h3>
                    <p className="text-xl text-purple-400 mb-3">{currentProject.tagline}</p>
                    <p className="text-gray-300">{currentProject.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(currentProject.status)}
                    <span className={`font-medium text-sm ${getStatusColor(currentProject.status)}`}>
                      {getStatusLabel(currentProject.status)}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>{t('innovationLab.progress.label')}</span>
                    <span>{currentProject.progress}%</span>
                  </div>
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${currentProject.progress}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full rounded-full relative overflow-hidden"
                      style={{
                        background: `linear-gradient(90deg, ${currentProject.colorScheme.primary}, ${currentProject.colorScheme.secondary})`
                      }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-white/20"
                        animate={{ x: ['0%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      />
                    </motion.div>
                  </div>
                </div>

                {/* Launch Date */}
                <div className="flex items-center gap-2 text-gray-300">
                  <Clock className="w-4 h-4" />
                  <span>{t('innovationLab.expectedLaunch')}: <strong className="text-white">{currentProject.launchDate}</strong></span>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {currentProject.metrics.map((metric, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-4 text-center"
                  >
                    <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
                    <div className="text-xs text-gray-400">{metric.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Features */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  {t('innovationLab.technicalSpecs')}
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
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Tech Stack */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Database className="w-5 h-5 text-purple-400" />
                  {t('innovationLab.techStack')}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {currentProject.technologies.map((tech, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="px-3 py-1.5 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-full text-sm text-white font-medium"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Highlights */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-purple-400" />
                  {t('innovationLab.keyHighlights')}
                </h4>
                <div className="space-y-3">
                  {currentProject.highlights.map((highlight, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-2"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                      <span className="text-sm text-gray-300">{highlight}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Team & Development */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  {t('innovationLab.developmentTeam')}
                </h4>
                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-gray-400">{t('innovationLab.activeDevelopers')}</span>
                    <p className="text-2xl font-bold text-white">{currentProject.team}</p>
                  </div>
                  <div className="flex -space-x-2">
                    {[...Array(currentProject.team)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 border-2 border-gray-900 flex items-center justify-center"
                      >
                        <span className="text-xs text-white font-bold">
                          {String.fromCharCode(65 + i)}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Live Stats */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-green-400" />
                  {t('innovationLab.liveStats')}
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">{t('innovationLab.commitsToday')}</span>
                    <motion.span
                      key={liveProgress.commits}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      className="text-white font-bold"
                    >
                      {12 + liveProgress.commits}
                    </motion.span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">{t('innovationLab.featuresComplete')}</span>
                    <motion.span
                      key={liveProgress.features}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      className="text-white font-bold"
                    >
                      {Math.floor(currentProject.features.length * currentProject.progress / 100) + liveProgress.features}
                    </motion.span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">{t('innovationLab.testsPassing')}</span>
                    <motion.span
                      key={liveProgress.tests}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      className="text-green-400 font-bold"
                    >
                      {156 + liveProgress.tests}
                    </motion.span>
                  </div>
                </div>
              </div>

              {/* Request Early Access */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.dispatchEvent(new CustomEvent('openBookingModal'))}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-4 px-6 rounded-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>{t('innovationLab.requestEarlyAccess')}</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              {t('innovationLab.cta.title')}
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              {t('innovationLab.cta.description')}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('openBookingModal'))}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
              >
                {t('innovationLab.cta.joinButton')}
              </button>
              <a
                href="/innovation"
                className="px-8 py-3 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-full font-semibold hover:bg-white/20 transition-all duration-300 inline-flex items-center gap-2"
              >
                {t('innovationLab.cta.learnMore')}
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default InnovationLab;