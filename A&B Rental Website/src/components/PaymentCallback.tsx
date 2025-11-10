import { useEffect, useState } from 'react';
import { useAuth } from '../utils/auth';
import * as api from '../utils/api';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from './ui/button';

type PaymentCallbackProps = {
  onComplete: () => void;
};

export function PaymentCallback({ onComplete }: PaymentCallbackProps) {
  const { user } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying payment...');

  useEffect(() => {
    verifyPayment();
  }, []);

  async function verifyPayment() {
    try {
      // Get URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const reference = urlParams.get('reference');

      if (!reference) {
        throw new Error('No payment reference found');
      }

      // Get booking ID from localStorage
      const bookingId = localStorage.getItem('paystack_booking_id');
      const savedReference = localStorage.getItem('paystack_reference');

      if (!bookingId || savedReference !== reference) {
        throw new Error('Invalid payment reference');
      }

      if (!user) {
        throw new Error('User not authenticated');
      }

      // Verify payment on backend
      const verified = await api.verifyPaystackPayment(
        reference,
        bookingId,
        user.accessToken
      );

      if (verified) {
        setStatus('success');
        setMessage('Payment successful! Your booking has been confirmed.');
        
        // Clean up localStorage
        localStorage.removeItem('paystack_reference');
        localStorage.removeItem('paystack_booking_id');

        // Redirect to bookings after 3 seconds
        setTimeout(() => {
          // Remove reference from URL
          window.history.replaceState({}, document.title, window.location.pathname);
          onComplete();
        }, 3000);
      } else {
        throw new Error('Payment verification failed');
      }
    } catch (error: any) {
      console.error('Payment verification error:', error);
      setStatus('error');
      setMessage(error.message || 'Payment verification failed');
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="h-16 w-16 text-blue-600 animate-spin mx-auto mb-4" />
              <h3 className="text-gray-900 mb-2">{message}</h3>
              <p className="text-gray-600">Please wait...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-gray-900 mb-2">Payment Successful!</h3>
              <p className="text-gray-600 mb-4">{message}</p>
              <p className="text-sm text-gray-500">Redirecting...</p>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-gray-900 mb-2">Payment Failed</h3>
              <p className="text-gray-600 mb-6">{message}</p>
              <Button
                onClick={() => {
                  window.history.replaceState({}, document.title, window.location.pathname);
                  onComplete();
                }}
                className="w-full"
              >
                Return to Home
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
