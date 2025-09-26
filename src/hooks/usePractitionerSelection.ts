// Practitioner Selection Hook
import { useState, useEffect, useCallback, useMemo } from 'react';
import { ALL_DEMO_STAFF, getStaffByRole, Staff } from '../lib/demoStaffData';
import {
  getPractitionerAvailability,
  filterPractitionersByAvailability,
  sortPractitioners,
  PractitionerAvailability
} from '../lib/practitionerAvailability';
import type { Shift } from '../lib/staffScheduleUtils';

interface UsePractitionerSelectionOptions {
  industryType: 'restaurant' | 'medical' | 'salon' | 'automotive';
  serviceId?: string;
  serviceDuration?: number;
  existingBookings?: Shift[];
  onSelect?: (practitioner: Staff) => void;
}

interface UsePractitionerSelectionReturn {
  // Data
  practitioners: Staff[];
  practitionerAvailability: PractitionerAvailability[];
  selectedPractitioner: Staff | null;
  preferredPractitioner: Staff | null;
  lastVisitedPractitioner: Staff | null;

  // Filters
  availabilityFilter: 'all' | 'today' | 'tomorrow' | 'week';
  sortBy: 'rating' | 'experience' | 'availability' | 'name';
  specialtyFilter: string[];
  searchQuery: string;
  dayFilter: string | null;

  // Actions
  selectPractitioner: (practitioner: Staff) => void;
  setAvailabilityFilter: (filter: 'all' | 'today' | 'tomorrow' | 'week') => void;
  setSortBy: (sort: 'rating' | 'experience' | 'availability' | 'name') => void;
  setSpecialtyFilter: (specialties: string[]) => void;
  setSearchQuery: (query: string) => void;
  setDayFilter: (day: string | null) => void;
  togglePreferred: (practitioner: Staff) => void;
  clearFilters: () => void;

  // Utilities
  filteredAndSortedAvailability: PractitionerAvailability[];
  availableSpecialties: string[];
  isLoading: boolean;
  error: string | null;
}

// LocalStorage keys
const STORAGE_KEYS = {
  PREFERRED: 'preferred_practitioner',
  LAST_VISITED: 'last_visited_practitioner',
  PREFERENCES: 'practitioner_preferences'
};

