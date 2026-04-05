'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { CheckCircle, XCircle, Clock, Lightbulb } from 'lucide-react'; // lucide-react ব্যবহার করলে আইকনগুলো সুন্দর দেখাবে

export default function AdminDashboard() {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    try {
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
      fetchIdeas(); 
    } catch (error) {
      alert("Failed to update status");
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-slate-950">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 p-6 lg:p-10">
      {/* Header with Gradient Background */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-500 p-8 mb-10 shadow-lg shadow-emerald-200 dark:shadow-none">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white mb-2">Admin Control Center</h1>
            <p className="text-emerald-50 font-medium">Manage and approve the future of sustainability.</p>
          </div>
          <div className="flex gap-4">
             <div className="bg-white/20 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/30 text-white text-center">
                <p className="text-xs uppercase font-black opacity-80">Total Ideas</p>
                <p className="text-2xl font-black">{ideas.length}</p>
             </div>
          </div>
        </div>
        {/* Background Decorative Circle */}
        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-gray-50 dark:border-slate-800 flex items-center justify-between">
           <h3 className="font-black text-gray-800 dark:text-white flex items-center gap-2 text-lg">
             <Lightbulb className="text-emerald-500" /> Recent Submissions
           </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-slate-800/50 text-gray-400 text-[11px] font-black uppercase tracking-widest">
                <th className="px-8 py-5 text-left">Idea Details</th>
                <th className="px-8 py-5 text-left">Category</th>
                <th className="px-8 py-5 text-center">Current Status</th>
                <th className="px-8 py-5 text-right">Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
              {ideas.map((idea) => (
                <tr key={idea.id} className="hover:bg-gray-50/80 dark:hover:bg-slate-800/30 transition-all duration-300">
                  <td className="px-8 py-6">
                    <p className="font-bold text-gray-900 dark:text-white text-base mb-1">{idea.title}</p>
                    <p className="text-xs text-gray-500 line-clamp-1">{idea.description}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className="inline-block bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-black px-3 py-1 rounded-lg uppercase">
                      {idea.category?.name || 'General'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight shadow-sm ${
                      idea.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                      idea.status === 'UNDER_REVIEW' ? 'bg-orange-50 text-orange-600 border border-orange-100' : 
                      'bg-rose-50 text-rose-600 border border-rose-100'
                    }`}>
                       {idea.status === 'APPROVED' ? <CheckCircle size={12}/> : <Clock size={12}/>}
                       {idea.status}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-3">
                      {idea.status !== 'APPROVED' && (
                        <button 
                          onClick={() => handleStatusUpdate(idea.id, 'APPROVED')}
                          className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black rounded-xl transition shadow-lg shadow-emerald-200 dark:shadow-none hover:-translate-y-0.5 active:translate-y-0"
                        >
                          Approve
                        </button>
                      )}
                      <button 
                        onClick={() => handleStatusUpdate(idea.id, 'REJECTED')}
                        className="px-5 py-2.5 bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-900/30 text-rose-600 text-xs font-black rounded-xl hover:bg-rose-50 transition"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}