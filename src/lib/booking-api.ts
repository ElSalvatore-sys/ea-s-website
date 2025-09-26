// Booking System API Integration
// Connects to the backend at port 5000

const BOOKING_API_URL = '/api';
const REQUEST_TIMEOUT = 10000; // 10 seconds
const MAX_RETRIES = 3;
const RETRY_DELAYS = [1000, 2000, 4000]; // Exponential backoff

// Response interfaces matching backend structure
export interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
  label?: string;
}

export interface AvailabilityApiResponse {
  status: 'success' | 'error';
  data?: {
    date: string;
    businessId?: string;
    serviceId?: string;
    slots: TimeSlot[];
    totalSlots: number;
    availableSlots: number;
  };
  message?: string;
}

export interface BookingApiResponse {
  status: 'success' | 'error';
  message: string;
  data?: {
    id: string;
    bookingId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    dateTime: Date;
    startTime: Date;
    endTime: Date;
    title: string;
    description?: string;
    location?: string;
    status: string;
    confirmationMessage: string;
    formattedDate: string;
    createdAt: Date;
  };
}

export interface ApiErrorResponse {
  status: 'error';
  message: string;
  validationErrors?: Array<{
    field: string;
    message: string;
  }>;
  error?: any;
}

export interface Booking {
  businessId?: string;
  serviceId?: string;
  serviceName?: string;
  dateTime: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  title?: string;
  description?: string;
  location?: string;
  notes?: string;
}

export interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  description?: string;
}

export interface Business {
  id: string;
  name: string;
  timezone: string;
  services?: Service[];
}

class BookingAPI {
  private apiUrl: string;
  private abortControllers: Map<string, AbortController> = new Map();

  constructor() {
    this.apiUrl = BOOKING_API_URL;
  }

  /**
   * Fetch with timeout and retry logic
   */
  private async fetchWithRetry(
    url: string,
    options: RequestInit,
    retries = MAX_RETRIES
  ): Promise<Response> {
    const requestId = `${options.method}_${url}_${Date.now()}`;
    
    // Create abort controller for this request
    const controller = new AbortController();
    this.abortControllers.set(requestId, controller);
    
    // Add timeout
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, REQUEST_TIMEOUT);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      this.abortControllers.delete(requestId);
      
      // If response is ok or it's a client error (4xx), return it
      if (response.ok || (response.status >= 400 && response.status < 500)) {
        return response;
      }

