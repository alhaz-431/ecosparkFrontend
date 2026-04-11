'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';

// ইন্টারফেস
interface Idea {
  id: string;
  title: string;
  description: string;
  type: 'FREE' | 'PAID';
  price?: number;
  images: string[];
  category?: { name: string };
  isPurchased?: boolean;
}

export default function IdeaDetailsPage() {
  const { id } = useParams(); // ইউআরএল থেকে আইডি নিচ্ছে
  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIdeaDetails = async () => {
      try {
        const res = await api.get(`/ideas/${id}`); // একটি নির্দিষ্ট আইডিয়া ফেচ করছে
        setIdea(res.data);
      } catch (error) {
        console.error('Details Fetch Error:', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchIdeaDetails();
  }, [id]);

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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-5xl mx-auto bg-white rounded-[3rem] shadow-sm border overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          
          {/* ইমেজ সেকশন */}
          <div className="h-[400px] lg:h-auto bg-green-50">
            {idea.images?.[0] ? (
              <img src={idea.images[0]} alt={idea.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl">🌿</div>
            )}
          </div>

          {/* টেক্সট সেকশন */}
          <div className="p-10 lg:p-16 flex flex-col">
            <span className="text-xs font-black text-green-600 bg-green-50 px-4 py-1.5 rounded-full uppercase self-start">
              {idea.category?.name || 'Sustainability'}
            </span>
            
            <h1 className="text-4xl font-black text-gray-900 mt-6 leading-tight">{idea.title}</h1>
            <p className="text-gray-500 mt-6 text-lg leading-relaxed flex-1">{idea.description}</p>

            <div className="mt-10 pt-10 border-t flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-bold uppercase tracking-widest text-sm">Price</span>
                <span className="text-3xl font-black text-gray-900">
                  {idea.type === 'FREE' ? 'FREE' : `৳${idea.price}`}
                </span>
              </div>

              {/* বাটনগুলো */}
              <div className="grid grid-cols-2 gap-4">
                <Link href="/ideas" className="text-center py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-all">
                  ← Back
                </Link>

                {idea.type === 'PAID' && !idea.isPurchased ? (
                  <Link 
                    href={`/ideas/${id}/purchase`} 
                    className="text-center py-4 bg-green-700 text-white rounded-2xl font-extrabold hover:bg-green-800 shadow-xl shadow-green-100 transition-all"
                  >
                    Buy Now 🛒
                  </Link>
                ) : idea.isPurchased ? (
                  <div className="text-center py-4 bg-blue-50 text-blue-700 rounded-2xl font-bold border border-blue-100">
                    ✅ Owned
                  </div>
                ) : (
                  <div className="text-center py-4 bg-green-50 text-green-700 rounded-2xl font-bold">
                    🆓 Free Access
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}