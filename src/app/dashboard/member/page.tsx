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
  
  // ইমেজ আপলোডের স্টেট
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(""); 

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

  // --- ক্লাউডিনারি ইমেজ আপলোড ফাংশন ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ecospark_upload"); // আপনার তৈরি করা প্রিসেট

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/da55p8fpm/image/upload", // আপনার ক্লাউড নাম
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (data.secure_url) {
        setImageUrl(data.secure_url);
      }
    } catch (err) {
      alert("ছবি আপলোড করতে সমস্যা হয়েছে!");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/ideas', {
        ...form,
        images: imageUrl ? [imageUrl] : [], 
        price: form.type === 'PAID' ? Number(form.price) : null,
      });
      setShowForm(false);
      setForm({ title: '', problemStatement: '', solution: '', description: '', categoryId: '', type: 'FREE', price: '' });
      setImageUrl(""); 
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
      <div className="bg-gradient-to-r from-green-700 to-emerald-600 text-white py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-extrabold">👋 Welcome, {user?.name}!</h1>
          <p className="text-green-100 mt-1">Manage your sustainability ideas</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
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

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">My Ideas</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-green-700 text-white px-6 py-2 rounded-full hover:bg-green-800 transition font-semibold"
          >
            {showForm ? '✕ Cancel' : '+ New Idea'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl shadow p-6 mb-8 border-2 border-green-100">
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

              {/* ইমেজ আপলোড অংশ */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700">Idea Image</label>
                <div className="flex flex-col gap-2">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload} 
                    className="w-full border p-2 rounded-xl text-sm bg-gray-50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                  {uploading && <p className="text-xs text-green-600 animate-pulse">ছবি আপলোড হচ্ছে...</p>}
                  {imageUrl && (
                    <div className="relative inline-block mt-2">
                      <img src={imageUrl} alt="preview" className="h-28 w-40 object-cover rounded-xl border-2 border-green-200" />
                      <button 
                        type="button" 
                        onClick={() => setImageUrl("")} 
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg hover:bg-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>

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
                disabled={uploading}
                className={`w-full py-3 rounded-xl font-bold transition ${uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-700 text-white hover:bg-green-800'}`}
              >
                {uploading ? 'ইমেজ আপলোড হচ্ছে...' : 'Save as Draft'}
              </button>
            </form>
          </div>
        )}

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
                <div className="flex items-center gap-4">
                  {idea.images && idea.images[0] ? (
                    <img src={idea.images[0]} alt="idea" className="h-16 w-16 object-cover rounded-lg border shadow-sm" />
                  ) : (
                    <div className="h-16 w-16 bg-green-50 flex items-center justify-center rounded-lg text-2xl border border-green-100">🌱</div>
                  )}
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