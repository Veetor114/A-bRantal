import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { CreditCard, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import * as api from '../utils/api';
import { Country } from '../App';

// Stripe types
type Stripe = any;
type StripeElements = any;

// Load Stripe.js dynamically
async function loadStripe(publishableKey: string): Promise<Stripe | null> {
  // Check if Stripe script is already loaded
  if ((window as any).Stripe) {
    return (window as any).Stripe(publishableKey);
  }

  // Load Stripe.js script
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.async = true;
    script.onload = () => {
      if ((window as any).Stripe) {
        resolve((window as any).Stripe(publishableKey));
      } else {
        resolve(null);
      }
    };
    script.onerror = () => resolve(null);
    document.head.appendChild(script);
  });
}

type PaymentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount: number;
  currency: string;
  bookingId: string;
  accessToken: string;
  userEmail: string;
  country: Country;
  onSuccess: () => void;
};

export function PaymentDialog({
  open,
  onOpenChange,
  amount,
  currency,
  bookingId,
  accessToken,
  userEmail,
  country,
  onSuccess,
}: PaymentDialogProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [elements, setElements] = useState<StripeElements | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  // Determine payment gateway based on country
  const isAfrican = ['NG', 'GH', 'ZA', 'KE'].includes(country.code);
  const paymentGateway = isAfrican ? 'Paystack' : 'Stripe';

  // Initialize Stripe for non-African countries
  useEffect(() => {
    if (!isAfrican && open) {
      initializeStripe();
    }
  }, [isAfrican, open]);

  async function initializeStripe() {
    try {
      // Create payment intent
      const result = await api.createStripePaymentIntent(
        amount,
        currency,
        bookingId,
        accessToken
      );

      if (!result) {
        throw new Error('Failed to create payment intent');
      }

      setClientSecret(result.clientSecret);

      // Load Stripe.js
      const stripeInstance = await loadStripe(
        'pk_test_51QFfOgP3hgFELyPWmPGFy3HZGZjLcvLIB8aD7Q6Mb4KjYxRj8M4MZsKPLWYzJNZfHgJdLcJvPqWzRtNbPgHxYpQr00q5Z5Z5Z5'
      );

      if (!stripeInstance) {
        throw new Error('Failed to load Stripe');
      }

      setStripe(stripeInstance);

      // Create Elements instance
      const elementsInstance = stripeInstance.elements({
        clientSecret: result.clientSecret,
      });

      setElements(elementsInstance);

      // Create and mount card element
      const paymentElement = elementsInstance.create('payment');
      
      // Wait a bit for the DOM to be ready
      setTimeout(() => {
        const container = document.getElementById('stripe-payment-element');
        if (container) {
          paymentElement.mount('#stripe-payment-element');
        }
      }, 100);
    } catch (err: any) {
      console.error('Stripe initialization error:', err);
      setError(err.message || 'Failed to initialize payment');
    }
  }

  async function handleStripePayment() {
    if (!stripe || !elements || !clientSecret) {
      setError('Payment not initialized. Please try again.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Confirm the payment
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.href,
        },
        redirect: 'if_required',
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Verify payment on backend
        const verified = await api.verifyStripePayment(
          paymentIntent.id,
          bookingId,
          accessToken
        );

        if (verified) {
          setSuccess(true);
          setTimeout(() => {
            onSuccess();
            onOpenChange(false);
          }, 2000);
        } else {
          throw new Error('Payment verification failed');
        }
      } else {
        throw new Error('Payment was not successful');
      }
    } catch (err: any) {
      console.error('Stripe payment error:', err);
      setError(err.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  }

  async function handlePaystackPayment() {
    setError('');
    setLoading(true);

    try {
      // Initialize Paystack payment
      const result = await api.initializePaystackPayment(
        amount,
        userEmail,
        currency,
        bookingId,
        accessToken
      );

      if (!result) {
        throw new Error('Failed to initialize payment');
      }

      // Save reference for verification after redirect
      localStorage.setItem('paystack_reference', result.reference);
      localStorage.setItem('paystack_booking_id', bookingId);

      // Redirect to Paystack payment page
      window.location.href = result.authorizationUrl;
    } catch (err: any) {
      console.error('Paystack payment error:', err);
      setError(err.message || 'Payment failed');
      setLoading(false);
    }
  }

  async function handlePayment() {
    if (isAfrican) {
      await handlePaystackPayment();
    } else {
      await handleStripePayment();
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
          <DialogDescription>
            Pay {currency} {amount.toFixed(2)} using {paymentGateway}
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-gray-900 mb-2">Payment Successful!</h3>
            <p className="text-gray-600">Your booking has been confirmed.</p>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CreditCard className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-900 mb-1">
                    <strong>Payment Gateway:</strong> {paymentGateway}
                  </p>
                  <p className="text-sm text-gray-600">
                    {isAfrican
                      ? 'You will be redirected to Paystack to complete your payment securely.'
                      : 'Enter your card details below to complete the payment securely via Stripe.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Stripe Payment Element */}
            {!isAfrican && (
              <div className="space-y-4">
                <div id="stripe-payment-element" className="min-h-[200px]"></div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <AlertCircle className="h-4 w-4" />
                  <span>Test card: 4242 4242 4242 4242, any future date, any CVC</span>
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm">
                {error}
              </div>
            )}

            <Button
              onClick={handlePayment}
              className="w-full"
              disabled={loading || (!isAfrican && !stripe)}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isAfrican ? 'Continue to Paystack' : 'Pay Now'}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}