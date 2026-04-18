'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, ArrowRight, Star, Mail, Globe, LayoutGrid, ChevronRight, 
  ShieldCheck, Zap, Leaf, Plus, Sparkles, BarChart3, Target, 
  ShieldAlert, Rocket, Heart, Award
} from 'lucide-react';
import { Toaster } from 'react-hot-toast';

export default function HomePage() {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [topIdeas, setTopIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="bg-white dark:bg-[#050505] min-h-screen selection:bg-emerald-200">
      <Toaster position="top-center" />

      {/* --- 1. HERO SECTION --- */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-[50%] h-[70%] bg-emerald-500/5 blur-[120px] rounded-full -z-10" />
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
            <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest mb-6 border border-emerald-100 dark:border-emerald-500/20">
              <Sparkles size={14} /> Eco-Innovation Hub 2026
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white leading-[0.9] tracking-tighter mb-8">
              Ignite <span className="text-emerald-500">Change</span> <br /> Save Earth.
            </h1>
            <p className="text-xl text-slate-500 dark:text-slate-400 mb-10 max-w-lg leading-relaxed">
              আপনার পরিবেশবান্ধব আইডিয়াগুলো শেয়ার করুন, তহবিল সংগ্রহ করুন এবং বিশ্বজুড়ে টেকসই পরিবর্তনের অংশ হোন।
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/ideas/create" className="bg-emerald-600 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 dark:shadow-none flex items-center gap-3 active:scale-95">
                Launch Idea <Plus size={20} />
              </Link>
            </div>
          </motion.div>
          <div className="relative">
            <div className="aspect-square bg-slate-100 dark:bg-slate-900 rounded-[60px] overflow-hidden border-8 border-white dark:border-slate-800 shadow-2xl relative">
              <Image src="https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?q=80&w=1000" alt="Nature" fill className="object-cover opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/40 to-transparent" />
            </div>
            <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -top-10 -right-5 bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-2xl border border-slate-50 dark:border-slate-700">
              <BarChart3 className="text-emerald-500 mb-2" size={32} />
              <div className="text-2xl font-black text-slate-900 dark:text-white">850+</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">Projects Funded</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- 2. IMPACT TRACKER --- */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'CO2 Reduced', val: '12.4M Tons', icon: <Leaf /> },
            { label: 'Green Energy', val: '45.8 GWh', icon: <Zap /> },
            { label: 'Contributors', val: '240K+', icon: <Globe /> },
            { label: 'Verified Ideas', val: '12,000+', icon: <ShieldCheck /> }
          ].map((item, i) => (
            <div key={i} className="text-center group">
              <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-500 shadow-sm group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-white">{item.val}</div>
              <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* --- 3. BENTO GRID --- */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter mb-20 text-center">
            How We Empower <br /> <span className="text-emerald-500">Green Innovators.</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-10 bg-emerald-600 rounded-[48px] text-white md:col-span-2 relative overflow-hidden">
              <Rocket size={48} className="mb-6 opacity-50" />
              <h3 className="text-3xl font-black mb-4">Incubation & Mentorship</h3>
              <p className="text-emerald-50/80 font-medium max-w-md italic">
                আমরা শুধু আইডিয়া শেয়ার করি না, আমরা সেগুলোকে বাস্তবে রূপ দিতে বিশেষজ্ঞদের মাধ্যমে মেন্টরশিপ প্রদান করি।
              </p>
              <div className="absolute right-[-10%] bottom-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            </div>
            <div className="p-10 bg-slate-900 rounded-[48px] text-white flex flex-col justify-between">
              <ShieldAlert size={32} className="text-amber-400" />
              <div>
                <h3 className="text-2xl font-black mb-2">Ethics Board</h3>
                <p className="text-slate-400 text-sm">প্রতিটি প্রজেক্ট আমাদের এনভায়রনমেন্টাল এথিক্স বোর্ড দ্বারা যাচাইকৃত।</p>
              </div>
            </div>
            <div className="p-10 bg-slate-100 dark:bg-slate-800 rounded-[48px] text-slate-900 dark:text-white">
              <Target size={32} className="text-emerald-500 mb-6" />
              <h3 className="text-2xl font-black mb-2">Precision Funding</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">সরাসরি ক্রিপ্টো বা লোকাল পেমেন্টের মাধ্যমে আপনার প্রজেক্টে ফান্ড সংগ্রহ করুন।</p>
            </div>
            <div className="p-10 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[48px] md:col-span-2 flex items-center gap-8">
              <div className="hidden sm:block w-32 h-32 bg-emerald-100 dark:bg-emerald-500/10 rounded-3xl flex-shrink-0" />
              <div>
                <h3 className="text-2xl font-black mb-2 text-slate-900 dark:text-white">EcoSpark Marketplace</h3>
                <p className="text-slate-500 dark:text-slate-400">পরিবেশবান্ধব ব্লুপ্রিন্ট কেনা-বেচার জন্য আমাদের নিজস্ব প্রিমিয়াম মার্কেটপ্লেস।</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 4. INVESTOR SPOTLIGHT --- */}
      <section className="py-32 bg-[#0a0a0a] text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 items-center gap-20">
          <div>
            <div className="text-emerald-400 font-black text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
              <Award size={16} /> Partner with us
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-none">
              Are you an <br /> <span className="text-emerald-400">Investor?</span>
            </h2>
            <p className="text-slate-400 text-lg mb-10 leading-relaxed">
              বিশ্বের সবচেয়ে সম্ভাবনাময় গ্রিন প্রজেক্টগুলোতে সরাসরি বিনিয়োগ করুন। আমরা ডাটা-চালিত ইমপ্যাক্ট রিপোর্ট প্রদান করি।
            </p>
            <button className="px-10 py-5 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-400 transition-all">
              Become a Partner
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
             {[1,2,3,4].map(i => (
               <div key={i} className="aspect-square bg-slate-800/50 backdrop-blur-xl rounded-[40px] border border-white/5 flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-white/10 rounded-full mx-auto mb-4" />
                    <div className="h-2 w-20 bg-white/20 rounded-full mx-auto mb-2" />
                    <div className="h-2 w-12 bg-white/10 rounded-full mx-auto" />
                  </div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* --- 5. LATEST IDEAS GRID --- */}
      <section id="discover-section" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20">
            <div>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter">Discover Innovations</h2>
              <div className="h-1.5 w-24 bg-emerald-500 mt-4 rounded-full" />
            </div>
            <Link href="/ideas" className="text-slate-400 hover:text-emerald-500 font-black uppercase tracking-widest text-xs flex items-center gap-2 transition-all">
              Explore All <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {loading ? (
              [1, 2, 3].map(i => <div key={i} className="h-96 bg-slate-50 dark:bg-slate-900 animate-pulse rounded-[48px]" />)
            ) : (
              ideas.slice(0, 3).map((idea, i) => (
                <motion.div key={idea.id} whileHover={{ y: -10 }} className="group bg-white dark:bg-slate-900 rounded-[48px] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-emerald-500/5 transition-all duration-500">
                  <div className="relative h-64 overflow-hidden">
                    <Image src={idea.images?.[0] || `https://images.unsplash.com/photo-1518005020480-1cd34333799c?q=80&w=800`} alt={idea.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-6 left-6 flex gap-2">
                       <span className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-600">
                         {/* এখানে ফিক্স করা হয়েছে: অবজেক্ট চেক করা হচ্ছে */}
                         {typeof idea.category === 'object' ? idea.category.name : (idea.category || 'Environmental')}
                       </span>
                       {idea.isPaid && <span className="bg-amber-400 text-amber-900 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Premium</span>}
                    </div>
                  </div>
                  <div className="p-10">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 line-clamp-1">{idea.title}</h3>
                    <div className="flex items-center justify-between mt-8 pt-8 border-t border-slate-50 dark:border-slate-800">
                       <Link href={`/ideas/${idea.id}`} className="font-black text-xs uppercase tracking-widest text-slate-400 group-hover:text-emerald-500 flex items-center gap-2">
                         Explore <ArrowRight size={16} />
                       </Link>
                       <div className="flex items-center gap-1 text-slate-400">
                          <Heart size={14} className="group-hover:text-rose-500 transition-colors" />
                          <span className="text-xs font-bold">2.4k</span>
                       </div>
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
        <div className="max-w-5xl mx-auto bg-emerald-50 dark:bg-emerald-500/5 rounded-[60px] p-12 md:p-24 text-center border border-emerald-100 dark:border-emerald-500/10">
          <Mail className="mx-auto text-emerald-500 mb-8" size={64} />
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">Stay in the Green Loop.</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-lg mx-auto">সাপ্তাহিক সেরা গ্রিন আইডিয়া এবং আপডেট পেতে আমাদের সাথে যুক্ত থাকুন।</p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input type="email" placeholder="Enter your email" className="flex-1 bg-white dark:bg-slate-800 border-none rounded-2xl py-5 px-8 outline-none focus:ring-2 ring-emerald-500 shadow-sm" />
            <button type="button" className="bg-slate-900 dark:bg-emerald-600 text-white px-8 py-5 rounded-2xl font-black uppercase tracking-widest hover:opacity-90 transition-all">Join</button>
          </form>
        </div>
      </section>

      {/* --- 7. FOOTER --- */}
      <footer className="py-20 bg-white dark:bg-[#050505] border-t border-slate-50 dark:border-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10 mb-16">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-200 dark:shadow-none">
                <Leaf size={28} />
              </div>
              <span className="font-black text-3xl text-slate-900 dark:text-white tracking-tighter">EcoSpark Hub</span>
            </div>
            <div className="flex gap-10">
               {['About', 'Ideas', 'Investors', 'FAQ'].map(item => (
                 <Link key={item} href="#" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-emerald-500 transition-colors">{item}</Link>
               ))}
            </div>
          </div>
          <div className="pt-10 border-t border-slate-50 dark:border-slate-900 flex justify-between items-center">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">© 2026 EcoSpark Hub • BD HQ 🇧🇩</p>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 hover:text-emerald-500 cursor-pointer transition-colors"><Globe size={16} /></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}