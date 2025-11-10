import { projectId, publicAnonKey } from './supabase/info';
import { Property, Booking } from '../App';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-0fe65257`;

function getAuthHeaders(accessToken?: string) {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken || publicAnonKey}`,
  };
}

// Test backend connectivity
export async function testBackendConnection() {
  try {
    const response = await fetch(`${API_BASE}/health`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      console.error('Backend health check failed:', response.status, response.statusText);
      return false;
    }
    
    const data = await response.json();
    console.log('Backend health check:', data);
    return data.status === 'ok';
  } catch (error) {
    console.error('Backend connection error:', error);
    console.error('API Base URL:', API_BASE);
    console.error('Project ID:', projectId);
    return false;
  }
}

// Properties API
export async function getProperties(): Promise<Property[]> {
  try {
    const response = await fetch(`${API_BASE}/properties`, {
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Get properties error:', data);
      return [];
    }

    return data.properties || [];
  } catch (error) {
    console.error('Get properties exception:', error);
    return [];
  }
}

export async function initializeProperties(properties: Property[]): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/properties/init`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ properties }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Init properties error:', data);
      return false;
    }

    return data.success;
  } catch (error) {
    console.error('Init properties exception:', error);
    return false;
  }
}

export async function searchProperties(filters: {
  country?: string;
  minPrice?: number;
  maxPrice?: number;
  guests?: number;
  amenities?: string[];
}): Promise<Property[]> {
  try {
    const response = await fetch(`${API_BASE}/properties/search`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(filters),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Search properties error:', data);
      return [];
    }

    return data.properties || [];
  } catch (error) {
    console.error('Search properties exception:', error);
    return [];
  }
}

// Favorites API
export async function getFavorites(accessToken: string): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE}/favorites`, {
      headers: getAuthHeaders(accessToken),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Get favorites error:', data);
      return [];
    }

    return data.favorites || [];
  } catch (error) {
    console.error('Get favorites exception:', error);
    return [];
  }
}

export async function addFavorite(propertyId: string, accessToken: string): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE}/favorites/${propertyId}`, {
      method: 'POST',
      headers: getAuthHeaders(accessToken),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Add favorite error:', data);
      return [];
    }

    return data.favorites || [];
  } catch (error) {
    console.error('Add favorite exception:', error);
    return [];
  }
}

export async function removeFavorite(propertyId: string, accessToken: string): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE}/favorites/${propertyId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(accessToken),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Remove favorite error:', data);
      return [];
    }

    return data.favorites || [];
  } catch (error) {
    console.error('Remove favorite exception:', error);
    return [];
  }
}

// Bookings API
export async function getBookings(accessToken: string): Promise<Booking[]> {
  try {
    const response = await fetch(`${API_BASE}/bookings`, {
      headers: getAuthHeaders(accessToken),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Get bookings error:', data);
      return [];
    }

    return data.bookings || [];
  } catch (error) {
    console.error('Get bookings exception:', error);
    return [];
  }
}

export async function createBooking(
  bookingData: {
    propertyId: string;
    propertyTitle: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    total: number;
  },
  accessToken: string
): Promise<Booking | null> {
  try {
    const response = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: getAuthHeaders(accessToken),
      body: JSON.stringify(bookingData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Create booking error:', data);
      return null;
    }

    return data.booking;
  } catch (error) {
    console.error('Create booking exception:', error);
    return null;
  }
}

// Payment APIs
export async function createStripePaymentIntent(
  amount: number,
  currency: string,
  bookingId: string,
  accessToken: string
): Promise<{ clientSecret: string; paymentIntentId: string } | null> {
  try {
    const response = await fetch(`${API_BASE}/payments/stripe/create-intent`, {
      method: 'POST',
      headers: getAuthHeaders(accessToken),
      body: JSON.stringify({ amount, currency, bookingId }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Create Stripe payment intent error:', data);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Create Stripe payment intent exception:', error);
    return null;
  }
}

export async function verifyStripePayment(
  paymentIntentId: string,
  bookingId: string,
  accessToken: string
): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/payments/stripe/verify`, {
      method: 'POST',
      headers: getAuthHeaders(accessToken),
      body: JSON.stringify({ paymentIntentId, bookingId }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Verify Stripe payment error:', data);
      return false;
    }

    return data.success;
  } catch (error) {
    console.error('Verify Stripe payment exception:', error);
    return false;
  }
}

export async function initializePaystackPayment(
  amount: number,
  email: string,
  currency: string,
  bookingId: string,
  accessToken: string
): Promise<{ authorizationUrl: string; reference: string } | null> {
  try {
    const response = await fetch(`${API_BASE}/payments/paystack/initialize`, {
      method: 'POST',
      headers: getAuthHeaders(accessToken),
      body: JSON.stringify({ amount, email, currency, bookingId }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Initialize Paystack payment error:', data);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Initialize Paystack payment exception:', error);
    return null;
  }
}

export async function verifyPaystackPayment(
  reference: string,
  bookingId: string,
  accessToken: string
): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/payments/paystack/verify`, {
      method: 'POST',
      headers: getAuthHeaders(accessToken),
      body: JSON.stringify({ reference, bookingId }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Verify Paystack payment error:', data);
      return false;
    }

    return data.success;
  } catch (error) {
    console.error('Verify Paystack payment exception:', error);
    return false;
  }
}