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
  }, []);

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

  // --- আপডেট করা সাবমিট ফাংশন ---
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // ভ্যালিডেশন
    if (!form.title || !form.categoryId || !form.description) {
      alert("সবগুলো রিকোয়ার্ড ফিল্ড পূরণ করুন!");
      return;
    }

    try {
      const payload = {
        ...form,
        images: imageUrl ? [imageUrl] : [], 
        // স্ট্রিং থেকে নাম্বারে কনভার্ট করা হয়েছে এবং FREE হলে ০ পাঠানো হচ্ছে
        price: form.type === 'PAID' ? Number(form.price) : 0, 
      };

      const res = await api.post('/ideas', payload);

      if (res.status === 201 || res.status === 200) {
        alert("Idea saved successfully! 🎉");
        setShowForm(false);
        setForm({ title: '', problemStatement: '', solution: '', description: '', categoryId: '', type: 'FREE', price: '' });
        setImageUrl(""); 
        fetchMyIdeas();
      }
    } catch (error: any) {
      console.error("Submission Error:", error.response?.data);
      const msg = error.response?.data?.message || "আইডিয়া সেভ করা সম্ভব হয়নি।";
      alert("Error: " + msg);
    }
  };

  const handleSubmitForReview = async (id: string) => {
    try {
      await api.patch(`/ideas/${id}/submit`);
      fetchMyIdeas();
    } catch (error) { console.error(error); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await api.delete(`/ideas/${id}`);
      fetchMyIdeas();
    } catch (error) { console.error(error); }
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
    <div className="min-h-screen bg-gray-50 pb-20">
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
            <div key={i} className="bg-white p-5 rounded-2xl shadow text-center border border-gray-100">
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
            className="bg-green-700 text-white px-6 py-2 rounded-full hover:bg-green-800 transition font-semibold shadow-md"
          >
            {showForm ? '✕ Cancel' : '+ New Idea'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border-2 border-green-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Create New Idea</h3>
            <form onSubmit={handleSubmitForm} className="space-y-4">
              <input type="text" placeholder="Idea Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" required />
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700">Idea Image</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full border p-2 rounded-xl text-sm bg-gray-50" />
                {uploading && <p className="text-xs text-green-600 mt-1">Uploading...</p>}
                {imageUrl && <img src={imageUrl} alt="preview" className="h-24 w-32 object-cover rounded-xl mt-2 border" />}
              </div>

              <textarea placeholder="Problem Statement" value={form.problemStatement} onChange={(e) => setForm({ ...form, problemStatement: e.target.value })} className="w-full border p-3 rounded-xl h-24 outline-none focus:ring-2 focus:ring-green-500" required />
              <textarea placeholder="Proposed Solution" value={form.solution} onChange={(e) => setForm({ ...form, solution: e.target.value })} className="w-full border p-3 rounded-xl h-24 outline-none focus:ring-2 focus:ring-green-500" required />
              <textarea placeholder="Full Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border p-3 rounded-xl h-24 outline-none focus:ring-2 focus:ring-green-500" required />
              
              <div className="grid grid-cols-2 gap-4">
                <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="border p-3 rounded-xl outline-none" required>
                  <option value="">Select Category</option>
                  {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                </select>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="border p-3 rounded-xl outline-none">
                  <option value="FREE">Free</option>
                  <option value="PAID">Paid</option>
                </select>
              </div>
              {form.type === 'PAID' && (
                <input type="number" placeholder="Price (৳)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full border p-3 rounded-xl outline-none" required />
              )}
              <button type="submit" disabled={uploading} className="w-full py-3 rounded-xl font-bold bg-green-700 text-white hover:bg-green-800 transition">
                {uploading ? 'ইমেজ আপলোড হচ্ছে...' : 'Save as Draft'}
              </button>
            </form>
          </div>
        )}

        <div className="space-y-4 mb-12">
          {loading ? (
             <div className="text-center py-10 text-green-700">Loading ideas...</div>
          ) : ideas.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-gray-300 text-gray-400">No ideas created yet.</div>
          ) : (
            ideas.map((idea) => (
              <div key={idea.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex justify-between items-center hover:shadow-md transition">
                <div className="flex items-center gap-4">
                  {idea.images?.[0] ? (
                    <img src={idea.images[0]} className="h-12 w-12 rounded-xl object-cover" alt="" />
                  ) : (
                    <div className="h-12 w-12 bg-green-50 rounded-xl flex items-center justify-center text-xl">💡</div>
                  )}
                  <div>
                    <h3 className="font-bold text-gray-800">{idea.title}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${getStatusColor(idea.status)}`}>{idea.status}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/ideas/${idea.id}`} className="px-4 py-2 bg-gray-100 rounded-full text-xs font-bold hover:bg-gray-200">View</Link>
                  {idea.status === 'DRAFT' && (
                    <>
                      <button onClick={() => handleSubmitForReview(idea.id)} className="px-4 py-2 bg-green-700 text-white rounded-full text-xs font-bold">Submit</button>
                      <button onClick={() => handleDelete(idea.id)} className="px-4 py-2 bg-red-100 text-red-600 rounded-full text-xs font-bold">Delete</button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-16 bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-emerald-100 rounded-2xl text-2xl">🛍️</div>
            <div>
              <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Purchased Ideas</h2>
              <p className="text-xs text-gray-400">Premium insights you've unlocked</p>
            </div>
          </div>

          {purchasedIdeas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {purchasedIdeas.map((item: any) => (
                <div key={item.id} onClick={() => router.push(`/ideas/${item.idea?.id}`)} className="group relative bg-gray-50/50 p-6 rounded-[24px] border border-gray-100 hover:border-emerald-200 hover:bg-white hover:shadow-xl transition-all cursor-pointer">
                  <h3 className="font-bold text-gray-800 group-hover:text-emerald-700 transition mb-2 text-lg">{item.idea?.title}</h3>
                  <div className="text-xs font-bold text-emerald-600">View Content →</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50/50 rounded-[24px] border-2 border-dashed border-gray-200">
              <p className="text-gray-400 italic">You haven't purchased any premium ideas yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}