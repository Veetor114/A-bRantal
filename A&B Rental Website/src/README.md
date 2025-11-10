# A&B Rental Platform 🏠

A modern, full-featured vacation rental platform similar to Airbnb, built with React, TypeScript, and Supabase. Find and book amazing homes worldwide with integrated AI assistance, multi-currency support, and secure payments.

## ✨ Features

- 🌍 **Multi-Country Support** - Browse properties in USA, UK, Nigeria, Ghana, South Africa, and Kenya
- 💱 **Currency Conversion** - Automatic currency conversion based on selected country
- 💳 **Dual Payment Gateways** - Stripe for international payments, Paystack for African markets
- 🤖 **AI Voice Assistant** - Integrated Vapi AI for voice-based customer support and booking assistance
- ❤️ **Favorites System** - Save and manage your favorite properties
- 👤 **User Authentication** - Secure sign-up and login with Supabase Auth
- 📱 **Responsive Design** - Optimized for mobile, tablet, and desktop
- 🔍 **Advanced Filtering** - Filter by budget, luxury, amenities, location, and more
- 📊 **Booking Management** - Track and manage all your bookings in one place

## 🚀 Live Demo

Visit: [Your Vercel URL will be here]

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Backend**: Supabase (Auth, Database, Edge Functions)
- **Payments**: Stripe + Paystack
- **AI Assistant**: Vapi AI
- **Icons**: Lucide React
- **Hosting**: Vercel

## 📋 Prerequisites

- Node.js 18+ installed
- Supabase account
- Stripe account (for international payments)
- Paystack account (for African payments)
- Vapi AI account (for voice assistant)

## 🔧 Environment Variables

The following environment variables are configured in your Supabase Edge Function:

```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
STRIPE_SECRET_KEY=your_stripe_secret_key
PAYSTACK_SECRET_KEY=your_paystack_secret_key
```

## 📦 Installation & Deployment to Vercel

### Step 1: Clone or Download Your Project

If you haven't already, ensure your project files are in a GitHub repository.

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New Project"
3. Import your repository
4. Vercel will auto-detect Vite configuration
5. Click "Deploy"

### Step 3: Configure Environment Variables (if needed)

If you need any frontend environment variables:
1. Go to your project settings in Vercel
2. Navigate to "Environment Variables"
3. Add any required variables

### Step 4: Deploy Your Supabase Edge Functions

The backend server needs to be deployed to Supabase:

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Deploy the edge function
supabase functions deploy make-server-0fe65257
```

## 🎯 Key Features Explained

### Payment Integration
- **Stripe**: Used for USA, UK, and international payments
- **Paystack**: Used for Nigeria, Ghana, South Africa, and Kenya
- Automatic gateway selection based on user's country

### AI Voice Assistant
- Powered by Vapi AI
- Handles property searches, bookings, and customer support
- Can transfer calls to human agents when requested

### Multi-Currency System
- Prices stored in USD as base currency
- Real-time conversion based on selected country
- Display prices in local currency (NGN, GHS, ZAR, KES, GBP)

## 📱 Pages & Routes

- **Home** - Hero section with featured properties
- **Explore** - Browse all properties with filters (Budget/Luxury)
- **Favorites** - View saved properties
- **Account** - Manage profile and bookings
- **Property Details** - View property information and book

## 🔐 Authentication Flow

1. Users can sign up with email/password
2. Supabase handles authentication
3. User metadata includes name, country, and avatar
4. Session management with access tokens

## 💳 Payment Flow

### Stripe (International)
1. User initiates booking
2. Stripe Payment Intent created on backend
3. Stripe Elements loads for card input
4. Payment confirmed with 3D Secure
5. Booking status updated to "confirmed"

### Paystack (African Markets)
1. User initiates booking
2. Paystack transaction initialized on backend
3. User redirected to Paystack payment page
4. Payment verified via webhook/callback
5. Booking status updated to "confirmed"

## 🏗️ Project Structure

```
/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── Header.tsx
│   ├── PropertyCard.tsx
│   ├── PaymentDialog.tsx
│   └── ...
├── utils/              # Utility functions
│   ├── api.tsx         # API calls
│   ├── auth.tsx        # Auth context
│   └── supabase/       # Supabase config
├── supabase/
│   └── functions/
│       └── server/     # Edge function
├── styles/
│   └── globals.css     # Global styles
├── App.tsx             # Main app component
├── main.tsx            # Entry point
└── index.html          # HTML template
```

## 🧪 Testing Payments

### Stripe Test Cards
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Any future expiry date and CVC

### Paystack Test Cards
Refer to [Paystack Test Cards](https://paystack.com/docs/payments/test-payments)

## 📞 Support

For issues or questions:
- Check the console for detailed error logs
- Verify all environment variables are set
- Ensure Supabase Edge Function is deployed

## 📄 License

This project is private and proprietary.

## 🙏 Acknowledgments

- Built with Figma Make
- UI components from shadcn/ui
- Images from Unsplash
- Icons from Lucide
