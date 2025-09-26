// Intelligent Booking Optimization Engine
import { format, addMinutes, differenceInMinutes, isSameDay } from 'date-fns';
import type { Staff } from '../lib/demoStaffData';
import type { Shift } from '../lib/staffScheduleUtils';
import { timeToMinutes, minutesToTime } from '../lib/staffScheduleUtils';
import type { TimeSlot } from './availabilityEngine';

export interface OptimizationGoal {
  type: 'maximize_utilization' | 'minimize_gaps' | 'balance_workload' | 'customer_convenience';
  weight: number; // 0-1
}

export interface ServiceGroup {
  id: string;
  name: string;
  services: string[];
  preferredGrouping: boolean;
  bufferTime?: number;
}

export interface OptimizationResult {
  score: number; // 0-100
  schedule: OptimizedBooking[];
  improvements: {
    utilizationGain: number;
    gapReduction: number;
    customerSatisfaction: number;
  };
  recommendations: string[];
}

export interface OptimizedBooking {
  practitionerId: string;
  customerId?: string;
  serviceId: string;
  date: Date;
  startTime: string;
  endTime: string;
  priority: 'high' | 'medium' | 'low';
  canMove: boolean;
  suggestedTime?: string;
  reason?: string;
}

export interface SchedulePattern {
  dayOfWeek: number; // 0-6
  peakHours: Array<{ start: string; end: string }>;
  quietHours: Array<{ start: string; end: string }>;
  averageBookingsPerHour: number;
  commonServiceTypes: string[];
}

export class BookingOptimizer {
  private goals: OptimizationGoal[] = [];
  private serviceGroups: ServiceGroup[] = [];
  private patterns: Map<string, SchedulePattern[]> = new Map();

  constructor() {
    this.setDefaultGoals();
    this.initializeServiceGroups();
  }

  /**
   * Set optimization goals
   */
  setGoals(goals: OptimizationGoal[]): void {
    const totalWeight = goals.reduce((sum, g) => sum + g.weight, 0);
    if (Math.abs(totalWeight - 1) > 0.01) {
      throw new Error('Goal weights must sum to 1');
    }
    this.goals = goals;
  }

  /**
   * Optimize a practitioner's daily schedule
   */
  optimizeSchedule(
    practitioner: Staff,
    date: Date,
    existingBookings: Shift[],
    availableSlots: TimeSlot[],
    preferences?: {
      preferredBreakTime?: string;
      maxConsecutiveHours?: number;
      avoidBackToBackDifficult?: boolean;
    }
  ): OptimizationResult {
    const dayBookings = existingBookings.filter(b =>
      b.staffId === practitioner.id && isSameDay(b.date, date)
    );

    // Analyze current schedule
    const analysis = this.analyzeSchedule(dayBookings, availableSlots);

    // Generate optimization suggestions
    const optimized = this.generateOptimizedSchedule(
      practitioner,
      date,
      dayBookings,
      availableSlots,
      analysis,
      preferences
    );

    // Calculate improvements
    const improvements = this.calculateImprovements(
      dayBookings,
      optimized.schedule,
      availableSlots
    );

    // Generate recommendations
    const recommendations = this.generateRecommendations(
      analysis,
      improvements,
      practitioner
    );

    return {
      score: this.calculateOptimizationScore(improvements),
      schedule: optimized.schedule,
      improvements,
      recommendations
    };
  }

  /**
   * Find optimal slot for a new booking
   */
  findOptimalSlot(
    practitioner: Staff,
    serviceDuration: number,
    serviceType: string,
    availableSlots: TimeSlot[],
    customerPreferences?: {
      preferredTime?: string;
      preferredDay?: Date;
      flexibility?: 'high' | 'medium' | 'low';
    }
  ): TimeSlot | null {
    if (availableSlots.length === 0) return null;

    const scoredSlots = availableSlots.map(slot => {
      let score = 0;

      // Customer preference matching
      if (customerPreferences?.preferredTime) {
        const preferredMinutes = timeToMinutes(customerPreferences.preferredTime);
        const slotMinutes = timeToMinutes(slot.startTime);
        const diff = Math.abs(preferredMinutes - slotMinutes);
        score += Math.max(0, 100 - diff); // Closer to preferred time = higher score
      }

      // Utilization optimization
      if (this.wouldReduceGaps(slot, availableSlots)) {
        score += 30;
      }

      // Service grouping
      if (this.isGoodForGrouping(slot, serviceType, availableSlots)) {
        score += 20;
      }

      // Demand-based pricing potential
      if (slot.metadata?.demandLevel === 'low') {
        score += 10; // Fill low-demand slots
      }

      // Avoid creating small unusable gaps
      if (this.wouldCreateUsableGaps(slot, serviceDuration, availableSlots)) {
        score += 15;
      }

      return { slot, score };
    });

    // Sort by score and return best option
    scoredSlots.sort((a, b) => b.score - a.score);
    return scoredSlots[0]?.slot || null;
  }

