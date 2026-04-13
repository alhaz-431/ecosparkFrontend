'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [votingId, setVotingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchIdeas();
  }, [page, category, type, sort]);

  const fetchIdeas = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      if (type) params.append('type', type);
      if (sort) params.append('sort', sort);
      params.append('page', page.toString());
      
      const res = await api.get(`/ideas?${params.toString()}`);
      setIdeas(res.data.ideas || res.data.data || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Fetch Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // ভোট দেওয়ার ফাংশন (ফিক্সড)
  const handleVote = async (ideaId: string, voteType: 'UPVOTE' | 'DOWNVOTE') => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      toast.error('Please login to vote!');
      return router.push('/login');
    }

    const voteValue = voteType === 'UPVOTE' ? 1 : -1;
    setVotingId(ideaId);

    try {
      // আপনার ব্যাকএন্ড রাউট /:id/vote অনুযায়ী এখানে রিকোয়েস্ট পাঠানো হচ্ছে
      const res = await api.post(`/votes/${ideaId}/vote`, { value: voteValue }); 
      
      toast.success(res.data.message || 'ভোট সফল হয়েছে! 🎉');
      fetchIdeas(); 

    } catch (error: any) {
      console.error("Voting Error Detail:", error);
      const msg = error.response?.data?.message || error.message || 'ভোট দেওয়া সম্ভব হয়নি।';
      toast.error(msg);
    } finally {
      setVotingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-green-800 to-emerald-600 py-16 px-6 text-center text-white">
        <h1 className="text-4xl font-extrabold mb-4 text-white">🌱 All Sustainability Ideas</h1>
        <p className="text-green-100 text-lg mb-8">Browse, vote and get inspired by community ideas</p>
        <form onSubmit={(e) => { e.preventDefault(); setPage(1); fetchIdeas(); }} className="flex justify-center gap-2 max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Search ideas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-4 rounded-xl text-gray-800 focus:outline-none shadow-lg"
          />
          <button type="submit" className="bg-white text-green-700 px-8 py-4 rounded-xl font-bold hover:bg-green-50 transition">
            Search
          </button>
        </form>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow p-6 sticky top-24 border">
            <h3 className="font-bold text-gray-800 mb-4">🔍 Filters</h3>
            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Category</label>
                <select
                  value={category}
                  onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                  className="w-full border p-2.5 rounded-xl text-sm outline-none text-black bg-white"
                >
                  <option value="">All Categories</option>
                  <option value="Energy">⚡ Energy</option>
                  <option value="Waste">♻️ Waste</option>
                  <option value="Transportation">🚗 Transportation</option>
                  <option value="Water">💧 Water</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Type</label>
                <select
                  value={type}
                  onChange={(e) => { setType(e.target.value); setPage(1); }}
                  className="w-full border p-2.5 rounded-xl text-sm outline-none text-black bg-white"
                >
                  <option value="">Free & Paid</option>
                  <option value="FREE">🆓 Free Only</option>
                  <option value="PAID">💰 Paid Only</option>
                </select>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Grid */}
        <main className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
              {[1, 2, 3, 4].map((i) => <div key={i} className="h-80 bg-gray-200 rounded-3xl"></div>)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {ideas.length === 0 ? (
                <div className="col-span-full text-center py-20 text-gray-400 italic">No ideas found.</div>
              ) : (
                ideas.map((idea) => (
                  <div key={idea.id} className="bg-white rounded-3xl shadow-md overflow-hidden flex flex-col border border-gray-100 hover:shadow-xl transition-all">
                    {/* Image Section */}
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

                    {/* Content Section */}
                    <div className="p-6 flex-1 flex flex-col">
                      <span className="text-[10px] font-black text-emerald-600 mb-1 uppercase tracking-widest">{idea.category?.name || 'Idea'}</span>
                      <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-1">{idea.title}</h3>
                      <p className="text-gray-500 text-xs mb-6 line-clamp-2 flex-1">{idea.description}</p>

                      {/* Bottom Actions */}
                      <div className="pt-4 border-t flex items-center justify-between mt-auto">
                        <div className="flex items-center bg-gray-100 rounded-2xl p-1 gap-1">
                          <button 
                            onClick={() => handleVote(idea.id, 'UPVOTE')}
                            disabled={votingId === idea.id}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-white text-gray-600 hover:text-green-600 transition-all disabled:opacity-50"
                          >
                            <span className="text-lg font-bold">▲</span>
                            <span className="font-bold text-xs">{idea.upvotes || 0}</span>
                          </button>
                          <div className="w-[1px] h-4 bg-gray-300"></div>
                          <button 
                            onClick={() => handleVote(idea.id, 'DOWNVOTE')}
                            disabled={votingId === idea.id}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-white text-gray-600 hover:text-red-600 transition-all disabled:opacity-50"
                          >
                            <span className="text-lg font-bold">▼</span>
                            <span className="font-bold text-xs">{idea.downvotes || 0}</span>
                          </button>
                        </div>

                        <Link 
                          href={idea.type === 'PAID' 
                            ? `/ideas/${idea.id}/purchase?title=${encodeURIComponent(idea.title)}&price=${idea.price}` 
                            : `/ideas/${idea.id}`}
                          className={`px-4 py-2 rounded-xl text-xs font-black text-white transition-all active:scale-95 ${idea.type === 'PAID' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-700 hover:bg-green-800'}`}
                        >
                          {idea.type === 'PAID' ? 'Buy 💰' : 'View →'}
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}