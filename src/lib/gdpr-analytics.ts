/**
 * GDPR-Compliant Analytics Wrapper
 * Ensures all analytics tracking respects user consent
 * Implements privacy-first principles and data minimization
 */

import { analytics, bookingFunnel, languageTracking } from './analytics';

export interface ConsentStatus {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

export interface QueuedEvent {
  type: 'event' | 'funnel' | 'language' | 'pageview';
  name: string;
  data?: any;
  timestamp: number;
}

class GDPRAnalytics {
  private static instance: GDPRAnalytics;
  private consentStatus: ConsentStatus | null = null;
  private eventQueue: QueuedEvent[] = [];
  private doNotTrack: boolean = false;
  private isInitialized: boolean = false;
  private maxQueueSize: number = 100;
  private consentListeners: Set<(consent: ConsentStatus) => void> = new Set();

  private constructor() {
    this.initialize();
  }

  public static getInstance(): GDPRAnalytics {
    if (!GDPRAnalytics.instance) {
      GDPRAnalytics.instance = new GDPRAnalytics();
    }
    return GDPRAnalytics.instance;
  }

  private initialize(): void {
    // Check Do Not Track setting
    this.doNotTrack = navigator.doNotTrack === '1' || 
                       (window as any).doNotTrack === '1' || 
                       navigator.msDoNotTrack === '1';

    if (this.doNotTrack) {
      console.log('[GDPR Analytics] Do Not Track is enabled - analytics disabled');
      return;
    }

    // Load consent from localStorage
    this.loadConsent();

    // Listen for consent updates
    window.addEventListener('ea-consent-updated', (event: CustomEvent) => {
      this.updateConsent({
        necessary: true,
        analytics: event.detail.analytics,
        marketing: event.detail.marketing,
        preferences: event.detail.preferences
      });
    });

    // Process queue periodically if consent is granted
    setInterval(() => {
      if (this.hasAnalyticsConsent()) {
        this.processQueue();
      }
    }, 5000);

    this.isInitialized = true;
  }

  private loadConsent(): void {
    try {
      const consentData = localStorage.getItem('ea-s-cookie-consent');
      if (consentData) {
        const parsed = JSON.parse(consentData);
        this.consentStatus = parsed.settings;
        
        // Process any queued events if we have consent
        if (this.hasAnalyticsConsent()) {
          this.processQueue();
        }
      }
    } catch (error) {
      console.error('[GDPR Analytics] Failed to load consent:', error);
    }
  }

  public updateConsent(consent: ConsentStatus): void {
    const previousConsent = this.consentStatus;
    this.consentStatus = consent;

    // Notify listeners
    this.consentListeners.forEach(listener => listener(consent));

    // If analytics consent was just granted, process the queue
    if (!previousConsent?.analytics && consent.analytics) {
      console.log('[GDPR Analytics] Analytics consent granted - processing queued events');
      this.processQueue();
    }

    // If consent was revoked, clear the queue
    if (previousConsent?.analytics && !consent.analytics) {
      console.log('[GDPR Analytics] Analytics consent revoked - clearing queue');
      this.eventQueue = [];
    }
  }

  public onConsentChange(listener: (consent: ConsentStatus) => void): () => void {
    this.consentListeners.add(listener);
    return () => this.consentListeners.delete(listener);
  }

  public hasAnalyticsConsent(): boolean {
    return !this.doNotTrack && this.consentStatus?.analytics === true;
  }

  public hasMarketingConsent(): boolean {
    return !this.doNotTrack && this.consentStatus?.marketing === true;
  }

  public hasPreferencesConsent(): boolean {
    return !this.doNotTrack && this.consentStatus?.preferences === true;
  }

  private queueEvent(event: QueuedEvent): void {
    // Limit queue size to prevent memory issues
    if (this.eventQueue.length >= this.maxQueueSize) {
      this.eventQueue.shift(); // Remove oldest event
    }
    
    this.eventQueue.push(event);
    console.log(`[GDPR Analytics] Event queued (${this.eventQueue.length} in queue):`, event.name);
  }

