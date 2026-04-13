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

  // ১. fetchIdeas ফাংশনটি এখানে ডিফাইন করা হয়েছে
  const fetchIdeas = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/ideas'); // আপনার API এন্ডপয়েন্ট
      setIdeas(res.data.ideas || res.data.data || []);
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

    // ২. Optimistic UI: ক্লিক করলেই কালার ও সংখ্যা পাল্টে যাবে
    const previousIdeas = [...ideas];
    const updatedIdeas = ideas.map((idea) => {
      if (idea.id === ideaId) {
        const isRemoving = idea.userVote === voteValue;
        
        return {
          ...idea,
          upvotes: voteType === 'UPVOTE' 
            ? (isRemoving ? (idea.upvotes || 0) - 1 : (idea.upvotes || 0) + 1) 
            : (idea.userVote === 1 ? (idea.upvotes || 0) - 1 : (idea.upvotes || 0)),
          downvotes: voteType === 'DOWNVOTE' 
            ? (isRemoving ? (idea.downvotes || 0) - 1 : (idea.downvotes || 0) + 1) 
            : (idea.userVote === -1 ? (idea.downvotes || 0) - 1 : (idea.downvotes || 0)),
          userVote: isRemoving ? 0 : voteValue,
        };
      }
      return idea;
    });
    setIdeas(updatedIdeas);

    try {
      // ব্যাকএন্ড কল
      const res = await api.post(`/votes/${ideaId}/vote`, { value: voteValue });
      toast.success(res.data.message || 'ভোট সফল হয়েছে! 🎉');
      // নোট: এখানে fetchIdeas() কল করার দরকার নেই, এতে লোডিং এড়ানো যাবে
    } catch (error: any) {
      // ৩. যদি সার্ভারে এরর হয়, তবে আগের অবস্থায় ফিরে যাবে
      setIdeas(previousIdeas); 
      const msg = error.response?.data?.message || 'ভোট দেওয়া সম্ভব হয়নি।';
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-black">
      <h1 className="text-3xl font-bold mb-8 text-center text-green-800">Sustainability Ideas 🌱</h1>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
           {[1, 2, 3].map((i) => <div key={i} className="h-64 bg-gray-200 rounded-3xl"></div>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ideas.map((idea) => (
            <div key={idea.id} className="bg-white rounded-[2.5rem] shadow-sm border p-6 flex flex-col">
              <h3 className="font-bold text-xl mb-4 text-gray-800">{idea.title}</h3>
              
              <div className="pt-4 border-t flex items-center justify-between mt-auto">
                <div className="flex items-center bg-gray-100 rounded-full px-1 py-1">
                  
                  {/* Upvote Button */}
                  <button 
                    onClick={() => handleVote(idea.id, 'UPVOTE')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-200 ${
                      idea.userVote === 1 
                        ? 'bg-blue-600 text-white shadow-lg scale-110' 
                        : 'hover:bg-white text-gray-600'
                    }`}
                  >
                    <span className="text-xl">👍</span>
                    <span className="font-extrabold text-sm">{idea.upvotes || 0}</span>
                  </button>

                  <div className="w-[1px] h-4 bg-gray-300 mx-1"></div>

                  {/* Downvote Button */}
                  <button 
                    onClick={() => handleVote(idea.id, 'DOWNVOTE')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-200 ${
                      idea.userVote === -1 
                        ? 'bg-red-500 text-white shadow-lg scale-110' 
                        : 'hover:bg-white text-gray-600'
                    }`}
                  >
                    <span className="text-xl">👎</span>
                    <span className="font-extrabold text-sm">{idea.downvotes || 0}</span>
                  </button>
                </div>

                <Link 
                  href={`/ideas/${idea.id}`}
                  className="bg-green-700 text-white px-6 py-3 rounded-full text-xs font-black hover:bg-green-800 transition-colors"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}