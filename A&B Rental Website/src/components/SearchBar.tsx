import { useState } from 'react';
import { Search, MapPin, Users, DollarSign } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import { Slider } from './ui/slider';

interface SearchBarProps {
  onSearch: (query: string, filters: { guests?: number; priceRange?: [number, number] }) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [location, setLocation] = useState('');
  const [guests, setGuests] = useState<number>(1);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  const handleSearch = () => {
    onSearch(location, { 
      guests: guests > 1 ? guests : undefined,
      priceRange: priceRange[0] > 0 || priceRange[1] < 1000 ? priceRange : undefined
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Location Search */}
      <div className="flex-1 relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Where are you going?"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="pl-10"
        />
      </div>

      {/* Guests Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2 justify-start min-w-[140px]">
            <Users className="h-4 w-4" />
            <span>{guests} {guests === 1 ? 'Guest' : 'Guests'}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm">Number of Guests</label>
              <div className="flex items-center gap-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                >
                  -
                </Button>
                <span className="flex-1 text-center">{guests}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setGuests(Math.min(16, guests + 1))}
                >
                  +
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Price Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2 justify-start min-w-[160px]">
            <DollarSign className="h-4 w-4" />
            <span>${priceRange[0]} - ${priceRange[1]}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm">Price Range (per night)</label>
              <Slider
                min={0}
                max={1000}
                step={50}
                value={priceRange}
                onValueChange={(value) => setPriceRange(value as [number, number])}
                className="mt-4"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Search Button */}
      <Button onClick={handleSearch} className="gap-2">
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Search</span>
      </Button>
    </div>
  );
}