  private processQueue(): void {
    if (this.eventQueue.length === 0) return;

    console.log(`[GDPR Analytics] Processing ${this.eventQueue.length} queued events`);
    
    const events = [...this.eventQueue];
    this.eventQueue = [];

    events.forEach(event => {
      try {
        switch (event.type) {
          case 'event':
            analytics.trackEvent(event.name, event.data);
            break;
          case 'funnel':
            this.processBookingFunnelEvent(event.name, event.data);
            break;
          case 'language':
            if (event.name === 'selectLanguage') {
              languageTracking.selectLanguage(event.data.language, event.data.method);
            }
            break;
          case 'pageview':
            analytics.trackPageView(event.data?.page);
            break;
        }
      } catch (error) {
        console.error('[GDPR Analytics] Failed to process queued event:', error);
      }
    });
  }

  private processBookingFunnelEvent(name: string, data: any): void {
    switch (name) {
      case 'checkAvailability':
        bookingFunnel.checkAvailability(data?.serviceId, data?.date);
        break;
      case 'selectService':
        bookingFunnel.selectService(data.serviceId, data.serviceName, data.price);
        break;
      case 'enterDetails':
        bookingFunnel.enterDetails(data.hasEmail, data.hasPhone, data.hasName);
        break;
      case 'viewConfirmation':
        bookingFunnel.viewConfirmation(data);
        break;
      case 'completeBooking':
        bookingFunnel.completeBooking(data.bookingId, data.serviceId, data.value);
        break;
      case 'abandonBooking':
        bookingFunnel.abandonBooking(data.lastStage, data.reason);
        break;
    }
  }

  // Privacy-first data sanitization
  private sanitizeData(data: any): any {
    if (!data) return data;

    const sanitized = { ...data };
    
    // Remove or hash sensitive fields
    const sensitiveFields = ['email', 'phone', 'customerEmail', 'customerPhone', 'ip', 'ipAddress'];
    
    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        // Hash sensitive data instead of sending raw
        sanitized[field] = this.hashString(sanitized[field]);
      }
    }

    // Truncate potentially sensitive text fields
    const textFields = ['notes', 'comments', 'message'];
    for (const field of textFields) {
      if (sanitized[field] && typeof sanitized[field] === 'string') {
        sanitized[field] = sanitized[field].substring(0, 100) + '...';
      }
    }

