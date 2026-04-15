'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

export default function IdeaDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [idea, setIdea] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [voting, setVoting] = useState(false);

  
  if (id === 'create') return null;

  const fetchIdea = useCallback(async () => {
    try {
      const res = await api.get(`/ideas/${id}`);
      setIdea(res.data);
    } catch (error: any) {
      if (error.response?.status === 403) {
        router.push(`/ideas/${id}/purchase`);
      }
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
    fetchIdea();
  }, [id, fetchIdea]);

  const handleVote = async (value: number) => {
    if (!user) {
      toast.error('ভোট দিতে আগে লগইন করুন!');
      return router.push('/login');
    }
    
    setVoting(true);
    try {
      await api.post(`/votes/${id}/vote`, { value });
      toast.success(value === 1 ? 'Upvoted! 👍' : 'Downvoted! 👎');
      fetchIdea(); 
    } catch (error: any) {
      console.error('Vote Error:', error);
      toast.error(error.response?.data?.message || 'Failed to vote!');
    } finally {
      setVoting(false);
    }
  };

  const handleAdminAction = async (status: string) => {
    try {
      let feedbackNote = '';
      if (status === 'REJECTED') {
        feedbackNote = prompt('Enter rejection reason:') || '';
      }
      await api.patch(`/admin/ideas/${id}/status`, { status, feedbackNote });
      toast.success(`Idea ${status.toLowerCase()}!`);
      fetchIdea();
    } catch (error) {
      toast.error('Failed to update status!');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
    </div>
  );

  if (!idea) return (
    <div className="text-center py-24 bg-white min-h-screen">
      <div className="text-6xl mb-4">🔍</div>
      <h2 className="text-2xl font-black text-gray-400">Idea not found!</h2>
      <Link href="/ideas" className="text-emerald-600 font-bold underline mt-4 block">Back to All Ideas</Link>
    </div>
  );

  const upvotes = idea.upvotes || 0;
  const downvotes = idea.downvotes || 0;
  const userVote = idea.userVote;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Back Button */}
        <Link href="/ideas" className="text-emerald-700 hover:text-emerald-800 text-sm mb-8 flex items-center gap-2 font-black uppercase tracking-wider">
          ← Back to All Ideas
        </Link>

        {/* Main Content Card */}
        <div className="bg-white rounded-[48px] shadow-sm border border-gray-100 p-8 md:p-14 mb-8">
          <div className="flex flex-wrap gap-3 mb-8">
            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full">
              {idea.category?.name || 'Idea'}
            </span>
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full ${
              idea.type === 'PAID' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
            }`}>
              {idea.type === 'PAID' ? `৳${idea.price} • Premium` : 'Free Access'}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 leading-[1.1]">{idea.title}</h1>

          <div className="flex items-center gap-5 text-sm text-gray-400 mb-10 pb-10 border-b border-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-black shadow-lg shadow-emerald-100">
                {idea.author?.name?.charAt(0)}
              </div>
              <div>
                <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Published by</p>
                <span className="font-bold text-gray-900">{idea.author?.name}</span>
              </div>
            </div>
            <div className="w-px h-8 bg-gray-100 mx-2"></div>
            <span>📅 {new Date(idea.createdAt).toLocaleDateString('bn-BD')}</span>
          </div>

          {idea.images?.length > 0 && (
            <img src={idea.images[0]} alt={idea.title} className="w-full h-[450px] object-cover rounded-[40px] mb-12 shadow-2xl" />
          )}

          <div className="space-y-12">
            <section className="bg-red-50/30 p-8 rounded-[32px] border border-red-50">
              <h2 className="text-lg font-black text-red-600 mb-4 flex items-center gap-3 uppercase tracking-widest">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span> The Problem
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg font-medium">{idea.problemStatement}</p>
            </section>
            
            <section className="bg-emerald-50/30 p-8 rounded-[32px] border border-emerald-50">
              <h2 className="text-lg font-black text-emerald-700 mb-4 flex items-center gap-3 uppercase tracking-widest">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span> The Solution
              </h2>
              <p className="text-gray-800 leading-relaxed text-lg font-bold">{idea.solution}</p>
            </section>

            <section className="p-2">
              <h2 className="text-lg font-black text-gray-900 mb-4 uppercase tracking-widest">📝 Full Details</h2>
              <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">{idea.description}</p>
            </section>
          </div>
        </div>

        {/* Voting Section */}
        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-10 mb-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-1">Impact Rating</h2>
            <p className="text-gray-400 font-medium">Do you think this idea can save the planet?</p>
          </div>
          
          <div className="flex items-center bg-gray-50 p-3 rounded-[2.5rem] border border-gray-100 gap-3">
            <button
              onClick={() => handleVote(1)}
              disabled={voting}
              className={`flex items-center gap-3 px-10 py-5 rounded-[2rem] font-black transition-all active:scale-95 shadow-sm ${
                userVote === 1
                  ? 'bg-blue-600 text-white shadow-blue-100 shadow-xl'
                  : 'bg-white text-gray-700 hover:bg-blue-50 border border-transparent'
              }`}
            >
              👍 <span className="text-xl">{upvotes}</span>
            </button>

            <button
              onClick={() => handleVote(-1)}
              disabled={voting}
              className={`flex items-center gap-3 px-10 py-5 rounded-[2rem] font-black transition-all active:scale-95 shadow-sm ${
                userVote === -1
                  ? 'bg-red-500 text-white shadow-red-100 shadow-xl'
                  : 'bg-white text-gray-700 hover:bg-red-50 border border-transparent'
              }`}
            >
              👎 <span className="text-xl">{downvotes}</span>
            </button>
          </div>
        </div>

        {/* Admin Actions */}
        {user?.role === 'ADMIN' && (
          <div className="bg-gray-900 text-white rounded-[40px] p-10 mb-8 shadow-2xl">
            <h2 className="text-xl font-black mb-8 flex items-center gap-3">
              <span className="p-2 bg-gray-800 rounded-xl font-normal">⚙️</span> 
              Admin Control Panel
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleAdminAction('APPROVED')}
                className="bg-emerald-600 hover:bg-emerald-500 py-5 rounded-[2rem] font-black transition-all active:scale-95"
              >
                Approve Idea
              </button>
              <button
                onClick={() => handleAdminAction('REJECTED')}
                className="bg-red-600 hover:bg-red-500 py-5 rounded-[2rem] font-black transition-all active:scale-95"
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