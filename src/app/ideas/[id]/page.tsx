'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';
import { 
  Lock, 
  ShoppingCart,
  ChevronLeft,
  User as UserIcon,
  CheckCircle2,
  Calendar,
  AlertCircle,
  ThumbsUp
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function IdeaDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [idea, setIdea] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [votingId, setVotingId] = useState<string | null>(null);

  const fetchIdea = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/ideas/${id}`);
      const fetchedData = res.data.data || res.data.idea || res.data;
      setIdea(fetchedData || null);
    } catch (error: any) {
      console.error("Error fetching idea:", error);
      setIdea(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
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

  // --- ভোট ফাংশন ---
  const handleVote = async (direction: 'up' | 'down') => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('ভোট দিতে আগে লগইন করুন!');
      return;
    }

    setVotingId(idea.id);
    try {
      const voteValue = direction === 'up' ? 1 : -1;
      await api.post(`/votes/${idea.id}/vote`, { value: voteValue });
      toast.success('ভোট আপডেট হয়েছে!');
      fetchIdea(); // ডাটা রিফ্রেশ করা
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Voting failed');
    } finally {
      setVotingId(null);
    }
  };

  const handlePurchaseNavigation = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to purchase this idea!');
      router.push('/login');
      return;
    }
    router.push(`/purchase/${id}`); 
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-black text-xs uppercase tracking-[0.3em] text-gray-400">Fetching Idea Details...</p>
      </div>
    </div>
  );

  if (!idea) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
      <AlertCircle size={80} className="text-rose-200 mb-6" />
      <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-4 uppercase">Idea Not Found!</h1>
      <Link href="/ideas" className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-600 transition shadow-xl">
        Back to Community
      </Link>
    </div>
  );

  const isOwner = user?.id === idea.authorId || user?._id === idea.authorId;
  const isPaidIdea = idea.isPaid === true || (idea.price && Number(idea.price) > 0) || idea.type === 'PAID';
  const hasPurchased = idea.purchasedBy?.includes(user?.id) || idea.purchasedBy?.includes(user?._id);

  return (
    <div className="bg-gray-50 min-h-screen pt-28 pb-20 px-6">
      <Toaster position="top-center" />
      
      <div className="max-w-4xl mx-auto">
        <Link href="/ideas" className="inline-flex items-center gap-2 font-black text-sm text-gray-400 mb-8 uppercase tracking-widest hover:text-emerald-600 transition group">
          <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Discover
        </Link>

        <div className="bg-white rounded-[48px] border border-gray-100 overflow-hidden shadow-2xl shadow-gray-200/50">
          <div className="h-[450px] bg-gray-100 relative overflow-hidden">
            <img 
              src={idea.images?.[0] || `https://picsum.photos/seed/${idea.id}/1200/800`} 
              className="w-full h-full object-cover" 
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
            </div>
          </div>

          <div className="p-10 md:p-14">
            <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-6">
              <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase leading-[0.9] flex-1">
                {idea.title}
              </h1>
              
              {/* --- নতুন ভোট সেকশন --- */}
              <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-3xl border border-gray-100">
                <button 
                  onClick={() => handleVote('up')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-all font-black text-xs ${
                    idea.userVote === 1 
                    ? 'bg-emerald-100 text-emerald-600 ring-1 ring-emerald-500/20' 
                    : 'bg-white text-gray-400 hover:bg-emerald-50 hover:text-emerald-500 shadow-sm'
                  }`}
                >
                  <ThumbsUp size={18} className={idea.userVote === 1 ? 'fill-emerald-600' : ''} />
                  <span>{idea.upvotes || 0}</span>
                </button>

                <button 
                  onClick={() => handleVote('down')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-all font-black text-xs ${
                    idea.userVote === -1 
                    ? 'bg-rose-100 text-rose-600 ring-1 ring-rose-500/20' 
                    : 'bg-white text-gray-400 hover:bg-rose-50 hover:text-rose-500 shadow-sm'
                  }`}
                >
                  <ThumbsUp size={18} className={`rotate-180 ${idea.userVote === -1 ? 'fill-rose-600' : ''}`} />
                  <span>{idea.downvotes || 0}</span>
                </button>
              </div>
            </div>

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

            <div className="mb-14">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 mb-6 flex items-center gap-2">
                <div className="h-px w-8 bg-emerald-200" /> Executive Summary
              </h4>
              <p className="text-gray-600 font-medium text-xl leading-relaxed border-l-4 border-emerald-500 pl-8 italic bg-gray-50/50 py-6 rounded-r-3xl">
                &quot;{idea.description}&quot;
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-10 border-t border-gray-100">
              {isPaidIdea && !isOwner && !hasPurchased && (
                <button 
                  onClick={handlePurchaseNavigation}
                  className="flex-1 bg-emerald-600 text-white px-12 py-7 rounded-[32px] font-black text-xl hover:bg-emerald-700 shadow-2xl shadow-emerald-200 flex items-center justify-center gap-4 transition-all active:scale-95"
                >
                  <ShoppingCart size={24}/> Buy Premium Blueprint (৳{idea.price})
                </button>
              )}

              {(hasPurchased || !isPaidIdea || isOwner) && (
                <div className="flex-1 bg-emerald-50 text-emerald-700 p-8 rounded-[32px] font-black text-center border-2 border-dashed border-emerald-200 flex items-center justify-center gap-3">
                  <CheckCircle2 className="text-emerald-600" />
                  {isOwner ? "You are the creator of this vision" : "You have successfully unlocked this idea!"}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}