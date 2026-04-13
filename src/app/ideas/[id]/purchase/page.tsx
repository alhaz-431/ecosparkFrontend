'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/axios';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function PurchasePage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // IdeasPage থেকে পাঠানো টাইটেল আর প্রাইস ইউআরএল থেকে ধরা (লজিক্যাল ব্যাকআপ)
  const titleFromQuery = searchParams.get('title');
  const priceFromQuery = searchParams.get('price');

  const [idea, setIdea] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    const fetchIdea = async () => {
      try {
        // প্রথমে চেষ্টা করবে ব্যাকএন্ড থেকে ডাটা আনতে
        const res = await api.get(`/ideas/${id}`);
        setIdea(res.data.data || res.data);
      } catch (error: any) {
        // যদি ৪MD (Forbidden) এরর আসে, তার মানে আইডিয়াটি আছে কিন্তু কেনা নেই
        if (error.response?.status === 403 || error.response?.status === 401) {
          console.log("Purchase required, using query params...");
          // ব্যাকএন্ড ডাটা না দিলে আমরা URL এর ডাটা ব্যবহার করব
          setIdea({
            id: id,
            title: titleFromQuery || "Premium Sustainability Idea",
            price: priceFromQuery || "Paid"
          });
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchIdea();
  }, [id, titleFromQuery, priceFromQuery]);

  const handlePurchase = async () => {
    setPurchasing(true);
    try {
      // পেমেন্ট রিকোয়েস্ট পাঠানো
      const res = await api.post(`/ideas/${id}/purchase`);

      if (res.status === 201 || res.status === 200) {
        toast.success('অভিনন্দন! আপনি সফলভাবে আইডিয়াটি ক্রয় করেছেন। 🎉');
        // কেনা শেষ হলে সরাসরি ওই আইডিয়ার ডিটেইলস পেজে নিয়ে যাবে
        router.push(`/ideas/${id}`); 
      }
    } catch (error: any) {
      console.error('Payment Error:', error);
      const msg = error.response?.data?.message || error.message || 'পেমেন্ট ব্যর্থ হয়েছে।';
      toast.error(msg);
    } finally {
      setPurchasing(false);
    }
  };

  // লোডিং স্টেট
  if (loading && !titleFromQuery) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-black">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 border border-green-100">
        <h2 className="text-3xl font-black text-gray-900 text-center mb-2">Secure Checkout 🔒</h2>
        <p className="text-gray-500 text-center mb-8">আপনি এই আইডিয়াটি ক্রয় করছেন:</p>

        {idea ? (
          <div className="bg-green-50 p-6 rounded-3xl mb-8 border border-green-100">
            <h3 className="font-bold text-xl text-green-800 line-clamp-2">
              {idea.title}
            </h3>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-gray-500 font-medium">মোট প্রদেয়:</span>
              <span className="text-3xl font-black text-gray-900">
                {idea.price?.toString().includes('৳') ? idea.price : `৳${idea.price}`}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-red-500 text-center mb-4">তথ্য লোড করা যাচ্ছে না।</p>
        )}

        <div className="space-y-4">
          <button
            onClick={handlePurchase}
            disabled={purchasing || !idea}
            className={`w-full bg-green-700 text-white py-5 rounded-2xl font-black text-lg transition-all shadow-lg shadow-green-200 ${
              purchasing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-800 active:scale-95'
            }`}
          >
            {purchasing ? 'প্রসেসিং হচ্ছে...' : 'Confirm & Pay Now'}
          </button>
          
          <Link 
            href="/ideas"
            className="block text-center text-gray-400 font-bold hover:text-gray-600 transition-all"
          >
            বাতিল করুন
          </Link>
        </div>

        <div className="mt-8 text-center">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
            Guaranteed safe checkout with SSL encryption
          </p>
        </div>
      </div>
    </div>
  );
}