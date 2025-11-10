import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2.39.7";
import Stripe from "npm:stripe@14.11.0";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Helper to get user from token
async function getUserFromToken(authHeader: string | null) {
  if (!authHeader) return null;
  const token = authHeader.split(' ')[1];
  if (!token) return null;
  
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    console.log('Error getting user from token:', error);
    return null;
  }
  return user;
}

// Health check endpoint
app.get("/make-server-0fe65257/health", (c) => {
  return c.json({ status: "ok" });
});

// ========== AUTH ENDPOINTS ==========

// Sign up
app.post("/make-server-0fe65257/auth/signup", async (c) => {
  try {
    const { email, password, name, country } = await c.req.json();

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        name,
        country,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        joinedDate: new Date().toISOString()
      },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ user: data.user });
  } catch (error) {
    console.log('Signup exception:', error);
    return c.json({ error: 'Failed to create user' }, 500);
  }
});

// Sign in
app.post("/make-server-0fe65257/auth/signin", async (c) => {
  try {
    const { email, password } = await c.req.json();

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
    );

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log('Sign in error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ 
      session: data.session,
      user: data.user 
    });
  } catch (error) {
    console.log('Sign in exception:', error);
    return c.json({ error: 'Failed to sign in' }, 500);
  }
});

// Get current user profile
app.get("/make-server-0fe65257/auth/profile", async (c) => {
  const user = await getUserFromToken(c.req.header('Authorization'));
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  return c.json({ 
    id: user.id,
    email: user.email,
    name: user.user_metadata?.name,
    country: user.user_metadata?.country,
    avatar: user.user_metadata?.avatar,
    joinedDate: user.user_metadata?.joinedDate
  });
});

// Update profile
app.put("/make-server-0fe65257/auth/profile", async (c) => {
  const user = await getUserFromToken(c.req.header('Authorization'));
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { name, country } = await c.req.json();

    const { data, error } = await supabase.auth.admin.updateUserById(
      user.id,
      {
        user_metadata: {
          ...user.user_metadata,
          name,
          country
        }
      }
    );

    if (error) {
      console.log('Update profile error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ user: data.user });
  } catch (error) {
    console.log('Update profile exception:', error);
    return c.json({ error: 'Failed to update profile' }, 500);
  }
});

// ========== PROPERTIES ENDPOINTS ==========

// Initialize properties on server start (only if none exist)
const initProperties = async () => {
  const existing = await kv.get('properties');
  if (!existing || existing.length === 0) {
    console.log('Initializing properties...');
    // Properties will be initialized from the frontend
  }
};
initProperties().catch(console.error);

// Get all properties
app.get("/make-server-0fe65257/properties", async (c) => {
  try {
    const properties = await kv.get('properties');
    return c.json({ properties: properties || [] });
  } catch (error) {
    console.log('Get properties error:', error);
    return c.json({ error: 'Failed to get properties' }, 500);
  }
});

// Initialize properties (admin endpoint)
app.post("/make-server-0fe65257/properties/init", async (c) => {
  try {
    const { properties } = await c.req.json();
    await kv.set('properties', properties);
    return c.json({ success: true, count: properties.length });
  } catch (error) {
    console.log('Init properties error:', error);
    return c.json({ error: 'Failed to initialize properties' }, 500);
  }
});

// Get properties with filters
app.post("/make-server-0fe65257/properties/search", async (c) => {
  try {
    const { country, minPrice, maxPrice, guests, amenities } = await c.req.json();
    
    let properties = await kv.get('properties') || [];
    
    // Filter by country
    if (country) {
      properties = properties.filter((p: any) => p.country.code === country);
    }
    
    // Filter by price range
    if (minPrice !== undefined) {
      properties = properties.filter((p: any) => p.price >= minPrice);
    }
    if (maxPrice !== undefined) {
      properties = properties.filter((p: any) => p.price <= maxPrice);
    }
    
    // Filter by guests
    if (guests) {
      properties = properties.filter((p: any) => p.guests >= guests);
    }
    
    // Filter by amenities
    if (amenities && amenities.length > 0) {
      properties = properties.filter((p: any) => 
        amenities.every((amenity: string) => p.amenities.includes(amenity))
      );
    }
    
    return c.json({ properties });
  } catch (error) {
    console.log('Search properties error:', error);
    return c.json({ error: 'Failed to search properties' }, 500);
  }
});

// ========== FAVORITES ENDPOINTS ==========

// Get user favorites
app.get("/make-server-0fe65257/favorites", async (c) => {
  const user = await getUserFromToken(c.req.header('Authorization'));
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const favorites = await kv.get(`favorites:${user.id}`) || [];
    return c.json({ favorites });
  } catch (error) {
    console.log('Get favorites error:', error);
    return c.json({ error: 'Failed to get favorites' }, 500);
  }
});

// Add to favorites
app.post("/make-server-0fe65257/favorites/:propertyId", async (c) => {
  const user = await getUserFromToken(c.req.header('Authorization'));
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const propertyId = c.req.param('propertyId');
    const favorites = await kv.get(`favorites:${user.id}`) || [];
    
    if (!favorites.includes(propertyId)) {
      favorites.push(propertyId);
      await kv.set(`favorites:${user.id}`, favorites);
    }
    
    return c.json({ favorites });
  } catch (error) {
    console.log('Add favorite error:', error);
    return c.json({ error: 'Failed to add favorite' }, 500);
  }
});

