'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';
import toast, { Toaster } from 'react-hot-toast';
import { 
  ChevronLeft, 
  ThumbsUp, 
  ThumbsDown, 
  Calendar, 
  User as UserIcon, 
  ShieldAlert,
  ExternalLink,
  Image as ImageIcon
} from 'lucide-react';

// ১. আইডিয়া অবজেক্টের জন্য ইন্টারফেস (Type Safety)
interface Idea {
  id: string;
  title: string;
  problemStatement: string;
  solution: string;
  description: string;
  images: string[];
  type: 'FREE' | 'PAID';
  price?: number;
  createdAt: string;
  author: { name: string };
  category: { name: string };
  upvotes: number;
  downvotes: number;
  userVote?: number;
}

export default function IdeaDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [voting, setVoting] = useState(false);

  // ২. আইডিয়া ফেচ করার ফাংশন
  const fetchIdea = useCallback(async () => {
    try {
      const res = await api.get(`/ideas/${id}`);
      // ব্যাকএন্ড রেসপন্স ফরম্যাট অনুযায়ী ডাটা সেট করা
      const ideaData = res.data.data || res.data;
      setIdea(ideaData);
    } catch (error: any) {
      // যদি পেমেন্ট না করা থাকে (403 Forbidden)
      if (error.response?.status === 403) {
        const title = error.response?.data?.title || '';
        const price = error.response?.data?.price || '';
        // পেমেন্ট পেজে রিডাইরেক্ট (কুয়েরি প্যারামসহ যাতে দ্রুত লোড হয়)
        router.push(`/purchase/${id}?title=${encodeURIComponent(title)}&price=${price}`);
      } else {
        console.error('Fetch Error:', error);
      }
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
    if (id && id !== 'create') fetchIdea();
  }, [id, fetchIdea]);

  // ৩. ভোট দেওয়ার ফাংশন
  const handleVote = async (value: number) => {
    if (!user) {
      toast.error('ভোট দিতে আগে লগইন করুন!');
      return router.push('/login');
    }
    
    setVoting(true);
    try {
      await api.post(`/votes/${id}/vote`, { value });
      toast.success(value === 1 ? 'Upvoted! 👍' : 'Downvoted! 👎');
      fetchIdea(); // ডাটা রিফ্রেশ
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to vote!');
    } finally {
      setVoting(false);
    }
  };

  // ৪. অ্যাডমিন অ্যাকশন
  const handleAdminAction = async (status: string) => {
    try {
      let feedbackNote = '';
      if (status === 'REJECTED') {
        const reason = prompt('Enter rejection reason:');
        if (reason === null) return; // ইউজার ক্যান্সেল করলে থেমে যাবে
        feedbackNote = reason;
      }
      
      await api.patch(`/admin/ideas/${id}/status`, { status, feedbackNote });
      toast.success(`Idea ${status.toLowerCase()} successfully!`);
      fetchIdea();
    } catch (error) {
      toast.error('Failed to update status!');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
    </div>
  );

  if (!idea) return (
    <div className="text-center py-24 bg-white min-h-screen flex flex-col items-center justify-center">
      <div className="text-8xl mb-6">🔍</div>
      <h2 className="text-3xl font-black text-gray-300">Idea not found!</h2>
      <Link href="/ideas" className="mt-6 bg-emerald-600 text-white px-8 py-3 rounded-full font-bold hover:bg-emerald-700 transition-all">
        Back to All Ideas
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-6 font-sans">
      <Toaster position="top-center" />
      <div className="max-w-4xl mx-auto">

        {/* Back Button */}
        <Link href="/ideas" className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800 mb-8 font-black uppercase tracking-widest text-xs transition-all">
          <ChevronLeft size={18} />
          Back to All Ideas
        </Link>

        {/* Main Content Card */}
        <div className="bg-white rounded-[48px] shadow-sm border border-gray-100 p-6 md:p-14 mb-8 overflow-hidden">
          <div className="flex flex-wrap gap-3 mb-8">
            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full">
              {idea.category?.name || 'Innovation'}
            </span>
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full ${
              idea.type === 'PAID' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
            }`}>
              {idea.type === 'PAID' ? `৳${idea.price} • Premium` : 'Free Access'}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-8 leading-[1.05] tracking-tight">{idea.title}</h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 mb-10 pb-10 border-b border-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-black shadow-lg shadow-emerald-100 text-xl">
                {idea.author?.name?.charAt(0)}
              </div>
              <div>
                <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Published by</p>
                <span className="font-bold text-gray-900">{idea.author?.name}</span>
              </div>
            </div>
            <div className="hidden md:block w-px h-8 bg-gray-100 mx-2"></div>
            <div className="flex items-center gap-2 font-bold text-gray-500">
              <Calendar size={16} />
              <span>{new Date(idea.createdAt).toLocaleDateString('bn-BD')}</span>
            </div>
          </div>

          {/* Image with Fallback */}
          <div className="relative w-full h-[300px] md:h-[500px] rounded-[40px] mb-12 overflow-hidden bg-gray-100 shadow-2xl">
            {idea.images && idea.images.length > 0 ? (
              <img src={idea.images[0]} alt={idea.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-4">
                <ImageIcon size={64} />
                <span className="font-black uppercase tracking-widest text-xs">No Image Available</span>
              </div>
            )}
          </div>

          <div className="space-y-12">
            <section className="bg-red-50/40 p-8 rounded-[32px] border border-red-50/50">
              <h2 className="text-sm font-black text-red-600 mb-4 flex items-center gap-3 uppercase tracking-[0.2em]">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span> The Problem
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg font-medium">{idea.problemStatement}</p>
            </section>
            
            <section className="bg-emerald-50/40 p-8 rounded-[32px] border border-emerald-50/50">
              <h2 className="text-sm font-black text-emerald-700 mb-4 flex items-center gap-3 uppercase tracking-[0.2em]">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span> The Solution
              </h2>
              <p className="text-gray-800 leading-relaxed text-xl font-black">{idea.solution}</p>
            </section>

            <section className="px-2">
              <h2 className="text-sm font-black text-gray-900 mb-6 uppercase tracking-[0.2em] flex items-center gap-2">
                📝 Full Details
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line font-medium">{idea.description}</p>
            </section>
          </div>
        </div>

        {/* Voting Section */}
        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-8 md:p-12 mb-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-black text-gray-900 mb-2">Impact Rating</h2>
            <p className="text-gray-400 font-medium">Do you think this idea can make a difference?</p>
          </div>
          
          <div className="flex items-center bg-gray-50 p-3 rounded-[2.5rem] border border-gray-100 gap-3">
            <button
              onClick={() => handleVote(1)}
              disabled={voting}
              className={`flex items-center gap-3 px-8 md:px-12 py-5 rounded-[2rem] font-black transition-all active:scale-95 shadow-sm ${
                idea.userVote === 1
                  ? 'bg-emerald-600 text-white shadow-emerald-200 shadow-xl'
                  : 'bg-white text-gray-700 hover:bg-emerald-50 border border-transparent'
              }`}
            >
              <ThumbsUp size={20} />
              <span className="text-xl">{idea.upvotes || 0}</span>
            </button>

            <button
              onClick={() => handleVote(-1)}
              disabled={voting}
              className={`flex items-center gap-3 px-8 md:px-12 py-5 rounded-[2rem] font-black transition-all active:scale-95 shadow-sm ${
                idea.userVote === -1
                  ? 'bg-red-500 text-white shadow-red-200 shadow-xl'
                  : 'bg-white text-gray-700 hover:bg-red-50 border border-transparent'
              }`}
            >
              <ThumbsDown size={20} />
              <span className="text-xl">{idea.downvotes || 0}</span>
            </button>
          </div>
        </div>

        {/* Admin Actions */}
        {user?.role === 'ADMIN' && (
          <div className="bg-gray-900 text-white rounded-[40px] p-8 md:p-12 mb-8 shadow-2xl border border-gray-800">
            <h2 className="text-xl font-black mb-8 flex items-center gap-3">
              <ShieldAlert className="text-orange-500" />
              Admin Control Panel
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => handleAdminAction('APPROVED')}
                className="bg-emerald-600 hover:bg-emerald-500 py-5 rounded-[2rem] font-black transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                Approve Idea
              </button>
              <button
                onClick={() => handleAdminAction('REJECTED')}
                className="bg-red-600 hover:bg-red-500 py-5 rounded-[2rem] font-black transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                Reject Idea
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}