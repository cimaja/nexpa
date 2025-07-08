'use client';

import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  isLoggedIn: boolean;
}

export default function AccountPage() {
  const { t } = useTranslation('common');
  const router = useRouter();
  
  const [profile, setProfile] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    email: '',
    isLoggedIn: false
  });
  
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, this would be an API call to get user profile
    // For now, we'll simulate a logged-in user or redirect to login
    const checkAuth = () => {
      try {
        // Check if we have user data in localStorage (simulating auth)
        const userData = localStorage.getItem('nexpa-user');
        
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setProfile({
            ...parsedUser,
            isLoggedIn: true
          });
          setLoading(false);
        } else {
          // No user data found, redirect to login
          router.push('/en/account/login');
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        router.push('/en/account/login');
      }
    };
    
    // For demo purposes, let's create a mock user if none exists
    const createMockUser = () => {
      const mockUser = {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@example.com',
        isLoggedIn: true
      };
      
      localStorage.setItem('nexpa-user', JSON.stringify(mockUser));
      setProfile(mockUser);
      setLoading(false);
    };
    
    // For demo, always create a mock user
    createMockUser();
    
    // In real app, would use: checkAuth();
  }, [router]);
  
  const handleLogout = () => {
    // Clear user data and redirect to login
    localStorage.removeItem('nexpa-user');
    router.push('/en/account/login');
  };
  
  if (loading) {
    return (
      <div className="container-custom py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ocean-blue"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-8">{t('account.title', 'My Account')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar navigation */}
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
            <nav className="space-y-1">
              <Link 
                href="/en/account"
                className="block px-4 py-2 rounded-md bg-ocean-blue text-white font-medium"
              >
                {t('account.nav.overview', 'Overview')}
              </Link>
              <Link 
                href="/en/account/orders"
                className="block px-4 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                {t('account.nav.orders', 'My Orders')}
              </Link>
              <Link 
                href="/en/account/profile"
                className="block px-4 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                {t('account.nav.profile', 'Profile')}
              </Link>
              <Link 
                href="/en/account/addresses"
                className="block px-4 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                {t('account.nav.addresses', 'Addresses')}
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left block px-4 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                {t('account.nav.logout', 'Logout')}
              </button>
            </nav>
          </div>
        </div>
        
        {/* Main content */}
        <div className="md:col-span-3">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">
                {t('account.welcome', 'Welcome')}, {profile.firstName}!
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Account summary */}
              <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                <h3 className="font-medium mb-3">{t('account.personalInfo', 'Personal Information')}</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">{t('account.name', 'Name')}:</span> {profile.firstName} {profile.lastName}
                  </p>
                  <p>
                    <span className="font-medium">{t('account.email', 'Email')}:</span> {profile.email}
                  </p>
                  <div className="pt-2">
                    <Link 
                      href="/en/account/profile"
                      className="text-ocean-blue hover:underline text-sm"
                    >
                      {t('account.editProfile', 'Edit profile')} →
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Recent orders */}
              <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                <h3 className="font-medium mb-3">{t('account.recentOrders', 'Recent Orders')}</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-500 dark:text-gray-400">
                    {t('account.noOrders', 'You haven\'t placed any orders yet.')}
                  </p>
                  <div className="pt-2">
                    <Link 
                      href="/en/products"
                      className="text-ocean-blue hover:underline text-sm"
                    >
                      {t('account.startShopping', 'Start shopping')} →
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Saved addresses */}
              <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                <h3 className="font-medium mb-3">{t('account.savedAddresses', 'Saved Addresses')}</h3>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-500 dark:text-gray-400">
                    {t('account.noAddresses', 'You haven\'t saved any addresses yet.')}
                  </p>
                  <div className="pt-2">
                    <Link 
                      href="/en/account/addresses"
                      className="text-ocean-blue hover:underline text-sm"
                    >
                      {t('account.addAddress', 'Add address')} →
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Preferences */}
              <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                <h3 className="font-medium mb-3">{t('account.preferences', 'Preferences')}</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">{t('account.language', 'Language')}:</span> English
                  </p>
                  <p>
                    <span className="font-medium">{t('account.currency', 'Currency')}:</span> EUR (€)
                  </p>
                  <div className="pt-2">
                    <Link 
                      href="/en/account/preferences"
                      className="text-ocean-blue hover:underline text-sm"
                    >
                      {t('account.editPreferences', 'Edit preferences')} →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
