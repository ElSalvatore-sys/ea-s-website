import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../providers/LanguageProvider';
import ClientSiteTransition from '../components/ClientSiteTransition';
import BookingDemo from '../components/demos/BookingDemoEnhanced';
import DocumentDemo from '../components/demos/DocumentDemo';
import ChatbotDemo from '../components/demos/ChatbotDemo';
import { Calendar, FileText, MessageSquare, ChevronRight, Sparkles } from 'lucide-react';

type DemoType = 'booking' | 'document' | 'chatbot' | null;

const DemoShowcase: React.FC = () => {
  const { t } = useLanguage();
  const [selectedDemo, setSelectedDemo] = useState<DemoType>(null);

  const demos = [
    {
      id: 'booking' as DemoType,
      icon: Calendar,
      titleKey: 'demos.booking.title',
      descriptionKey: 'demos.booking.description',
      component: BookingDemo
    },
    {
      id: 'document' as DemoType,
      icon: FileText,
      titleKey: 'demos.document.title',
      descriptionKey: 'demos.document.description',
      component: DocumentDemo
    },
    {
      id: 'chatbot' as DemoType,
      icon: MessageSquare,
      titleKey: 'demos.chatbot.title',
      descriptionKey: 'demos.chatbot.description',
      component: ChatbotDemo
    }
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white py-16 relative overflow-hidden">
      <ClientSiteTransition />
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <motion.div
            className="inline-block mb-6"
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 6, repeat: Infinity }}
          >
            <Sparkles className="w-12 h-12 text-purple-400 mx-auto" />
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              {t('demos.title')}
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            {t('demos.subtitle')}
          </p>
        </motion.div>

        {/* Demo Selection */}
        {!selectedDemo && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {demos.map((demo, index) => (
              <motion.div
                key={demo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedDemo(demo.id)}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 cursor-pointer hover:border-purple-500/50 transition-all duration-300 border border-white/20 hover:shadow-2xl hover:shadow-purple-500/20 group"
              >
                <demo.icon className="w-12 h-12 text-purple-400 mb-4 group-hover:text-purple-300 transition-colors" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  {t(demo.titleKey)}
                </h3>
                {/* Problem indicator */}
                <div className="text-sm text-orange-400 mb-3 font-medium">
                  {t(`demos.${demo.id}.problem` as any)}
                </div>
                <p className="text-gray-400 mb-4">
                  {t(demo.descriptionKey)}
                </p>
                <div className="flex items-center text-purple-400 font-medium group-hover:text-purple-300 transition-colors">
                  {t('demos.tryDemo')}
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Selected Demo */}
        {selectedDemo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6">
              <button
                onClick={() => setSelectedDemo(null)}
                className="text-purple-400 hover:text-purple-300 font-medium flex items-center transition-colors"
              >
                <ChevronRight className="w-4 h-4 mr-1 rotate-180" />
                {t('demos.backToList')}
              </button>
            </div>

            {demos.map((demo) => {
              if (demo.id === selectedDemo) {
                const Component = demo.component;
                return <Component key={demo.id} />;
              }
              return null;
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DemoShowcase;