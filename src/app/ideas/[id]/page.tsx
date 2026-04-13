'use client';
import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

export default function IdeaDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [idea, setIdea] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [voting, setVoting] = useState(false);

  // fetchIdea-কে useCallback দিয়ে র‍্যাপ করা হয়েছে যেন এটি handleVote-এর ভেতরে কল করা যায়
  const fetchIdea = useCallback(async () => {
    try {
      const res = await api.get(`/ideas/${id}`);
      setIdea(res.data);
    } catch (error: any) {
      if (error.response?.status === 403) {
        router.push(`/ideas/${id}/purchase`);
      }
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
    fetchIdea();
  }, [id, fetchIdea]);

  const handleVote = async (value: number) => {
    if (!user) {
      toast.error('ভোট দিতে আগে লগইন করুন!');
      return router.push('/login');
    }
    
    setVoting(true);
    try {
      // রাউটটি ঠিক করে /votes/${id}/vote করা হয়েছে
      await api.post(`/votes/${id}/vote`, { value });
      toast.success(value === 1 ? 'Upvoted! 👍' : 'Downvoted! 👎');
      fetchIdea(); // নতুন সংখ্যা দেখানোর জন্য রি-ফেচ
    } catch (error: any) {
      console.error('Vote Error:', error);
      toast.error(error.response?.data?.message || 'Failed to vote!');
    } finally {
      setVoting(false);
    }
  };

  const handleAdminAction = async (status: string) => {
    try {
      let feedbackNote = '';
      if (status === 'REJECTED') {
        feedbackNote = prompt('Enter rejection reason:') || '';
      }
      await api.patch(`/admin/ideas/${id}/status`, { status, feedbackNote });
      toast.success(`Idea ${status.toLowerCase()}!`);
      fetchIdea();
    } catch (error) {
      toast.error('Failed to update status!');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
    </div>
  );

  if (!idea) return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold text-gray-400">Idea not found!</h2>
      <Link href="/ideas" className="text-green-600 underline mt-4 block">Back to All Ideas</Link>
    </div>
  );

  // ডাটাবেস থেকে আসা upvotes এবং downvotes সরাসরি ব্যবহার করা হচ্ছে
  const upvotes = idea.upvotes || 0;
  const downvotes = idea.downvotes || 0;
  const userVote = idea.userVote; // সার্ভার থেকে সরাসরি userVote আসছে কি না চেক করুন

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Back Button */}
        <Link href="/ideas" className="text-green-700 hover:text-green-800 text-sm mb-6 flex items-center gap-1 font-bold">
          ← Back to All Ideas
        </Link>

        {/* Main Content Card */}
        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-8 md:p-12 mb-8">
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
              {idea.category?.name}
            </span>
            <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${
              idea.type === 'PAID' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
            }`}>
              {idea.type === 'PAID' ? `💰 Paid - ৳${idea.price}` : '🆓 Free Idea'}
            </span>
          </div>

          <h1 className="text-4xl font-black text-gray-900 mb-6 leading-tight">{idea.title}</h1>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
                {idea.author?.name?.charAt(0)}
              </div>
              <span className="font-bold text-gray-700">{idea.author?.name}</span>
            </div>
            <span className="text-gray-300">|</span>
            <span>📅 {new Date(idea.createdAt).toLocaleDateString()}</span>
          </div>

          {idea.images?.length > 0 && (
            <img src={idea.images[0]} alt={idea.title} className="w-full h-[400px] object-cover rounded-[32px] mb-10 shadow-lg" />
          )}

          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-black text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span> Problem Statement
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg">{idea.problemStatement}</p>
            </section>
            
            <section>
              <h2 className="text-lg font-black text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span> Proposed Solution
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg">{idea.solution}</p>
            </section>

            <section className="bg-gray-50 p-8 rounded-[32px] border border-gray-100">
              <h2 className="text-lg font-black text-gray-900 mb-3">📝 Detailed Description</h2>
              <p className="text-gray-600 leading-relaxed">{idea.description}</p>
            </section>
          </div>
        </div>

        {/* Voting Section */}
        <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-black text-gray-900">Rate this solution</h2>
              <p className="text-gray-500 text-sm">Do you think this idea can save the planet?</p>
            </div>
            
            <div className="flex items-center bg-gray-50 p-2 rounded-3xl border border-gray-100 gap-2">
              <button
                onClick={() => handleVote(1)}
                disabled={voting}
                className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-black transition-all active:scale-95 ${
                  userVote === 1
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-transparent hover:border-blue-100'
                }`}
              >
                👍 {upvotes}
              </button>

              <div className="w-[1px] h-8 bg-gray-200"></div>

              <button
                onClick={() => handleVote(-1)}
                disabled={voting}
                className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-black transition-all active:scale-95 ${
                  userVote === -1
                    ? 'bg-red-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-red-50 hover:text-red-600 border border-transparent hover:border-red-100'
                }`}
              >
                👎 {downvotes}
              </button>
            </div>
          </div>
          
          {!user && (
            <p className="text-center mt-6 text-sm text-gray-400 font-medium">
              Want to vote? <Link href="/login" className="text-green-700 font-bold hover:underline">Login first</Link>
            </p>
          )}
        </div>

        {/* Admin Actions */}
        {user?.role === 'ADMIN' && (
          <div className="bg-black text-white rounded-[32px] p-8 mb-8 shadow-xl">
            <h2 className="text-xl font-black mb-6 flex items-center gap-2">⚙️ Admin Control Panel</h2>
            <div className="flex gap-4">
              <button
                onClick={() => handleAdminAction('APPROVED')}
                className="flex-1 bg-green-600 hover:bg-green-500 py-4 rounded-2xl font-bold transition-all"
              >
                Approve Idea
              </button>
              <button
                onClick={() => handleAdminAction('REJECTED')}
                className="flex-1 bg-red-600 hover:bg-red-500 py-4 rounded-2xl font-bold transition-all"
              >
                Reject Idea
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}