// Remove from favorites
app.delete("/make-server-0fe65257/favorites/:propertyId", async (c) => {
  const user = await getUserFromToken(c.req.header('Authorization'));
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const propertyId = c.req.param('propertyId');
    let favorites = await kv.get(`favorites:${user.id}`) || [];
    favorites = favorites.filter((id: string) => id !== propertyId);
    await kv.set(`favorites:${user.id}`, favorites);
    
    return c.json({ favorites });
  } catch (error) {
    console.log('Remove favorite error:', error);
    return c.json({ error: 'Failed to remove favorite' }, 500);
  }
});

// ========== BOOKINGS ENDPOINTS ==========

// Get user bookings
app.get("/make-server-0fe65257/bookings", async (c) => {
  const user = await getUserFromToken(c.req.header('Authorization'));
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const bookings = await kv.get(`bookings:${user.id}`) || [];
    return c.json({ bookings });
  } catch (error) {
    console.log('Get bookings error:', error);
    return c.json({ error: 'Failed to get bookings' }, 500);
  }
});

// Create booking
app.post("/make-server-0fe65257/bookings", async (c) => {
  const user = await getUserFromToken(c.req.header('Authorization'));
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const bookingData = await c.req.json();
    const bookings = await kv.get(`bookings:${user.id}`) || [];
    
    const newBooking = {
      id: crypto.randomUUID(),
      userId: user.id,
      ...bookingData,
      bookedDate: new Date().toISOString(),
      status: 'pending'
    };
    
    bookings.push(newBooking);
    await kv.set(`bookings:${user.id}`, bookings);
    
    return c.json({ booking: newBooking });
  } catch (error) {
    console.log('Create booking error:', error);
    return c.json({ error: 'Failed to create booking' }, 500);
  }
});

// ========== PAYMENT ENDPOINTS ==========

// Create Stripe payment intent
app.post("/make-server-0fe65257/payments/stripe/create-intent", async (c) => {
  const user = await getUserFromToken(c.req.header('Authorization'));
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      return c.json({ error: 'Stripe not configured' }, 500);
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
    });

    const { amount, currency, bookingId } = await c.req.json();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      metadata: {
        userId: user.id,
        bookingId
      }
    });

    return c.json({ 
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.log('Stripe payment intent error:', error);
    return c.json({ error: 'Failed to create payment intent' }, 500);
  }
});

// Verify Stripe payment
app.post("/make-server-0fe65257/payments/stripe/verify", async (c) => {
  const user = await getUserFromToken(c.req.header('Authorization'));
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const { paymentIntentId, bookingId } = await c.req.json();

    // Update booking status to confirmed
    const bookings = await kv.get(`bookings:${user.id}`) || [];
    const booking = bookings.find((b: any) => b.id === bookingId);
    
    if (booking) {
      booking.status = 'confirmed';
      booking.paymentIntentId = paymentIntentId;
      await kv.set(`bookings:${user.id}`, bookings);
    }

    return c.json({ success: true, booking });
  } catch (error) {
    console.log('Verify Stripe payment error:', error);
    return c.json({ error: 'Failed to verify payment' }, 500);
  }
});

// Initialize Paystack payment
app.post("/make-server-0fe65257/payments/paystack/initialize", async (c) => {
  const user = await getUserFromToken(c.req.header('Authorization'));
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const paystackKey = Deno.env.get('PAYSTACK_SECRET_KEY');
    if (!paystackKey) {
      return c.json({ error: 'Paystack not configured' }, 500);
    }

    const { amount, email, bookingId, currency } = await c.req.json();

    // Convert amount to smallest currency unit (kobo for NGN, pesewas for GHS, etc.)
    const amountInMinorUnits = Math.round(amount * 100);

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${paystackKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amountInMinorUnits,
        email,
        currency: currency.toUpperCase(),
        metadata: {
          userId: user.id,
          bookingId
        }
      })
    });

    const data = await response.json();

    if (!data.status) {
      console.log('Paystack initialization error:', data);
      return c.json({ error: data.message || 'Failed to initialize payment' }, 400);
    }

    return c.json({ 
      authorizationUrl: data.data.authorization_url,
      reference: data.data.reference
    });
  } catch (error) {
    console.log('Paystack initialization exception:', error);
    return c.json({ error: 'Failed to initialize payment' }, 500);
  }
});

// Verify Paystack payment
app.post("/make-server-0fe65257/payments/paystack/verify", async (c) => {
  const user = await getUserFromToken(c.req.header('Authorization'));
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const paystackKey = Deno.env.get('PAYSTACK_SECRET_KEY');
    if (!paystackKey) {
      return c.json({ error: 'Paystack not configured' }, 500);
    }

    const { reference, bookingId } = await c.req.json();

    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        'Authorization': `Bearer ${paystackKey}`,
      }
    });

    const data = await response.json();

    if (data.status && data.data.status === 'success') {
      // Update booking status to confirmed
      const bookings = await kv.get(`bookings:${user.id}`) || [];
      const booking = bookings.find((b: any) => b.id === bookingId);
      
      if (booking) {
        booking.status = 'confirmed';
        booking.paystackReference = reference;
        await kv.set(`bookings:${user.id}`, bookings);
      }

      return c.json({ success: true, booking });
    } else {
      return c.json({ error: 'Payment verification failed' }, 400);
    }
  } catch (error) {
    console.log('Verify Paystack payment error:', error);
    return c.json({ error: 'Failed to verify payment' }, 500);
  }
});

Deno.serve(app.fetch);
