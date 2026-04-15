'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { CreditCard, Lock, ShieldCheck, ChevronLeft, ArrowRight } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

function CheckoutForm({ idea, displayPrice }: { idea: any, displayPrice: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    try {
      const { data } = await api.post('/payments/create-intent', {
        ideaId: idea.id,
        amount: idea.price * 100,
      });
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card: elements.getElement(CardElement)! },
      });
      if (result.error) {
        toast.error(result.error.message || 'Payment failed');
      } else if (result.paymentIntent.status === 'succeeded') {
        await api.post('/payments/confirm', { ideaId: idea.id, paymentIntentId: result.paymentIntent.id });
        toast.success('Payment Successful!');
        router.push(`/ideas/${idea.id}`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-gray-50 p-8 rounded-[32px] border border-gray-100">
        <CardElement />
      </div>
      <button type="submit" disabled={!stripe || loading} className="w-full bg-emerald-600 text-white py-5 rounded-[24px] font-black text-lg">
        {loading ? 'Processing...' : `Pay ${displayPrice}`}
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
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login first');
      router.push('/login');
      return;
    }
    const fetchIdea = async () => {
      try {
        const res = await api.get(`/ideas/${id}`);
        setIdea(res.data.idea || res.data.data || res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchIdea();
  }, [id, router]);

  if (loading) return <div>Loading...</div>;

  const displayPrice = idea?.price ? `$${idea.price}` : '$10.00';

  return (
    <div className="bg-gray-50 min-h-screen py-16 px-6">
      <Toaster position="top-center" />
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-[48px] p-12 shadow-2xl">
          <h1 className="text-3xl font-black mb-10 text-center">Unlock Premium Idea</h1>
          <div className="flex justify-between items-center mb-10 pb-10 border-b">
            <h3 className="font-black text-xl">{idea?.title}</h3>
            <div className="text-4xl font-black text-emerald-700">{displayPrice}</div>
          </div>
          <Elements stripe={stripePromise}>
            <CheckoutForm idea={idea} displayPrice={displayPrice} />
          </Elements>
        </div>
      </div>
    </div>
  );
}