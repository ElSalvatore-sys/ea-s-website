/**
 * Revenue Analytics & Conversion Tracking System
 * Designed for maximum revenue generation and 1000x scale
 * 
 * Features:
 * - Real-time conversion tracking
 * - Revenue attribution
 * - A/B testing support
 * - Heatmap integration
 * - Custom event tracking
 * - Performance monitoring
 */

interface ConversionEvent {
  eventName: string;
  value: number;
  currency: string;
  items?: any[];
  metadata?: Record<string, any>;
  funnelStep?: string;
  conversionPath?: string[];
  timeToConversion?: number;
  referralSource?: string;
  abTestVariants?: Record<string, string>;
}

interface UserSession {
  sessionId: string;
  userId?: string;
  startTime: number;
  lastActivity: number;
  pageViews: number;
  events: ConversionEvent[];
  revenue: number;
  source?: string;
  medium?: string;
  campaign?: string;
  conversionFunnel: string[];
  totalEngagementScore: number;
  ltv: number;
  cohort: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  browserType: string;
  geoLocation?: { country: string; city: string };
  referralChain: string[];
}

interface ABTestVariant {
  testId: string;
  variant: string;
  timestamp: number;
}

class RevenueTracker {
  private static instance: RevenueTracker;
  private session: UserSession;
  private abTests: Map<string, ABTestVariant> = new Map();
  private retryAttempts: Map<string, number> = new Map();
  // Backend is now ENABLED - make sure server is running on port 3001
  private backendEnabled: boolean = false; // DISABLED temporarily to fix white screen issue
  private maxRetries: number = 3;
  private baseRetryDelay: number = 5000;
  private analyticsApiUrl: string = '/api';
  private conversionGoals: Map<string, number> = new Map([
    // User Journey Tracking
    ['landing_page_view', 5],
    ['hero_scroll_engagement', 8],
    ['kfc_mention_view', 12],
    ['demo_interaction', 25],
    ['roi_calculator_use', 35],
    ['product_view', 40],
    ['product_selected', 60],
    ['cart_updated', 80],
    ['booking_modal_open', 100],
    ['booking_step_complete', 120],
    ['consultation_booked', 500],
    ['demo_requested', 200],
    ['smart_products_interest', 150],
    ['elderly_care_inquiry', 300],
    ['enterprise_inquiry', 1000],
    ['kfc_partnership_mention', 50],
    // Engagement Metrics
    ['engaged_30s', 2],
    ['engaged_60s', 5],
    ['engaged_3m', 15],
    ['scroll_75', 10],
    ['video_play', 20],
    ['testimonial_view', 15],
    // Conversion Events
    ['trial_started', 300],
    ['meeting_scheduled', 250],
    ['enterprise_demo', 800],
    ['pilot_signup', 400],
    ['growth_plan_selected', 1500],
    ['scale_plan_selected', 5000],
    // Smart Living Specific
    ['smart_home_configurator_use', 100],
    ['elderly_care_consultation', 400],
    ['home_assistant_interest', 80],
    ['local_ai_inquiry', 120]
  ]);

