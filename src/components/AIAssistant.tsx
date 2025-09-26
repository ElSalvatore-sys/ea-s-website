import React, { useState, useEffect } from 'react';
import { MessageSquare, X, Send, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../providers/LanguageProvider';

interface Message {
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const AIAssistant: React.FC = () => {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const MAX_MESSAGES = 10;
  const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
  const MODEL = import.meta.env.VITE_OPENAI_MODEL || 'gpt-3.5-turbo';

  // System prompt with EA Solutions context
  const systemPrompt = language === 'de' 
    ? `Du bist der EA Solutions Assistent. Wir bieten Buchungssysteme (€39-299/Monat), maßgeschneiderte Websites (ab €1.999) und Business-Automatisierung. Aktuelle Projekte: LingXM (Sprachenlernen mit 500M+ Sätzen), MindAI (lokale Smart Home AI). Halte Antworten unter 80 Wörtern, professionell und fokussiert auf Konvertierung. Erwähne immer unseren Standort Stuttgart und deutschen Engineering-Ansatz.`
    : `You are EA Solutions assistant. We offer booking systems (€39-299/month), custom websites (from €1,999), and business automation. Current projects: LingXM (language learning with 500M+ sentences), MindAI (local smart home AI). Keep responses under 80 words, professional, and focused on converting inquiries. Always mention our Stuttgart location and German engineering approach.`;

  // Pre-configured responses for common questions
  const getQuickResponse = (msg: string): string | null => {
    const lowerMsg = msg.toLowerCase();
    
    if (lowerMsg.includes('pric') || lowerMsg.includes('cost') || lowerMsg.includes('preis')) {
      return language === 'de'
        ? "Unsere Buchungssysteme beginnen bei €39/Monat (Starter), €99/Monat (Professional) und €299/Monat (Enterprise). Websites ab €1.999. Für ein maßgeschneidertes Angebot kontaktieren Sie uns für eine kostenlose Beratung."
        : "Our booking systems start at €39/month (Starter), €99/month (Professional), and €299/month (Enterprise). Websites from €1,999. For a custom quote, contact us for a free consultation.";
    }
    
    if (lowerMsg.includes('timeline') || lowerMsg.includes('how long') || lowerMsg.includes('dauer')) {
      return language === 'de'
        ? "Buchungssysteme: 2-4 Wochen. Websites: 4-8 Wochen. Enterprise-Lösungen: 8-12 Wochen. Wir beginnen sofort nach Vertragsunterzeichnung. Deutscher Engineering-Standard garantiert pünktliche Lieferung."
        : "Booking systems: 2-4 weeks. Websites: 4-8 weeks. Enterprise solutions: 8-12 weeks. We start immediately after contract signing. German engineering standards ensure on-time delivery.";
    }
    
    if (lowerMsg.includes('lingxm')) {
      return language === 'de'
        ? "LingXM ist unsere revolutionäre Sprachlernplattform mit über 500 Millionen grammatikalisch perfekten Sätzen in 9 Sprachen. Aktuell in Beta-Phase. Verfügbar Q2 2025. Interessiert? Kontaktieren Sie uns für Early Access."
        : "LingXM is our revolutionary language learning platform with 500M+ grammatically perfect sentences across 9 languages. Currently in beta. Available Q2 2025. Interested? Contact us for early access.";
    }
    
    if (lowerMsg.includes('mindai') || lowerMsg.includes('smart home')) {
      return language === 'de'
        ? "MindAI ersetzt Alexa/Siri mit 100% lokaler KI. Keine Cloud-Abhängigkeit, vollständige Privatsphäre. Läuft auf Home Assistant mit lokalen LLMs. Verfügbar für Beta-Tester. Stuttgart-entwickelt für maximale Datensicherheit."
        : "MindAI replaces Alexa/Siri with 100% local AI. No cloud dependency, complete privacy. Runs on Home Assistant with local LLMs. Available for beta testers. Stuttgart-engineered for maximum data security.";
    }
    
    return null;
  };

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        text: language === 'de'
          ? "Hallo! Ich bin Ihr EA Solutions Assistent. Wie kann ich Ihnen bei Ihrer digitalen Transformation helfen? Fragen Sie nach Preisen, Zeitplänen oder unseren Projekten."
          : "Hello! I'm your EA Solutions assistant. How can I help with your digital transformation? Ask about pricing, timelines, or our projects.",
        isBot: true,
        timestamp: new Date()
      }]);
    }
  }, [isOpen, messages.length, language]);

  const callOpenAI = async (userMessage: string): Promise<string> => {
    if (!API_KEY) {
      // Use quick responses as fallback when no API key
      const quickResponse = getQuickResponse(userMessage);
      if (quickResponse) return quickResponse;

      return language === 'de'
        ? "Für detaillierte Antworten kontaktieren Sie uns bitte direkt. Rufen Sie uns an oder vereinbaren Sie eine kostenlose Beratung über unsere Kontaktseite."
        : "For detailed answers, please contact us directly. Call us or schedule a free consultation through our contact page.";
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.slice(-5).map(m => ({
              role: m.isBot ? 'assistant' : 'user',
              content: m.text
            })),
            { role: 'user', content: userMessage }
          ],
          max_tokens: 150,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API error:', error);
      
      // Try quick response as fallback
      const quickResponse = getQuickResponse(userMessage);
      if (quickResponse) return quickResponse;
      
      throw error;
    }
  };

  const handleSend = async () => {
    if (message.trim() && messageCount < MAX_MESSAGES) {
      const userMessage = message.trim();
      setMessage('');
      setError(null);
      
      // Add user message
      const newUserMessage: Message = {
        text: userMessage,
        isBot: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newUserMessage]);
      setIsLoading(true);
      setMessageCount(prev => prev + 1);
      
      try {
        // Try quick response first
        const quickResponse = getQuickResponse(userMessage);
        const botResponse = quickResponse || await callOpenAI(userMessage);
        
        setMessages(prev => [...prev, {
          text: botResponse,
          isBot: true,
          timestamp: new Date()
        }]);
      } catch (error) {
        setError(language === 'de'
          ? "Entschuldigung, ich konnte keine Antwort generieren. Bitte kontaktieren Sie uns direkt für Unterstützung."
          : "Sorry, I couldn't generate a response. Please contact us directly for assistance.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const resetConversation = () => {
    setMessages([]);
    setMessageCount(0);
    setError(null);
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 z-40"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open AI Assistant"
      >
        <MessageSquare className="h-6 w-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-24 right-6 w-96 h-[600px] bg-[#0A0A0A] rounded-2xl shadow-2xl border border-white/10 flex flex-col z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div>
                  <h3 className="font-semibold text-white">
                    {language === 'de' ? 'Fragen Sie über unsere Lösungen' : 'Ask About Our Solutions'}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {language === 'de' 
                      ? 'Sofortige Preise, Zeitpläne und Projektdetails'
                      : 'Get instant pricing, timelines, and project details'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${
                      msg.isBot
                        ? 'bg-white/5 backdrop-blur-xl border border-white/10 text-gray-200'
                        : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 px-4 py-3 rounded-2xl">
                    <Loader2 className="h-4 w-4 text-purple-400 animate-spin" />
                  </div>
                </div>
              )}
              
              {error && (
                <div className="flex justify-start">
                  <div className="bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-2xl text-red-400 text-sm flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    {error}
                  </div>
                </div>
              )}
            </div>

            {/* Rate Limit Warning */}
            {messageCount >= MAX_MESSAGES - 2 && messageCount < MAX_MESSAGES && (
              <div className="px-4 py-2 bg-yellow-500/10 border-t border-yellow-500/20">
                <p className="text-xs text-yellow-400">
                  {language === 'de'
                    ? `${MAX_MESSAGES - messageCount} Nachrichten verbleibend`
                    : `${MAX_MESSAGES - messageCount} messages remaining`}
                </p>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-white/10">
              {messageCount < MAX_MESSAGES ? (
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                    placeholder={language === 'de' 
                      ? "Fragen Sie nach Preisen, Projekten..."
                      : "Ask about pricing, projects..."}
                    className="flex-1 px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSend}
                    disabled={isLoading || !message.trim()}
                    className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-gray-400 text-sm mb-3">
                    {language === 'de'
                      ? 'Sitzungslimit erreicht. Kontaktieren Sie uns für weitere Fragen.'
                      : 'Session limit reached. Contact us for more questions.'}
                  </p>
                  <button
                    onClick={resetConversation}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all text-sm"
                  >
                    {language === 'de' ? 'Neue Sitzung starten' : 'Start New Session'}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistant;