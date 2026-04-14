'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/axios';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { CreditCard, Lock, ShieldCheck, ChevronLeft } from 'lucide-react';

export default function PurchasePage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const titleFromQuery = searchParams.get('title');
  const priceFromQuery = searchParams.get('price');

  const [idea, setIdea] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    const fetchIdea = async () => {
      try {
        const res = await api.get(`/ideas/${id}`);
        setIdea(res.data.data || res.data);
      } catch (error: any) {
        if (error.response?.status === 403 || error.response?.status === 401) {
          setIdea({
            id: id,
            title: titleFromQuery || "Premium Idea",
            price: priceFromQuery || "70" 
          });
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchIdea();
  }, [id, titleFromQuery, priceFromQuery]);

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('পেমেন্ট করতে আগে লগইন করুন।');
      return router.push('/login');
    }

    setPurchasing(true);
    try {
      
      const res = await api.post(`/payments/${id}/payment-intent`);

      if (res.status === 201 || res.status === 200) {
        toast.success('অভিনন্দন! পেমেন্ট ইনটেন্ট তৈরি হয়েছে এবং আইডিয়াটি আনলক হয়েছে। 🎉');
        // পেমেন্ট সফল হওয়ার পর আইডিয়া ডিটেইলস পেজে পাঠিয়ে দিবে
        router.push(`/ideas/${id}`); 
      }
    } catch (error: any) {
      console.error('Payment Error:', error);
      // যদি ৪MD (403) আসে, তার মানে টোকেন বা পারমিশনে সমস্যা আছে
      toast.error(error.response?.data?.message || 'পেমেন্ট প্রসেস করতে সমস্যা হচ্ছে। আপনার লগইন চেক করুন।');
    } finally {
      setPurchasing(false);
    }
  };

  const displayPrice = idea?.price || priceFromQuery || '70';

  if (loading && !titleFromQuery) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-700"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 text-black font-sans">
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
            <h2 className="text-2xl font-black text-gray-900 mb-10">Card Details</h2>

            <form onSubmit={handlePurchase} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Card Number</label>
                <div className="relative">
                  <input 
                    type="text" 
                    required
                    name="card_num"
                    autoComplete="cc-number"
                    placeholder="4242 4242 4242 4242" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-5 px-14 outline-none focus:border-emerald-500 transition-all font-bold text-lg"
                  />
                  <CreditCard className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Expiry Date</label>
                  <input 
                    type="text" 
                    required
                    name="card_expiry"
                    autoComplete="cc-exp"
                    placeholder="12 / 26" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-5 px-6 outline-none focus:border-emerald-500 transition-all font-bold text-lg text-center"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">CVC / CVV</label>
                  <input 
                    type="password" 
                    required
                    name="card_cvc"
                    autoComplete="cc-csc"
                    maxLength={3}
                    placeholder="•••" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-5 px-6 outline-none focus:border-emerald-500 transition-all font-bold text-lg text-center"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Cardholder Name</label>
                <input 
                  type="text" 
                  required
                  name="card_name"
                  autoComplete="cc-name"
                  placeholder="Mohammad Alhaz" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-5 px-6 outline-none focus:border-emerald-500 transition-all font-bold text-lg"
                />
              </div>

              <button 
                type="submit"
                disabled={purchasing || !idea}
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
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}