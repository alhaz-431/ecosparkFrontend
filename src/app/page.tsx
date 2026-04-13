'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import { motion, MotionProps } from 'framer-motion';

export default function HomePage() {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(false); // সার্চ করা হয়েছে কি না চেক করার জন্য

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    try {
      const res = await api.get('/ideas');
      setIdeas(res.data.ideas || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.get(`/ideas?search=${search}`);
      setIdeas(res.data.ideas || []);
      setHasSearched(true); // সার্চ রেজাল্ট আসলে এটি ট্রু হবে

      // রেজাল্ট সেকশনে অটো স্ক্রল
      setTimeout(() => {
        const element = document.getElementById('featured-ideas-section');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (error) {
      console.error(error);
    }
  };

  const fadeInUp: MotionProps = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.7, ease: "easeOut" }
  };

  return (
    <div className="bg-green-50/50 min-h-screen">

      {/* Hero Section */}
      <section className="relative bg-green-800 text-white py-28 px-6 text-center overflow-hidden min-h-[600px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="/eco-banner.png" 
            alt="Banner Background" 
            className="w-full h-full object-cover opacity-30" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-green-900/50 to-black/20"></div>
        </div>
        <div className="absolute inset-0 opacity-10 bg-[url('/grid.svg')] z-0"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block bg-green-600 text-green-100 text-sm px-4 py-1 rounded-full mb-4">
              🌍 Join 10,000+ Eco Warriors
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight drop-shadow-lg">
              Spark Change.<br />
              <span className="text-green-300">Save the Planet.</span>
            </h1>
            <p className="text-xl text-green-100 mb-10 max-w-2xl mx-auto drop-shadow-md">
              Share your sustainability ideas, inspire your community, and make a real difference for our environment.
            </p>
          </motion.div>

          <form onSubmit={handleSearch} className="flex justify-center gap-2 max-w-xl mx-auto mb-8">
            <input
              type="text"
              placeholder="Search sustainability ideas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 p-4 rounded-xl text-gray-800 focus:outline-none shadow-lg"
            />
            <button type="submit" className="bg-white text-green-700 px-8 py-4 rounded-xl font-bold hover:bg-green-100 transition shadow-lg">
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Stats Section */}
      <motion.section 
        initial={fadeInUp.initial}
        whileInView={fadeInUp.whileInView}
        viewport={fadeInUp.viewport}
        transition={fadeInUp.transition}
        className="bg-green-100/50 py-16 px-6 border-y border-green-100"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { icon: '💡', count: '200K+', label: 'Ideas Shared' },
            { icon: '👥', count: '50K+', label: 'Active Members' },
            { icon: '🌍', count: '120+', label: 'Countries' },
            { icon: '♻️', count: '80K+', label: 'Ideas Approved' },
          ].map((stat, i) => (
            <div key={i} className="p-4">
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-4xl font-extrabold text-green-700">{stat.count}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Why EcoSpark Hub Section */}
      <motion.section 
        initial={fadeInUp.initial}
        whileInView={fadeInUp.whileInView}
        viewport={fadeInUp.viewport}
        transition={fadeInUp.transition}
        className="py-24 px-6 max-w-6xl mx-auto"
      >
        <h2 className="text-4xl font-extrabold text-center text-green-900 mb-16">Why EcoSpark Hub?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { icon: '💡', title: 'Share Ideas', desc: 'Post your eco-friendly ideas and get feedback from the community.' },
            { icon: '🗳️', title: 'Vote & Discuss', desc: 'Upvote the best ideas and engage in meaningful discussions.' },
            { icon: '🏆', title: 'Get Recognized', desc: 'Top ideas get highlighted and recognized by the community.' },
            { icon: '📂', title: 'Browse Categories', desc: 'Find ideas by Energy, Waste, Transportation and more.' },
            { icon: '🔒', title: 'Secure Platform', desc: 'Your data is safe with JWT authentication and password hashing.' },
            { icon: '📱', title: 'Mobile Friendly', desc: 'Access EcoSpark Hub from any device, anywhere.' },
          ].map((f, i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -12, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
              className="bg-white p-10 rounded-3xl border border-green-50 shadow-sm text-center transition-all"
            >
              <div className="text-6xl mb-6">{f.icon}</div>
              <h3 className="font-bold text-xl text-green-800 mb-3">{f.title}</h3>
              <p className="text-gray-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Featured Ideas Section */}
      <motion.section 
        id="featured-ideas-section" // আইডি যোগ করা হলো স্ক্রল করার জন্য
        initial={fadeInUp.initial}
        whileInView={fadeInUp.whileInView}
        viewport={fadeInUp.viewport}
        transition={fadeInUp.transition}
        className="bg-green-50 py-24 px-6 scroll-mt-20"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-extrabold text-center text-green-900 mb-4">Featured Ideas</h2>
          
          {/* সার্চ রেজাল্ট টেক্সট */}
          {hasSearched && (
            <p className="text-center text-green-600 font-bold mb-12">
              Showing {ideas.length} results for "{search}"
            </p>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {ideas.length > 0 ? (
                ideas.slice(0, 6).map((idea) => (
                  <motion.div 
                    key={idea.id} 
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-3xl shadow-sm overflow-hidden border border-green-100 group"
                  >
                    <div className="h-56 bg-green-50 flex items-center justify-center overflow-hidden">
                      {idea.images?.[0] ? (
                        <img src={idea.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                      ) : (
                        <span className="text-7xl group-hover:rotate-12 transition duration-500">🌿</span>
                      )}
                    </div>
                    <div className="p-8">
                      <h3 className="font-bold text-xl text-green-900 mb-3">{idea.title}</h3>
                      <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed">{idea.description}</p>
                      
                      <Link 
                        href={`/ideas/${idea.id}`} 
                        prefetch={false} 
                        className="mt-6 inline-block bg-green-700 text-white px-6 py-2 rounded-full font-bold hover:bg-green-800 transition"
                      >
                        View Detail →
                      </Link>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-10 text-gray-400 font-bold">
                  No ideas found for your search!
                </div>
              )}
            </div>
          )}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="bg-gradient-to-r from-green-800 to-emerald-700 text-white py-24 px-6 text-center"
      >
        <h2 className="text-4xl md:text-5xl font-extrabold mb-8">Ready to Make a Difference? 🌍</h2>
        <Link href="/login" className="bg-white text-green-800 px-12 py-5 rounded-full text-xl font-bold hover:bg-green-50 transition shadow-2xl">
          Get Started Free →
        </Link>
      </motion.section>
    </div>
  );
}