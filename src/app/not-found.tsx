import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-9xl mb-4">🌿</div>
        <h1 className="text-6xl font-extrabold text-green-700 mb-4">404</h1>
        <p className="text-2xl text-gray-600 mb-8">Page not found</p>
        <Link href="/" className="bg-green-700 text-white px-8 py-3 rounded-full font-bold hover:bg-green-800 transition">
          Go Home 🏠
        </Link>
      </div>
    </div>
  );
}