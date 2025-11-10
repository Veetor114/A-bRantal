import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { PropertyGrid } from './components/PropertyGrid';
import { PropertyDetail } from './components/PropertyDetail';
import { ExplorePage } from './components/ExplorePage';
import { FavoritesPage } from './components/FavoritesPage';
import { AccountPage } from './components/AccountPage';
import { AuthDialog } from './components/AuthDialog';
import { Footer } from './components/Footer';
import { VapiWidget } from './components/VapiWidget';
import { PaymentCallback } from './components/PaymentCallback';
import { Button } from './components/ui/button';
import { AuthProvider, useAuth } from './utils/auth';
import * as api from './utils/api';
import { toast } from 'sonner@2.0.3';
import { Toaster } from './components/ui/sonner';

export type Country = {
  code: string;
  name: string;
  flag: string;
  currency: string;
  exchangeRate: number; // Rate to USD
};

export type Property = {
  id: string;
  title: string;
  location: string;
  country: Country;
  price: number; // Always stored in USD
  rating: number;
  reviews: number;
  images: string[];
  guests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  description: string;
  host: {
    name: string;
    avatar: string;
    joinedDate: string;
  };
};

export type Booking = {
  id: string;
  propertyId: string;
  propertyTitle: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  total: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  bookedDate: string;
};

export type UserProfile = {
  name: string;
  email: string;
  country: Country;
  avatar: string;
  joinedDate: string;
};

export const countries: Country[] = [
  { code: 'US', name: 'USA', flag: '🇺🇸', currency: 'USD', exchangeRate: 1 },
  { code: 'GB', name: 'UK', flag: '🇬🇧', currency: 'GBP', exchangeRate: 0.79 },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', currency: 'NGN', exchangeRate: 1580 },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', currency: 'GHS', exchangeRate: 15.5 },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', currency: 'ZAR', exchangeRate: 18.5 },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', currency: 'KES', exchangeRate: 129 },
];

