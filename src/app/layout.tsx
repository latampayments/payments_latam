import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import Provider from '@/components/Provider';
import { Toaster } from '@/components/ui/toaster';
import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Latam Payments',
  description: 'Payment methods explanation for all Latam banks and details for each one.Alternative payment methods and digital options.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang='en'>
      <head>
        <link rel="icon" type="image/png" sizes="192x192"  href="/favicons/android-icon-192x192.png"/>
        <link rel="icon" type="image/png" sizes="512x512"  href="/favicons/android-icon-192x192.png"/>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png"/>
        <link rel="manifest" href="/favicons/manifest.json" />
      </head>
      <body className={inter.className}>
        <Provider>
          <div className='flex flex-col'>
            <Navbar />
            <main className='bg-[#51C4D3] select-none flex flex-col justify-center items-center py-4'>
              {children}
            </main>
            <Toaster />
            <Footer />
          </div>
        </Provider>
      </body>
    </html>
  );
}
