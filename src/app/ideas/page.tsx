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

  const handleVote = async (ideaId: string, voteType: 'UPVOTE' | 'DOWNVOTE') => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('ভোট দিতে আগে লগইন করুন!');
      return router.push('/login');
    }

    const voteValue = voteType === 'UPVOTE' ? 1 : -1;
    setVotingId(ideaId);

    try {
      // ব্যাকএন্ড কল
      const res = await api.post(`/votes/${ideaId}/vote`, { value: voteValue });
      
      toast.success(res.data.message || 'ভোট আপডেট হয়েছে! 🎉');
      fetchIdeas(); // সংখ্যা আপডেট করার জন্য পুনরায় ফেচ

    } catch (error: any) {
      const msg = error.response?.data?.message || 'ভোট দেওয়া সম্ভব হয়নি।';
      toast.error(msg);
    } finally {
      setVotingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-800 to-emerald-600 py-16 px-6 text-center text-white">
        <h1 className="text-4xl font-extrabold mb-4">🌱 EcoSpark Ideas</h1>
        <p className="text-green-100 mb-8">সবুজ পৃথিবী গড়তে আপনার প্রিয় আইডিয়াটিতে ভোট দিন</p>
        <form onSubmit={(e) => { e.preventDefault(); setPage(1); fetchIdeas(); }} className="flex justify-center gap-2 max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Search ideas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-4 rounded-2xl text-gray-800 focus:ring-2 focus:ring-white outline-none"
          />
          <button type="submit" className="bg-white text-green-700 px-8 rounded-2xl font-bold hover:scale-105 transition">Search</button>
        </form>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col lg:flex-row gap-8">
        {/* Filters */}
        <aside className="w-full lg:w-64">
          <div className="bg-white rounded-3xl p-6 shadow-sm border sticky top-24">
            <h3 className="font-bold mb-4">🔍 ফিল্টার করুন</h3>
            <div className="space-y-4">
              <select onChange={(e) => { setCategory(e.target.value); setPage(1); }} className="w-full border p-3 rounded-xl bg-gray-50 outline-none">
                <option value="">সকল ক্যাটাগরি</option>
                <option value="Energy">Energy</option>
                <option value="Water">Water</option>
                <option value="Waste">Waste</option>
              </select>
              <select onChange={(e) => { setType(e.target.value); setPage(1); }} className="w-full border p-3 rounded-xl bg-gray-50 outline-none">
                <option value="">ফ্রি ও পেইড</option>
                <option value="FREE">Free</option>
                <option value="PAID">Paid</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Ideas Grid */}
        <main className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
              {[1, 2, 3, 4].map((i) => <div key={i} className="h-80 bg-gray-200 rounded-3xl"></div>)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {ideas.map((idea) => (
                <div key={idea.id} className="bg-white rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col overflow-hidden">
                  {/* Image */}
                  <div className="relative h-44">
                    <img src={idea.images?.[0] || 'https://via.placeholder.com/400x300'} className="w-full h-full object-cover" alt={idea.title} />
                    <span className={`absolute top-4 right-4 px-4 py-1 rounded-full text-[10px] font-black uppercase text-white ${idea.type === 'PAID' ? 'bg-orange-500' : 'bg-green-500'}`}>
                      {idea.type === 'PAID' ? `৳${idea.price}` : 'Free'}
                    </span>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="font-bold text-lg mb-2 line-clamp-1">{idea.title}</h3>
                    <p className="text-gray-500 text-xs mb-6 line-clamp-2">{idea.description}</p>

                    {/* Voting & Action - Facebook Style */}
                    <div className="pt-4 border-t flex items-center justify-between mt-auto">
                      <div className="flex items-center bg-gray-100 rounded-full px-1 py-1">
                        {/* Upvote */}
                        <button 
                          onClick={() => handleVote(idea.id, 'UPVOTE')}
                          disabled={votingId === idea.id}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-full transition-all active:scale-150 ${
                            idea.userVote === 1 ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-white text-gray-600'
                          }`}
                        >
                          <span className="text-lg">👍</span>
                          <span className="font-bold text-xs">{idea.upvotes || 0}</span>
                        </button>

                        <div className="w-[1px] h-4 bg-gray-300 mx-0.5"></div>

                        {/* Downvote */}
                        <button 
                          onClick={() => handleVote(idea.id, 'DOWNVOTE')}
                          disabled={votingId === idea.id}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-full transition-all active:scale-150 ${
                            idea.userVote === -1 ? 'bg-red-500 text-white shadow-md' : 'hover:bg-white text-gray-600'
                          }`}
                        >
                          <span className="text-lg">👎</span>
                          <span className="font-bold text-xs">{idea.downvotes || 0}</span>
                        </button>
                      </div>

                      <Link 
                        href={idea.type === 'PAID' 
                          ? `/ideas/${idea.id}/purchase?title=${encodeURIComponent(idea.title)}&price=${idea.price}` 
                          : `/ideas/${idea.id}`}
                        className={`px-4 py-2.5 rounded-full text-[11px] font-black text-white transition-all active:scale-90 ${
                          idea.type === 'PAID' ? 'bg-orange-500 shadow-orange-100' : 'bg-green-700 shadow-green-100'
                        } shadow-lg`}
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