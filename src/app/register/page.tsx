'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';

export default function RegisterPage() {
  const [role, setRole] = useState('USER'); // ডিফল্ট রোল USER
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // ব্যাকএন্ডে রোলসহ সব ডেটা পাঠানো হচ্ছে
      const payload = { ...formData, role };
      await api.post('/auth/register', payload);
      
      alert('Registration Successful! Now please login.');
      router.push('/login');
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || 'Registration failed!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4 py-12">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl w-full max-w-md border border-green-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-green-900">Create Account</h2>
          <p className="text-gray-500 mt-2">Join EcoSpark community today</p>
        </div>
        
        <form onSubmit={handleRegister} className="space-y-5">
          {/* নাম */}
          <div>
            <input 
              name="name"
              type="text" 
              placeholder="Your Full Name" 
              className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none transition" 
              onChange={handleChange} 
              required 
            />
          </div>

          {/* ইমেইল */}
          <div>
            <input 
              name="email"
              type="email" 
              placeholder="Email Address" 
              className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none transition" 
              onChange={handleChange} 
              required 
            />
          </div>

          {/* পাসওয়ার্ড */}
          <div>
            <input 
              name="password"
              type="password" 
              placeholder="Password" 
              className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none transition" 
              onChange={handleChange} 
              required 
            />
          </div>

          {/* রোল সিলেকশন (রেডিও বাটন) */}
          <div className="bg-green-50/50 p-4 rounded-2xl border border-green-100">
            <p className="text-sm font-bold text-green-800 mb-3 text-center">Register As:</p>
            <div className="flex gap-8 justify-center">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="radio" 
                  name="role" 
                  value="USER" 
                  checked={role === 'USER'} 
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
            className="w-full bg-green-700 text-white py-4 rounded-2xl font-bold text-lg hover:bg-green-800 hover:shadow-lg hover:shadow-green-200 transition-all duration-300"
          >
            Sign Up Now →
          </button>
        </form>

        <p className="text-center mt-8 text-gray-500">
          Already have an account? <Link href="/login" className="text-green-700 font-extrabold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}