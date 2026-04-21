'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#001f3f] border-t border-blue-900/50 pt-20 pb-10 px-6 font-sans text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="text-2xl font-black text-emerald-400 flex items-center gap-2 mb-6 uppercase tracking-tighter">
              🌱 EcoSpark Hub
            </Link>
            <p className="text-blue-200/70 font-medium leading-relaxed">
              Empowering communities to share and implement sustainable ideas for a greener future.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-black text-white uppercase text-[10px] tracking-[0.2em] mb-8 opacity-50">Platform</h4>
            <ul className="space-y-4">
              <li><Link href="/ideas" className="text-blue-100 hover:text-emerald-400 transition-all font-bold text-sm">Browse Ideas</Link></li>
              <li><Link href="/ideas/create" className="text-blue-100 hover:text-emerald-400 transition-all font-bold text-sm">Share Idea</Link></li>
              <li><Link href="/about" className="text-blue-100 hover:text-emerald-400 transition-all font-bold text-sm">About Us</Link></li>
            </ul>
          </div>

          {/* Community Links */}
          <div>
            <h4 className="font-black text-white uppercase text-[10px] tracking-[0.2em] mb-8 opacity-50">Community</h4>
            <ul className="space-y-4">
              <li><Link href="/login" className="text-blue-100 hover:text-emerald-400 transition-all font-bold text-sm">Join Us</Link></li>
              <li><Link href="/profile" className="text-blue-100 hover:text-emerald-400 transition-all font-bold text-sm">My Profile</Link></li>
              <li><Link href="/dashboard" className="text-blue-100 hover:text-emerald-400 transition-all font-bold text-sm">Dashboard</Link></li>
            </ul>
          </div>

          {/* Connect Section */}
          <div>
            <h4 className="font-black text-white uppercase text-[10px] tracking-[0.2em] mb-8 opacity-50">Connect</h4>
            <div className="flex flex-col gap-4 mb-6">
              <a href="https://github.com" target="_blank" className="text-blue-200 hover:text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2">
                GitHub <span className="text-emerald-400">→</span>
              </a>
              <a href="https://twitter.com" target="_blank" className="text-blue-200 hover:text-blue-400 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2">
                Twitter <span className="text-emerald-400">→</span>
              </a>
              <a href="https://linkedin.com" target="_blank" className="text-blue-200 hover:text-blue-500 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2">
                LinkedIn <span className="text-emerald-400">→</span>
              </a>
            </div>
            <p className="text-emerald-400/80 text-sm font-black tracking-tight">hello@ecospark.com</p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-blue-300/50 text-[10px] font-black uppercase tracking-[0.2em]">
            © 2026 EcoSpark Hub. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link href="#" className="text-blue-300/50 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-blue-300/50 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}