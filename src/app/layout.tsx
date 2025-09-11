import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Harmonic_hub',
  description: 'harmonic_hub',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'Harmonic_hub',
    description: 'harmonic_hub',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Harmonic_hub',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Harmonic_hub',
    description: 'harmonic_hub',
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
