'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from "next-themes";
import { Sun, Moon, User as UserIcon, LayoutDashboard, LogOut } from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState<{name: string, role: string} | null>(null);
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser({
        name: parsedUser.name || 'User',
        role: parsedUser.role
      });
    } else {
      setUser(null);
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
    router.refresh();
  };

  if (!mounted) return null;

  return (
    <>
      {/* Marquee */}
      <div className="bg-green-900 text-green-200 text-sm py-1 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap">
          🌱 Share your sustainability ideas &nbsp;&nbsp;&nbsp; 🌍 Join thousands of eco-warriors &nbsp;&nbsp;&nbsp; ♻️ Reduce, Reuse, Recycle &nbsp;&nbsp;&nbsp; 🌿 Go green today &nbsp;&nbsp;&nbsp;
        </div>
      </div>

      <nav className="sticky top-0 z-50 bg-green-700 dark:bg-gray-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold flex items-center gap-2">
            🌱 <span className="hidden sm:inline">EcoSpark Hub</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-6 items-center">
            <Link href="/" className={`hover:text-green-200 transition ${pathname === '/' ? 'text-green-200 font-bold' : ''}`}>Home</Link>
            <Link href="/ideas" className={`hover:text-green-200 transition ${pathname === '/ideas' ? 'text-green-200 font-bold' : ''}`}>Ideas</Link>
            <Link href="/about" className="hover:text-green-200 transition">About Us</Link>

            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full bg-green-800 dark:bg-gray-800 hover:bg-green-600 transition-all"
            >
              {theme === "dark" ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} />}
            </button>

            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  href={user.role === 'ADMIN' ? '/dashboard/admin' : '/dashboard/member'}
                  className="flex items-center gap-1.5 bg-green-800 px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-green-600 transition border border-green-500"
                >
                  <LayoutDashboard size={16} /> Dashboard
                </Link>

                <Link href="/profile" className="flex items-center gap-2 group">
                  <div className="w-9 h-9 bg-green-600 rounded-full flex items-center justify-center border-2 border-green-400 group-hover:border-white transition">
                    <UserIcon size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs opacity-70 leading-none">Welcome</span>
                    <span className="text-sm font-bold leading-tight">{user.name}</span>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="ml-2 text-red-200 hover:text-red-400 transition"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-white text-green-700 px-6 py-2 rounded-full font-bold hover:bg-green-100 transition shadow-md"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="text-white text-2xl" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-green-800 dark:bg-gray-950 border-t border-green-600 px-6 py-6 flex flex-col gap-5">
            <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link href="/ideas" onClick={() => setMenuOpen(false)}>Ideas</Link>
            {user ? (
              <>
                <Link
                  href={user.role === 'ADMIN' ? '/dashboard/admin' : '/dashboard/member'}
                  className="font-bold text-green-300"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link href="/profile" className="font-bold text-green-300" onClick={() => setMenuOpen(false)}>My Profile</Link>
                <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 font-bold mt-2">
                  <LogOut size={18} /> Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="bg-white text-green-800 text-center py-2 rounded-xl font-bold" onClick={() => setMenuOpen(false)}>Login / Register</Link>
            )}
          </div>
        )}
      </nav>
    </>
  );
}