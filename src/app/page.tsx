'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/axios';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Globe, ChevronRight, Zap, Leaf, Plus, 
  Rocket, Award, Mail
} from 'lucide-react';
import { Toaster } from 'react-hot-toast';

export default function HomePage() {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { name: "Solar Energy", img: "https://images.unsplash.com/photo-1508514177221-18d162b85522?q=80&w=600" },
    { name: "Waste Management", img: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?q=80&w=600" },
    { name: "Urban Farming", img: "https://images.unsplash.com/photo-1592419044706-39796d40f98c?q=80&w=600" },
    { name: "Clean Water", img: "https://images.unsplash.com/photo-1581242163695-19d0acfd486f?q=80&w=600" }
  ];

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const res = await api.get('/ideas');
      setIdeas(res.data.ideas || res.data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white selection:bg-emerald-100 selection:text-emerald-900">
      <Toaster position="top-center" />

      {/* --- 1. FULL-SCREEN BACKGROUND BANNER --- */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <Image 
          src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=2070" 
          alt="Green Future" 
          fill 
          className="object-cover -z-20"
          priority
        />
        <div className="absolute inset-0 bg-slate-950/70 -z-10" />

        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-300 px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest mb-10 border border-emerald-500/20 backdrop-blur-sm">
              <Leaf size={14} className="animate-pulse" /> Decentralized Sustainability Hub
            </div>
            
            <h1 className="text-6xl md:text-9xl font-black text-white leading-[0.9] tracking-tighter mb-10 max-w-5xl mx-auto">
              Empowering <span className="text-emerald-400">Green</span> <br /> Visionaries Everywhere.
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-100 mb-14 max-w-2xl mx-auto font-medium leading-relaxed">
              আপনার পরিবেশবান্ধব আইডিয়াগুলো বিশ্বের সামনে তুলে ধরুন এবং টেকসই পরিবর্তনের অংশ হোন।
            </p>

            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/ideas/create" className="bg-emerald-600 text-white px-12 py-6 rounded-3xl font-black uppercase tracking-widest hover:bg-emerald-500 transition-all flex items-center gap-3 active:scale-95 group shadow-2xl">
                Submit Idea <Plus size={22} />
              </Link>
              <button onClick={() => document.getElementById('discover-section')?.scrollIntoView({ behavior: 'smooth' })} className="bg-white/10 backdrop-blur-md text-white px-12 py-6 rounded-3xl font-black uppercase tracking-widest hover:bg-white/20 transition-all flex items-center gap-3">
                Discover <ArrowRight size={22} />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- 2. IMPACT TRACKER --- */}
      <section className="py-24 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10">
          {[
            { label: 'CO2 Reduced', val: '12.4M Tons', icon: <Leaf /> },
            { label: 'Green Energy', val: '45.8 GWh', icon: <Zap /> },
            { label: 'Contributors', val: '240K+', icon: <Globe /> },
            { label: 'Funded Ideas', val: '12,000+', icon: <Award /> }
          ].map((item, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl text-center shadow-sm border border-slate-100">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-600">
                {item.icon}
              </div>
              <div className="text-4xl font-black text-slate-950 mb-2">{item.val}</div>
              <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* --- 3. BENTO GRID FEATURES --- */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-7xl font-black text-slate-950 tracking-tighter mb-6">How We Empower <span className="text-emerald-600">Change.</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-emerald-600 rounded-[56px] text-white p-12 md:col-span-2 relative overflow-hidden group">
              <Image src="https://images.unsplash.com/photo-1542601906990-b4d3fb773b09?q=80&w=800" alt="Innovation" fill className="object-cover opacity-20 group-hover:scale-105 transition-transform duration-1000" />
              <div className="relative z-10">
                <Rocket size={48} className="mb-8 opacity-50" />
                <h3 className="text-3xl font-black mb-4">Incubation & Mentorship</h3>
                <p className="text-emerald-50/80 font-medium max-w-md">আইডিয়াগুলোকে বাস্তবে রূপ দিতে বিশেষজ্ঞদের মাধ্যমে মেন্টরশিপ এবং টেকনিক্যাল সাপোর্ট প্রদান।</p>
              </div>
            </div>
            <div className="bg-slate-900 rounded-[56px] p-12 text-white flex flex-col justify-end">
              <Zap size={32} className="text-amber-400 mb-6" />
              <h3 className="text-2xl font-black mb-2">Rapid Funding</h3>
              <p className="text-slate-400 text-sm">সরাসরি ক্রিপ্টো বা লোকাল পেমেন্টের মাধ্যমে আপনার প্রজেক্টে ফান্ড সংগ্রহ করুন।</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- 4. TOP CATEGORIES --- */}
      <section id="discover-section" className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-6xl font-black text-slate-950 tracking-tighter mb-20 text-center">Featured <span className="text-emerald-600">Categories.</span></h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((cat, i) => (
              <div key={i} className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm group">
                <div className="relative aspect-square rounded-[32px] overflow-hidden mb-8">
                  <Image src={cat.img} alt={cat.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <h3 className="text-2xl font-black text-slate-950 group-hover:text-emerald-600 transition-colors">{cat.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 5. LATEST IDEAS GRID --- */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-slate-950 tracking-tighter">Latest Green Innovations</h2>
            <Link href="/ideas" className="bg-emerald-50 text-emerald-700 px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2">
              View All <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {loading ? (
              [1, 2, 3].map(i => <div key={i} className="h-96 bg-slate-100 animate-pulse rounded-[48px]" />)
            ) : (
              ideas.slice(0, 3).map((idea) => (
                <motion.div key={idea.id} whileHover={{ y: -10 }} className="group bg-white rounded-[48px] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500">
                  <div className="relative h-64 overflow-hidden">
                    <Image src={idea.images?.[0] || `https://images.unsplash.com/photo-1518005020480-1cd34333799c?q=80&w=800`} alt={idea.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="p-10">
                    <h3 className="text-2xl font-black text-slate-950 mb-4 line-clamp-1">{idea.title}</h3>
                    <div className="flex items-center justify-between mt-8 pt-8 border-t border-slate-50">
                       <Link href={`/ideas/${idea.id}`} className="font-black text-xs uppercase tracking-widest text-slate-400 group-hover:text-emerald-500 flex items-center gap-2">
                         Details <ArrowRight size={16} />
                       </Link>
                       <span className="text-xs font-bold bg-slate-50 px-3 py-1.5 rounded-full">৳{idea.price || '0'}</span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* --- 6. NEWSLETTER --- */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto bg-slate-950 text-white rounded-[60px] p-12 md:p-24 relative overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <Mail className="text-emerald-400 mb-8" size={56} />
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">Stay Connected.</h2>
              <p className="text-slate-300 text-lg font-medium">সাপ্তাহিক সেরা গ্রিন আইডিয়া এবং ইকো-টেক আপডেট পেতে আমাদের সাথে যুক্ত থাকুন।</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-10 rounded-[32px] border border-white/10">
              <form className="space-y-6">
                <input type="email" placeholder="Your email" className="w-full bg-white/10 border border-white/5 rounded-2xl py-5 px-8 outline-none text-white" />
                <button type="button" className="w-full bg-white text-slate-950 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all">Subscribe</button>
              </form>
            </div>
          </div>
        </div>
      </section>
      
      {/* ⚠️ আমি এখান থেকে ফুটার ডিলিট করে দিয়েছি যাতে লেআউটের ফুটারটি সুন্দরভাবে দেখা যায় */}
    </div>
  );
}