import React from 'react';
import { motion } from 'framer-motion';
import { Construction } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ComingSoonProps {
  title: string;
  description?: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ title, description }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 pt-20 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-2xl mx-auto px-4"
      >
        <Construction className="w-20 h-20 text-purple-500 mx-auto mb-8" />

        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
          {title}
        </h1>

        <p className="text-xl text-gray-300 mb-8">
          {description || 'This page is under construction and will be available soon.'}
        </p>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-8 mb-8">
          <p className="text-gray-400 mb-6">
            We're working hard to bring you this feature. In the meantime, feel free to explore our other services or contact us for more information.
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <Link
            to="/"
            className="px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-full hover:bg-white/20 transition-all"
          >
            Go Home
          </Link>
          <Link
            to="/contact"
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full hover:shadow-xl transition-all"
          >
            Contact Us
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ComingSoon;