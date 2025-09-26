/**
 * Abandonment Recovery System
 * Tracks and recovers abandoned booking sessions
 */

import { gdprAnalytics } from '../gdpr-analytics';
import { BOOKING_EVENTS } from './event-definitions';

interface BookingProgress {
  sessionId: string;
  serviceId?: string;
  serviceName?: string;
  date?: string;
  timeSlot?: string;
  formData?: Partial<{
    name: string;
    email: string;
    phone: string;
    notes: string;
  }>;
  currentStep: number;
  lastActivity: number;
  abandoned: boolean;
  recoveryEmailSent?: boolean;
  createdAt: number;
}

export class AbandonmentRecovery {
  private static instance: AbandonmentRecovery;
  private readonly STORAGE_KEY = 'ea_booking_progress';
  private readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  private readonly RECOVERY_DELAY = 15 * 60 * 1000; // 15 minutes
  private currentProgress: BookingProgress | null = null;
  private exitIntentListener: ((e: MouseEvent) => void) | null = null;
  private inactivityTimer: NodeJS.Timeout | null = null;
  private recoveryTimer: NodeJS.Timeout | null = null;

  private constructor() {
    this.initialize();
  }

  public static getInstance(): AbandonmentRecovery {
    if (!AbandonmentRecovery.instance) {
      AbandonmentRecovery.instance = new AbandonmentRecovery();
    }
    return AbandonmentRecovery.instance;
  }

  private initialize(): void {
    // Load existing progress
    this.loadProgress();

    // Set up exit intent detection
    this.setupExitIntentDetection();

    // Set up inactivity detection
    this.setupInactivityDetection();

    // Check for abandoned sessions on page load
    this.checkForAbandonedSessions();

    // Listen for page unload
    window.addEventListener('beforeunload', () => this.handlePageUnload());

    // Listen for visibility changes
    document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
  }

  // Save booking progress
  public saveProgress(data: Partial<BookingProgress>): void {
    if (!this.hasStorageConsent()) return;

    const sessionId = this.getOrCreateSessionId();

    this.currentProgress = {
      sessionId,
      ...this.currentProgress,
      ...data,
      lastActivity: Date.now(),
      abandoned: false,
      createdAt: this.currentProgress?.createdAt || Date.now()
    } as BookingProgress;

    this.persistProgress();
    this.resetInactivityTimer();

    // Track progress save
    gdprAnalytics.trackEvent('booking_progress_saved', {
      step: this.currentProgress.currentStep,
      hasService: !!this.currentProgress.serviceId,
      hasDateTime: !!(this.currentProgress.date && this.currentProgress.timeSlot),
      hasFormData: !!this.currentProgress.formData
    });
  }

