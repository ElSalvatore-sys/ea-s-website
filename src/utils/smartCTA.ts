/**
 * Smart CTA System - Context-aware call-to-action management
 */

export type CTAContext = 
  | 'booking-hero'
  | 'booking-pricing'
  | 'booking-features'
  | 'booking-roi'
  | 'web-hero'
  | 'web-portfolio'
  | 'web-process'
  | 'web-pricing'
  | 'automation-hero'
  | 'automation-workflow'
  | 'automation-case-study'
  | 'automation-roi'
  | 'homepage-hero'
  | 'homepage-problems'
  | 'homepage-features'
  | 'homepage-final'
  | 'pricing-tier'
  | 'pricing-enterprise'
  | 'about-hero'
  | 'about-team'
  | 'approach-process'
  | 'approach-industry'
  | 'general';

export type CTAAction = 'primary' | 'secondary' | 'tertiary';

export interface CTAConfig {
  text: {
    en: string;
    de: string;
  };
  action: () => void;
  icon?: string;
  variant?: 'gradient' | 'outline' | 'ghost';
  analytics?: {
    event: string;
    category: string;
    value?: number;
  };
}

/**
 * Get smart CTA based on context and language
 */
export function getSmartCTA(
  context: CTAContext,
  action: CTAAction = 'primary',
  language: 'en' | 'de' = 'en'
): CTAConfig {
  const ctaMap: Record<CTAContext, Record<CTAAction, CTAConfig>> = {
    'booking-hero': {
      primary: {
        text: { en: 'See Live Demo', de: 'Live-Demo ansehen' },
        action: () => window.location.href = '/demo-booking',
        variant: 'gradient',
        analytics: { event: 'booking_demo_click', category: 'booking' }
      },
      secondary: {
        text: { en: 'Calculate Your Savings', de: 'Ersparnis berechnen' },
        action: () => document.getElementById('roi-calculator')?.scrollIntoView({ behavior: 'smooth' }),
        variant: 'outline',
        analytics: { event: 'roi_calculator_click', category: 'booking' }
      },
      tertiary: {
        text: { en: 'Start 30-Day Trial', de: '30-Tage-Test starten' },
        action: () => window.dispatchEvent(new CustomEvent('openBookingModal')),
        variant: 'ghost',
        analytics: { event: 'trial_start_click', category: 'booking' }
      }
    },
    'booking-pricing': {
      primary: {
        text: { en: 'Start 30-Day Trial', de: '30-Tage-Test starten' },
        action: () => window.dispatchEvent(new CustomEvent('openBookingModal')),
        variant: 'gradient',
        analytics: { event: 'pricing_trial_click', category: 'booking' }
      },
      secondary: {
        text: { en: 'Compare Plans', de: 'Pläne vergleichen' },
        action: () => document.getElementById('comparison-table')?.scrollIntoView({ behavior: 'smooth' }),
        variant: 'outline'
      },
      tertiary: {
        text: { en: 'Contact Sales', de: 'Vertrieb kontaktieren' },
        action: () => window.location.href = '/contact',
        variant: 'ghost'
      }
    },
    'booking-features': {
      primary: {
        text: { en: 'See It In Action', de: 'In Aktion sehen' },
        action: () => window.location.href = '/demo-booking',
        variant: 'gradient'
      },
      secondary: {
        text: { en: 'View All Features', de: 'Alle Funktionen ansehen' },
        action: () => window.location.href = '/features',
        variant: 'outline'
      },
      tertiary: {
        text: { en: 'Get Started', de: 'Jetzt starten' },
        action: () => window.dispatchEvent(new CustomEvent('openBookingModal')),
        variant: 'ghost'
      }
    },
    'booking-roi': {
      primary: {
        text: { en: 'Calculate Your ROI', de: 'ROI berechnen' },
        action: () => document.getElementById('roi-calculator')?.scrollIntoView({ behavior: 'smooth' }),
        variant: 'gradient',
        analytics: { event: 'roi_calculate_click', category: 'booking', value: 100 }
      },
      secondary: {
        text: { en: 'See Case Studies', de: 'Fallstudien ansehen' },
        action: () => window.location.href = '/portfolio#booking',
        variant: 'outline'
      },
      tertiary: {
        text: { en: 'Talk to Sales', de: 'Mit Vertrieb sprechen' },
        action: () => window.location.href = '/contact',
        variant: 'ghost'
      }
    },
    'web-hero': {
      primary: {
        text: { en: 'Get Project Quote', de: 'Projektangebot erhalten' },
        action: () => window.dispatchEvent(new CustomEvent('openBookingModal')),
        variant: 'gradient',
        analytics: { event: 'web_quote_click', category: 'web' }
      },
      secondary: {
        text: { en: 'View Portfolio', de: 'Portfolio ansehen' },
        action: () => window.location.href = '/portfolio#websites',
        variant: 'outline',
        analytics: { event: 'portfolio_view_click', category: 'web' }
      },
      tertiary: {
        text: { en: 'Schedule Consultation', de: 'Beratung vereinbaren' },
        action: () => window.dispatchEvent(new CustomEvent('openBookingModal')),
        variant: 'ghost'
      }
    },
    'web-portfolio': {
      primary: {
        text: { en: 'See Our Work', de: 'Unsere Arbeit sehen' },
        action: () => window.location.href = '/portfolio',
        variant: 'gradient'
      },
      secondary: {
        text: { en: 'Discuss Your Project', de: 'Projekt besprechen' },
        action: () => window.dispatchEvent(new CustomEvent('openBookingModal')),
        variant: 'outline'
      },
      tertiary: {
        text: { en: 'Get Inspired', de: 'Inspiration holen' },
        action: () => window.location.href = '/portfolio',
        variant: 'ghost'
      }
    },
    'web-process': {
      primary: {
        text: { en: 'Start Your Project', de: 'Projekt starten' },
        action: () => window.dispatchEvent(new CustomEvent('openBookingModal')),
        variant: 'gradient'
      },
      secondary: {
        text: { en: 'Our Process', de: 'Unser Prozess' },
        action: () => window.location.href = '/approach',
        variant: 'outline'
      },
      tertiary: {
        text: { en: 'Timeline & Pricing', de: 'Zeitplan & Preise' },
        action: () => window.location.href = '/pricing',
        variant: 'ghost'
      }
    },
    'web-pricing': {
      primary: {
        text: { en: 'Get Custom Quote', de: 'Individuelles Angebot' },
        action: () => window.dispatchEvent(new CustomEvent('openBookingModal')),
        variant: 'gradient'
      },
      secondary: {
        text: { en: 'See Examples', de: 'Beispiele ansehen' },
        action: () => window.location.href = '/portfolio',
        variant: 'outline'
      },
      tertiary: {
        text: { en: 'FAQ', de: 'Häufige Fragen' },
        action: () => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' }),
        variant: 'ghost'
      }
    },
    'automation-hero': {
      primary: {
        text: { en: 'Book Strategy Call', de: 'Strategiegespräch buchen' },
        action: () => window.dispatchEvent(new CustomEvent('openBookingModal')),
        variant: 'gradient',
        analytics: { event: 'automation_strategy_click', category: 'automation' }
      },
      secondary: {
        text: { en: 'Explore Automations', de: 'Automatisierungen erkunden' },
        action: () => document.getElementById('automation-examples')?.scrollIntoView({ behavior: 'smooth' }),
        variant: 'outline'
      },
      tertiary: {
        text: { en: "See What's Possible", de: 'Möglichkeiten entdecken' },
        action: () => window.location.href = '/services/business-automation#examples',
        variant: 'ghost'
      }
    },
    'automation-workflow': {
      primary: {
        text: { en: 'Build Your Workflow', de: 'Workflow erstellen' },
        action: () => window.dispatchEvent(new CustomEvent('openBookingModal')),
        variant: 'gradient'
      },
      secondary: {
        text: { en: 'See Examples', de: 'Beispiele ansehen' },
        action: () => document.getElementById('workflow-examples')?.scrollIntoView({ behavior: 'smooth' }),
        variant: 'outline'
      },
      tertiary: {
        text: { en: 'Calculate Savings', de: 'Ersparnis berechnen' },
        action: () => document.getElementById('time-savings-calculator')?.scrollIntoView({ behavior: 'smooth' }),
        variant: 'ghost'
      }
    },
    'automation-case-study': {
      primary: {
        text: { en: 'Get Similar Results', de: 'Ähnliche Ergebnisse erzielen' },
        action: () => window.dispatchEvent(new CustomEvent('openBookingModal')),
        variant: 'gradient'
      },
      secondary: {
        text: { en: 'Read More Cases', de: 'Weitere Fälle lesen' },
        action: () => window.location.href = '/portfolio#automation',
        variant: 'outline'
      },
      tertiary: {
        text: { en: 'Download Case Study', de: 'Fallstudie herunterladen' },
        action: () => console.log('Download case study'),
        variant: 'ghost'
      }
    },
    'automation-roi': {
      primary: {
        text: { en: 'Calculate Time Savings', de: 'Zeitersparnis berechnen' },
        action: () => document.getElementById('time-calculator')?.scrollIntoView({ behavior: 'smooth' }),
        variant: 'gradient'
      },
      secondary: {
        text: { en: 'See ROI Examples', de: 'ROI-Beispiele ansehen' },
        action: () => window.location.href = '/portfolio#automation',
        variant: 'outline'
      },
      tertiary: {
        text: { en: 'Get Assessment', de: 'Bewertung erhalten' },
        action: () => window.dispatchEvent(new CustomEvent('openBookingModal')),
        variant: 'ghost'
      }
    },
    'homepage-hero': {
      primary: {
        text: { en: 'Get Free Consultation', de: 'Kostenlose Beratung' },
        action: () => window.dispatchEvent(new CustomEvent('openBookingModal')),
        variant: 'gradient',
        analytics: { event: 'homepage_hero_cta', category: 'homepage', value: 500 }
      },
      secondary: {
        text: { en: 'Explore Services', de: 'Services erkunden' },
        action: () => window.location.href = '/services',
        variant: 'outline'
      },
      tertiary: {
        text: { en: 'Watch Demo', de: 'Demo ansehen' },
        action: () => window.location.href = '/demos',
        variant: 'ghost'
      }
    },
    'homepage-problems': {
      primary: {
        text: { en: 'Calculate Your Savings', de: 'Ersparnis berechnen' },
        action: () => document.getElementById('roi-calculator')?.scrollIntoView({ behavior: 'smooth' }),
        variant: 'gradient'
      },
      secondary: {
        text: { en: 'See Solutions', de: 'Lösungen ansehen' },
        action: () => window.location.href = '/services',
        variant: 'outline'
      },
      tertiary: {
        text: { en: 'Get Help Now', de: 'Jetzt Hilfe erhalten' },
        action: () => window.dispatchEvent(new CustomEvent('openBookingModal')),
        variant: 'ghost'
      }
    },
    'homepage-features': {
      primary: {
        text: { en: 'See How It Works', de: 'So funktioniert es' },
        action: () => window.location.href = '/approach',
        variant: 'gradient'
      },
      secondary: {
        text: { en: 'View All Features', de: 'Alle Funktionen' },
        action: () => window.location.href = '/features',
        variant: 'outline'
      },
      tertiary: {
        text: { en: 'Try It Free', de: 'Kostenlos testen' },
        action: () => window.dispatchEvent(new CustomEvent('openBookingModal')),
        variant: 'ghost'
      }
    },
    'homepage-final': {
      primary: {
        text: { en: 'Discuss Your Needs', de: 'Bedürfnisse besprechen' },
        action: () => window.dispatchEvent(new CustomEvent('openBookingModal')),
        variant: 'gradient',
        analytics: { event: 'homepage_final_cta', category: 'homepage', value: 300 }
      },
      secondary: {
        text: { en: 'See Pricing', de: 'Preise ansehen' },
        action: () => window.location.href = '/pricing',
        variant: 'outline'
      },
      tertiary: {
        text: { en: 'Contact Us', de: 'Kontakt' },
        action: () => window.location.href = '/contact',
        variant: 'ghost'
      }
    },
    'pricing-tier': {
      primary: {
        text: { en: 'Choose This Plan', de: 'Plan wählen' },
        action: () => window.dispatchEvent(new CustomEvent('openBookingModal')),
        variant: 'gradient'
      },
      secondary: {
        text: { en: 'Start 30-Day Trial', de: '30 Tage testen' },
        action: () => window.dispatchEvent(new CustomEvent('openBookingModal')),
        variant: 'outline'
      },
      tertiary: {
        text: { en: 'Learn More', de: 'Mehr erfahren' },
        action: () => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }),
        variant: 'ghost'
      }
    },
    'pricing-enterprise': {
      primary: {
        text: { en: 'Get Custom Proposal', de: 'Individuelles Angebot' },
        action: () => window.location.href = 'mailto:enterprise@ea-s.com',
        variant: 'gradient'
      },
      secondary: {
        text: { en: 'Schedule Demo', de: 'Demo vereinbaren' },
        action: () => window.dispatchEvent(new CustomEvent('openBookingModal')),
        variant: 'outline'
      },
      tertiary: {
        text: { en: 'Contact Sales', de: 'Vertrieb kontaktieren' },
        action: () => window.location.href = '/contact',
        variant: 'ghost'
      }
    },
    'about-hero': {
      primary: {
        text: { en: "Let's Talk", de: 'Sprechen wir' },
        action: () => window.dispatchEvent(new CustomEvent('openBookingModal')),
        variant: 'gradient'
      },
      secondary: {
        text: { en: 'Our Story', de: 'Unsere Geschichte' },
        action: () => document.getElementById('story')?.scrollIntoView({ behavior: 'smooth' }),
        variant: 'outline'
      },
      tertiary: {
        text: { en: 'Meet the Team', de: 'Team kennenlernen' },
        action: () => document.getElementById('team')?.scrollIntoView({ behavior: 'smooth' }),
        variant: 'ghost'
      }
    },
    'about-team': {
      primary: {
        text: { en: 'Work With Us', de: 'Mit uns arbeiten' },
        action: () => window.dispatchEvent(new CustomEvent('openBookingModal')),
        variant: 'gradient'
      },
      secondary: {
        text: { en: 'Join Our Team', de: 'Team beitreten' },
        action: () => window.location.href = '/careers',
        variant: 'outline'
      },
      tertiary: {
        text: { en: 'Contact', de: 'Kontakt' },
        action: () => window.location.href = '/contact',
        variant: 'ghost'
      }
    },
    'approach-process': {
      primary: {
        text: { en: 'Start Your Journey', de: 'Reise beginnen' },
        action: () => window.dispatchEvent(new CustomEvent('openBookingModal')),
        variant: 'gradient'
      },
      secondary: {
        text: { en: 'Our Process', de: 'Unser Prozess' },
        action: () => document.getElementById('process')?.scrollIntoView({ behavior: 'smooth' }),
        variant: 'outline'
      },
      tertiary: {
        text: { en: 'Success Stories', de: 'Erfolgsgeschichten' },
        action: () => window.location.href = '/portfolio',
        variant: 'ghost'
      }
    },
    'approach-industry': {
      primary: {
        text: { en: 'Get Industry Demo', de: 'Branchen-Demo' },
        action: () => window.dispatchEvent(new CustomEvent('openBookingModal')),
        variant: 'gradient'
      },
      secondary: {
        text: { en: 'Industry Solutions', de: 'Branchenlösungen' },
        action: () => document.getElementById('industries')?.scrollIntoView({ behavior: 'smooth' }),
        variant: 'outline'
      },
      tertiary: {
        text: { en: 'Case Studies', de: 'Fallstudien' },
        action: () => window.location.href = '/portfolio',
        variant: 'ghost'
      }
    },
    'general': {
      primary: {
        text: { en: 'Get Started', de: 'Jetzt starten' },
        action: () => window.dispatchEvent(new CustomEvent('openBookingModal')),
        variant: 'gradient'
      },
      secondary: {
        text: { en: 'Learn More', de: 'Mehr erfahren' },
        action: () => window.location.href = '/services',
        variant: 'outline'
      },
      tertiary: {
        text: { en: 'Contact Us', de: 'Kontakt' },
        action: () => window.location.href = '/contact',
        variant: 'ghost'
      }
    }
  };

  const contextConfig = ctaMap[context] || ctaMap['general'];
  const actionConfig = contextConfig[action] || contextConfig['primary'];
  
  return {
    ...actionConfig,
    text: actionConfig.text[language],
    style: actionConfig.variant === 'gradient' 
      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
      : actionConfig.variant === 'outline'
      ? 'border-2 border-white/20 text-white hover:bg-white/10'
      : 'text-white hover:bg-white/10'
  };
}

/**
 * Get CTA text for current language
 */
export function getCTAText(config: CTAConfig, language: 'en' | 'de' = 'en'): string {
  return config.text[language];
}

/**
 * Track CTA interaction
 */
export function trackCTAClick(config: CTAConfig): void {
  if (config.analytics) {
    // Track with analytics system
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.trackEvent(config.analytics.event, {
        category: config.analytics.category,
        value: config.analytics.value
      });
    }
  }
}

/**
 * Execute CTA action with tracking
 */
export function executeCTA(config: CTAConfig): void {
  trackCTAClick(config);
  config.action();
}