export const usePractitionerSelection = (
  options: UsePractitionerSelectionOptions
): UsePractitionerSelectionReturn => {
  const {
    industryType,
    serviceId,
    serviceDuration = 30,
    existingBookings = [],
    onSelect
  } = options;

  // State
  const [selectedPractitioner, setSelectedPractitioner] = useState<Staff | null>(null);
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'today' | 'tomorrow' | 'week'>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'availability' | 'name'>('rating');
  const [specialtyFilter, setSpecialtyFilter] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dayFilter, setDayFilter] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get practitioners based on industry type
  const practitioners = useMemo(() => {
    switch (industryType) {
      case 'medical':
        return getStaffByRole('doctor');
      case 'salon':
        return getStaffByRole('hairdresser');
      case 'automotive':
        return getStaffByRole('mechanic');
      default:
        return ALL_DEMO_STAFF;
    }
  }, [industryType]);

  // Get preferred practitioner from localStorage
  const preferredPractitioner = useMemo(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PREFERRED);
      if (stored) {
        const id = JSON.parse(stored)[industryType];
        return practitioners.find(p => p.id === id) || null;
      }
    } catch (e) {
      console.error('Error loading preferred practitioner:', e);
    }
    return null;
  }, [industryType, practitioners]);

  // Get last visited practitioner from localStorage
  const lastVisitedPractitioner = useMemo(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LAST_VISITED);
      if (stored) {
        const id = JSON.parse(stored)[industryType];
        return practitioners.find(p => p.id === id) || null;
      }
    } catch (e) {
      console.error('Error loading last visited practitioner:', e);
    }
    return null;
  }, [industryType, practitioners]);

  // Calculate availability for all practitioners
  const practitionerAvailability = useMemo(() => {
    setIsLoading(true);
    const availability = practitioners.map(practitioner =>
      getPractitionerAvailability(
        practitioner,
        new Date(),
        serviceDuration,
        existingBookings
      )
    );
    setIsLoading(false);
    return availability;
  }, [practitioners, serviceDuration, existingBookings]);

  // Get available specialties
  const availableSpecialties = useMemo(() => {
    const specialties = new Set<string>();
    practitioners.forEach(p => {
      p.specialties.forEach(s => specialties.add(s));
    });
    return Array.from(specialties).sort();
  }, [practitioners]);

  // Filter and sort practitioners
  const filteredAndSortedAvailability = useMemo(() => {
    let filtered = [...practitionerAvailability];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(pa =>
        pa.practitioner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pa.practitioner.specialties.some(s =>
          s.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Apply specialty filter
    if (specialtyFilter.length > 0) {
      filtered = filtered.filter(pa =>
        specialtyFilter.some(specialty =>
          pa.practitioner.specialties.includes(specialty)
        )
      );
    }

    // Apply availability filter
    if (availabilityFilter !== 'all') {
      const filteredPractitioners = filterPractitionersByAvailability(
        filtered.map(pa => pa.practitioner),
        availabilityFilter,
        serviceDuration,
        existingBookings
      );
      filtered = filtered.filter(pa =>
        filteredPractitioners.includes(pa.practitioner)
      );
    }

    // Apply day filter
    if (dayFilter) {
      filtered = filtered.filter(pa => {
        const workingDays = Object.entries(pa.practitioner.defaultSchedule)
          .filter(([_, shifts]) => shifts.length > 0)
          .map(([day]) => day);
        return workingDays.includes(dayFilter);
      });
    }

    // Apply sorting
    return sortPractitioners(filtered, sortBy);
  }, [
    practitionerAvailability,
    searchQuery,
    specialtyFilter,
    availabilityFilter,
    dayFilter,
    sortBy,
    serviceDuration,
    existingBookings
  ]);

  // Select practitioner
  const selectPractitioner = useCallback((practitioner: Staff) => {
    setSelectedPractitioner(practitioner);

    // Save as last visited
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LAST_VISITED) || '{}';
      const lastVisited = JSON.parse(stored);
      lastVisited[industryType] = practitioner.id;
      localStorage.setItem(STORAGE_KEYS.LAST_VISITED, JSON.stringify(lastVisited));
    } catch (e) {
      console.error('Error saving last visited:', e);
    }

    // Call onSelect callback
    if (onSelect) {
      onSelect(practitioner);
    }
  }, [industryType, onSelect]);

  // Toggle preferred practitioner
  const togglePreferred = useCallback((practitioner: Staff) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PREFERRED) || '{}';
      const preferred = JSON.parse(stored);

      if (preferred[industryType] === practitioner.id) {
        // Remove from preferred
        delete preferred[industryType];
      } else {
        // Add to preferred
        preferred[industryType] = practitioner.id;
      }

      localStorage.setItem(STORAGE_KEYS.PREFERRED, JSON.stringify(preferred));
      // Force re-render by updating state
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error('Error toggling preferred:', e);
    }
  }, [industryType]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setAvailabilityFilter('all');
    setSortBy('rating');
    setSpecialtyFilter([]);
    setSearchQuery('');
    setDayFilter(null);
  }, []);

  // Load preferences on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      if (stored) {
        const prefs = JSON.parse(stored);
        if (prefs[industryType]) {
          const { sortBy: savedSort, availabilityFilter: savedFilter } = prefs[industryType];
          if (savedSort) setSortBy(savedSort);
          if (savedFilter) setAvailabilityFilter(savedFilter);
        }
      }
    } catch (e) {
      console.error('Error loading preferences:', e);
    }
  }, [industryType]);

  // Save preferences when they change
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PREFERENCES) || '{}';
      const prefs = JSON.parse(stored);
      prefs[industryType] = { sortBy, availabilityFilter };
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
    } catch (e) {
      console.error('Error saving preferences:', e);
    }
  }, [industryType, sortBy, availabilityFilter]);

  return {
    // Data
    practitioners,
    practitionerAvailability,
    selectedPractitioner,
    preferredPractitioner,
    lastVisitedPractitioner,

    // Filters
    availabilityFilter,
    sortBy,
    specialtyFilter,
    searchQuery,
    dayFilter,

    // Actions
    selectPractitioner,
    setAvailabilityFilter,
    setSortBy,
    setSpecialtyFilter,
    setSearchQuery,
    setDayFilter,
    togglePreferred,
    clearFilters,

    // Utilities
    filteredAndSortedAvailability,
    availableSpecialties,
    isLoading,
    error
  };
};