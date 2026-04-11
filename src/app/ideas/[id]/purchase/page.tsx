'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import Link from 'next/link';

interface Idea {
  id: string;
  title: string;
  price: number;
  type: string;
}

export default function PurchasePage() {
  const { id } = useParams();
  const router = useRouter();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    const fetchIdea = async () => {
      try {
        const res = await api.get(`/ideas/${id}`);
        setIdea(res.data);
      } catch (error) {
        console.error('Error fetching idea for purchase:', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchIdea();
  }, [id]);

  const handlePurchase = async () => {
    setPurchasing(true);
    try {
      // আপনার ব্যাকএন্ডে পারচেজ করার API এন্ডপয়েন্ট এখানে হবে
      await api.post(`/ideas/${id}/purchase`);
      alert('Purchase Successful!');
      router.push(`/ideas/${id}`); // কেনা হয়ে গেলে ডিটেইল পেজে ফেরত পাঠাবে
    } catch (error: any) {
      alert(error.response?.data?.message || 'Payment Failed. Please try again.');
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) return <div className="text-center py-20 font-bold">Loading Payment Details...</div>;
  if (!idea) return <div className="text-center py-20 font-bold">Idea not found!</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 border border-green-100">
        <h2 className="text-3xl font-black text-gray-900 text-center mb-2">Secure Checkout 🔒</h2>
        <p className="text-gray-500 text-center mb-8">You are purchasing access to:</p>

        <div className="bg-green-50 p-6 rounded-3xl mb-8 border border-green-100">
          <h3 className="font-bold text-xl text-green-800 line-clamp-2">{idea.title}</h3>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-gray-500 font-medium">Price to pay:</span>
            <span className="text-3xl font-black text-gray-900">৳{idea.price}</span>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={handlePurchase}
            disabled={purchasing}
            className="w-full bg-green-700 text-white py-5 rounded-2xl font-black text-lg hover:bg-green-800 transition-all shadow-lg shadow-green-200 disabled:opacity-50"
          >
            {purchasing ? 'Processing...' : 'Confirm & Pay Now'}
          </button>
          
          <Link 
            href={`/ideas/${id}`}
            className="block text-center text-gray-400 font-bold hover:text-gray-600 transition-all"
          >
            Cancel Transaction
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