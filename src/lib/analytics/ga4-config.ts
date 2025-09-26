/**
 * Google Analytics 4 Configuration
 * GDPR-compliant implementation with consent checking
 */

import { gdprAnalytics } from '../gdpr-analytics';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export class GA4Analytics {
  private static instance: GA4Analytics;
  private measurementId: string = 'G-XXXXXXXXXX'; // Replace with actual GA4 measurement ID
  private isInitialized: boolean = false;
  private debugMode: boolean = import.meta.env.DEV;

  private constructor() {
    this.initialize();
  }

  public static getInstance(): GA4Analytics {
    if (!GA4Analytics.instance) {
      GA4Analytics.instance = new GA4Analytics();
    }
    return GA4Analytics.instance;
  }

  private initialize(): void {
    // Listen for consent changes
    gdprAnalytics.onConsentChange((consent) => {
      if (consent.analytics && !this.isInitialized) {
        this.enableTracking();
      } else if (!consent.analytics && this.isInitialized) {
        this.disableTracking();
      }
    });

    // Check initial consent
    if (gdprAnalytics.hasAnalyticsConsent()) {
      this.enableTracking();
    }
  }

  private enableTracking(): void {
    if (this.isInitialized || typeof window.gtag === 'undefined') return;

    // Enable GA4 tracking
    window.gtag('consent', 'update', {
      'analytics_storage': 'granted',
      'ad_storage': gdprAnalytics.hasMarketingConsent() ? 'granted' : 'denied'
    });

    this.isInitialized = true;

    if (this.debugMode) {
      console.log('[GA4] Tracking enabled');
    }
  }

  private disableTracking(): void {
    if (!this.isInitialized || typeof window.gtag === 'undefined') return;

    // Disable GA4 tracking
    window.gtag('consent', 'update', {
      'analytics_storage': 'denied',
      'ad_storage': 'denied'
    });

    this.isInitialized = false;

    if (this.debugMode) {
      console.log('[GA4] Tracking disabled');
    }
  }

  // Custom event tracking with GDPR compliance
  public trackEvent(eventName: string, parameters?: Record<string, any>): void {
    if (!gdprAnalytics.hasAnalyticsConsent()) {
      if (this.debugMode) {
        console.log('[GA4] Event blocked - no consent:', eventName);
      }
      return;
    }

    if (typeof window.gtag === 'undefined') {
      if (this.debugMode) {
        console.warn('[GA4] gtag not loaded');
      }
      return;
    }

    // Sanitize parameters
    const sanitizedParams = this.sanitizeParameters(parameters);

    window.gtag('event', eventName, sanitizedParams);

    if (this.debugMode) {
      console.log('[GA4] Event tracked:', eventName, sanitizedParams);
    }
  }

  // Enhanced ecommerce tracking
  public trackEcommerce(action: string, data: any): void {
    if (!gdprAnalytics.hasAnalyticsConsent()) return;

    switch (action) {
      case 'view_item':
        this.trackEvent('view_item', {
          currency: 'EUR',
          value: data.value,
          items: [{
            item_id: data.serviceId,
            item_name: data.serviceName,
            item_category: data.category,
            price: data.price
          }]
        });
        break;

      case 'add_to_cart':
        this.trackEvent('add_to_cart', {
          currency: 'EUR',
          value: data.value,
          items: [{
            item_id: data.serviceId,
            item_name: data.serviceName,
            quantity: 1,
            price: data.price
          }]
        });
        break;

      case 'begin_checkout':
        this.trackEvent('begin_checkout', {
          currency: 'EUR',
          value: data.value,
          items: data.items
        });
        break;

      case 'purchase':
        this.trackEvent('purchase', {
          transaction_id: data.bookingId,
          currency: 'EUR',
          value: data.value,
          items: data.items
        });
        break;
    }
  }

  // User properties
  public setUserProperties(properties: Record<string, any>): void {
    if (!gdprAnalytics.hasAnalyticsConsent() || typeof window.gtag === 'undefined') return;

    const sanitizedProps = this.sanitizeParameters(properties);
    window.gtag('set', { user_properties: sanitizedProps });
  }

  // Page view tracking
  public trackPageView(page_path?: string, page_title?: string): void {
    if (!gdprAnalytics.hasAnalyticsConsent() || typeof window.gtag === 'undefined') return;

    window.gtag('event', 'page_view', {
      page_path: page_path || window.location.pathname,
      page_title: page_title || document.title
    });
  }

  // Conversion tracking
  public trackConversion(conversionId: string, value?: number, currency: string = 'EUR'): void {
    if (!gdprAnalytics.hasAnalyticsConsent() || typeof window.gtag === 'undefined') return;

    window.gtag('event', 'conversion', {
      'send_to': `${this.measurementId}/${conversionId}`,
      'value': value,
      'currency': currency
    });
  }

  // User timing
  public trackTiming(category: string, variable: string, value: number, label?: string): void {
    if (!gdprAnalytics.hasAnalyticsConsent() || typeof window.gtag === 'undefined') return;

    window.gtag('event', 'timing_complete', {
      'name': variable,
      'value': value,
      'event_category': category,
      'event_label': label
    });
  }

  // Exception tracking
  public trackException(description: string, fatal: boolean = false): void {
    if (!gdprAnalytics.hasAnalyticsConsent() || typeof window.gtag === 'undefined') return;

    window.gtag('event', 'exception', {
      'description': description,
      'fatal': fatal
    });
  }

  // Social interactions
  public trackSocial(network: string, action: string, target: string): void {
    if (!gdprAnalytics.hasAnalyticsConsent() || typeof window.gtag === 'undefined') return;

    window.gtag('event', 'share', {
      'method': network,
      'content_type': action,
      'item_id': target
    });
  }

  // Custom dimensions
  public setCustomDimension(index: number, value: string): void {
    if (!gdprAnalytics.hasAnalyticsConsent() || typeof window.gtag === 'undefined') return;

    window.gtag('set', {
      [`custom_dimension_${index}`]: value
    });
  }

  // Sanitize parameters to remove PII
  private sanitizeParameters(params?: Record<string, any>): Record<string, any> {
    if (!params) return {};

    const sanitized = { ...params };
    const piiFields = ['email', 'phone', 'name', 'address', 'ssn', 'credit_card'];

    for (const field of piiFields) {
      if (sanitized[field]) {
        delete sanitized[field];
      }
    }

    return sanitized;
  }

  // Debug mode
  public setDebugMode(enabled: boolean): void {
    this.debugMode = enabled;
    if (typeof window.gtag !== 'undefined') {
      window.gtag('set', { 'debug_mode': enabled });
    }
  }
}

// Export singleton instance
export const ga4 = GA4Analytics.getInstance();

// Export convenience functions
export const trackGA4Event = (name: string, params?: Record<string, any>) => ga4.trackEvent(name, params);
export const trackGA4Ecommerce = (action: string, data: any) => ga4.trackEcommerce(action, data);
export const trackGA4Conversion = (id: string, value?: number) => ga4.trackConversion(id, value);
export const trackGA4PageView = (path?: string, title?: string) => ga4.trackPageView(path, title);
export const trackGA4Timing = (category: string, variable: string, value: number, label?: string) =>
  ga4.trackTiming(category, variable, value, label);

export default ga4;