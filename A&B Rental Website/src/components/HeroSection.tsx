import { Search, MapPin, Calendar, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Country } from '../App';

interface HeroSectionProps {
  selectedCountry: Country;
  onCountryChange: (country: Country) => void;
  onExplore: () => void;
}

export function HeroSection({ selectedCountry, onCountryChange, onExplore }: HeroSectionProps) {
  return (
    <div className="relative bg-gradient-to-br from-teal-500 via-blue-600 to-purple-700 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1650869187977-fb5410fe454e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZXJvJTIwYmFja2dyb3VuZCUyMHRyYXZlbHxlbnwxfHx8fDE3NjIzMDg5OTF8MA&ixlib=rb-4.1.0&q=80&w=1080)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl mb-4 text-white">
            Find your next stay anywhere in the world 🌍
          </h1>
          <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
            Discover amazing homes in {selectedCountry.name} and beyond. Budget-friendly to luxury accommodations.
          </p>
        </div>

        {/* Search Form */}
        <div className="max-w-4xl mx-auto bg-[rgb(157,155,155)] rounded-2xl shadow-2xl p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <label className="block text-sm text-gray-600 mb-2">Where</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search destination"
                  className="pl-10 text-[rgb(0,0,0)]"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm text-gray-600 mb-2">Check-in</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="date"
                  className="pl-10 text-[rgb(0,0,0)]"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm text-gray-600 mb-2">Check-out</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="date"
                  className="pl-10 text-[rgb(0,0,0)]"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm text-gray-600 mb-2">Guests</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="number"
                  placeholder="1"
                  min="1"
                  className="pl-10 text-[rgb(0,0,0)]"
                />
              </div>
            </div>
          </div>

          <Button
            onClick={onExplore}
            size="lg"
            className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white gap-2"
          >
            <Search className="h-5 w-5" />
            Search Properties
          </Button>
        </div>

        {/* Featured Countries */}
        <div className="mt-12 text-center">
          <p className="text-white/80 mb-4">Popular destinations</p>
          <div className="flex flex-wrap justify-center gap-3">
            {['🇺🇸 USA', '🇬🇧 UK', '🇳🇬 Nigeria', '🇬🇭 Ghana', '🇿🇦 South Africa', '🇰🇪 Kenya'].map((country) => (
              <div
                key={country}
                className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm hover:bg-white/20 transition-colors cursor-pointer"
              >
                {country}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
