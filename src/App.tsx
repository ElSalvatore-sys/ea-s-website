import React, { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import { NotificationProvider } from './contexts/NotificationContext';
import { LanguageProvider } from './providers/LanguageProvider';
import ErrorBoundary from './components/ErrorBoundary';
import EnhancedErrorBoundary from './components/EnhancedErrorBoundary';
import Layout from './components/Layout';
import TranslationLoader from './components/TranslationLoader';
import i18n from './i18n/config';

// Lazy load non-critical components
const AnalyticsDashboard = lazy(() => import('./components/AnalyticsDashboard'));
const AnalyticsLiveDashboard = lazy(() => import('./components/analytics/AnalyticsDashboard'));
const CookieConsent = lazy(() => import('./components/CookieConsent'));
const FloatingCTA = lazy(() => import('./components/FloatingCTA'));
const AIAssistant = lazy(() => import('./components/AIAssistant'));

// Critical pages - load immediately for mobile performance
const HomeModern = lazy(() => import('./pages/HomeModern'));
const Contact = lazy(() => import('./pages/ContactModern'));

// High priority pages - preload on interaction
const Services = lazy(() => import('./pages/Services'));
const Solutions = lazy(() => import('./pages/Solutions'));
const Approach = lazy(() => import('./pages/Approach'));
const About = lazy(() => import('./pages/About'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const Features = lazy(() => import('./pages/Features'));
const Pricing = lazy(() => import('./pages/Pricing'));

// Medium priority pages - load on demand
const GastronomyHospitality = lazy(() => import('./pages/solutions/GastronomyHospitality'));
const DemoShowcase = lazy(() => import('./pages/DemoShowcase'));
const DemoHub = lazy(() => import('./pages/DemoHub'));
const DemoBooking = lazy(() => import('./pages/DemoBookingRedesigned'));
const IndustryBookingDemo = lazy(() => import('./pages/IndustryBookingDemo'));

// Service pages
const BookingSystems = lazy(() => import('./pages/services/BookingSystems'));
const WebDevelopment = lazy(() => import('./pages/services/WebDevelopment'));
const BusinessAutomation = lazy(() => import('./pages/services/BusinessAutomation'));

// Low priority pages - minimal impact on initial load
const Home = lazy(() => import('./pages/Home'));
const Datenschutz = lazy(() => import('./pages/Datenschutz'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Impressum = lazy(() => import('./pages/Impressum'));
const LogoShowcase = lazy(() => import('./pages/LogoShowcase'));
const NotFound = lazy(() => import('./pages/NotFound'));
const ValidationDemo = lazy(() => import('./pages/ValidationDemo'));

// Debug page - only in development
const Debug = lazy(() => import('./pages/Debug'));

// API and Developer pages - using placeholder for now
const ComingSoon = lazy(() => import('./pages/ComingSoon'));

// Integrations showcase page
const IntegrationsShowcase = lazy(() => import('./pages/IntegrationsShowcase'));

// Optimized loading component for mobile performance
const PageLoader: React.FC = () => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        return prev + Math.random() * 10;
      });
    }, 100);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex items-center justify-center">
      <div className="text-center w-full max-w-xs mx-auto px-4">
        <div className="mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mx-auto mb-4 animate-pulse" 
               style={{ animationDuration: '1.5s' }}>
            <div className="w-full h-full rounded-full border-2 border-white/20 animate-spin" 
                 style={{ animationDuration: '2s' }}></div>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">EA-S</h2>
          <p className="text-gray-400 text-sm mb-4">Loading experience...</p>
        </div>
        
        {/* Progress bar for better UX */}
        <div className="w-full bg-gray-700 rounded-full h-1 mb-2">
          <div 
            className="bg-gradient-to-r from-purple-600 to-blue-600 h-1 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500">{Math.round(progress)}%</p>
      </div>
    </div>
  );
};

// Optimized scroll management with mobile performance considerations
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    // Instant scroll to top for better UX
    window.scrollTo(0, 0);
    
    // Preload critical resources for likely next pages
    if (pathname === '/') {
      // Preload services page
      import('./pages/Services');
    }
  }, [pathname]);

  return null;
};

