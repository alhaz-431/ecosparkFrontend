'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import IdeaSkeleton from '@/components/IdeaSkeleton'; 

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
      console.error(error);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchIdeas();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors">
      {/* Header */}
      <section className="bg-gradient-to-br from-green-800 to-emerald-600 dark:from-green-900 dark:to-slate-900 text-white py-16 px-6 text-center">
        <h1 className="text-4xl font-extrabold mb-4">🌱 All Sustainability Ideas</h1>
        <p className="text-green-100 text-lg mb-8">Browse, vote and get inspired by community ideas</p>
        <form onSubmit={handleSearch} className="flex justify-center gap-2 max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Search ideas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-4 rounded-xl text-gray-800 focus:outline-none shadow dark:bg-slate-800 dark:text-white dark:border-slate-700"
          />
          <button type="submit" className="bg-white text-green-700 px-8 py-4 rounded-xl font-bold hover:bg-green-100 transition dark:bg-green-600 dark:text-white dark:hover:bg-green-700">
            Search
          </button>
        </form>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col lg:flex-row gap-8">
        {/* Sidebar - Filters */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow p-6 sticky top-24 border dark:border-slate-800">
            <h3 className="font-bold text-gray-800 dark:text-white mb-4">🔍 Filters</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 block">Category</label>
                <select
                  value={category}
                  onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                  className="w-full border dark:border-slate-700 p-2 rounded-lg text-sm focus:outline-none focus:border-green-500 dark:bg-slate-800 dark:text-white"
                >
                  <option value="">All Categories</option>
                  <option value="Energy">⚡ Energy</option>
                  <option value="Waste">♻️ Waste</option>
                  <option value="Transportation">🚗 Transportation</option>
                  <option value="Water">💧 Water</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 block">Type</label>
                <select
                  value={type}
                  onChange={(e) => { setType(e.target.value); setPage(1); }}
                  className="w-full border dark:border-slate-700 p-2 rounded-lg text-sm focus:outline-none focus:border-green-500 dark:bg-slate-800 dark:text-white"
                >
                  <option value="">Free & Paid</option>
                  <option value="FREE">🆓 Free Only</option>
                  <option value="PAID">💰 Paid Only</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 block">Sort By</label>
                <select
                  value={sort}
                  onChange={(e) => { setSort(e.target.value); setPage(1); }}
                  className="w-full border dark:border-slate-700 p-2 rounded-lg text-sm focus:outline-none focus:border-green-500 dark:bg-slate-800 dark:text-white"
                >
                  <option value="">Latest First</option>
                  <option value="top">🏆 Top Voted</option>
                </select>
              </div>

              {(category || type || sort) && (
                <button
                  onClick={() => { setCategory(''); setType(''); setSort(''); setPage(1); }}
                  className="w-full text-red-500 text-sm hover:underline text-left"
                >
                  ✕ Clear Filters
                </button>
              )}
            </div>

            <hr className="my-6 dark:border-slate-800" />
            <h3 className="font-bold text-gray-800 dark:text-white mb-4">📂 Quick Select</h3>
            <div className="space-y-2">
              {[
                { icon: '⚡', name: 'Energy' },
                { icon: '♻️', name: 'Waste' },
                { icon: '🚗', name: 'Transportation' },
                { icon: '💧', name: 'Water' },
              ].map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => { setCategory(cat.name); setPage(1); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${category === cat.name ? 'bg-green-700 text-white' : 'hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300'}`}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Ideas Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <IdeaSkeleton key={n} />
              ))}
            </div>
          ) : ideas.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border dark:border-slate-800">
              <div className="text-6xl mb-4">🌿</div>
              <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">No ideas found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {ideas.map((idea) => (
                <div key={idea.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow hover:shadow-xl transition-all duration-300 overflow-hidden group border dark:border-slate-800">
                  {/* Image Holder */}
                  <div className="bg-gray-100 dark:bg-slate-800 h-48 overflow-hidden relative">
                    {idea.images?.[0] ? (
                      <img 
                        src={idea.images[0]} 
                        alt={idea.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl opacity-40 group-hover:scale-110 transition duration-500">🌱</div>
                    )}
                    {/* Badge */}
                    <div className="absolute top-3 left-3">
                        <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-green-700 dark:text-green-400 uppercase tracking-wider shadow-sm">
                          {idea.category?.name || 'Idea'}
                        </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-gray-800 dark:text-white line-clamp-1 group-hover:text-green-600 transition">{idea.title}</h3>
                      {idea.type === 'PAID' && (
                        <span className="text-yellow-600 dark:text-yellow-400 font-bold text-sm ml-2">৳{idea.price}</span>
                      )}
                    </div>
                    
                    <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-4">{idea.description}</p>
                    
                    <div className="flex justify-between items-center pt-4 border-t dark:border-slate-800">
                      <div className="flex items-center gap-3">
                         <div className="flex items-center gap-1 text-xs font-semibold text-gray-600 dark:text-gray-400">
                            <span className="text-green-600">👍</span> {idea.votes?.filter((v: any) => v.value === 1).length || 0}
                         </div>
                         <div className="flex items-center gap-1 text-xs font-semibold text-gray-600 dark:text-gray-400">
                            <span className="text-red-500">👎</span> {idea.votes?.filter((v: any) => v.value === -1).length || 0}
                         </div>
                      </div>
                      <Link
                        href={`/ideas/${idea.id}`}
                        className="bg-green-700 hover:bg-green-800 text-white px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-md shadow-green-200 dark:shadow-none"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-12 pb-10">
              <button
                onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo(0,0); }}
                disabled={page === 1}
                className="p-2 w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-full hover:bg-green-50 dark:hover:bg-slate-800 disabled:opacity-30 transition shadow-sm"
              >
                ←
              </button>
              <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => { setPage(p => Math.min(totalPages, p + 1)); window.scrollTo(0,0); }}
                disabled={page === totalPages}
                className="p-2 w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-full hover:bg-green-50 dark:hover:bg-slate-800 disabled:opacity-30 transition shadow-sm"
              >
                →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}