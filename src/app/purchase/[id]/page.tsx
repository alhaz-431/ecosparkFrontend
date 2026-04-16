'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { Lock, ShieldCheck, ChevronLeft, CreditCard } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// আপনার Stripe Publishable Key এখানে দিবেন
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
      // পেমেন্ট ইন্টেন্ট তৈরি করা
      const { data } = await api.post('/payments/create-intent', {
        ideaId: idea.id,
        amount: idea.price * 100, // সেন্টে কনভার্ট করা
      });

      // পেমেন্ট কনফার্ম করা
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { 
          card: elements.getElement(CardElement)!,
          billing_details: { name: 'Customer' }
        },
      });

      if (result.error) {
        toast.error(result.error.message || 'Payment failed');
      } else if (result.paymentIntent?.status === 'succeeded') {
        // ব্যাকএন্ডে কনফার্ম করা
        await api.post('/payments/confirm', { 
          ideaId: idea.id, 
          paymentIntentId: result.paymentIntent.id 
        });
        toast.success('পেমেন্ট সফল হয়েছে! 🎉');
        router.push(`/ideas/${idea.id}`); // কেনার পর আইডিয়া ডিটেইলসে নিয়ে যাবে
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'পেমেন্টে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
        <label className="block text-xs font-black uppercase text-gray-400 mb-4 tracking-widest">Card Details</label>
        <CardElement options={{
          style: {
            base: { fontSize: '16px', color: '#1f2937', '::placeholder': { color: '#9ca3af' } },
          },
        }} />
      </div>

      <div className="flex items-center gap-2 text-gray-400 justify-center mb-4">
        <ShieldCheck size={16} />
        <span className="text-[10px] font-bold uppercase tracking-widest">Secure SSL Encrypted Payment</span>
      </div>

      <button 
        type="submit" 
        disabled={!stripe || loading} 
        className="w-full bg-emerald-600 text-white py-5 rounded-[24px] font-black text-lg shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95 disabled:opacity-50"
      >
        {loading ? 'Processing...' : `Pay ${displayPrice} & Unlock`}
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
      toast.error('কেনার আগে লগইন করুন');
      router.push('/login');
      return;
    }

    const fetchIdea = async () => {
      try {
        const res = await api.get(`/ideas/${id}`);
        setIdea(res.data.idea || res.data.data || res.data);
      } catch (error) {
        console.error(error);
        toast.error('আইডিয়া লোড করা সম্ভব হয়নি');
      } finally {
        setLoading(false);
      }
    };
    fetchIdea();
  }, [id, router]);

  if (loading) return <div className="p-20 text-center font-black animate-pulse uppercase tracking-widest">Loading Secure Checkout...</div>;
  if (!idea) return <div className="p-20 text-center font-black text-red-500 uppercase">Idea Not Found!</div>;

  const displayPrice = idea.price ? `৳${idea.price}` : '৳0.00';

  return (
    <div className="bg-gray-50 min-h-screen py-24 px-6">
      <Toaster position="top-center" />
      <div className="max-w-2xl mx-auto">
        <Link href={`/ideas/${id}`} className="flex items-center gap-2 font-black text-sm text-gray-400 mb-8 uppercase tracking-widest hover:text-emerald-600 transition">
          <ChevronLeft size={18}/> Back to Idea
        </Link>

        <div className="bg-white rounded-[48px] p-12 shadow-2xl border border-gray-100">
          <div className="flex items-center gap-3 mb-6 text-amber-500">
            <Lock size={20} />
            <span className="font-black uppercase text-xs tracking-widest">Premium Content</span>
          </div>
          
          <h1 className="text-4xl font-black mb-4 text-gray-900 tracking-tighter uppercase">{idea.title}</h1>
          <p className="text-gray-500 font-medium mb-10 line-clamp-2">{idea.description}</p>
          
          <div className="flex justify-between items-center mb-10 pb-10 border-b border-gray-100">
            <span className="font-black text-gray-400 uppercase tracking-widest text-sm">Total Amount</span>
            <div className="text-5xl font-black text-emerald-600 tracking-tighter">{displayPrice}</div>
          </div>

          <Elements stripe={stripePromise}>
            <CheckoutForm idea={idea} displayPrice={displayPrice} />
          </Elements>

          <div className="mt-8 text-center">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest px-10">
              By completing this purchase, you'll get full lifetime access to this idea and its resources.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}