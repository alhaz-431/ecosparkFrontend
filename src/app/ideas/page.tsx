'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import toast, { Toaster } from 'react-hot-toast';
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  ThumbsUp, 
  Lock,
  ShoppingCart
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('recent');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = ["Energy", "Waste", "Transportation", "Water", "Farming"];

  const fetchIdeas = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/ideas?search=${search}&category=${category}&sort=${sort}&page=${page}&limit=10`);
      setIdeas(res.data.ideas || res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load ideas');
    } finally {
      setLoading(false);
    }
  }, [search, category, sort, page]);

  useEffect(() => {
    fetchIdeas();
  }, [fetchIdeas]);

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-6">
      <Toaster position="top-center" />
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {ideas.map((idea) => (
            <motion.div key={idea.id} className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 group hover:shadow-xl transition-all">
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                      {idea.category?.name || idea.category || 'General'}
                    </span>
                    {idea.isPaid && (
                      <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                        <Lock size={10} /> Paid
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-2 line-clamp-1">{idea.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-4 font-medium">{idea.description}</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div className="flex flex-col items-end gap-2">
                    {idea.isPaid ? (
                      <>
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">${idea.price || '10.00'}</span>
                        <Link href={`/purchase/${idea.id}`} className="bg-emerald-600 text-white px-5 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center gap-2">
                          <ShoppingCart size={14} /> Buy Now
                        </Link>
                      </>
                    ) : (
                      <Link href={`/ideas/${idea.id}`} className="text-emerald-600 font-black text-sm underline">Details</Link>
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