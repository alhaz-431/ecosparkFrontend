'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import toast, { Toaster } from 'react-hot-toast';
import { 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  ThumbsUp, 
  ThumbsDown,
  Calendar,
  Tag,
  ArrowUpDown
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
      setIdeas(res.data.ideas || res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load ideas');
    } finally {
      setLoading(false);
    }
  }, [search, category, sort, page]);

  useEffect(() => {
    fetchIdeas();
  }, [fetchIdeas]);

  const handleVote = async (id: string, type: 'up' | 'down') => {
    setVotingId(id);
    try {
      await api.post(`/ideas/${id}/vote`, { type });
      toast.success('Vote recorded!');
      fetchIdeas(); // রিফ্রেশ ডাটা
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Voting failed');
    } finally {
      setVotingId(null);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-6">
      <Toaster position="top-center" />
      
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter">Community Ideas</h1>
          <p className="text-gray-500 font-medium">Explore and support sustainable projects from our community.</p>
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
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Ideas Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 4, 5].map(i => <div key={i} className="h-64 bg-white rounded-3xl animate-pulse"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {ideas.length > 0 ? (
              ideas.map((idea) => (
                <motion.div 
                  key={idea.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 group hover:shadow-xl hover:shadow-emerald-100/20 transition-all"
                >
                  <div className="w-full md:w-48 h-48 bg-gray-50 rounded-3xl overflow-hidden shrink-0">
                    <img 
                      src={idea.images?.[0] || 'https://picsum.photos/seed/eco/400/400'} 
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                          {idea.category?.name || idea.category || 'General'}
                        </span>
                        {idea.isPaid && (
                          <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                            Paid
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-black text-gray-900 mb-2 line-clamp-1">{idea.title}</h3>
                      <p className="text-gray-500 text-sm line-clamp-2 mb-4 font-medium">{idea.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => handleVote(idea.id, 'up')}
                          disabled={votingId === idea.id}
                          className="flex items-center gap-1.5 text-gray-500 hover:text-emerald-600 transition-colors font-bold text-sm"
                        >
                          <ThumbsUp size={18} /> {idea.upvotes || 0}
                        </button>
                        <button 
                          onClick={() => handleVote(idea.id, 'down')}
                          disabled={votingId === idea.id}
                          className="flex items-center gap-1.5 text-gray-500 hover:text-rose-600 transition-colors font-bold text-sm"
                        >
                          <ThumbsDown size={18} /> {idea.downvotes || 0}
                        </button>
                      </div>
                      <Link 
                        href={`/ideas/${idea.id}`}
                        className="text-emerald-600 font-black text-sm underline"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-white rounded-[40px] border border-dashed border-gray-200">
                <p className="text-gray-400 font-black uppercase tracking-widest">No ideas found</p>
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
              className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 disabled:opacity-50 hover:bg-gray-50 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="font-black text-gray-900">Page {page} of {totalPages}</span>
            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 disabled:opacity-50 hover:bg-gray-50 transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
