/**
 * Consent-Aware Analytics System
 * Only tracks analytics when user has given explicit consent
 * GDPR Article 6(1)(a) compliant
 */

import { privacyUtils } from './privacy-manager';

interface AnalyticsEvent {
  event: string;
  parameters?: { [key: string]: any };
  consent_required: boolean;
  data_category: 'necessary' | 'analytics' | 'marketing' | 'preferences';
}

interface UserSession {
  sessionId: string;
  userId?: string;
  startTime: number;
  lastActivity: number;
  pageViews: string[];
  events: AnalyticsEvent[];
  consentStatus: {
    analytics: boolean;
    marketing: boolean;
    preferences: boolean;
  };
}

class ConsentAwareAnalytics {
  private static instance: ConsentAwareAnalytics;
  private session: UserSession | null = null;
  private initialized = false;

  static getInstance(): ConsentAwareAnalytics {
    if (!ConsentAwareAnalytics.instance) {
      ConsentAwareAnalytics.instance = new ConsentAwareAnalytics();
    }
    return ConsentAwareAnalytics.instance;
  }

  /**
   * Initialize analytics system with consent check
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    // Check current consent status
    const consentStatus = privacyUtils.getConsentStatus();
    
    if (!consentStatus) {
      console.log('No consent found - analytics disabled');
      return;
    }

    // Initialize session
    this.session = {
      sessionId: this.generateSessionId(),
      startTime: Date.now(),
      lastActivity: Date.now(),
      pageViews: [],
      events: [],
      consentStatus: consentStatus.settings || {
        analytics: false,
        marketing: false,
        preferences: false
      }
    };

    // Initialize Google Analytics if consent given
    if (this.session.consentStatus.analytics) {
      this.initializeGoogleAnalytics();
    }

    // Track initial page view (necessary data)
    this.trackPageView(window.location.pathname, false);

    this.initialized = true;
    console.log('Consent-aware analytics initialized');
  }

  /**
   * Track page view with consent verification
   */
  trackPageView(path: string, requiresConsent = true): void {
    if (!this.session) return;

    // Always allow necessary page views (for basic functionality)
    if (!requiresConsent || this.session.consentStatus.analytics) {
      this.session.pageViews.push(path);
      this.session.lastActivity = Date.now();

      // Send to Google Analytics if enabled
      if (this.session.consentStatus.analytics && (window as any).gtag) {
        (window as any).gtag('config', 'GA_MEASUREMENT_ID', {
          page_path: path,
          consent: 'update'
        });
      }

      // Send to server analytics (respecting consent)
      this.sendAnalyticsEvent('page_view', {
        path,
        timestamp: new Date().toISOString(),
        sessionId: this.session.sessionId
      }, requiresConsent ? 'analytics' : 'necessary');
    }
  }

  /**
   * Track custom event with consent verification
   */
  trackEvent(eventName: string, parameters: { [key: string]: any } = {}, category: 'necessary' | 'analytics' | 'marketing' | 'preferences' = 'analytics'): void {
    if (!this.session) return;

    const hasConsent = this.checkConsentForCategory(category);
    
    if (!hasConsent) {
      console.log(`Event ${eventName} not tracked - no consent for ${category}`);
      return;
    }

    const event: AnalyticsEvent = {
      event: eventName,
      parameters: {
        ...parameters,
        timestamp: new Date().toISOString(),
        sessionId: this.session.sessionId
      },
      consent_required: category !== 'necessary',
      data_category: category
    };

    this.session.events.push(event);
    this.session.lastActivity = Date.now();

    // Send to Google Analytics if enabled
    if (this.session.consentStatus.analytics && (window as any).gtag) {
      (window as any).gtag('event', eventName, event.parameters);
    }

    // Send to server analytics
    this.sendAnalyticsEvent(eventName, event.parameters, category);
  }

  /**
   * Track user interaction (button clicks, form submissions, etc.)
   */
  trackInteraction(element: string, action: string, additionalData: any = {}): void {
    this.trackEvent('user_interaction', {
      element,
      action,
      ...additionalData
    }, 'analytics');
  }

  /**
   * Track business events (conversions, goals, etc.)
   */
  trackBusinessEvent(eventName: string, value?: number, currency = 'EUR', additionalData: any = {}): void {
    this.trackEvent(eventName, {
      value,
      currency,
      ...additionalData
    }, 'analytics');
  }

  /**
   * Track marketing events (campaign interactions, etc.)
   */
  trackMarketingEvent(eventName: string, campaign: string, additionalData: any = {}): void {
    this.trackEvent(eventName, {
      campaign,
      ...additionalData
    }, 'marketing');
  }

  /**
   * Track performance metrics
   */
  trackPerformance(metric: string, value: number, unit = 'ms'): void {
    this.trackEvent('performance_metric', {
      metric,
      value,
      unit
    }, 'necessary'); // Performance tracking is necessary for service delivery
  }