  // Load saved progress
  public loadProgress(): BookingProgress | null {
    if (!this.hasStorageConsent()) return null;

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const progress = JSON.parse(stored) as BookingProgress;

        // Check if session is still valid
        if (Date.now() - progress.lastActivity < this.SESSION_TIMEOUT && !progress.abandoned) {
          this.currentProgress = progress;
          return progress;
        }
      }
    } catch (error) {
      console.error('[Abandonment Recovery] Failed to load progress:', error);
    }

    return null;
  }

  // Clear saved progress
  public clearProgress(): void {
    this.currentProgress = null;
    localStorage.removeItem(this.STORAGE_KEY);

    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = null;
    }

    if (this.recoveryTimer) {
      clearTimeout(this.recoveryTimer);
      this.recoveryTimer = null;
    }
  }

  // Resume booking from saved progress
  public resumeBooking(): BookingProgress | null {
    const progress = this.loadProgress();

    if (progress) {
      // Track resumption
      gdprAnalytics.trackEvent(BOOKING_EVENTS.RESUME_BOOKING, {
        sessionId: progress.sessionId,
        resumedStep: progress.currentStep,
        timeSinceAbandonment: Date.now() - progress.lastActivity
      });

      // Update progress
      progress.abandoned = false;
      progress.lastActivity = Date.now();
      this.currentProgress = progress;
      this.persistProgress();

      return progress;
    }

    return null;
  }

  // Mark session as abandoned
  public markAsAbandoned(reason?: string): void {
    if (!this.currentProgress) return;

    this.currentProgress.abandoned = true;
    this.persistProgress();

    // Track abandonment
    gdprAnalytics.trackEvent(BOOKING_EVENTS.ABANDON_BOOKING, {
      sessionId: this.currentProgress.sessionId,
      abandonedStep: this.currentProgress.currentStep,
      reason,
      hasEmail: !!this.currentProgress.formData?.email,
      sessionDuration: Date.now() - this.currentProgress.createdAt
    });

    // Schedule recovery email if we have email
    if (this.currentProgress.formData?.email && !this.currentProgress.recoveryEmailSent) {
      this.scheduleRecoveryEmail();
    }
  }

  // Set up exit intent detection
  private setupExitIntentDetection(): void {
    this.exitIntentListener = (e: MouseEvent) => {
      // Detect when mouse leaves viewport from top (likely heading to close tab)
      if (e.clientY <= 0 && this.currentProgress && !this.currentProgress.abandoned) {
        this.handleExitIntent();
      }
    };

    document.addEventListener('mouseout', this.exitIntentListener);
  }

  // Handle exit intent
  private handleExitIntent(): void {
    if (!this.currentProgress || this.currentProgress.abandoned) return;

    // Track exit intent
    gdprAnalytics.trackEvent(BOOKING_EVENTS.EXIT_INTENT, {
      sessionId: this.currentProgress.sessionId,
      currentStep: this.currentProgress.currentStep,
      hasEmail: !!this.currentProgress.formData?.email
    });

    // Mark as potentially abandoned
    this.currentProgress.abandoned = true;
    this.persistProgress();

    // Could trigger a modal here to try to retain the user
    this.triggerExitIntentModal();
  }

  // Trigger exit intent modal (to be implemented with UI)
  private triggerExitIntentModal(): void {
    // This would trigger a React modal component
    window.dispatchEvent(new CustomEvent('show-exit-intent-modal', {
      detail: {
        progress: this.currentProgress,
        message: this.getExitIntentMessage()
      }
    }));
  }

  // Get appropriate exit intent message
  private getExitIntentMessage(): string {
    if (!this.currentProgress) return "Don't leave yet! Your booking is almost complete.";

    const step = this.currentProgress.currentStep;

    if (step >= 3) {
      return "You're so close! Just a few more seconds to complete your booking.";
    } else if (this.currentProgress.timeSlot) {
      return `Your selected time slot (${this.currentProgress.timeSlot}) may not be available later!`;
    } else if (this.currentProgress.serviceId) {
      return "Complete your booking now and secure your preferred time.";
    }

    return "Need help? We're here to assist with your booking.";
  }

  // Set up inactivity detection
  private setupInactivityDetection(): void {
    document.addEventListener('mousemove', () => this.resetInactivityTimer());
    document.addEventListener('keypress', () => this.resetInactivityTimer());
    document.addEventListener('click', () => this.resetInactivityTimer());
    document.addEventListener('scroll', () => this.resetInactivityTimer());
  }

  // Reset inactivity timer
  private resetInactivityTimer(): void {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }

    this.inactivityTimer = setTimeout(() => {
      this.handleInactivity();
    }, this.SESSION_TIMEOUT);
  }

  // Handle inactivity
  private handleInactivity(): void {
    if (!this.currentProgress || this.currentProgress.abandoned) return;

    // Track session timeout
    gdprAnalytics.trackEvent(BOOKING_EVENTS.SESSION_TIMEOUT, {
      sessionId: this.currentProgress.sessionId,
      currentStep: this.currentProgress.currentStep,
      sessionDuration: Date.now() - this.currentProgress.createdAt
    });

    this.markAsAbandoned('session_timeout');
  }

  // Handle page unload
  private handlePageUnload(): void {
    if (this.currentProgress && !this.currentProgress.abandoned) {
      // Save current state
      this.persistProgress();
    }
  }

  // Handle visibility change
  private handleVisibilityChange(): void {
    if (document.hidden && this.currentProgress) {
      // Page is hidden, save progress
      this.persistProgress();
    } else if (!document.hidden && this.currentProgress) {
      // Page is visible again, update last activity
      this.currentProgress.lastActivity = Date.now();
      this.persistProgress();
      this.resetInactivityTimer();
    }
  }

  // Check for abandoned sessions on page load
  private checkForAbandonedSessions(): void {
    const allSessions = this.getAllSessions();

    allSessions.forEach(session => {
      if (!session.abandoned &&
          Date.now() - session.lastActivity > this.SESSION_TIMEOUT &&
          session.formData?.email &&
          !session.recoveryEmailSent) {
        // Mark as abandoned and trigger recovery
        session.abandoned = true;
        this.scheduleRecoveryEmailForSession(session);
      }
    });
  }

  // Schedule recovery email
  private scheduleRecoveryEmail(): void {
    if (!this.currentProgress?.formData?.email) return;

    this.recoveryTimer = setTimeout(() => {
      this.sendRecoveryEmail();
    }, this.RECOVERY_DELAY);
  }

  // Schedule recovery email for specific session
  private scheduleRecoveryEmailForSession(session: BookingProgress): void {
    if (!session.formData?.email || session.recoveryEmailSent) return;

    // Simulate API call to send recovery email
    this.sendRecoveryEmailForSession(session);
  }

  // Send recovery email (would call backend API)
  private async sendRecoveryEmail(): Promise<void> {
    if (!this.currentProgress?.formData?.email) return;

    try {
      // This would call your backend API
      const response = await fetch('/api/booking/recovery-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: this.currentProgress.formData.email,
          sessionId: this.currentProgress.sessionId,
          serviceName: this.currentProgress.serviceName,
          date: this.currentProgress.date,
          timeSlot: this.currentProgress.timeSlot,
          recoveryUrl: this.generateRecoveryUrl()
        })
      });

      if (response.ok) {
        this.currentProgress.recoveryEmailSent = true;
        this.persistProgress();

        gdprAnalytics.trackEvent(BOOKING_EVENTS.RECOVERY_EMAIL_SENT, {
          sessionId: this.currentProgress.sessionId
        });
      }
    } catch (error) {
      console.error('[Abandonment Recovery] Failed to send recovery email:', error);
    }
  }

  // Send recovery email for specific session
  private async sendRecoveryEmailForSession(session: BookingProgress): Promise<void> {
    // Similar to sendRecoveryEmail but for a specific session
    // Implementation would be similar
  }

  // Generate recovery URL
  private generateRecoveryUrl(): string {
    if (!this.currentProgress) return '';

    const baseUrl = window.location.origin;
    const params = new URLSearchParams({
      recover: this.currentProgress.sessionId,
      service: this.currentProgress.serviceId || '',
      date: this.currentProgress.date || '',
      time: this.currentProgress.timeSlot || ''
    });

    return `${baseUrl}/booking?${params.toString()}`;
  }

  // Get or create session ID
  private getOrCreateSessionId(): string {
    if (this.currentProgress?.sessionId) {
      return this.currentProgress.sessionId;
    }
    return `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Persist progress to localStorage
  private persistProgress(): void {
    if (!this.hasStorageConsent() || !this.currentProgress) return;

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.currentProgress));
    } catch (error) {
      console.error('[Abandonment Recovery] Failed to save progress:', error);
    }
  }

  // Get all sessions (for admin dashboard)
  private getAllSessions(): BookingProgress[] {
    const sessions: BookingProgress[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('ea_booking_')) {
        try {
          const session = JSON.parse(localStorage.getItem(key) || '');
          sessions.push(session);
        } catch (error) {
          // Invalid session data
        }
      }
    }

    return sessions;
  }

  // Check storage consent
  private hasStorageConsent(): boolean {
    return gdprAnalytics.hasPreferencesConsent();
  }

  // Get current progress
  public getCurrentProgress(): BookingProgress | null {
    return this.currentProgress;
  }

  // Check if recovery is available
  public hasRecoverableSession(): boolean {
    const progress = this.loadProgress();
    return !!progress && !progress.abandoned;
  }

  // Cleanup
  public cleanup(): void {
    if (this.exitIntentListener) {
      document.removeEventListener('mouseout', this.exitIntentListener);
    }

    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }

    if (this.recoveryTimer) {
      clearTimeout(this.recoveryTimer);
    }
  }
}

// Export singleton instance
export const abandonmentRecovery = AbandonmentRecovery.getInstance();

// Export convenience functions
export const saveBookingProgress = (data: Partial<BookingProgress>) =>
  abandonmentRecovery.saveProgress(data);
export const resumeBooking = () => abandonmentRecovery.resumeBooking();
export const clearBookingProgress = () => abandonmentRecovery.clearProgress();
export const hasRecoverableBooking = () => abandonmentRecovery.hasRecoverableSession();

export default abandonmentRecovery;