  private constructor() {
    try {
      this.initializeSession();
      // Delay event listeners until DOM is ready
      if (typeof window !== 'undefined') {
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', () => {
            this.setupEventListeners();
            this.trackPageView();
          });
        } else {
          // Use setTimeout to avoid blocking
          setTimeout(() => {
            this.setupEventListeners();
            this.trackPageView();
          }, 0);
        }
      }
    } catch (error) {
      console.error('[Analytics] Constructor error:', error);
    }
  }

  public static getInstance(): RevenueTracker {
    if (!RevenueTracker.instance) {
      RevenueTracker.instance = new RevenueTracker();
    }
    return RevenueTracker.instance;
  }

  private initializeSession(): void {
    try {
      const sessionId = this.getOrCreateSessionId();
      this.session = {
        sessionId,
        startTime: Date.now(),
        lastActivity: Date.now(),
        pageViews: 0,
        events: [],
        revenue: 0,
        source: this.getTrafficSource(),
        medium: this.getTrafficMedium(),
        campaign: this.getTrafficCampaign(),
        conversionFunnel: [],
        totalEngagementScore: 0,
        ltv: 0,
        cohort: this.getCohort(),
        deviceType: this.getDeviceType(),
        browserType: navigator?.userAgent?.split(' ')[0] || 'unknown',
        geoLocation: this.getGeoLocation(),
        referralChain: this.getReferralChain(),
      };
    } catch (error) {
      console.error('[Analytics] Failed to initialize session:', error);
      // Create a minimal session to prevent crashes
      this.session = {
        sessionId: 'error-' + Date.now(),
        startTime: Date.now(),
        lastActivity: Date.now(),
        pageViews: 0,
        events: [],
        revenue: 0,
        conversionFunnel: [],
        totalEngagementScore: 0,
        ltv: 0,
        cohort: 'unknown',
        deviceType: 'desktop',
        browserType: 'unknown',
        referralChain: [],
      };
    }

    // Load any existing session data
    try {
      const savedSession = localStorage.getItem('ea_session');
      if (savedSession) {
        try {
          const parsed = JSON.parse(savedSession);
          if (Date.now() - parsed.lastActivity < 30 * 60 * 1000) { // 30 min session timeout
            this.session = {
              ...parsed,
              lastActivity: Date.now(),
              conversionFunnel: parsed.conversionFunnel || [] // Ensure conversionFunnel is always an array
            };
          }
        } catch (e) {
          console.error('Failed to parse session:', e);
        }
      }
    } catch (error) {
      // localStorage might be blocked or unavailable
      console.warn('[Analytics] localStorage not available:', error);
    }

    // Save session periodically and calculate engagement
    setInterval(() => {
      this.saveSession();
      this.updateEngagementScore();
      this.updateLTVPrediction();
    }, 5000);
  }

  private getOrCreateSessionId(): string {
    try {
      let sessionId = sessionStorage.getItem('ea_session_id');
      if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        try {
          sessionStorage.setItem('ea_session_id', sessionId);
        } catch (e) {
          // sessionStorage might be blocked
          console.warn('[Analytics] Could not save session ID:', e);
        }
      }
      return sessionId;
    } catch (error) {
      // sessionStorage not available, generate a temporary ID
      return `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
  }

  private getTrafficSource(): string {
    const referrer = document.referrer;
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('utm_source') || (referrer ? new URL(referrer).hostname : 'direct');
  }

  private getTrafficMedium(): string {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('utm_medium') || 'organic';
  }

  private getTrafficCampaign(): string {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('utm_campaign') || 'none';
  }

  private getCohort(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }

  private getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  private getGeoLocation(): { country: string; city: string } | undefined {
    // This would normally integrate with a geolocation service
    // For now, we'll detect based on timezone and language
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const language = navigator.language || 'en-US';
    
    if (timezone.includes('Europe/Berlin') || language.startsWith('de')) {
      return { country: 'Germany', city: 'Unknown' };
    }
    return { country: 'Unknown', city: 'Unknown' };
  }

  private getReferralChain(): string[] {
    const chain = [];
    const referrer = document.referrer;
    if (referrer) {
      try {
        chain.push(new URL(referrer).hostname);
      } catch (e) {
        chain.push(referrer);
      }
    }
    return chain;
  }

  private updateEngagementScore(): void {
    const timeSpent = Date.now() - this.session.startTime;
    const pageViews = this.session.pageViews;
    const interactions = this.session.events.length;
    
    // Calculate engagement score based on time, interactions, and conversions
    this.session.totalEngagementScore = Math.round(
      (timeSpent / 1000) * 0.1 + // 0.1 points per second
      pageViews * 5 + // 5 points per page view
      interactions * 2 + // 2 points per interaction
      this.session.revenue * 0.01 // 0.01 points per euro of value
    );
  }

  private updateLTVPrediction(): void {
    // Simple LTV prediction based on engagement and early indicators
    const engagementMultiplier = Math.min(this.session.totalEngagementScore / 100, 3);
    const timeOnSite = (Date.now() - this.session.startTime) / 1000 / 60; // minutes
    const roiCalculatorUsed = this.session.events.some(e => e.eventName === 'roi_calculated');
    const demoInteraction = this.session.events.some(e => e.eventName.includes('demo'));
    
    let baseLTV = 100; // Base €100 LTV
    
    if (roiCalculatorUsed) baseLTV *= 3;
    if (demoInteraction) baseLTV *= 2;
    if (timeOnSite > 5) baseLTV *= 1.5;
    if (this.session.pageViews > 3) baseLTV *= 1.3;
    
    this.session.ltv = Math.round(baseLTV * engagementMultiplier);
  }

  private saveSession(): void {
    try {
      localStorage.setItem('ea_session', JSON.stringify(this.session));
    } catch (error) {
      // localStorage might be full or blocked
      console.debug('[Analytics] Could not save session:', error);
    }
  }

  private setupEventListeners(): void {
    // Track all clicks
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      
      // Track CTA clicks
      if (target.classList.contains('cta') || 
          target.closest('[data-track]') || 
          target.tagName === 'BUTTON') {
        this.trackEvent('click', {
          element: target.tagName,
          text: target.textContent?.substring(0, 50),
          classes: target.className,
          href: (target as HTMLAnchorElement).href,
        });
      }
    });

    // Track form submissions
    document.addEventListener('submit', (e) => {
      const form = e.target as HTMLFormElement;
      this.trackEvent('form_submit', {
        formId: form.id,
        formName: form.name,
        action: form.action,
      });
    });

    // Track scroll depth
    let maxScroll = 0;
    let scrollTimer: NodeJS.Timeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        const scrollPercent = Math.round(
          (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        );
        if (scrollPercent > maxScroll) {
          maxScroll = scrollPercent;
          if (scrollPercent >= 25 && scrollPercent < 50) {
            this.trackEvent('scroll_25');
          } else if (scrollPercent >= 50 && scrollPercent < 75) {
            this.trackEvent('scroll_50');
          } else if (scrollPercent >= 75 && scrollPercent < 90) {
            this.trackEvent('scroll_75');
          } else if (scrollPercent >= 90) {
            this.trackEvent('scroll_90');
          }
        }
      }, 100);
    });

    // Track time on page
    let timeOnPage = 0;
    setInterval(() => {
      timeOnPage += 5;
      if (timeOnPage === 30) {
        this.trackEvent('engaged_30s');
      } else if (timeOnPage === 60) {
        this.trackEvent('engaged_60s');
      } else if (timeOnPage === 180) {
        this.trackEvent('engaged_3m');
      }
    }, 5000);

    // Track page visibility
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.trackEvent('page_hidden');
      } else {
        this.trackEvent('page_visible');
      }
    });
  }

  public trackPageView(page?: string): void {
    this.session.pageViews++;
    this.session.lastActivity = Date.now();
    
    const pageUrl = page || window.location.pathname;
    
    this.trackEvent('page_view', {
      page: pageUrl,
      title: document.title,
      referrer: document.referrer,
    });

    // Send to Google Analytics if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'page_view', {
        page_path: pageUrl,
        page_title: document.title,
        page_location: window.location.href,
      });
    }
  }

  public trackEvent(eventName: string, data?: any): void {
    const event: ConversionEvent = {
      eventName,
      value: this.conversionGoals.get(eventName) || 0,
      currency: 'EUR',
      metadata: {
        ...data,
        timestamp: Date.now(),
        sessionId: this.session.sessionId,
        abTests: Object.fromEntries(this.abTests),
        pageUrl: window.location.pathname,
        deviceType: this.session.deviceType,
        engagementScore: this.session.totalEngagementScore,
        predictedLTV: this.session.ltv,
        timeInSession: Date.now() - this.session.startTime,
      },
      funnelStep: this.determineFunnelStep(eventName),
      conversionPath: [...(this.session.conversionFunnel || []), eventName],
      timeToConversion: this.calculateTimeToConversion(eventName),
      referralSource: this.session.source,
      abTestVariants: Object.fromEntries(this.abTests),
    };

    // Update conversion funnel
    if (!this.session.conversionFunnel) {
      this.session.conversionFunnel = [];
    }
    if (!this.session.conversionFunnel.includes(eventName)) {
      this.session.conversionFunnel.push(eventName);
    }

    this.session.events.push(event);
    this.session.revenue += event.value;
    this.session.lastActivity = Date.now();

    // Send to backend
    this.sendToBackend(event);

    // Send to Google Analytics if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, {
        value: event.value,
        currency: event.currency,
        custom_parameters: {
          funnel_step: event.funnelStep,
          engagement_score: this.session.totalEngagementScore,
          predicted_ltv: this.session.ltv,
          device_type: this.session.deviceType,
        },
        ...data,
      });
    }

    console.log(`[Revenue Analytics] ${eventName}: €${event.value} | LTV: €${this.session.ltv} | Funnel: ${event.funnelStep}`, event);
  }

  public trackConversion(event: ConversionEvent): void {
    this.session.events.push(event);
    this.session.revenue += event.value;

    // High-priority conversion tracking
    this.sendToBackend(event, true);

    // Update UI with conversion notification
    this.showConversionNotification(event);

    // Send to Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'purchase', {
        value: event.value,
        currency: event.currency,
        items: event.items,
      });
    }

    console.log(`[Analytics] CONVERSION: €${event.value}`, event);
  }

  public setABTestVariant(testId: string, variant: string): void {
    this.abTests.set(testId, {
      testId,
      variant,
      timestamp: Date.now(),
    });

    // Track variant exposure
    this.trackEvent('ab_test_exposure', {
      testId,
      variant,
    });
  }

  public getABTestVariant(testId: string): string | null {
    const test = this.abTests.get(testId);
    return test ? test.variant : null;
  }

  private async sendToBackend(event: ConversionEvent, priority = false): Promise<void> {
    // Skip backend calls if disabled
    if (!this.backendEnabled) {
      // Store locally for development/debugging
      this.storeEventLocally(event);
      return;
    }

    const eventId = `${event.eventName}_${Date.now()}`;
    const attempts = this.retryAttempts.get(eventId) || 0;

    // Check if we've exceeded max retries
    if (attempts >= this.maxRetries) {
      console.warn(`Analytics: Max retries (${this.maxRetries}) exceeded for event ${event.eventName}`);
      this.retryAttempts.delete(eventId);
      this.storeEventLocally(event);
      return;
    }

    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

      const endpoint = priority ? '/conversions/priority' : '/conversions';
      const response = await fetch(`${this.analyticsApiUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...event,
          session: this.session,
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Success - remove from retry attempts
      this.retryAttempts.delete(eventId);
    } catch (error) {
      // Store retry attempt count
      this.retryAttempts.set(eventId, attempts + 1);

      // Only log on first failure, not on every retry
      if (attempts === 0) {
        console.debug('Analytics backend unavailable, storing locally');
      }

      // Store failed events for retry with exponential backoff
      this.storeFailedEvent(event, eventId);
    }
  }

  private storeFailedEvent(event: ConversionEvent, eventId: string): void {
    const failed = localStorage.getItem('ea_failed_events');
    const events = failed ? JSON.parse(failed) : [];
    
    // Add event with metadata
    events.push({
      ...event,
      eventId,
      timestamp: Date.now()
    });
    
    localStorage.setItem('ea_failed_events', JSON.stringify(events));

    // Exponential backoff: delay increases with each retry
    const attempts = this.retryAttempts.get(eventId) || 0;
    const delay = Math.min(this.baseRetryDelay * Math.pow(2, attempts), 60000); // Max 1 minute
    
    // Retry with exponential backoff
    setTimeout(() => this.retryFailedEvents(), delay);
  }

  private storeEventLocally(event: ConversionEvent): void {
    // Store events locally for development/debugging
    const localEvents = localStorage.getItem('ea_local_analytics');
    const events = localEvents ? JSON.parse(localEvents) : [];
    
    events.push({
      ...event,
      timestamp: Date.now(),
      session: this.session.sessionId
    });
    
    // Keep only last 1000 events to prevent storage overflow
    if (events.length > 1000) {
      events.shift();
    }
    
    localStorage.setItem('ea_local_analytics', JSON.stringify(events));
  }

  private async retryFailedEvents(): Promise<void> {
    // Skip retry if backend is disabled
    if (!this.backendEnabled) {
      localStorage.removeItem('ea_failed_events');
      return;
    }

    const failed = localStorage.getItem('ea_failed_events');
    if (!failed) return;

    const events = JSON.parse(failed);
    
    // Filter out expired events (older than 24 hours)
    const validEvents = events.filter((e: any) => {
      const age = Date.now() - (e.timestamp || 0);
      return age < 24 * 60 * 60 * 1000; // 24 hours
    });

    if (validEvents.length === 0) {
      localStorage.removeItem('ea_failed_events');
      return;
    }

    // Clear storage before retry
    localStorage.removeItem('ea_failed_events');

    // Retry valid events
    for (const event of validEvents) {
      const { eventId, ...eventData } = event;
      await this.sendToBackend(eventData);
    }
  }

  private showConversionNotification(event: ConversionEvent): void {
    // Create a temporary notification element
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-up';
    notification.innerHTML = `
      <div class="flex items-center">
        <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>Conversion tracked: €${event.value}</span>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('animate-slide-down');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // Utility methods for components
  public getSessionRevenue(): number {
    return this.session.revenue;
  }

  public getSessionDuration(): number {
    return Date.now() - this.session.startTime;
  }

  public getPageViews(): number {
    return this.session.pageViews;
  }

  public getTrafficInfo(): { source: string; medium: string; campaign: string } {
    return {
      source: this.session.source || 'direct',
      medium: this.session.medium || 'organic',
      campaign: this.session.campaign || 'none',
    };
  }

  // Advanced Analytics Methods for Revenue Intelligence
  public getFunnelConversionRates(): Record<string, number> {
    const steps = ['awareness', 'interest', 'consideration', 'intent', 'conversion'];
    const stepCounts = {};
    
    steps.forEach(step => {
      stepCounts[step] = this.session.events.filter(e => 
        this.determineFunnelStep(e.eventName) === step
      ).length;
    });
    
    const rates = {};
    for (let i = 1; i < steps.length; i++) {
      const current = stepCounts[steps[i]] || 0;
      const previous = stepCounts[steps[i-1]] || 1;
      rates[`${steps[i-1]}_to_${steps[i]}`] = (current / previous) * 100;
    }
    
    return rates;
  }

  // Booking Funnel Tracking Methods
  public trackBookingFunnel(stage: string, data: any = {}): void {
    const language = this.detectLanguage();
    const deviceInfo = this.getDeviceInfo();
    
    const eventData = {
      funnel_stage: stage,
      language,
      device_type: deviceInfo.type,
      browser: deviceInfo.browser,
      ...data,
      timestamp: Date.now()
    };

    switch (stage) {
      case 'availability_check':
        this.trackEvent('booking_funnel_availability', eventData);
        break;
      case 'service_selected':
        this.trackEvent('booking_funnel_service', eventData);
        break;
      case 'details_entered':
        this.trackEvent('booking_funnel_details', eventData);
        break;
      case 'confirmation_viewed':
        this.trackEvent('booking_funnel_confirmation', eventData);
        break;
      case 'booking_completed':
        this.trackEvent('booking_funnel_completed', eventData);
        this.trackConversion({
          eventName: 'booking_completed',
          value: data.value || 0,
          currency: 'EUR',
          metadata: eventData
        });
        break;
      case 'booking_abandoned':
        this.trackEvent('booking_funnel_abandoned', eventData);
        break;
    }

    // Update language usage stats
    this.updateLanguageStats(language);
  }

  // Language Tracking Methods
  private detectLanguage(): string {
    // Check URL path
    if (window.location.pathname.includes('/de/')) return 'de';
    if (window.location.pathname.includes('/en/')) return 'en';
    
    // Check localStorage preference
    const preferred = localStorage.getItem('preferred_language');
    if (preferred) return preferred;
    
    // Check browser language
    const browserLang = navigator.language.substring(0, 2);
    if (browserLang === 'de') return 'de';
    
    // Default to English
    return 'en';
  }

  public trackLanguageSelection(language: 'de' | 'en', method: 'manual' | 'auto' = 'manual'): void {
    const previousLanguage = this.detectLanguage();
    
    this.trackEvent('language_selected', {
      language,
      previous_language: previousLanguage,
      selection_method: method,
      browser_language: navigator.language,
      device_type: this.getDeviceInfo().type
    });

    // Store preference
    localStorage.setItem('preferred_language', language);
    this.updateLanguageStats(language);
  }

  private updateLanguageStats(language: string): void {
    const key = language === 'de' ? 'german_page_views' : 'english_page_views';
    const current = parseInt(localStorage.getItem(key) || '0');
    localStorage.setItem(key, String(current + 1));
  }

  public getLanguageStats(): any {
    const germanViews = parseInt(localStorage.getItem('german_page_views') || '0');
    const englishViews = parseInt(localStorage.getItem('english_page_views') || '0');
    const totalViews = germanViews + englishViews;
    
    return {
      german_percentage: totalViews > 0 ? ((germanViews / totalViews) * 100).toFixed(2) : '0',
      english_percentage: totalViews > 0 ? ((englishViews / totalViews) * 100).toFixed(2) : '0',
      german_views: germanViews,
      english_views: englishViews,
      preferred_language: localStorage.getItem('preferred_language') || 'en',
      browser_language: navigator.language,
      current_language: this.detectLanguage()
    };
  }

  // Device and Browser Detection
  private getDeviceInfo(): { type: string; browser: string } {
    const userAgent = navigator.userAgent.toLowerCase();
    
    // Device type detection
    let deviceType = 'desktop';
    if (/mobile|android|iphone/i.test(userAgent)) {
      deviceType = 'mobile';
    } else if (/tablet|ipad/i.test(userAgent)) {
      deviceType = 'tablet';
    }
    
    // Browser detection
    let browser = 'other';
    if (userAgent.includes('chrome') && !userAgent.includes('edge')) {
      browser = 'chrome';
    } else if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
      browser = 'safari';
    } else if (userAgent.includes('firefox')) {
      browser = 'firefox';
    } else if (userAgent.includes('edge')) {
      browser = 'edge';
    }
    
    return { type: deviceType, browser };
  }

  public getRevenueAttribution(): Record<string, number> {
    const attribution = {
      direct: 0,
      organic: 0,
      paid: 0,
      social: 0,
      referral: 0,
      email: 0
    };
    
    const source = this.session.source || 'direct';
    const medium = this.session.medium || 'none';
    
    if (source === 'direct') attribution.direct = this.session.revenue;
    else if (medium.includes('organic')) attribution.organic = this.session.revenue;
    else if (medium.includes('cpc') || medium.includes('paid')) attribution.paid = this.session.revenue;
    else if (['facebook', 'twitter', 'linkedin', 'instagram'].some(s => source.includes(s))) attribution.social = this.session.revenue;
    else if (medium === 'referral') attribution.referral = this.session.revenue;
    else if (medium === 'email') attribution.email = this.session.revenue;
    
    return attribution;
  }

  public getCohortAnalysis(): Record<string, any> {
    return {
      cohort: this.session.cohort,
      daysInCohort: Math.floor((Date.now() - this.session.startTime) / (1000 * 60 * 60 * 24)),
      totalRevenue: this.session.revenue,
      predictedLTV: this.session.ltv,
      engagementScore: this.session.totalEngagementScore,
      conversionEvents: this.session.events.filter(e => e.value > 100).length
    };
  }

  public getKFCMentionEffectiveness(): Record<string, any> {
    const kfcEvents = this.session.events.filter(e => 
      e.eventName.includes('kfc') || 
      (e.metadata && JSON.stringify(e.metadata).toLowerCase().includes('kfc'))
    );
    
    const totalKFCValue = kfcEvents.reduce((sum, e) => sum + e.value, 0);
    const kfcMentionIndex = this.session.events.findIndex(e => e.eventName === 'kfc_mention_view');
    const conversionIndex = this.session.events.findIndex(e => e.eventName === 'consultation_booked');
    const conversionAfterKFC = kfcMentionIndex >= 0 && conversionIndex > kfcMentionIndex;
    
    return {
      kfcMentions: kfcEvents.length,
      valueFromKFCMentions: totalKFCValue,
      convertedAfterKFCMention: conversionAfterKFC,
      kfcInfluenceScore: totalKFCValue > 0 ? Math.min(totalKFCValue / this.session.revenue * 100, 100) : 0
    };
  }

  private determineFunnelStep(eventName: string): string {
    const funnelSteps = {
      'landing_page_view': 'awareness',
      'hero_scroll_engagement': 'awareness', 
      'kfc_mention_view': 'interest',
      'demo_interaction': 'interest',
      'roi_calculator_use': 'consideration',
      'product_view': 'consideration',
      'product_selected': 'intent',
      'booking_modal_open': 'intent',
      'consultation_booked': 'conversion',
      'trial_started': 'conversion',
    };
    return funnelSteps[eventName] || 'engagement';
  }

  private calculateTimeToConversion(eventName: string): number {
    const conversionEvents = ['consultation_booked', 'trial_started', 'meeting_scheduled'];
    if (conversionEvents.includes(eventName)) {
      return Date.now() - this.session.startTime;
    }
    return 0;
  }

  // Debugging and Development Methods
  public getAnalyticsStatus(): Record<string, any> {
    return {
      backendEnabled: this.backendEnabled,
      backendUrl: this.analyticsApiUrl,
      maxRetries: this.maxRetries,
      retryDelay: this.baseRetryDelay,
      failedEvents: this.getFailedEventsCount(),
      localEvents: this.getLocalEventsCount(),
      sessionRevenue: this.session.revenue,
      totalEvents: this.session.events.length,
      retryQueue: Array.from(this.retryAttempts.entries())
    };
  }

  public getLocalAnalytics(): any[] {
    const localEvents = localStorage.getItem('ea_local_analytics');
    return localEvents ? JSON.parse(localEvents) : [];
  }

  public getFailedEventsCount(): number {
    const failed = localStorage.getItem('ea_failed_events');
    const events = failed ? JSON.parse(failed) : [];
    return events.length;
  }

  public getLocalEventsCount(): number {
    const local = localStorage.getItem('ea_local_analytics');
    const events = local ? JSON.parse(local) : [];
    return events.length;
  }

  public clearLocalAnalytics(): void {
    localStorage.removeItem('ea_local_analytics');
    localStorage.removeItem('ea_failed_events');
    this.retryAttempts.clear();
    console.log('Local analytics cleared');
  }

  public exportAnalytics(): string {
    const data = {
      session: this.session,
      localEvents: this.getLocalAnalytics(),
      failedEvents: this.getFailedEventsCount(),
      status: this.getAnalyticsStatus()
    };
    return JSON.stringify(data, null, 2);
  }
}

// Export singleton instance
export const analytics = RevenueTracker.getInstance();

// Export types for use in components
export type { ConversionEvent, UserSession, ABTestVariant };

// Helper functions for common tracking scenarios
export const trackBookingIntent = () => {
  analytics.trackEvent('booking_intent', {
    page: window.location.pathname,
  });
};

export const trackProductView = (productId: string, productName: string, price: number) => {
  analytics.trackEvent('product_view', {
    productId,
    productName,
    price,
  });
};

export const trackROICalculation = (inputs: any, results: any) => {
  analytics.trackEvent('roi_calculated', {
    ...inputs,
    ...results,
  });
};

export const trackCartUpdate = (products: any[], totalValue: number) => {
  analytics.trackEvent('cart_updated', {
    productCount: products.length,
    totalValue,
    products: products.map(p => ({ id: p.id, name: p.name, price: p.price })),
  });
};

// Booking Funnel Helper Functions
export const bookingFunnel = {
  checkAvailability: (serviceId?: string, date?: string) => {
    analytics.trackBookingFunnel('availability_check', { serviceId, date });
  },
  
  selectService: (serviceId: string, serviceName: string, price?: number) => {
    analytics.trackBookingFunnel('service_selected', { serviceId, serviceName, price });
  },
  
  enterDetails: (hasEmail: boolean, hasPhone: boolean, hasName: boolean) => {
    analytics.trackBookingFunnel('details_entered', { hasEmail, hasPhone, hasName });
  },
  
  viewConfirmation: (bookingDetails: any) => {
    analytics.trackBookingFunnel('confirmation_viewed', bookingDetails);
  },
  
  completeBooking: (bookingId: string, serviceId: string, value?: number) => {
    analytics.trackBookingFunnel('booking_completed', { bookingId, serviceId, value });
  },
  
  abandonBooking: (lastStage: string, reason?: string) => {
    analytics.trackBookingFunnel('booking_abandoned', { lastStage, reason });
  }
};

// Language Tracking Helper Functions
export const languageTracking = {
  selectLanguage: (language: 'de' | 'en' | 'fr' | 'it', method: 'manual' | 'auto' = 'manual') => {
    analytics.trackLanguageSelection(language, method);
  },
  
  getStats: () => {
    return analytics.getLanguageStats();
  },
  
  trackPageView: (language?: string) => {
    const lang = language || analytics['detectLanguage']();
    analytics['updateLanguageStats'](lang);
  }
};

// A/B Testing helper
export const getVariant = (testId: string, variants: string[]): string => {
  let variant = analytics.getABTestVariant(testId);
  
  if (!variant) {
    // Randomly assign variant
    variant = variants[Math.floor(Math.random() * variants.length)];
    analytics.setABTestVariant(testId, variant);
  }
  
  return variant;
};

// Initialize on load with enhanced KFC tracking
if (typeof window !== 'undefined') {
  (window as any).eaAnalytics = analytics;

  // Delay initialization until DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initializeAnalyticsTracking();
    });
  } else {
    // DOM is already loaded
    setTimeout(() => initializeAnalyticsTracking(), 100);
  }
}

function initializeAnalyticsTracking() {
  try {
    // Automatically track KFC mentions in content
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ELEMENT_NODE) {
            const text = node.textContent?.toLowerCase() || '';
            if (text.includes('kfc')) {
              analytics.trackEvent('kfc_mention_view', {
                location: 'content',
                context: text.substring(0, 100),
                elementType: node.nodeType === Node.ELEMENT_NODE ? (node as Element).tagName : 'text'
              });
            }
          }
        });
      });
    });

    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
      });
    }

    // Track initial page load
    analytics.trackEvent('landing_page_view', {
      url: window.location.pathname,
      referrer: document.referrer,
      loadTime: Date.now()
    });
  } catch (error) {
    console.error('[Analytics] Failed to initialize tracking:', error);
  }
}