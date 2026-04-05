import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast';

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
      
      
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
         
      
      </body>
    </html>
  );
}