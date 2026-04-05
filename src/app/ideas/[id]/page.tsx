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

  // ধাপ ৩: ডাটা ফেচ করা (API Connection)
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
      setIdeas(res.data.ideas || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchIdeas();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      {/* ধাপ ২: সার্চ বার (Header Section) */}
      <section className="bg-gradient-to-br from-green-800 to-emerald-600 py-16 px-6 text-center text-white">
        <h1 className="text-4xl font-extrabold mb-4 text-white">🌱 All Sustainability Ideas</h1>
        <p className="text-green-100 text-lg mb-8">Browse, vote and get inspired by community ideas</p>
        <form onSubmit={handleSearch} className="flex justify-center gap-2 max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Search ideas by title or keyword..."
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
        {/* ধাপ ২: ফিল্টার ড্রপডাউন (Sidebar) */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow p-6 sticky top-24 border dark:border-slate-800">
            <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <span>🔍</span> Filters
            </h3>
            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Category</label>
                <select
                  value={category}
                  onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                  className="w-full border dark:border-slate-700 p-2.5 rounded-xl text-sm dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
                >
                  <option value="">All Categories</option>
                  <option value="Energy">⚡ Energy</option>
                  <option value="Waste">♻️ Waste</option>
                  <option value="Transportation">🚗 Transportation</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Type</label>
                <select
                  value={type}
                  onChange={(e) => { setType(e.target.value); setPage(1); }}
                  className="w-full border dark:border-slate-700 p-2.5 rounded-xl text-sm dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
                >
                  <option value="">Free & Paid</option>
                  <option value="FREE">🆓 Free Only</option>
                  <option value="PAID">💰 Paid Only</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Sort By</label>
                <select
                  value={sort}
                  onChange={(e) => { setSort(e.target.value); setPage(1); }}
                  className="w-full border dark:border-slate-700 p-2.5 rounded-xl text-sm dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
                >
                  <option value="">Latest First</option>
                  <option value="top">🏆 Top Voted</option>
                </select>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1">
          {loading ? (
            // লোডিং স্কেলিটন (ঐচ্ছিক কিন্তু সুন্দর দেখায়)
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-80 bg-gray-200 dark:bg-slate-800 rounded-3xl"></div>
              ))}
            </div>
          ) : ideas.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border dark:border-slate-800 shadow-sm">
              <p className="text-gray-500 text-lg">No ideas found matching your criteria.</p>
            </div>
          ) : (
            <>
              {/* ধাপ ১: কার্ড ডিজাইন (UI Card) */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {ideas.map((idea) => (
                  <div key={idea.id} className="bg-white dark:bg-slate-900 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col border dark:border-slate-800">
                    {/* কার্ডের ছবি এবং ব্যাজ */}
                    <div className="relative h-48 bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <img 
                        src={idea.images?.[0] || '/images/default-idea.jpg'} 
                        alt={idea.title} 
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                      <div className="absolute top-3 right-3">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${
                          idea.type === 'PAID' ? 'bg-orange-500 text-white' : 'bg-green-500 text-white'
                        }`}>
                          {idea.type}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                      <p className="text-xs font-bold text-emerald-600 mb-1 uppercase tracking-tighter">{idea.category?.name}</p>
                      <h3 className="font-bold text-lg text-gray-800 dark:text-white line-clamp-1 mb-2">{idea.title}</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-xs line-clamp-2 mb-4 flex-1 italic">"{idea.description}"</p>
                      
                      <div className="pt-4 border-t dark:border-slate-800 flex items-center justify-between">
                        {/* ভোট কাউন্ট */}
                        <div className="flex gap-3 text-xs font-bold text-gray-500">
                          <span>👍 {idea.votes?.filter((v:any) => v.value === 1).length || 0}</span>
                          <span>👎 {idea.votes?.filter((v:any) => v.value === -1).length || 0}</span>
                        </div>
                        
                        {/* ধাপ ৫: ডিটেইলস লিঙ্ক */}
                        <Link 
                          href={`/ideas/${idea.id}`}
                          className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-[11px] font-bold transition shadow-sm"
                        >
                          View Idea
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ধাপ ৪: পেজিনেশন (Pagination Controls) */}
              <div className="mt-12 flex items-center justify-center gap-3">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="px-4 py-2 bg-white dark:bg-slate-900 border dark:border-slate-700 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 font-bold text-sm transition shadow-sm"
                >
                  ← Prev
                </button>
                <div className="flex gap-2">
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setPage(index + 1)}
                      className={`w-10 h-10 rounded-xl font-bold text-sm transition ${
                        page === index + 1 
                        ? 'bg-green-700 text-white' 
                        : 'bg-white dark:bg-slate-900 border dark:border-slate-700'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="px-4 py-2 bg-white dark:bg-slate-900 border dark:border-slate-700 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 font-bold text-sm transition shadow-sm"
                >
                  Next →
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}