// Conflict Resolver Component
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Check, Clock } from 'lucide-react';
import type { ScheduleConflict } from '../../lib/staffScheduleUtils';

interface ConflictResolverProps {
  conflicts: ScheduleConflict[];
  onResolve: (conflictIndex: number, action: 'ignore' | 'cancel' | 'adjust') => void;
  onClose: () => void;
  locale?: 'en' | 'de';
}

const ConflictResolver: React.FC<ConflictResolverProps> = ({
  conflicts,
  onResolve,
  onClose,
  locale = 'en'
}) => {
  if (conflicts.length === 0) return null;

  const getSeverityColor = (severity: ScheduleConflict['severity']) => {
    return severity === 'error' ? 'red' : 'orange';
  };

  const getConflictIcon = (type: ScheduleConflict['type']) => {
    switch (type) {
      case 'overlap':
        return '🔄';
      case 'insufficient_gap':
        return '⏱️';
      case 'too_many_hours':
        return '😴';
      case 'break_violation':
        return '☕';
      default:
        return '⚠️';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-4 right-4 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[600px] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-orange-50">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <h3 className="font-semibold text-gray-900">
              {locale === 'de' ? 'Konflikte gefunden' : 'Conflicts Found'}
            </h3>
            <span className="px-2 py-0.5 bg-orange-200 text-orange-800 text-xs rounded-full">
              {conflicts.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-orange-100 transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Conflicts List */}
        <div className="max-h-[400px] overflow-y-auto">
          {conflicts.map((conflict, index) => {
            const color = getSeverityColor(conflict.severity);
            const icon = getConflictIcon(conflict.type);

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 border-b hover:bg-gray-50"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{icon}</span>
                  <div className="flex-1">
                    <p className={`font-medium text-${color}-900`}>
                      {conflict.message}
                    </p>
                    {conflict.shift2 && (
                      <p className="text-sm text-gray-600 mt-1">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {conflict.shift2.start} - {conflict.shift2.end}
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-3">
                  {conflict.severity === 'warning' && (
                    <button
                      onClick={() => onResolve(index, 'ignore')}
                      className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors"
                    >
                      {locale === 'de' ? 'Ignorieren' : 'Ignore'}
                    </button>
                  )}
                  <button
                    onClick={() => onResolve(index, 'adjust')}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                  >
                    {locale === 'de' ? 'Anpassen' : 'Adjust'}
                  </button>
                  <button
                    onClick={() => onResolve(index, 'cancel')}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                  >
                    {locale === 'de' ? 'Abbrechen' : 'Cancel'}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer with Summary */}
        <div className="p-4 bg-gray-50 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {conflicts.filter(c => c.severity === 'error').length} {locale === 'de' ? 'Fehler' : 'errors'},
              {' '}{conflicts.filter(c => c.severity === 'warning').length} {locale === 'de' ? 'Warnungen' : 'warnings'}
            </span>
            <button
              onClick={onClose}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {locale === 'de' ? 'Schließen' : 'Close'}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ConflictResolver;