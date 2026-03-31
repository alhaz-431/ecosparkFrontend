'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '@/lib/axios';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

const cardStyle = {
  style: {
    base: {
      fontSize: '16px',
      color: '#1f2937',
      fontFamily: 'sans-serif',
      '::placeholder': { color: '#9ca3af' },
    },
    invalid: { color: '#ef4444' },
  },
};

function CheckoutForm({ idea }: { idea: any }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post(`/ideas/${idea.id}/payment-intent`);
      const clientSecret = data.clientSecret;
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement)!,
        },
      });
      if (result.error) {
        setError(result.error.message || 'Payment failed');
      } else if (result.paymentIntent.status === 'succeeded') {
        await api.post(`/ideas/${idea.id}/confirm-payment`, {
          paymentIntentId: result.paymentIntent.id,
        });
        setSuccess(true);
        setTimeout(() => router.push(`/ideas/${idea.id}`), 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-10">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-green-700">Payment Successful!</h2>
        <p className="text-gray-500 mt-2">Redirecting to idea...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">

        {/* Card Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            💳 Card Number
          </label>
          <div className="border-2 border-gray-200 rounded-xl p-3 bg-white focus-within:border-green-500 transition">
            <CardNumberElement options={cardStyle} />
          </div>
        </div>

        {/* Expiry and CVC */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              📅 MM / YY
            </label>
            <div className="border-2 border-gray-200 rounded-xl p-3 bg-white focus-within:border-green-500 transition">
              <CardExpiryElement options={cardStyle} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              🔒 CVC
            </label>
            <div className="border-2 border-gray-200 rounded-xl p-3 bg-white focus-within:border-green-500 transition">
              <CardCvcElement options={cardStyle} />
            </div>
          </div>
        </div>

        {/* Test card info */}
        <div className="grid grid-cols-2 gap-3 text-xs text-gray-500 bg-gray-50 p-3 rounded-xl">
          <div className="flex items-center gap-2">
            <span className="text-green-600">💳</span>
            <span>Card: <strong>4242 4242 4242 4242</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600">📅</span>
            <span>Expiry: <strong>12/28</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600">🔒</span>
            <span>CVC: <strong>123</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600">✅</span>
            <span>Test Mode</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
          ❌ {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-green-700 text-white py-3 rounded-xl font-bold hover:bg-green-800 disabled:opacity-50 transition"
      >
        {loading ? '⏳ Processing...' : `💰 Pay $${idea.price}`}
      </button>
    </form>
  );
}

export default function PurchasePage() {
  const { id } = useParams();
  const router = useRouter();
  const [idea, setIdea] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/login');
      return;
    }
    fetchIdea();
  }, []);

  const fetchIdea = async () => {
    try {
      const res = await api.get(`/ideas/${id}/basic`);
      setIdea(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
    </div>
  );

  if (!idea) return (
    <div className="text-center py-20">
      <p className="text-gray-500">Idea not found.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-2xl font-extrabold text-gray-800 mb-2">
            💳 Purchase Idea
          </h1>
          <p className="text-gray-500 mb-6">Get access to this premium idea</p>

          <div className="bg-green-50 border border-green-200 p-4 rounded-xl mb-6">
            <h2 className="font-bold text-gray-800">{idea.title}</h2>
            <p className="text-green-700 font-bold text-xl mt-1">${idea.price}</p>
          </div>

          <Elements stripe={stripePromise}>
            <CheckoutForm idea={idea} />
          </Elements>
        </div>
      </div>
    </div>
  );
}