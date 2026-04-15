'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { Plus, Edit, Trash2, Eye, LayoutDashboard, Lightbulb, LogOut, Clock, CheckCircle, AlertCircle, Globe } from 'lucide-react';

export default function MemberDashboard() {
  const [user, setUser] = useState<any>(null);
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) { router.push('/login'); return; }
    setUser(JSON.parse(storedUser));
    fetchMyIdeas();
  }, [router]);

  const fetchMyIdeas = async () => {
    try {
      const res = await api.get('/ideas/my-ideas');
      setIdeas(res.data.ideas || res.data.data || res.data || []);
    } catch (error) { toast.error('Failed to load your ideas'); } finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try { await api.delete(`/ideas/${id}`); toast.success('Deleted!'); fetchMyIdeas(); } catch (error) { toast.error('Failed'); }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div></div>;

  return (
    <div className="bg-gray-50 min-h-screen flex">
      <Toaster position="top-center" />
      <aside className="w-72 bg-white border-r border-gray-100 hidden lg:flex flex-col p-8 sticky top-0 h-screen">
        <h2 className="text-2xl font-black text-emerald-800 mb-12">EcoSpark Hub</h2>
        <nav className="flex-1 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 p-4 bg-emerald-50 text-emerald-700 rounded-2xl font-black text-sm"><LayoutDashboard size={20} /> Overview</Link>
          <Link href="/ideas" className="flex items-center gap-3 p-4 text-gray-500 hover:bg-gray-50 rounded-2xl font-black text-sm transition-all"><Lightbulb size={20} /> Browse Ideas</Link>
          <Link href="/" className="flex items-center gap-3 p-4 text-gray-500 hover:bg-gray-50 rounded-2xl font-black text-sm transition-all"><Globe size={20} /> View Website</Link>
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-3 p-4 text-rose-500 hover:bg-rose-50 rounded-2xl font-black text-sm transition-all mt-auto"><LogOut size={20} /> Logout</button>
      </aside>

      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter">Welcome, {user.name}!</h1>
          <Link href="/ideas/create" className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-lg shadow-emerald-200"><Plus size={20} /> New Idea</Link>
        </header>

        <div className="bg-white rounded-[48px] border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
              <tr>
                <th className="px-8 py-6">Idea Title</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {ideas.map((idea) => (
                <tr key={idea.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-6 font-black text-gray-900">{idea.title}</td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${idea.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' : idea.status === 'REJECTED' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
                      {idea.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 flex gap-3">
                    <Link href={`/ideas/${idea.id}`} className="p-2 text-gray-400 hover:text-emerald-600"><Eye size={18} /></Link>
                    <button onClick={() => handleDelete(idea.id)} className="p-2 text-gray-400 hover:text-rose-600"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}