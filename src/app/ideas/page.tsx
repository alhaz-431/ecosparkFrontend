'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import toast, { Toaster } from 'react-hot-toast';
import { Search, ThumbsUp, Lock, ShoppingCart } from 'lucide-react';
// যদি 'framer-motion' এ এরর দেয় তবে 'motion/react' ট্রাই করবেন
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
      // ব্যাকটিক (`) ব্যবহার নিশ্চিত করুন যাতে ভ্যারিয়েবলগুলো ঠিকমতো কাজ করে
      const res = await api.get(`/ideas?search=${search}&category=${category}&sort=${sort}&page=${page}&limit=10`);
      
      // আপনার ব্যাকএন্ড থেকে যদি ডাটা 'data' প্রপার্টিতে আসে
      const fetchedData = res.data?.data || res.data?.ideas || res.data || [];
      setIdeas(Array.isArray(fetchedData) ? fetchedData : []);
      
    } catch (error: any) {
      console.error("Fetch error:", error);
      toast.error("আইডিয়া লোড করতে সমস্যা হচ্ছে!");
    } finally {
      setLoading(false);
    }
  }, [search, category, sort, page]);

  useEffect(() => { 
    fetchIdeas(); 
  }, [fetchIdeas]);

  if (loading) return <div className="text-center py-20 font-black">Loading Ideas...</div>;

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-6">
      <Toaster position="top-center" />
      <div className="max-w-7xl mx-auto">
        
        {/* যদি আইডিয়া না থাকে তার জন্য চেক */}
        {ideas.length === 0 ? (
          <div className="text-center py-20 text-gray-500 font-bold">কোনো আইডিয়া পাওয়া যায়নি।</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ideas.map((idea) => (
              <motion.div 
                key={idea._id || idea.id} // MongoDB হলে _id থাকে
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-xl transition-shadow duration-300"
              >
                {/* Image Section */}
                <div className="h-52 bg-gray-100 relative overflow-hidden">
                  <img 
                    src={idea.images?.[0] || `https://picsum.photos/seed/${idea.id}/800/600`} 
                    alt={idea.title}
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-md text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                      {idea.category?.name || idea.category || 'General'}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-black text-gray-900 mb-2">{idea.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-6 flex-1">{idea.description}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <span className="text-emerald-600 font-black text-sm flex items-center gap-1">
                      <ThumbsUp size={14} /> {idea.upvotes || 0}
                    </span>
                    
                    <div className="flex items-center gap-2">
                      {idea.isPaid ? (
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-[10px] font-black text-emerald-600 uppercase">
                            ${idea.price || '10.00'}
                          </span>
                          <Link 
                            href={`/purchase/${idea.id}`} 
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-black text-[10px] uppercase flex items-center gap-2 transition-colors"
                          >
                            <ShoppingCart size={14} /> Buy Now
                          </Link>
                        </div>
                      ) : (
                        <Link 
                          href={`/ideas/${idea._id || idea.id}`} 
                          className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-xl font-black text-[10px] uppercase transition-colors"
                        >
                          Details
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}