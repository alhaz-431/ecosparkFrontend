'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/axios';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { CreditCard, Lock, ShieldCheck, ChevronLeft } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

// ১. Stripe লোড করা (আপনার .env থেকে কী নিচ্ছে)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// ২. পেমেন্ট ফর্ম কম্পোনেন্ট
function CheckoutForm({ idea, displayPrice }: { idea: any, displayPrice: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [purchasing, setPurchasing] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // ইভেন্ট বাবলিং এবং ডিফল্ট বিহেভিয়ার বন্ধ করা
    if (!stripe || !elements) return;

    // ফর্ম ডাটা থেকে নাম সংগ্রহ করা (Async এর আগে)
    const formData = new FormData(e.currentTarget);
    const cardholderName = formData.get('card_name') as string;

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('পেমেন্ট করতে আগে লগইন করুন।');
      return router.push('/login');
    }

    setPurchasing(true);

    try {
      // ৩. ব্যাকএন্ড থেকে Payment Intent (clientSecret) আনা
      const res = await api.post(`/payments/${idea.id}/payment-intent`);
      const { clientSecret } = res.data;

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) return;

      // ৪. Stripe দিয়ে পেমেন্ট কনফার্ম করা
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: cardholderName,
          },
        },
      });

      if (error) {
        toast.error(error.message || 'পেমেন্ট ব্যর্থ হয়েছে।');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // ৫. ব্যাকএন্ডে পেমেন্ট কনফার্ম করা (ডাটাবেস আপডেট)
        await api.post(`/payments/${idea.id}/confirm-payment`, {
          paymentIntentId: paymentIntent.id
        });

        toast.success('অভিনন্দন! পেমেন্ট সফল হয়েছে। 🎉');
        
        // আইডিয়া পেজে পাঠিয়ে দেওয়া
        setTimeout(() => {
          router.push(`/ideas/${idea.id}`);
        }, 2000);
      }
    } catch (error: any) {
      console.error('Payment Error:', error);
      toast.error(error.response?.data?.message || error.message || 'পেমেন্ট প্রসেস করতে সমস্যা হচ্ছে।');
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Card Details</label>
        <div className="bg-gray-50 border border-gray-200 rounded-2xl py-5 px-4 outline-none focus-within:border-emerald-500 transition-all">
          <CardElement 
            options={{
              style: {
                base: {
                  fontSize: '18px',
                  color: '#111827',
                  '::placeholder': { color: '#9ca3af' },
                  fontFamily: 'Inter, sans-serif',
                },
                invalid: {
                  color: '#ef4444',
                },
              },
            }}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Cardholder Name</label>
        <input 
          type="text" 
          required
          name="card_name"
          placeholder="Full Name as on Card" 
          className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-5 px-6 outline-none focus:border-emerald-500 transition-all font-bold text-lg"
        />
      </div>

      <button 
        type="submit"
        disabled={purchasing || !stripe}
        className={`w-full bg-emerald-700 hover:bg-emerald-800 text-white py-6 rounded-[24px] font-black text-xl shadow-xl shadow-emerald-200 transition-all active:scale-95 flex items-center justify-center gap-3 mt-4 ${
          purchasing ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {purchasing ? (
          <div className="w-7 h-7 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
        ) : (
          <>
            <Lock size={22} />
            <span>Confirm & Pay ৳{displayPrice}</span>
          </>
        )}
      </button>

      <div className="flex items-center justify-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
        <ShieldCheck size={14} />
        Secure SSL Encrypted Payment
      </div>
    </form>
  );
}

// ৩. মেইন পেজ কম্পোনেন্ট
export default function PurchasePage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  
  const titleFromQuery = searchParams.get('title');
  const priceFromQuery = searchParams.get('price');

  const [idea, setIdea] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIdea = async () => {
      try {
        const res = await api.get(`/ideas/${id}`);
        setIdea(res.data.data || res.data);
      } catch (error: any) {
        // যদি API এরর দেয় (যেমন ৪০১/৪০৩), কুয়েরি প্যারাম থেকে ডাটা সেট করি
        setIdea({
          id: id,
          title: titleFromQuery || "Premium Idea",
          price: priceFromQuery || "70" 
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchIdea();
  }, [id, titleFromQuery, priceFromQuery]);

  const displayPrice = idea?.price || priceFromQuery || '70';

  if (loading && !titleFromQuery) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-700"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 text-black font-sans">
      <Toaster position="top-center" />
      <div className="max-w-5xl mx-auto">
        
        <Link href="/ideas" className="inline-flex items-center gap-2 text-gray-500 hover:text-black mb-8 font-black transition-all">
          <ChevronLeft size={20} />
          Back to Ideas
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-black text-gray-900 mb-2">Secure Checkout</h1>
              <p className="text-gray-500 font-medium">আপনার পেমেন্ট তথ্য এনক্রিপ্ট করা থাকে।</p>
            </div>

            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">Premium Access</span>
              </div>
              
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 bg-green-100 rounded-[28px] flex items-center justify-center text-3xl shadow-inner">🌱</div>
                <div className="flex-1">
                  <h3 className="font-black text-xl text-gray-900 line-clamp-2 leading-tight">
                    {idea?.title || "Sustainability Project"}
                  </h3>
                  <p className="text-sm text-gray-400 font-bold mt-1 uppercase tracking-wider">EcoSpark Hub</p>
                </div>
              </div>

              <div className="space-y-4 border-t border-dashed pt-6">
                <div className="flex justify-between items-center text-gray-600 font-bold">
                  <span>Idea Price</span>
                  <span>৳{displayPrice}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t">
                  <span className="text-xl font-black text-gray-900">Total</span>
                  <span className="text-3xl font-black text-emerald-700">৳{displayPrice}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-gray-400 text-sm px-4">
              <ShieldCheck size={24} className="text-emerald-500 shrink-0" />
              <p className="font-medium">পেমেন্ট করার পর আপনার ড্যাশবোর্ড থেকে আইডিয়াটি অ্যাক্সেস করতে পারবেন।</p>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[50px] shadow-2xl shadow-gray-200/50 border border-gray-50">
            <h2 className="text-2xl font-black text-gray-900 mb-10">Payment Details</h2>

            {/* Stripe Elements Wrapper */}
            <Elements stripe={stripePromise}>
              <CheckoutForm idea={idea} displayPrice={displayPrice} />
            </Elements>
          </div>
        </div>
      </div>
    </div>
  );
}