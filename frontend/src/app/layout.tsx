import '../styles/globals.css';
import type { Metadata } from 'next';
import { Nunito, Montserrat } from 'next/font/google';

const nunito = Nunito({ 
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Nexpa Surf Shop',
  description: 'Premium surf shop in Six-Fours-les-Plages, France',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${nunito.variable} ${montserrat.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
