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
            title: titleFromQuery || "Premium Sustainability Idea",
            price: priceFromQuery || "0"
          });
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchIdea();
  }, [id, titleFromQuery, priceFromQuery]);

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault(); // ফর্ম সাবমিট আটকানোর জন্য
    setPurchasing(true);
    try {
      const res = await api.post(`/ideas/${id}/purchase`);

      if (res.status === 201 || res.status === 200) {
        toast.success('অভিনন্দন! আপনি সফলভাবে আইডিয়াটি ক্রয় করেছেন। 🎉');
        router.push(`/ideas/${id}`); 
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || 'পেমেন্ট ব্যর্থ হয়েছে।';
      toast.error(msg);
    } finally {
      setPurchasing(false);
    }
  };

  if (loading && !titleFromQuery) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 text-black">
      <div className="max-w-5xl mx-auto">
        
        {/* Back Link */}
        <Link href="/ideas" className="inline-flex items-center gap-2 text-gray-500 hover:text-black mb-8 font-bold transition-all">
          <ChevronLeft size={20} />
          Back to Ideas
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Side: Order Summary */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-black text-gray-900 mb-2">Secure Checkout</h1>
              <p className="text-gray-500 font-medium text-lg">সতর্কতার সাথে তথ্য যাচাই করে পেমেন্ট সম্পন্ন করুন।</p>
            </div>

            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-3 py-1 rounded-full uppercase">Premium Access</span>
              </div>
              
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 bg-green-100 rounded-[28px] flex items-center justify-center text-3xl shadow-inner">
                  🌱
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-xl text-gray-900 line-clamp-2 leading-tight">
                    {idea?.title || "Loading Idea..."}
                  </h3>
                  <p className="text-sm text-gray-400 font-bold mt-1 uppercase tracking-wider">Sustainability Project</p>
                </div>
              </div>

              <div className="space-y-4 border-t border-dashed pt-6">
                <div className="flex justify-between items-center text-gray-500 font-medium">
                  <span>Idea Platform Fee</span>
                  <span>৳{idea?.price || '0'}</span>
                </div>
                <div className="flex justify-between items-center text-gray-500 font-medium">
                  <span>Secure SSL Processing</span>
                  <span className="text-emerald-600 font-bold">Free</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t">
                  <span className="text-xl font-black text-gray-900">Total Amount</span>
                  <span className="text-3xl font-black text-emerald-700">
                    ৳{idea?.price || '0'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-gray-400 text-sm px-4">
              <ShieldCheck size={24} className="text-emerald-500" />
              <p className="font-medium leading-relaxed">আপনার পেমেন্ট তথ্য SSL এনক্রিপশনের মাধ্যমে সম্পূর্ণ সুরক্ষিত রাখা হবে।</p>
            </div>
          </div>

          {/* Right Side: Stripe Styled Card Form */}
          <div className="bg-white p-10 rounded-[50px] shadow-2xl shadow-gray-200/50 border border-gray-50">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl font-black text-gray-900">Payment Details</h2>
              <div className="flex gap-2">
                 <div className="px-2 py-1 bg-gray-50 border rounded text-[10px] font-black text-gray-400 uppercase">Visa</div>
                 <div className="px-2 py-1 bg-gray-50 border rounded text-[10px] font-black text-gray-400 uppercase">MasterCard</div>
              </div>
            </div>

            <form onSubmit={handlePurchase} className="space-y-6">
              {/* Card Number */}
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Card Number</label>
                <div className="relative">
                  <input 
                    type="text" 
                    required
                    placeholder="4242 4242 4242 4242" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-5 px-14 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all font-bold text-lg"
                  />
                  <CreditCard className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Expiry */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Expiry Date</label>
                  <input 
                    type="text" 
                    required
                    placeholder="MM / YY" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-5 px-6 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all font-bold text-lg text-center"
                  />
                </div>
                {/* CVC */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">CVC / CVV</label>
                  <input 
                    type="password" 
                    required
                    maxLength={3}
                    placeholder="•••" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-5 px-6 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all font-bold text-lg text-center"
                  />
                </div>
              </div>

              {/* Cardholder Name */}
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Cardholder Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="Enter name as on card" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-5 px-6 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all font-bold text-lg"
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
                    <span>Confirm & Pay ৳{idea?.price || '0'}</span>
                  </>
                )}
              </button>
            </form>
            
            <div className="mt-8 flex flex-col items-center gap-2">
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">Powered by Stripe & EcoSpark Secure</p>
              <div className="h-1 w-12 bg-gray-100 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}