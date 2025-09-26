import React from 'react';
import { MessageSquare } from 'lucide-react';

const ChatbotDemo: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
        <div className="flex items-center justify-center mb-6">
          <MessageSquare className="w-12 h-12 text-purple-400" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-4">AI Chatbot Demo</h2>
        <p className="text-gray-400 text-center mb-6">
          Experience our intelligent chatbot that can answer questions about your business and help customers 24/7.
        </p>

        <div className="bg-black/30 rounded-lg p-6 min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <MessageSquare className="w-16 h-16 text-purple-400/50 mx-auto mb-4" />
            <p className="text-gray-500">Chatbot demo coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotDemo;