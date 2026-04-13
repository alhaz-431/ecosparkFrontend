'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [votingId, setVotingId] = useState<string | null>(null);
  const router = useRouter();

  const fetchIdeas = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/ideas');
      const fetchedIdeas = res.data.ideas || res.data.data || [];
      setIdeas(Array.isArray(fetchedIdeas) ? fetchedIdeas : []);
    } catch (error) {
      console.error('Fetch Error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIdeas();
  }, [fetchIdeas]);

  const handleVote = async (ideaId: string, voteType: 'UPVOTE' | 'DOWNVOTE') => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('ভোট দিতে আগে লগইন করুন!');
      return router.push('/login');
    }

    const voteValue = voteType === 'UPVOTE' ? 1 : -1;
    setVotingId(ideaId);

    // Optimistic Update: ক্লিক করার সাথে সাথেই UI আপডেট হবে
    const previousIdeas = [...ideas];
    const updatedIdeas = ideas.map((idea) => {
      if (idea.id === ideaId) {
        const isRemoving = idea.userVote === voteValue;
        return {
          ...idea,
          upvotes: voteType === 'UPVOTE' 
            ? (isRemoving ? (idea.upvotes || 0) - 1 : (idea.userVote === -1 ? (idea.upvotes || 0) + 1 : (idea.upvotes || 0) + 1)) 
            : (idea.userVote === 1 ? (idea.upvotes || 0) - 1 : (idea.upvotes || 0)),
          downvotes: voteType === 'DOWNVOTE' 
            ? (isRemoving ? (idea.downvotes || 0) - 1 : (idea.userVote === 1 ? (idea.downvotes || 0) + 1 : (idea.downvotes || 0) + 1)) 
            : (idea.userVote === -1 ? (idea.downvotes || 0) - 1 : (idea.downvotes || 0)),
          userVote: isRemoving ? 0 : voteValue,
        };
      }
      return idea;
    });
    setIdeas(updatedIdeas);

    try {
      const res = await api.post(`/votes/${ideaId}/vote`, { value: voteValue });
      toast.success(res.data.message || 'ভোট সফল হয়েছে!');
    } catch (error: any) {
      setIdeas(previousIdeas); 
      toast.error(error.response?.data?.message || 'ভোট দেওয়া সম্ভব হয়নি।');
    } finally {
      setVotingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      {/* Header Section - */}
      <section className="bg-gradient-to-br from-green-800 to-emerald-600 py-16 px-6 text-center text-white">
        <h1 className="text-4xl font-extrabold mb-4">🌱 EcoSpark Ideas</h1>
        <p className="text-green-100 text-lg mb-8 text-white">Sustainability প্রজেক্টে ভোট দিন এবং অংশগ্রহণ করুন</p>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col lg:flex-row gap-8">
        {/* Filter Section - */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow p-6 border">
            <h3 className="font-bold text-gray-800 mb-4">🔍 Filters</h3>
            <div className="space-y-4">
               <select className="w-full border p-2.5 rounded-xl text-sm outline-none text-black bg-white">
                  <option value="">All Categories</option>
                  <option value="Water">Water</option>
                  <option value="Recycling">Recycling</option>
               </select>
               <select className="w-full border p-2.5 rounded-xl text-sm outline-none text-black bg-white">
                  <option value="">Free & Paid</option>
               </select>
            </div>
          </div>
        </aside>

        {/* Ideas Grid - */}
        <main className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse">
               {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="h-96 bg-gray-200 rounded-3xl"></div>)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {ideas.map((idea) => (
                <div key={idea.id} className="bg-white rounded-3xl shadow-md border border-gray-100 flex flex-col overflow-hidden">
                  
                  {/* Image Section - */}
                  <div className="relative h-48 bg-gray-200">
                    <img 
                      src={idea.images?.[0] || 'https://via.placeholder.com/400x300'} 
                      className="w-full h-full object-cover" 
                      alt={idea.title} 
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase text-white ${idea.type === 'PAID' ? 'bg-orange-500' : 'bg-green-500'}`}>
                        {idea.type === 'PAID' ? `৳${idea.price}` : 'Free'}
                      </span>
                    </div>
                  </div>

                  {/* Content Section - */}
                  <div className="p-6 flex-1 flex flex-col">
                    <span className="text-[10px] font-black text-emerald-600 mb-1 uppercase tracking-widest">{idea.category?.name || 'Idea'}</span>
                    <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-1">{idea.title}</h3>
                    <p className="text-gray-500 text-xs mb-6 line-clamp-2 flex-1">{idea.description}</p>

                    {/* Voting & Actions - */}
                    <div className="pt-4 border-t flex items-center justify-between mt-auto">
                      <div className="flex items-center bg-gray-100 rounded-2xl p-1 gap-1">
                        
                        {/* Upvote Button (👍) - */}
                        <button 
                          onClick={() => handleVote(idea.id, 'UPVOTE')}
                          disabled={votingId === idea.id}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all duration-200 ${
                            idea.userVote === 1 
                              ? 'bg-blue-600 text-white shadow-md' 
                              : 'hover:bg-white text-gray-600'
                          }`}
                        >
                          <span className="text-lg">👍</span>
                          <span className={`font-bold text-xs ${idea.userVote === 1 ? 'text-white' : 'text-gray-600'}`}>
                            {idea.upvotes || 0}
                          </span>
                        </button>
                        
                        <div className="w-[1px] h-4 bg-gray-300 mx-0.5"></div>

                        {/* Downvote Button (👎) - */}
                        <button 
                          onClick={() => handleVote(idea.id, 'DOWNVOTE')}
                          disabled={votingId === idea.id}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all duration-200 ${
                            idea.userVote === -1 
                              ? 'bg-red-500 text-white shadow-md' 
                              : 'hover:bg-white text-gray-600'
                          }`}
                        >
                          <span className="text-lg">👎</span>
                          <span className={`font-bold text-xs ${idea.userVote === -1 ? 'text-white' : 'text-gray-600'}`}>
                            {idea.downvotes || 0}
                          </span>
                        </button>
                      </div>

                      {/* View/Buy Link - */}
                      <Link 
                        href={idea.type === 'PAID' 
                          ? `/ideas/${idea.id}/purchase?title=${encodeURIComponent(idea.title)}&price=${idea.price}` 
                          : `/ideas/${idea.id}`
                        }
                        className={`px-4 py-2 rounded-xl text-xs font-black text-white transition-all active:scale-95 ${
                          idea.type === 'PAID' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-700 hover:bg-green-800'
                        }`}
                      >
                        {idea.type === 'PAID' ? 'Buy 💰' : 'View →'}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}