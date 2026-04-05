'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/axios';

export default function IdeaDetailsPage() {
  const params = useParams();
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

  // ভোট দেওয়ার ফাংশন
  const handleVote = async (value: number) => {
    try {
      await api.post(`/votes/${params.id}/vote`, { value });
      fetchIdeaDetails(); // ভোট দেওয়ার পর নতুন কাউন্ট দেখার জন্য রিফ্রেশ
    } catch (error: any) {
      alert(error.response?.data?.message || "ভোট দিতে লগইন করুন!");
    }
  };

  if (loading) return <div className="p-20 text-center">Loading details...</div>;
  if (!idea) return <div className="p-20 text-center">Idea not found!</div>;

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      {/* ছবির সেকশন */}
      <div className="rounded-3xl overflow-hidden h-96 bg-gray-100 mb-8">
        <img 
          src={idea.images?.[0] || '/images/default-idea.jpg'} 
          className="w-full h-full object-cover" 
          alt={idea.title} 
        />
      </div>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{idea.title}</h1>
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold uppercase">
            {idea.category?.name}
          </span>
        </div>

        {/* ভোট দেওয়ার বাটন সেকশন */}
        <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border">
          <button 
            onClick={() => handleVote(1)}
            className="flex flex-col items-center gap-1 hover:scale-110 transition"
          >
            <span className="text-3xl">👍</span>
            <span className="font-bold text-green-600">
              {idea.votes?.filter((v: any) => v.value === 1).length || 0}
            </span>
          </button>

          <div className="w-[1px] h-10 bg-gray-200"></div>

          <button 
            onClick={() => handleVote(-1)}
            className="flex flex-col items-center gap-1 hover:scale-110 transition"
          >
            <span className="text-3xl">👎</span>
            <span className="font-bold text-red-500">
              {idea.votes?.filter((v: any) => v.value === -1).length || 0}
            </span>
          </button>
        </div>
      </div>

      {/* আইডিয়ার বর্ণনা */}
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <h3 className="text-xl font-bold mb-2">Description:</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{idea.description}</p>
        
        {/* অ্যাসাইনমেন্ট রিকোয়ারমেন্ট অনুযায়ী আরও ডিটেইলস */}
        <h3 className="text-xl font-bold mb-2">Problem Statement:</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{idea.problemStatement || "No problem statement provided."}</p>
      </div>
    </div>
  );
}