  /**
   * Balance workload across multiple practitioners
   */
  balanceWorkload(
    practitioners: Staff[],
    date: Date,
    bookings: Shift[]
  ): Map<string, OptimizedBooking[]> {
    const workloadMap = new Map<string, OptimizedBooking[]>();
    const utilizationMap = new Map<string, number>();

    // Calculate current utilization for each practitioner
    practitioners.forEach(practitioner => {
      const dayBookings = bookings.filter(b =>
        b.staffId === practitioner.id && isSameDay(b.date, date)
      );

      const totalMinutes = this.calculateTotalWorkMinutes(practitioner, date);
      const bookedMinutes = dayBookings.reduce((sum, b) => {
        return sum + (timeToMinutes(b.end) - timeToMinutes(b.start));
      }, 0);

      utilizationMap.set(practitioner.id, bookedMinutes / totalMinutes);
    });

    // Find average utilization
    const avgUtilization = Array.from(utilizationMap.values()).reduce((a, b) => a + b, 0) / practitioners.length;

    // Redistribute bookings to balance workload
    practitioners.forEach(practitioner => {
      const currentUtilization = utilizationMap.get(practitioner.id) || 0;
      const optimizedBookings: OptimizedBooking[] = [];

      if (currentUtilization > avgUtilization + 0.1) {
        // Overloaded - suggest moving some bookings
        const bookingsToMove = this.selectBookingsToMove(
          bookings.filter(b => b.staffId === practitioner.id),
          currentUtilization - avgUtilization
        );

        bookingsToMove.forEach(booking => {
          optimizedBookings.push({
            practitionerId: practitioner.id,
            serviceId: booking.id,
            date: booking.date,
            startTime: booking.start,
            endTime: booking.end,
            priority: 'medium',
            canMove: true,
            reason: 'Balance workload across team'
          });
        });
      }

      workloadMap.set(practitioner.id, optimizedBookings);
    });

    return workloadMap;
  }

  /**
   * Learn patterns from historical data
   */
  learnPatterns(
    practitionerId: string,
    historicalBookings: Shift[]
  ): void {
    const patterns: SchedulePattern[] = [];

    // Group bookings by day of week
    const byDayOfWeek = new Map<number, Shift[]>();
    historicalBookings.forEach(booking => {
      const day = booking.date.getDay();
      if (!byDayOfWeek.has(day)) {
        byDayOfWeek.set(day, []);
      }
      byDayOfWeek.get(day)!.push(booking);
    });

    // Analyze patterns for each day
    byDayOfWeek.forEach((bookings, dayOfWeek) => {
      const hourCounts = new Map<number, number>();
      bookings.forEach(booking => {
        const hour = parseInt(booking.start.split(':')[0]);
        hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1);
      });

      // Find peak hours
      const avgCount = Array.from(hourCounts.values()).reduce((a, b) => a + b, 0) / hourCounts.size;
      const peakHours: Array<{ start: string; end: string }> = [];
      const quietHours: Array<{ start: string; end: string }> = [];

      hourCounts.forEach((count, hour) => {
        if (count > avgCount * 1.5) {
          peakHours.push({ start: `${hour}:00`, end: `${hour + 1}:00` });
        } else if (count < avgCount * 0.5) {
          quietHours.push({ start: `${hour}:00`, end: `${hour + 1}:00` });
        }
      });

      patterns.push({
        dayOfWeek,
        peakHours: this.mergeTimeRanges(peakHours),
        quietHours: this.mergeTimeRanges(quietHours),
        averageBookingsPerHour: avgCount,
        commonServiceTypes: [] // Would need service type data
      });
    });

