'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function IdeaDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [idea, setIdea] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIdeaDetails();
  }, [params.id]);

  const fetchIdeaDetails = async () => {
    try {
      const res = await api.get(`/ideas/${params.id}`);
      setIdea(res.data);
    } catch (error) {
      console.error("Error fetching details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (value: number) => {
    try {
      await api.post(`/votes/${params.id}/vote`, { value });
      fetchIdeaDetails(); 
    } catch (error: any) {
      alert(error.response?.data?.message || "ভোট দিতে লগইন করুন!");
    }
  };

  if (loading) return <div className="p-20 text-center text-gray-500">Loading details...</div>;
  if (!idea) return <div className="p-20 text-center text-red-500">Idea not found!</div>;

  return (
    <div className="max-w-7xl mx-auto py-10 px-6">
      {/* ব্যাক বাটন */}
      <button 
        onClick={() => router.back()}
        className="mb-8 flex items-center gap-2.5 text-gray-600 hover:text-green-700 font-bold transition group"
      >
        <span className="text-xl group-hover:-translate-x-1.5 transition-transform">←</span> 
        Back to Ideas
      </button>

      {/* ২-কলাম লেআউট: বামে ছবি, ডানে বর্ণনা ও ভোট */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* বাম কলাম: ছবির সেকশন */}

{/* ছবির সেকশন */}
<div className="rounded-3xl overflow-hidden bg-gray-100 dark:bg-slate-900 mb-10 shadow-md border dark:border-slate-800 flex items-center justify-center min-h-[300px]">
  <img 
    src={idea.images && idea.images.length > 0 
      ? idea.images[0] 
      : 'https://via.placeholder.com/800x500?text=EcoSpark+Idea'} // ছবি না থাকলে এটি দেখাবে
    className="w-full max-h-[500px] object-contain mx-auto"
    alt={idea.title} 
    onError={(e) => {
      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x500?text=Image+Not+Found';
    }}
  />
</div>
        {/* ডান কলাম: বর্ণনা এবং ভোট */}
        <div className="space-y-10">
          <div>
            <span className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-sm">
              {idea.category?.name}
            </span>
            <h1 className="text-5xl font-black text-gray-900 dark:text-white mt-5 mb-5 leading-tight">
              {idea.title}
            </h1>
          </div>

          {/* ভোট সেকশন (ডানপাশে বা নিচে থাকবে) */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border dark:border-slate-800 text-center">
            <h4 className="font-bold text-gray-500 uppercase text-xs tracking-widest mb-6">Community Vote</h4>
            <div className="flex justify-around items-center">
              <button 
                onClick={() => handleVote(1)}
                className="flex flex-col items-center gap-2.5 group"
              >
                <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-green-50 dark:bg-green-900/20 group-hover:scale-110 transition text-4xl shadow-md border dark:border-green-800/20">
                  👍
                </div>
                <span className="font-black text-green-600 text-2xl">
                  {idea.votes?.filter((v: any) => v.value === 1).length || 0}
                </span>
              </button>

              <div className="w-[1px] h-14 bg-gray-100 dark:bg-slate-800"></div>

              <button 
                onClick={() => handleVote(-1)}
                className="flex flex-col items-center gap-2.5 group"
              >
                <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-red-50 dark:bg-red-900/20 group-hover:scale-110 transition text-4xl shadow-md border dark:border-red-800/20">
                  👎
                </div>
                <span className="font-black text-red-500 text-2xl">
                  {idea.votes?.filter((v: any) => v.value === -1).length || 0}
                </span>
              </button>
            </div>
            <p className="mt-7 text-xs text-gray-400 font-medium">Click to cast your vote</p>
          </div>

          <div className="space-y-8 bg-white dark:bg-slate-900 p-8 rounded-3xl border dark:border-slate-800 shadow-lg">
            <section>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3.5 flex items-center gap-2">
                📝 Description
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed italic font-medium">
                "{idea.description}"
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3.5 flex items-center gap-2">
                🎯 Problem Statement
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {idea.problemStatement || "No problem statement provided."}
              </p>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
}