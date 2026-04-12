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
  
  // URL Query থেকে তথ্য নেওয়া (যদি IdeasPage থেকে পাঠানো হয়)
  const titleFromQuery = searchParams.get('title');
  const priceFromQuery = searchParams.get('price');

  const [idea, setIdea] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    const fetchIdea = async () => {
      try {
        // প্রথমে ব্যাকএন্ড থেকে ডাটা আনার চেষ্টা করবে
        const res = await api.get(`/ideas/${id}`);
        setIdea(res.data.data || res.data);
      } catch (error: any) {
        console.error('Fetch Error:', error.message);
        
        // যদি ৪MD (Forbidden) এরর আসে, তার মানে আইডিয়াটি আছে কিন্তু কেনা নেই
        if (error.response?.status === 403) {
          // যদি URL-এ টাইটেল আর প্রাইস থাকে, সেটা সেট করে দেব
          if (titleFromQuery && priceFromQuery) {
            setIdea({ 
              id: id, 
              title: titleFromQuery, 
              price: priceFromQuery 
            });
          } else {
            // যদি কিছুই না থাকে, তবুও একটা ডিফল্ট মেসেজ দিয়ে পেমেন্ট বাটন দেখাব
            setIdea({ 
              id: id, 
              title: "Sustainability Idea (Premium Content)", 
              price: "Price Details in Ideas Page" 
            });
          }
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchIdea();
  }, [id, titleFromQuery, priceFromQuery]);

  const handlePurchase = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to purchase!');
      return router.push('/login');
    }

    setPurchasing(true);
    try {
      const res = await api.post(`/ideas/${id}/purchase`);

      if (res.status === 201 || res.status === 200) {
        toast.success('অভিনন্দন! আপনি সফলভাবে আইডিয়াটি ক্রয় করেছেন। 🎉');
        // কেনা শেষ হলে সরাসরি ওই আইডিয়ার ডিটেইলস পেজে নিয়ে যাবে
        router.push(`/ideas/${id}`); 
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || 'পেমেন্ট ব্যর্থ হয়েছে।';
      toast.error(msg);
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
    </div>
  );
  
  if (!idea) return (
    <div className="text-center py-20 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-red-500">আইডিয়ার তথ্য পাওয়া যায়নি!</h2>
      <Link href="/ideas" className="text-green-600 underline mt-4 block">আইডিয়া লিস্টে ফিরে যান</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-black">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 border border-green-100">
        <h2 className="text-3xl font-black text-gray-900 text-center mb-2">Secure Checkout 🔒</h2>
        <p className="text-gray-500 text-center mb-8">আপনি এই আইডিয়াটি ক্রয় করছেন:</p>

        <div className="bg-green-50 p-6 rounded-3xl mb-8 border border-green-100">
          <h3 className="font-bold text-xl text-green-800 line-clamp-2">{idea.title}</h3>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-gray-500 font-medium">মোট প্রদেয়:</span>
            <span className="text-3xl font-black text-gray-900">
              {isNaN(Number(idea.price)) ? idea.price : `৳${idea.price}`}
            </span>
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
            href={`/ideas`}
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