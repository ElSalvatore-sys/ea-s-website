// Shift Editor Modal Component
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Clock, Calendar, Users, Coffee, Save,
  AlertCircle, Trash2, Copy, ChevronDown
} from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import type { Staff } from '../../lib/demoStaffData';
import type { Shift, ShiftTemplate, ScheduleConflict } from '../../lib/staffScheduleUtils';
import { SHIFT_TEMPLATES, timeToMinutes, minutesToTime } from '../../lib/staffScheduleUtils';

interface ShiftEditorProps {
  isOpen: boolean;
  onClose: () => void;
  shift?: Shift | null;
  staff: Staff;
  date?: Date;
  onSave: (shift: Omit<Shift, 'id'> | Shift) => void;
  onDelete?: (shiftId: string) => void;
  onDuplicate?: (shift: Shift) => void;
  conflicts?: ScheduleConflict[];
  locale?: 'en' | 'de';
}

const ShiftEditor: React.FC<ShiftEditorProps> = ({
  isOpen,
  onClose,
  shift,
  staff,
  date,
  onSave,
  onDelete,
  onDuplicate,
  conflicts = [],
  locale = 'en'
}) => {
  // Form state
  const [formData, setFormData] = useState({
    start: shift?.start || '09:00',
    end: shift?.end || '17:00',
    breakStart: shift?.breakStart || '',
    breakEnd: shift?.breakEnd || '',
    maxBookings: shift?.maxBookings || 1,
    status: shift?.status || 'active' as Shift['status'],
    notes: shift?.notes || ''
  });

  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [showTemplates, setShowTemplates] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Reset form when shift changes
  useEffect(() => {
    if (shift) {
      setFormData({
        start: shift.start,
        end: shift.end,
        breakStart: shift.breakStart || '',
        breakEnd: shift.breakEnd || '',
        maxBookings: shift.maxBookings || 1,
        status: shift.status,
        notes: shift.notes || ''
      });
    } else {
      setFormData({
        start: '09:00',
        end: '17:00',
        breakStart: '',
        breakEnd: '',
        maxBookings: 1,
        status: 'active',
        notes: ''
      });
    }
  }, [shift]);

  // Validate form data
  const validateForm = (): boolean => {
    const errors: string[] = [];

    // Check start time is before end time
    const startMinutes = timeToMinutes(formData.start);
    const endMinutes = timeToMinutes(formData.end);

    if (startMinutes >= endMinutes) {
      errors.push(locale === 'de'
        ? 'Startzeit muss vor Endzeit liegen'
        : 'Start time must be before end time');
    }

    // Check break times if provided
    if (formData.breakStart && formData.breakEnd) {
      const breakStartMinutes = timeToMinutes(formData.breakStart);
      const breakEndMinutes = timeToMinutes(formData.breakEnd);

      if (breakStartMinutes >= breakEndMinutes) {
        errors.push(locale === 'de'
          ? 'Pausenstart muss vor Pausenende liegen'
          : 'Break start must be before break end');
      }

      if (breakStartMinutes < startMinutes || breakEndMinutes > endMinutes) {
        errors.push(locale === 'de'
          ? 'Pause muss innerhalb der Schichtzeit liegen'
          : 'Break must be within shift hours');
      }
    }

    // Check for 6+ hour shifts without break
    const shiftHours = (endMinutes - startMinutes) / 60;
    if (shiftHours >= 6 && !formData.breakStart) {
      errors.push(locale === 'de'
        ? 'Schichten über 6 Stunden benötigen eine Pause'
        : 'Shifts longer than 6 hours require a break');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  // Apply template
  const applyTemplate = (templateId: string) => {
    const template = SHIFT_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setFormData(prev => ({
        ...prev,
        start: template.start,
        end: template.end,
        breakStart: template.breakStart || '',
        breakEnd: template.breakEnd || '',
        maxBookings: template.maxBookings || 1
      }));
      setSelectedTemplate(templateId);
      setShowTemplates(false);
    }
  };

  // Handle save
  const handleSave = () => {
    if (!validateForm()) return;

    const shiftData = shift ? {
      ...shift,
      ...formData
    } : {
      staffId: staff.id,
      date: date || shift?.date || new Date(),
      ...formData
    };

    onSave(shiftData);
    onClose();
  };

  // Calculate shift duration
  const calculateDuration = (): string => {
    const startMinutes = timeToMinutes(formData.start);
    const endMinutes = timeToMinutes(formData.end);
    let totalMinutes = endMinutes - startMinutes;

    if (formData.breakStart && formData.breakEnd) {
      const breakMinutes = timeToMinutes(formData.breakEnd) - timeToMinutes(formData.breakStart);
      totalMinutes -= breakMinutes;
    }

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (locale === 'de') {
      return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
    }
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-xl shadow-2xl z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {shift
                    ? (locale === 'de' ? 'Schicht bearbeiten' : 'Edit Shift')
                    : (locale === 'de' ? 'Neue Schicht' : 'New Shift')}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {staff.name} • {format(date || shift?.date || new Date(), 'EEEE, MMM d', {
                    locale: locale === 'de' ? de : undefined
                  })}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {/* Template Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {locale === 'de' ? 'Vorlage verwenden' : 'Use Template'}
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowTemplates(!showTemplates)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
                  >
                    <span className="text-gray-700">
                      {selectedTemplate
                        ? SHIFT_TEMPLATES.find(t => t.id === selectedTemplate)?.name
                        : (locale === 'de' ? 'Vorlage wählen...' : 'Select template...')}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>

                  {showTemplates && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      {SHIFT_TEMPLATES.map(template => (
                        <button
                          key={template.id}
                          onClick={() => applyTemplate(template.id)}
                          className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors text-sm"
                        >
                          <div className="font-medium text-gray-900">{template.name}</div>
                          <div className="text-xs text-gray-500">
                            {template.start} - {template.end}
                            {template.breakStart && ` (Break: ${template.breakStart}-${template.breakEnd})`}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Time Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Clock className="w-4 h-4 inline mr-1" />
                    {locale === 'de' ? 'Startzeit' : 'Start Time'}
                  </label>
                  <input
                    type="time"
                    value={formData.start}
                    onChange={(e) => setFormData(prev => ({ ...prev, start: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Clock className="w-4 h-4 inline mr-1" />
                    {locale === 'de' ? 'Endzeit' : 'End Time'}
                  </label>
                  <input
                    type="time"
                    value={formData.end}
                    onChange={(e) => setFormData(prev => ({ ...prev, end: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Break Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Coffee className="w-4 h-4 inline mr-1" />
                  {locale === 'de' ? 'Pausenzeit (optional)' : 'Break Time (optional)'}
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="time"
                    value={formData.breakStart}
                    onChange={(e) => setFormData(prev => ({ ...prev, breakStart: e.target.value }))}
                    placeholder={locale === 'de' ? 'Pausenstart' : 'Break start'}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="time"
                    value={formData.breakEnd}
                    onChange={(e) => setFormData(prev => ({ ...prev, breakEnd: e.target.value }))}
                    placeholder={locale === 'de' ? 'Pausenende' : 'Break end'}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Capacity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Users className="w-4 h-4 inline mr-1" />
                  {locale === 'de' ? 'Max. gleichzeitige Termine' : 'Max Concurrent Appointments'}
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.maxBookings}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxBookings: parseInt(e.target.value) || 1 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {locale === 'de' ? 'Status' : 'Status'}
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Shift['status'] }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="active">{locale === 'de' ? 'Aktiv' : 'Active'}</option>
                  <option value="holiday">{locale === 'de' ? 'Urlaub' : 'Holiday'}</option>
                  <option value="sick">{locale === 'de' ? 'Krank' : 'Sick'}</option>
                  <option value="unavailable">{locale === 'de' ? 'Nicht verfügbar' : 'Unavailable'}</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {locale === 'de' ? 'Notizen (optional)' : 'Notes (optional)'}
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={locale === 'de' ? 'Zusätzliche Informationen...' : 'Additional information...'}
                />
              </div>

              {/* Duration Display */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">
                  {locale === 'de' ? 'Arbeitszeit' : 'Working Time'}: <span className="font-semibold text-gray-900">{calculateDuration()}</span>
                </div>
              </div>

              {/* Validation Errors */}
              {validationErrors.length > 0 && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  {validationErrors.map((error, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm text-red-600">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Conflicts */}
              {conflicts.length > 0 && (
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <h4 className="font-medium text-orange-900 mb-2">
                    {locale === 'de' ? 'Konflikte gefunden' : 'Conflicts Found'}
                  </h4>
                  {conflicts.map((conflict, index) => (
                    <div key={index} className="text-sm text-orange-700 mb-1">
                      • {conflict.message}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t bg-gray-50">
              <div className="flex gap-2">
                {shift && onDelete && (
                  <button
                    onClick={() => {
                      onDelete(shift.id);
                      onClose();
                    }}
                    className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    {locale === 'de' ? 'Löschen' : 'Delete'}
                  </button>
                )}
                {shift && onDuplicate && (
                  <button
                    onClick={() => {
                      onDuplicate(shift);
                      onClose();
                    }}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    {locale === 'de' ? 'Duplizieren' : 'Duplicate'}
                  </button>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  {locale === 'de' ? 'Abbrechen' : 'Cancel'}
                </button>
                <button
                  onClick={handleSave}
                  disabled={validationErrors.length > 0}
                  className={`
                    px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2
                    ${validationErrors.length > 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                    }
                  `}
                >
                  <Save className="w-4 h-4" />
                  {locale === 'de' ? 'Speichern' : 'Save'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ShiftEditor;