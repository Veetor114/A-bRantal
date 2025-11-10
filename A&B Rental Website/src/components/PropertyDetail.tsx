import { useState } from 'react';
import { Property, Country } from '../App';
import { ArrowLeft, Star, Users, BedDouble, Bath, MapPin, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Badge } from './ui/badge';
import { BookingPanel } from './BookingPanel';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface PropertyDetailProps {
  property: Property;
  onBack: () => void;
  selectedCountry: Country;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function PropertyDetail({ property, onBack, selectedCountry, isFavorite, onToggleFavorite }: PropertyDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const convertPrice = (priceUSD: number, targetCountry: Country) => {
    const converted = priceUSD * targetCountry.exchangeRate;
    return {
      amount: Math.round(converted),
      currency: targetCountry.currency,
      symbol: targetCountry.currency === 'USD' ? '$' : 
              targetCountry.currency === 'GBP' ? '£' :
              targetCountry.currency === 'NGN' ? '₦' :
              targetCountry.currency
    };
  };

  const displayPrice = convertPrice(property.price, selectedCountry);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="sticky top-16 z-40 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to properties
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h1 className="text-gray-900">{property.title}</h1>
            <Button
              size="icon"
              variant="outline"
              onClick={onToggleFavorite}
              className="flex-shrink-0"
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{property.rating}</span>
              <span className="text-gray-600">({property.reviews} reviews)</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <span className="text-xl mr-1">{property.country.flag}</span>
              <MapPin className="h-4 w-4" />
              {property.location}, {property.country.name}
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="mb-8 rounded-xl overflow-hidden relative group">
          <ImageWithFallback
            src={property.images[currentImageIndex]}
            alt={property.title}
            className="w-full aspect-[16/9] object-cover"
          />
          
          {property.images.length > 1 && (
            <>
              <Button
                size="icon"
                variant="ghost"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full h-10 w-10"
                onClick={prevImage}
              >
                <ChevronLeft className="h-5 w-5 text-gray-700" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full h-10 w-10"
                onClick={nextImage}
              >
                <ChevronRight className="h-5 w-5 text-gray-700" />
              </Button>

              {/* Image counter */}
              <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-lg text-sm">
                {currentImageIndex + 1} / {property.images.length}
              </div>

              {/* Thumbnail strip */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {property.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentImageIndex
                        ? 'w-8 bg-white'
                        : 'w-2 bg-white/60 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-gray-400" />
                  <span>{property.guests} guests</span>
                </div>
                <div className="flex items-center gap-2">
                  <BedDouble className="h-5 w-5 text-gray-400" />
                  <span>{property.bedrooms} bedrooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="h-5 w-5 text-gray-400" />
                  <span>{property.bathrooms} bathrooms</span>
                </div>
              </div>
              
              <div className="h-px bg-gray-200" />
              
              {/* Price Display */}
              <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg p-4">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl text-gray-900">
                    {displayPrice.symbol}{displayPrice.amount.toLocaleString()}
                  </span>
                  <span className="text-gray-600">per night</span>
                </div>
                {selectedCountry.code !== 'US' && (
                  <p className="text-sm text-gray-500">
                    Approximately ${property.price} USD
                  </p>
                )}
              </div>

              <div className="h-px bg-gray-200" />
              
              {/* Host Info */}
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 ring-2 ring-teal-100">
                  <AvatarImage src={property.host.avatar} />
                  <AvatarFallback>{property.host.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-gray-900">Hosted by {property.host.name}</p>
                  <p className="text-sm text-gray-600">Joined {property.host.joinedDate}</p>
                </div>
              </div>
            </div>

            <div className="h-px bg-gray-200" />

            {/* Description */}
            <div>
              <h2 className="text-gray-900 mb-3">About this place</h2>
              <p className="text-gray-700 leading-relaxed">{property.description}</p>
            </div>

            <div className="h-px bg-gray-200" />

            {/* Amenities */}
            <div>
              <h2 className="text-gray-900 mb-3">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((amenity) => (
                  <Badge key={amenity} variant="secondary" className="px-3 py-1">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="h-px bg-gray-200" />

            {/* Payment Info */}
            <div>
              <h2 className="text-gray-900 mb-3">Payment Options</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-gray-900 mb-2">Stripe (International)</h3>
                  <p className="text-sm text-gray-600">
                    Secure payment for global bookings
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-gray-900 mb-2">Paystack (Africa)</h3>
                  <p className="text-sm text-gray-600">
                    Local payment options for African users
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <BookingPanel property={property} selectedCountry={selectedCountry} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
