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
  ShoppingCart,
  Eye,
  UserCheck,
  UserMinus
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function AdminDashboard() {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
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
      const [ideasRes, usersRes, purchasesRes] = await Promise.all([
        api.get('/admin/ideas'),
        api.get('/admin/users'),
        api.get('/admin/purchases').catch(() => ({ data: [] }))
      ]);
      setIdeas(ideasRes.data || ideasRes.data.data || []);
      setUsers(usersRes.data || usersRes.data.data || []);
      setPurchases(purchasesRes.data || purchasesRes.data.data || []);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // --- আইডিয়া স্ট্যাটাস আপডেট (Approve/Reject সবসময় খোলা থাকবে) ---
  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      let feedbackNote = '';
      if (status === 'REJECTED') {
        feedbackNote = prompt('Enter rejection reason:') || '';
        if (!feedbackNote) return;
      }
      await api.patch(`/admin/ideas/${id}/status`, { status, feedbackNote });
      toast.success(`Idea marked as ${status}!`);
      fetchData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  // --- মেম্বার অ্যাক্টিভ/ডিঅ্যাক্টিভ করার ফাংশন ---
  const handleUserStatus = async (userId: string, isDeactivated: boolean) => {
    try {
      const action = isDeactivated ? 'activate' : 'deactivate';
      if (!confirm(`Are you sure you want to ${action} this user?`)) return;
      
      await api.patch(`/admin/users/${userId}/toggle-status`);
      toast.success(`User ${action}d successfully!`);
      fetchData();
    } catch (error) {
      toast.error('Failed to update user status');
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

      {/* Admin Sidebar */}
      <aside className="w-72 bg-emerald-900 text-white hidden lg:flex flex-col p-8 sticky top-0 h-screen">
        <div className="mb-12">
          <h2 className="text-2xl font-black tracking-tighter">EcoSpark Admin</h2>
          <p className="text-[10px] font-black uppercase mt-1 text-emerald-400">Management Panel</p>
        </div>

        <nav className="flex-1 space-y-2">
          <button onClick={() => setActiveTab('ideas')} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-black text-sm transition-all ${activeTab === 'ideas' ? 'bg-emerald-800 text-white' : 'text-emerald-100/60 hover:bg-emerald-800/50'}`}>
            <Lightbulb size={20} /> Ideas Review
          </button>
          <button onClick={() => setActiveTab('users')} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-black text-sm transition-all ${activeTab === 'users' ? 'bg-emerald-800 text-white' : 'text-emerald-100/60 hover:bg-emerald-800/50'}`}>
            <Users size={20} /> Community Members
          </button>
          <button onClick={() => setActiveTab('sales')} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-black text-sm transition-all ${activeTab === 'sales' ? 'bg-emerald-800 text-white shadow-lg' : 'text-emerald-100/60 hover:bg-emerald-800/50'}`}>
            <ShoppingCart size={20} /> Sales History
          </button>
        </nav>

        <button onClick={handleLogout} className="flex items-center gap-3 p-4 text-rose-300 hover:bg-rose-900/30 rounded-2xl font-black mt-auto">
          <LogOut size={20} /> Logout
        </button>
      </aside>

      <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
        <header className="mb-12">
           <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-2">Admin Control Center</h1>
           <div className="flex gap-4 mt-6">
              <div className="bg-emerald-50 px-8 py-4 rounded-3xl border border-emerald-100">
                <p className="text-[10px] font-black uppercase text-emerald-600">Total Ideas</p>
                <p className="text-3xl font-black">{ideas.length}</p>
              </div>
              <div className="bg-blue-50 px-8 py-4 rounded-3xl border border-blue-100">
                <p className="text-[10px] uppercase font-black text-blue-600">Total Members</p>
                <p className="text-3xl font-black">{users.length}</p>
              </div>
           </div>
        </header>

        {/* Ideas Tab */}
        {activeTab === 'ideas' && (
          <div className="bg-white rounded-[40px] border shadow-sm overflow-hidden">
             <table className="w-full">
                <thead className="bg-gray-50 uppercase text-[10px] font-black">
                   <tr>
                      <th className="px-8 py-6 text-left">Idea Details</th>
                      <th className="px-8 py-6 text-center">Status</th>
                      <th className="px-8 py-6 text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                   {ideas.map((idea) => (
                      <tr key={idea.id} className="hover:bg-gray-50/50 transition-colors">
                         <td className="px-8 py-6">
                            <p className="font-black uppercase text-sm">{idea.title}</p>
                            <div className="flex gap-2 mt-1">
                              {idea.type === 'PAID' && <span className="text-amber-600 text-[8px] font-black bg-amber-50 px-2 py-0.5 rounded border border-amber-100">PAID (${idea.price})</span>}
                              <span className="text-gray-400 text-[8px] font-black bg-gray-50 px-2 py-0.5 rounded border">BY: {idea.author?.name || 'Unknown'}</span>
                            </div>
                         </td>
                         <td className="px-8 py-6 text-center">
                            <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${idea.status === 'APPROVED' ? 'bg-green-100 text-green-700' : idea.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                              {idea.status}
                            </span>
                         </td>
                         <td className="px-8 py-6 text-right">
                            <div className="flex gap-2 justify-end">
                              {/* Details বাটন যাতে অ্যাডমিন আগে দেখতে পারে */}
                              <Link href={`/ideas/${idea.id}`} className="bg-gray-100 text-gray-700 p-2 rounded-xl hover:bg-gray-200 transition">
                                <Eye size={16} />
                              </Link>
                              {/* Approve এবং Reject বাটন সবসময় থাকবে */}
                              <button onClick={() => handleStatusUpdate(idea.id, 'APPROVED')} className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-emerald-700 transition">Approve</button>
                              <button onClick={() => handleStatusUpdate(idea.id, 'REJECTED')} className="bg-white border border-rose-200 text-rose-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-rose-50 transition">Reject</button>
                            </div>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        )}

        {/* Users Tab (Active/Deactivate Option) */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-[40px] border shadow-sm overflow-hidden">
             <table className="w-full">
                <thead className="bg-gray-50 uppercase text-[10px] font-black">
                   <tr>
                      <th className="px-8 py-6 text-left">Member Info</th>
                      <th className="px-8 py-6 text-center">Role</th>
                      <th className="px-8 py-6 text-right">Account Control</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                   {users.map((u) => (
                      <tr key={u.id}>
                         <td className="px-8 py-6">
                            <p className="font-black text-gray-900">{u.name}</p>
                            <p className="text-xs text-gray-400">{u.email}</p>
                         </td>
                         <td className="px-8 py-6 text-center font-black text-[10px] uppercase text-gray-500">
                            {u.role}
                         </td>
                         <td className="px-8 py-6 text-right">
                            {u.role !== 'ADMIN' && (
                              <button 
                                onClick={() => handleUserStatus(u.id, u.isDeactivated)}
                                className={`flex items-center gap-2 ml-auto px-4 py-2 rounded-xl text-[10px] font-black uppercase transition ${u.isDeactivated ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-rose-50 text-rose-600 border border-rose-200'}`}
                              >
                                {u.isDeactivated ? <><UserCheck size={14}/> Activate</> : <><UserMinus size={14}/> Deactivate</>}
                              </button>
                            )}
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        )}

        {/* Sales Tab */}
        {activeTab === 'sales' && (
          <div className="bg-white rounded-[40px] border shadow-sm overflow-hidden">
             <table className="w-full">
                <thead className="bg-gray-50 uppercase text-[10px] font-black">
                   <tr>
                      <th className="px-8 py-6 text-left">Purchased Idea</th>
                      <th className="px-8 py-6 text-left">Customer</th>
                      <th className="px-8 py-6 text-center">Amount</th>
                      <th className="px-8 py-6 text-right">Date</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                   {purchases.map((sale: any) => (
                      <tr key={sale.id}>
                         <td className="px-8 py-6 font-black uppercase text-xs">{sale.idea?.title}</td>
                         <td className="px-8 py-6">
                            <p className="font-bold text-sm">{sale.user?.name}</p>
                            <p className="text-[10px] text-gray-400">{sale.user?.email}</p>
                         </td>
                         <td className="px-8 py-6 text-center font-black text-emerald-600">
                            ${(sale.amount / 100).toFixed(2)}
                         </td>
                         <td className="px-8 py-6 text-right text-[10px] text-gray-500 font-bold">
                            {new Date(sale.createdAt).toLocaleDateString()}
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        )}
      </main>
    </div>
  );
}