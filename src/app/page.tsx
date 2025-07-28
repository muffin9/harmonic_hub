'use client';

import { ScoreAndMp3Section } from '@/components/midi-score-uploader';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Toaster } from '@/components/ui/toaster';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <div className="w-full">
        <Header />
        <ScoreAndMp3Section />
        <Footer />
      </div>
      <Toaster />
    </main>
  );
}
