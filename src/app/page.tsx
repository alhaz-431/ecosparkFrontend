'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ArrowRight, 
  Star, 
  Mail, 
  Globe, 
  Share2, 
  TrendingUp,
  LayoutGrid,
  ChevronRight,
  ShieldCheck,
  Zap,
  Leaf,
  Users,
  MessageSquare,
  HelpCircle,
  Plus
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
        const element = document.getElementById('discover-section');
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: "easeOut" as const }
  };

  const staggerContainer = {
    initial: {},
    whileInView: { transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen selection:bg-emerald-200 selection:text-emerald-900 overflow-x-hidden">
      <Toaster position="top-center" />

      {/* Modern Hero Section - Split Layout */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-50 dark:bg-emerald-950/20 -z-10 rounded-l-[100px] hidden lg:block" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-100/30 blur-[120px] rounded-full -z-10" />
        
        <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "circOut" as const }}
          >
            <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-8 border border-emerald-200/50 dark:border-emerald-800/50">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Next Gen Sustainability
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black text-gray-900 dark:text-white leading-[0.9] tracking-tighter mb-8">
              Empowering <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Green Visionaries.</span>
            </h1>
            
            <p className="text-xl text-gray-500 dark:text-gray-400 mb-10 max-w-xl font-medium leading-relaxed">
              EcoSpark Hub is the global stage for sustainable innovation. Share, fund, and scale ideas that redefine our relationship with the planet.
            </p>

            <div className="flex flex-wrap gap-4 mb-20">
              <Link 
                href="/ideas/create"
                className="bg-gray-900 dark:bg-emerald-600 text-white px-10 py-5 rounded-3xl font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-2xl shadow-gray-200 dark:shadow-emerald-900/40 flex items-center gap-3 active:scale-95"
              >
                Submit Idea <Plus size={20} />
              </Link>
              <button 
                onClick={() => document.getElementById('discover-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-100 dark:border-gray-700 px-10 py-5 rounded-3xl font-black uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center gap-3 active:scale-95"
              >
                Discover <ArrowRight size={20} />
              </button>
            </div>

            {/* Quick Trust Stats */}
            <div className="flex items-center gap-10">
              <div>
                <div className="text-2xl font-black text-gray-900 dark:text-white">85K+</div>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Active Ideas</div>
              </div>
              <div className="w-px h-10 bg-gray-100 dark:bg-gray-800" />
              <div>
                <div className="text-2xl font-black text-gray-900 dark:text-white">$2.4M</div>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Community Funding</div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "anticipate" as const }}
            className="relative hidden lg:block"
          >
            {/* Main Hero Card */}
            <div className="relative rounded-[60px] overflow-hidden shadow-2xl shadow-emerald-200/50 dark:shadow-emerald-950/20 aspect-[4/5] bg-gray-100">
              <Image 
                src="https://picsum.photos/seed/sustain/800/1000" 
                alt="Environmental Innovation" 
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-12 left-12 right-12">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 relative overflow-hidden">
                        <Image src={`https://i.pravatar.cc/100?u=${i}`} alt="User" fill />
                      </div>
                    ))}
                  </div>
                  <span className="text-white/80 text-xs font-bold">+12k supporters</span>
                </div>
                <h3 className="text-2xl font-black text-white mb-2 tracking-tight">AI-Driven Vertical Micro-Forests</h3>
                <p className="text-white/60 text-sm font-medium">Revolutionizing urban air quality with modular tech.</p>
              </div>
            </div>

            {/* Floating Accents */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -right-10 bg-white dark:bg-gray-800 p-8 rounded-[32px] shadow-2xl border border-gray-50 dark:border-gray-700 z-20"
            >
              <Zap className="text-amber-500 mb-2" size={32} />
              <div className="font-black text-gray-900 dark:text-white uppercase tracking-widest text-[10px]">Power Saved</div>
              <div className="text-2xl font-black text-emerald-600">1.2 GWh/yr</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Partner Trust Bar */}
      <section className="py-20 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-gray-400 font-black uppercase tracking-widest text-[10px] mb-10">Trusted by Global Environmental Leaders</p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
            {['GreenWorld', 'EcoVision', 'FutureEarth', 'BioMatrix', 'SustainCorp'].map(name => (
              <div key={name} className="font-black text-2xl text-gray-400 dark:text-gray-600 tracking-tighter">{name}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Search & Discover Section */}
      <section id="discover-section" className="py-32 px-6 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tighter mb-6">Discover Innovations</h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium max-w-2xl mx-auto">Explore thousands of community-driven projects addressing our most critical environmental challenges.</p>
          </div>

          {/* Functional Search Bar */}
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto mb-20 bg-gray-50 dark:bg-gray-900 p-4 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="relative flex-1">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by keyword, category, or project name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent text-gray-900 dark:text-white py-4 pl-16 pr-6 outline-none font-bold"
              />
            </div>
            <div className="flex gap-4">
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-4 px-6 rounded-2xl outline-none font-bold cursor-pointer border border-gray-100 dark:border-gray-700"
              >
                <option value="">All Categories</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <button type="submit" className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-emerald-700 transition shadow-lg active:scale-95">
                Search
              </button>
            </div>
          </form>

          {/* Idea Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <AnimatePresence mode="wait">
              {loading ? (
                [1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-[450px] bg-gray-50 dark:bg-gray-900 rounded-[48px] animate-pulse" />
                ))
              ) : ideas.length > 0 ? (
                ideas.slice(0, 6).map((idea, i) => (
                  <motion.div 
                    key={idea.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -10 }}
                    className="group bg-white dark:bg-gray-900 rounded-[48px] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden"
                  >
                    <div className="relative h-64 bg-gray-100">
                      <Image 
                        src={idea.images?.[0] || `https://picsum.photos/seed/${idea.id}/800/600`} 
                        alt={idea.title}
                        fill
                        className="object-cover group-hover:scale-110 transition duration-700"
                      />
                      <div className="absolute top-6 left-6">
                        <span className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md text-emerald-700 dark:text-emerald-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                          {idea.category?.name || idea.category || 'General'}
                        </span>
                      </div>
                    </div>
                    <div className="p-10 flex flex-col h-[calc(450px-256px)]">
                      <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3 tracking-tight line-clamp-1">{idea.title}</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-8 line-clamp-2 flex-1">{idea.description}</p>
                      
                      <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-gray-800">
                        <Link 
                          href={`/ideas/${idea.id}`}
                          className="text-gray-900 dark:text-white font-black text-xs uppercase tracking-widest flex items-center gap-2 group-hover:text-emerald-600 transition-colors"
                        >
                          Details <ArrowRight size={16} />
                        </Link>
                        {idea.isPaid && (
                          <span className="bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                            Premium
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center">
                  <Globe className="mx-auto text-gray-200 mb-6" size={64} />
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No eco-innovations found.</p>
                </div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-20 text-center">
            <Link 
              href="/ideas"
              className="inline-flex items-center gap-2 text-emerald-600 font-black uppercase tracking-widest text-sm hover:gap-4 transition-all"
            >
              Explore all community shares <ChevronRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Modern Bento Grid Features Section */}
      <section className="py-32 bg-gray-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 mb-20 items-end">
            <div>
              <div className="text-emerald-400 font-black uppercase tracking-widest text-xs mb-4">Core Ecosystem</div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter">Everything you need to <span className="text-emerald-400">ignite change.</span></h2>
            </div>
            <p className="text-gray-400 text-xl font-medium max-w-md leading-relaxed">
              We provide the tools, the network, and the capital to transform sketches on napkins into global climate solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            {/* Bento Item 1 */}
            <motion.div {...fadeInUp} className="md:col-span-2 bg-emerald-600 rounded-[48px] p-12 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[100%] bg-white/10 blur-[80px] rounded-full group-hover:scale-150 transition-transform duration-1000" />
              <LayoutGrid size={48} className="text-emerald-100/50 mb-8" />
              <div>
                <h3 className="text-3xl font-black mb-4">Community Governance</h3>
                <p className="text-emerald-50/80 font-medium max-w-md">Our community votes on which ideas get vetted and highlighted. Real democracy for a real environment.</p>
              </div>
            </motion.div>

            {/* Bento Item 2 */}
            <motion.div {...fadeInUp} className="bg-gray-800 rounded-[48px] p-10 flex flex-col justify-end group">
              <Zap size={32} className="text-amber-400 mb-6" />
              <h3 className="text-2xl font-black mb-2">Rapid Prototyping</h3>
              <p className="text-gray-400 text-sm font-medium">Access blueprints and technical data from shared open-source projects.</p>
            </motion.div>

            {/* Bento Item 3 */}
            <motion.div {...fadeInUp} className="bg-white text-gray-900 rounded-[48px] p-10 flex flex-col items-center justify-center text-center group">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 text-emerald-600 group-hover:rotate-12 transition-transform">
                <ShieldCheck size={40} />
              </div>
              <h3 className="text-2xl font-black mb-2">Authenticated</h3>
              <p className="text-gray-500 text-sm font-medium">Every idea is manually verified by our environmental ethics board.</p>
            </motion.div>

            {/* Bento Item 4 */}
            <motion.div {...fadeInUp} className="md:col-span-2 bg-gradient-to-br from-teal-500 to-emerald-700 rounded-[48px] p-12 flex flex-col md:flex-row items-center gap-12 group">
              <div className="flex-1">
                <h3 className="text-3xl font-black mb-4">Global Reach</h3>
                <p className="text-emerald-50/80 font-medium leading-relaxed">Connect with experts across 120 countries and 5 continents to scale your sustainability project locally.</p>
              </div>
              <div className="w-48 h-48 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center">
                <Globe size={80} className="text-white animate-[spin_10s_linear_infinite]" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Top Projects Spotlight */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tighter mb-4">Top Rated Projects</h2>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Highest environmental impact scores</p>
            </div>
            <Link href="/ideas?sort=top_voted" className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-100 transition-all">
              View All Rankings
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {topIdeas.map((idea, index) => (
              <motion.div 
                key={idea.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative bg-white dark:bg-gray-900 p-12 rounded-[56px] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-100/50 dark:shadow-none overflow-hidden group"
              >
                <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-emerald-50 dark:bg-emerald-900/10 rounded-full group-hover:scale-110 transition-transform -z-1" />
                
                <div className="flex items-center justify-between mb-8">
                  <div className="w-16 h-16 bg-emerald-600 text-white rounded-[24px] flex items-center justify-center font-black text-2xl shadow-lg shadow-emerald-200 dark:shadow-emerald-900/40">
                    {index + 1}
                  </div>
                  <div className="flex items-center gap-1 text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-full">
                    <Star size={14} fill="currentColor" />
                    <span className="text-[10px] font-black uppercase">Elite</span>
                  </div>
                </div>

                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6 leading-tight">{idea.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 font-medium mb-10 leading-relaxed italic line-clamp-3">
                  &quot;{idea.description}&quot;
                </p>

                <div className="pt-8 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Impact Score</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-black text-lg">9.8/10</span>
                  </div>
                  <Link 
                    href={`/ideas/${idea.id}`}
                    className="w-12 h-12 rounded-full bg-gray-900 dark:bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-600 transition-colors shadow-lg"
                  >
                    <ArrowRight size={20} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern FAQ Section */}
      <section className="py-32 bg-gray-50 dark:bg-gray-900/30">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-20">
            <HelpCircle className="mx-auto text-emerald-500 mb-8" size={64} />
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tighter mb-6">Frequently Asked</h2>
          </div>

          <div className="space-y-6">
            {[
              { q: "How do I submit an idea?", a: "Create an account, go to the share page, and fill out our guided sustainability form. Our experts will review it within 48 hours." },
              { q: "What defines a 'Premium' idea?", a: "Premium ideas often include detailed technical blueprints, supply chain contacts, or proprietary data that authors have opted to monetize." },
              { q: "Can I invest in these projects?", a: "Currently, our platform facilitates community support and direct purchase of plans. Direct investment features are coming in late 2026." },
              { q: "Is EcoSpark Hub non-profit?", a: "We are a mission-driven social enterprise. We take 0% of community sales, reinvesting platform fees into scaling local green projects." }
            ].map((faq, i) => (
              <details key={i} className="group bg-white dark:bg-gray-800 rounded-[32px] border border-gray-100 dark:border-gray-700 open:shadow-xl transition-all">
                <summary className="flex items-center justify-between p-8 cursor-pointer list-none font-black text-gray-900 dark:text-white uppercase tracking-widest text-xs">
                  {faq.q}
                  <ChevronRight size={20} className="text-emerald-500 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-8 pb-8 text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* High-End Newsletter */}
      <section className="py-40 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-emerald-900 dark:bg-emerald-950 -z-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-emerald-400/10 blur-[160px] rounded-full -z-10" />
        
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tighter mb-10">
              The Future of <br />
              <span className="text-emerald-400 italic font-serif">Sustainability</span> <br />
              in Your Inbox.
            </h2>
            <p className="text-emerald-100/60 text-lg font-medium mb-12 max-w-md">
              Join 50,000+ visionaries receiving weekly updates on radical green tech and community success stories.
            </p>
            <div className="flex items-center gap-6">
              <div className="flex -space-x-3">
                {[4, 5, 6, 7].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-emerald-900 bg-gray-200 relative overflow-hidden">
                    <Image src={`https://i.pravatar.cc/100?u=${i}`} alt="User" fill />
                  </div>
                ))}
              </div>
              <p className="text-white text-sm font-black uppercase tracking-widest">Joined daily by experts</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-2xl p-12 rounded-[60px] border border-white/20">
            <Mail className="text-emerald-400 mb-8" size={56} />
            <form className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] text-white/50 font-black uppercase tracking-[0.2em]">Contact Email</label>
                <input 
                  type="email" 
                  placeholder="name@company.com" 
                  className="w-full bg-white/10 border-none rounded-2xl py-5 px-8 text-white outline-none focus:bg-white/20 transition-all font-bold placeholder:text-white/20"
                />
              </div>
              <button className="w-full bg-white text-emerald-900 py-6 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-50 transition-all shadow-2xl active:scale-95">
                Join Network Now
              </button>
            </form>
            <p className="text-center text-[10px] text-white/30 font-bold uppercase tracking-widest mt-8">No spam. Only impact. Unsubscribe anytime.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 bg-white dark:bg-gray-950 border-t border-gray-50 dark:border-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-16 mb-20">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                  <Leaf size={24} />
                </div>
                <span className="font-black text-2xl text-gray-900 dark:text-white tracking-tighter">EcoSpark Hub</span>
              </div>
              <p className="text-gray-400 font-medium max-w-xs mb-10 leading-relaxed">
                Empowering the next generation of environmental leaders through decentralized community innovation.
              </p>
              <div className="flex gap-4">
                {[Globe, Share2, MessageSquare].map((Icon, i) => (
                  <div key={i} className="w-10 h-10 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-emerald-600 cursor-pointer transition-colors">
                    <Icon size={20} />
                  </div>
                ))}
              </div>
            </div>

            {[
              { title: 'Platform', links: ['Discover', 'Funding', 'Premium Ideas', 'Governance'] },
              { title: 'Company', links: ['About Us', 'Impact Report', 'Contact', 'Ethics Board'] },
              { title: 'Resources', links: ['Help Center', 'Blueprints', 'API Docs', 'Legal'] },
            ].map((section, i) => (
              <div key={i}>
                <h4 className="font-black text-gray-900 dark:text-white uppercase tracking-widest text-[10px] mb-8">{section.title}</h4>
                <ul className="space-y-4">
                  {section.links.map(link => (
                    <li key={link}>
                      <a href="#" className="text-gray-400 hover:text-emerald-600 font-medium transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-10 border-t border-gray-50 dark:border-gray-900 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">© 2026 EcoSpark Hub. All rights reserved.</p>
            <div className="flex items-center gap-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <span className="cursor-pointer hover:text-emerald-600 transition-colors">Privacy Policy</span>
              <span className="cursor-pointer hover:text-emerald-600 transition-colors">Terms of Service</span>
              <span className="cursor-pointer hover:text-emerald-600 transition-colors underline decoration-emerald-500/30">Bangladesh HQ</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}