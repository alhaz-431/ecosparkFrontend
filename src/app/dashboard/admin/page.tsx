'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Lightbulb, 
  Users, 
  LogOut,
  TrendingUp,
  Globe
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function AdminDashboard() {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ideas');
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      router.push('/login');
      return;
    }
    const parsedUser = JSON.parse(stored);
    if (parsedUser.role !== 'ADMIN') {
      router.push('/dashboard/member');
      return;
    }
    setUser(parsedUser);
    fetchData();
  }, [router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ideasRes, usersRes] = await Promise.all([
        api.get('/admin/ideas'),
        api.get('/admin/users')
      ]);
      setIdeas(ideasRes.data || ideasRes.data.data || []);
      setUsers(usersRes.data || usersRes.data.data || []);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      let feedbackNote = '';
      if (status === 'REJECTED') {
        feedbackNote = prompt('Enter rejection reason:') || '';
        if (!feedbackNote) return;
      }
      await api.patch(`/admin/ideas/${id}/status`, { status, feedbackNote });
      toast.success(`Idea ${status.toLowerCase()} successfully!`);
      fetchData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleToggleUser = async (id: string) => {
    try {
      await api.patch(`/admin/users/${id}/toggle`);
      toast.success('User status updated!');
      fetchData();
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Toaster position="top-center" />
      <aside className="w-72 bg-emerald-900 text-white hidden lg:flex flex-col p-8 sticky top-0 h-screen">
        <div className="mb-12">
          <h2 className="text-2xl font-black tracking-tighter">EcoSpark Admin</h2>
          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mt-1">Management Portal</p>
        </div>
        <nav className="flex-1 space-y-2">
          <button onClick={() => setActiveTab('ideas')} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-black text-sm transition-all ${activeTab === 'ideas' ? 'bg-emerald-800 text-white shadow-lg' : 'text-emerald-100/60 hover:bg-emerald-800/50'}`}><Lightbulb size={20} /> Ideas Management</button>
          <button onClick={() => setActiveTab('users')} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-black text-sm transition-all ${activeTab === 'users' ? 'bg-emerald-800 text-white shadow-lg' : 'text-emerald-100/60 hover:bg-emerald-800/50'}`}><Users size={20} /> User Directory</button>
          <Link href="/" className="w-full flex items-center gap-3 p-4 text-emerald-100/60 hover:bg-emerald-800/50 rounded-2xl font-black text-sm transition-all"><Globe size={20} /> View Website</Link>
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-3 p-4 text-rose-300 hover:bg-rose-900/30 rounded-2xl font-black text-sm transition-all mt-auto"><LogOut size={20} /> Logout</button>
      </aside>

      <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
        <div className="relative overflow-hidden rounded-[48px] bg-white p-10 mb-12 border border-gray-100 shadow-sm">
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-2">Admin Control Center</h1>
          <p className="text-gray-500 font-medium">Review submissions and manage community members</p>
        </div>

        {activeTab === 'ideas' ? (
          <div className="bg-white rounded-[48px] shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                <tr>
                  <th className="px-8 py-6 text-left">Idea Details</th>
                  <th className="px-8 py-6 text-left">Author</th>
                  <th className="px-8 py-6 text-center">Status</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {ideas.map((idea) => (
                  <tr key={idea.id} className="hover:bg-gray-50/50 transition-all">
                    <td className="px-8 py-6"><p className="font-black text-gray-900 mb-1">{idea.title}</p></td>
                    <td className="px-8 py-6"><p className="text-sm font-bold text-gray-700">{idea.author?.name || 'Unknown'}</p></td>
                    <td className="px-8 py-6 text-center">
                      <div className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${idea.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' : idea.status === 'REJECTED' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
                        {idea.status}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-3">
                        {idea.status !== 'APPROVED' && <button onClick={() => handleStatusUpdate(idea.id, 'APPROVED')} className="px-5 py-2.5 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl">Approve</button>}
                        {idea.status !== 'REJECTED' && <button onClick={() => handleStatusUpdate(idea.id, 'REJECTED')} className="px-5 py-2.5 bg-white border border-rose-100 text-rose-600 text-[10px] font-black uppercase tracking-widest rounded-xl">Reject</button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-[48px] shadow-sm border border-gray-100 p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {users.map((u) => (
              <div key={u.id} className="bg-gray-50 rounded-3xl p-6 flex justify-between items-center border border-gray-100">
                <div>
                  <h3 className="font-black text-gray-900">{u.name}</h3>
                  <p className="text-gray-400 text-xs font-medium">{u.email}</p>
                </div>
                {u.id !== user?.id && (
                  <button onClick={() => handleToggleUser(u.id)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${u.isActive ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-700'}`}>
                    {u.isActive ? 'Ban User' : 'Unban User'}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}