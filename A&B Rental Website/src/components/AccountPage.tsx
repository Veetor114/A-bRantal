import { UserProfile, Booking, Property } from '../App';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar, Heart, LogOut, Edit, CheckCircle, Clock, XCircle } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface AccountPageProps {
  profile: UserProfile;
  bookings: Booking[];
  favoriteProperties: Property[];
  onPropertyClick: (property: Property) => void;
}

export function AccountPage({ profile, bookings, favoriteProperties, onPropertyClick }: AccountPageProps) {
  const getStatusIcon = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <Avatar className="h-24 w-24 ring-4 ring-teal-100">
                <AvatarImage src={profile.avatar} />
                <AvatarFallback className="text-2xl">{profile.name[0]}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h1 className="text-gray-900 mb-1">{profile.name}</h1>
                <p className="text-gray-600 mb-2">{profile.email}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    {profile.country.flag} {profile.country.name}
                  </span>
                  <span>•</span>
                  <span>Member since {profile.joinedDate}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="gap-2">
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
                <Button variant="outline" className="gap-2 text-red-600 hover:text-red-700">
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Booking History */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Booking History
                </CardTitle>
                <CardDescription>
                  Your past and upcoming reservations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {bookings.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No bookings yet</p>
                  </div>
                ) : (
                  bookings.map((booking) => (
                    <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:border-teal-300 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-gray-900 mb-1">{booking.propertyTitle}</h3>
                          <p className="text-sm text-gray-600">
                            {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge className={getStatusColor(booking.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(booking.status)}
                            {booking.status}
                          </span>
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{booking.guests} guests</span>
                        <span className="text-gray-900">${booking.total.toFixed(2)}</span>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-500">
                          Booked on {new Date(booking.bookedDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Favorite Homes */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Favorite Homes
                </CardTitle>
                <CardDescription>
                  Properties you've saved for later
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {favoriteProperties.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Heart className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No favorites yet</p>
                  </div>
                ) : (
                  favoriteProperties.slice(0, 4).map((property) => (
                    <button
                      key={property.id}
                      onClick={() => onPropertyClick(property)}
                      className="w-full border border-gray-200 rounded-lg p-3 hover:border-teal-300 hover:shadow-md transition-all text-left"
                    >
                      <div className="flex gap-3">
                        <ImageWithFallback
                          src={property.images[0]}
                          alt={property.title}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-gray-900 truncate mb-1">{property.title}</h3>
                          <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
                            <span>{property.country.flag}</span>
                            {property.location}
                          </p>
                          <div className="flex items-center gap-3">
                            <Badge variant="secondary" className="text-xs">
                              ${property.price}/night
                            </Badge>
                            <span className="text-xs text-gray-500">★ {property.rating}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))
                )}
                {favoriteProperties.length > 4 && (
                  <Button variant="outline" className="w-full">
                    View All {favoriteProperties.length} Favorites
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Payment Methods Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>
              We support multiple payment options for your convenience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-gray-900 mb-2">International Payments</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Powered by Stripe - Available worldwide
                </p>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline">Visa</Badge>
                  <Badge variant="outline">Mastercard</Badge>
                  <Badge variant="outline">Amex</Badge>
                  <Badge variant="outline">Apple Pay</Badge>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-gray-900 mb-2">African Payments</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Powered by Paystack - For African users
                </p>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline">Bank Transfer</Badge>
                  <Badge variant="outline">Cards</Badge>
                  <Badge variant="outline">Mobile Money</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
