import { Property, Country } from '../App';
import { PropertyCard } from './PropertyCard';

interface PropertyGridProps {
  properties: Property[];
  onPropertyClick: (property: Property) => void;
  selectedCountry: Country;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export function PropertyGrid({ properties, onPropertyClick, selectedCountry, favorites, onToggleFavorite }: PropertyGridProps) {
  if (properties.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">No properties found. Try adjusting your search criteria.</p>
      </div>
    );
  }

  return (
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
  );
}
