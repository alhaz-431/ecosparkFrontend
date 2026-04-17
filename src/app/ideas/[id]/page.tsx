'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/axios';
import { 
  Lock, 
  ShoppingCart,
  ChevronLeft,
  User as UserIcon,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Clock
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function IdeaDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [idea, setIdea] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ডাটা ফেচ করার ফাংশন
  const fetchIdea = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/ideas/${id}`);
      
      // ব্যাকএন্ড রেসপন্স চেক (data, idea বা সরাসরি res.data হতে পারে)
      const fetchedData = res.data.data || res.data.idea || res.data;
      
      if (!fetchedData || (typeof fetchedData === 'object' && Object.keys(fetchedData).length === 0)) {
        setIdea(null);
      } else {
        setIdea(fetchedData);
      }
    } catch (error: any) {
      console.error("Error fetching idea:", error);
      setIdea(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // লোকাল স্টোরেজ থেকে ইউজার ডাটা নেওয়া
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        console.error("User parsing error", e);
      }
    }
    if (id) fetchIdea();
  }, [id, fetchIdea]);

  // পেমেন্ট পেজে নেভিগেট করা
  const handlePurchaseNavigation = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to purchase this idea!');
      router.push('/login');
      return;
    }
    // আপনার ফোল্ডার স্ট্রাকচার অনুযায়ী পাথ ঠিক করুন
    // যদি purchase ফোল্ডারটি app/purchase/[id] এ থাকে তবে নিচেরটি কাজ করবে
    router.push(`/purchase/${id}`); 
  };

  // লোডিং স্ক্রিন
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-black text-xs uppercase tracking-[0.3em] text-gray-400">Fetching Idea Details...</p>
      </div>
    </div>
  );

  // আইডিয়া না পাওয়া গেলে (404 UI)
  if (!idea) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
      <AlertCircle size={80} className="text-rose-200 mb-6" />
      <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-4 uppercase">Idea Not Found!</h1>
      <p className="text-gray-500 mb-8 max-w-sm font-medium">
        আমরা দুঃখিত, এই আইডিয়াটি খুঁজে পাওয়া যাচ্ছে না। এটি ডিলিট হয়ে থাকতে পারে অথবা ইউআরএল ভুল।
      </p>
      <Link href="/ideas" className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-600 transition shadow-xl">
        Back to Community
      </Link>
    </div>
  );

  // লজিক চেক (মালিক, এডমিন এবং কেনা হয়েছে কি না)
  const isOwner = user?.id === idea.authorId || user?._id === idea.authorId;
  const isAdmin = user?.role === 'ADMIN';
  const isPaidIdea = idea.isPaid === true || (idea.price && Number(idea.price) > 0) || idea.type === 'PAID';
  const hasPurchased = idea.purchasedBy?.includes(user?.id) || idea.purchasedBy?.includes(user?._id);

  return (
    <div className="bg-gray-50 min-h-screen pt-28 pb-20 px-6">
      <Toaster position="top-center" />
      
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link href="/ideas" className="inline-flex items-center gap-2 font-black text-sm text-gray-400 mb-8 uppercase tracking-widest hover:text-emerald-600 transition group">
          <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Discover
        </Link>

        {/* Main Card */}
        <div className="bg-white rounded-[48px] border border-gray-100 overflow-hidden shadow-2xl shadow-gray-200/50">
          
          {/* Cover Image */}
          <div className="h-[450px] bg-gray-100 relative overflow-hidden">
            <img 
              src={idea.images?.[0] || `https://images.unsplash.com/photo-1466611653911-95282fc3656b?q=80&w=1200&auto=format&fit=crop`} 
              className="w-full h-full object-cover transition duration-700 hover:scale-105" 
              alt={idea.title}
            />
            <div className="absolute top-8 left-8 flex flex-wrap gap-3">
              <span className="bg-white/95 backdrop-blur px-6 py-2 rounded-full font-black uppercase text-[10px] tracking-widest text-emerald-700 shadow-sm border border-emerald-50">
                {idea.category?.name || idea.category || 'Sustainability'}
              </span>
              {isPaidIdea && !hasPurchased && !isOwner && (
                <span className="bg-amber-400 text-white px-6 py-2 rounded-full font-black uppercase text-[10px] tracking-widest flex items-center gap-2 shadow-lg animate-pulse">
                  <Lock size={12}/> Premium Idea
                </span>
              )}
              {(hasPurchased || (isPaidIdea && isOwner)) && (
                <span className="bg-emerald-500 text-white px-6 py-2 rounded-full font-black uppercase text-[10px] tracking-widest flex items-center gap-2 shadow-lg">
                  <CheckCircle2 size={12}/> Full Access
                </span>
              )}
            </div>
          </div>

          <div className="p-10 md:p-14">
            {/* Title & Price */}
            <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-6">
              <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase leading-[0.9] flex-1">
                {idea.title}
              </h1>
              {isPaidIdea && !hasPurchased && !isOwner && (
                <div className="bg-emerald-50 px-8 py-4 rounded-[32px] border border-emerald-100">
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1 text-center">Investment</p>
                  <div className="text-4xl font-black text-emerald-700 tracking-tighter">৳{idea.price}</div>
                </div>
              )}
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 mb-12">
              <div className="bg-gray-50 px-6 py-4 rounded-[24px] flex items-center gap-4 border border-gray-100">
                <div className="bg-white p-3 rounded-xl shadow-sm text-emerald-600">
                  <UserIcon size={20}/>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Author</p>
                  <p className="font-black text-gray-800">{idea.author?.name || 'Sustainable Member'}</p>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4 rounded-[24px] flex items-center gap-4 border border-gray-100">
                <div className="bg-white p-3 rounded-xl shadow-sm text-emerald-600">
                  <Calendar size={20}/>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Published On</p>
                  <p className="font-black text-gray-800">
                    {idea.createdAt ? new Date(idea.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recently'}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-14">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 mb-6 flex items-center gap-2">
                <div className="h-px w-8 bg-emerald-200" /> Executive Summary
              </h4>
              <p className="text-gray-600 font-medium text-xl leading-relaxed border-l-4 border-emerald-500 pl-8 italic bg-gray-50/50 py-6 rounded-r-3xl">
                &quot;{idea.description}&quot;
              </p>
            </div>

            {/* Action Section */}
            <div className="flex flex-col sm:flex-row gap-4 pt-10 border-t border-gray-100">
              {isPaidIdea && !isOwner && !hasPurchased && (
                <button 
                  onClick={handlePurchaseNavigation}
                  className="flex-1 bg-emerald-600 text-white px-12 py-7 rounded-[32px] font-black text-xl hover:bg-emerald-700 shadow-2xl shadow-emerald-200 flex items-center justify-center gap-4 transition-all active:scale-95 group"
                >
                  <ShoppingCart size={24} className="group-hover:scale-110 transition-transform"/> 
                  Buy Premium Blueprint
                </button>
              )}

              {(hasPurchased || !isPaidIdea || isOwner) && (
                <div className="flex-1 bg-emerald-50 text-emerald-700 p-8 rounded-[32px] font-black text-center border-2 border-dashed border-emerald-200 flex items-center justify-center gap-3">
                  <CheckCircle2 className="text-emerald-600" />
                  {isOwner ? "You are the creator of this vision" : "You have successfully unlocked this idea!"}
                </div>
              )}

              {isOwner && (
                <Link 
                  href={`/ideas/${id}/edit`} 
                  className="bg-gray-900 text-white px-10 py-7 rounded-[32px] font-black hover:bg-black flex-1 text-center transition shadow-xl active:scale-95 flex items-center justify-center"
                >
                  Update Vision
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">Secure Transactions via EcoPay</p>
          <div className="flex justify-center gap-8 grayscale opacity-40">
            <span className="font-black text-sm italic">BKASH</span>
            <span className="font-black text-sm italic">NAGAD</span>
            <span className="font-black text-sm italic">VISA</span>
          </div>
        </div>
      </div>
    </div>
  );
}