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
  DollarSign,
  Lock,
  Globe
} from 'lucide-react';
import Link from 'next/link';

export default function CreateIdeaPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('General');
  const [isPaid, setIsPaid] = useState(false);
  const [price, setPrice] = useState('10.00');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const categories = ["Energy", "Waste", "Transportation", "Water", "Farming", "General"];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to share an idea');
      router.push('/login');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      toast.error('Please fill in all required fields');
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
      toast.success('Idea submitted successfully! It will be visible after admin review.');
      router.push('/dashboard/member');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit idea');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen pt-28 pb-12 px-6">
      <Toaster position="top-center" />
      
      <div className="max-w-3xl mx-auto">
        <Link href="/dashboard/member" className="inline-flex items-center gap-2 text-gray-500 hover:text-emerald-600 font-black text-sm mb-8 transition-colors">
          <ChevronLeft size={18} /> Back to Dashboard
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 rounded-[48px] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden"
        >
          <div className="p-12">
            <div className="mb-10">
              <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter mb-2">Share Your Idea</h1>
              <p className="text-gray-500 dark:text-gray-400 font-medium">Spark a change by contributing your sustainability vision.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                  <Tag size={14} /> Idea Title
                </label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Solar Powered Water Filter"
                  className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl py-4 px-6 text-gray-900 dark:text-white font-bold outline-none focus:ring-2 ring-emerald-500/20 transition-all"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                  <Globe size={14} /> Category
                </label>
                <div className="flex flex-wrap gap-3">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${category === cat ? 'bg-emerald-600 text-white shadow-lg' : 'bg-gray-50 dark:bg-gray-800 text-gray-500'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                  <FileText size={14} /> Description
                </label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your idea in detail..."
                  rows={6}
                  className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-3xl py-4 px-6 text-gray-900 dark:text-white font-medium outline-none focus:ring-2 ring-emerald-500/20 transition-all resize-none"
                  required
                />
              </div>

              <div className="bg-emerald-50 dark:bg-emerald-950/30 p-8 rounded-[32px] border border-emerald-100 dark:border-emerald-900/50">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
                      <Lock size={24} />
                    </div>
                    <div>
                      <h3 className="font-black text-gray-900 dark:text-white">Premium Idea</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-xs font-medium">Charge users to view full details.</p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setIsPaid(!isPaid)}
                    className={`w-14 h-8 rounded-full relative transition-all ${isPaid ? 'bg-emerald-600' : 'bg-gray-300 dark:bg-gray-700'}`}
                  >
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${isPaid ? 'left-7' : 'left-1'}`}></div>
                  </button>
                </div>

                {isPaid && (
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-2">
                      <DollarSign size={14} /> Set Price (USD)
                    </label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full bg-white dark:bg-gray-800 border-none rounded-2xl py-4 px-6 text-gray-900 dark:text-white font-bold outline-none focus:ring-2 ring-emerald-500/20 transition-all"
                    />
                  </div>
                )}
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 dark:bg-emerald-600 text-white py-5 rounded-3xl font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? 'Submitting...' : <><Plus size={20} /> Share Idea</>}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}