'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react'; // আইকন ব্যবহারের জন্য এটি লাগবে

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<'USER' | 'ADMIN'>('USER');
  const [showPassword, setShowPassword] = useState(false); // পাসওয়ার্ড দেখানোর স্টেট
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // রোল চেঞ্জ হলে অটোমেটিক ডাটা ফিল করা বা খালি করার লজিক
  useEffect(() => {
    if (role === 'ADMIN' && isLogin) {
      setForm({ ...form, email: 'admin@ecospark.com', password: 'Admin123' });
    } else {
      setForm({ ...form, email: '', password: '' });
    }
  }, [role, isLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const res = await api.post('/auth/login', {
          email: form.email,
          password: form.password,
        });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        toast.success('Login successful! 🎉');
        router.push('/');
      } else {
        await api.post('/auth/register', {
          name: form.name,
          email: form.email,
          password: form.password,
          role: role,
        });
        toast.success(`Registered as ${role} successfully! ✅`);
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
        <h2 className="text-3xl font-black text-green-700 mb-2 text-center">EcoSpark Hub</h2>
        <p className="text-center text-gray-500 mb-8 text-sm">
          {isLogin ? 'Welcome back! Please login' : 'Create an account to join us'}
        </p>

        {/* রেডিও বাটন */}
        <div className="flex justify-center items-center gap-8 mb-8 bg-gray-50 py-3 rounded-xl">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              checked={role === 'USER'} 
              onChange={() => setRole('USER')}
              className="w-4 h-4 accent-green-600"
            />
            <span className={`text-sm font-bold ${role === 'USER' ? 'text-green-700' : 'text-gray-400'}`}>User</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              checked={role === 'ADMIN'} 
              onChange={() => setRole('ADMIN')}
              className="w-4 h-4 accent-green-600"
            />
            <span className={`text-sm font-bold ${role === 'ADMIN' ? 'text-green-700' : 'text-gray-400'}`}>Admin</span>
          </label>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="text-xs font-bold text-gray-400 ml-1">FULL NAME</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border-2 border-gray-100 p-3 rounded-xl focus:outline-none focus:border-green-500"
                required
              />
            </div>
          )}
          
          <div>
            <label className="text-xs font-bold text-gray-400 ml-1">EMAIL ADDRESS</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border-2 border-gray-100 p-3 rounded-xl focus:outline-none focus:border-green-500"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 ml-1">PASSWORD</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full border-2 border-gray-100 p-3 rounded-xl focus:outline-none focus:border-green-500"
                required
              />
              {/* চোখের আইকন */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-700 text-white p-4 rounded-xl font-bold hover:bg-green-800 disabled:opacity-50 shadow-lg transition-all active:scale-95"
          >
            {loading ? 'Processing...' : isLogin ? `Login as ${role}` : `Register as ${role}`}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-gray-500">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => setIsLogin(!isLogin)} className="text-green-700 font-bold hover:underline ml-1">
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}