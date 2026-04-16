'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';
import { 
  Lock, 
  ShoppingCart,
  ChevronLeft,
  ThumbsUp,
  User as UserIcon
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
      if (error.response?.status === 403) {
        toast.error('Premium idea! Please unlock to view.');
        router.push(`/purchase/${id}`);
      }
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
    fetchIdea();
  }, [fetchIdea]);

  if (loading || !idea) return <div className="p-20 text-center font-black">Loading...</div>;

  const isOwner = user?.id === idea.authorId;
  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="bg-gray-50 min-h-screen pt-28 pb-20 px-6">
      <Toaster position="top-center" />
      <div className="max-w-4xl mx-auto">
        <Link href="/ideas" className="flex items-center gap-2 font-black text-sm text-gray-500 mb-8 uppercase tracking-widest">
            <ChevronLeft size={18}/> Back to Feedback
        </Link>

        <div className="bg-white rounded-[48px] border overflow-hidden shadow-sm">
           <div className="h-96 bg-gray-100 relative">
              <img src={idea.images?.[0] || 'https://picsum.photos/seed/800/600'} className="w-full h-full object-cover" alt=""/>
              <div className="absolute top-8 left-8 flex gap-3">
                 <span className="bg-white/90 backdrop-blur px-6 py-2 rounded-full font-black uppercase text-[10px] tracking-widest">{idea.category}</span>
                 {idea.isPaid && <span className="bg-amber-500 text-white px-6 py-2 rounded-full font-black uppercase text-[10px] tracking-widest flex items-center gap-2"><Lock size={12}/> Premium</span>}
              </div>
           </div>

           <div className="p-12">
              <h1 className="text-5xl font-black text-gray-900 mb-10 tracking-tighter">{idea.title}</h1>
              
              <div className="flex gap-6 mb-12">
                 <div className="flex-1 bg-gray-50 p-6 rounded-3xl flex items-center gap-4">
                    <UserIcon size={24} className="text-emerald-600"/>
                    <div>
                       <p className="text-[10px] font-black uppercase text-gray-400">Contributor</p>
                       <p className="font-black">{idea.author?.name || 'Anonymous'}</p>
                    </div>
                 </div>
              </div>

              <div className="prose max-w-none mb-12">
                 <p className="text-gray-600 font-medium text-lg leading-relaxed">{idea.description}</p>
              </div>

              <div className="flex flex-wrap gap-4 pt-8 border-t items-center">
                 {idea.isPaid && (
                   <Link href={`/purchase/${id}`} className="flex-1 lg:flex-none bg-amber-500 text-white px-10 py-5 rounded-[28px] font-black text-lg hover:bg-amber-600 shadow-2xl flex items-center justify-center gap-3 scale-105">
                      <ShoppingCart size={24}/> Buy Full Access (${idea.price})
                   </Link>
                 )}
                 {isOwner && (
                    <Link href={`/ideas/${id}/edit`} className="bg-gray-900 text-white px-10 py-5 rounded-[28px] font-black hover:bg-emerald-700 flex-1 text-center">Edit Idea</Link>
                 )}
                 {isAdmin && (
                    <button className="bg-emerald-600 text-white px-10 py-5 rounded-[28px] font-black flex-1">Manage Submission</button>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}