// Performance monitoring hook for mobile optimization
const usePerformanceMetrics = () => {
  useEffect(() => {
    // Report Core Web Vitals for mobile optimization
    const reportWebVitals = () => {
      if ('performance' in window) {
        // FCP (First Contentful Paint)
        const paintEntries = performance.getEntriesByType('paint');
        const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        
        // LCP tracking will be handled by service worker
        if (fcp && process.env.NODE_ENV === 'production') {
          console.log(`FCP: ${fcp.startTime}ms`);
        }
      }
    };
    
    // Delay reporting to avoid blocking main thread
    setTimeout(reportWebVitals, 1000);
  }, []);
};

function App() {
  usePerformanceMetrics();
  const [i18nReady, setI18nReady] = useState(false);

  useEffect(() => {
    // Wait for i18n to be ready
    const checkI18n = () => {
      if (i18n.isInitialized) {
        setI18nReady(true);
      } else {
        i18n.on('initialized', () => {
          setI18nReady(true);
        });
      }
    };
    checkI18n();
  }, []);

  // Use EnhancedErrorBoundary in development for better debugging
  const ErrorBoundaryComponent = import.meta.env.DEV ? EnhancedErrorBoundary : ErrorBoundary;

  // I18n loading fallback
  const I18nFallback = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        <p className="mt-4 text-gray-400">Loading language resources...</p>
      </div>
    </div>
  );

  if (!i18nReady) {
    return <I18nFallback />;
  }

  return (
    <ErrorBoundaryComponent>
      <ThemeProvider>
        <LanguageProvider>
          <NotificationProvider>
            <Router>
              <ScrollToTop />
              <Layout>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    {/* Critical path - highest priority */}
                    <Route path="/" element={<HomeModern />} />
                    <Route path="/contact" element={<Contact />} />
                  
                  {/* High priority business pages */}
                  <Route path="/services" element={<Services />} />
                  <Route path="/solutions" element={<Solutions />} />
                  <Route path="/approach" element={<Approach />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/portfolio" element={<Portfolio />} />
                  <Route path="/features" element={<Features />} />
                  <Route path="/pricing" element={<Pricing />} />
                  
                  {/* Developer and API pages - coming soon */}
                  <Route path="/developer" element={<ComingSoon title="Developer Portal" description="API documentation and developer tools coming soon" />} />
                  <Route path="/api" element={<ComingSoon title="API Documentation" description="Complete API reference and guides coming soon" />} />
                  <Route path="/api-docs" element={<ComingSoon title="API Documentation" description="Complete API reference and guides coming soon" />} />
                  <Route path="/integrations" element={<IntegrationsShowcase />} />
                  <Route path="/support" element={<ComingSoon title="Support Center" description="Help center and support resources coming soon" />} />
                  
                  {/* Service pages */}
                  <Route path="/services/booking-systems" element={<BookingSystems />} />
                  <Route path="/services/web-development" element={<WebDevelopment />} />
                  <Route path="/services/business-automation" element={<BusinessAutomation />} />
                  
                  {/* Medium priority pages */}
                  <Route path="/gastronomy" element={<GastronomyHospitality />} />
                  <Route path="/demos" element={<DemoHub />} />
                  <Route path="/demo-booking" element={<DemoBooking />} />
                  <Route path="/industry-booking-demo" element={<IndustryBookingDemo />} />
                  
                  {/* Low priority pages */}
                  <Route path="/old-home" element={<Home />} />
                  <Route path="/datenschutz" element={<Datenschutz />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/impressum" element={<Impressum />} />
                  <Route path="/logo-showcase" element={<LogoShowcase />} />
                  <Route path="/validation-demo" element={<ValidationDemo />} />
                  
                  {/* Analytics Dashboard */}
                  <Route path="/analytics" element={<AnalyticsLiveDashboard />} />
                  
                  {/* Debug route - only in development */}
                  {process.env.NODE_ENV === 'development' && (
                    <Route path="/debug" element={<Debug />} />
                  )}

                  {/* 404 Page - Catch all unmatched routes */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
              </Layout>

              {/* Lazy load non-critical components */}
              <Suspense fallback={null}>
                <AnalyticsDashboard />
                <CookieConsent />
                <FloatingCTA />
                <AIAssistant />
              </Suspense>
            </Router>
          </NotificationProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundaryComponent>
  );
}

export default App;