import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-inter',
});

/* Preview fonts loaded via Google Fonts CDN <link> to keep bundle lean */
const GOOGLE_FONTS_URL =
  'https://fonts.googleapis.com/css2?' +
  [
    'family=Source+Serif+4:ital,wght@0,400;0,600;0,700;1,400',
    'family=Playfair+Display:wght@600;700',
    'family=Merriweather:wght@400;700',
    'family=Poppins:wght@500;600;700',
    'family=Montserrat:wght@600;700',
    'family=Lora:wght@400;500',
    'family=Roboto:wght@400;500',
    'family=Open+Sans:wght@400;500;600',
    'family=PT+Serif:wght@400;700',
    'family=Crimson+Text:wght@400;600;700',
    'family=Libre+Baskerville:wght@400;700',
  ].join('&') +
  '&display=swap';

export const metadata: Metadata = {
  title: 'Resume Builder Pro',
  description:
    'Create stunning, ATS-optimized resumes with multiple templates, real-time preview, and PDF export. Free and open-source.',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={GOOGLE_FONTS_URL} />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
