'use client';

import { ScoreAndMp3Section } from '@/components/midi-score-uploader';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import MusicMainContent from '@/components/MusicMainContent';
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
        <ScoreAndMp3Section />
        <Footer />
      </div>
      <Toaster />
    </main>
  );
}
