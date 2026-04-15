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
  ShoppingCart
} from 'lucide-react';
import { Toaster } from 'react-hot-toast';

export default function HomePage() {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [topIdeas, setTopIdeas] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

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
          <img src="https://picsum.photos/seed/forest/1920/1080" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/80 to-emerald-900/40"></div>
        </div>
        <div className="relative z-10 max-w-5xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter">Spark Change.<br /><span className="text-emerald-400">Save the Planet.</span></h1>
          <p className="text-xl text-emerald-100/80 mb-12 max-w-2xl mx-auto font-medium">Share your sustainability ideas and make a real difference.</p>
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row justify-center gap-4 max-w-3xl mx-auto bg-white/10 p-4 rounded-[32px] backdrop-blur-md border border-white/10">
            <input type="text" placeholder="Search ideas..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 bg-white/10 text-white py-4 px-6 rounded-2xl outline-none font-bold" />
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="bg-emerald-800 text-white py-4 px-6 rounded-2xl outline-none font-bold">
              <option value="">All Categories</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <button type="submit" className="bg-white text-emerald-900 px-10 py-4 rounded-2xl font-black">Search</button>
          </form>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-28 px-6 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-20 tracking-tighter">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { step: '01', title: 'Share Your Idea', desc: 'Submit your sustainability project to our community.' },
              { step: '02', title: 'Get Support', desc: 'Receive votes and feedback from eco-conscious members.' },
              { step: '03', title: 'Make Impact', desc: 'Turn your vision into reality and track the change.' }
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="text-8xl font-black text-emerald-50 absolute -top-10 -left-4 z-0">{item.step}</div>
                <div className="relative z-10 text-left">
                  <h3 className="text-2xl font-black text-gray-900 mb-4">{item.title}</h3>
                  <p className="text-gray-500 font-medium">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Ideas Section */}
      <section id="featured-ideas-section" className="py-28 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-black text-gray-900 mb-16 tracking-tighter">Featured Ideas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {ideas.slice(0, 6).map((idea) => (
            <motion.div key={idea.id} whileHover={{ y: -10 }} className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden group">
              <div className="h-60 bg-gray-100 relative overflow-hidden">
                <img src={idea.images?.[0] || `https://picsum.photos/seed/${idea.id}/800/600`} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                <div className="absolute top-6 right-6">
                  <span className="bg-white/90 backdrop-blur-md text-emerald-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">{idea.category?.name || idea.category || 'Idea'}</span>
                </div>
              </div>
              <div className="p-8">
                <h3 className="font-black text-2xl text-gray-900 mb-4 line-clamp-1">{idea.title}</h3>
                <p className="text-gray-500 text-sm line-clamp-2 mb-8 font-medium">{idea.description}</p>
                <div className="flex flex-wrap gap-3">
                  <Link href={`/ideas/${idea.id}`} className="bg-gray-900 text-white px-8 py-3 rounded-2xl font-black text-xs">View Idea</Link>
                  {idea.isPaid && (
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Price: ${idea.price || '10.00'}</span>
                      <Link href={`/purchase/${idea.id}`} className="bg-amber-500 text-white px-8 py-3 rounded-2xl font-black text-xs text-center">Buy Now</Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-28 px-6 bg-emerald-900 text-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-16 tracking-tighter">Explore by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Solar Energy', 'Ocean Cleanup', 'Urban Farming', 'Electric Transport'].map((item, i) => (
              <div key={i} className="h-40 bg-white/5 rounded-[32px] border border-white/10 p-8 flex flex-col justify-end hover:bg-white/10 transition-all cursor-pointer">
                <Globe size={24} className="text-emerald-400 mb-2" />
                <div className="font-black text-lg">{item}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}