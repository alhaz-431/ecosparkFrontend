'use client';
import { useEffect, useState } from 'react';
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

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
    fetchIdea();
  }, [id]);

  const fetchIdea = async () => {
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
  };

  const handleVote = async (value: number) => {
    if (!user) {
      toast.error('Please login to vote!');
      return router.push('/login');
    }
    setVoting(true);
    try {
      await api.post(`/ideas/${id}/vote`, { value });
      toast.success(value === 1 ? 'Upvoted! 👍' : 'Downvoted! 👎');
      fetchIdea();
    } catch (error) {
      toast.error('Failed to vote!');
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

  const upvotes = idea.votes?.filter((v: any) => v.value === 1).length || 0;
  const downvotes = idea.votes?.filter((v: any) => v.value === -1).length || 0;
  const userVote = user ? idea.votes?.find((v: any) => v.userId === user.id) : null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Back */}
        <Link href="/ideas" className="text-green-700 hover:underline text-sm mb-6 inline-block">
          ← Back to Ideas
        </Link>

        {/* Header */}
        <div className="bg-white rounded-3xl shadow p-8 mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full">
              {idea.category?.name}
            </span>
            <span className={`text-sm px-3 py-1 rounded-full ${
              idea.type === 'PAID' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
            }`}>
              {idea.type === 'PAID' ? `💰 Paid - $${idea.price}` : '🆓 Free'}
            </span>
            <span className={`text-sm px-3 py-1 rounded-full ${
              idea.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
              idea.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
              'bg-yellow-100 text-yellow-700'
            }`}>
              {idea.status}
            </span>
          </div>

          <h1 className="text-3xl font-extrabold text-gray-800 mb-4">{idea.title}</h1>

          <div className="flex gap-4 text-sm text-gray-500 mb-6">
            <span>👤 {idea.author?.name}</span>
            <span>📅 {new Date(idea.createdAt).toLocaleDateString()}</span>
          </div>

          {idea.images?.length > 0 && (
            <img src={idea.images[0]} alt={idea.title} className="w-full h-64 object-cover rounded-xl mb-6" />
          )}

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">🔴 Problem Statement</h2>
              <p className="text-gray-600">{idea.problemStatement}</p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">✅ Proposed Solution</h2>
              <p className="text-gray-600">{idea.solution}</p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">📝 Description</h2>
              <p className="text-gray-600">{idea.description}</p>
            </div>
          </div>
        </div>

        {/* Voting */}
        <div className="bg-white rounded-3xl shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Vote on this Idea</h2>
          <div className="flex gap-4 items-center">
            <button
              onClick={() => handleVote(1)}
              disabled={voting}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition ${
                userVote?.value === 1
                  ? 'bg-green-700 text-white'
                  : 'bg-green-100 text-green-700 hover:bg-green-700 hover:text-white'
              }`}
            >
              👍 Upvote ({upvotes})
            </button>
            <button
              onClick={() => handleVote(-1)}
              disabled={voting}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition ${
                userVote?.value === -1
                  ? 'bg-red-600 text-white'
                  : 'bg-red-100 text-red-600 hover:bg-red-600 hover:text-white'
              }`}
            >
              👎 Downvote ({downvotes})
            </button>
            {!user && (
              <p className="text-sm text-gray-500">
                <Link href="/login" className="text-green-700 hover:underline">Login</Link> to vote
              </p>
            )}
          </div>
        </div>

        {/* Paid idea purchase button */}
        {idea.type === 'PAID' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-3xl p-6 mb-6 text-center">
            <p className="text-yellow-700 font-bold mb-3">💰 This is a paid idea - Purchase to get full access</p>
            <Link
              href={`/ideas/${id}/purchase`}
              className="bg-yellow-500 text-white px-8 py-3 rounded-full font-bold hover:bg-yellow-600 transition"
            >
              Buy Now - ${idea.price}
            </Link>
          </div>
        )}

        {/* Admin Actions */}
        {user?.role === 'ADMIN' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-3xl p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">⚙️ Admin Actions</h2>
            <div className="flex gap-4 flex-wrap">
              <button
                onClick={() => handleAdminAction('APPROVED')}
                className="bg-green-700 text-white px-6 py-2 rounded-full hover:bg-green-800 transition"
              >
                ✅ Approve
              </button>
              <button
                onClick={() => handleAdminAction('REJECTED')}
                className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition"
              >
                ❌ Reject
              </button>
            </div>
          </div>
        )}

        {/* Rejection Feedback */}
        {idea.status === 'REJECTED' && idea.feedbackNote && user?.id === idea.authorId && (
          <div className="bg-red-50 border border-red-200 rounded-3xl p-6">
            <h2 className="text-lg font-bold text-red-700 mb-2">❌ Rejection Feedback</h2>
            <p className="text-red-600">{idea.feedbackNote}</p>
          </div>
        )}
      </div>
    </div>
  );
}