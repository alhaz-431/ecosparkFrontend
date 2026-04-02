'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { User, Mail, Calendar, Lightbulb } from 'lucide-react'; // L বড় হাতের হবে

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [myIdeas, setMyIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchMyIdeas(parsedUser.id);
    }
  }, []);

  const fetchMyIdeas = async (userId: string) => {
    try {
      const res = await api.get(`/ideas?authorId=${userId}`);
      setMyIdeas(res.data.ideas || []);
    } catch (error) {
      console.error("Error fetching ideas:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="text-center py-20">Please login to view profile.</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-10 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border dark:border-slate-800 mb-8">
          <div className="h-32 bg-gradient-to-r from-green-600 to-emerald-500"></div>
          <div className="px-8 pb-8">
            <div className="relative -top-12 flex flex-col md:flex-row items-end gap-4">
              <div className="h-32 w-32 bg-white dark:bg-slate-800 rounded-2xl border-4 border-white dark:border-slate-900 flex items-center justify-center text-5xl shadow-lg">
                👤
              </div>
              <div className="mb-4">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{user.name}</h1>
                <p className="text-green-600 font-medium">{user.role}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <Mail size={20} className="text-green-500" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <Calendar size={20} className="text-green-500" />
                <span>Joined: {new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* My Ideas Section */}
       {/* My Ideas Section */}
<h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
  <Lightbulb className="text-yellow-500" size={24} /> {/* এখানে আইকনটি যোগ করা হয়েছে */}
  My Published Ideas
</h2>


        {loading ? (
          <p className="dark:text-white">Loading your ideas...</p>
        ) : myIdeas.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-10 rounded-2xl text-center border-2 border-dashed dark:border-slate-800">
            <p className="text-gray-500">You haven't shared any ideas yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myIdeas.map((idea) => (
              <div key={idea.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow border dark:border-slate-800">
                <h3 className="font-bold text-lg dark:text-white">{idea.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mt-2">{idea.description}</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 px-2 py-1 rounded">
                    {idea.category?.name}
                  </span>
                  <button className="text-red-500 text-sm hover:underline">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}