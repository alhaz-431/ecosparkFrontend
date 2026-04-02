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
        {/* Sidebar Filters - আপনার আগের কোড */}
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
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => <IdeaSkeleton key={n} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {ideas.map((idea) => (
                <div key={idea.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow hover:shadow-xl transition-all duration-300 overflow-hidden group border dark:border-slate-800 flex flex-col">
                  {/* Image */}
                  <div className="bg-gray-100 dark:bg-slate-800 h-48 overflow-hidden relative">
                    {idea.images?.[0] ? (
                      <img src={idea.images[0]} alt={idea.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl opacity-40">🌱</div>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-gray-800 dark:text-white line-clamp-1">{idea.title}</h3>
                      {idea.type === 'PAID' && <span className="text-yellow-600 font-bold text-sm">৳{idea.price}</span>}
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-4">{idea.description}</p>
                    
                    <div className="mt-auto pt-4 border-t dark:border-slate-800">
                      <div className="flex gap-2">
                        {/* Details বাটন - লিঙ্ক চেক করুন */}
                        <Link
                          href={`/ideas/${idea.id}`}
                          className="flex-1 text-center bg-green-700 hover:bg-green-800 text-white py-2 rounded-xl text-xs font-bold transition-all"
                        >
                          View Details
                        </Link>

                        {/* Buy Now বাটন - লিঙ্ক অবশ্যই /purchase/[id] হতে হবে */}
                        {idea.type === 'PAID' && (
                          <Link
                            href={`/purchase/${idea.id}`} 
                            className="flex-1 text-center bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-xs font-bold transition-all"
                          >
                            Buy Now
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}