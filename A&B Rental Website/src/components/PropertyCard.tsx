import { useState } from 'react';
import { Property, Country } from '../App';
import { Star, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface PropertyCardProps {
  property: Property;
  onClick: () => void;
  selectedCountry: Country;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function PropertyCard({ property, onClick, selectedCountry, isFavorite, onToggleFavorite }: PropertyCardProps) {
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

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  return (
    <div className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      {/* Image Carousel */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <div className="relative w-full h-full" onClick={onClick}>
          <ImageWithFallback
            src={property.images[currentImageIndex]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Country Flag Badge */}
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg">
            <span className="text-xl">{property.country.flag}</span>
          </div>

          {/* Image Navigation Arrows */}
          {property.images.length > 1 && (
            <>
              <Button
                size="icon"
                variant="ghost"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={prevImage}
              >
                <ChevronLeft className="h-4 w-4 text-gray-700" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={nextImage}
              >
                <ChevronRight className="h-4 w-4 text-gray-700" />
              </Button>

              {/* Image Dots Indicator */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {property.images.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 rounded-full transition-all ${
                      index === currentImageIndex
                        ? 'w-6 bg-white'
                        : 'w-1.5 bg-white/60'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Favorite Button */}
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-3 right-3 bg-white/90 hover:bg-white rounded-full z-10"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
        >
          <Heart className={`h-4 w-4 transition-all ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} />
        </Button>
      </div>

      {/* Content */}
      <div className="p-4" onClick={onClick}>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-gray-900 line-clamp-1">{property.title}</h3>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm">{property.rating}</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-3 flex items-center gap-1">
          <span>{property.country.flag}</span>
          {property.location}
        </p>

        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-gray-900">{displayPrice.symbol}{displayPrice.amount.toLocaleString()}</span>
            <span className="text-gray-600 text-sm"> / night</span>
          </div>
          {selectedCountry.code !== 'US' && (
            <span className="text-xs text-gray-500">(${property.price} USD)</span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-500 text-sm">{property.reviews} reviews</span>
          <Button
            size="sm"
            className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
}