export const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Modern Downtown Loft',
    location: 'New York, NY',
    country: countries[0],
    price: 289,
    rating: 4.9,
    reviews: 127,
    images: [
      'https://images.unsplash.com/photo-1664159302000-cef53d678f4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwbG9mdCUyMGFwYXJ0bWVudHxlbnwxfHx8fDE3NjIyNTYxODV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1638454668466-e8dbd5462f20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjIyODk2MDN8MA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    amenities: ['WiFi', 'Kitchen', 'Workspace', 'City View', 'Gym'],
    description: 'Stunning modern loft in the heart of downtown with panoramic city views. Perfect for professionals and couples.',
    host: {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      joinedDate: 'January 2020'
    }
  },
  {
    id: '2',
    title: 'Beachfront Paradise Villa',
    location: 'Malibu, CA',
    country: countries[0],
    price: 650,
    rating: 5.0,
    reviews: 89,
    images: [
      'https://images.unsplash.com/photo-1601019404210-8bb5dd3ab015?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMGhvdXNlJTIwdmFjYXRpb258ZW58MXx8fHwxNzYyMTgwNjkxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1651108066220-f61c22fc281f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWxsYSUyMHBvb2x8ZW58MXx8fHwxNzYyMjg1MjYwfDA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    guests: 8,
    bedrooms: 4,
    bathrooms: 3,
    amenities: ['Beach Access', 'Pool', 'BBQ', 'Ocean View', 'Parking'],
    description: 'Luxury beachfront villa with direct beach access, private pool, and breathtaking ocean views. Perfect for family gatherings.',
    host: {
      name: 'Michael Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      joinedDate: 'March 2019'
    }
  },
  {
    id: '3',
    title: 'Cozy Mountain Cabin',
    location: 'Aspen, CO',
    country: countries[0],
    price: 425,
    rating: 4.8,
    reviews: 156,
    images: [
      'https://images.unsplash.com/photo-1482192505345-5655af888cc4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGNhYmlufGVufDF8fHx8MTc2MjI3OTU5Nnww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3VzZSUyMGV4dGVyaW9yfGVufDF8fHx8MTc2MjMwMjM4N3ww&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    guests: 6,
    bedrooms: 3,
    bathrooms: 2,
    amenities: ['Fireplace', 'Hot Tub', 'Mountain View', 'Ski-in/Ski-out', 'Heating'],
    description: 'Charming cabin nestled in the mountains with stunning views, perfect for winter getaways and outdoor enthusiasts.',
    host: {
      name: 'Emma Williams',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      joinedDate: 'June 2018'
    }
  },
  {
    id: '4',
    title: 'Luxury Hillside Estate',
    location: 'Los Angeles, CA',
    country: countries[0],
    price: 890,
    rating: 4.9,
    reviews: 203,
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3VzZSUyMGV4dGVyaW9yfGVufDF8fHx8MTc2MjMwMjM4N3ww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1617905877040-6c61b7d77e06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB2YWNhdGlvbiUyMGhvbWV8ZW58MXx8fHwxNzYyMjQ4ODQxfDA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    guests: 10,
    bedrooms: 5,
    bathrooms: 4,
    amenities: ['Pool', 'Cinema', 'Wine Cellar', 'Gym', 'Smart Home'],
    description: 'Spectacular modern estate with infinity pool, home theater, and panoramic city views. Ultimate luxury experience.',
    host: {
      name: 'David Martinez',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      joinedDate: 'September 2017'
    }
  },
  {
    id: '5',
    title: 'Chic Urban Apartment',
    location: 'San Francisco, CA',
    country: countries[0],
    price: 195,
    rating: 4.7,
    reviews: 94,
    images: [
      'https://images.unsplash.com/photo-1638454668466-e8dbd5462f20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjIyODk2MDN8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1664159302000-cef53d678f4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwbG9mdCUyMGFwYXJ0bWVudHxlbnwxfHx8fDE3NjIyNTYxODV8MA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ['WiFi', 'Kitchen', 'Balcony', 'Workspace', 'Laundry'],
    description: 'Stylish apartment in vibrant neighborhood, perfect for solo travelers and couples exploring the city.',
    host: {
      name: 'Lisa Anderson',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      joinedDate: 'February 2021'
    }
  },
  {
    id: '6',
    title: 'Tropical Pool Villa',
    location: 'Miami, FL',
    country: countries[0],
    price: 575,
    rating: 4.9,
    reviews: 167,
    images: [
      'https://images.unsplash.com/photo-1651108066220-f61c22fc281f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWxsYSUyMHBvb2x8ZW58MXx8fHwxNzYyMjg1MjYwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1601019404210-8bb5dd3ab015?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMGhvdXNlJTIwdmFjYXRpb258ZW58MXx8fHwxNzYyMTgwNjkxfDA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    guests: 8,
    bedrooms: 4,
    bathrooms: 3,
    amenities: ['Private Pool', 'BBQ', 'Outdoor Dining', 'Smart TV', 'AC'],
    description: 'Beautiful tropical villa with private pool and outdoor entertainment area. Perfect for groups and families.',
    host: {
      name: 'James Thompson',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      joinedDate: 'May 2019'
    }
  },
  {
    id: '7',
    title: 'Lagos Modern Villa',
    location: 'Victoria Island, Lagos',
    country: countries[2],
    price: 180,
    rating: 4.8,
    reviews: 76,
    images: [
      'https://images.unsplash.com/photo-1648840887119-a9d33c964054?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdlcmlhJTIwbW9kZXJuJTIwaG91c2V8ZW58MXx8fHwxNzYyMzA4OTkwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3VzZSUyMGV4dGVyaW9yfGVufDF8fHx8MTc2MjMwMjM4N3ww&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    guests: 6,
    bedrooms: 3,
    bathrooms: 2,
    amenities: ['WiFi', 'Generator', 'AC', 'Security', 'Parking'],
    description: 'Contemporary villa in the heart of Lagos. Ideal for business travelers and families.',
    host: {
      name: 'Chioma Okafor',
      avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150',
      joinedDate: 'July 2020'
    }
  },
  {
    id: '8',
    title: 'London Luxury Apartment',
    location: 'Kensington, London',
    country: countries[1],
    price: 450,
    rating: 4.9,
    reviews: 142,
    images: [
      'https://images.unsplash.com/photo-1633694705199-bc1e0a87c97a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb25kb24lMjBhcGFydG1lbnR8ZW58MXx8fHwxNzYyMzA4OTkwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1638454668466-e8dbd5462f20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjIyODk2MDN8MA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    amenities: ['WiFi', 'Heating', 'Kitchen', 'Workspace', 'Gym Access'],
    description: 'Elegant apartment in prestigious Kensington with classic British charm and modern amenities.',
    host: {
      name: 'Oliver Smith',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
      joinedDate: 'April 2019'
    }
  },
  {
    id: '9',
    title: 'Accra Beach House',
    location: 'Labadi, Accra',
    country: countries[3],
    price: 220,
    rating: 4.7,
    reviews: 58,
    images: [
      'https://images.unsplash.com/photo-1617119541786-ee11c1931310?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnaGFuYSUyMGhvbWV8ZW58MXx8fHwxNzYyMzA4OTkwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1601019404210-8bb5dd3ab015?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMGhvdXNlJTIwdmFjYXRpb258ZW58MXx8fHwxNzYyMTgwNjkxfDA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    guests: 5,
    bedrooms: 3,
    bathrooms: 2,
    amenities: ['Beach Access', 'WiFi', 'AC', 'BBQ', 'Parking'],
    description: 'Charming beachfront property with stunning ocean views. Perfect for relaxation and coastal adventures.',
    host: {
      name: 'Kwame Mensah',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
      joinedDate: 'November 2020'
    }
  },
  {
    id: '10',
    title: 'Budget Studio Downtown',
    location: 'Austin, TX',
    country: countries[0],
    price: 89,
    rating: 4.5,
    reviews: 112,
    images: [
      'https://images.unsplash.com/photo-1638454668466-e8dbd5462f20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjIyODk2MDN8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1664159302000-cef53d678f4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwbG9mdCUyMGFwYXJ0bWVudHxlbnwxfHx8fDE3NjIyNTYxODV8MA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ['WiFi', 'Kitchen', 'AC', 'Workspace'],
    description: 'Affordable and cozy studio perfect for solo travelers and budget-conscious guests.',
    host: {
      name: 'Jessica Lee',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      joinedDate: 'January 2022'
    }
  }
];

function AppContent() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState<'home' | 'explore' | 'favorites' | 'account'>('home');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPaymentCallback, setShowPaymentCallback] = useState(false);

  // Check for payment callback on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('reference')) {
      setShowPaymentCallback(true);
    }
  }, []);

  // Load data on mount and when user changes
  useEffect(() => {
    loadData();
  }, [user]);

  async function loadData() {
    setLoading(true);
    try {
      // First, test backend connectivity
      console.log('Testing backend connection...');
      const backendOnline = await api.testBackendConnection();
      
      if (!backendOnline) {
        console.warn('Backend is not responding. Using mock data only.');
        toast.error('Unable to connect to server. Using offline mode.');
        setProperties(mockProperties);
        setLoading(false);
        return;
      }

      // Load properties
      const props = await api.getProperties();
      if (props.length > 0) {
        setProperties(props);
      } else {
        // Initialize with mock data if no properties exist
        console.log('Initializing properties with mock data...');
        const success = await api.initializeProperties(mockProperties);
        if (success) {
          setProperties(mockProperties);
        } else {
          console.warn('Failed to initialize properties on server, using mock data');
          setProperties(mockProperties);
        }
      }

      // Load user-specific data if logged in
      if (user) {
        const [favs, books] = await Promise.all([
          api.getFavorites(user.accessToken),
          api.getBookings(user.accessToken),
        ]);
        setFavorites(favs);
        setBookings(books);
      } else {
        // Load favorites from localStorage for non-logged in users
        const saved = localStorage.getItem('favorites');
        if (saved) {
          setFavorites(JSON.parse(saved));
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data. Using offline mode.');
      setProperties(mockProperties);
    } finally {
      setLoading(false);
    }
  }

  // Save favorites to localStorage for non-logged in users
  useEffect(() => {
    if (!user) {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  }, [favorites, user]);

  const toggleFavorite = async (propertyId: string) => {
    if (!user) {
      // For non-logged in users, just update local state
      setFavorites(prev =>
        prev.includes(propertyId)
          ? prev.filter(id => id !== propertyId)
          : [...prev, propertyId]
      );
      toast.success(
        favorites.includes(propertyId) ? 'Removed from favorites' : 'Added to favorites'
      );
      return;
    }

    try {
      const isCurrentlyFavorite = favorites.includes(propertyId);
      
      if (isCurrentlyFavorite) {
        const newFavorites = await api.removeFavorite(propertyId, user.accessToken);
        setFavorites(newFavorites);
        toast.success('Removed from favorites');
      } else {
        const newFavorites = await api.addFavorite(propertyId, user.accessToken);
        setFavorites(newFavorites);
        toast.success('Added to favorites');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites');
    }
  };

  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
    setCurrentPage('home');
  };

  const favoriteProperties = properties.filter(p => favorites.includes(p.id));

  // Get user profile
  const userProfile: UserProfile | undefined = user ? {
    name: user.name,
    email: user.email,
    country: countries.find(c => c.code === user.country) || countries[0],
    avatar: user.avatar,
    joinedDate: new Date(user.joinedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  } : undefined;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      <Header
        onLogoClick={() => {
          setSelectedProperty(null);
          setCurrentPage('home');
        }}
        onNavigate={setCurrentPage}
        selectedCountry={selectedCountry}
        onCountryChange={setSelectedCountry}
        favoritesCount={favorites.length}
        onAuthClick={() => setShowAuthDialog(true)}
      />

      <main className="pb-24">
        {selectedProperty ? (
          <PropertyDetail
            property={selectedProperty}
            onBack={() => setSelectedProperty(null)}
            selectedCountry={selectedCountry}
            isFavorite={favorites.includes(selectedProperty.id)}
            onToggleFavorite={() => toggleFavorite(selectedProperty.id)}
          />
        ) : currentPage === 'home' ? (
          <>
            <HeroSection
              selectedCountry={selectedCountry}
              onCountryChange={setSelectedCountry}
              onExplore={() => setCurrentPage('explore')}
            />
            <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
              <h2 className="text-gray-900 mb-2">Featured Properties</h2>
              <p className="text-gray-600 mb-8">Discover our handpicked selection of amazing homes</p>
              <PropertyGrid
                properties={properties.slice(0, 6)}
                onPropertyClick={handlePropertySelect}
                selectedCountry={selectedCountry}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
              />
            </div>
          </>
        ) : currentPage === 'explore' ? (
          <ExplorePage
            properties={properties}
            onPropertyClick={handlePropertySelect}
            selectedCountry={selectedCountry}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        ) : currentPage === 'favorites' ? (
          <FavoritesPage
            properties={favoriteProperties}
            onPropertyClick={handlePropertySelect}
            selectedCountry={selectedCountry}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        ) : currentPage === 'account' ? (
          userProfile ? (
            <AccountPage
              profile={userProfile}
              bookings={bookings}
              favoriteProperties={favoriteProperties}
              onPropertyClick={handlePropertySelect}
            />
          ) : (
            <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
              <div className="text-center py-16">
                <h2 className="text-gray-900 mb-4">Sign in to access your account</h2>
                <p className="text-gray-600 mb-8">View your bookings, manage favorites, and update your profile</p>
                <Button onClick={() => setShowAuthDialog(true)}>Sign In</Button>
              </div>
            </div>
          )
        ) : null}
      </main>

      {/* Auth Dialog */}
      <AuthDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
      />

      {/* Footer */}
      <Footer />

      {/* Vapi Voice Widget */}
      <VapiWidget />

      {/* Payment Callback */}
      {showPaymentCallback && (
        <PaymentCallback onComplete={() => {
          setShowPaymentCallback(false);
          loadData(); // Reload data to show updated booking
        }} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}