import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/components/ThemeProvider'; // আপনার বানানো কম্পোনেন্ট

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
        {/* ThemeProvider শুরু করুন এখানে */}
        <ThemeProvider> 
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <Toaster position="top-right" />
        </ThemeProvider> 
        {/* ThemeProvider শেষ */}
      </body>
    </html>
  );
}