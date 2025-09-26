import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, Copy, RefreshCw, Bug, Code, ChevronDown, ChevronUp, Terminal } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  showDetails: boolean;
  showStackTrace: boolean;
  errorHistory: Array<{
    timestamp: Date;
    error: Error;
    errorInfo: ErrorInfo;
  }>;
}

/**
 * Enhanced Error Boundary with Developer Mode
 * 
 * Chain-of-Thought (CoT) Implementation:
 * 
 * Step 1: Error Detection
 * - Capture error and error info
 * - Store in state for display
 * - Log to console with full context
 * 
 * Step 2: Context Analysis
 * - Determine if in development or production
 * - Extract component stack trace
 * - Identify error source and type
 * 
 * Step 3: Error Display Strategy
 * - Development: Show full details, stack trace, component tree
 * - Production: Show user-friendly message with recovery options
 * 
 * Step 4: Recovery Mechanisms
 * - Provide reload button
 * - Clear local storage option
 * - Copy error details for bug reports
 * 
 * Step 5: Error Tracking
 * - Store error history in localStorage
 * - Send to analytics if enabled
 * - Provide export functionality
 */
class EnhancedErrorBoundary extends Component<Props, State> {
  private isDevelopment = process.env.NODE_ENV === 'development' || import.meta.env.DEV;

