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
    .sort((a, b) => b.votes.length - a.votes.length)
    .slice(0, 3);

  return (
    <div className="bg-gray-50">

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-800 via-green-700 to-emerald-600 text-white py-28 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/grid.svg')]"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-block bg-green-600 text-green-100 text-sm px-4 py-1 rounded-full mb-4">
            🌍 Join 10,000+ Eco Warriors
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Spark Change.<br />
            <span className="text-green-300">Save the Planet.</span>
          </h1>
          <p className="text-xl text-green-100 mb-10 max-w-2xl mx-auto">
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
              className="bg-white text-green-700 px-8 py-4 rounded-xl font-bold hover:bg-green-100 transition shadow-lg"
            >
              Search
            </button>
          </form>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/ideas" className="bg-white text-green-700 px-8 py-3 rounded-full font-bold hover:bg-green-100 transition shadow">
              Browse Ideas 🌱
            </Link>
            <Link href="/login" className="border-2 border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-green-700 transition">
              Share Your Idea ✨
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12 px-6 shadow-sm">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: '💡', count: '500+', label: 'Ideas Shared' },
            { icon: '👥', count: '10K+', label: 'Community Members' },
            { icon: '🌍', count: '50+', label: 'Countries' },
            { icon: '♻️', count: '200+', label: 'Ideas Approved' },
          ].map((stat, i) => (
            <div key={i} className="p-4">
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-extrabold text-green-700">{stat.count}</div>
              <div className="text-gray-500 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-4">Why EcoSpark Hub?</h2>
        <p className="text-center text-gray-500 mb-12">Everything you need to make your sustainability ideas heard</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: '💡', title: 'Share Ideas', desc: 'Post your eco-friendly ideas and get feedback from the community.' },
            { icon: '🗳️', title: 'Vote & Discuss', desc: 'Upvote the best ideas and engage in meaningful discussions.' },
            { icon: '🏆', title: 'Get Recognized', desc: 'Top ideas get highlighted and recognized by the community.' },
            { icon: '📂', title: 'Browse Categories', desc: 'Find ideas by Energy, Waste, Transportation and more.' },
            { icon: '🔒', title: 'Secure Platform', desc: 'Your data is safe with JWT authentication and password hashing.' },
            { icon: '📱', title: 'Mobile Friendly', desc: 'Access EcoSpark Hub from any device, anywhere.' },
          ].map((f, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition text-center">
              <div className="text-5xl mb-4">{f.icon}</div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Ideas */}
      <section className="bg-gray-100 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-4">Featured Ideas</h2>
          <p className="text-center text-gray-500 mb-12">Discover the latest sustainability ideas from our community</p>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
            </div>
          ) : ideas.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🌱</div>
              <p className="text-gray-500 text-lg">No ideas yet. Be the first to share!</p>
              <Link href="/login" className="mt-4 inline-block bg-green-700 text-white px-6 py-3 rounded-full hover:bg-green-800">
                Share an Idea
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ideas.slice(0, 6).map((idea) => (
                <div key={idea.id} className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden group">
                  <div className="bg-gradient-to-br from-green-100 to-emerald-50 h-48 flex items-center justify-center overflow-hidden">
                    {idea.images?.[0] ? (
                      <img src={idea.images[0]} alt={idea.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                    ) : (
                      <span className="text-7xl">🌿</span>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-center mb-2">
                      <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
                        {idea.category?.name}
                      </span>
                      {idea.type === 'PAID' && (
                        <span className="bg-yellow-100 text-yellow-700 text-xs px-3 py-1 rounded-full font-medium">
                          💰 Paid
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-lg text-gray-800 mt-2">{idea.title}</h3>
                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">{idea.description}</p>
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                      <div className="flex gap-3 text-sm text-gray-500">
                        <span>👍 {idea.votes?.filter((v: any) => v.value === 1).length || 0}</span>
                        <span>👎 {idea.votes?.filter((v: any) => v.value === -1).length || 0}</span>
                      </div>
                      <Link
                        href={`/ideas/${idea.id}`}
                        className="bg-green-700 text-white px-4 py-1.5 rounded-full text-sm hover:bg-green-800 transition"
                      >
                        View Idea →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="text-center mt-10">
            <Link href="/ideas" className="bg-green-700 text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-green-800 transition shadow-lg">
              View All Ideas →
            </Link>
          </div>
        </div>
      </section>

      {/* Top 3 Ideas */}
      {topIdeas.length > 0 && (
        <section className="py-20 px-6 max-w-4xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-4">🏆 Top Voted Ideas</h2>
          <p className="text-center text-gray-500 mb-12">The most impactful ideas voted by our community</p>
          <div className="space-y-4">
            {topIdeas.map((idea, index) => (
              <div key={idea.id} className="bg-white p-6 rounded-2xl shadow flex justify-between items-center hover:shadow-md transition">
                <div className="flex items-center gap-4">
                  <span className={`text-3xl font-extrabold ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : 'text-orange-400'}`}>
                    #{index + 1}
                  </span>
                  <div>
                    <h3 className="font-bold text-gray-800">{idea.title}</h3>
                    <span className="text-sm text-gray-500">{idea.category?.name}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-green-700 font-bold text-lg">
                    👍 {idea.votes?.filter((v: any) => v.value === 1).length || 0}
                  </span>
                  <Link href={`/ideas/${idea.id}`} className="bg-green-700 text-white px-5 py-2 rounded-full hover:bg-green-800 transition text-sm">
                    View →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-4">Browse by Category</h2>
          <p className="text-center text-gray-500 mb-12">Find ideas that matter to you</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: '⚡', name: 'Energy', color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
              { icon: '♻️', name: 'Waste', color: 'bg-green-50 border-green-200 text-green-700' },
              { icon: '🚗', name: 'Transportation', color: 'bg-blue-50 border-blue-200 text-blue-700' },
              { icon: '💧', name: 'Water', color: 'bg-cyan-50 border-cyan-200 text-cyan-700' },
            ].map((cat, i) => (
              <Link
                key={i}
                href={`/ideas?category=${cat.name}`}
                className={`${cat.color} border-2 p-6 rounded-2xl text-center hover:shadow-md transition`}
              >
                <div className="text-4xl mb-3">{cat.icon}</div>
                <div className="font-bold">{cat.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-4">What Our Community Says</h2>
          <p className="text-center text-gray-500 mb-12">Real stories from real eco-warriors</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Sarah K.', role: 'Environmental Engineer', text: 'EcoSpark Hub helped me share my solar energy project with thousands of people!', avatar: '👩‍💼' },
              { name: 'Ahmed R.', role: 'Community Activist', text: 'The voting system helped my waste reduction idea get recognized by local authorities.', avatar: '👨‍💻' },
              { name: 'Priya M.', role: 'Student', text: 'I found amazing inspiration here for my thesis on sustainable transportation.', avatar: '👩‍🎓' },
            ].map((t, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition">
                <p className="text-gray-600 italic mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{t.avatar}</span>
                  <div>
                    <div className="font-bold text-gray-800">{t.name}</div>
                    <div className="text-sm text-gray-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-700 to-emerald-600 text-white py-20 px-6 text-center">
        <h2 className="text-4xl font-extrabold mb-4">Ready to Make a Difference? 🌍</h2>
        <p className="text-green-100 text-xl mb-8 max-w-2xl mx-auto">
          Join thousands of eco-warriors and share your sustainability ideas today.
        </p>
        <Link href="/login" className="bg-white text-green-700 px-10 py-4 rounded-full text-lg font-bold hover:bg-green-100 transition shadow-lg">
          Get Started Free →
        </Link>
      </section>

      {/* Newsletter */}
      <section className="bg-gray-800 text-white py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Stay Updated 📧</h2>
        <p className="text-gray-400 mb-8">Get the latest sustainability ideas delivered to your inbox</p>
        <form className="flex justify-center gap-2 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 p-4 rounded-xl text-gray-800 focus:outline-none"
          />
          <button className="bg-green-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-green-700 transition">
            Subscribe
          </button>
        </form>
      </section>

    
    </div>
  );
}