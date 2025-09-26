// Main Practitioner Selection Component
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Grid3x3,
  List,
  Info,
  Users,
  Sparkles,
  ChevronRight,
  Calendar,
  Clock,
  MapPin
} from 'lucide-react';
import { usePractitionerSelection } from '../../hooks/usePractitionerSelection';
import PractitionerCard from './PractitionerCard';
import PractitionerFilters from './PractitionerFilters';
import { useTranslation } from 'react-i18next';
import type { Staff } from '../../lib/demoStaffData';
import type { Shift } from '../../lib/staffScheduleUtils';

interface PractitionerSelectProps {
  industryType: 'restaurant' | 'medical' | 'salon' | 'automotive';
  serviceId?: string;
  serviceName?: string;
  serviceDuration?: number;
  existingBookings?: Shift[];
  onSelect: (practitioner: Staff) => void;
  onBack?: () => void;
  showBackButton?: boolean;
  variant?: 'standalone' | 'embedded';
}

const PractitionerSelect: React.FC<PractitionerSelectProps> = ({
  industryType,
  serviceId,
  serviceName,
  serviceDuration = 30,
  existingBookings = [],
  onSelect,
  onBack,
  showBackButton = true,
  variant = 'embedded'
}) => {
  const { t, i18n } = useTranslation();
  const isGerman = i18n.language === 'de';
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showWelcome, setShowWelcome] = useState(true);

  // Use the practitioner selection hook
  const {
    practitioners,
    practitionerAvailability,
    selectedPractitioner,
    preferredPractitioner,
    lastVisitedPractitioner,
    availabilityFilter,
    sortBy,
    specialtyFilter,
    searchQuery,
    dayFilter,
    selectPractitioner,
    setAvailabilityFilter,
    setSortBy,
    setSpecialtyFilter,
    setSearchQuery,
    setDayFilter,
    togglePreferred,
    clearFilters,
    filteredAndSortedAvailability,
    availableSpecialties,
    isLoading,
    error
  } = usePractitionerSelection({
    industryType,
    serviceId,
    serviceDuration,
    existingBookings,
    onSelect
  });

  // Dismiss welcome message after a delay
  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Get industry-specific content
  const getIndustryContent = () => {
    switch (industryType) {
      case 'medical':
        return {
          title: isGerman ? 'Wählen Sie Ihren Arzt' : 'Choose Your Doctor',
          subtitle: isGerman
            ? 'Finden Sie den passenden Spezialisten für Ihre Bedürfnisse'
            : 'Find the right specialist for your needs',
          emptyMessage: isGerman
            ? 'Keine Ärzte mit diesen Filterkriterien gefunden'
            : 'No doctors found with these filters',
          icon: '👨‍⚕️'
        };
      case 'salon':
        return {
          title: isGerman ? 'Wählen Sie Ihren Stylisten' : 'Choose Your Stylist',
          subtitle: isGerman
            ? 'Unsere Experten für Ihren perfekten Look'
            : 'Our experts for your perfect look',
          emptyMessage: isGerman
            ? 'Keine Stylisten mit diesen Filterkriterien gefunden'
            : 'No stylists found with these filters',
          icon: '💇'
        };
      case 'automotive':
        return {
          title: isGerman ? 'Wählen Sie Ihren Mechaniker' : 'Choose Your Mechanic',
          subtitle: isGerman
            ? 'Zertifizierte Experten für Ihr Fahrzeug'
            : 'Certified experts for your vehicle',
          emptyMessage: isGerman
            ? 'Keine Mechaniker mit diesen Filterkriterien gefunden'
            : 'No mechanics found with these filters',
          icon: '🔧'
        };
      default:
        return {
          title: isGerman ? 'Wählen Sie einen Mitarbeiter' : 'Choose a Staff Member',
          subtitle: isGerman
            ? 'Verfügbare Fachkräfte für Ihren Service'
            : 'Available professionals for your service',
          emptyMessage: isGerman
            ? 'Keine Mitarbeiter gefunden'
            : 'No staff members found',
          icon: '👥'
        };
    }
  };

  const content = getIndustryContent();

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">
            {isGerman ? 'Lade verfügbare Fachkräfte...' : 'Loading available practitioners...'}
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Info className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-gray-900 font-medium mb-2">
            {isGerman ? 'Fehler beim Laden' : 'Error loading'}
          </p>
          <p className="text-gray-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${variant === 'standalone' ? 'min-h-screen bg-gray-50' : ''}`}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {showBackButton && onBack && (
                <button
                  onClick={onBack}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
              )}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <span>{content.icon}</span>
                  {content.title}
                </h2>
                <p className="text-sm text-gray-600 mt-1">{content.subtitle}</p>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title={isGerman ? 'Kartenansicht' : 'Grid view'}
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title={isGerman ? 'Listenansicht' : 'List view'}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Service Info */}
          {serviceName && (
            <div className="flex items-center gap-4 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
              <Calendar className="w-4 h-4 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm text-blue-900">
                  <span className="font-medium">{isGerman ? 'Gewählter Service:' : 'Selected Service:'}</span>{' '}
                  {serviceName}
                </p>
              </div>
              <div className="flex items-center gap-1 text-sm text-blue-700">
                <Clock className="w-4 h-4" />
                {serviceDuration} {isGerman ? 'Min.' : 'min'}
              </div>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="px-6 pb-4">
          <PractitionerFilters
            availabilityFilter={availabilityFilter}
            sortBy={sortBy}
            specialtyFilter={specialtyFilter}
            searchQuery={searchQuery}
            dayFilter={dayFilter}
            availableSpecialties={availableSpecialties}
            onAvailabilityFilterChange={setAvailabilityFilter}
            onSortByChange={setSortBy}
            onSpecialtyFilterChange={setSpecialtyFilter}
            onSearchQueryChange={setSearchQuery}
            onDayFilterChange={setDayFilter}
            onClearFilters={clearFilters}
            resultCount={filteredAndSortedAvailability.length}
            variant="horizontal"
          />
        </div>
      </div>

      {/* Welcome Message */}
      <AnimatePresence>
        {showWelcome && (preferredPractitioner || lastVisitedPractitioner) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mx-6 mt-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg"
          >
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-purple-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-purple-900">
                  {isGerman ? 'Willkommen zurück!' : 'Welcome back!'}
                </p>
                {preferredPractitioner && (
                  <p className="text-sm text-purple-700 mt-1">
                    {isGerman
                      ? `Ihr bevorzugter Spezialist ${preferredPractitioner.name} ist verfügbar`
                      : `Your preferred specialist ${preferredPractitioner.name} is available`}
                  </p>
                )}
                {!preferredPractitioner && lastVisitedPractitioner && (
                  <p className="text-sm text-purple-700 mt-1">
                    {isGerman
                      ? `Sie waren zuletzt bei ${lastVisitedPractitioner.name}`
                      : `You last visited ${lastVisitedPractitioner.name}`}
                  </p>
                )}
              </div>
              <button
                onClick={() => setShowWelcome(false)}
                className="text-purple-400 hover:text-purple-600"
              >
                ×
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Practitioners Grid/List */}
      <div className="p-6">
        {filteredAndSortedAvailability.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Users className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-900 font-medium mb-2">{content.emptyMessage}</p>
            <p className="text-gray-600 text-sm mb-6">
              {isGerman
                ? 'Versuchen Sie, Ihre Filter anzupassen'
                : 'Try adjusting your filters'}
            </p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {isGerman ? 'Filter zurücksetzen' : 'Clear filters'}
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          // Grid view
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredAndSortedAvailability.map((item) => (
              <PractitionerCard
                key={item.practitioner.id}
                practitioner={item.practitioner}
                availability={item}
                isSelected={selectedPractitioner?.id === item.practitioner.id}
                isPreferred={preferredPractitioner?.id === item.practitioner.id}
                isLastVisited={lastVisitedPractitioner?.id === item.practitioner.id}
                onSelect={() => selectPractitioner(item.practitioner)}
                onTogglePreferred={() => togglePreferred(item.practitioner)}
                variant="grid"
              />
            ))}
          </div>
        ) : (
          // List view
          <div className="space-y-3">
            {filteredAndSortedAvailability.map((item) => (
              <PractitionerCard
                key={item.practitioner.id}
                practitioner={item.practitioner}
                availability={item}
                isSelected={selectedPractitioner?.id === item.practitioner.id}
                isPreferred={preferredPractitioner?.id === item.practitioner.id}
                isLastVisited={lastVisitedPractitioner?.id === item.practitioner.id}
                onSelect={() => selectPractitioner(item.practitioner)}
                onTogglePreferred={() => togglePreferred(item.practitioner)}
                variant="list"
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick Stats Footer */}
      {filteredAndSortedAvailability.length > 0 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-gray-600">
                  {filteredAndSortedAvailability.filter(a => a.isAvailableNow).length}{' '}
                  {isGerman ? 'jetzt verfügbar' : 'available now'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">
                  {filteredAndSortedAvailability.filter(a => a.isAvailableToday).length}{' '}
                  {isGerman ? 'heute verfügbar' : 'available today'}
                </span>
              </div>
            </div>
            <div className="text-gray-500">
              {isGerman ? 'Tipp: Wählen Sie Favoriten für schnellere Buchungen' : 'Tip: Mark favorites for faster booking'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PractitionerSelect;