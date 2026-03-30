import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4">🌱 EcoSpark Hub</h3>
          <p className="text-gray-400 text-sm">Empowering communities with sustainable ideas.</p>
        </div>
        <div>
          <h3 className="font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><Link href="/" className="hover:text-white">Home</Link></li>
            <li><Link href="/ideas" className="hover:text-white">Ideas</Link></li>
            <li><Link href="/about" className="hover:text-white">About Us</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4">Categories</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><Link href="/ideas?category=Energy" className="hover:text-white">⚡ Energy</Link></li>
            <li><Link href="/ideas?category=Waste" className="hover:text-white">♻️ Waste</Link></li>
            <li><Link href="/ideas?category=Transportation" className="hover:text-white">🚗 Transportation</Link></li>
            <li><Link href="/ideas?category=Water" className="hover:text-white">💧 Water</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4">Contact</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>📧 info@ecospark.com</li>
            <li>📞 +880 1234 567890</li>
            <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-white">Terms of Use</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500 text-sm">
        © 2024 EcoSpark Hub. All rights reserved. Made with 💚 for the planet.
      </div>
    </footer>
  );
}