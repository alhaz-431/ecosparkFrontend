'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';

export default function AdminDashboard() {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    try {
      // সব আইডিয়া নিয়ে আসার জন্য (স্ট্যাটাস ফিল্টার ছাড়া)
      const res = await api.get('/ideas/admin/all'); 
      setIdeas(res.data.ideas || res.data);
    } catch (error) {
      console.error("Error fetching ideas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/ideas/${id}/status`, { status: newStatus });
      alert(`Idea ${newStatus} successfully!`);
      fetchIdeas(); // লিস্ট রিফ্রেশ করার জন্য
    } catch (error) {
      alert("Failed to update status");
    }
  };

  if (loading) return <div className="p-20 text-center font-bold">Loading Admin Panel...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto bg-white dark:bg-slate-950 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white">Admin Management</h1>
        <div className="bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-sm font-bold">
          Total Ideas: {ideas.length}
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-slate-900 text-gray-600 dark:text-gray-300 uppercase text-xs font-black tracking-wider">
              <th className="px-6 py-4">Idea Title</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
            {ideas.map((idea) => (
              <tr key={idea.id} className="hover:bg-gray-50 dark:hover:bg-slate-900/50 transition">
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-900 dark:text-white">{idea.title}</div>
                  <div className="text-xs text-gray-500 truncate max-w-[200px]">{idea.description}</div>
                </td>
                <td className="px-6 py-4">
                   <span className="text-xs font-semibold bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded">
                     {idea.category?.name || 'N/A'}
                   </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase ${
                    idea.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                    idea.status === 'UNDER_REVIEW' ? 'bg-yellow-100 text-yellow-700' : 
                    'bg-red-100 text-red-700'
                  }`}>
                    {idea.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  {idea.status !== 'APPROVED' && (
                    <button 
                      onClick={() => handleStatusUpdate(idea.id, 'APPROVED')}
                      className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-1.5 px-3 rounded-lg transition"
                    >
                      Approve
                    </button>
                  )}
                  <button 
                    onClick={() => handleStatusUpdate(idea.id, 'REJECTED')}
                    className="text-red-500 hover:bg-red-50 text-xs font-bold py-1.5 px-3 rounded-lg transition border border-transparent hover:border-red-100"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}