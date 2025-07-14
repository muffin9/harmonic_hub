import { ScoreAndMp3Section } from '@/components/midi-score-uploader';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

export default function DemoPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <div className="w-full">
        <Header />
        <ScoreAndMp3Section />
        <Footer />
      </div>
    </main>
  );
}
