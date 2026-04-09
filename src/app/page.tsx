'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';

export default function HomePage() {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

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
    } catch (error) {
      console.error(error);
    }
  };

  const topIdeas = [...ideas]
    .sort((a, b) => (b.votes?.length || 0) - (a.votes?.length || 0))
    .slice(0, 3);

  return (
    // বডি কালার এখন হালকা সবুজ আভা (bg-green-50)
    <div className="bg-green-50/50 min-h-screen">

      {/* Hero Section - Image occupies full banner area */}
      <section className="relative bg-green-800 text-white py-28 px-6 text-center overflow-hidden min-h-[500px] flex items-center justify-center">
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
          <div className="inline-block bg-green-600 text-green-100 text-sm px-4 py-1 rounded-full mb-4">
            🌍 Join 10,000+ Eco Warriors
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg text-white">
            Spark Change.<br />
            <span className="text-green-300">Save the Planet.</span>
          </h1>
          <p className="text-xl text-green-100 mb-10 max-w-2xl mx-auto drop-shadow-md">
            Share your sustainability ideas, inspire your community, and make a real difference for our environment.
          </p>
          <form onSubmit={handleSearch} className="flex justify-center gap-2 max-w-xl mx-auto mb-8">
            <input
              type="text"
              placeholder="Search sustainability ideas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 p-4 rounded-xl text-gray-800 focus:outline-none shadow-lg"
            />
            <button
              type="submit"
              className="bg-green-700 text-white px-8 py-4 rounded-xl font-bold hover:bg-green-800 transition shadow-lg border border-green-600"
            >
              Search
            </button>
          </form>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/ideas" className="bg-white text-green-700 px-8 py-3 rounded-full font-bold hover:bg-green-100 transition shadow-lg">
              Browse Ideas 🌱
            </Link>
            <Link href="/login" className="border-2 border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-green-700 transition">
              Share Your Idea ✨
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section - হালকা সবুজ ব্যাকগ্রাউন্ড */}
      <section className="bg-green-100/50 py-16 px-6 border-y border-green-100">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: '💡', count: '500+', label: 'Ideas Shared' },
            { icon: '👥', count: '10K+', label: 'Community Members' },
            { icon: '🌍', count: '50+', label: 'Countries' },
            { icon: '♻️', count: '200+', label: 'Ideas Approved' },
          ].map((stat, i) => (
            <div key={i} className="p-4 group">
              <div className="text-4xl mb-3 group-hover:scale-110 transition">{stat.icon}</div>
              <div className="text-3xl font-extrabold text-green-800">{stat.count}</div>
              <div className="text-green-600 font-medium text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section - কার্ডগুলোতে বর্ডার ও সবুজের ছোঁয়া */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center text-green-900 mb-4">Why EcoSpark Hub?</h2>
        <p className="text-center text-green-700/70 mb-16 max-w-xl mx-auto">Everything you need to make your sustainability ideas heard on a global scale</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: '💡', title: 'Share Ideas', desc: 'Post your eco-friendly ideas and get feedback from the community.' },
            { icon: '🗳️', title: 'Vote & Discuss', desc: 'Upvote the best ideas and engage in meaningful discussions.' },
            { icon: '🏆', title: 'Get Recognized', desc: 'Top ideas get highlighted and recognized by the community.' },
            { icon: '📂', title: 'Browse Categories', desc: 'Find ideas by Energy, Waste, Transportation and more.' },
            { icon: '🔒', title: 'Secure Platform', desc: 'Your data is safe with JWT authentication and password hashing.' },
            { icon: '📱', title: 'Mobile Friendly', desc: 'Access EcoSpark Hub from any device, anywhere.' },
          ].map((f, i) => (
            <div key={i} className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-green-100 shadow-sm hover:shadow-xl hover:shadow-green-200/50 transition-all duration-300 text-center">
              <div className="text-5xl mb-5">{f.icon}</div>
              <h3 className="font-bold text-xl text-green-900 mb-3">{f.title}</h3>
              <p className="text-green-700/80 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Ideas - একটু গাঢ় শেড ব্যবহার করা হয়েছে আলাদা করতে */}
      <section className="bg-green-50 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-extrabold text-center text-green-900 mb-4">Featured Ideas</h2>
          <p className="text-center text-green-700/70 mb-16">Discover the latest sustainability ideas from our community</p>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
            </div>
          ) : ideas.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-green-100 shadow-inner">
              <div className="text-7xl mb-4">🌱</div>
              <p className="text-green-800 text-lg font-medium">No ideas yet. Be the first to share!</p>
              <Link href="/login" className="mt-6 inline-block bg-green-700 text-white px-8 py-3 rounded-full hover:bg-green-800 shadow-lg">
                Share an Idea
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {ideas.slice(0, 6).map((idea) => (
                <div key={idea.id} className="bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden group border border-green-50">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 h-52 flex items-center justify-center overflow-hidden">
                    {idea.images?.[0] ? (
                      <img src={idea.images[0]} alt={idea.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                    ) : (
                      <span className="text-8xl group-hover:rotate-12 transition duration-500">🌿</span>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="bg-green-100 text-green-700 text-xs px-4 py-1.5 rounded-full font-bold tracking-wide">
                        {idea.category?.name}
                      </span>
                    </div>
                    <h3 className="font-bold text-xl text-green-900 mt-2 line-clamp-1">{idea.title}</h3>
                    <p className="text-green-700/70 text-sm mt-3 line-clamp-2 leading-relaxed">{idea.description}</p>
                    <div className="flex justify-between items-center mt-6 pt-5 border-t border-green-50">
                      <div className="flex gap-4 text-sm font-bold text-green-600">
                        <span className="flex items-center gap-1">👍 {idea.votes?.filter((v: any) => v.value === 1).length || 0}</span>
                      </div>
                      <Link
                        href={`/ideas/${idea.id}`}
                        className="bg-green-700 text-white px-5 py-2 rounded-full text-sm hover:bg-green-800 transition shadow-md"
                      >
                        View Idea →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-800 to-emerald-700 text-white py-24 px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6">Ready to Make a Difference? 🌍</h2>
        <p className="text-green-100 text-xl mb-10 max-w-2xl mx-auto opacity-90">
          Join thousands of eco-warriors and share your sustainability ideas today.
        </p>
        <Link href="/login" className="bg-white text-green-800 px-12 py-5 rounded-full text-lg font-bold hover:bg-green-50 transition shadow-2xl">
          Get Started Free →
        </Link>
      </section>
    </div>
  );
}