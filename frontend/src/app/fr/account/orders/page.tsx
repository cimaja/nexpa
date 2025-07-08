'use client';

import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Order {
  id: string;
  date: string;
  total: number;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: number;
}

export default function OrdersPage() {
  const { t } = useTranslation('common');
  const router = useRouter();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      try {
        const userData = localStorage.getItem('nexpa-user');
        if (userData) {
          setIsLoggedIn(true);
          
          // For demo purposes, create mock orders
          const mockOrders: Order[] = [
            {
              id: 'NXP-20250708-1234',
              date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR'),
              total: 129.99,
              status: 'processing',
              items: 2
            },
            {
              id: 'NXP-20250701-5678',
              date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR'),
              total: 89.50,
              status: 'shipped',
              items: 1
            },
            {
              id: 'NXP-20250615-9012',
              date: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR'),
              total: 245.75,
              status: 'delivered',
              items: 3
            }
          ];
          
          setOrders(mockOrders);
          setLoading(false);
        } else {
          // Redirect to login if not logged in
          router.push('/fr/account/login');
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        router.push('/fr/account/login');
      }
    };
    
    checkAuth();
  }, [router]);
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'processing':
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            {t('orders.status.processing', 'En traitement')}
          </span>
        );
      case 'shipped':
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
            {t('orders.status.shipped', 'Expédié')}
          </span>
        );
      case 'delivered':
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            {t('orders.status.delivered', 'Livré')}
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
            {t('orders.status.cancelled', 'Annulé')}
          </span>
        );
      default:
        return status;
    }
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
      <h1 className="text-3xl font-bold mb-8">{t('account.title', 'Mon compte')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar navigation */}
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
            <nav className="space-y-1">
              <Link 
                href="/fr/account"
                className="block px-4 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                {t('account.nav.overview', 'Aperçu')}
              </Link>
              <Link 
                href="/fr/account/orders"
                className="block px-4 py-2 rounded-md bg-ocean-blue text-white font-medium"
              >
                {t('account.nav.orders', 'Mes commandes')}
              </Link>
              <Link 
                href="/fr/account/profile"
                className="block px-4 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                {t('account.nav.profile', 'Profil')}
              </Link>
              <Link 
                href="/fr/account/addresses"
                className="block px-4 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                {t('account.nav.addresses', 'Adresses')}
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem('nexpa-user');
                  router.push('/fr/account/login');
                }}
                className="w-full text-left block px-4 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                {t('account.nav.logout', 'Déconnexion')}
              </button>
            </nav>
          </div>
        </div>
        
        {/* Main content */}
        <div className="md:col-span-3">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">
                {t('orders.title', 'Mes commandes')}
              </h2>
            </div>
            
            {orders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-slate-700">
                      <th className="py-3 px-2 text-left">{t('orders.orderNumber', 'Numéro de commande')}</th>
                      <th className="py-3 px-2 text-left">{t('orders.date', 'Date')}</th>
                      <th className="py-3 px-2 text-left">{t('orders.status', 'Statut')}</th>
                      <th className="py-3 px-2 text-left">{t('orders.items', 'Articles')}</th>
                      <th className="py-3 px-2 text-left">{t('orders.total', 'Total')}</th>
                      <th className="py-3 px-2 text-right">{t('orders.actions', 'Actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id} className="border-b border-gray-200 dark:border-slate-700">
                        <td className="py-4 px-2">
                          <span className="font-medium">{order.id}</span>
                        </td>
                        <td className="py-4 px-2">{order.date}</td>
                        <td className="py-4 px-2">
                          {getStatusLabel(order.status)}
                        </td>
                        <td className="py-4 px-2">{order.items}</td>
                        <td className="py-4 px-2">{order.total.toFixed(2)} €</td>
                        <td className="py-4 px-2 text-right">
                          <Link 
                            href={`/fr/account/orders/${order.id}`}
                            className="text-ocean-blue hover:underline"
                          >
                            {t('orders.view', 'Voir')}
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  {t('orders.noOrders', 'Vous n\'avez pas encore passé de commande.')}
                </p>
                <Link
                  href="/fr/products"
                  className="inline-block py-2 px-4 bg-ocean-blue text-white rounded hover:bg-ocean-blue-dark transition"
                >
                  {t('orders.startShopping', 'Commencer vos achats')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
