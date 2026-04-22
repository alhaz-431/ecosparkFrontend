'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/axios';
import { motion } from 'framer-motion';
import { 
  ArrowRight, ChevronRight, Plus, 
  Rocket, Zap, ShieldCheck, TrendingUp,
  Users, Globe, Sparkles, MessageSquare,
  Lightbulb, Share2, Award, Leaf, Recycle, Droplets, Sun, Search
} from 'lucide-react';
import { Toaster } from 'react-hot-toast';

export default function HomePage() {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // --- নতুন স্টেট: সার্চ এবং ফিল্টারের জন্য ---
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // ক্যাটাগরি ডাটা
  const categories = [
    { name: "Solar Energy", icon: <Sun size={32} />, color: "bg-amber-50 text-amber-600" },
    { name: "Recycling", icon: <Recycle size={32} />, color: "bg-emerald-50 text-emerald-600" },
    { name: "Water Tech", icon: <Droplets size={32} />, color: "bg-blue-50 text-blue-600" },
    { name: "Eco Farming", icon: <Leaf size={32} />, color: "bg-green-50 text-green-600" }
  ];

  // যখনই ক্যাটাগরি চেঞ্জ হবে অটোমেটিক ডাটা লোড হবে
  useEffect(() => {
    fetchInitialData();
  }, [selectedCategory]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      // কোয়েরি প্যারামিটারসহ এপিআই কল
      const res = await api.get(`/ideas?search=${searchTerm}&category=${selectedCategory}&status=APPROVED`);
      setIdeas(res.data.ideas || res.data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // সার্চ হ্যান্ডলার
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchInitialData();
  };

  return (
    <div className="bg-white selection:bg-emerald-100 selection:text-emerald-900">
      <Toaster position="top-center" />

      {/* --- ১. হিরো ব্যানার --- */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gray-900">
        <Image 
          src="https://images.unsplash.com/photo-1473300221329-027213af9fca?q=80&w=2000" 
          alt="Sustainability Green Background" 
          fill 
          className="object-cover opacity-80"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70 z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <div className="inline-block bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-300 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-8">
              🌱 Empowering The Next Green Revolution
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-white leading-tight tracking-tighter mb-6 uppercase">
              Transforming <span className="text-emerald-400">Green</span> <br /> Visionaries.
            </h1>
            
            {/* সার্চ বার */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-10 relative">
                <input 
                    type="text" 
                    placeholder="Search eco-friendly ideas..." 
                    className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-full py-5 px-8 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="absolute right-3 top-2.5 bg-emerald-500 p-3 rounded-full hover:bg-emerald-400 transition-colors">
                    <Search size={24} className="text-white" />
                </button>
            </form>

            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/ideas/create" className="bg-emerald-600 text-white px-10 py-5 rounded-full font-black uppercase tracking-widest hover:bg-emerald-500 transition-all flex items-center gap-3 shadow-2xl active:scale-95">
                Submit Idea <Plus size={20} />
              </Link>
              <Link href="/ideas" className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-10 py-5 rounded-full font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center gap-3">
                Explore All <ArrowRight size={20} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- ২. ইমপ্যাক্ট কাউন্টার --- */}
      <section className="py-20 bg-[#001f3f] text-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: "Active Ideas", value: "2,500+" },
            { label: "Community Members", value: "10K+" },
            { label: "Carbon Reduced", value: "150 Tons" },
            { label: "Countries", value: "45+" }
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-4xl md:text-5xl font-black text-emerald-400 mb-2">{stat.value}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-blue-200">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* --- ৩. ক্যাটাগরি সেকশন --- */}
      <section className="py-32 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 uppercase tracking-tighter">Explore Categories</h2>
            <p className="text-gray-500 mt-4 font-medium uppercase tracking-widest text-xs">খুঁজে নিন আপনার পছন্দের সেক্টর</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, i) => (
              <div 
                key={i} 
                onClick={() => setSelectedCategory(selectedCategory === cat.name ? '' : cat.name)}
                className={`p-10 rounded-[40px] ${cat.color} flex flex-col items-center justify-center text-center group hover:scale-105 transition-all cursor-pointer border-4 ${selectedCategory === cat.name ? 'border-emerald-500 shadow-xl' : 'border-transparent'}`}
              >
                <div className="mb-6 group-hover:animate-bounce">{cat.icon}</div>
                <h4 className="font-black uppercase tracking-widest text-sm">{cat.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- ৪. হাউ ইট ওয়ার্কস --- */}
      <section className="py-32 bg-gray-50 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 uppercase tracking-tighter mb-20">How EcoSpark Works</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: <Lightbulb size={40}/>, step: "01", title: "Create", desc: "আপনার আইডিয়া বা প্রজেক্ট প্ল্যানটি আমাদের প্ল্যাটফর্মে বিস্তারিত লিখুন।" },
              { icon: <Share2 size={40}/>, step: "02", title: "Connect", desc: "বিশ্বের বিভিন্ন প্রান্তের পরিবেশবিদদের কাছ থেকে মতামত ও ভোট সংগ্রহ করুন।" },
              { icon: <Award size={40}/>, step: "03", title: "Impact", desc: "আপনার আইডিয়া বাস্তবায়নের জন্য প্রয়োজনীয় সাপোর্ট এবং ফান্ডিং বুঝে নিন।" }
            ].map((item, i) => (
              <div key={i} className="relative bg-white p-12 rounded-[50px] border border-gray-100 shadow-sm">
                <span className="absolute top-8 right-10 text-6xl font-black text-gray-50 opacity-10">{item.step}</span>
                <div className="text-emerald-600 mb-8 flex justify-center">{item.icon}</div>
                <h4 className="text-2xl font-black text-gray-900 mb-4 uppercase">{item.title}</h4>
                <p className="text-gray-500 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- ৫. লেটেস্ট আইডিয়া গ্রিড --- */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter leading-none">
                {selectedCategory ? `${selectedCategory} Ideas` : 'Latest Innovations'}
            </h2>
            <Link href="/ideas" className="bg-gray-900 text-white px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-600 transition-all">
              View All <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {loading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="bg-gray-50 rounded-[40px] overflow-hidden border border-gray-100">
                    <div className="h-60 bg-gray-200 animate-pulse" />
                    <div className="p-8 space-y-4">
                        <div className="h-8 bg-gray-200 animate-pulse w-3/4 rounded-md" />
                        <div className="h-4 bg-gray-200 animate-pulse w-full rounded-md" />
                    </div>
                </div>
              ))
            ) : ideas.length > 0 ? (
              ideas.slice(0, 6).map((idea) => (
                <div key={idea.id} className="group bg-white rounded-[40px] border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500">
                  <div className="relative h-60 overflow-hidden">
                    <img src={idea.images?.[0] || `https://picsum.photos/seed/${idea.id}/800/600`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={idea.title} />
                    <div className="absolute top-5 right-5 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest text-emerald-700">
                        {idea.type === 'PAID' ? `৳${idea.price}` : 'Free'}
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-2">{idea.category?.name}</div>
                    <h3 className="text-2xl font-black text-gray-900 mb-4 line-clamp-1 group-hover:text-emerald-600 transition-colors">{idea.title}</h3>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-8 font-medium">{idea.description}</p>
                    <Link href={`/ideas/${idea.id}`} className="inline-flex items-center gap-2 font-black text-xs uppercase tracking-widest text-emerald-600 group-hover:gap-4 transition-all">
                      Read Details <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
                <div className="col-span-full py-20 text-center">
                    <p className="text-gray-400 font-bold uppercase tracking-widest">No ideas found.</p>
                </div>
            )}
          </div>
        </div>
      </section>

      {/* --- ৬. টেস্টিমোনিয়াল --- */}
      <section className="py-32 bg-gray-50 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block p-4 bg-emerald-100 text-emerald-600 rounded-full mb-8">
            <MessageSquare size={32} />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-12 uppercase tracking-tighter">Community Feedback</h2>
          <div className="bg-white p-12 md:p-20 rounded-[60px] shadow-sm relative border border-gray-100">
             <p className="text-2xl md:text-3xl font-medium text-gray-600 italic leading-relaxed">
               "আমি আমার অর্গানিক ফার্মিং আইডিয়াটা নিয়ে চিন্তিত ছিলাম, কিন্তু এখানকার মেন্টরদের সাপোর্ট পেয়ে আমি আজ সফল।"
             </p>
             <div className="mt-12 flex items-center justify-center gap-4">
               <div className="w-14 h-14 bg-emerald-600 rounded-full flex items-center justify-center text-white font-black">Ma</div>
               <div className="text-left">
                 <h5 className="font-black text-gray-900 uppercase text-sm">Mohammad Alhaz</h5>
                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Green Developer</p>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* --- ৭. কল টু অ্যাকশন --- */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto bg-[#001f3f] rounded-[60px] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10 text-white">
            <h2 className="text-4xl md:text-7xl font-black tracking-tighter mb-8 uppercase leading-none">Ready to lead <br/> the change?</h2>
            <p className="text-blue-100 text-lg md:text-2xl mb-12 max-w-2xl mx-auto font-medium">
              আপনার স্বপ্নগুলোকে বাস্তবে রূপ দিতে আমাদের কমিউনিটিতে আজই যোগ দিন। 
            </p>
            <Link href="/register" className="bg-emerald-500 text-white px-12 py-6 rounded-full font-black uppercase tracking-widest hover:bg-white hover:text-[#001f3f] transition-all text-xl">
              Join Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}