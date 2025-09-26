// Practitioner Filters Component
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Filter,
  Calendar,
  Star,
  TrendingUp,
  Clock,
  User,
  X,
  ChevronDown,
  Search,
  Sliders,
  CheckCircle
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PractitionerFiltersProps {
  // Current filter values
  availabilityFilter: 'all' | 'today' | 'tomorrow' | 'week';
  sortBy: 'rating' | 'experience' | 'availability' | 'name';
  specialtyFilter: string[];
  searchQuery: string;
  dayFilter: string | null;

  // Available options
  availableSpecialties: string[];

  // Filter setters
  onAvailabilityFilterChange: (filter: 'all' | 'today' | 'tomorrow' | 'week') => void;
  onSortByChange: (sort: 'rating' | 'experience' | 'availability' | 'name') => void;
  onSpecialtyFilterChange: (specialties: string[]) => void;
  onSearchQueryChange: (query: string) => void;
  onDayFilterChange: (day: string | null) => void;
  onClearFilters: () => void;

  // UI options
  resultCount?: number;
  variant?: 'horizontal' | 'vertical';
}

const PractitionerFilters: React.FC<PractitionerFiltersProps> = ({
  availabilityFilter,
  sortBy,
  specialtyFilter,
  searchQuery,
  dayFilter,
  availableSpecialties,
  onAvailabilityFilterChange,
  onSortByChange,
  onSpecialtyFilterChange,
  onSearchQueryChange,
  onDayFilterChange,
  onClearFilters,
  resultCount = 0,
  variant = 'horizontal'
}) => {
  const { t, i18n } = useTranslation();
  const isGerman = i18n.language === 'de';
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showSpecialtyDropdown, setShowSpecialtyDropdown] = useState(false);

  // Days of the week
  const daysOfWeek = [
    { value: 'monday', label: isGerman ? 'Montag' : 'Monday' },
    { value: 'tuesday', label: isGerman ? 'Dienstag' : 'Tuesday' },
    { value: 'wednesday', label: isGerman ? 'Mittwoch' : 'Wednesday' },
    { value: 'thursday', label: isGerman ? 'Donnerstag' : 'Thursday' },
    { value: 'friday', label: isGerman ? 'Freitag' : 'Friday' },
    { value: 'saturday', label: isGerman ? 'Samstag' : 'Saturday' },
    { value: 'sunday', label: isGerman ? 'Sonntag' : 'Sunday' }
  ];

  // Availability filter options
  const availabilityOptions = [
    {
      value: 'all' as const,
      label: isGerman ? 'Alle' : 'All',
      icon: User,
      color: 'gray'
    },
    {
      value: 'today' as const,
      label: isGerman ? 'Heute' : 'Today',
      icon: Clock,
      color: 'green'
    },
    {
      value: 'tomorrow' as const,
      label: isGerman ? 'Morgen' : 'Tomorrow',
      icon: Calendar,
      color: 'blue'
    },
    {
      value: 'week' as const,
      label: isGerman ? 'Diese Woche' : 'This Week',
      icon: TrendingUp,
      color: 'purple'
    }
  ];

  // Sort options
  const sortOptions = [
    {
      value: 'rating' as const,
      label: isGerman ? 'Beste Bewertung' : 'Best Rating',
      icon: Star
    },
    {
      value: 'experience' as const,
      label: isGerman ? 'Meiste Erfahrung' : 'Most Experience',
      icon: TrendingUp
    },
    {
      value: 'availability' as const,
      label: isGerman ? 'Nächste Verfügbarkeit' : 'Next Available',
      icon: Clock
    },
    {
      value: 'name' as const,
      label: isGerman ? 'Name (A-Z)' : 'Name (A-Z)',
      icon: User
    }
  ];

  // Check if any filters are active
  const hasActiveFilters =
    availabilityFilter !== 'all' ||
    sortBy !== 'rating' ||
    specialtyFilter.length > 0 ||
    searchQuery !== '' ||
    dayFilter !== null;

  // Toggle specialty in filter
  const toggleSpecialty = (specialty: string) => {
    if (specialtyFilter.includes(specialty)) {
      onSpecialtyFilterChange(specialtyFilter.filter(s => s !== specialty));
    } else {
      onSpecialtyFilterChange([...specialtyFilter, specialty]);
    }
  };

  // Horizontal variant
  if (variant === 'horizontal') {
    return (
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder={
              isGerman
                ? 'Name oder Spezialisierung suchen...'
                : 'Search by name or specialty...'
            }
            className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchQueryChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Availability Filter */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {availabilityOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => onAvailabilityFilterChange(option.value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    availabilityFilter === option.value
                      ? 'bg-white shadow-sm text-gray-900'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {option.label}
                </button>
              );
            })}
          </div>

          {/* Sort By */}
          <div className="relative">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Sliders className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">
                {isGerman ? 'Sortieren' : 'Sort'}: {sortOptions.find(o => o.value === sortBy)?.label}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform ${
                  showAdvanced ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Sort Dropdown */}
            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-20"
                >
                  {sortOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.value}
                        onClick={() => {
                          onSortByChange(option.value);
                          setShowAdvanced(false);
                        }}
                        className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                          sortBy === option.value
                            ? 'text-blue-600 bg-blue-50'
                            : 'text-gray-700'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {option.label}
                        {sortBy === option.value && (
                          <CheckCircle className="w-4 h-4 ml-auto" />
                        )}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Specialty Filter */}
          <div className="relative">
            <button
              onClick={() => setShowSpecialtyDropdown(!showSpecialtyDropdown)}
              className={`flex items-center gap-2 px-3 py-2 border rounded-lg transition-colors ${
                specialtyFilter.length > 0
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm">
                {isGerman ? 'Spezialisierung' : 'Specialty'}
                {specialtyFilter.length > 0 && ` (${specialtyFilter.length})`}
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  showSpecialtyDropdown ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Specialty Dropdown */}
            <AnimatePresence>
              {showSpecialtyDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto"
                >
                  <div className="p-2">
                    {availableSpecialties.map((specialty) => (
                      <label
                        key={specialty}
                        className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={specialtyFilter.includes(specialty)}
                          onChange={() => toggleSpecialty(specialty)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{specialty}</span>
                      </label>
                    ))}
                  </div>
                  {specialtyFilter.length > 0 && (
                    <div className="border-t border-gray-200 p-2">
                      <button
                        onClick={() => onSpecialtyFilterChange([])}
                        className="w-full px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded"
                      >
                        {isGerman ? 'Alle entfernen' : 'Clear all'}
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Day Filter */}
          <select
            value={dayFilter || ''}
            onChange={(e) => onDayFilterChange(e.target.value || null)}
            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-blue-500"
          >
            <option value="">{isGerman ? 'Alle Tage' : 'All Days'}</option>
            {daysOfWeek.map((day) => (
              <option key={day.value} value={day.value}>
                {day.label}
              </option>
            ))}
          </select>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <X className="w-4 h-4" />
              {isGerman ? 'Filter zurücksetzen' : 'Clear filters'}
            </button>
          )}

          {/* Results Count */}
          {resultCount > 0 && (
            <div className="ml-auto text-sm text-gray-600">
              {resultCount} {isGerman ? 'Ergebnisse' : 'results'}
            </div>
          )}
        </div>

        {/* Active Filters Display */}
        {(specialtyFilter.length > 0 || dayFilter) && (
          <div className="flex flex-wrap gap-2">
            {specialtyFilter.map((specialty) => (
              <span
                key={specialty}
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
              >
                {specialty}
                <button
                  onClick={() => toggleSpecialty(specialty)}
                  className="hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {dayFilter && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                {daysOfWeek.find(d => d.value === dayFilter)?.label}
                <button
                  onClick={() => onDayFilterChange(null)}
                  className="hover:bg-purple-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>
    );
  }

  // Vertical variant (sidebar)
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-900">
        {isGerman ? 'Filter' : 'Filters'}
      </h3>

      {/* Search */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {isGerman ? 'Suche' : 'Search'}
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder={isGerman ? 'Name oder Fach...' : 'Name or specialty...'}
            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Availability */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {isGerman ? 'Verfügbarkeit' : 'Availability'}
        </label>
        <div className="space-y-1">
          {availabilityOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                onClick={() => onAvailabilityFilterChange(option.value)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  availabilityFilter === option.value
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {isGerman ? 'Sortieren nach' : 'Sort by'}
        </label>
        <select
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value as any)}
          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Specialties */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {isGerman ? 'Spezialisierung' : 'Specialty'}
        </label>
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {availableSpecialties.map((specialty) => (
            <label
              key={specialty}
              className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer"
            >
              <input
                type="checkbox"
                checked={specialtyFilter.includes(specialty)}
                onChange={() => toggleSpecialty(specialty)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{specialty}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Day Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {isGerman ? 'Wochentag' : 'Day of Week'}
        </label>
        <select
          value={dayFilter || ''}
          onChange={(e) => onDayFilterChange(e.target.value || null)}
          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
        >
          <option value="">{isGerman ? 'Alle Tage' : 'All Days'}</option>
          {daysOfWeek.map((day) => (
            <option key={day.value} value={day.value}>
              {day.label}
            </option>
          ))}
        </select>
      </div>

      {/* Clear Button */}
      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="w-full px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
        >
          {isGerman ? 'Alle Filter zurücksetzen' : 'Clear all filters'}
        </button>
      )}

      {/* Results Count */}
      <div className="pt-2 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          {resultCount} {isGerman ? 'Fachkräfte gefunden' : 'practitioners found'}
        </p>
      </div>
    </div>
  );
};

export default PractitionerFilters;