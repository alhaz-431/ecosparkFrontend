'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';

// ১. ইন্টারফেসগুলো এখানে ঠিক করে দেওয়া হলো
interface Category {
  id: string;
  name: string;
}

interface Idea {
  id: string;
  title: string;
  description: string;
  type: 'FREE' | 'PAID';
  price?: number;
  images: string[];
  category?: { name: string };
  isPurchased?: boolean;
  votes?: { value: number }[];
  createdAt: string;
}

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ক্যাটাগরি ফেচ করার ফাংশন
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data || []);
      } catch (error) {
        console.error('Category Fetch Error:', error);
      }
    };
    fetchCategories();
  }, []);

  // ২. আইডিয়া ফেচ করার মেইন লজিক (সব এরর ফিক্সড)
  const fetchIdeas = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams: any = { page };
      if (search) queryParams.search = search;
      if (category) queryParams.category = category;
      if (type) queryParams.type = type;
      if (sort) queryParams.sort = sort;

      const res = await api.get('/ideas', { params: queryParams });
      
      // API রেসপন্স হ্যান্ডলিং
      const fetchedData = res.data.ideas || res.data || [];
      setIdeas(Array.isArray(fetchedData) ? fetchedData : []);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Fetch Error:', error);
      setIdeas([]);
    } finally {
      setLoading(false);
    }
  }, [page, category, type, sort, search]);

  useEffect(() => {
    fetchIdeas();
  }, [fetchIdeas]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchIdeas();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-800 to-emerald-600 py-16 px-6 text-center text-white">
        <h1 className="text-4xl font-extrabold mb-4">🌱 All Sustainability Ideas</h1>
        <form onSubmit={handleSearch} className="flex justify-center gap-2 max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Search ideas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-4 rounded-xl text-gray-800 focus:outline-none shadow-lg"
          />
          <button type="submit" className="bg-white text-green-700 px-8 py-4 rounded-xl font-bold hover:bg-green-50 shadow-md">
            Search
          </button>
        </form>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow p-6 sticky top-24 border">
            <h3 className="font-bold text-gray-800 mb-4">🔍 Filters</h3>
            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Category</label>
                <select
                  value={category}
                  onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                  className="w-full border p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none bg-white"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Type</label>
                <select
                  value={type}
                  onChange={(e) => { setType(e.target.value); setPage(1); }}
                  className="w-full border p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none bg-white"
                >
                  <option value="">Free & Paid</option>
                  <option value="FREE">🆓 Free Only</option>
                  <option value="PAID">💰 Paid Only</option>
                </select>
              </div>

              <div className="bg-green-50 p-4 rounded-xl text-center">
                <Link href="/dashboard/member" className="bg-green-700 text-white px-4 py-2 rounded-full text-xs hover:bg-green-800 transition block font-bold">
                  Share Now 🌱
                </Link>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-80 bg-gray-200 animate-pulse rounded-3xl"></div>
              ))}
            </div>
          ) : ideas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {ideas.map((idea) => (
                <div key={idea.id} className="bg-white rounded-3xl shadow-sm border overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="h-48 bg-green-50 flex items-center justify-center overflow-hidden">
                    {idea.images?.[0] ? (
                      <img src={idea.images[0]} alt={idea.title} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                    ) : (
                      <span className="text-6xl">🌿</span>
                    )}
                  </div>
                  <div className="p-8">
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase tracking-wider">
                      {idea.category?.name || 'Idea'}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mt-4 line-clamp-1">{idea.title}</h3>
                    <p className="text-gray-500 text-sm mt-3 line-clamp-2 leading-relaxed">{idea.description}</p>
                    <Link href={`/ideas/${idea.id}`} className="mt-8 block text-center bg-green-700 text-white py-3.5 rounded-2xl font-bold hover:bg-green-800 transition-colors shadow-lg shadow-green-200/50">
                      View Detail →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-white rounded-[40px] border border-dashed border-gray-300">
               <span className="text-7xl">🏜️</span>
               <h3 className="text-2xl font-bold text-gray-800 mt-6">No ideas found!</h3>
               <p className="text-gray-500 mt-3">Try adjusting your filters or search terms.</p>
               <button onClick={() => {setCategory(''); setType(''); setSearch('');}} className="mt-8 text-green-700 font-bold hover:underline">
                 Clear all filters
               </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}