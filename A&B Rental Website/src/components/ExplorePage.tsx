import { useState, useEffect } from 'react';
import { Property, Country } from '../App';
import { PropertyCard } from './PropertyCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { FilterPanel, FilterState } from './FilterPanel';
import * as api from '../utils/api';

interface ExplorePageProps {
  properties: Property[];
  onPropertyClick: (property: Property) => void;
  selectedCountry: Country;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export function ExplorePage({ properties, onPropertyClick, selectedCountry, favorites, onToggleFavorite }: ExplorePageProps) {
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(properties);
  const [filters, setFilters] = useState<FilterState>({
    country: undefined,
    minPrice: 0,
    maxPrice: 2000,
    guests: undefined,
    amenities: [],
  });

  // Update filtered properties when filters change
  useEffect(() => {
    applyFilters();
  }, [properties]);

  async function applyFilters() {
    // Apply filters via API search
    const result = await api.searchProperties({
      country: filters.country,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      guests: filters.guests,
      amenities: filters.amenities,
    });

    setFilteredProperties(result.length > 0 ? result : properties);
  }

  // Split properties into budget and luxury
  const budgetProperties = filteredProperties
    .filter(p => p.price < 400)
    .sort((a, b) => a.price - b.price);

  const luxuryProperties = filteredProperties
    .filter(p => p.price >= 400)
    .sort((a, b) => b.price - a.price);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-gray-900 mb-3">Explore Our Collection</h1>
          <p className="text-gray-600 text-lg">
            Find the perfect stay for your budget and style
          </p>
        </div>

        {/* Filter Panel */}
        <div className="flex justify-center mb-8">
          <FilterPanel
            filters={filters}
            onFiltersChange={setFilters}
            onApply={applyFilters}
          />
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="all">All Properties</TabsTrigger>
            <TabsTrigger value="budget">Budget Homes</TabsTrigger>
            <TabsTrigger value="luxury">Luxury Homes</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Budget Column */}
              <div className="space-y-6">
                <div className="sticky top-20 bg-white rounded-lg p-4 shadow-sm mb-4 z-10">
                  <h2 className="text-gray-900 flex items-center gap-2">
                    💰 Budget Homes
                    <span className="text-sm text-gray-500">({budgetProperties.length})</span>
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">Affordable stays under $400/night</p>
                </div>
                <div className="space-y-6">
                  {budgetProperties.map((property) => (
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
              </div>

              {/* Luxury Column */}
              <div className="space-y-6">
                <div className="sticky top-20 bg-white rounded-lg p-4 shadow-sm mb-4 z-10">
                  <h2 className="text-gray-900 flex items-center gap-2">
                    ✨ Luxury Homes
                    <span className="text-sm text-gray-500">({luxuryProperties.length})</span>
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">Premium stays $400+/night</p>
                </div>
                <div className="space-y-6">
                  {luxuryProperties.map((property) => (
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
              </div>
            </div>
          </TabsContent>

          <TabsContent value="budget" className="mt-0">
            <div className="mb-6">
              <h2 className="text-gray-900 mb-2">Budget-Friendly Homes</h2>
              <p className="text-gray-600">{budgetProperties.length} affordable properties sorted by price</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {budgetProperties.map((property) => (
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
          </TabsContent>

          <TabsContent value="luxury" className="mt-0">
            <div className="mb-6">
              <h2 className="text-gray-900 mb-2">Luxury Collection</h2>
              <p className="text-gray-600">{luxuryProperties.length} premium properties sorted by price</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {luxuryProperties.map((property) => (
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
