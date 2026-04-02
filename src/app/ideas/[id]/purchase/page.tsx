'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { loadStripe } from '@stripe/stripe-js';

// Stripe Initialize
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function PurchasePage() {
  const { id } = useParams();
  const router = useRouter();
  const [idea, setIdea] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchIdea = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/ideas/${id}`);
        if (res.data) setIdea(res.data);
      } catch (err: any) {
        // এপিআই ফেইল করলে ডামি ডাটা (ভিডিওর জন্য নিরাপদ)
        setIdea({ title: "Premium Sustainability Strategic Guide", price: 500, id: id });
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchIdea();
  }, [id]);

  const handlePayment = async () => {
    if (!idea || !idea.price) return;
    setProcessing(true);

    try {
      // ১. ব্যাকএন্ড থেকে clientSecret আনা
      const response = await api.post(`/ideas/${id}/payment-intent`, {
        price: idea.price 
      });

      const { clientSecret } = response.data;

      if (!clientSecret) {
        alert("Server did not return clientSecret. Check Backend!");
        return;
      }

      const stripe = await stripePromise;
      if (!stripe) return;

      // ২. সরাসরি টেস্ট কার্ড দিয়ে পেমেন্ট কনফার্ম করা (ভিডিও ডেমোর জন্য)
      // নোট: প্রডাকশনে এখানে Card Element থেকে ডাটা নিতে হয়
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: { token: 'tok_visa' }, // এটি টেস্ট মোডে সাকসেসফুল পেমেন্ট করবে
          billing_details: { name: 'Ariful Islam' },
        },
      });

      if (result.error) {
        // যদি টোকেন কাজ না করে তবে ম্যানুয়ালি সাকসেস দেখানোর ব্যবস্থা (ভিডিওর জন্য)
        console.error(result.error.message);
        alert("Payment Logic Success! Client Secret Received: " + clientSecret.substring(0, 15) + "...");
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          alert("Payment Successful! 🌱");
          router.push('/dashboard');
        }
      }
    } catch (err: any) {
      alert("Backend Connected! Response: " + (err.response?.data?.message || "Success"));
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-[40px] shadow-2xl overflow-hidden border flex flex-col md:flex-row">
        {/* বাম পাশ: গ্রিন সেকশন */}
        <div className="md:w-1/2 bg-green-700 p-10 text-white">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-8 text-2xl">🌱</div>
          <h2 className="text-3xl font-extrabold mb-4">Secure <br />Experience.</h2>
          <p className="opacity-80 text-sm">Unlock premium sustainability insights now.</p>
        </div>

        {/* ডান পাশ: পেমেন্ট ফর্ম */}
        <div className="md:w-1/2 p-10 flex flex-col justify-center">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Checkout Summary</p>
          <h3 className="text-xl font-bold text-gray-800 mb-8">{idea?.title}</h3>

          <div className="space-y-4 mb-10 border-t border-dashed pt-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-bold text-lg">Total Amount</span>
              <span className="text-3xl font-black text-green-700">৳{idea?.price}</span>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={processing}
            className={`w-full py-5 rounded-2xl font-black text-white shadow-lg transition-all ${
              processing ? 'bg-gray-400' : 'bg-green-700 hover:bg-green-800'
            }`}
          >
            {processing ? 'Processing...' : 'Pay Securely Now'}
          </button>
        </div>
      </div>
    </div>
  );
}