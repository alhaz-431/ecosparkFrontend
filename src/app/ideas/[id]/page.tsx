'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';
import { 
  Lock, 
  ShoppingCart,
  ChevronLeft,
  User as UserIcon,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function IdeaDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [idea, setIdea] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchIdea = useCallback(async () => {
    try {
      const res = await api.get(`/ideas/${id}`);
      setIdea(res.data.idea || res.data.data || res.data);
    } catch (error: any) {
      console.error("Error fetching idea:", error);
      toast.error('আইডিয়া লোড করতে সমস্যা হয়েছে।');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
    fetchIdea();
  }, [fetchIdea]);

  // পেমেন্ট পেজে পাঠানোর ফাংশন (এটিই সঠিক পদ্ধতি)
  const handlePurchaseNavigation = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('কেনার আগে লগইন করুন!');
      router.push('/login');
      return;
    }
    // আমাদের নতুন পেমেন্ট পেজে পাঠিয়ে দিবে
    router.push(`/purchase/${id}`); 
  };

  if (loading) return <div className="p-20 text-center font-black animate-pulse uppercase tracking-widest text-gray-400">Loading Idea Details...</div>;
  if (!idea) return <div className="p-20 text-center font-black text-rose-500 text-3xl uppercase tracking-tighter">Idea Not Found!</div>;

  const isOwner = user?.id === idea.authorId;
  const isAdmin = user?.role === 'ADMIN';
  const isPaidIdea = idea.isPaid || idea.type === 'PAID';
  
  // চেক করা যে ইউজার ইতিমধ্যে এটি কিনেছে কিনা (ব্যাকএন্ডে purchasedUsers থাকলে)
  const hasPurchased = idea.purchasedBy?.includes(user?.id);

  return (
    <div className="bg-gray-50 min-h-screen pt-28 pb-20 px-6">
      <Toaster position="top-center" />
      <div className="max-w-4xl mx-auto">
        <Link href="/ideas" className="flex items-center gap-2 font-black text-sm text-gray-400 mb-8 uppercase tracking-widest hover:text-emerald-600 transition">
            <ChevronLeft size={18}/> Back to Community
        </Link>

        <div className="bg-white rounded-[48px] border border-gray-100 overflow-hidden shadow-2xl shadow-gray-200/50">
           {/* Image Section */}
           <div className="h-[450px] bg-gray-100 relative">
              <img 
                src={idea.images?.[0] || `https://picsum.photos/seed/${idea.id}/1200/800`} 
                className="w-full h-full object-cover" 
                alt={idea.title}
              />
              <div className="absolute top-8 left-8 flex gap-3">
                 <span className="bg-white/90 backdrop-blur px-6 py-2 rounded-full font-black uppercase text-[10px] tracking-widest text-emerald-700 shadow-sm border border-emerald-100">
                   {idea.category}
                 </span>
                 {isPaidIdea && !hasPurchased && (
                   <span className="bg-amber-400 text-white px-6 py-2 rounded-full font-black uppercase text-[10px] tracking-widest flex items-center gap-2 shadow-lg animate-bounce">
                     <Lock size={12}/> Premium
                   </span>
                 )}
                 {hasPurchased && (
                   <span className="bg-emerald-500 text-white px-6 py-2 rounded-full font-black uppercase text-[10px] tracking-widest flex items-center gap-2 shadow-lg">
                     <CheckCircle2 size={12}/> Purchased
                   </span>
                 )}
              </div>
           </div>

           <div className="p-12">
              <div className="flex justify-between items-start mb-6">
                <h1 className="text-5xl font-black text-gray-900 tracking-tighter uppercase leading-[0.9] flex-1">{idea.title}</h1>
                {isPaidIdea && !hasPurchased && (
                  <div className="text-4xl font-black text-emerald-600 tracking-tighter">৳{idea.price || 500}</div>
                )}
              </div>
              
              <div className="flex flex-wrap gap-4 mb-12">
                 <div className="bg-gray-50 px-6 py-4 rounded-[24px] flex items-center gap-3 border border-gray-100">
                    <div className="bg-white p-2 rounded-xl shadow-sm">
                      <UserIcon size={20} className="text-emerald-600"/>
                    </div>
                    <div>
                       <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Contributor</p>
                       <p className="font-black text-gray-800">{idea.author?.name || 'Sustainable Dev'}</p>
                    </div>
                 </div>
                 <div className="bg-gray-50 px-6 py-4 rounded-[24px] flex items-center gap-3 border border-gray-100">
                    <div className="bg-white p-2 rounded-xl shadow-sm">
                      <Calendar size={20} className="text-emerald-600"/>
                    </div>
                    <div>
                       <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Published</p>
                       <p className="font-black text-gray-800">{new Date(idea.createdAt).toLocaleDateString()}</p>
                    </div>
                 </div>
              </div>

              <div className="prose max-w-none mb-12">
                 <h4 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600 mb-4">Description & Impact</h4>
                 <p className="text-gray-600 font-medium text-xl leading-relaxed border-l-4 border-emerald-500 pl-8 italic">
                   {idea.description}
                 </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-10 border-t border-gray-50">
                 {/* Buy Now: যদি পেইড হয়, কেনা না থাকে এবং মালিক না হয় */}
                 {isPaidIdea && !isOwner && !hasPurchased && (
                   <button 
                    onClick={handlePurchaseNavigation}
                    className="flex-1 bg-emerald-600 text-white px-12 py-6 rounded-[28px] font-black text-xl hover:bg-emerald-700 shadow-xl shadow-emerald-100 flex items-center justify-center gap-4 transition-all active:scale-95 group"
                   >
                      <ShoppingCart size={24} className="group-hover:rotate-12 transition-transform"/> 
                      Unlock Premium Access
                   </button>
                 )}

                 {/* যদি কেনা থাকে বা ফ্রি হয় */}
                 {(hasPurchased || !isPaidIdea) && !isOwner && (
                   <div className="flex-1 bg-emerald-50 text-emerald-700 p-6 rounded-[32px] font-black text-center border-2 border-dashed border-emerald-200">
                      🎉 You have full access to this idea!
                   </div>
                 )}

                 {isOwner && (
                    <Link 
                      href={`/ideas/${id}/edit`} 
                      className="bg-gray-900 text-white px-10 py-6 rounded-[28px] font-black hover:bg-black flex-1 text-center transition shadow-xl active:scale-95"
                    >
                      Edit Content
                    </Link>
                 )}
                 
                 {isAdmin && (
                    <Link 
                      href="/dashboard/admin" 
                      className="bg-amber-100 text-amber-700 px-10 py-6 rounded-[28px] font-black flex-1 text-center hover:bg-amber-200 transition"
                    >
                      Admin Settings
                    </Link>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}