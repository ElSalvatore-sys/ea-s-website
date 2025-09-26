/**
 * Supabase Configuration for EA-S Website
 * Manages database connections and authentication
 */

import { createClient } from '@supabase/supabase-js';

// Environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase configuration missing. Database features will be disabled.');
}

// Create Supabase client
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      global: {
        headers: {
          'x-application-name': 'EA-S Website',
        },
      },
    })
  : null;

// Database tables
export const TABLES = {
  CONTACTS: 'contacts',
  BOOKINGS: 'bookings',
  NEWSLETTER: 'newsletter_subscribers',
  PRODUCTS: 'smart_living_products',
  ANALYTICS: 'analytics_events',
  ADMIN_USERS: 'admin_users',
} as const;

// Helper functions for database operations
export const db = {
  // Contact form submissions
  async saveContact(data: {
    name: string;
    email: string;
    company?: string;
    phone?: string;
    message: string;
    service?: string;
  }) {
    if (!supabase) throw new Error('Database not configured');
    
    const { data: result, error } = await supabase
      .from(TABLES.CONTACTS)
      .insert({
        ...data,
        created_at: new Date().toISOString(),
        status: 'new',
      })
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  // Booking submissions
  async saveBooking(data: {
    service: string;
    date: string;
    time: string;
    name: string;
    email: string;
    company?: string;
    phone?: string;
    requirements?: string;
  }) {
    if (!supabase) throw new Error('Database not configured');
    
    const { data: result, error } = await supabase
      .from(TABLES.BOOKINGS)
      .insert({
        ...data,
        created_at: new Date().toISOString(),
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  // Newsletter subscription
  async subscribeNewsletter(email: string, name?: string) {
    if (!supabase) throw new Error('Database not configured');
    
    const { data: result, error } = await supabase
      .from(TABLES.NEWSLETTER)
      .upsert({
        email,
        name,
        subscribed_at: new Date().toISOString(),
        is_active: true,
      })
      .select()
      .single();

    if (error) throw error;
    return result;
  },

  // Get smart living products
  async getProducts(category?: string) {
    if (!supabase) throw new Error('Database not configured');
    
    let query = supabase
      .from(TABLES.PRODUCTS)
      .select('*')
      .eq('is_active', true)
      .order('priority', { ascending: true });

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Track analytics event
  async trackEvent(eventName: string, eventData?: any) {
    if (!supabase) return; // Silently fail if not configured
    
    try {
      await supabase
        .from(TABLES.ANALYTICS)
        .insert({
          event_name: eventName,
          event_data: eventData,
          timestamp: new Date().toISOString(),
          page_url: window.location.href,
          user_agent: navigator.userAgent,
        });
    } catch (error) {
      console.error('Analytics tracking failed:', error);
    }
  },

  // Admin authentication
  async adminLogin(email: string, password: string) {
    if (!supabase) throw new Error('Database not configured');
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  async adminLogout() {
    if (!supabase) throw new Error('Database not configured');
    
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getAdminSession() {
    if (!supabase) return null;
    
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },
};

// Export database status
export const isDatabaseConfigured = !!supabase;

// Initialize database tables (run once during setup)
export async function initializeDatabase() {
  if (!supabase) {
    console.warn('Cannot initialize database: Supabase not configured');
    return false;
  }

  try {
    // This would typically be done via migrations
    // For now, we'll just verify the connection
    const { data, error } = await supabase
      .from(TABLES.CONTACTS)
      .select('count')
      .limit(1);

    if (error && error.code === '42P01') {
      console.warn('Database tables not initialized. Please run migrations.');
      return false;
    }

    console.log('Database connection verified');
    return true;
  } catch (error) {
    console.error('Database initialization failed:', error);
    return false;
  }
}

export default supabase;