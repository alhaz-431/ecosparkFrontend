'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('MEMBER'); 
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password, role });
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.user.role); 

      alert('Login Successful!');

      // এখানে পরিবর্তন করা হয়েছে: সরাসরি হোম পেজে রিডাইরেক্ট হবে
      router.push('/'); 
      
    } catch (error: any) {
      console.error('Login Error:', error);
      alert(error.response?.data?.message || 'Login failed! Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl w-full max-w-md border border-green-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-green-900">EcoSpark Login</h2>
          <p className="text-gray-500 mt-2">Welcome back! Please enter your details.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-sm font-bold text-gray-700 block mb-2">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none transition"
              required
            />
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700 block mb-2">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none transition"
              required
            />
          </div>

          <div className="bg-green-50/50 p-4 rounded-2xl border border-green-100">
            <p className="text-xs font-bold text-green-800 mb-3 text-center uppercase tracking-wider">Login As:</p>
            <div className="flex gap-8 justify-center">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="radio" 
                  name="role" 
                  value="MEMBER" 
                  checked={role === 'MEMBER'} 
                  onChange={(e) => setRole(e.target.value)} 
                  className="w-5 h-5 accent-green-600 cursor-pointer" 
                />
                <span className="font-bold text-gray-700 group-hover:text-green-700 transition">User</span>
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="radio" 
                  name="role" 
                  value="ADMIN" 
                  checked={role === 'ADMIN'} 
                  onChange={(e) => setRole(e.target.value)} 
                  className="w-5 h-5 accent-green-600 cursor-pointer" 
                />
                <span className="font-bold text-gray-700 group-hover:text-green-700 transition">Admin</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-green-700 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-green-200 transition-all ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-800'
            }`}
          >
            {loading ? 'Logging in...' : 'Login Now →'}
          </button>
        </form>

        <div className="mt-8 text-center space-y-3">
          <p className="text-gray-500">
            Don't have an account?{' '}
            <Link href="/register" className="text-green-700 font-extrabold hover:underline">
              Register here
            </Link>
          </p>
          <Link href="/" className="text-sm text-gray-400 hover:text-green-600 block transition">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}