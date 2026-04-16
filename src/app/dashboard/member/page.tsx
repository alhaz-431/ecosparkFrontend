'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';

export default function MemberDashboard() {
  const [user, setUser] = useState<any>(null);
  const [ideas, setIdeas] = useState<any[]>([]);
  const [purchasedIdeas, setPurchasedIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
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
    
    const loadAllData = async () => {
      setLoading(true);
      await Promise.all([fetchMyIdeas(), fetchCategories(), fetchPurchasedIdeas()]);
      setLoading(false);
    };
    loadAllData();
  }, [router]);

  const fetchMyIdeas = async () => {
    try {
      const res = await api.get('/ideas/my');
      setIdeas(res.data || []);
    } catch (error) {
      console.error("Error fetching my ideas:", error);
    }
  };

  const fetchPurchasedIdeas = async () => {
    try {
      const res = await api.get('/ideas/purchased');
      setPurchasedIdeas(res.data || []);
    } catch (error) {
      console.error("Error fetching purchased ideas:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ecospark_upload");
    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/da55p8fpm/image/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.secure_url) setImageUrl(data.secure_url);
    } catch (err) {
      alert("ছবি আপলোড করতে সমস্যা হয়েছে!");
    } finally { setUploading(false); }
  };

  const handleEdit = (idea: any) => {
    setEditingId(idea.id);
    setForm({
      title: idea.title,
      problemStatement: idea.problemStatement,
      solution: idea.solution,
      description: idea.description,
      categoryId: idea.categoryId,
      type: idea.type,
      price: idea.price?.toString() || '',
    });
    setImageUrl(idea.images?.[0] || "");
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.categoryId || !form.description) {
      alert("সবগুলো রিকোয়ার্ড ফিল্ড পূরণ করুন!");
      return;
    }

    try {
      const payload = {
        ...form,
        images: imageUrl ? [imageUrl] : [], 
        price: form.type === 'PAID' ? Number(form.price) : 0, 
      };

      let res;
      if (editingId) {
        res = await api.put(`/ideas/${editingId}`, payload);
        alert("Idea updated successfully! ✨");
      } else {
        res = await api.post('/ideas', payload);
        alert("Idea saved as Draft! 🎉");
      }

      if (res.status === 201 || res.status === 200) {
        setShowForm(false);
        setEditingId(null);
        setForm({ title: '', problemStatement: '', solution: '', description: '', categoryId: '', type: 'FREE', price: '' });
        setImageUrl(""); 
        fetchMyIdeas();
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || "প্রক্রিয়াটি সম্পন্ন করা সম্ভব হয়নি।";
      alert("Error: " + msg);
    }
  };

  // --- এই ফাংশনটি আপনার ব্যাকএন্ড রাউটের সাথে মেলানোর জন্য ঠিক করা হয়েছে ---
  const handleSubmitForReview = async (id: string) => {
    try {
      // ব্যাকএন্ড রাউট router.patch('/:id/submit') এর সাথে মিল রেখে /submit যোগ করা হয়েছে
      await api.patch(`/ideas/${id}/submit`, { status: 'UNDER_REVIEW' }); 
      alert("Review এর জন্য পাঠানো হয়েছে! 🚀");
      fetchMyIdeas();
    } catch (error: any) { 
      console.error("Submit Error:", error);
      alert("সাবমিট হয়নি: " + (error.response?.data?.message || "Error"));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('আপনি কি নিশ্চিত যে এটি ডিলিট করবেন?')) return;
    try {
      await api.delete(`/ideas/${id}`);
      alert("সফলভাবে ডিলিট হয়েছে! 🗑️");
      fetchMyIdeas();
    } catch (error: any) { 
      console.error("Delete Error:", error);
      alert("ডিলিট করা যায়নি: " + (error.response?.data?.message || "Error"));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'REJECTED': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'UNDER_REVIEW': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700 mb-4"></div>
      <p className="text-green-800 dark:text-green-400 font-bold">Syncing your Dashboard...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20 transition-colors">
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
            { label: 'Purchased', count: purchasedIdeas.length, icon: '🛍️' },
            { label: 'Drafts', count: ideas.filter(i => i.status === 'DRAFT').length, icon: '📝' },
          ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow text-center border border-gray-100 dark:border-gray-800">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-extrabold text-green-700 dark:text-green-400">{stat.count}</div>
              <div className="text-gray-500 dark:text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">My Ideas</h2>
          <button
            onClick={() => {
              setShowForm(!showForm);
              if (showForm) { setEditingId(null); setForm({ title: '', problemStatement: '', solution: '', description: '', categoryId: '', type: 'FREE', price: '' }); setImageUrl(""); }
            }}
            className="bg-green-700 text-white px-6 py-2 rounded-full hover:bg-green-800 transition font-semibold shadow-md"
          >
            {showForm ? '✕ Cancel' : '+ New Idea'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 mb-8 border-2 border-green-100 dark:border-green-900/50">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">{editingId ? 'Edit Idea' : 'Create New Idea'}</h3>
            <form onSubmit={handleSubmitForm} className="space-y-4">
              <input type="text" placeholder="Idea Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border dark:border-gray-700 dark:bg-gray-800 p-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none dark:text-white" required />
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Idea Image</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full border dark:border-gray-700 p-2 rounded-xl text-sm bg-gray-50 dark:bg-gray-800 dark:text-gray-300" />
                {uploading && <p className="text-xs text-green-600 mt-1">Uploading...</p>}
                {imageUrl && <img src={imageUrl} alt="preview" className="h-24 w-32 object-cover rounded-xl mt-2 border dark:border-gray-700" />}
              </div>

              <textarea placeholder="Problem Statement" value={form.problemStatement} onChange={(e) => setForm({ ...form, problemStatement: e.target.value })} className="w-full border dark:border-gray-700 dark:bg-gray-800 p-3 rounded-xl h-24 outline-none focus:ring-2 focus:ring-green-500 dark:text-white" required />
              <textarea placeholder="Proposed Solution" value={form.solution} onChange={(e) => setForm({ ...form, solution: e.target.value })} className="w-full border dark:border-gray-700 dark:bg-gray-800 p-3 rounded-xl h-24 outline-none focus:ring-2 focus:ring-green-500 dark:text-white" required />
              <textarea placeholder="Full Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border dark:border-gray-700 dark:bg-gray-800 p-3 rounded-xl h-24 outline-none focus:ring-2 focus:ring-green-500 dark:text-white" required />
              
              <div className="grid grid-cols-2 gap-4">
                <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="border dark:border-gray-700 dark:bg-gray-800 p-3 rounded-xl outline-none dark:text-white" required>
                  <option value="">Select Category</option>
                  {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                </select>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="border dark:border-gray-700 dark:bg-gray-800 p-3 rounded-xl outline-none dark:text-white">
                  <option value="FREE">Free</option>
                  <option value="PAID">Paid</option>
                </select>
              </div>
              {form.type === 'PAID' && (
                <input type="number" placeholder="Price (৳)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full border dark:border-gray-700 dark:bg-gray-800 p-3 rounded-xl outline-none dark:text-white" required />
              )}
              <button type="submit" disabled={uploading} className="w-full py-3 rounded-xl font-bold bg-green-700 text-white hover:bg-green-800 transition shadow-lg">
                {uploading ? 'Uploading...' : (editingId ? 'Update Idea' : 'Save as Draft')}
              </button>
            </form>
          </div>
        )}

        <div className="space-y-4 mb-12">
          {ideas.length === 0 ? (
            <div className="text-center py-10 bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 text-gray-400">No ideas created yet.</div>
          ) : (
            ideas.map((idea) => (
              <div key={idea.id} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 flex flex-col md:flex-row justify-between items-center gap-4 hover:shadow-md transition">
                <div className="flex items-center gap-4 w-full md:w-auto">
                  {idea.images?.[0] ? (
                    <img src={idea.images[0]} className="h-12 w-12 rounded-xl object-cover" alt="" />
                  ) : (
                    <div className="h-12 w-12 bg-green-50 dark:bg-gray-800 rounded-xl flex items-center justify-center text-xl">💡</div>
                  )}
                  <div>
                    <h3 className="font-bold text-gray-800 dark:text-gray-100">{idea.title}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${getStatusColor(idea.status)}`}>{idea.status}</span>
                  </div>
                </div>
                <div className="flex gap-2 w-full md:w-auto justify-end">
                  <Link href={`/ideas/${idea.id}`} className="px-4 py-2 bg-gray-100 dark:bg-gray-800 dark:text-gray-300 rounded-full text-xs font-bold hover:bg-gray-200 dark:hover:bg-gray-700">View</Link>
                  {(idea.status === 'DRAFT' || idea.status === 'REJECTED') && (
                    <>
                      <button onClick={() => handleEdit(idea)} className="px-4 py-2 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs font-bold hover:bg-blue-200">Edit</button>
                      <button onClick={() => handleSubmitForReview(idea.id)} className="px-4 py-2 bg-green-700 text-white rounded-full text-xs font-bold shadow-sm hover:bg-green-800 transition">Submit</button>
                      <button onClick={() => handleDelete(idea.id)} className="px-4 py-2 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-full text-xs font-bold hover:bg-red-200">Delete</button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}