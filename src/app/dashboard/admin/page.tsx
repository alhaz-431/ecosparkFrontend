'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [ideas, setIdeas] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('ideas');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) return router.push('/login');
    const parsedUser = JSON.parse(stored);
    if (parsedUser.role !== 'ADMIN') return router.push('/dashboard/member');
    setUser(parsedUser);
    fetchIdeas();
    fetchUsers();
  }, []);

  const fetchIdeas = async () => {
    try {
      const res = await api.get('/admin/ideas');
      setIdeas(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      let feedbackNote = '';
      if (status === 'REJECTED') {
        feedbackNote = prompt('Enter rejection reason:') || '';
      }
      await api.patch(`/admin/ideas/${id}/status`, { status, feedbackNote });
      fetchIdeas();
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleUser = async (id: string) => {
    try {
      await api.patch(`/admin/users/${id}/toggle`);
      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-700';
      case 'REJECTED': return 'bg-red-100 text-red-700';
      case 'UNDER_REVIEW': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 to-emerald-600 text-white py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-extrabold">⚙️ Admin Dashboard</h1>
          <p className="text-green-100 mt-1">Manage ideas and users</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Ideas', count: ideas.length, icon: '💡' },
            { label: 'Approved', count: ideas.filter(i => i.status === 'APPROVED').length, icon: '✅' },
            { label: 'Under Review', count: ideas.filter(i => i.status === 'UNDER_REVIEW').length, icon: '🔍' },
            { label: 'Total Users', count: users.length, icon: '👥' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl shadow text-center">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-extrabold text-green-700">{stat.count}</div>
              <div className="text-gray-500 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('ideas')}
            className={`px-6 py-2 rounded-full font-semibold transition ${activeTab === 'ideas' ? 'bg-green-700 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
          >
            💡 Ideas
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-2 rounded-full font-semibold transition ${activeTab === 'users' ? 'bg-green-700 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
          >
            👥 Users
          </button>
        </div>

        {/* Ideas Tab */}
        {activeTab === 'ideas' && (
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
              </div>
            ) : ideas.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow">
                <p className="text-gray-500">No ideas yet.</p>
              </div>
            ) : (
              ideas.map((idea) => (
                <div key={idea.id} className="bg-white rounded-2xl shadow p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex gap-2 mb-2">
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(idea.status)}`}>
                          {idea.status}
                        </span>
                        <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                          {idea.category?.name}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-800">{idea.title}</h3>
                      <p className="text-gray-500 text-sm mt-1">By {idea.author?.name} ({idea.author?.email})</p>
                    </div>
                    <div className="flex gap-2 ml-4 flex-wrap justify-end">
                      <Link
                        href={`/ideas/${idea.id}`}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm hover:bg-gray-200"
                      >
                        View
                      </Link>
                      {idea.status !== 'APPROVED' && (
                        <button
                          onClick={() => handleStatusChange(idea.id, 'APPROVED')}
                          className="bg-green-700 text-white px-4 py-2 rounded-full text-sm hover:bg-green-800"
                        >
                          ✅ Approve
                        </button>
                      )}
                      {idea.status !== 'REJECTED' && (
                        <button
                          onClick={() => handleStatusChange(idea.id, 'REJECTED')}
                          className="bg-red-600 text-white px-4 py-2 rounded-full text-sm hover:bg-red-700"
                        >
                          ❌ Reject
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            {users.map((u) => (
              <div key={u.id} className="bg-white rounded-2xl shadow p-6 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-gray-800">{u.name}</h3>
                  <p className="text-gray-500 text-sm">{u.email}</p>
                  <div className="flex gap-2 mt-2">
                    <span className={`text-xs px-3 py-1 rounded-full ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {u.role}
                    </span>
                    <span className={`text-xs px-3 py-1 rounded-full ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                {u.id !== user?.id && (
                  <button
                    onClick={() => handleToggleUser(u.id)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${u.isActive ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                  >
                    {u.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}