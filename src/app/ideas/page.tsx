'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';

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

// ক্যাটাগরি ডাটার জন্য ইন্টারফেস
interface Category {
  id: string;
  name: string;
}

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [categories, setCategories] = useState<Category[]>([]); // নতুন স্টেট
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // পেজ লোড হলে ক্যাটাগরি এবং আইডিয়া দুটোই ফেচ করবে
    fetchCategories();
    fetchIdeas();
  }, [page, category, type, sort]);

  // ডাটাবেস থেকে ক্যাটাগরি নিয়ে আসার ফাংশন
  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories'); 
      setCategories(res.data);
    } catch (error) {
      console.error('Category Fetch Error:', error);
    }
  };

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
      const fetchedIdeas = res.data.ideas || res.data || [];
      setIdeas(Array.isArray(fetchedIdeas) ? fetchedIdeas : []);
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
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow p-6 sticky top-24 border">
            <h3 className="font-bold text-gray-800 mb-4">🔍 Filters</h3>
            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Category</label>
                <select
                  value={category}
                  onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                  className="w-full border p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none"
                >
                  <option value="">All Categories</option>
                  {/* এখানে ডাটাবেস থেকে আসা ক্যাটাগরিগুলো লুপ হচ্ছে */}
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
                  className="w-full border p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-green-500 outline-none"
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

        <main className="flex-1">
          {/* বাকি আইডিয়া গ্রিড কোড আগের মতোই থাকবে... */}
          {/* (সংক্ষিপ্ত করার জন্য গ্রিড অংশটি এখানে আর লিখলাম না, আপনার আগের কোডই থাকবে) */}
        </main>
      </div>
    </div>
  );
}