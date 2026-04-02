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
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => <IdeaSkeleton key={n} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {ideas.map((idea) => (
                <div key={idea.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow overflow-hidden border dark:border-slate-800 flex flex-col p-5">
                  <h3 className="font-bold text-lg mb-2">{idea.title}</h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">{idea.description}</p>
                  
                  <div className="mt-auto flex gap-2">
                    {/* Details বাটন - সঠিক লিঙ্ক */}
                    <Link
                      href={`/ideas/${idea.id}`}
                      className="flex-1 text-center bg-green-700 text-white py-2 rounded-xl text-xs font-bold"
                    >
                      View Details
                    </Link>

                    {/* Buy Now বাটন - আপনার কোড অনুযায়ী সরাসরি পেমেন্ট পেজে যাবে */}
                    {idea.type === 'PAID' && (
                      <Link
                        href={`/purchase/${idea.id}`}
                        className="flex-1 text-center bg-emerald-600 text-white py-2 rounded-xl text-xs font-bold"
                      >
                        Buy Now
                      </Link>
                    )}
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