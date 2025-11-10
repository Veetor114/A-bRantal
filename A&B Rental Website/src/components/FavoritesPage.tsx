import { Property, Country } from '../App';
import { PropertyCard } from './PropertyCard';
import { Heart } from 'lucide-react';

interface FavoritesPageProps {
  properties: Property[];
  onPropertyClick: (property: Property) => void;
  selectedCountry: Country;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export function FavoritesPage({ properties, onPropertyClick, selectedCountry, favorites, onToggleFavorite }: FavoritesPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
              <Heart className="h-6 w-6 text-red-500 fill-red-500" />
            </div>
            <div>
              <h1 className="text-gray-900">Your Favorites</h1>
              <p className="text-gray-600">
                {properties.length === 0
                  ? 'No favorites yet. Start exploring and save properties you love!'
                  : `${properties.length} ${properties.length === 1 ? 'property' : 'properties'} saved`}
              </p>
            </div>
          </div>
        </div>

        {properties.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-gray-900 mb-2">No favorites yet</h3>
            <p className="text-gray-600">
              Click the heart icon on any property to save it here
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onClick={() => onPropertyClick(property)}
                selectedCountry={selectedCountry}
                isFavorite={favorites.includes(property.id)}
                onToggleFavorite={() => onToggleFavorite(property.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
