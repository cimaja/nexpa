import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import CartButton from '@/components/ui/CartButton';

interface HeaderProps {
  locale: string;
}

const Header = ({ locale }: HeaderProps) => {
  const { t } = useTranslation('common');
  
  const navigation = [
    { name: t('nav.home'), href: `/${locale}` },
    { name: t('nav.products'), href: `/${locale}/products` },
    { name: t('nav.about'), href: `/${locale}/about` },
    { name: t('nav.contact'), href: `/${locale}/contact` },
  ];

  return (
    <header className="bg-white shadow-md dark:bg-slate-900">
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href={`/${locale}`} className="flex items-center space-x-2">
              <div className="relative w-10 h-10">
                <Image
                  src="/images/logo.svg"
                  alt="Nexpa Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-xl font-bold font-display text-ocean-blue">
                Nexpa
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-ocean-blue dark:text-gray-200 font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <LanguageSwitcher currentLocale={locale} />
            <CartButton />
            <Link
              href={`/${locale}/account`}
              className="text-gray-700 hover:text-ocean-blue dark:text-gray-200"
            >
              <span className="sr-only">{t('account')}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
