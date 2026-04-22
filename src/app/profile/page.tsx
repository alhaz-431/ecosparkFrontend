'use client'; // এটি একদম প্রথম লাইনে থাকতে হবে

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { User, Mail, Calendar, Lightbulb, Trash2, ExternalLink, PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [myIdeas, setMyIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        // ইউজারের আইডি অনুযায়ী আইডিয়া নিয়ে আসা
        // আপনার ব্যাকএন্ডে আইডি যদি '_id' হয় তবে parsedUser._id দিবেন
        fetchMyIdeas(parsedUser.id || parsedUser._id); 
      } catch (e) {
        console.error("User parsing error", e);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchMyIdeas = async (userId: string) => {
    if (!userId) return;
    try {
      // ব্যাকএন্ড এপিআই রুট অনুযায়ী ফিল্টার
      const res = await api.get(`/ideas?authorId=${userId}`);
      setMyIdeas(res.data.ideas || res.data.data || res.data || []);
    } catch (error) {
      console.error("Error fetching ideas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('আপনি কি নিশ্চিত যে এই আইডিয়াটি মুছে ফেলতে চান?')) return;
    try {
      await api.delete(`/ideas/${id}`);
      setMyIdeas(myIdeas.filter(idea => idea.id !== id && idea._id !== id));
      alert('আইডিয়াটি সফলভাবে মুছে ফেলা হয়েছে!');
    } catch (error) {
      console.error("Error deleting idea:", error);
      alert('মুছে ফেলতে সমস্যা হয়েছে।');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
    </div>
  );

  if (!user) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 dark:bg-slate-950">
       <p className="text-gray-500 dark:text-gray-400 font-bold">প্রোফাইল দেখতে আগে লগইন করুন।</p>
       <Link href="/login" className="bg-emerald-700 text-white px-8 py-3 rounded-2xl hover:bg-emerald-800 transition-all font-black">
         Login Now
       </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-10 px-6 transition-colors">
      <div className="max-w-4xl mx-auto">
        
        {/* Profile Card Section */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl overflow-hidden border dark:border-slate-800 mb-10 group transition-all">
          <div className="h-40 bg-gradient-to-r from-emerald-600 to-green-500"></div>
          <div className="px-8 pb-8">
            <div className="relative -top-16 flex flex-col md:flex-row items-end gap-6">
              <div className="h-36 w-36 bg-white dark:bg-slate-800 rounded-[2rem] border-8 border-white dark:border-slate-900 flex items-center justify-center text-6xl shadow-2xl">
                <span className="group-hover:scale-110 transition duration-500 text-5xl">👤</span>
              </div>
              <div className="mb-4">
                <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-1">{user.name}</h1>
                <div className="flex gap-2 items-center">
                  <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] px-4 py-1.5 rounded-full font-black uppercase tracking-widest">
                    {user.role}
                  </span>
                  <Link href="/dashboard" className="text-[10px] text-gray-400 hover:text-emerald-600 font-bold underline transition-all">
                    Go to Dashboard
                  </Link>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 -mt-6">
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-slate-800/50 p-4 rounded-2xl">
                <Mail size={20} className="text-emerald-500" />
                <span className="text-sm font-bold truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-slate-800/50 p-4 rounded-2xl">
                <Calendar size={20} className="text-emerald-500" />
                <span className="text-sm font-bold">Member Since: 2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* My Ideas Section */}
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
                <Lightbulb className="text-yellow-600 fill-yellow-600" size={24} />
              </div>
              My Shared Ideas
            </h2>
            <Link 
              href="/ideas/create" 
              className="flex items-center gap-2 bg-emerald-700 text-white px-6 py-3 rounded-2xl hover:bg-emerald-800 transition-all font-black text-sm active:scale-95"
            >
              <PlusCircle size={18} />
              New Idea
            </Link>
        </div>

        {myIdeas.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-20 rounded-[3rem] text-center border-2 border-dashed border-gray-200 dark:border-slate-800">
            <div className="text-5xl mb-4">🍃</div>
            <p className="text-gray-400 dark:text-gray-500 font-black text-lg">আপনি এখনো কোনো আইডিয়া শেয়ার করেননি।</p>
            <Link href="/ideas/create" className="text-emerald-600 font-bold mt-2 inline-block hover:underline">প্রথম আইডিয়া পোস্ট করুন</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myIdeas.map((idea) => (
              <div key={idea.id || idea._id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col hover:shadow-2xl transition-all duration-500 group overflow-hidden">
                <div className="p-8">
                  <h3 className="font-black text-xl text-gray-900 dark:text-white line-clamp-1 mb-3">
                    {idea.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 font-medium mb-8">
                    {idea.description}
                  </p>
                  
                  <div className="pt-6 border-t border-gray-50 dark:border-slate-800 flex justify-between items-center">
                    <Link 
                      href={`/ideas/${idea.id || idea._id}`} 
                      className="text-emerald-600 hover:text-emerald-700 font-black text-xs flex items-center gap-2 uppercase tracking-widest"
                    >
                      Details <ExternalLink size={14} />
                    </Link>
                    
                    <button 
                      onClick={() => handleDelete(idea.id || idea._id)}
                      className="bg-red-50 dark:bg-red-900/10 text-red-500 hover:bg-red-500 hover:text-white transition-all p-3 rounded-2xl"
                    >
                      <Trash2 size={18} />
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