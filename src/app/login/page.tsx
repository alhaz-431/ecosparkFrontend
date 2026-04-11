'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      router.push('/dashboard');
    } catch (error) {
      alert('Login failed! Check credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl w-full max-w-md border border-green-100">
        <h2 className="text-3xl font-black text-green-900 mb-8 text-center">EcoSpark Login</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="email"
            placeholder="Email Address"
            className="w-full p-4 rounded-2xl border focus:ring-2 focus:ring-green-500 outline-none"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-4 rounded-2xl border focus:ring-2 focus:ring-green-500 outline-none"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="w-full bg-green-700 text-white py-4 rounded-2xl font-bold hover:bg-green-800 transition">
            Login Now →
          </button>
        </form>
        <p className="text-center mt-6 text-gray-500">
          New here? <Link href="/register" className="text-green-700 font-bold">Create Account</Link>
        </p>
      </div>
    </div>
  );
}