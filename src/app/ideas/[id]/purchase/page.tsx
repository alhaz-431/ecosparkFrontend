'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/axios';
import Link from 'next/link';

export default function PurchasePage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // URL Query থেকে প্রাথমিক তথ্য নেওয়া (ইউজার এক্সপেরিয়েন্সের জন্য)
  const titleFromQuery = searchParams.get('title');
  const priceFromQuery = searchParams.get('price');

  const [idea, setIdea] = useState<any>(null);
  const [loading, setLoading] = useState(!titleFromQuery); 
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    if (titleFromQuery && priceFromQuery) {
      setIdea({ title: titleFromQuery, price: priceFromQuery });
      setLoading(false);
    } else {
      const fetchIdea = async () => {
        try {
          const res = await api.get(`/ideas/${id}`);
          setIdea(res.data.data || res.data);
        } catch (error: any) {
          console.error('Error fetching idea:', error.message);
        } finally {
          setLoading(false);
        }
      };
      if (id) fetchIdea();
    }
  }, [id, titleFromQuery, priceFromQuery]);

  // --- পেমেন্ট হ্যান্ডেলার (Clean Version) ---
  const handlePurchase = async () => {
    setPurchasing(true);
    try {
      // আপনার axios ফাইলে interceptor আছে, তাই আলাদা করে হেডার দেওয়ার দরকার নেই
      const res = await api.post(`/ideas/${id}/purchase`);

      if (res.status === 201 || res.status === 200) {
        alert('অভিনন্দন! আপনি সফলভাবে আইডিয়াটি ক্রয় করেছেন। 🎉');
        router.push('/user/dashboard'); 
      }
    } catch (error: any) {
      // আপনার axios interceptor অলরেডি সুন্দর এরর মেসেজ রিটার্ন করছে
      console.error('Payment Error:', error.message);
      alert(error.message || 'পেমেন্ট ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) return <div className="text-center py-20 font-bold text-green-700">লোড হচ্ছে...</div>;
  
  if (!idea) return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold text-red-500">আইডিয়ার তথ্য পাওয়া যায়নি!</h2>
      <Link href="/ideas" className="text-green-600 underline mt-4 block">আইডিয়া লিস্টে ফিরে যান</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-black">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 border border-green-100">
        <h2 className="text-3xl font-black text-gray-900 text-center mb-2">Secure Checkout 🔒</h2>
        <p className="text-gray-500 text-center mb-8">আপনি এই আইডিয়াটি ক্রয় করছেন:</p>

        <div className="bg-green-50 p-6 rounded-3xl mb-8 border border-green-100">
          <h3 className="font-bold text-xl text-green-800 line-clamp-2">{idea.title}</h3>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-gray-500 font-medium">মোট প্রদেয়:</span>
            <span className="text-3xl font-black text-gray-900">৳{idea.price}</span>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={handlePurchase}
            disabled={purchasing}
            className={`w-full bg-green-700 text-white py-5 rounded-2xl font-black text-lg transition-all shadow-lg shadow-green-200 ${
              purchasing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-800 active:scale-95'
            }`}
          >
            {purchasing ? 'প্রসেসিং হচ্ছে...' : 'Confirm & Pay Now'}
          </button>
          
          <Link 
            href={`/ideas/${id}`}
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