import { Home, User, Heart, Menu, Globe, LogIn } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from './ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Country, countries } from '../App';
import { useAuth } from '../utils/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface HeaderProps {
  onLogoClick: () => void;
  onNavigate: (page: 'home' | 'explore' | 'favorites' | 'account') => void;
  selectedCountry: Country;
  onCountryChange: (country: Country) => void;
  favoritesCount: number;
  onAuthClick: () => void;
}

export function Header({ onLogoClick, onNavigate, selectedCountry, onCountryChange, favoritesCount, onAuthClick }: HeaderProps) {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={onLogoClick}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="h-9 w-9 bg-gradient-to-br from-teal-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Home className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl text-gray-900 hidden sm:inline">A&B Global Homes</span>
            <span className="text-xl text-gray-900 sm:hidden">A&B</span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            {/* Country Selector */}
            <Select
              value={selectedCountry.code}
              onValueChange={(code) => {
                const country = countries.find(c => c.code === code);
                if (country) onCountryChange(country);
              }}
            >
              <SelectTrigger className="w-[140px] gap-2">
                <Globe className="h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    <span className="flex items-center gap-2">
                      <span>{country.flag}</span>
                      <span>{country.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="ghost" onClick={() => onNavigate('explore')} className="gap-2">
              <Home className="h-4 w-4" />
              Explore
            </Button>
            <Button variant="ghost" onClick={() => onNavigate('favorites')} className="gap-2 relative">
              <Heart className="h-4 w-4" />
              Favorites
              {favoritesCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {favoritesCount}
                </Badge>
              )}
            </Button>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {user.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onNavigate('account')}>
                    <User className="mr-2 h-4 w-4" />
                    My Account
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={onAuthClick} className="gap-2">
                <LogIn className="h-4 w-4" />
                Sign In
              </Button>
            )}
          </nav>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <nav className="flex flex-col gap-4 mt-8">
                <div className="mb-4">
                  <label className="text-sm text-gray-600 mb-2 block">Country</label>
                  <Select
                    value={selectedCountry.code}
                    onValueChange={(code) => {
                      const country = countries.find(c => c.code === code);
                      if (country) onCountryChange(country);
                    }}
                  >
                    <SelectTrigger className="w-full gap-2">
                      <Globe className="h-4 w-4" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          <span className="flex items-center gap-2">
                            <span>{country.flag}</span>
                            <span>{country.name}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="ghost" onClick={() => onNavigate('explore')} className="justify-start gap-2">
                  <Home className="h-4 w-4" />
                  Explore
                </Button>
                <Button variant="ghost" onClick={() => onNavigate('favorites')} className="justify-start gap-2">
                  <Heart className="h-4 w-4" />
                  Favorites {favoritesCount > 0 && `(${favoritesCount})`}
                </Button>
                {user ? (
                  <>
                    <Button variant="ghost" onClick={() => onNavigate('account')} className="justify-start gap-2">
                      <User className="h-4 w-4" />
                      Account ({user.name})
                    </Button>
                    <Button variant="ghost" onClick={signOut} className="justify-start gap-2">
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <Button onClick={onAuthClick} className="justify-start gap-2">
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
