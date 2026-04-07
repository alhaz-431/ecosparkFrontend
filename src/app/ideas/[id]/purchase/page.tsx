'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm({ idea }: { idea: any }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // এখানে আইডি চেক করা হয়েছে যাতে undefined না হয়
    if (!stripe || !elements || !idea || !idea.id) {
      toast.error("Idea details missing!");
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const { data } = await api.post(`/payments/${idea.id}/payment-intent`);
      const clientSecret = data.clientSecret;

      if (!clientSecret) {
        throw new Error("Could not retrieve payment information from server.");
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) return;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: { name: 'Ariful Islam' },
        },
      });

      if (result.error) {
        setError(result.error.message || "Payment Failed");
        toast.error(result.error.message || "Payment Failed");
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          const confirmRes = await api.post(`/payments/${idea.id}/confirm-payment`, {
            paymentIntentId: result.paymentIntent.id
          });
          
          if (confirmRes.status === 200) {
            toast.success("Payment Successful! 🎉");
            // এখানে আইডি নিশ্চিত করে রিডাইরেক্ট করা হচ্ছে
            router.push(`/ideas/${idea.id}`); 
          }
        }
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Backend connection error. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
        <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Card Details</label>
        <div className="py-2">
          <CardElement 
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#1f2937',
                  '::placeholder': { color: '#9ca3af' },
                },
              },
            }} 
          />
        </div>
      </div>
      {error && <p className="text-red-500 text-xs font-medium">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || processing}
        className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all ${
          processing ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-700 hover:bg-green-800 active:scale-95'
        }`}
      >
        {processing ? 'Processing Payment...' : `Pay ৳${idea?.price || '0'}`}
      </button>
    </form>
  );
}

export default function PurchasePage() {
  const { id } = useParams();
  const [idea, setIdea] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    const fetchIdea = async () => {
      try {
        setLoading(true);
        // আইডি ঠিক আছে কি না চেক
        if(!id) return;
        const res = await api.get(`/ideas/${id}/basic`);
        if (res.data) {
          setIdea(res.data);
        }
      } catch (err) {
        setFetchError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchIdea();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-green-700">Loading Payment Gateway...</div>;

  if (fetchError || !idea) return <div className="min-h-screen flex items-center justify-center text-red-500 font-bold text-center p-4">Error: Could not load idea details.</div>;

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-5/12 bg-green-700 p-10 text-white flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Order Summary</h2>
            <p className="text-green-100 text-sm mb-8 italic">"{idea?.title}"</p>
            <div className="space-y-4 font-medium">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span>Total Amount</span>
                <span className="text-3xl font-black">৳{idea?.price}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="md:w-7/12 p-10">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800">Payment Information</h3>
          </div>
          <Elements stripe={stripePromise}>
            <CheckoutForm idea={idea} />
          </Elements>
        </div>
      </div>
    </div>
  );
}