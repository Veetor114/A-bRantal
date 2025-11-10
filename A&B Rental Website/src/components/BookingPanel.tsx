import { useState } from 'react';
import { Property, Country } from '../App';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar as CalendarIcon, Users, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from './ui/badge';

interface BookingPanelProps {
  property: Property;
  selectedCountry: Country;
}

export function BookingPanel({ property, selectedCountry }: BookingPanelProps) {
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState(1);
  const [isBooked, setIsBooked] = useState(false);

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

  const nights = checkIn && checkOut 
    ? Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const subtotalUSD = nights * property.price;
  const serviceFeeUSD = subtotalUSD * 0.12;
  const totalUSD = subtotalUSD + serviceFeeUSD;

  const subtotal = convertPrice(subtotalUSD, selectedCountry);
  const serviceFee = convertPrice(serviceFeeUSD, selectedCountry);
  const total = convertPrice(totalUSD, selectedCountry);

  // Determine payment method based on country
  const paymentMethod = ['NG', 'GH', 'ZA', 'KE'].includes(selectedCountry.code) ? 'Paystack' : 'Stripe';

  const handleBooking = () => {
    setIsBooked(true);
    setTimeout(() => setIsBooked(false), 3000);
  };

  return (
    <div className="border border-gray-200 rounded-xl p-6 shadow-lg bg-white">
      <div className="mb-6">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-2xl text-gray-900">
            {displayPrice.symbol}{displayPrice.amount.toLocaleString()}
          </span>
          <span className="text-gray-600">/ night</span>
        </div>
        {selectedCountry.code !== 'US' && (
          <p className="text-sm text-gray-500">≈ ${property.price} USD</p>
        )}
      </div>

      <div className="space-y-4 mb-6">
        {/* Check-in */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start gap-2">
              <CalendarIcon className="h-4 w-4" />
              {checkIn ? format(checkIn, 'MMM dd, yyyy') : 'Check-in'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={checkIn}
              onSelect={setCheckIn}
              disabled={(date) => date < new Date()}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Check-out */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start gap-2">
              <CalendarIcon className="h-4 w-4" />
              {checkOut ? format(checkOut, 'MMM dd, yyyy') : 'Check-out'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={checkOut}
              onSelect={setCheckOut}
              disabled={(date) => !checkIn || date <= checkIn}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Guests */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start gap-2">
              <Users className="h-4 w-4" />
              {guests} {guests === 1 ? 'Guest' : 'Guests'}
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
                    onClick={() => setGuests(Math.min(property.guests, guests + 1))}
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <Button 
        className="w-full mb-4 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white" 
        size="lg"
        onClick={handleBooking}
        disabled={!checkIn || !checkOut || isBooked}
      >
        {isBooked ? 'Booking Confirmed! ✓' : 'Reserve Now'}
      </Button>

      {nights > 0 && (
        <>
          <div className="space-y-3 pt-4 border-t border-gray-200 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                {displayPrice.symbol}{displayPrice.amount.toLocaleString()} × {nights} nights
              </span>
              <span className="text-gray-900">
                {subtotal.symbol}{subtotal.amount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Service fee (12%)</span>
              <span className="text-gray-900">
                {serviceFee.symbol}{serviceFee.amount.toLocaleString()}
              </span>
            </div>
            <div className="h-px bg-gray-200" />
            <div className="flex justify-between">
              <span className="text-gray-900">Total ({selectedCountry.currency})</span>
              <span className="text-gray-900">
                {total.symbol}{total.amount.toLocaleString()}
              </span>
            </div>
            {selectedCountry.code !== 'US' && (
              <p className="text-xs text-gray-500 text-right">
                ≈ ${totalUSD.toFixed(2)} USD
              </p>
            )}
          </div>

          {/* Payment Method Info */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <CreditCard className="h-4 w-4" />
              <span>Payment via {paymentMethod}</span>
            </div>
            <p className="text-xs text-gray-500">
              {paymentMethod === 'Paystack' 
                ? 'Secure African payment processing with bank transfer, cards & mobile money'
                : 'Secure international payment processing with cards & digital wallets'}
            </p>
          </div>
        </>
      )}

      <p className="text-xs text-gray-500 text-center mt-4">
        You won't be charged yet
      </p>
    </div>
  );
}
