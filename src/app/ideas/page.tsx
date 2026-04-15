'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import toast, { Toaster } from 'react-hot-toast';
import { Search, ThumbsUp, Lock, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('recent');
  const [page, setPage] = useState(1);

  const fetchIdeas = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/ideas?search=${search}&category=${category}&sort=${sort}&page=${page}&limit=10`);
      setIdeas(res.data.ideas || res.data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [search, category, sort, page]);

  useEffect(() => { fetchIdeas(); }, [fetchIdeas]);

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-6">
      <Toaster position="top-center" />
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ideas.map((idea) => (
            <motion.div key={idea.id} className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
              <div className="h-52 bg-gray-100 relative overflow-hidden">
                <img src={idea.images?.[0] || `https://picsum.photos/seed/${idea.id}/800/600`} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">{idea.category?.name || idea.category || 'General'}</span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-black text-gray-900 mb-2">{idea.title}</h3>
                <p className="text-gray-500 text-sm line-clamp-2 mb-6 flex-1">{idea.description}</p>
                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-emerald-600 font-black text-sm">{idea.upvotes || 0} Upvotes</span>
                  <div className="flex items-center gap-2">
                    {idea.isPaid ? (
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] font-black text-emerald-600 uppercase">${idea.price || '10.00'}</span>
                        <Link href={`/purchase/${idea.id}`} className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-black text-[10px] uppercase flex items-center gap-2">
                          <ShoppingCart size={14} /> Buy Now
                        </Link>
                      </div>
                    ) : (
                      <Link href={`/ideas/${idea.id}`} className="bg-gray-900 text-white px-4 py-2 rounded-xl font-black text-[10px] uppercase">Details</Link>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}