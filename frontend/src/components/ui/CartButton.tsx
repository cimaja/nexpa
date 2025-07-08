import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

const CartButton = () => {
  const [itemCount, setItemCount] = useState(0);
  const router = useRouter();
  const { t } = useTranslation('common');
  const locale = router.locale || 'fr';

  // In a real implementation, this would be connected to a cart context
  useEffect(() => {
    // Example: Load cart data from localStorage
    const loadCartData = () => {
      if (typeof window !== 'undefined') {
        const cartData = localStorage.getItem('nexpa-cart');
        if (cartData) {
          try {
            const cart = JSON.parse(cartData);
            const count = cart.items ? cart.items.reduce((total: number, item: any) => total + item.quantity, 0) : 0;
            setItemCount(count);
          } catch (error) {
            console.error('Failed to parse cart data:', error);
            setItemCount(0);
          }
        }
      }
    };

    loadCartData();
    
    // Listen for storage events to update cart when changed in another tab
    window.addEventListener('storage', loadCartData);
    
    return () => {
      window.removeEventListener('storage', loadCartData);
    };
  }, []);

  return (
    <Link
      href={`/${locale}/cart`}
      className="relative text-gray-700 hover:text-ocean-blue dark:text-gray-200"
    >
      <span className="sr-only">{t('cart')}</span>
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
          d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
        />
      </svg>
      
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-sunset-orange text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </Link>
  );
};

export default CartButton;
