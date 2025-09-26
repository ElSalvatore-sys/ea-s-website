// Main Staff Scheduler Component
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Users, Clock, Filter, Download, Upload,
  Grid, List, ChevronDown, Search, Plus, Settings,
  BarChart3, AlertCircle
} from 'lucide-react';
import { useStaffSchedule } from '../../hooks/useStaffSchedule';
import StaffCard from './StaffCard';
import ShiftCalendar from './ShiftCalendar';
import ShiftEditor from './ShiftEditor';
import ConflictResolver from './ConflictResolver';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import type { Shift } from '../../lib/staffScheduleUtils';
import { calculateStaffStats } from '../../lib/staffScheduleUtils';

interface StaffSchedulerProps {
  locale?: 'en' | 'de';
  onClose?: () => void;
}

const StaffScheduler: React.FC<StaffSchedulerProps> = ({
  locale = 'en',
  onClose
}) => {
  // Use the staff schedule hook
  const {
    staff,
    shifts,
    currentWeek,
    selectedStaff,
    selectedShift,
    conflicts,
    templates,
    addShift,
    updateShift,
    deleteShift,
    selectStaff,
    selectShift,
    navigateWeek,
    applyTemplate,
    generateWeekSchedule,
    clearConflicts,
    toggleShiftStatus,
    getStaffShifts,
    isLoading,
    error
  } = useStaffSchedule({ autoLoadDemo: true });

  // Local state
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [filterRole, setFilterRole] = useState<'all' | 'doctor' | 'hairdresser'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showShiftEditor, setShowShiftEditor] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [showConflicts, setShowConflicts] = useState(true);
  const [showStats, setShowStats] = useState(false);

  // Filter staff based on role and search
  const filteredStaff = staff.filter(s => {
    if (filterRole !== 'all' && s.role !== filterRole) return false;
    if (searchQuery && !s.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Calculate statistics
  const stats = calculateStaffStats(shifts);

  // Handle shift click
  const handleShiftClick = (shift: Shift) => {
    setEditingShift(shift);
    selectShift(shift.id);
    setShowShiftEditor(true);
  };

  // Handle create shift
  const handleCreateShift = (staffId: string, date: Date, startTime: string, endTime: string) => {
    const staffMember = staff.find(s => s.id === staffId);
    if (!staffMember) return;

    addShift({
      staffId,
      date,
      start: startTime,
      end: endTime,
      status: 'active'
    });
  };

  // Handle save shift
  const handleSaveShift = (shiftData: Omit<Shift, 'id'> | Shift) => {
    if ('id' in shiftData) {
      updateShift(shiftData.id, shiftData);
    } else {
      addShift(shiftData);
    }
    setShowShiftEditor(false);
    setEditingShift(null);
  };

  // Handle conflict resolution
  const handleResolveConflict = (index: number, action: 'ignore' | 'cancel' | 'adjust') => {
    if (action === 'ignore') {
      // Just clear this conflict
      clearConflicts();
    } else if (action === 'cancel' && editingShift) {
      // Cancel the current edit
      setEditingShift(null);
      setShowShiftEditor(false);
      clearConflicts();
    } else if (action === 'adjust' && editingShift) {
      // Open editor to adjust
      setShowShiftEditor(true);
    }
  };

  // Export schedule
  const handleExport = () => {
    const data = {
      week: format(currentWeek, 'yyyy-MM-dd'),
      shifts: shifts.map(s => ({
        ...s,
        staffName: staff.find(st => st.id === s.staffId)?.name
      }))
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `schedule-${format(currentWeek, 'yyyy-MM-dd')}.json`;
    a.click();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Calendar className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">
                {locale === 'de' ? 'Personalplanung' : 'Staff Scheduler'}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'calendar'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Grid className="w-4 h-4 inline mr-1" />
                  {locale === 'de' ? 'Kalender' : 'Calendar'}
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List className="w-4 h-4 inline mr-1" />
                  {locale === 'de' ? 'Liste' : 'List'}
                </button>
              </div>

              {/* Actions */}
              <button
                onClick={() => setShowStats(!showStats)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <BarChart3 className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={handleExport}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Download className="w-5 h-5 text-gray-600" />
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  {locale === 'de' ? 'Schließen' : 'Close'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-80 space-y-4">
            {/* Search and Filter */}
            <div className="bg-white rounded-lg p-4 shadow">
              <div className="space-y-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder={locale === 'de' ? 'Mitarbeiter suchen...' : 'Search staff...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Role Filter */}
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">{locale === 'de' ? 'Alle Rollen' : 'All Roles'}</option>
                  <option value="doctor">{locale === 'de' ? 'Ärzte' : 'Doctors'}</option>
                  <option value="hairdresser">{locale === 'de' ? 'Friseure' : 'Hairdressers'}</option>
                </select>
              </div>
            </div>

            {/* Staff List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b bg-gray-50">
                <h3 className="font-semibold text-gray-900">
                  {locale === 'de' ? 'Mitarbeiter' : 'Staff Members'}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {filteredStaff.length} {locale === 'de' ? 'Mitarbeiter' : 'members'}
                </p>
              </div>
              <div className="max-h-[600px] overflow-y-auto p-4 space-y-3">
                {filteredStaff.map(staffMember => (
                  <StaffCard
                    key={staffMember.id}
                    staff={staffMember}
                    shifts={getStaffShifts(staffMember.id)}
                    isSelected={selectedStaff?.id === staffMember.id}
                    onClick={() => selectStaff(staffMember.id)}
                    compact
                  />
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg p-4 shadow">
              <h3 className="font-semibold text-gray-900 mb-3">
                {locale === 'de' ? 'Schnellaktionen' : 'Quick Actions'}
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    if (selectedStaff) {
                      setEditingShift(null);
                      setShowShiftEditor(true);
                    }
                  }}
                  disabled={!selectedStaff}
                  className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {locale === 'de' ? 'Neue Schicht' : 'New Shift'}
                </button>
                <button
                  onClick={() => generateWeekSchedule(selectedStaff?.id)}
                  className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {locale === 'de' ? 'Wochenplan generieren' : 'Generate Week Schedule'}
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-4">
            {/* Stats Panel */}
            {showStats && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg p-4 shadow"
              >
                <h3 className="font-semibold text-gray-900 mb-3">
                  {locale === 'de' ? 'Wochenstatistik' : 'Week Statistics'}
                </h3>
                <div className="grid grid-cols-4 gap-4">
                  {Object.entries(stats).slice(0, 4).map(([staffId, stat]) => {
                    const staffMember = staff.find(s => s.id === staffId);
                    if (!staffMember) return null;
                    return (
                      <div key={staffId} className="text-center">
                        <div className="text-sm text-gray-600">{staffMember.name}</div>
                        <div className="text-2xl font-bold text-gray-900">
                          {stat.totalHours.toFixed(1)}h
                        </div>
                        <div className="text-xs text-gray-500">
                          {stat.shiftsCount} {locale === 'de' ? 'Schichten' : 'shifts'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Calendar View */}
            {viewMode === 'calendar' && (
              <ShiftCalendar
                staff={filteredStaff}
                shifts={shifts}
                currentWeek={currentWeek}
                onNavigateWeek={navigateWeek}
                onShiftClick={handleShiftClick}
                onCreateShift={handleCreateShift}
                onShiftUpdate={updateShift}
                selectedStaffId={selectedStaff?.id}
                locale={locale}
              />
            )}

            {/* List View */}
            {viewMode === 'list' && (
              <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b">
                  <h3 className="font-semibold text-gray-900">
                    {locale === 'de' ? 'Schichtliste' : 'Shift List'}
                  </h3>
                </div>
                <div className="divide-y">
                  {shifts
                    .filter(s => !selectedStaff || s.staffId === selectedStaff.id)
                    .sort((a, b) => a.date.getTime() - b.date.getTime())
                    .map(shift => {
                      const staffMember = staff.find(s => s.id === shift.staffId);
                      return (
                        <div
                          key={shift.id}
                          onClick={() => handleShiftClick(shift)}
                          className="p-4 hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: staffMember?.color }}
                            />
                            <div>
                              <div className="font-medium text-gray-900">
                                {staffMember?.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {format(shift.date, 'EEE, MMM d', {
                                  locale: locale === 'de' ? de : undefined
                                })} • {shift.start} - {shift.end}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {shift.status !== 'active' && (
                              <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">
                                {shift.status}
                              </span>
                            )}
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Shift Editor Modal */}
      {selectedStaff && (
        <ShiftEditor
          isOpen={showShiftEditor}
          onClose={() => {
            setShowShiftEditor(false);
            setEditingShift(null);
          }}
          shift={editingShift}
          staff={selectedStaff}
          date={new Date()}
          onSave={handleSaveShift}
          onDelete={deleteShift}
          conflicts={conflicts}
          locale={locale}
        />
      )}

      {/* Conflict Resolver */}
      {showConflicts && conflicts.length > 0 && (
        <ConflictResolver
          conflicts={conflicts}
          onResolve={handleResolveConflict}
          onClose={() => setShowConflicts(false)}
          locale={locale}
        />
      )}

      {/* Error Display */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default StaffScheduler;