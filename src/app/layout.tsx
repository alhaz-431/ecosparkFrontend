import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast'; 
import { ThemeProvider } from 'next-themes';

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
        {/* থিম প্রোভাইডার দিয়ে পুরো অ্যাপকে ঘিরে দেওয়া হলো */}
        <ThemeProvider attribute="class" defaultTheme="light">
          
          <Toaster position="top-center" reverseOrder={false} />
          
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          
        </ThemeProvider>
      </body>
    </html>
  );
}