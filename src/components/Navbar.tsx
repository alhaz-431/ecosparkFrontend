'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from "next-themes"; // আপনার জন্য অ্যাড করা
import { Sun, Moon } from "lucide-react"; // আপনার জন্য অ্যাড করা

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme(); // ডার্ক মোড স্টেট
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  if (!mounted) return null;

  return (
    <>
      {/* Marquee */}
      <div className="bg-green-900 text-green-200 text-sm py-1 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap">
          🌱 Share your sustainability ideas &nbsp;&nbsp;&nbsp; 🌍 Join thousands of eco-warriors &nbsp;&nbsp;&nbsp; ♻️ Reduce, Reuse, Recycle &nbsp;&nbsp;&nbsp; ☀️ Solar energy for a better tomorrow &nbsp;&nbsp;&nbsp; 💧 Save water, save life &nbsp;&nbsp;&nbsp; 🌿 Go green today &nbsp;&nbsp;&nbsp;
        </div>
      </div>

      {/* Sticky Navbar */}
      <nav className="sticky top-0 z-50 bg-green-700 dark:bg-gray-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold flex items-center gap-2">
            🌱 <span>EcoSpark Hub</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-6 items-center">
            <Link href="/" className="hover:text-green-200 transition">Home</Link>
            <Link href="/ideas" className="hover:text-green-200 transition">Ideas</Link>
            <Link href="/about" className="hover:text-green-200 transition">About Us</Link>

            {/* Dark Mode Toggle - আপনার মেনুর সাথে অ্যাড করা */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full bg-green-800 dark:bg-gray-800 hover:bg-green-600 transition-all"
            >
              {theme === "dark" ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} />}
            </button>

            {user ? (
              <>
                <Link
                  href={user.role === 'ADMIN' ? '/dashboard/admin' : '/dashboard/member'}
                  className="hover:text-green-200 transition"
                >
                  Dashboard
                </Link>
                
                {/* আপনার নামের অংশটুকু এখন প্রোফাইল লিঙ্ক */}
                <Link href="/profile" className="text-green-200 text-sm hover:underline transition">
                  Hi, {user.name} 👋
                </Link>

                <button
                  onClick={handleLogout}
                  className="bg-white text-green-700 px-4 py-1.5 rounded-full font-semibold hover:bg-green-100 transition text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-white text-green-700 px-5 py-1.5 rounded-full font-semibold hover:bg-green-100 transition text-sm"
              >
                Login / Register
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
             {/* Mobile Dark Mode Toggle */}
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} />}
            </button>
            <button
              className="text-white text-2xl"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-green-800 dark:bg-gray-900 px-6 py-4 flex flex-col gap-4">
            <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link href="/ideas" onClick={() => setMenuOpen(false)}>Ideas</Link>
            <Link href="/about" onClick={() => setMenuOpen(false)}>About Us</Link>
            {user ? (
              <>
                {/* মোবাইলেও প্রোফাইল লিঙ্ক যোগ করা হয়েছে */}
                <Link href="/profile" onClick={() => setMenuOpen(false)}>My Profile ({user.name})</Link>
                <Link href={user.role === 'ADMIN' ? '/dashboard/admin' : '/dashboard/member'} onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <button onClick={handleLogout} className="text-left text-red-300">Logout</button>
              </>
            ) : (
              <Link href="/login" onClick={() => setMenuOpen(false)}>Login / Register</Link>
            )}
          </div>
        )}
      </nav>
    </>
  );
}



