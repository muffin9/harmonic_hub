'use client';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import MusicMainContent from '@/components/MusicMainContent';
import Review from '@/components/Review';
import { Toaster } from '@/components/ui/toaster';
import { useEffect } from 'react';
import { getRefreshToken } from '@/lib/auth';
import { apiAuthFetch } from '@/api/auth';

export default function HomePage() {
  useEffect(() => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return;

    const checkToken = async () => {
      apiAuthFetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });
    };

    checkToken();
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <div className="w-full">
        <Header />
        <MusicMainContent />
        <div className="bg-gradient-to-b from-[#FFFFFF] to-primary">
          <Review />
          <Footer />
        </div>
      </div>
      <Toaster />
    </main>
  );
}
