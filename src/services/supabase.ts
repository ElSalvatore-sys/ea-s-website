import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// Database types
export interface Booking {
  id?: string;
  business_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  service_id: string;
  service_name: string;
  date: string;
  time_slot: string;
  duration_minutes: number;
  price: number;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at?: string;
  updated_at?: string;
}

export interface TimeSlot {
  id: string;
  business_id: string;
  date: string;
  start_time: string;
  end_time: string;
  available: boolean;
  booked_by?: string;
}

export interface Business {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  opening_hours: {
    [day: string]: { open: string; close: string; closed?: boolean };
  };
  mittagspause: { start: string; end: string };
  services: Service[];
  settings: {
    require_deposit: boolean;
    deposit_amount: number;
    cancellation_hours: number;
    booking_advance_days: number;
  };
}

export interface Service {
  id: string;
  business_id: string;
  name: string;
  description: string;
  duration_minutes: number;
  price: number;
  active: boolean;
}

// Booking service functions
export const bookingService = {
  // Get available time slots for a specific date
  async getAvailableSlots(businessId: string, date: string, serviceId: string) {
    try {
      // Get business hours
      const { data: business } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', businessId)
        .single();

      if (!business) throw new Error('Business not found');

      // Generate time slots based on business hours
      const slots = generateTimeSlots(business, date);

      // Check existing bookings
      const { data: bookings } = await supabase
        .from('bookings')
        .select('time_slot')
        .eq('business_id', businessId)
        .eq('date', date)
        .in('status', ['pending', 'confirmed']);

      const bookedSlots = bookings?.map(b => b.time_slot) || [];

      // Mark booked slots as unavailable
      return slots.map(slot => ({
        ...slot,
        available: !bookedSlots.includes(slot.start)
      }));
    } catch (error) {
      console.error('Error fetching available slots:', error);
      throw error;
    }
  },

  // Create a new booking
  async createBooking(booking: Omit<Booking, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert([{
          ...booking,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) throw error;

      // Send confirmation email (to be implemented)
      await this.sendConfirmationEmail(data);

      return data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  // Get bookings for a business
  async getBookings(businessId: string, filters?: { date?: string; status?: string }) {
    try {
      let query = supabase
        .from('bookings')
        .select('*')
        .eq('business_id', businessId)
        .order('date', { ascending: true })
        .order('time_slot', { ascending: true });

      if (filters?.date) {
        query = query.eq('date', filters.date);
      }

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  },

  // Update booking status
  async updateBookingStatus(bookingId: string, status: Booking['status']) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', bookingId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  },

  // Send confirmation email
  async sendConfirmationEmail(booking: Booking) {
    // This will be integrated with your email service
    console.log('Sending confirmation email for booking:', booking);
    // TODO: Implement email sending
  },

  // Get booking statistics
  async getBookingStats(businessId: string) {
    try {
      const today = new Date().toISOString().split('T')[0];

      // Get today's bookings
      const { data: todayBookings } = await supabase
        .from('bookings')
        .select('*')
        .eq('business_id', businessId)
        .eq('date', today)
        .in('status', ['pending', 'confirmed']);

      // Get this month's bookings
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
      const { data: monthBookings } = await supabase
        .from('bookings')
        .select('*')
        .eq('business_id', businessId)
        .gte('date', startOfMonth)
        .in('status', ['confirmed', 'completed']);

      // Calculate stats
      const stats = {
        todayCount: todayBookings?.length || 0,
        monthCount: monthBookings?.length || 0,
        monthRevenue: monthBookings?.reduce((sum, b) => sum + (b.price || 0), 0) || 0,
        noShowRate: 0, // TODO: Calculate based on historical data
        averageBookingValue: monthBookings?.length
          ? (monthBookings.reduce((sum, b) => sum + (b.price || 0), 0) / monthBookings.length)
          : 0
      };

      return stats;
    } catch (error) {
      console.error('Error fetching booking stats:', error);
      throw error;
    }
  }
};

// Helper function to generate time slots
function generateTimeSlots(business: any, date: string): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const dayOfWeek = new Date(date).getDay();
  const dayName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][dayOfWeek];

  const hours = business.opening_hours?.[dayName];
  if (!hours || hours.closed) return [];

  const openTime = parseTime(hours.open);
  const closeTime = parseTime(hours.close);
  const mittagspauseStart = parseTime(business.mittagspause?.start || '12:00');
  const mittagspauseEnd = parseTime(business.mittagspause?.end || '13:00');

  let currentTime = openTime;
  const slotDuration = 30; // 30-minute slots

  while (currentTime < closeTime) {
    const slotEnd = currentTime + slotDuration;

    // Skip Mittagspause
    if (currentTime >= mittagspauseStart && currentTime < mittagspauseEnd) {
      currentTime = mittagspauseEnd;
      continue;
    }

    slots.push({
      id: `${date}-${formatTime(currentTime)}`,
      business_id: business.id,
      date,
      start_time: formatTime(currentTime),
      end_time: formatTime(slotEnd),
      available: true
    });

    currentTime = slotEnd;
  }

  return slots;
}

// Helper functions for time handling
function parseTime(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

export default supabase;