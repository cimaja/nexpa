import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface LanguageSwitcherProps {
  currentLocale: string;
}

const LanguageSwitcher = ({ currentLocale }: LanguageSwitcherProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  
  const languages = [
    { code: 'fr', name: 'Français' },
    { code: 'en', name: 'English' },
  ];
  
  // Get the current path without the locale
  const pathWithoutLocale = router.asPath.replace(/^\/[^\/]+/, '') || '/';
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        type="button"
        className="flex items-center text-gray-700 hover:text-ocean-blue dark:text-gray-200"
        onClick={toggleDropdown}
      >
        <span className="sr-only">Change language</span>
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
            d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 z-50">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="language-menu"
          >
            {languages.map((language) => (
              <Link
                key={language.code}
                href={`/${language.code}${pathWithoutLocale}`}
                className={`block px-4 py-2 text-sm ${
                  currentLocale === language.code
                    ? 'bg-gray-100 dark:bg-slate-700 text-ocean-blue'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700'
                }`}
                role="menuitem"
                onClick={() => setIsOpen(false)}
              >
                {language.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
