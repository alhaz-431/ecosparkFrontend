'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<'USER' | 'ADMIN'>('USER'); // রোল স্টেট
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // লগইনের সময় ইমেইল ও পাসওয়ার্ড
        const res = await api.post('/auth/login', {
          email: form.email,
          password: form.password,
        });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        toast.success('Login successful! 🎉');
        router.push('/');
      } else {
        // রেজিস্ট্রেশনের সময় নাম, ইমেইল, পাসওয়ার্ড এবং রোল পাঠাচ্ছি
        await api.post('/auth/register', {
          name: form.name,
          email: form.email,
          password: form.password,
          role: role, // এখানে USER অথবা ADMIN যাবে
        });
        toast.success(`Registered as ${role} successfully! Please login. ✅`);
        setIsLogin(true);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Something went wrong ❌');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <h2 className="text-3xl font-black text-green-700 mb-2 text-center">
          EcoSpark Hub
        </h2>
        <p className="text-center text-gray-500 mb-8 text-sm">
          {isLogin ? 'Welcome back! Please login' : 'Create an account to join us'}
        </p>

        {/* --- রেডিও বাটন সেকশন (আপনার স্ক্রিনশটের মতো) --- */}
        <div className="flex justify-center items-center gap-8 mb-8 bg-gray-50 py-3 rounded-xl">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input 
              type="radio" 
              name="role" 
              checked={role === 'USER'} 
              onChange={() => setRole('USER')}
              className="w-4 h-4 accent-green-600 cursor-pointer"
            />
            <span className={`text-sm font-bold transition-colors ${role === 'USER' ? 'text-green-700' : 'text-gray-400 group-hover:text-gray-600'}`}>
              User
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer group">
            <input 
              type="radio" 
              name="role" 
              checked={role === 'ADMIN'} 
              onChange={() => setRole('ADMIN')}
              className="w-4 h-4 accent-green-600 cursor-pointer"
            />
            <span className={`text-sm font-bold transition-colors ${role === 'ADMIN' ? 'text-green-700' : 'text-gray-400 group-hover:text-gray-600'}`}>
              Admin
            </span>
          </label>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="text-xs font-bold text-gray-400 ml-1">FULL NAME</label>
              <input
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border-2 border-gray-100 p-3 rounded-xl focus:outline-none focus:border-green-500 transition-all"
                required
              />
            </div>
          )}
          
          <div>
            <label className="text-xs font-bold text-gray-400 ml-1">EMAIL ADDRESS</label>
            <input
              type="email"
              placeholder="example@mail.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border-2 border-gray-100 p-3 rounded-xl focus:outline-none focus:border-green-500 transition-all"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 ml-1">PASSWORD</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border-2 border-gray-100 p-3 rounded-xl focus:outline-none focus:border-green-500 transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-700 text-white p-4 rounded-xl font-bold hover:bg-green-800 disabled:opacity-50 shadow-lg shadow-green-100 transition-all active:scale-95"
          >
            {loading ? 'Processing...' : isLogin ? `Login as ${role}` : `Register as ${role}`}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-gray-500 font-medium">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-green-700 font-bold hover:underline ml-1"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
}