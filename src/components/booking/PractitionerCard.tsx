// Practitioner Card Component
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Award,
  MapPin,
  Phone,
  Mail,
  Heart,
  ChevronDown,
  ChevronUp,
  Calendar,
  Clock,
  Users,
  CheckCircle,
  TrendingUp
} from 'lucide-react';
import type { Staff } from '../../lib/demoStaffData';
import type { PractitionerAvailability } from '../../lib/practitionerAvailability';
import AvailabilityPreview from './AvailabilityPreview';
import { useTranslation } from 'react-i18next';

interface PractitionerCardProps {
  practitioner: Staff;
  availability: PractitionerAvailability;
  isSelected?: boolean;
  isPreferred?: boolean;
  isLastVisited?: boolean;
  onSelect: () => void;
  onTogglePreferred: () => void;
  onViewDetails?: () => void;
  variant?: 'grid' | 'list';
}

const PractitionerCard: React.FC<PractitionerCardProps> = ({
  practitioner,
  availability,
  isSelected = false,
  isPreferred = false,
  isLastVisited = false,
  onSelect,
  onTogglePreferred,
  onViewDetails,
  variant = 'grid'
}) => {
  const { t, i18n } = useTranslation();
  const isGerman = i18n.language === 'de';
  const [isExpanded, setIsExpanded] = useState(false);

  // Generate initials for avatar placeholder
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  // Get role display name
  const getRoleDisplay = (role: string) => {
    const roleMap: Record<string, { en: string; de: string }> = {
      doctor: { en: 'Doctor', de: 'Arzt' },
      hairdresser: { en: 'Hairdresser', de: 'Friseur' },
      therapist: { en: 'Therapist', de: 'Therapeut' },
      mechanic: { en: 'Mechanic', de: 'Mechaniker' }
    };
    return roleMap[role]?.[isGerman ? 'de' : 'en'] || role;
  };

  // Grid variant
  if (variant === 'grid') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ y: -4 }}
        className={`relative bg-white rounded-xl shadow-sm border-2 transition-all overflow-hidden ${
          isSelected
            ? 'border-blue-500 shadow-lg'
            : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
        }`}
      >
        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-1 z-10">
          {isPreferred && (
            <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
              ☆ {isGerman ? 'Favorit' : 'Favorite'}
            </span>
          )}
          {isLastVisited && (
            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
              {isGerman ? 'Zuletzt' : 'Recent'}
            </span>
          )}
          {availability.isAvailableNow && (
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full animate-pulse">
              {isGerman ? 'Jetzt' : 'Now'}
            </span>
          )}
        </div>

        {/* Header */}
        <div className="p-4 pb-0">
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md"
              style={{ backgroundColor: practitioner.color }}
            >
              {practitioner.avatar ? (
                <img
                  src={practitioner.avatar}
                  alt={practitioner.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                getInitials(practitioner.name)
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">
                {practitioner.name}
              </h3>
              <p className="text-sm text-gray-600">
                {getRoleDisplay(practitioner.role)}
              </p>
              
              {/* Rating */}
              <div className="flex items-center gap-1 mt-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(practitioner.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-600">
                  {practitioner.rating} ({practitioner.bookingCount})
                </span>
              </div>
            </div>
          </div>

          {/* Specialties */}
          <div className="flex flex-wrap gap-1 mt-3">
            {practitioner.specialties.slice(0, 3).map((specialty, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                {specialty}
              </span>
            ))}
            {practitioner.specialties.length > 3 && (
              <span className="px-2 py-1 text-gray-500 text-xs">
                +{practitioner.specialties.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Availability Preview */}
        <div className="px-4 py-3 border-t border-gray-100">
          <AvailabilityPreview
            slots={availability.nextAvailableSlots}
            isAvailableNow={availability.isAvailableNow}
            isFullyBooked={availability.isFullyBooked}
            variant="compact"
          />
        </div>

        {/* Actions */}
        <div className="p-4 pt-0 flex gap-2">
          <button
            onClick={onSelect}
            className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            {isGerman ? 'Auswählen' : 'Select'}
          </button>
          <button
            onClick={onTogglePreferred}
            className={`p-2 rounded-lg transition-colors ${
              isPreferred
                ? 'bg-amber-100 text-amber-600 hover:bg-amber-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title={isPreferred ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-4 h-4 ${isPreferred ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Expanded Details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-gray-100 overflow-hidden"
            >
              <div className="p-4 space-y-3">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">
                        {isGerman ? 'Patienten' : 'Patients'}
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        {practitioner.bookingCount}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">
                        {isGerman ? 'Erfahrung' : 'Experience'}
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        {Math.floor(practitioner.bookingCount / 200)}+ {isGerman ? 'Jahre' : 'years'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="truncate">{practitioner.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{practitioner.phone}</span>
                  </div>
                </div>

                {/* All Specialties */}
                <div>
                  <p className="text-xs text-gray-500 mb-2">
                    {isGerman ? 'Alle Spezialisierungen' : 'All Specialties'}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {practitioner.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                {/* View Profile Button */}
                {onViewDetails && (
                  <button
                    onClick={onViewDetails}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    {isGerman ? 'Vollständiges Profil anzeigen' : 'View Full Profile'}
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  // List variant
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={`relative bg-white rounded-lg shadow-sm border-2 p-4 transition-all ${
        isSelected
          ? 'border-blue-500 shadow-lg'
          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold shadow-md flex-shrink-0"
          style={{ backgroundColor: practitioner.color }}
        >
          {practitioner.avatar ? (
            <img
              src={practitioner.avatar}
              alt={practitioner.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            getInitials(practitioner.name)
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">
                {practitioner.name}
                {isPreferred && (
                  <span className="ml-2 text-amber-500">☆</span>
                )}
              </h3>
              <p className="text-sm text-gray-600">
                {getRoleDisplay(practitioner.role)}
              </p>
            </div>

            {/* Badges */}
            <div className="flex gap-1">
              {availability.isAvailableNow && (
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  {isGerman ? 'Jetzt verfügbar' : 'Available now'}
                </span>
              )}
              {isLastVisited && (
                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                  {isGerman ? 'Zuletzt besucht' : 'Last visited'}
                </span>
              )}
            </div>
          </div>

          {/* Rating and Specialties */}
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(practitioner.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-600">
                {practitioner.rating} ({practitioner.bookingCount})
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {practitioner.specialties.slice(0, 2).map((specialty, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                >
                  {specialty}
                </span>
              ))}
              {practitioner.specialties.length > 2 && (
                <span className="px-2 py-1 text-gray-500 text-xs">
                  +{practitioner.specialties.length - 2}
                </span>
              )}
            </div>
          </div>

          {/* Availability */}
          <div className="mt-3">
            <AvailabilityPreview
              slots={availability.nextAvailableSlots}
              isAvailableNow={availability.isAvailableNow}
              isFullyBooked={availability.isFullyBooked}
              variant="compact"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            onClick={onSelect}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            {isGerman ? 'Auswählen' : 'Select'}
          </button>
          <button
            onClick={onTogglePreferred}
            className={`p-2 rounded-lg transition-colors ${
              isPreferred
                ? 'bg-amber-100 text-amber-600 hover:bg-amber-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Heart className={`w-4 h-4 ${isPreferred ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PractitionerCard;