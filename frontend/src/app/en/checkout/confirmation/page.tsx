'use client';

import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OrderConfirmationPage() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState('');
  
  useEffect(() => {
    // Generate a random order number
    const generateOrderNumber = () => {
      const timestamp = new Date().getTime().toString().slice(-8);
      const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      return `NXP-${timestamp}-${random}`;
    };
    
    setOrderNumber(generateOrderNumber());
    
    // Check if we came from checkout
    // If localStorage has no customer info, redirect to home
    const customerInfo = localStorage.getItem('nexpa-customer-info');
    if (!customerInfo) {
      router.push('/en');
    }
  }, [router]);
  
  return (
    <div className="container-custom py-12">
      <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-lg shadow p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold mb-2">
            {t('confirmation.thankYou', 'Thank you for your order!')}
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {t('confirmation.emailSent', 'A confirmation email has been sent to your email address.')}
          </p>
        </div>
        
        <div className="border-t border-b border-gray-200 dark:border-gray-700 py-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">{t('confirmation.orderNumber', 'Order number')}:</span>
            <span className="font-bold">{orderNumber}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="font-medium">{t('confirmation.estimatedDelivery', 'Estimated delivery')}:</span>
            <span>
              {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
        </div>
        
        <div className="space-y-4 mb-8">
          <p>
            {t('confirmation.trackingInfo', 'You will receive an email with tracking information for your order soon.')}
          </p>
          
          <p>
            {t('confirmation.questions', 'If you have any questions about your order, please contact us at')} <a href="mailto:support@nexpa.com" className="text-ocean-blue hover:underline">support@nexpa.com</a>
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/en"
            className="flex-1 py-3 px-4 bg-ocean-blue text-white rounded font-medium text-center hover:bg-ocean-blue-dark transition"
          >
            {t('confirmation.continueShopping', 'Continue shopping')}
          </Link>
          
          <Link
            href="/en/account/orders"
            className="flex-1 py-3 px-4 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded font-medium text-center hover:bg-gray-50 dark:hover:bg-slate-600 transition"
          >
            {t('confirmation.viewOrder', 'View my order')}
          </Link>
        </div>
      </div>
    </div>
  );
}
