'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 pt-20 pb-10 px-6 font-sans text-black dark:text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="text-2xl font-black text-emerald-800 dark:text-emerald-500 flex items-center gap-2 mb-6">
              🌱 EcoSpark Hub
            </Link>
            <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
              Empowering communities to share and implement sustainable ideas for a greener future.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-black text-gray-900 dark:text-white uppercase text-[10px] tracking-widest mb-6">Platform</h4>
            <ul className="space-y-4">
              <li><Link href="/ideas" className="text-gray-500 dark:text-gray-400 hover:text-emerald-600 transition-colors font-bold text-sm">Browse Ideas</Link></li>
              <li><Link href="/ideas/create" className="text-gray-500 dark:text-gray-400 hover:text-emerald-600 transition-colors font-bold text-sm">Share Idea</Link></li>
              <li><Link href="/about" className="text-gray-500 dark:text-gray-400 hover:text-emerald-600 transition-colors font-bold text-sm">About Us</Link></li>
            </ul>
          </div>

          {/* Community Links */}
          <div>
            <h4 className="font-black text-gray-900 dark:text-white uppercase text-[10px] tracking-widest mb-6">Community</h4>
            <ul className="space-y-4">
              <li><Link href="/login" className="text-gray-500 dark:text-gray-400 hover:text-emerald-600 transition-colors font-bold text-sm">Join Us</Link></li>
              <li><Link href="/profile" className="text-gray-500 dark:text-gray-400 hover:text-emerald-600 transition-colors font-bold text-sm">My Profile</Link></li>
              <li><Link href="/dashboard" className="text-gray-500 dark:text-gray-400 hover:text-emerald-600 transition-colors font-bold text-sm">Dashboard</Link></li>
            </ul>
          </div>

          {/* Connect Section (Text Based) */}
          <div>
            <h4 className="font-black text-gray-900 dark:text-white uppercase text-[10px] tracking-widest mb-6">Connect</h4>
            <div className="flex flex-col gap-4 mb-6">
              <a href="https://github.com" target="_blank" className="text-gray-500 hover:text-black dark:hover:text-white font-bold text-xs uppercase tracking-wider transition-all">
                GitHub →
              </a>
              <a href="https://twitter.com" target="_blank" className="text-gray-500 hover:text-blue-400 font-bold text-xs uppercase tracking-wider transition-all">
                Twitter →
              </a>
              <a href="https://linkedin.com" target="_blank" className="text-gray-500 hover:text-blue-700 font-bold text-xs uppercase tracking-wider transition-all">
                LinkedIn →
              </a>
            </div>
            <p className="text-gray-400 text-sm font-medium">hello@ecospark.com</p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-gray-50 dark:border-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
            © 2026 EcoSpark Hub. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link href="#" className="text-gray-400 hover:text-gray-600 text-[10px] font-black uppercase tracking-widest">Privacy Policy</Link>
            <Link href="#" className="text-gray-400 hover:text-gray-600 text-[10px] font-black uppercase tracking-widest">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}