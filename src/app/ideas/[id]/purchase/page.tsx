'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast'; // টোস্ট ইমপোর্ট করা হয়েছে

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm({ idea }: { idea: any }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements || !idea) return;

    setProcessing(true);
    setError(null);

    try {
      // ১. পেমেন্ট ইনটেন্ট তৈরি
      const { data } = await api.post(`/payments/${idea.id}/payment-intent`);
      const clientSecret = data.clientSecret;

      if (!clientSecret) {
        throw new Error("Could not retrieve payment information from server.");
      }

      // ২. Stripe Card Element থেকে পেমেন্ট কনফার্ম করা
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
          // ৩. ব্যাকএন্ডে পেমেন্ট কনফার্ম করা
          const confirmRes = await api.post(`/payments/${idea.id}/confirm-payment`, {
            paymentIntentId: result.paymentIntent.id
          });
          
          if (confirmRes.status === 200) {
            toast.success("Payment Successful! 🌱");
            // সরাসরি আইডিয়া ডিটেইলস পেজে পাঠিয়ে দেওয়া হচ্ছে
            router.push(`/ideas/${idea.id}`);
          }
        }
      }
    } catch (err: any) {
      console.error("Payment Process Error:", err);
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
      
      <p className="text-[10px] text-center text-gray-400">
        🔒 Encrypted and Secured by Stripe
      </p>
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
        const res = await api.get(`/ideas/${id}/basic`);
        if (res.data) {
          setIdea(res.data);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setFetchError(true);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchIdea();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-green-700">Loading Payment Gateway...</div>;

  if (fetchError || !idea) return <div className="min-h-screen flex items-center justify-center text-red-500 font-bold text-center p-4">Error: Could not load idea details.<br/>Please check if the backend is running.</div>;

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        <div className="md:w-5/12 bg-green-700 p-10 text-white flex flex-col justify-between">
          <div>
            <div className="inline-block p-3 bg-white/10 rounded-2xl mb-6 text-xl">🌱</div>
            <h2 className="text-2xl font-bold mb-2">Order Summary</h2>
            <p className="text-green-100 text-sm mb-8 italic">"{idea?.title}"</p>
            
            <div className="space-y-4 font-medium">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-sm opacity-70 font-normal">Item Price</span>
                <span>৳{idea?.price}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-sm opacity-70 font-normal">Platform Fee</span>
                <span>৳0.00</span>
              </div>
              <div className="flex justify-between pt-2 items-center">
                <span className="font-bold">Total Amount</span>
                <span className="text-3xl font-black">৳{idea?.price}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-10">
            <p className="text-[10px] opacity-50">By purchasing, you agree to our Terms of Sustainability.</p>
          </div>
        </div>

        <div className="md:w-7/12 p-10">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800">Payment Information</h3>
            <p className="text-sm text-gray-500">Complete your purchase by providing your payment details.</p>
          </div>

          <Elements stripe={stripePromise}>
            <CheckoutForm idea={idea} />
          </Elements>

          <div className="mt-8 flex items-center justify-center space-x-6 opacity-30 grayscale pointer-events-none">
              <img src="https://upload.wikimedia.org/wikipedia/commons/d/d6/Visa_2021.svg" className="h-4" alt="Visa" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6" alt="Mastercard" />
          </div>
        </div>

      </div>
    </div>
  );
}