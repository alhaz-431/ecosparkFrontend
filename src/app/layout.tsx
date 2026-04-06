import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast'; // ইমপোর্ট করা আছেই

const geist = Geist({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EcoSpark Hub',
  description: 'Share your sustainability ideas',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning> 
      <body className={geist.className}>
        {/* টোস্টারটি এখানে বসিয়ে দিন যাতে এটি সবার উপরে থাকে */}
        <Toaster position="top-center" reverseOrder={false} />
        
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}