    this.patterns.set(practitionerId, patterns);
  }

  /**
   * Predict optimal schedule for next period
   */
  predictOptimalSchedule(
    practitioner: Staff,
    startDate: Date,
    days: number = 7
  ): Map<string, TimeSlot[]> {
    const predictions = new Map<string, TimeSlot[]>();
    const patterns = this.patterns.get(practitioner.id) || [];

    for (let day = 0; day < days; day++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + day);
      const dayOfWeek = date.getDay();

      const pattern = patterns.find(p => p.dayOfWeek === dayOfWeek);
      if (pattern) {
        // Generate predicted optimal slots based on patterns
        const optimalSlots: TimeSlot[] = [];

        pattern.peakHours.forEach(range => {
          const startMinutes = timeToMinutes(range.start);
          const endMinutes = timeToMinutes(range.end);

          for (let time = startMinutes; time < endMinutes; time += 30) {
            optimalSlots.push({
              practitionerId: practitioner.id,
              date,
              startTime: minutesToTime(time),
              endTime: minutesToTime(time + 30),
              available: true,
              capacity: 1,
              currentBookings: 0,
              metadata: {
                demandLevel: 'high'
              }
            });
          }
        });

        predictions.set(format(date, 'yyyy-MM-dd'), optimalSlots);
      }
    }

    return predictions;
  }

  // Private helper methods

  private setDefaultGoals(): void {
    this.goals = [
      { type: 'maximize_utilization', weight: 0.3 },
      { type: 'minimize_gaps', weight: 0.3 },
      { type: 'balance_workload', weight: 0.2 },
      { type: 'customer_convenience', weight: 0.2 }
    ];
  }

  private initializeServiceGroups(): void {
    this.serviceGroups = [
      {
        id: 'medical-checkup',
        name: 'Medical Checkups',
        services: ['annual-checkup', 'physical-exam', 'health-screening'],
        preferredGrouping: true,
        bufferTime: 15
      },
      {
        id: 'hair-color',
        name: 'Hair Coloring',
        services: ['hair-color', 'highlights', 'balayage'],
        preferredGrouping: true,
        bufferTime: 30
      },
      {
        id: 'quick-services',
        name: 'Quick Services',
        services: ['trim', 'beard-trim', 'consultation'],
        preferredGrouping: true,
        bufferTime: 5
      }
    ];
  }

  private analyzeSchedule(
    bookings: Shift[],
    availableSlots: TimeSlot[]
  ): any {
    const gaps: Array<{ start: string; end: string; duration: number }> = [];
    const utilization = this.calculateUtilization(bookings, availableSlots);

    // Find gaps
    const sortedBookings = [...bookings].sort((a, b) =>
      timeToMinutes(a.start) - timeToMinutes(b.start)
    );

    for (let i = 0; i < sortedBookings.length - 1; i++) {
      const current = sortedBookings[i];
      const next = sortedBookings[i + 1];
      const gapStart = timeToMinutes(current.end);
      const gapEnd = timeToMinutes(next.start);
      const duration = gapEnd - gapStart;

      if (duration > 0) {
        gaps.push({
          start: current.end,
          end: next.start,
          duration
        });
      }
    }

    return {
      gaps,
      utilization,
      totalGapTime: gaps.reduce((sum, g) => sum + g.duration, 0),
      averageGapTime: gaps.length > 0 ? gaps.reduce((sum, g) => sum + g.duration, 0) / gaps.length : 0,
      longestGap: gaps.reduce((max, g) => Math.max(max, g.duration), 0)
    };
  }

  private generateOptimizedSchedule(
    practitioner: Staff,
    date: Date,
    bookings: Shift[],
    availableSlots: TimeSlot[],
    analysis: any,
    preferences?: any
  ): { schedule: OptimizedBooking[] } {
    const optimized: OptimizedBooking[] = [];

    // Convert existing bookings to optimized format
    bookings.forEach(booking => {
      const opt: OptimizedBooking = {
        practitionerId: practitioner.id,
        serviceId: booking.id,
        date: booking.date,
        startTime: booking.start,
        endTime: booking.end,
        priority: 'medium',
        canMove: true
      };

      // Check if booking creates inefficient gaps
      if (this.createsInefficiencyGaps(booking, bookings)) {
        const betterSlot = this.findBetterSlot(booking, availableSlots);
        if (betterSlot) {
          opt.suggestedTime = betterSlot.startTime;
          opt.reason = 'Reduce schedule gaps';
        }
      }

      optimized.push(opt);
    });

    return { schedule: optimized };
  }

  private calculateImprovements(
    original: Shift[],
    optimized: OptimizedBooking[],
    availableSlots: TimeSlot[]
  ): any {
    const originalUtilization = this.calculateUtilization(original, availableSlots);
    const optimizedUtilization = this.calculateUtilizationFromOptimized(optimized, availableSlots);

    return {
      utilizationGain: optimizedUtilization - originalUtilization,
      gapReduction: 20, // Placeholder calculation
      customerSatisfaction: 15 // Placeholder calculation
    };
  }

  private generateRecommendations(
    analysis: any,
    improvements: any,
    practitioner: Staff
  ): string[] {
    const recommendations: string[] = [];

    if (analysis.totalGapTime > 60) {
      recommendations.push(`Consider consolidating appointments to reduce ${analysis.totalGapTime} minutes of gaps`);
    }

    if (analysis.utilization < 60) {
      recommendations.push('Low utilization detected - consider promotional offers for off-peak times');
    }

    if (improvements.utilizationGain > 10) {
      recommendations.push(`Optimization can improve utilization by ${improvements.utilizationGain}%`);
    }

    if (analysis.longestGap > 90) {
      recommendations.push('Long gap detected - perfect for administrative tasks or extended appointments');
    }

    return recommendations;
  }

  private calculateOptimizationScore(improvements: any): number {
    let score = 50; // Base score

    score += improvements.utilizationGain * 2;
    score += improvements.gapReduction;
    score += improvements.customerSatisfaction;

    return Math.min(100, Math.max(0, score));
  }

  private wouldReduceGaps(slot: TimeSlot, allSlots: TimeSlot[]): boolean {
    // Check if booking this slot would connect two existing bookings
    const slotMinutes = timeToMinutes(slot.startTime);
    const before = allSlots.find(s =>
      !s.available && timeToMinutes(s.endTime) === slotMinutes - 30
    );
    const after = allSlots.find(s =>
      !s.available && timeToMinutes(s.startTime) === slotMinutes + 30
    );

    return !!(before || after);
  }

  private isGoodForGrouping(slot: TimeSlot, serviceType: string, allSlots: TimeSlot[]): boolean {
    // Check if similar services are nearby
    const group = this.serviceGroups.find(g => g.services.includes(serviceType));
    if (!group || !group.preferredGrouping) return false;

    const slotMinutes = timeToMinutes(slot.startTime);
    const nearbySlots = allSlots.filter(s => {
      const diff = Math.abs(timeToMinutes(s.startTime) - slotMinutes);
      return diff <= 60 && !s.available;
    });

    return nearbySlots.length > 0;
  }

  private wouldCreateUsableGaps(
    slot: TimeSlot,
    duration: number,
    allSlots: TimeSlot[]
  ): boolean {
    // Check if remaining gaps after booking would be usable (>= 30 min)
    const slotStart = timeToMinutes(slot.startTime);
    const slotEnd = slotStart + duration;

    // Find adjacent available slots
    const before = allSlots.filter(s =>
      s.available && timeToMinutes(s.endTime) === slotStart
    );
    const after = allSlots.filter(s =>
      s.available && timeToMinutes(s.startTime) === slotEnd
    );

    // Check if gaps are usable
    const beforeGap = before.length * 30;
    const afterGap = after.length * 30;

    return (beforeGap === 0 || beforeGap >= 30) && (afterGap === 0 || afterGap >= 30);
  }

  private calculateTotalWorkMinutes(practitioner: Staff, date: Date): number {
    const dayName = format(date, 'EEEE').toLowerCase() as keyof practitioner.defaultSchedule;
    const schedule = practitioner.defaultSchedule[dayName];

    return schedule.reduce((total, shift) => {
      return total + (timeToMinutes(shift.end) - timeToMinutes(shift.start));
    }, 0);
  }

  private selectBookingsToMove(bookings: Shift[], excessUtilization: number): Shift[] {
    // Select flexible bookings that could be moved
    return bookings
      .filter(b => !b.notes?.includes('fixed')) // Skip fixed appointments
      .slice(0, Math.ceil(excessUtilization * bookings.length));
  }

  private calculateUtilization(bookings: Shift[], availableSlots: TimeSlot[]): number {
    const totalSlots = availableSlots.length;
    const bookedSlots = availableSlots.filter(s => !s.available).length;
    return totalSlots > 0 ? (bookedSlots / totalSlots) * 100 : 0;
  }

  private calculateUtilizationFromOptimized(
    optimized: OptimizedBooking[],
    availableSlots: TimeSlot[]
  ): number {
    // Placeholder - would calculate based on optimized schedule
    return this.calculateUtilization([], availableSlots) + 10;
  }

  private createsInefficiencyGaps(booking: Shift, allBookings: Shift[]): boolean {
    // Check if this booking creates small unusable gaps
    const bookingStart = timeToMinutes(booking.start);
    const bookingEnd = timeToMinutes(booking.end);

    for (const other of allBookings) {
      if (other.id === booking.id) continue;

      const otherStart = timeToMinutes(other.start);
      const otherEnd = timeToMinutes(other.end);

      const gap = Math.min(
        Math.abs(bookingEnd - otherStart),
        Math.abs(otherEnd - bookingStart)
      );

      if (gap > 0 && gap < 30) {
        return true; // Creates unusable gap
      }
    }

    return false;
  }

  private createsInefficiencyGaps(booking: any, bookings: any[]): boolean {
    // Check if this booking creates gaps in the schedule
    const bookingStart = new Date(booking.startTime).getTime();
    const bookingEnd = new Date(booking.endTime).getTime();

    // Sort bookings by start time
    const sortedBookings = bookings
      .filter(b => b.practitionerId === booking.practitionerId)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

    // Check for gaps before and after
    for (let i = 0; i < sortedBookings.length - 1; i++) {
      const currentEnd = new Date(sortedBookings[i].endTime).getTime();
      const nextStart = new Date(sortedBookings[i + 1].startTime).getTime();
      const gapMinutes = (nextStart - currentEnd) / (1000 * 60);

      // If booking would create a small gap (less than 30 minutes)
      if (gapMinutes > 0 && gapMinutes < 30) {
        if ((bookingStart > currentEnd && bookingStart < nextStart) ||
            (bookingEnd > currentEnd && bookingEnd < nextStart)) {
          return true;
        }
      }
    }

    return false;
  }

  private findBetterSlot(booking: Shift, availableSlots: TimeSlot[]): TimeSlot | null {
    const duration = timeToMinutes(booking.end) - timeToMinutes(booking.start);

    // Find slots that would reduce gaps
    const betterSlots = availableSlots.filter(slot => {
      if (!slot.available) return false;

      // Check if slot duration matches
      const slotDuration = timeToMinutes(slot.endTime) - timeToMinutes(slot.startTime);
      if (slotDuration < duration) return false;

      return this.wouldReduceGaps(slot, availableSlots);
    });

    return betterSlots[0] || null;
  }

  private mergeTimeRanges(ranges: Array<{ start: string; end: string }>): Array<{ start: string; end: string }> {
    if (ranges.length === 0) return [];

    const sorted = [...ranges].sort((a, b) =>
      timeToMinutes(a.start) - timeToMinutes(b.start)
    );

    const merged: Array<{ start: string; end: string }> = [sorted[0]];

    for (let i = 1; i < sorted.length; i++) {
      const last = merged[merged.length - 1];
      const current = sorted[i];

      if (timeToMinutes(current.start) <= timeToMinutes(last.end)) {
        // Overlapping or adjacent - merge
        last.end = timeToMinutes(current.end) > timeToMinutes(last.end)
          ? current.end
          : last.end;
      } else {
        merged.push(current);
      }
    }

    return merged;
  }
}

// Export singleton instance
export const bookingOptimizer = new BookingOptimizer();

export default BookingOptimizer;