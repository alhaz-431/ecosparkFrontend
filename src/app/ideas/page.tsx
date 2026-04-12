'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [votingId, setVotingId] = useState<string | null>(null); // ভোট দেওয়ার সময় লোডিং ট্র্যাকার

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

  // --- নতুন ভোট হ্যান্ডেলার ফাংশন ---
  const handleVote = async (ideaId: string, voteType: 'UPVOTE' | 'DOWNVOTE') => {
    setVotingId(ideaId); // নির্দিষ্ট কার্ডে লোডিং দেখাবে
    try {
      // আপনার ব্যাকএন্ড এন্ডপয়েন্ট অনুযায়ী রিকোয়েস্ট
      await api.post(`/votes/${ideaId}`, { type: voteType });
      
      // ভোট দেওয়ার পর শুধু ওই আইডিয়াটির ডাটা আপডেট করা (UI রিফ্রেশ ছাড়া)
      setIdeas(prevIdeas => 
        prevIdeas.map(idea => {
          if (idea.id === ideaId) {
            const upChange = voteType === 'UPVOTE' ? 1 : 0;
            const downChange = voteType === 'DOWNVOTE' ? 1 : 0;
            return { 
              ...idea, 
              upvotes: (idea.upvotes || 0) + upChange, 
              downvotes: (idea.downvotes || 0) + downChange 
            };
          }
          return idea;
        })
      );
    } catch (error: any) {
      alert(error.response?.data?.message || 'Voting failed! Please login first.');
    } finally {
      setVotingId(null);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchIdeas();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-green-800 to-emerald-600 py-16 px-6 text-center text-white">
        <h1 className="text-4xl font-extrabold mb-4">🌱 All Sustainability Ideas</h1>
        <p className="text-green-100 text-lg mb-8">Browse, vote and get inspired by community ideas</p>
        <form onSubmit={handleSearch} className="flex justify-center gap-2 max-w-xl mx-auto">
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
                  className="w-full border p-2.5 rounded-xl text-sm outline-none text-black"
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
                  className="w-full border p-2.5 rounded-xl text-sm outline-none text-black"
                >
                  <option value="">Free & Paid</option>
                  <option value="FREE">🆓 Free Only</option>
                  <option value="PAID">💰 Paid Only</option>
                </select>
              </div>
              <div className="bg-green-50 p-4 rounded-xl text-center border border-green-100 mt-4">
                <Link href="/user/dashboard" className="bg-green-700 text-white px-4 py-2 rounded-full text-sm hover:bg-green-800 transition block">
                  Share Now 🌱
                </Link>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content (Ideas Grid) */}
        <main className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-80 bg-gray-200 rounded-3xl"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 text-black">
              {ideas.map((idea) => (
                <div key={idea.id} className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col border border-gray-100">
                  <div className="relative h-48 bg-slate-200 overflow-hidden">
                    <img
                      src={idea.images?.[0] || 'https://via.placeholder.com/400x300?text=Sustainability+Idea'}
                      alt={idea.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-lg ${
                        idea.type === 'PAID' ? 'bg-orange-500 text-white' : 'bg-green-500 text-white'
                      }`}>
                        {idea.type === 'PAID' ? `💰 ৳${idea.price}` : '🆓 Free'}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <span className="text-[10px] font-black text-emerald-600 mb-1 uppercase tracking-widest">
                      {idea.category?.name || idea.category || 'Environmental'}
                    </span>
                    <h3 className="font-black text-xl text-gray-900 line-clamp-1 mb-2">
                      {idea.title}
                    </h3>
                    <p className="text-gray-500 text-xs line-clamp-2 mb-6 flex-1">
                      {idea.description}
                    </p>

                    <div className="pt-4 border-t flex items-center justify-between">
                      {/* --- ভোট বাটন (আপডেটেড) --- */}
                      <div className="flex gap-4 text-xs font-black">
                        <button 
                          onClick={() => handleVote(idea.id, 'UPVOTE')}
                          disabled={votingId === idea.id}
                          className="flex items-center gap-1 text-gray-400 hover:text-green-600 transition disabled:opacity-50"
                        >
                          👍 {idea.upvotes || 0}
                        </button>
                        <button 
                          onClick={() => handleVote(idea.id, 'DOWNVOTE')}
                          disabled={votingId === idea.id}
                          className="flex items-center gap-1 text-gray-400 hover:text-red-600 transition disabled:opacity-50"
                        >
                          👎 {idea.downvotes || 0}
                        </button>
                      </div>
                      
                      {idea.type === 'PAID' ? (
                        <Link
                          href={`/ideas/${idea.id}/purchase?title=${encodeURIComponent(idea.title)}&price=${idea.price}`}
                          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-xl text-xs font-black transition-all shadow-md active:scale-95"
                        >
                          Buy Access 💰
                        </Link>
                      ) : (
                        <Link
                          href={`/ideas/${idea.id}`}
                          className="bg-green-700 hover:bg-green-800 text-white px-5 py-2 rounded-xl text-xs font-black transition-all shadow-md active:scale-95"
                        >
                          View Idea →
                        </Link>
                      )}
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