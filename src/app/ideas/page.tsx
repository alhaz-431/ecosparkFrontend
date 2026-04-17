'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';
import toast, { Toaster } from 'react-hot-toast';
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  ThumbsUp, 
  ShoppingCart,
  Plus
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function IdeasPage() {
  const router = useRouter();
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('recent');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [votingId, setVotingId] = useState<string | null>(null);

  const categories = ["Energy", "Waste", "Transportation", "Water", "Farming"];

  const fetchIdeas = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/ideas?search=${search}&category=${category}&sort=${sort}&page=${page}&limit=10`);
      const fetchedData = res.data?.data || res.data?.ideas || res.data || [];
      setIdeas(Array.isArray(fetchedData) ? fetchedData : []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error: any) {
      console.error("Fetch error:", error);
      toast.error('আইডিয়া লোড করতে সমস্যা হচ্ছে!');
    } finally {
      setLoading(false);
    }
  }, [search, category, sort, page]);

  useEffect(() => {
    fetchIdeas();
  }, [fetchIdeas]);

  const handlePurchaseNavigation = (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('কেনার আগে লগইন করুন!');
      router.push('/login');
      return;
    }
    router.push(`/purchase/${id}`); 
  };

  // --- ভোট ফাংশন (পুরোপুরি ঠিক করা হয়েছে) ---
  const handleVote = async (id: string, direction: 'up' | 'down') => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to vote');
      return;
    }

    setVotingId(id);
    try {
      // আপনার ব্যাকএন্ড কন্ট্রোলার অনুযায়ী value: 1 বা -1 পাঠাতে হবে
      const voteValue = direction === 'up' ? 1 : -1;
      
      // পাথ: /api/votes/:id/vote
      const res = await api.post(`/votes/${id}/vote`, { value: voteValue });
      
      if (res.status === 200 || res.status === 201) {
        toast.success(res.data.message === 'Vote removed' ? 'Vote removed' : 'Vote recorded!');
        fetchIdeas(); // সংখ্যা আপডেট করার জন্য পুনরায় কল
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Voting failed');
    } finally {
      setVotingId(null);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen pt-28 pb-12 px-6">
      <Toaster position="top-center" />
      
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter">Community Ideas</h1>
          <p className="text-gray-500 font-medium mb-8 text-lg">Explore and support sustainable projects from our community.</p>
          <Link 
            href="/ideas/create"
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 active:scale-95"
          >
            <Plus size={20} /> Share New Idea
          </Link>
        </div>

        {/* Filters & Search Section */}
        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 mb-10 flex flex-col lg:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search ideas..." 
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl outline-none focus:ring-2 ring-emerald-500/20 transition-all font-medium"
            />
          </div>
          
          <div className="flex flex-wrap gap-4 w-full lg:w-auto">
            <select 
              value={category}
              onChange={(e) => { setCategory(e.target.value); setPage(1); }}
              className="bg-gray-50 px-4 py-3 rounded-2xl outline-none font-bold text-gray-700 cursor-pointer border-none"
            >
              <option value="">All Categories</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>

            <select 
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
              className="bg-gray-50 px-4 py-3 rounded-2xl outline-none font-bold text-gray-700 cursor-pointer border-none"
            >
              <option value="recent">Recent First</option>
              <option value="top_voted">Top Voted</option>
            </select>
          </div>
        </div>

        {/* Ideas Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
            {[1, 2, 3].map(i => <div key={i} className="h-[450px] bg-white rounded-[32px] border border-gray-100"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ideas.map((idea) => (
              <motion.div 
                key={idea.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all flex flex-col"
              >
                {/* Image Section */}
                <div className="h-56 bg-gray-100 relative overflow-hidden">
                  <img 
                    src={idea.images?.[0] || `https://picsum.photos/seed/${idea.id}/800/600`} 
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                    alt={idea.title}
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${idea.type === 'PAID' ? 'bg-amber-400 text-white' : 'bg-emerald-500 text-white'}`}>
                      {idea.type === 'PAID' ? 'Premium' : 'Free Idea'}
                    </span>
                  </div>
                </div>
                
                {/* Content Section */}
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-2xl font-black text-gray-900 mb-3 line-clamp-1 tracking-tight">{idea.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-8 font-medium flex-1 leading-relaxed">{idea.description}</p>
                  
                  {/* Vote & Action Section (সংশোধিত) */}
                  <div className="flex items-center justify-between pt-6 border-t border-gray-50 mt-auto">
                    <div className="flex items-center gap-4">
                      {/* Upvote Button */}
                      <button 
                        onClick={() => handleVote(idea.id, 'up')}
                        disabled={votingId === idea.id}
                        className={`flex items-center gap-1 transition-colors font-black text-xs uppercase tracking-widest ${idea.userVote === 1 ? 'text-emerald-600' : 'text-gray-400 hover:text-emerald-500'}`}
                      >
                        <ThumbsUp size={18} className={idea.userVote === 1 ? 'fill-emerald-600' : ''} /> 
                        {idea.upvotes || 0}
                      </button>

                      {/* Downvote Button (উল্টানো থাম্বস-আপ) */}
                      <button 
                        onClick={() => handleVote(idea.id, 'down')}
                        disabled={votingId === idea.id}
                        className={`flex items-center gap-1 transition-colors font-black text-xs uppercase tracking-widest ${idea.userVote === -1 ? 'text-red-600' : 'text-gray-400 hover:text-red-500'}`}
                      >
                        <ThumbsUp size={18} className={`rotate-180 ${idea.userVote === -1 ? 'fill-red-600' : ''}`} /> 
                        {idea.downvotes || 0}
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      {idea.type === 'PAID' ? (
                        <button 
                          onClick={() => handlePurchaseNavigation(idea.id)}
                          className="bg-emerald-600 text-white pl-5 pr-2 py-2 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-emerald-700 flex items-center gap-3 transition-all active:scale-95 group/btn"
                        >
                          ৳{idea.price || '0'} 
                          <span className="bg-emerald-500 p-2 rounded-xl group-hover/btn:bg-emerald-400 transition-colors">
                            <ShoppingCart size={16} />
                          </span>
                        </button>
                      ) : (
                        <Link 
                          href={`/ideas/${idea.id}`}
                          className="bg-gray-900 text-white px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-emerald-600 transition-all active:scale-95"
                        >
                          View Details
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination Section */}
        {totalPages > 1 && (
          <div className="mt-16 flex justify-center items-center gap-6">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 disabled:opacity-30 hover:border-emerald-500 transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <span className="font-black text-gray-900 text-lg tracking-tighter">Page {page} / {totalPages}</span>
            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 disabled:opacity-30 hover:border-emerald-500 transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}