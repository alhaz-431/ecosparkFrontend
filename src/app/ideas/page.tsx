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
      setIdeas(res.data.ideas || res.data.data || []); // ডাটা স্ট্রাকচার অনুযায়ী ব্যাকআপ
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Fetch Error:', error);
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-green-800 to-emerald-600 py-16 px-6 text-center text-white">
        <h1 className="text-4xl font-extrabold mb-4">🌱 All Sustainability Ideas</h1>
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
        {/* Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow p-6 sticky top-24 border">
            <h3 className="font-bold text-gray-800 mb-4 text-black">🔍 Filters</h3>
            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Category</label>
                <select
                  value={category}
                  onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                  className="w-full border p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none text-black"
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
                  className="w-full border p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none text-black"
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
                  className="w-full border p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none text-black"
                >
                  <option value="">Latest First</option>
                  <option value="top">🏆 Top Voted</option>
                </select>
              </div>
              {(category || type || sort) && (
                <button
                  onClick={() => { setCategory(''); setType(''); setSort(''); setPage(1); }}
                  className="w-full text-red-500 text-sm hover:underline text-left font-bold"
                >
                  ✕ Clear Filters
                </button>
              )}
              <hr className="my-4" />
              <div className="bg-green-50 p-4 rounded-xl text-center border border-green-100">
                <p className="text-green-700 font-bold text-sm mb-2">Have an idea?</p>
                <Link href="/user/dashboard" className="bg-green-700 text-white px-4 py-2 rounded-full text-sm hover:bg-green-800 transition block">
                  Share Now 🌱
                </Link>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-80 bg-gray-200 rounded-3xl"></div>
              ))}
            </div>
          ) : ideas.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border shadow-sm">
              <div className="text-6xl mb-4">🌿</div>
              <p className="text-gray-500 text-lg font-bold">No ideas found.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 text-black">
                {ideas.map((idea) => (
                  <div key={idea.id} className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col border border-gray-100">
                    {/* Image Section */}
                    <div className="relative h-48 bg-slate-200 overflow-hidden">
                      <img
                        src={idea.images?.[0] || 'https://via.placeholder.com/400x300?text=Sustainability+Idea'}
                        alt={idea.title}
                        className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
                      />
                      <div className="absolute top-3 right-3 flex flex-col gap-2">
                        {/* Paid/Free Badge */}
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
                        {idea.description || idea.problemStatement}
                      </p>

                      <div className="pt-4 border-t flex items-center justify-between">
                        <div className="flex gap-4 text-xs font-black text-gray-400">
                          <span className="flex items-center gap-1 hover:text-green-600 transition">
                            👍 {idea.upvotes || 0}
                          </span>
                          <span className="flex items-center gap-1 hover:text-red-600 transition">
                            👎 {idea.downvotes || 0}
                          </span>
                        </div>
                        
                        {/* বাটন লজিক: পেইড হলে পারচেজ পেজে ডাটা পাঠানো */}
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

              {/* Pagination Section */}
              <div className="mt-16 flex items-center justify-center gap-4">
                <button
                  disabled={page === 1}
                  onClick={() => { setPage(page - 1); window.scrollTo(0,0); }}
                  className="px-6 py-3 bg-white border border-gray-200 rounded-2xl disabled:opacity-30 hover:bg-gray-50 font-black text-xs transition-all shadow-sm"
                >
                  ← Previous
                </button>
                
                <div className="flex gap-2">
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => { setPage(index + 1); window.scrollTo(0,0); }}
                      className={`w-11 h-11 rounded-2xl font-black text-xs transition-all ${
                        page === index + 1 
                        ? 'bg-green-700 text-white shadow-lg shadow-green-200' 
                        : 'bg-white border border-gray-200 hover:border-green-400'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <button
                  disabled={page === totalPages}
                  onClick={() => { setPage(page + 1); window.scrollTo(0,0); }}
                  className="px-6 py-3 bg-white border border-gray-200 rounded-2xl disabled:opacity-30 hover:bg-gray-50 font-black text-xs transition-all shadow-sm"
                >
                  Next Page →
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}