/**
 * API Configuration for EA-S Website
 * Centralizes all API endpoints and configuration
 */

// Determine API URL based on environment
const isDevelopment = import.meta.env.DEV;
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Supabase Configuration
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// API Endpoints
export const API_ENDPOINTS = {
  // AI Chat & Analysis
  AI_CHAT: `${API_BASE_URL}/ai-chat`,
  ANALYZE_TEXT: `${API_BASE_URL}/analyze-text`,
  SMART_HOME_ADVISOR: `${API_BASE_URL}/smart-home-advisor`,
  
  // Demo Endpoints
  DEMO_BOOKING: `${API_BASE_URL}/demo/booking`,
  DEMO_BOOKING_AVAILABILITY: (date: string) => `${API_BASE_URL}/demo/booking/availability/${date}`,
  DEMO_DOCUMENT: `${API_BASE_URL}/demo/document`,
  DEMO_CHAT: `${API_BASE_URL}/demo/chat`,
  DEMO_ANALYTICS: `${API_BASE_URL}/demo/analytics`,
  
  // Business Services
  CONTACT_FORM: `${API_BASE_URL}/contact`,
  NEWSLETTER_SUBSCRIBE: `${API_BASE_URL}/newsletter/subscribe`,
  
  // Smart Living Products
  PRODUCTS_LIST: `${API_BASE_URL}/products`,
  PRODUCT_DETAILS: (id: string) => `${API_BASE_URL}/products/${id}`,
  
  // ROI Calculator
  ROI_CALCULATE: `${API_BASE_URL}/roi/calculate`,
  
  // Admin Endpoints
  ADMIN_LOGIN: `${API_BASE_URL}/admin/login`,
  ADMIN_DASHBOARD: `${API_BASE_URL}/admin/dashboard`,
} as const;

// Request configuration with proper headers
export const getRequestConfig = (additionalHeaders?: HeadersInit) => ({
  headers: {
    'Content-Type': 'application/json',
    ...additionalHeaders,
  },
});

// Error handling utility
export const handleApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred. Please try again.';
};

// Rate limiting configuration
export const RATE_LIMITS = {
  DEMO_REQUESTS_PER_MINUTE: 10,
  AI_REQUESTS_PER_MINUTE: 20,
  CONTACT_REQUESTS_PER_HOUR: 5,
} as const;

// API Health Check
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      ...getRequestConfig(),
    });
    return response.ok;
  } catch {
    return false;
  }
};

// Export a function to make API calls with error handling
export const apiCall = async <T = any>(
  endpoint: string,
  options?: RequestInit
): Promise<{ success: boolean; data?: T; error?: string }> => {
  try {
    const response = await fetch(endpoint, {
      ...getRequestConfig(),
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('API call failed:', error);
    return { 
      success: false, 
      error: handleApiError(error) 
    };
  }
};

export default API_ENDPOINTS;