      // For server errors (5xx), retry
      if (response.status >= 500 && retries > 0) {
        const delay = RETRY_DELAYS[MAX_RETRIES - retries] || 4000;
        console.warn(`Server error ${response.status}, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.fetchWithRetry(url, options, retries - 1);
      }

      return response;
    } catch (error: any) {
      clearTimeout(timeoutId);
      this.abortControllers.delete(requestId);
      
      // Handle abort
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - Der Server antwortet nicht');
      }

      // Handle network errors with retry
      if (retries > 0 && error.name === 'TypeError') {
        const delay = RETRY_DELAYS[MAX_RETRIES - retries] || 4000;
        console.warn(`Network error, retrying in ${delay}ms...`, error);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.fetchWithRetry(url, options, retries - 1);
      }

      throw error;
    }
  }

  /**
   * Parse error response
   */
  private parseErrorResponse(error: any): string {
    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        return 'Die Anfrage hat zu lange gedauert. Bitte versuchen Sie es erneut.';
      }
      if (error.message.includes('network')) {
        return 'Netzwerkfehler. Bitte überprüfen Sie Ihre Internetverbindung.';
      }
      return error.message;
    }
    
    if (typeof error === 'string') {
      return error;
    }

    if (error?.validationErrors?.length > 0) {
      return error.validationErrors.map((e: any) => e.message).join('. ');
    }

    return error?.message || 'Ein unerwarteter Fehler ist aufgetreten';
  }

  /**
   * Get available time slots for a specific date
   */
  async getAvailableSlots(
    businessId: string,
    serviceId: string,
    date: string
  ): Promise<AvailabilityApiResponse> {
    try {
      const params = new URLSearchParams({
        date,
        ...(businessId && { businessId }),
        ...(serviceId && { serviceId }),
      });

      const response = await this.fetchWithRetry(
        `${this.apiUrl}/bookings/availability?${params}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: response.statusText
        }));
        throw new Error(this.parseErrorResponse(errorData));
      }

      const data = await response.json();
      
      // Ensure the response matches our expected format
      if (data.status === 'success' && data.data) {
        return data as AvailabilityApiResponse;
      } else {
        // Handle legacy format if backend returns slots directly
        return {
          status: 'success',
          data: {
            date,
            businessId,
            serviceId,
            slots: data.slots || data,
            totalSlots: data.totalSlots || (data.slots || data).length,
            availableSlots: data.availableSlots || (data.slots || data).filter((s: TimeSlot) => s.available).length
          }
        };
      }
    } catch (error) {
      console.error('Error fetching available slots:', error);
      return {
        status: 'error',
        message: this.parseErrorResponse(error)
      };
    }
  }

  /**
   * Create a new booking
   */
  async createBooking(booking: Booking): Promise<BookingApiResponse> {
    try {
      // Validate required fields
      if (!booking.customerName || !booking.customerEmail || !booking.customerPhone || !booking.dateTime) {
        throw new Error('Bitte füllen Sie alle Pflichtfelder aus');
      }

      // Clean phone number for German format validation
      const cleanPhone = booking.customerPhone.replace(/[\s\-\(\)]/g, '');
      
      const response = await this.fetchWithRetry(
        `${this.apiUrl}/bookings`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...booking,
            customerPhone: cleanPhone,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(this.parseErrorResponse(data));
      }

      return data as BookingApiResponse;
    } catch (error) {
      console.error('Error creating booking:', error);
      return {
        status: 'error',
        message: this.parseErrorResponse(error)
      };
    }
  }

  /**
   * Get bookings for a customer (requires authentication)
   */
  async getCustomerBookings(customerId: string, token?: string): Promise<any> {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await this.fetchWithRetry(
        `${this.apiUrl}/bookings?userId=${customerId}`,
        {
          method: 'GET',
          headers,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: response.statusText
        }));
        throw new Error(this.parseErrorResponse(errorData));
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Error fetching customer bookings:', error);
      throw error;
    }
  }

  /**
   * Cancel a booking (requires authentication)
   */
  async cancelBooking(bookingId: string, token?: string): Promise<any> {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await this.fetchWithRetry(
        `${this.apiUrl}/bookings/${bookingId}`,
        {
          method: 'DELETE',
          headers,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: response.statusText
        }));
        throw new Error(this.parseErrorResponse(errorData));
      }

      return await response.json();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  }

  /**
   * Update booking status (requires authentication)
   */
  async updateBookingStatus(
    bookingId: string,
    status: string,
    token?: string
  ): Promise<any> {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await this.fetchWithRetry(
        `${this.apiUrl}/bookings/${bookingId}/status`,
        {
          method: 'PATCH',
          headers,
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: response.statusText
        }));
        throw new Error(this.parseErrorResponse(errorData));
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  }

  /**
   * Get statistics for admin dashboard (requires authentication)
   */
  async getBookingStats(
    startDate?: string,
    endDate?: string,
    organizationId?: string,
    token?: string
  ): Promise<any> {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (organizationId) params.append('organizationId', organizationId);

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await this.fetchWithRetry(
        `${this.apiUrl}/bookings/stats?${params}`,
        {
          method: 'GET',
          headers,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: response.statusText
        }));
        throw new Error(this.parseErrorResponse(errorData));
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw error;
    }
  }

  /**
   * Cancel all pending requests
   */
  cancelAllRequests(): void {
    this.abortControllers.forEach(controller => {
      controller.abort();
    });
    this.abortControllers.clear();
  }
}

// Export singleton instance
export const bookingAPI = new BookingAPI();

// Test businesses and services data
export const testBusinesses: Business[] = [
  {
    id: 'smart-home-installer',
    name: 'EA-S Smart Living Solutions',
    timezone: 'Europe/Berlin',
    services: [
      { id: 'sh-consultation', name: 'Smart Home Beratung', duration: 60, price: 0 }, // Free consultation
      { id: 'sh-basic', name: 'Installation Basis', duration: 120, price: 350 },
      { id: 'sh-premium', name: 'Premium Setup', duration: 240, price: 750 }
    ]
  },
  {
    id: 'restaurant-consultant',
    name: 'EA-S Gastronomy Excellence',
    timezone: 'Europe/Berlin',
    services: [
      { id: 'gc-consultation', name: 'Erstberatung', duration: 60, price: 200 },
      { id: 'gc-menu', name: 'Menü-Optimierung', duration: 120, price: 450 },
      { id: 'gc-analysis', name: 'Vollanalyse', duration: 240, price: 900 }
    ]
  },
  {
    id: 'demo-friseursalon',
    name: 'Friseursalon Schmidt (Demo)',
    timezone: 'Europe/Berlin',
    services: [
      { id: 'hs-men', name: 'Herrenhaarschnitt', duration: 30, price: 25 },
      { id: 'hs-women', name: 'Damenhaarschnitt', duration: 60, price: 45 },
      { id: 'hs-color', name: 'Färben & Schneiden', duration: 120, price: 95 }
    ]
  }
];

export default bookingAPI;