  public state: State = {
    hasError: false,
    showDetails: false,
    showStackTrace: false,
    errorHistory: []
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Step 1: Log error with full context
    console.group('🔴 Error Boundary Caught Error');
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
    console.error('Component Stack:', errorInfo.componentStack);
    console.groupEnd();

    // Step 2: Store error in history
    const errorEntry = {
      timestamp: new Date(),
      error,
      errorInfo
    };

    // Update state with error info
    this.setState(prevState => ({
      errorInfo,
      errorHistory: [...prevState.errorHistory, errorEntry]
    }));

    // Step 3: Store in localStorage for persistence
    try {
      const existingErrors = localStorage.getItem('ea_error_history');
      const errors = existingErrors ? JSON.parse(existingErrors) : [];
      errors.push({
        timestamp: errorEntry.timestamp.toISOString(),
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack
      });
      // Keep only last 10 errors
      if (errors.length > 10) errors.shift();
      localStorage.setItem('ea_error_history', JSON.stringify(errors));
    } catch (e) {
      console.error('Failed to store error history:', e);
    }

    // Step 4: Send to analytics if available
    if (window.analytics && typeof window.analytics.trackEvent === 'function') {
      window.analytics.trackEvent('error_boundary_triggered', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack
      });
    }
  }

  private copyErrorDetails = () => {
    const { error, errorInfo } = this.state;
    if (!error) return;

    const errorDetails = `
=== ERROR REPORT ===
Timestamp: ${new Date().toISOString()}
Environment: ${this.isDevelopment ? 'Development' : 'Production'}
URL: ${window.location.href}
User Agent: ${navigator.userAgent}

ERROR MESSAGE:
${error.message}

STACK TRACE:
${error.stack}

COMPONENT STACK:
${errorInfo?.componentStack || 'Not available'}

BROWSER INFO:
- Platform: ${navigator.platform}
- Language: ${navigator.language}
- Online: ${navigator.onLine}
- Screen: ${window.screen.width}x${window.screen.height}

LOCAL STORAGE DATA:
- Session: ${localStorage.getItem('ea_session') ? 'Present' : 'None'}
- Analytics: ${localStorage.getItem('ea_local_analytics') ? 'Present' : 'None'}
===================
    `.trim();

    navigator.clipboard.writeText(errorDetails);
    alert('Error details copied to clipboard!');
  };

  private clearStorageAndReload = () => {
    // Clear all localStorage
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear cookies
    document.cookie.split(";").forEach(c => {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    
    // Reload page
    window.location.reload();
  };

  private toggleDetails = () => {
    this.setState(prev => ({ showDetails: !prev.showDetails }));
  };

  private toggleStackTrace = () => {
    this.setState(prev => ({ showStackTrace: !prev.showStackTrace }));
  };

  public render() {
    if (this.state.hasError) {
      const { error, errorInfo, showDetails, showStackTrace } = this.state;

      // Development mode: Show detailed error information
      if (this.isDevelopment) {
        return (
          <div className="min-h-screen bg-gray-900 text-white p-8 font-mono">
            <div className="max-w-6xl mx-auto">
              {/* Header */}
              <div className="flex items-center mb-8">
                <Bug className="h-12 w-12 text-red-500 mr-4" />
                <div>
                  <h1 className="text-4xl font-bold text-red-500">Development Error Boundary</h1>
                  <p className="text-gray-400 mt-1">An error occurred in the React component tree</p>
                </div>
              </div>

              {/* Error Message Box */}
              <div className="bg-red-950 border border-red-500 rounded-lg p-6 mb-6">
                <div className="flex items-start">
                  <AlertCircle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-2 text-red-400">Error Message</h2>
                    <pre className="text-sm overflow-x-auto whitespace-pre-wrap break-words">
                      {error?.message || 'Unknown error'}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-3 mb-6">
                <button
                  onClick={() => window.location.reload()}
                  className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reload Page
                </button>
                <button
                  onClick={this.copyErrorDetails}
                  className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Error Details
                </button>
                <button
                  onClick={this.clearStorageAndReload}
                  className="flex items-center px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Clear Storage & Reload
                </button>
                <button
                  onClick={this.toggleDetails}
                  className="flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Code className="h-4 w-4 mr-2" />
                  {showDetails ? 'Hide' : 'Show'} Component Stack
                  {showDetails ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
                </button>
                <button
                  onClick={this.toggleStackTrace}
                  className="flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Terminal className="h-4 w-4 mr-2" />
                  {showStackTrace ? 'Hide' : 'Show'} Stack Trace
                  {showStackTrace ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
                </button>
              </div>

              {/* Stack Trace */}
              {showStackTrace && error?.stack && (
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-yellow-400">Stack Trace</h3>
                  <pre className="text-xs overflow-x-auto text-gray-300">
                    {error.stack}
                  </pre>
                </div>
              )}

              {/* Component Stack */}
              {showDetails && errorInfo?.componentStack && (
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-green-400">Component Stack</h3>
                  <pre className="text-xs overflow-x-auto text-gray-300">
                    {errorInfo.componentStack}
                  </pre>
                </div>
              )}

              {/* Error Analysis */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold mb-3 text-blue-400">Error Analysis</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="text-gray-500">Error Type:</span> <span className="text-orange-400">{error?.name || 'Unknown'}</span></div>
                  <div><span className="text-gray-500">Timestamp:</span> {new Date().toLocaleString()}</div>
                  <div><span className="text-gray-500">Browser:</span> {navigator.userAgent.split(' ').slice(-2).join(' ')}</div>
                  <div><span className="text-gray-500">URL:</span> {window.location.href}</div>
                  <div><span className="text-gray-500">Environment:</span> Development</div>
                </div>
              </div>

              {/* Debugging Tips */}
              <div className="bg-blue-950 border border-blue-500 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-blue-400">Debugging Tips</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Check the browser console for additional error details</li>
                  <li>• Review recent code changes that might have caused this error</li>
                  <li>• Use React DevTools to inspect component props and state</li>
                  <li>• Try clearing browser cache and localStorage if the error persists</li>
                  <li>• Check network tab for failed API requests</li>
                  <li>• Search for the error message in the codebase</li>
                </ul>
              </div>
            </div>
          </div>
        );
      }

      // Production mode: User-friendly error page
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
          <div className="text-center p-8 max-w-lg">
            <div className="mb-6">
              <div className="w-24 h-24 bg-red-500 rounded-full mx-auto flex items-center justify-center">
                <AlertCircle className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Oops! Something went wrong
            </h1>
            <p className="text-gray-400 mb-8">
              We apologize for the inconvenience. Our team has been notified and is working on a fix.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-gray-700 text-white px-6 py-3 rounded-full hover:bg-gray-600 transition-colors"
              >
                Go to Homepage
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default EnhancedErrorBoundary;