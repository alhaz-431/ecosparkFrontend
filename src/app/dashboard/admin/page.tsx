'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { CheckCircle, XCircle, Clock, Lightbulb, Users } from 'lucide-react';
import toast from 'react-hot-toast';

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
    fetchIdeas();
    fetchUsers();
  }, []);

  const fetchIdeas = async () => {
    try {
      const res = await api.get('/admin/ideas');
      setIdeas(res.data || []);
    } catch (error) {
      console.error('Error fetching ideas:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      let feedbackNote = '';
      if (status === 'REJECTED') {
        feedbackNote = prompt('Enter rejection reason:') || '';
      }
      await api.patch(`/admin/ideas/${id}/status`, { status, feedbackNote });
      toast.success(`Idea ${status.toLowerCase()} successfully!`);
      fetchIdeas();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleToggleUser = async (id: string) => {
    try {
      await api.patch(`/admin/users/${id}/toggle`);
      toast.success('User status updated!');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-10">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-500 p-8 mb-10 shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white mb-2">⚙️ Admin Dashboard</h1>
            <p className="text-emerald-50 font-medium">Manage and approve sustainability ideas</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white/20 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/30 text-white text-center">
              <p className="text-xs uppercase font-black opacity-80">Total Ideas</p>
              <p className="text-2xl font-black">{ideas.length}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/30 text-white text-center">
              <p className="text-xs uppercase font-black opacity-80">Pending</p>
              <p className="text-2xl font-black">{ideas.filter(i => i.status === 'UNDER_REVIEW').length}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/30 text-white text-center">
              <p className="text-xs uppercase font-black opacity-80">Users</p>
              <p className="text-2xl font-black">{users.length}</p>
            </div>
          </div>
        </div>
        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('ideas')}
          className={`px-6 py-2 rounded-full font-bold transition ${activeTab === 'ideas' ? 'bg-green-700 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
        >
          💡 Ideas
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-6 py-2 rounded-full font-bold transition ${activeTab === 'users' ? 'bg-green-700 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
        >
          👥 Users
        </button>
      </div>

      {/* Ideas Tab */}
      {activeTab === 'ideas' && (
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center gap-2">
            <Lightbulb className="text-emerald-500" />
            <h3 className="font-black text-gray-800 text-lg">All Ideas</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-gray-400 text-xs font-black uppercase tracking-widest">
                  <th className="px-8 py-5 text-left">Idea Details</th>
                  <th className="px-8 py-5 text-left">Author</th>
                  <th className="px-8 py-5 text-left">Category</th>
                  <th className="px-8 py-5 text-center">Status</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {ideas.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center text-gray-400">No ideas yet.</td>
                  </tr>
                ) : (
                  ideas.map((idea) => (
                    <tr key={idea.id} className="hover:bg-gray-50 transition-all duration-300">
                      <td className="px-8 py-6">
                        <p className="font-bold text-gray-900 text-base mb-1">{idea.title}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">{idea.description}</p>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm text-gray-600">{idea.author?.name}</p>
                        <p className="text-xs text-gray-400">{idea.author?.email}</p>
                      </td>
                      <td className="px-8 py-6">
                        <span className="inline-block bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-lg uppercase">
                          {idea.category?.name || 'General'}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold uppercase ${
                          idea.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                          idea.status === 'UNDER_REVIEW' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                          idea.status === 'REJECTED' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                          'bg-gray-50 text-gray-600 border border-gray-100'
                        }`}>
                          {idea.status === 'APPROVED' ? <CheckCircle size={12}/> : <Clock size={12}/>}
                          {idea.status}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          {idea.status !== 'APPROVED' && (
                            <button
                              onClick={() => handleStatusUpdate(idea.id, 'APPROVED')}
                              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition"
                            >
                              ✅ Approve
                            </button>
                          )}
                          {idea.status !== 'REJECTED' && (
                            <button
                              onClick={() => handleStatusUpdate(idea.id, 'REJECTED')}
                              className="px-4 py-2 bg-white border border-rose-200 text-rose-600 text-xs font-bold rounded-xl hover:bg-rose-50 transition"
                            >
                              ❌ Reject
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center gap-2">
            <Users className="text-emerald-500" />
            <h3 className="font-black text-gray-800 text-lg">All Users</h3>
          </div>
          <div className="space-y-4 p-6">
            {users.map((u) => (
              <div key={u.id} className="bg-gray-50 rounded-2xl p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-gray-800">{u.name}</h3>
                  <p className="text-gray-500 text-sm">{u.email}</p>
                  <div className="flex gap-2 mt-2">
                    <span className={`text-xs px-3 py-1 rounded-full font-bold ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {u.role}
                    </span>
                    <span className={`text-xs px-3 py-1 rounded-full font-bold ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                {u.id !== user?.id && (
                  <button
                    onClick={() => handleToggleUser(u.id)}
                    className={`px-4 py-2 rounded-full text-sm font-bold ${u.isActive ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                  >
                    {u.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}