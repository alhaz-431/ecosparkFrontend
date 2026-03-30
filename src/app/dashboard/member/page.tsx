'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';

export default function MemberDashboard() {
  const [user, setUser] = useState<any>(null);
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '',
    problemStatement: '',
    solution: '',
    description: '',
    categoryId: '',
    type: 'FREE',
    price: '',
  });
  const [categories, setCategories] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) return router.push('/login');
    setUser(JSON.parse(stored));
    fetchMyIdeas();
    fetchCategories();
  }, []);

  const fetchMyIdeas = async () => {
    try {
      const res = await api.get('/ideas/my');
      setIdeas(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/ideas', {
        ...form,
        price: form.type === 'PAID' ? Number(form.price) : null,
      });
      setShowForm(false);
      setForm({ title: '', problemStatement: '', solution: '', description: '', categoryId: '', type: 'FREE', price: '' });
      fetchMyIdeas();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmitForReview = async (id: string) => {
    try {
      await api.patch(`/ideas/${id}/submit`);
      fetchMyIdeas();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await api.delete(`/ideas/${id}`);
      fetchMyIdeas();
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
          <h1 className="text-3xl font-extrabold">👋 Welcome, {user?.name}!</h1>
          <p className="text-green-100 mt-1">Manage your sustainability ideas</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Ideas', count: ideas.length, icon: '💡' },
            { label: 'Approved', count: ideas.filter(i => i.status === 'APPROVED').length, icon: '✅' },
            { label: 'Under Review', count: ideas.filter(i => i.status === 'UNDER_REVIEW').length, icon: '🔍' },
            { label: 'Drafts', count: ideas.filter(i => i.status === 'DRAFT').length, icon: '📝' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl shadow text-center">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-extrabold text-green-700">{stat.count}</div>
              <div className="text-gray-500 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Create Idea Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">My Ideas</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-green-700 text-white px-6 py-2 rounded-full hover:bg-green-800 transition font-semibold"
          >
            {showForm ? '✕ Cancel' : '+ New Idea'}
          </button>
        </div>

        {/* Create Idea Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Create New Idea</h3>
            <form onSubmit={handleSubmitForm} className="space-y-4">
              <input
                type="text"
                placeholder="Idea Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border p-3 rounded-xl focus:outline-none focus:border-green-500"
                required
              />
              <textarea
                placeholder="Problem Statement"
                value={form.problemStatement}
                onChange={(e) => setForm({ ...form, problemStatement: e.target.value })}
                className="w-full border p-3 rounded-xl focus:outline-none focus:border-green-500 h-24"
                required
              />
              <textarea
                placeholder="Proposed Solution"
                value={form.solution}
                onChange={(e) => setForm({ ...form, solution: e.target.value })}
                className="w-full border p-3 rounded-xl focus:outline-none focus:border-green-500 h-24"
                required
              />
              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full border p-3 rounded-xl focus:outline-none focus:border-green-500 h-24"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  className="border p-3 rounded-xl focus:outline-none focus:border-green-500"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="border p-3 rounded-xl focus:outline-none focus:border-green-500"
                >
                  <option value="FREE">Free</option>
                  <option value="PAID">Paid</option>
                </select>
              </div>
              {form.type === 'PAID' && (
                <input
                  type="number"
                  placeholder="Price (৳)"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full border p-3 rounded-xl focus:outline-none focus:border-green-500"
                  required
                />
              )}
              <button
                type="submit"
                className="w-full bg-green-700 text-white py-3 rounded-xl font-bold hover:bg-green-800 transition"
              >
                Save as Draft
              </button>
            </form>
          </div>
        )}

        {/* Ideas List */}
        {loading ? (
          <div className="flex justify-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
          </div>
        ) : ideas.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow">
            <div className="text-6xl mb-4">💡</div>
            <p className="text-gray-500">No ideas yet. Create your first idea!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {ideas.map((idea) => (
              <div key={idea.id} className="bg-white rounded-2xl shadow p-6 flex justify-between items-center">
                <div>
                  <div className="flex gap-2 mb-2">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(idea.status)}`}>
                      {idea.status}
                    </span>
                    <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                      {idea.category?.name}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-800">{idea.title}</h3>
                  <p className="text-gray-500 text-sm mt-1 line-clamp-1">{idea.description}</p>
                  {idea.status === 'REJECTED' && idea.feedbackNote && (
                    <p className="text-red-500 text-sm mt-1">❌ Feedback: {idea.feedbackNote}</p>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <Link
                    href={`/ideas/${idea.id}`}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm hover:bg-gray-200 transition"
                  >
                    View
                  </Link>
                  {idea.status === 'DRAFT' && (
                    <>
                      <button
                        onClick={() => handleSubmitForReview(idea.id)}
                        className="bg-green-700 text-white px-4 py-2 rounded-full text-sm hover:bg-green-800 transition"
                      >
                        Submit
                      </button>
                      <button
                        onClick={() => handleDelete(idea.id)}
                        className="bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm hover:bg-red-200 transition"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}