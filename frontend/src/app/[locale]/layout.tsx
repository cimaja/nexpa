import { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';

export const metadata: Metadata = {
  title: 'Nexpa Surf Shop',
  description: 'Premium surf shop in Six-Fours-les-Plages, France',
};

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  let messages;
  try {
    messages = (await import(`../../../public/locales/${locale}/common.json`)).default;
  } catch (error) {
    // Fallback to default locale if translation file not found
    messages = (await import(`../../../public/locales/fr/common.json`)).default;
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="flex flex-col min-h-screen">
        <Header locale={locale} />
        <main className="flex-grow container-custom py-8">
          {children}
        </main>
        <Footer locale={locale} />
      </div>
    </NextIntlClientProvider>
  );
}
