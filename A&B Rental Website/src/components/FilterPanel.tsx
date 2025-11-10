import { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Slider } from './ui/slider';
import { SlidersHorizontal } from 'lucide-react';
import { countries } from '../App';

export type FilterState = {
  country?: string;
  minPrice: number;
  maxPrice: number;
  guests?: number;
  amenities: string[];
};

type FilterPanelProps = {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onApply: () => void;
};

const amenitiesList = [
  'WiFi',
  'Kitchen',
  'Pool',
  'Parking',
  'Air Conditioning',
  'Heating',
  'Workspace',
  'TV',
  'Gym',
  'Beach Access',
  'Mountain View',
  'Ocean View',
  'City View',
  'Hot Tub',
  'BBQ',
  'Fireplace',
];

export function FilterPanel({ filters, onFiltersChange, onApply }: FilterPanelProps) {
  const [open, setOpen] = useState(false);

  const handlePriceChange = (values: number[]) => {
    onFiltersChange({
      ...filters,
      minPrice: values[0],
      maxPrice: values[1],
    });
  };

  const handleAmenityToggle = (amenity: string, checked: boolean) => {
    const newAmenities = checked
      ? [...filters.amenities, amenity]
      : filters.amenities.filter((a) => a !== amenity);
    
    onFiltersChange({
      ...filters,
      amenities: newAmenities,
    });
  };

  const handleReset = () => {
    onFiltersChange({
      country: undefined,
      minPrice: 0,
      maxPrice: 2000,
      guests: undefined,
      amenities: [],
    });
  };

  const handleApply = () => {
    onApply();
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {(filters.country || filters.guests || filters.amenities.length > 0) && (
            <span className="ml-1 bg-blue-600 text-white rounded-full px-2 py-0.5 text-xs">
              {[
                filters.country ? 1 : 0,
                filters.guests ? 1 : 0,
                filters.amenities.length > 0 ? 1 : 0,
              ].reduce((a, b) => a + b, 0)}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filter Properties</SheetTitle>
          <SheetDescription>
            Refine your search with filters below
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Country Filter */}
          <div className="space-y-2">
            <Label>Country</Label>
            <Select
              value={filters.country || 'all'}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  country: value === 'all' ? undefined : value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Countries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.flag} {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-3">
            <Label>Price Range (per night)</Label>
            <div className="px-2">
              <Slider
                min={0}
                max={2000}
                step={50}
                value={[filters.minPrice, filters.maxPrice]}
                onValueChange={handlePriceChange}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>${filters.minPrice}</span>
              <span>${filters.maxPrice}+</span>
            </div>
          </div>

          {/* Guests Filter */}
          <div className="space-y-2">
            <Label>Number of Guests</Label>
            <Select
              value={filters.guests?.toString() || 'any'}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  guests: value === 'any' ? undefined : parseInt(value),
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="1">1 Guest</SelectItem>
                <SelectItem value="2">2 Guests</SelectItem>
                <SelectItem value="4">4 Guests</SelectItem>
                <SelectItem value="6">6 Guests</SelectItem>
                <SelectItem value="8">8+ Guests</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Amenities Filter */}
          <div className="space-y-3">
            <Label>Amenities</Label>
            <div className="grid grid-cols-2 gap-3">
              {amenitiesList.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox
                    id={amenity}
                    checked={filters.amenities.includes(amenity)}
                    onCheckedChange={(checked) =>
                      handleAmenityToggle(amenity, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={amenity}
                    className="text-sm cursor-pointer select-none"
                  >
                    {amenity}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <Button variant="outline" className="flex-1" onClick={handleReset}>
            Reset
          </Button>
          <Button className="flex-1" onClick={handleApply}>
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
