import React, { useState, useEffect } from 'react';
import { Cookie, Shield, BarChart3, Target, Settings, X, Check } from 'lucide-react';

interface ConsentSettings {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

const STORAGE_KEY = 'ea-s-cookie-consent';
const CONSENT_VERSION = '1.0';

export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consent, setConsent] = useState<ConsentSettings>({
    necessary: true, // Always true - required for basic functionality
    analytics: false,
    marketing: false,
    preferences: false,
  });

  useEffect(() => {
    const savedConsent = localStorage.getItem(STORAGE_KEY);
    if (!savedConsent) {
      setIsVisible(true);
    } else {
      try {
        const parsed = JSON.parse(savedConsent);
        if (parsed.version !== CONSENT_VERSION) {
          // Show banner again if version changed
          setIsVisible(true);
        } else {
          setConsent(parsed.settings);
          // Apply saved consent
          applyConsentSettings(parsed.settings);
        }
      } catch {
        setIsVisible(true);
      }
    }
  }, []);

  const applyConsentSettings = (settings: ConsentSettings) => {
    // Analytics consent
    if (settings.analytics) {
      // Enable Google Analytics or other analytics
      (window as any).gtag?.('consent', 'update', {
        'analytics_storage': 'granted'
      });
    } else {
      (window as any).gtag?.('consent', 'update', {
        'analytics_storage': 'denied'
      });
    }

    // Marketing consent
    if (settings.marketing) {
      (window as any).gtag?.('consent', 'update', {
        'ad_storage': 'granted',
        'ad_user_data': 'granted',
        'ad_personalization': 'granted'
      });
    } else {
      (window as any).gtag?.('consent', 'update', {
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied'
      });
    }

    // Preferences consent (for UI customization)
    if (settings.preferences) {
      localStorage.setItem('ea-s-preferences-enabled', 'true');
    } else {
      localStorage.removeItem('ea-s-preferences-enabled');
    }

    // Log consent for audit trail
    logConsentDecision(settings);
  };

  const logConsentDecision = async (settings: ConsentSettings) => {
    try {
      await fetch('/api/gdpr/consent-log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          settings,
          version: CONSENT_VERSION,
          ipHash: await generateIpHash(), // Hash IP for privacy
        }),
      });
    } catch (error) {
      console.warn('Failed to log consent decision:', error);
    }
  };

  const generateIpHash = async (): Promise<string> => {
    // Simple hash for IP tracking without storing actual IP
    const response = await fetch('https://api.ipify.org');
    const ip = await response.text();
    const encoder = new TextEncoder();
    const data = encoder.encode(ip);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 8);
  };

  const saveConsent = (settings: ConsentSettings) => {
    const consentData = {
      settings,
      timestamp: new Date().toISOString(),
      version: CONSENT_VERSION,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consentData));
    applyConsentSettings(settings);
    
    // Dispatch consent update event for analytics system
    const consentEvent = new CustomEvent('ea-consent-updated', {
      detail: {
        analytics: settings.analytics,
        marketing: settings.marketing,
        preferences: settings.preferences
      }
    });
    window.dispatchEvent(consentEvent);
    
    setIsVisible(false);
  };

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    setConsent(allAccepted);
    saveConsent(allAccepted);
  };

  const acceptNecessary = () => {
    const necessaryOnly = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };
    setConsent(necessaryOnly);
    saveConsent(necessaryOnly);
  };

  const saveCustom = () => {
    saveConsent(consent);
  };

  const toggleConsent = (key: keyof ConsentSettings) => {
    if (key === 'necessary') return; // Cannot be disabled
    setConsent(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const cookieCategories = [
    {
      key: 'necessary' as keyof ConsentSettings,
      icon: Shield,
      title: 'Strictly Necessary',
      description: 'Essential for basic website functionality, security, and compliance.',
      examples: 'Session management, security tokens, preference storage',
      required: true,
    },
    {
      key: 'analytics' as keyof ConsentSettings,
      icon: BarChart3,
      title: 'Analytics & Performance',
      description: 'Help us understand how visitors interact with our website.',
      examples: 'Google Analytics, performance monitoring, error tracking',
      required: false,
    },
    {
      key: 'marketing' as keyof ConsentSettings,
      icon: Target,
      title: 'Marketing & Advertising',
      description: 'Used to deliver relevant advertisements and measure campaign effectiveness.',
      examples: 'Google Ads, Facebook Pixel, conversion tracking',
      required: false,
    },
    {
      key: 'preferences' as keyof ConsentSettings,
      icon: Settings,
      title: 'Preferences & Functionality',
      description: 'Remember your choices and provide enhanced features.',
      examples: 'Theme selection, language preferences, customization settings',
      required: false,
    },
  ];

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                <Cookie className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Cookie & Privacy Settings
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  We respect your privacy and comply with GDPR regulations
                </p>
              </div>
            </div>
            {!showDetails && (
              <button
                onClick={() => setIsVisible(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          {!showDetails ? (
            <>
              <div className="mb-6">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  We use cookies and similar technologies to enhance your experience, analyze site usage, and assist in marketing efforts. 
                  You can customize your preferences or accept all cookies to continue.
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>GDPR Compliance:</strong> Your privacy is our priority. You have the right to access, modify, or delete your data at any time. 
                    <a href="/datenschutz" className="underline hover:no-underline ml-1" target="_blank">
                      View our Privacy Policy
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={acceptAll}
                  className="flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Accept All Cookies
                </button>
                <button
                  onClick={acceptNecessary}
                  className="flex items-center justify-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
                >
                  Necessary Only
                </button>
                <button
                  onClick={() => setShowDetails(true)}
                  className="flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium rounded-lg transition-colors"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Customize Settings
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {cookieCategories.map((category) => {
                  const IconComponent = category.icon;
                  const isEnabled = consent[category.key];
                  
                  return (
                    <div key={category.key} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className={`p-2 rounded-lg ${
                            category.required || isEnabled 
                              ? 'bg-blue-100 dark:bg-blue-900/30' 
                              : 'bg-gray-100 dark:bg-gray-800'
                          }`}>
                            <IconComponent className={`h-5 w-5 ${
                              category.required || isEnabled 
                                ? 'text-blue-600 dark:text-blue-400' 
                                : 'text-gray-400'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-semibold text-gray-900 dark:text-white">
                                {category.title}
                              </h4>
                              {category.required && (
                                <span className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded font-medium">
                                  Required
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              {category.description}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                              <strong>Examples:</strong> {category.examples}
                            </p>
                          </div>
                        </div>
                        <div className="ml-4">
                          <button
                            onClick={() => toggleConsent(category.key)}
                            disabled={category.required}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              category.required || isEnabled
                                ? 'bg-blue-600'
                                : 'bg-gray-300 dark:bg-gray-600'
                            } ${category.required ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                            aria-label={`Toggle ${category.title}`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                category.required || isEnabled ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={saveCustom}
                    className="flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Save My Preferences
                  </button>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium rounded-lg transition-colors"
                  >
                    Back to Summary
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl">
          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 dark:text-gray-400 space-y-2 sm:space-y-0">
            <div>
              <p>© 2024 EA Solutions - GDPR Compliant | Version {CONSENT_VERSION}</p>
            </div>
            <div className="flex space-x-4">
              <a href="/datenschutz" className="hover:text-gray-700 dark:hover:text-gray-300 underline">
                Privacy Policy
              </a>
              <a href="/impressum" className="hover:text-gray-700 dark:hover:text-gray-300 underline">
                Impressum
              </a>
              <button
                onClick={() => {
                  localStorage.removeItem(STORAGE_KEY);
                  setIsVisible(true);
                  setShowDetails(false);
                }}
                className="hover:text-gray-700 dark:hover:text-gray-300 underline"
              >
                Change Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;