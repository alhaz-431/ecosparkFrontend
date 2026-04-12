'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { User, Mail, Calendar, Lightbulb, Trash2, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [myIdeas, setMyIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // লোকাল স্টোরেজ থেকে ইউজার অবজেক্ট পড়া
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      // ইউজারের আইডি দিয়ে তার পোস্ট করা আইডিয়াগুলো আনা
      fetchMyIdeas(parsedUser.id);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchMyIdeas = async (userId: string) => {
    try {
      // ব্যাকএন্ডে authorId পাঠিয়ে শুধু নিজের আইডিয়া ফিল্টার করা
      const res = await api.get(`/ideas?authorId=${userId}`);
      // ব্যাকএন্ড রেসপন্স অনুযায়ী ডেটা সেট করা
      setMyIdeas(res.data.ideas || res.data.data || []);
    } catch (error) {
      console.error("Error fetching ideas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this idea?')) return;
    try {
      await api.delete(`/ideas/${id}`);
      setMyIdeas(myIdeas.filter(idea => idea.id !== id));
      alert('Idea deleted successfully!');
    } catch (error) {
      console.error("Error deleting idea:", error);
      alert('Failed to delete idea.');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center dark:bg-slate-950">
       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
    </div>
  );

  if (!user) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 dark:bg-slate-950">
       <p className="text-gray-500 dark:text-gray-400">Please login to view profile.</p>
       <Link href="/login" className="bg-green-700 text-white px-6 py-2 rounded-full hover:bg-green-800 transition">
         Login Now
       </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-10 px-6 transition-colors">
      <div className="max-w-4xl mx-auto">
        
        {/* Profile Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border dark:border-slate-800 mb-10 group">
          <div className="h-32 bg-gradient-to-r from-green-600 to-emerald-500"></div>
          <div className="px-8 pb-8">
            <div className="relative -top-12 flex flex-col md:flex-row items-end gap-5">
              <div className="h-32 w-32 bg-white dark:bg-slate-800 rounded-2xl border-4 border-white dark:border-slate-900 flex items-center justify-center text-5xl shadow-lg">
                <span className="group-hover:scale-110 transition duration-300">👤</span>
              </div>
              <div className="mb-4">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{user.name}</h1>
                <p className="inline-block bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                  {user.role}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <Mail size={18} className="text-green-500" />
                <span className="text-sm font-medium">{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <Calendar size={18} className="text-green-500" />
                <span className="text-sm font-medium">Member Since: {new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* My Ideas Section */}
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Lightbulb className="text-yellow-500 fill-yellow-500" size={24} />
              My Published Ideas
            </h2>
            <Link href={user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'} className="text-sm bg-green-700 text-white px-4 py-2 rounded-full hover:bg-green-800 transition shadow-md">
              + New Idea
            </Link>
        </div>

        {myIdeas.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl text-center border-2 border-dashed dark:border-slate-800">
            <p className="text-gray-500 dark:text-gray-400 font-medium">You haven't shared any ideas yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myIdeas.map((idea) => (
              <div key={idea.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-md border dark:border-slate-800 flex flex-col hover:shadow-xl transition-all duration-300 group overflow-hidden">
                <div className="p-5">
                  <h3 className="font-bold text-lg dark:text-white line-clamp-1 group-hover:text-green-600 transition">{idea.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-xs line-clamp-2 mt-2 leading-relaxed">
                    {idea.description}
                  </p>
                  
                  <div className="mt-5 pt-4 border-t dark:border-slate-800 flex justify-between items-center">
                    <Link 
                      href={`/ideas/${idea.id}`} 
                      className="text-green-600 hover:text-green-700 font-bold text-xs flex items-center gap-1"
                    >
                      View Details <ExternalLink size={12} />
                    </Link>
                    
                    <button 
                      onClick={() => handleDelete(idea.id)}
                      className="text-red-400 hover:text-red-600 transition p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}