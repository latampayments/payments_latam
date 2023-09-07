import Navbar from '@/components/Navbar';
import Provider from '@/components/Provider';
import { Toaster } from '@/components/ui/toaster';
import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { useEffect } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Latam Banks',
  description: 'Payment methods explanations for all Latam banks and details for each one',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <html lang='en'>
      <body className={inter.className}>
        <Provider>
          <div className='flex flex-col space-y-2 py-2'>
            <Navbar />
            <main className='bg-[#D6E4F0] select-none py-4 flex flex-col justify-center items-center'>
              {children}
            </main>
            <Toaster />
          </div>
        </Provider>
      </body>
    </html>
  );
}
