'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { Lock, ShieldCheck, ChevronLeft } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Stripe Publishable Key
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
      // ১. পেমেন্ট ইন্টেন্ট তৈরি (ব্যাকএন্ড কন্ট্রোলার অনুযায়ী)
      const { data } = await api.post('/payments/create-intent', {
        ideaId: idea.id
      });

      // ২. Stripe পেমেন্ট কনফার্ম করা
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { 
          card: elements.getElement(CardElement)!,
        },
      });

      if (result.error) {
        toast.error(result.error.message || 'পেমেন্ট ব্যর্থ হয়েছে');
      } else if (result.paymentIntent?.status === 'succeeded') {
        // ৩. ব্যাকএন্ডে পেমেন্ট রেকর্ড কনফার্ম করা
        await api.post('/payments/confirm-payment', { 
          ideaId: idea.id, 
          paymentIntentId: result.paymentIntent.id 
        });
        
        toast.success('পেমেন্ট সফল হয়েছে! 🎉');
        router.push(`/ideas/${idea.id}`); 
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'পেমেন্টে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
      {/* কার্ড এলিমেন্ট কন্টেইনার - রেসপন্সিভ ফিক্স করা হয়েছে */}
      <div className="bg-gray-50 p-4 md:p-6 rounded-2xl border border-gray-200">
        <label className="block text-[10px] md:text-xs font-black uppercase text-gray-400 mb-3 md:mb-4 tracking-widest">
          Card Details
        </label>
        <div className="min-h-[40px] pt-2"> {/* হাইট নিশ্চিত করা হয়েছে যাতে নাম্বার না ঝুলে যায় */}
            <CardElement options={{
              style: {
                base: { 
                    fontSize: '16px', 
                    color: '#1f2937', 
                    letterSpacing: '0.025em',
                    '::placeholder': { color: '#9ca3af' } 
                },
                invalid: { color: '#ef4444' },
              },
            }} />
        </div>
      </div>

      <div className="flex items-center gap-2 text-gray-400 justify-center">
        <ShieldCheck size={16} />
        <span className="text-[10px] font-bold uppercase tracking-widest text-center">
          Secure SSL Encrypted Payment
        </span>
      </div>

      <button 
        type="submit" 
        disabled={!stripe || loading} 
        className="w-full bg-emerald-600 text-white py-4 md:py-5 rounded-[20px] md:rounded-[24px] font-black text-base md:text-lg shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95 disabled:opacity-50"
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
        // ব্যাকএন্ড সরাসরি অবজেক্ট পাঠাচ্ছে তাই res.data ব্যবহার করা হয়েছে
        setIdea(res.data);
      } catch (error) {
        toast.error('আইডিয়া লোড করা সম্ভব হয়নি');
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
    <div className="bg-gray-50 min-h-screen py-12 md:py-24 px-4 md:px-6">
      <Toaster position="top-center" />
      <div className="max-w-2xl mx-auto">
        <Link href={`/ideas/${id}`} className="flex items-center gap-2 font-black text-xs md:text-sm text-gray-400 mb-6 md:mb-8 uppercase tracking-widest hover:text-emerald-600 transition">
          <ChevronLeft size={18}/> Back to Idea
        </Link>

        {/* মেইন কার্ড কন্টেইনার - মোবাইলের জন্য প্যাডিং কমানো হয়েছে */}
        <div className="bg-white rounded-[32px] md:rounded-[48px] p-6 md:p-12 shadow-2xl border border-gray-100">
          <div className="flex items-center gap-3 mb-4 md:mb-6 text-amber-500">
            <Lock size={18} />
            <span className="font-black uppercase text-[10px] md:text-xs tracking-widest">Premium Content</span>
          </div>
          
          <h1 className="text-2xl md:text-4xl font-black mb-3 md:mb-4 text-gray-900 tracking-tighter uppercase leading-tight">
            {idea.title}
          </h1>
          <p className="text-sm md:text-base text-gray-500 font-medium mb-8 md:mb-10 line-clamp-2">
            {idea.description}
          </p>
          
          <div className="flex justify-between items-center mb-8 md:mb-10 pb-8 md:pb-10 border-b border-gray-100">
            <span className="font-black text-gray-400 uppercase tracking-widest text-[10px] md:text-sm">Total Amount</span>
            <div className="text-3xl md:text-5xl font-black text-emerald-600 tracking-tighter">{displayPrice}</div>
          </div>

          <Elements stripe={stripePromise}>
            <CheckoutForm idea={idea} displayPrice={displayPrice} />
          </Elements>

          <div className="mt-6 md:mt-8 text-center">
            <p className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase tracking-widest px-4 md:px-10">
              By completing this purchase, you'll get full lifetime access to this idea and its resources.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}