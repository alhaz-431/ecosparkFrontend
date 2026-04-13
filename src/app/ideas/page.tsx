'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [votingId, setVotingId] = useState<string | null>(null);
  
  // ফিল্টার স্টেটসমূহ
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");
  
  const router = useRouter();

  // ক্যাটাগরি লিস্ট (আপনার প্রজেক্টের থিম অনুযায়ী)
  const categories = [
    "All Categories", 
    "Waste Management", 
    "Recycling", 
    "Water", 
    "Renewable Energy", 
    "Sustainable Farming"
  ];

  const fetchIdeas = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/ideas');
      const fetchedIdeas = res.data.ideas || res.data.data || [];
      setIdeas(Array.isArray(fetchedIdeas) ? fetchedIdeas : []);
    } catch (error) {
      console.error('Fetch Error:', error);
      toast.error("আইডিয়াগুলো লোড করা সম্ভব হয়নি।");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIdeas();
  }, [fetchIdeas]);

  // ফিল্টারিং লজিক
  const filteredIdeas = useMemo(() => {
    return ideas.filter(idea => {
      const matchesCategory = selectedCategory === "" || 
                              idea.category?.name === selectedCategory || 
                              idea.category === selectedCategory;
      const matchesType = selectedType === "" || idea.type === selectedType;
      return matchesCategory && matchesType;
    });
  }, [ideas, selectedCategory, selectedType]);

  const handleVote = async (ideaId: string, voteType: 'UPVOTE' | 'DOWNVOTE') => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('ভোট দিতে আগে লগইন করুন!');
      return router.push('/login');
    }

    const voteValue = voteType === 'UPVOTE' ? 1 : -1;
    setVotingId(ideaId);

    const previousIdeas = [...ideas];
    const updatedIdeas = ideas.map((idea) => {
      if (idea.id === ideaId) {
        return {
          ...idea,
          upvotes: voteType === 'UPVOTE' ? (idea.userVote === 1 ? (idea.upvotes || 0) - 1 : (idea.upvotes || 0) + 1) : (idea.userVote === 1 ? (idea.upvotes || 0) - 1 : (idea.upvotes || 0)),
          downvotes: voteType === 'DOWNVOTE' ? (idea.userVote === -1 ? (idea.downvotes || 0) - 1 : (idea.downvotes || 0) + 1) : (idea.userVote === -1 ? (idea.downvotes || 0) - 1 : (idea.downvotes || 0)),
          userVote: idea.userVote === voteValue ? 0 : voteValue,
        };
      }
      return idea;
    });
    setIdeas(updatedIdeas);

    try {
      await api.post(`/votes/${ideaId}/vote`, { value: voteValue });
    } catch (error: any) {
      setIdeas(previousIdeas); 
      toast.error(error.response?.data?.message || 'ভোট দেওয়া সম্ভব হয়নি।');
    } finally {
      setVotingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-800 to-emerald-600 py-16 px-6 text-center text-white">
        <h1 className="text-4xl font-extrabold mb-4 font-black">🌱 EcoSpark Ideas</h1>
        <p className="text-green-50 text-lg mb-8 font-medium">Sustainability প্রজেক্টে ভোট দিন এবং অংশগ্রহণ করুন</p>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 sticky top-10">
            <h3 className="font-black text-gray-800 mb-4 uppercase text-xs tracking-widest">🔍 Filters</h3>
            <div className="space-y-4">
               {/* Category Dropdown */}
               <select 
                 value={selectedCategory}
                 onChange={(e) => setSelectedCategory(e.target.value)}
                 className="w-full border border-gray-200 p-3 rounded-xl text-sm outline-none text-black bg-gray-50 font-bold focus:border-emerald-500"
               >
                  {categories.map((cat) => (
                    <option key={cat} value={cat === "All Categories" ? "" : cat}>
                      {cat}
                    </option>
                  ))}
               </select>

               {/* Type Dropdown (Free/Paid) */}
               <select 
                 value={selectedType}
                 onChange={(e) => setSelectedType(e.target.value)}
                 className="w-full border border-gray-200 p-3 rounded-xl text-sm outline-none text-black bg-gray-50 font-bold focus:border-emerald-500"
               >
                  <option value="">Free & Paid</option>
                  <option value="FREE">Free Only</option>
                  <option value="PAID">Paid Only</option>
               </select>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse">
               {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="h-96 bg-gray-200 rounded-3xl"></div>)}
            </div>
          ) : filteredIdeas.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
              <p className="text-gray-400 font-bold text-lg">এই ক্যাটাগরিতে কোনো আইডিয়া পাওয়া যায়নি।</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredIdeas.map((idea) => (
                <div key={idea.id} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="relative h-48 bg-gray-100">
                    <img 
                      src={idea.images?.[0] || 'https://via.placeholder.com/400x300'} 
                      className="w-full h-full object-cover" 
                      alt={idea.title} 
                    />
                    <div className="absolute top-4 right-4">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase text-white shadow-lg ${idea.type === 'PAID' ? 'bg-orange-500' : 'bg-green-600'}`}>
                        {idea.type === 'PAID' ? `৳${idea.price || 0}` : 'Free'}
                      </span>
                    </div>
                  </div>

                  <div className="p-7 flex-1 flex flex-col">
                    <span className="text-[10px] font-black text-emerald-600 mb-2 uppercase tracking-[0.2em]">{idea.category?.name || idea.category || 'Idea'}</span>
                    <h3 className="font-black text-xl text-gray-900 mb-3 line-clamp-1 leading-tight">{idea.title}</h3>
                    <p className="text-gray-500 text-sm mb-6 line-clamp-2 flex-1 font-medium">{idea.description}</p>

                    <div className="pt-5 border-t border-gray-50 flex items-center justify-between mt-auto">
                      {/* Vote Buttons */}
                      <div className="flex items-center bg-gray-50 border border-gray-100 rounded-2xl p-1 gap-1">
                        <button 
                          onClick={() => handleVote(idea.id, 'UPVOTE')}
                          disabled={votingId === idea.id}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                            idea.userVote === 1 ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-white text-gray-500'
                          }`}
                        >
                          <span className="text-lg">👍</span>
                          <span className="font-black text-xs">{idea.upvotes || 0}</span>
                        </button>
                        
                        <div className="w-[1px] h-4 bg-gray-200 mx-1"></div>

                        <button 
                          onClick={() => handleVote(idea.id, 'DOWNVOTE')}
                          disabled={votingId === idea.id}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                            idea.userVote === -1 ? 'bg-red-500 text-white shadow-lg' : 'hover:bg-white text-gray-500'
                          }`}
                        >
                          <span className="text-lg">👎</span>
                          <span className="font-black text-xs">{idea.downvotes || 0}</span>
                        </button>
                      </div>

                      {/* Action Button */}
                      <Link 
                        href={idea.type === 'PAID' 
                          ? `/ideas/${idea.id}/purchase?title=${encodeURIComponent(idea.title)}&price=${idea.price || 0}` 
                          : `/ideas/${idea.id}`
                        }
                        className={`px-6 py-3 rounded-2xl text-xs font-black text-white shadow-lg transition-all active:scale-95 ${
                          idea.type === 'PAID' ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-100' : 'bg-emerald-800 hover:bg-emerald-900 shadow-emerald-100'
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