  /**
   * Track errors (anonymized)
   */
  trackError(error: Error, context: string): void {
    // Error tracking is necessary for service delivery and debugging
    this.trackEvent('error', {
      message: error.message,
      context,
      stack: error.stack ? 'present' : 'none' // Don't send actual stack trace
    }, 'necessary');
  }

  /**
   * Update consent preferences
   */
  updateConsent(newConsent: { analytics?: boolean; marketing?: boolean; preferences?: boolean }): void {
    if (!this.session) return;

    const previousConsent = { ...this.session.consentStatus };
    this.session.consentStatus = { ...this.session.consentStatus, ...newConsent };

    // Track consent change
    this.trackEvent('consent_updated', {
      previous: previousConsent,
      updated: this.session.consentStatus
    }, 'necessary');

    // Update Google Analytics consent
    if ((window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        'analytics_storage': this.session.consentStatus.analytics ? 'granted' : 'denied',
        'ad_storage': this.session.consentStatus.marketing ? 'granted' : 'denied',
        'functionality_storage': this.session.consentStatus.preferences ? 'granted' : 'denied'
      });
    }

    console.log('Analytics consent updated:', this.session.consentStatus);
  }

  /**
   * Get current session data (for debugging or export)
   */
  getSessionData(): UserSession | null {
    return this.session;
  }

  /**
   * Clear all analytics data (for GDPR deletion)
   */
  clearData(): void {
    this.session = null;
    this.initialized = false;
    
    // Clear Google Analytics
    if ((window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        'analytics_storage': 'denied',
        'ad_storage': 'denied',
        'functionality_storage': 'denied'
      });
    }

    console.log('Analytics data cleared');
  }

  private checkConsentForCategory(category: 'necessary' | 'analytics' | 'marketing' | 'preferences'): boolean {
    if (!this.session) return false;
    if (category === 'necessary') return true;
    
    return this.session.consentStatus[category] || false;
  }

  private async sendAnalyticsEvent(eventName: string, parameters: any, category: string): Promise<void> {
    try {
      await fetch('/api/analytics/event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: eventName,
          parameters,
          category,
          sessionId: this.session?.sessionId,
          timestamp: new Date().toISOString(),
          consent_metadata: {
            analytics: this.session?.consentStatus.analytics || false,
            marketing: this.session?.consentStatus.marketing || false,
            preferences: this.session?.consentStatus.preferences || false
          }
        }),
      });
    } catch (error) {
      console.warn('Failed to send analytics event:', error);
    }
  }

  private initializeGoogleAnalytics(): void {
    // Only initialize if not already present
    if (!(window as any).gtag) {
      // Load Google Analytics script
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
      document.head.appendChild(script);

      // Initialize gtag
      (window as any).dataLayer = (window as any).dataLayer || [];
      function gtag(...args: any[]) {
        (window as any).dataLayer.push(arguments);
      }
      (window as any).gtag = gtag;

      gtag('js', new Date());
      gtag('config', 'GA_MEASUREMENT_ID', {
        send_page_view: false, // We handle page views manually
        analytics_storage: this.session?.consentStatus.analytics ? 'granted' : 'denied',
        ad_storage: this.session?.consentStatus.marketing ? 'granted' : 'denied',
        functionality_storage: this.session?.consentStatus.preferences ? 'granted' : 'denied'
      });
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }
}

// Export singleton instance
export const consentAwareAnalytics = ConsentAwareAnalytics.getInstance();

// Convenience functions
export const analytics = {
  // Initialize analytics system
  init: () => consentAwareAnalytics.initialize(),
  
  // Page tracking
  pageView: (path?: string) => consentAwareAnalytics.trackPageView(path || window.location.pathname),
  
  // Event tracking
  event: (name: string, params?: any) => consentAwareAnalytics.trackEvent(name, params),
  
  // Interaction tracking
  click: (element: string, additionalData?: any) => 
    consentAwareAnalytics.trackInteraction(element, 'click', additionalData),
  
  // Business events
  conversion: (eventName: string, value?: number, currency?: string) =>
    consentAwareAnalytics.trackBusinessEvent(eventName, value, currency),
  
  // Performance tracking
  performance: (metric: string, value: number) => 
    consentAwareAnalytics.trackPerformance(metric, value),
  
  // Error tracking
  error: (error: Error, context: string) => 
    consentAwareAnalytics.trackError(error, context),
  
  // Consent management
  updateConsent: (consent: any) => consentAwareAnalytics.updateConsent(consent),
  clearData: () => consentAwareAnalytics.clearData(),
  
  // Data access
  getSession: () => consentAwareAnalytics.getSessionData()
};

// Auto-initialize when privacy consent is available
document.addEventListener('DOMContentLoaded', () => {
  // Wait for potential consent banner interaction
  setTimeout(() => {
    const consentStatus = privacyUtils.getConsentStatus();
    if (consentStatus) {
      analytics.init();
    }
  }, 1000);
});

// Listen for consent updates
window.addEventListener('ea-consent-updated', ((event: CustomEvent) => {
  analytics.updateConsent(event.detail);
}) as EventListener);