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
  TrendingUp
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
    window.location.href = `/ideas?search=${search}&category=${category}`;
  };

  return (
    <div className="bg-white min-h-screen font-sans">
      <Toaster position="top-center" />

      {/* Hero Section */}
      <section className="relative bg-emerald-900 text-white py-32 px-6 text-center overflow-hidden min-h-[700px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img src="https://picsum.photos/seed/forest/1920/1080" alt="Banner" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/80 to-emerald-900/40"></div>
        </div>
        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-block bg-emerald-600 text-emerald-50 text-[10px] font-black uppercase tracking-[0.3em] px-6 py-2 rounded-full mb-8">🌍 Join the Green Revolution</div>
            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter">Spark Change.<br /><span className="text-emerald-400">Save the Planet.</span></h1>
            <p className="text-xl text-emerald-100/80 mb-12 max-w-2xl mx-auto font-medium">Share your sustainability ideas, inspire your community, and make a real difference.</p>
          </motion.div>

          <form onSubmit={handleSearch} className="flex flex-col md:flex-row justify-center gap-4 max-w-3xl mx-auto bg-white/10 p-4 rounded-[32px] backdrop-blur-md border border-white/10 shadow-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-200" size={20} />
              <input type="text" placeholder="Search ideas..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-white/10 text-white placeholder-emerald-200/50 py-4 pl-14 pr-6 rounded-2xl outline-none focus:bg-white/20 transition-all font-bold" />
            </div>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="bg-emerald-800 text-white py-4 px-6 rounded-2xl outline-none font-bold cursor-pointer focus:bg-emerald-700 transition-all">
              <option value="" className="bg-emerald-900">All Categories</option>
              {categories.map(cat => <option key={cat} value={cat} className="bg-emerald-900">{cat}</option>)}
            </select>
            <button type="submit" className="bg-white text-emerald-900 px-10 py-4 rounded-2xl font-black hover:bg-emerald-50 transition shadow-lg">Search</button>
          </form>
        </div>
      </section>

      {/* Featured Ideas */}
      <section className="py-28 px-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-16">
          <h2 className="text-4xl font-black text-gray-900">Featured Ideas</h2>
          <Link href="/ideas" className="text-emerald-600 font-black underline flex items-center gap-2">View All <ArrowRight size={16} /></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {ideas.slice(0, 6).map((idea) => (
            <div key={idea.id} className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden group">
              <div className="h-60 bg-gray-100 relative overflow-hidden">
                <img src={idea.images?.[0] || 'https://picsum.photos/seed/eco/800/600'} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                <div className="absolute top-6 right-6">
                  <span className="bg-white/90 backdrop-blur-md text-emerald-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">{idea.category?.name || idea.category || 'Idea'}</span>
                </div>
              </div>
              <div className="p-8">
                <h3 className="font-black text-2xl text-gray-900 mb-4 line-clamp-1">{idea.title}</h3>
                <p className="text-gray-500 text-sm line-clamp-2 mb-8 font-medium leading-relaxed">{idea.description}</p>
                <Link href={`/ideas/${idea.id}`} className="bg-gray-900 text-white px-8 py-3 rounded-2xl font-black text-xs hover:bg-emerald-700 transition-all inline-flex items-center gap-2">View Idea <ArrowRight size={14} /></Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-28 px-6">
        <div className="max-w-6xl mx-auto bg-emerald-900 rounded-[60px] p-12 md:p-24 text-center">
          <Mail className="text-emerald-400 mx-auto mb-8" size={64} />
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6">Stay in the Loop.</h2>
          <p className="text-emerald-100 text-lg mb-12 max-w-xl mx-auto font-medium">নতুন আইডিয়া এবং টপ প্রজেক্টের আপডেট পেতে সাবস্ক্রাইব করুন।</p>
          <form className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
            <input type="email" placeholder="Enter your email" className="flex-1 bg-white/10 border border-white/20 rounded-3xl py-5 px-8 text-white outline-none font-bold" />
            <button className="bg-white text-emerald-900 px-12 py-5 rounded-3xl font-black hover:bg-emerald-50 transition-all shadow-2xl">Subscribe Now</button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-20 px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <h2 className="text-2xl font-black text-emerald-800 mb-6">EcoSpark Hub</h2>
            <p className="text-gray-500 font-medium leading-relaxed">Sustainability প্রজেক্টে ভোট দিন এবং বিশ্বের পরিবর্তনে ভূমিকা রাখুন।</p>
          </div>
          <div>
            <h4 className="font-black text-gray-900 uppercase text-xs tracking-widest mb-8">Quick Links</h4>
            <ul className="space-y-4 text-gray-500 font-bold text-sm">
              <li><Link href="/ideas">All Ideas</Link></li>
              <li><Link href="/about">About Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-gray-900 uppercase text-xs tracking-widest mb-8">Follow Us</h4>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-400 hover:text-emerald-600 transition-colors cursor-pointer"><Globe size={18} /></div>
              <div className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-400 hover:text-emerald-600 transition-colors cursor-pointer"><MessageCircle size={18} /></div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-10 border-t border-gray-100 text-center">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">© 2024 EcoSpark Hub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}