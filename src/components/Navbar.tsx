'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from "next-themes";
import { Sun, Moon, User as UserIcon } from "lucide-react"; 

export default function Navbar() {
  const [user, setUser] = useState<{name: string, role: string} | null>(null);
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    // লোকাল স্টোরেজ থেকে রোল এবং ইউজার নেম চেক করা
    const storedRole = localStorage.getItem('role');
    // আপনার সিস্টেমে যদি নাম সেভ না থাকে, তবে ডিফল্ট 'User' দেখাবে
    if (storedRole) {
      setUser({
        name: 'User', // এখানে চাইলে ডাটাবেজ থেকে আসা নামও দিতে পারেন
        role: storedRole
      });
    } else {
      setUser(null);
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setUser(null);
    router.push('/');
  };

  if (!mounted) return null;

  return (
    <>
      <div className="bg-green-900 text-green-200 text-sm py-1 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap">
          🌱 Share your sustainability ideas &nbsp;&nbsp;&nbsp; 🌍 Join thousands of eco-warriors &nbsp;&nbsp;&nbsp; ♻️ Reduce, Reuse, Recycle &nbsp;&nbsp;&nbsp; ☀️ Solar energy for a better tomorrow &nbsp;&nbsp;&nbsp; 💧 Save water, save life &nbsp;&nbsp;&nbsp; 🌿 Go green today &nbsp;&nbsp;&nbsp;
        </div>
      </div>

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

            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full bg-green-800 dark:bg-gray-800 hover:bg-green-600 transition-all"
            >
              {theme === "dark" ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} />}
            </button>

            {user ? (
              <div className="flex items-center gap-5">
                {/* ১. ড্যাশবোর্ড বাটন - রোল অনুযায়ী পাথ */}
                <Link
                  href={user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'}
                  className="bg-green-800 px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-green-600 transition border border-green-500"
                >
                  Dashboard
                </Link>

                {/* ২. প্রোফাইল সেকশন */}
                <Link href="/profile" className="flex items-center gap-2 text-green-100 hover:text-white transition">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center border border-green-400">
                    <UserIcon size={16} />
                  </div>
                  <span className="text-sm font-medium">Hi, {user.role}</span>
                </Link>

                {/* ৩. লগআউট বাটন */}
                <button
                  onClick={handleLogout}
                  className="bg-white text-green-700 px-4 py-1.5 rounded-full font-bold hover:bg-red-50 hover:text-red-600 transition text-sm"
                >
                  Logout
                </button>
              </div>
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
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} />}
            </button>
            <button className="text-white text-2xl" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-green-800 dark:bg-gray-900 px-6 py-4 flex flex-col gap-4">
            <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
            {user ? (
              <>
                <Link href={user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'} onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <Link href="/profile" onClick={() => setMenuOpen(false)}>My Profile ({user.role})</Link>
                <button onClick={handleLogout} className="text-left text-red-300 font-bold">Logout</button>
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