    return sanitized;
  }

  private hashString(str: string): string {
    // Simple hash for privacy (in production, use crypto.subtle.digest)
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return `hash_${Math.abs(hash).toString(36)}`;
  }

  // Public tracking methods with consent checking

  public trackEvent(eventName: string, data?: any): void {
    if (this.doNotTrack) return;

    const sanitizedData = this.sanitizeData(data);

    if (this.hasAnalyticsConsent()) {
      analytics.trackEvent(eventName, sanitizedData);
    } else {
      this.queueEvent({
        type: 'event',
        name: eventName,
        data: sanitizedData,
        timestamp: Date.now()
      });
    }
  }

  public trackPageView(page?: string): void {
    if (this.doNotTrack) return;

    if (this.hasAnalyticsConsent()) {
      analytics.trackPageView(page);
    } else {
      this.queueEvent({
        type: 'pageview',
        name: 'page_view',
        data: { page },
        timestamp: Date.now()
      });
    }
  }

  // Booking funnel tracking with consent
  public trackBookingFunnel = {
    checkAvailability: (serviceId?: string, date?: string) => {
      if (this.doNotTrack) return;

      const data = { serviceId, date };
      
      if (this.hasAnalyticsConsent()) {
        bookingFunnel.checkAvailability(serviceId, date);
      } else {
        this.queueEvent({
          type: 'funnel',
          name: 'checkAvailability',
          data,
          timestamp: Date.now()
        });
      }
    },

    selectService: (serviceId: string, serviceName: string, price?: number) => {
      if (this.doNotTrack) return;

      const data = { serviceId, serviceName, price };
      
      if (this.hasAnalyticsConsent()) {
        bookingFunnel.selectService(serviceId, serviceName, price);
      } else {
        this.queueEvent({
          type: 'funnel',
          name: 'selectService',
          data,
          timestamp: Date.now()
        });
      }
    },

    enterDetails: (hasEmail: boolean, hasPhone: boolean, hasName: boolean) => {
      if (this.doNotTrack) return;

      const data = { hasEmail, hasPhone, hasName };
      
      if (this.hasAnalyticsConsent()) {
        bookingFunnel.enterDetails(hasEmail, hasPhone, hasName);
      } else {
        this.queueEvent({
          type: 'funnel',
          name: 'enterDetails',
          data,
          timestamp: Date.now()
        });
      }
    },

    viewConfirmation: (bookingDetails: any) => {
      if (this.doNotTrack) return;

      const sanitizedDetails = this.sanitizeData(bookingDetails);
      
      if (this.hasAnalyticsConsent()) {
        bookingFunnel.viewConfirmation(sanitizedDetails);
      } else {
        this.queueEvent({
          type: 'funnel',
          name: 'viewConfirmation',
          data: sanitizedDetails,
          timestamp: Date.now()
        });
      }
    },

    completeBooking: (bookingId: string, serviceId: string, value?: number) => {
      if (this.doNotTrack) return;

      const data = { bookingId, serviceId, value };
      
      if (this.hasAnalyticsConsent()) {
        bookingFunnel.completeBooking(bookingId, serviceId, value);
      } else {
        this.queueEvent({
          type: 'funnel',
          name: 'completeBooking',
          data,
          timestamp: Date.now()
        });
      }
    },

    abandonBooking: (lastStage: string, reason?: string) => {
      if (this.doNotTrack) return;

      const data = { lastStage, reason };
      
      if (this.hasAnalyticsConsent()) {
        bookingFunnel.abandonBooking(lastStage, reason);
      } else {
        this.queueEvent({
          type: 'funnel',
          name: 'abandonBooking',
          data,
          timestamp: Date.now()
        });
      }
    }
  };

  // Language tracking with consent
  public trackLanguage = {
    selectLanguage: (language: 'de' | 'en' | 'fr' | 'it', method: 'manual' | 'auto' = 'manual') => {
      if (this.doNotTrack) return;

      const data = { language, method };
      
      if (this.hasAnalyticsConsent()) {
        languageTracking.selectLanguage(language, method);
      } else {
        this.queueEvent({
          type: 'language',
          name: 'selectLanguage',
          data,
          timestamp: Date.now()
        });
      }
    },

    getStats: () => {
      // Stats can be retrieved without consent as they're aggregated
      return languageTracking.getStats();
    }
  };

  // Special tracking for German business features
  public trackGermanBusinessFeature(feature: string, data?: any): void {
    if (this.doNotTrack) return;

    const eventData = {
      feature,
      ...this.sanitizeData(data),
      isGermanMarket: true,
      timestamp: Date.now()
    };

    if (this.hasAnalyticsConsent()) {
      analytics.trackEvent(`german_feature_${feature}`, eventData);
    } else {
      this.queueEvent({
        type: 'event',
        name: `german_feature_${feature}`,
        data: eventData,
        timestamp: Date.now()
      });
    }
  }

  // Get consent status
  public getConsentStatus(): ConsentStatus | null {
    return this.consentStatus;
  }

  // Check if tracking is blocked
  public isTrackingBlocked(): boolean {
    return this.doNotTrack;
  }

  // Get queue size (for debugging)
  public getQueueSize(): number {
    return this.eventQueue.length;
  }

  // Clear event queue (for privacy requests)
  public clearQueue(): void {
    this.eventQueue = [];
    console.log('[GDPR Analytics] Event queue cleared');
  }

  // Export data for GDPR requests
  public exportUserData(): any {
    return {
      consentStatus: this.consentStatus,
      queuedEvents: this.eventQueue,
      doNotTrack: this.doNotTrack,
      timestamp: new Date().toISOString()
    };
  }
}

// Export singleton instance
export const gdprAnalytics = GDPRAnalytics.getInstance();

// Export helper functions for easy access
export const trackEvent = (name: string, data?: any) => gdprAnalytics.trackEvent(name, data);
export const trackPageView = (page?: string) => gdprAnalytics.trackPageView(page);
export const trackBookingFunnel = gdprAnalytics.trackBookingFunnel;
export const trackLanguage = gdprAnalytics.trackLanguage;
export const trackGermanFeature = (feature: string, data?: any) => gdprAnalytics.trackGermanBusinessFeature(feature, data);
export const hasConsent = () => gdprAnalytics.hasAnalyticsConsent();
export const isBlocked = () => gdprAnalytics.isTrackingBlocked();

export default gdprAnalytics;