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
      setIdeas(res.data.ideas || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (error) {
      console.error(error);
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
      <section className="bg-gradient-to-br from-green-800 to-emerald-600 text-white py-16 px-6 text-center">
        <h1 className="text-4xl font-extrabold mb-4">🌱 All Sustainability Ideas</h1>
        <p className="text-green-100 text-lg mb-8">Browse, vote and get inspired by community ideas</p>
        <form onSubmit={handleSearch} className="flex justify-center gap-2 max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Search ideas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-4 rounded-xl text-gray-800 focus:outline-none shadow"
          />
          <button type="submit" className="bg-white text-green-700 px-8 py-4 rounded-xl font-bold hover:bg-green-100 transition">
            Search
          </button>
        </form>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-10 flex gap-8">

        {/* Sidebar */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow p-6 sticky top-24">
            <h3 className="font-bold text-gray-800 mb-4">🔍 Filters</h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Category</label>
                <select
                  value={category}
                  onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                  className="w-full border p-2 rounded-lg text-sm focus:outline-none focus:border-green-500"
                >
                  <option value="">All Categories</option>
                  <option value="Energy">⚡ Energy</option>
                  <option value="Waste">♻️ Waste</option>
                  <option value="Transportation">🚗 Transportation</option>
                  <option value="Water">💧 Water</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Type</label>
                <select
                  value={type}
                  onChange={(e) => { setType(e.target.value); setPage(1); }}
                  className="w-full border p-2 rounded-lg text-sm focus:outline-none focus:border-green-500"
                >
                  <option value="">Free & Paid</option>
                  <option value="FREE">🆓 Free Only</option>
                  <option value="PAID">💰 Paid Only</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Sort By</label>
                <select
                  value={sort}
                  onChange={(e) => { setSort(e.target.value); setPage(1); }}
                  className="w-full border p-2 rounded-lg text-sm focus:outline-none focus:border-green-500"
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

            <hr className="my-6" />

            <h3 className="font-bold text-gray-800 mb-4">📂 Categories</h3>
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
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${category === cat.name ? 'bg-green-700 text-white' : 'hover:bg-gray-100 text-gray-700'}`}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>

            <hr className="my-6" />

            <div className="bg-green-50 p-4 rounded-xl text-center">
              <p className="text-green-700 font-bold text-sm mb-2">Have an idea?</p>
              <Link href="/dashboard/member" className="bg-green-700 text-white px-4 py-2 rounded-full text-sm hover:bg-green-800 transition block">
                Share Now 🌱
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Mobile Filters */}
          <div className="lg:hidden bg-white p-4 rounded-2xl shadow mb-6 flex flex-wrap gap-3">
            <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} className="border p-2 rounded-lg text-sm">
              <option value="">All Categories</option>
              <option value="Energy">⚡ Energy</option>
              <option value="Waste">♻️ Waste</option>
              <option value="Transportation">🚗 Transportation</option>
              <option value="Water">💧 Water</option>
            </select>
            <select value={type} onChange={(e) => { setType(e.target.value); setPage(1); }} className="border p-2 rounded-lg text-sm">
              <option value="">Free & Paid</option>
              <option value="FREE">🆓 Free</option>
              <option value="PAID">💰 Paid</option>
            </select>
            <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }} className="border p-2 rounded-lg text-sm">
              <option value="">Latest</option>
              <option value="top">🏆 Top Voted</option>
            </select>
          </div>

          {/* Ideas Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-60">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
            </div>
          ) : ideas.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🌿</div>
              <p className="text-gray-500 text-lg">No ideas found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {ideas.map((idea) => (
                <div key={idea.id} className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden group">
                  <div className="bg-gradient-to-br from-green-100 to-emerald-50 h-48 flex items-center justify-center overflow-hidden">
                    {idea.images?.[0] ? (
                      <img src={idea.images[0]} alt={idea.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                    ) : (
                      <span className="text-7xl">🌿</span>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-center mb-2">
                      <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
                        {idea.category?.name}
                      </span>
                      {idea.type === 'PAID' && (
                        <span className="bg-yellow-100 text-yellow-700 text-xs px-3 py-1 rounded-full font-medium">
                          💰 ${idea.price}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-lg text-gray-800 mt-2">{idea.title}</h3>
                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">{idea.description}</p>
                    {idea.author && (
                      <p className="text-xs text-gray-400 mt-2">By {idea.author.name}</p>
                    )}
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                      <div className="flex gap-3 text-sm text-gray-500">
                        <span>👍 {idea.votes?.filter((v: any) => v.value === 1).length || 0}</span>
                        <span>👎 {idea.votes?.filter((v: any) => v.value === -1).length || 0}</span>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          href={`/ideas/${idea.id}`}
                          className="bg-green-700 text-white px-4 py-1.5 rounded-full text-sm hover:bg-green-800 transition"
                        >
                          View →
                        </Link>
                        {idea.type === 'PAID' && (
                          <Link
                            href={`/ideas/${idea.id}/purchase`}
                            className="bg-yellow-500 text-white px-4 py-1.5 rounded-full text-sm hover:bg-yellow-600 transition"
                          >
                            💰 Buy
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-5 py-2 bg-white border rounded-full hover:bg-gray-50 disabled:opacity-50"
              >
                ← Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-4 py-2 rounded-full ${page === p ? 'bg-green-700 text-white' : 'bg-white border hover:bg-gray-50'}`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-5 py-2 bg-white border rounded-full hover:bg-gray-50 disabled:opacity-50"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}