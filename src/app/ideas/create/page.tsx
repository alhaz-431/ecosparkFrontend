'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  Plus, 
  Tag, 
  FileText, 
  Lock,
  Globe,
  BadgeIndianRupee // টাকার কাছাকাছি আইকন হিসেবে এটি ব্যবহার করতে পারেন অথবা সাধারণ টেক্সট
} from 'lucide-react';
import Link from 'next/link';

export default function CreateIdeaPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('General');
  const [isPaid, setIsPaid] = useState(false);
  const [price, setPrice] = useState('500'); // ডিফল্ট প্রাইস ৫০০ টাকা করে দিলাম
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const categories = ["Energy", "Waste", "Transportation", "Water", "Farming", "General"];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('আইডিয়া শেয়ার করতে আগে লগইন করুন');
      router.push('/login');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      toast.error('দয়া করে সব ঘর পূরণ করুন');
      return;
    }

    setLoading(true);
    try {
      await api.post('/ideas', {
        title,
        description,
        category,
        isPaid,
        price: isPaid ? parseFloat(price) : 0
      });
      toast.success('আইডিয়াটি জমা হয়েছে! অ্যাডমিন অ্যাপ্রুভ করলে এটি দেখা যাবে। 🎉');
      router.push('/dashboard/member');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'আইডিয়া সাবমিট করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-28 pb-12 px-6">
      <Toaster position="top-center" />
      
      <div className="max-w-3xl mx-auto">
        <Link href="/dashboard/member" className="inline-flex items-center gap-2 text-gray-400 hover:text-emerald-600 font-black text-sm mb-8 transition-all uppercase tracking-widest">
          <ChevronLeft size={18} /> Back to Dashboard
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[48px] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden"
        >
          <div className="p-12">
            <div className="mb-10">
              <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-2 uppercase">Share Your Idea</h1>
              <p className="text-gray-500 font-medium italic">Spark a change by contributing your sustainability vision.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Title */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                  <Tag size={14} className="text-emerald-600" /> Idea Title
                </label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="যেমন: সোলার চালিত ওয়াটার ফিল্টার"
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-gray-900 font-bold outline-none focus:ring-2 ring-emerald-500/20 transition-all"
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                  <Globe size={14} className="text-emerald-600" /> Category
                </label>
                <div className="flex flex-wrap gap-3">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${category === cat ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                  <FileText size={14} className="text-emerald-600" /> Description
                </label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="আপনার আইডিয়া সম্পর্কে বিস্তারিত লিখুন..."
                  rows={6}
                  className="w-full bg-gray-50 border-none rounded-3xl py-4 px-6 text-gray-900 font-medium outline-none focus:ring-2 ring-emerald-500/20 transition-all resize-none"
                  required
                />
              </div>

              {/* Premium Toggle */}
              <div className="bg-emerald-50 p-8 rounded-[32px] border border-emerald-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
                      <Lock size={24} />
                    </div>
                    <div>
                      <h3 className="font-black text-gray-900 uppercase text-sm tracking-tight">Premium Idea</h3>
                      <p className="text-gray-500 text-[10px] font-bold uppercase tracking-tighter">Charge users to view full details.</p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setIsPaid(!isPaid)}
                    className={`w-14 h-8 rounded-full relative transition-all ${isPaid ? 'bg-emerald-600' : 'bg-gray-300'}`}
                  >
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-sm ${isPaid ? 'left-7' : 'left-1'}`}></div>
                  </button>
                </div>

                {isPaid && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-3"
                  >
                    <label className="text-[10px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-2">
                      <BadgeIndianRupee size={14} /> Set Price (BDT ৳)
                    </label>
                    <input 
                      type="number" 
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full bg-white border-none rounded-2xl py-4 px-6 text-gray-900 font-black text-xl outline-none focus:ring-2 ring-emerald-500/20 transition-all"
                    />
                  </motion.div>
                )}
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 text-white py-6 rounded-[28px] font-black uppercase tracking-[0.2em] hover:bg-emerald-700 transition-all shadow-xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {loading ? 'Submitting...' : <><Plus size={20} /> Post Idea</>}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}