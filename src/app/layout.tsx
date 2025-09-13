import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '하모닉허브',
  description: '누구나 음악가가 되는 학습 툴을 경험하세요 :)',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: '하모닉허브',
    description: '누구나 음악가가 되는 학습 툴을 경험하세요 :)',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: '누구나 음악가가 되는 학습 툴을 경험하세요 :)',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '하모닉허브',
    description: '누구나 음악가가 되는 학습 툴을 경험하세요 :)',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
