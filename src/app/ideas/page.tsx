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
  const [sort, setSort] = useState('recent');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchIdeas = async () => {
      setLoading(true);
      try {
        const res = await api.get('/ideas', {
          params: { search, category, type, sort, page, limit: 12 }
        });
        setIdeas(res.data.ideas || []);
        setTotalPages(res.data.pagination?.totalPages || 1);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchIdeas();
  }, [page, category, type, sort, search]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-green-800 mb-8 text-center">Sustainability Ideas</h1>
        
        {/* Search & Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10 bg-white p-6 rounded-2xl shadow-sm border">
          <input 
            type="text" placeholder="Search ideas..." 
            className="border p-2 rounded-lg text-sm" 
            onChange={(e) => setSearch(e.target.value)}
          />
          <select onChange={(e) => setCategory(e.target.value)} className="border p-2 rounded-lg text-sm">
            <option value="">All Categories</option>
            <option value="Energy">Energy</option>
            <option value="Waste">Waste</option>
            <option value="Transportation">Transportation</option>
          </select>
          <select onChange={(e) => setType(e.target.value)} className="border p-2 rounded-lg text-sm">
            <option value="">All Types</option>
            <option value="FREE">Free</option>
            <option value="PAID">Paid</option>
          </select>
          <select onChange={(e) => setSort(e.target.value)} className="border p-2 rounded-lg text-sm">
            <option value="recent">Latest</option>
            <option value="top">Top Voted</option>
          </select>
        </div>

        {/* Ideas Grid */}
        {loading ? (
          <div className="text-center py-20 font-bold text-green-700">Loading Community Ideas...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ideas.map((idea) => (
              <div key={idea.id} className="bg-white rounded-3xl shadow-md border overflow-hidden flex flex-col hover:shadow-xl transition-all">
                <div className="h-44 bg-emerald-50 flex items-center justify-center relative">
                  {idea.type === 'PAID' && (
                    <span className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-[10px] font-black px-3 py-1 rounded-full shadow-sm">
                      PREMIUM
                    </span>
                  )}
                  <span className="text-6xl">🌱</span>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md uppercase tracking-wider">
                      {idea.category?.name || 'Idea'}
                    </span>
                    <span className="text-xs text-gray-400">👍 {idea.upvotes || 0}</span>
                  </div>
                  <h3 className="font-extrabold text-gray-800 text-xl mb-2 line-clamp-1">{idea.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-3 mb-6 flex-1">{idea.description}</p>
                  
                  <div className="flex gap-3 mt-auto">
                    <Link href={`/ideas/${idea.id}`} className="flex-1 bg-green-800 text-white text-center py-3 rounded-xl text-xs font-bold hover:bg-green-900 transition">
                      View Details
                    </Link>
                    {idea.type === 'PAID' && (
                      <Link href={`/ideas/${idea.id}/purchase`} className="flex-1 bg-yellow-500 text-white text-center py-3 rounded-xl text-xs font-bold hover:bg-yellow-600 transition">
                        Buy Now
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center gap-4">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-6 py-2 bg-white border rounded-xl font-bold disabled:opacity-30">Prev</button>
            <span className="py-2 font-bold">Page {page} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-6 py-2 bg-white border rounded-xl font-bold disabled:opacity-30">Next</button>
          </div>
        )}
      </div>
    </div>
  );
}