'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import { motion } from 'framer-motion';
import { 
  Search, 
  ArrowRight, 
  Star, 
  Mail, 
  Globe, 
  MessageCircle, 
  Share2, 
  Link as LinkIcon,
  TrendingUp,
  LayoutGrid,
  ChevronRight
} from 'lucide-react';
import { Toaster } from 'react-hot-toast';

export default function HomePage() {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [topIdeas, setTopIdeas] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);

  const categories = ["Energy", "Waste", "Transportation", "Water", "Farming"];

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [allRes, topRes] = await Promise.all([
        api.get('/ideas'),
        api.get('/ideas?sort=top_voted&limit=3')
      ]);
      setIdeas(allRes.data.ideas || allRes.data.data || []);
      setTopIdeas((topRes.data.ideas || topRes.data.data || []).slice(0, 3));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.get(`/ideas?search=${search}&category=${category}`);
      setIdeas(res.data.ideas || res.data.data || []);
      setHasSearched(true);

      setTimeout(() => {
        const element = document.getElementById('featured-ideas-section');
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen font-sans">
      <Toaster position="top-center" />

      {/* Hero Section */}
      <section className="relative bg-emerald-900 text-white py-32 px-6 text-center overflow-hidden min-h-[700px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/forest/1920/1080" 
            alt="Banner" 
            className="w-full h-full object-cover opacity-20" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/80 to-emerald-900/40"></div>
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block bg-emerald-600 text-emerald-50 text-[10px] font-black uppercase tracking-[0.3em] px-6 py-2 rounded-full mb-8">
              🌍 Join the Green Revolution
            </div>
            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter">
              Spark Change.<br />
              <span className="text-emerald-400">Save the Planet.</span>
            </h1>
            <p className="text-xl text-emerald-100/80 mb-12 max-w-2xl mx-auto font-medium">
              Share your sustainability ideas, inspire your community, and make a real difference for our environment.
            </p>
          </motion.div>

          <form onSubmit={handleSearch} className="flex flex-col md:flex-row justify-center gap-4 max-w-3xl mx-auto bg-white/10 p-4 rounded-[32px] backdrop-blur-md border border-white/10 shadow-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-200" size={20} />
              <input
                type="text"
                placeholder="Search by name or keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/10 text-white placeholder-emerald-200/50 py-4 pl-14 pr-6 rounded-2xl outline-none focus:bg-white/20 transition-all font-bold" 
              />
            </div>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-emerald-800 text-white py-4 px-6 rounded-2xl outline-none font-bold cursor-pointer focus:bg-emerald-700 transition-all"
            >
              <option value="" className="text-white bg-emerald-900">All Categories</option>
              {categories.map(cat => <option key={cat} value={cat} className="text-white bg-emerald-900">{cat}</option>)}
            </select>
            <button type="submit" className="bg-white text-emerald-900 px-10 py-4 rounded-2xl font-black hover:bg-emerald-50 transition shadow-lg active:scale-95">
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Featured Ideas Section */}
      <section id="featured-ideas-section" className="py-28 px-6 max-w-7xl mx-auto scroll-mt-20">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-4xl font-black text-gray-900 mb-4">Featured Ideas</h2>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Explore the latest sustainability projects</p>
          </div>
          <Link href="/ideas" className="text-emerald-600 font-black underline flex items-center gap-2">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 animate-pulse">
            {[1, 2, 3].map(i => <div key={i} className="h-96 bg-gray-100 rounded-[40px]"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {ideas.slice(0, 6).map((idea) => (
              <motion.div key={idea.id} whileHover={{ y: -10 }} className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden group">
                <div className="p-8">
                  <h3 className="font-black text-2xl text-gray-900 mb-4 line-clamp-1">{idea.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-8 font-medium leading-relaxed">{idea.description}</p>
                  <div className="flex flex-wrap gap-3">
                    <Link href={`/ideas/${idea.id}`} className="bg-gray-900 text-white px-8 py-3 rounded-2xl font-black text-xs hover:bg-emerald-700 transition-all inline-flex items-center gap-2">
                      View Idea <ArrowRight size={14} />
                    </Link>
                    {idea.isPaid && (
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Price: ${idea.price || '10.00'}</span>
                        <Link href={`/purchase/${idea.id}`} className="bg-amber-500 text-white px-8 py-3 rounded-2xl font-black text-xs hover:bg-amber-600 transition-all text-center">
                          Buy Now
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Top Impact Projects Section */}
      <section className="py-28 px-6 bg-emerald-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">Top Impact Projects</h2>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Based on community votes and engagement</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {topIdeas.map((idea, index) => (
              <motion.div key={idea.id} className="bg-white p-10 rounded-[48px] shadow-xl shadow-emerald-100/50 relative">
                <div className="absolute -top-6 left-10 w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg">
                  {index + 1}
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">{idea.title}</h3>
                <p className="text-gray-500 font-medium mb-8 line-clamp-3 italic">&quot;{idea.description}&quot;</p>
                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                  <span className="text-emerald-600 font-black text-sm">{idea.upvotes || 0} Upvotes</span>
                  <div className="flex flex-col items-end gap-2">
                    {idea.isPaid ? (
                      <>
                        <span className="text-xs font-black text-emerald-700">${idea.price || '10.00'}</span>
                        <Link href={`/purchase/${idea.id}`} className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all">
                          Buy Now
                        </Link>
                      </>
                    ) : (
                      <Link href={`/ideas/${idea.id}`} className="text-gray-900 font-black text-xs underline">Read More</Link>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}