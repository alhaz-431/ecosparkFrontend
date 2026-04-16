'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import toast, { Toaster } from 'react-hot-toast';
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  ThumbsUp, 
  Lock,
  ShoppingCart,
  Plus
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function IdeasPage() {
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
      // আপনার দেওয়া লজিক অনুযায়ী ডাটা ফেচিং
      const fetchedData = res.data?.data || res.data?.ideas || res.data || [];
      setIdeas(Array.isArray(fetchedData) ? fetchedData : []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error: any) {
      console.error("Fetch error:", error);
      toast.error('আইডিয়া লোড করতে সমস্যা হচ্ছে!');
    } finally {
      setLoading(false);
    }
  }, [search, category, sort, page]);

  useEffect(() => {
    fetchIdeas();
  }, [fetchIdeas]);

  const handleVote = async (id: string, type: 'up' | 'down') => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to vote');
      return;
    }

    setVotingId(id);
    try {
      await api.post(`/ideas/${id}/vote`, { type });
      toast.success('Vote recorded!');
      fetchIdeas(); 
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
          <p className="text-gray-500 font-medium mb-8">Explore and support sustainable projects from our community.</p>
          <Link 
            href="/ideas/create"
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100"
          >
            <Plus size={20} /> Share New Idea
          </Link>
        </div>

        {/* Filters & Search */}
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
              className="bg-gray-50 px-4 py-3 rounded-2xl outline-none font-bold text-gray-700 cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>

            <select 
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
              className="bg-gray-50 px-4 py-3 rounded-2xl outline-none font-bold text-gray-700 cursor-pointer"
            >
              <option value="recent">Recent First</option>
              <option value="top_voted">Top Voted</option>
            </select>
          </div>
        </div>

        {/* Ideas Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-64 bg-white rounded-3xl"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {ideas.length > 0 ? (
              ideas.map((idea) => (
                <motion.div 
                  key={idea.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all flex flex-col"
                >
                  {/* Image Section */}
                  <div className="h-52 bg-gray-100 relative overflow-hidden">
                    <img 
                      src={idea.images?.[0] || `https://picsum.photos/seed/${idea.id}/800/600`} 
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                      referrerPolicy="no-referrer"
                      alt={idea.title || 'Idea Image'}
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur-md text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                        {idea.category?.name || idea.category || 'General'}
                      </span>
                    </div>
                    {idea.isPaid && (
                      <div className="absolute top-4 right-4">
                        <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm flex items-center gap-1">
                          <Lock size={10} /> Paid
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Content Section */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-black text-gray-900 mb-2 line-clamp-1">{idea.title}</h3>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-6 font-medium flex-1">{idea.description}</p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handleVote(idea.id, 'up')}
                          disabled={votingId === idea.id}
                          className="flex items-center gap-1.5 text-gray-500 hover:text-emerald-600 transition-colors font-bold text-xs"
                        >
                          <ThumbsUp size={16} /> {idea.upvotes || 0}
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        {idea.isPaid ? (
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">${idea.price || '10.00'}</span>
                            <Link 
                              href={`/purchase/${idea.id}`}
                              className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 shadow-lg shadow-emerald-100 flex items-center gap-2"
                            >
                              <ShoppingCart size={14} /> Buy Now
                            </Link>
                          </div>
                        ) : (
                          <Link 
                            href={`/ideas/${idea.id}`}
                            className="bg-gray-900 text-white px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700"
                          >
                            Details
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-white rounded-[48px] border border-gray-100">
                <p className="text-gray-400 font-black uppercase tracking-widest text-sm">No ideas found matching your criteria.</p>
                <button 
                  onClick={() => { setSearch(''); setCategory(''); setPage(1); }}
                  className="mt-4 text-emerald-600 font-black text-xs underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-16 flex justify-center items-center gap-4">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 disabled:opacity-50"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="font-black text-gray-900">Page {page} of {totalPages}</span>
            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 disabled:opacity-50"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}