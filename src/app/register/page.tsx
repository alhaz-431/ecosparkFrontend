'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';

export default function RegisterPage() {
  const [role, setRole] = useState('MEMBER'); // আপনার স্কিমা অনুযায়ী MEMBER ডিফল্ট
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', { ...formData, role });
      alert('Registration Successful! Please Login.');
      router.push('/login');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Registration failed!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 py-12 px-4">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl w-full max-w-md border border-green-100">
        <h2 className="text-3xl font-black text-green-900 mb-8 text-center">Create Account</h2>
        
        <form onSubmit={handleRegister} className="space-y-5">
          <input name="name" type="text" placeholder="Full Name" className="w-full p-4 rounded-2xl border bg-gray-50 outline-none focus:ring-2 focus:ring-green-500" onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          <input name="email" type="email" placeholder="Email" className="w-full p-4 rounded-2xl border bg-gray-50 outline-none focus:ring-2 focus:ring-green-500" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          <input name="password" type="password" placeholder="Password" className="w-full p-4 rounded-2xl border bg-gray-50 outline-none focus:ring-2 focus:ring-green-500" onChange={(e) => setFormData({...formData, password: e.target.value})} required />

          {/* রেডিও বাটন - MEMBER এবং ADMIN */}
          <div className="bg-green-50/50 p-4 rounded-2xl border border-green-100 text-center">
            <p className="text-sm font-bold text-green-800 mb-3">Register As:</p>
            <div className="flex gap-8 justify-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" value="MEMBER" checked={role === 'MEMBER'} onChange={(e) => setRole(e.target.value)} className="w-5 h-5 accent-green-600" />
                <span className="font-bold text-gray-700">User</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" value="ADMIN" checked={role === 'ADMIN'} onChange={(e) => setRole(e.target.value)} className="w-5 h-5 accent-green-600" />
                <span className="font-bold text-gray-700">Admin</span>
              </label>
            </div>
          </div>

          <button type="submit" className="w-full bg-green-700 text-white py-4 rounded-2xl font-bold hover:bg-green-800 transition shadow-lg">
            Sign Up Now →
          </button>
        </form>
        <p className="text-center mt-6 text-gray-500">Already have an account? <Link href="/login" className="text-green-700 font-bold">Login</Link></p>
      </div>
    </div>
  );
}