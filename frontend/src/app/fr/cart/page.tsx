'use client';

import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

export default function CartPage() {
  const { t } = useTranslation('common');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Load cart from localStorage
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem('nexpa-cart');
        const parsedCart = savedCart ? JSON.parse(savedCart) : [];
        setCartItems(parsedCart);
        
        // Calculate totals
        const itemSubtotal = parsedCart.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0);
        setSubtotal(itemSubtotal);
        
        // Set shipping cost (free over 100€)
        const shippingCost = itemSubtotal > 100 ? 0 : 10;
        setShipping(shippingCost);
        
        // Calculate total
        setTotal(itemSubtotal + shippingCost);
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading cart:', error);
        setCartItems([]);
        setLoading(false);
      }
    };
    
    loadCart();
  }, []);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    
    setCartItems(updatedCart);
    localStorage.setItem('nexpa-cart', JSON.stringify(updatedCart));
    
    // Recalculate totals
    const newSubtotal = updatedCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setSubtotal(newSubtotal);
    
    const newShipping = newSubtotal > 100 ? 0 : 10;
    setShipping(newShipping);
    
    setTotal(newSubtotal + newShipping);
  };

  const removeItem = (id: string) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    
    setCartItems(updatedCart);
    localStorage.setItem('nexpa-cart', JSON.stringify(updatedCart));
    
    // Recalculate totals
    const newSubtotal = updatedCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setSubtotal(newSubtotal);
    
    const newShipping = newSubtotal > 100 ? 0 : 10;
    setShipping(newShipping);
    
    setTotal(newSubtotal + newShipping);
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.setItem('nexpa-cart', JSON.stringify([]));
    setSubtotal(0);
    setShipping(0);
    setTotal(0);
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
      <h1 className="text-3xl font-bold mb-8">{t('cart.title', 'Panier')}</h1>
      
      {cartItems.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-8 text-center">
          <p className="text-xl mb-6">{t('cart.empty', 'Votre panier est vide')}</p>
          <Link href="/fr/products" className="bg-ocean-blue text-white px-6 py-2 rounded hover:bg-ocean-blue-dark transition">
            {t('cart.continueShopping', 'Continuer vos achats')}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-slate-700">
                  <tr>
                    <th className="py-3 px-4 text-left">{t('cart.product', 'Produit')}</th>
                    <th className="py-3 px-4 text-center">{t('cart.price', 'Prix')}</th>
                    <th className="py-3 px-4 text-center">{t('cart.quantity', 'Quantité')}</th>
                    <th className="py-3 px-4 text-center">{t('cart.total', 'Total')}</th>
                    <th className="py-3 px-4 text-center">{t('cart.actions', 'Actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                  {cartItems.map(item => (
                    <tr key={item.id}>
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div className="relative h-16 w-16 mr-4">
                            <Image
                              src={item.image || '/images/placeholder.jpg'}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <Link href={`/fr/products/${item.id}`} className="hover:text-ocean-blue">
                            {item.title}
                          </Link>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        {item.price} €
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="bg-gray-200 dark:bg-slate-700 px-2 py-1 rounded-l"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                            className="w-12 text-center border-t border-b dark:bg-slate-700 dark:border-slate-600"
                            min="1"
                          />
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="bg-gray-200 dark:bg-slate-700 px-2 py-1 rounded-r"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center font-semibold">
                        {(item.price * item.quantity).toFixed(2)} €
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 flex justify-between">
              <Link href="/fr/products" className="text-ocean-blue hover:underline flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                {t('cart.continueShopping', 'Continuer vos achats')}
              </Link>
              
              <button 
                onClick={clearCart}
                className="text-red-600 hover:text-red-800 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
                {t('cart.clearCart', 'Vider le panier')}
              </button>
            </div>
          </div>
          
          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">{t('cart.orderSummary', 'Récapitulatif de commande')}</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>{t('cart.subtotal', 'Sous-total')}</span>
                  <span>{subtotal.toFixed(2)} €</span>
                </div>
                
                <div className="flex justify-between">
                  <span>{t('cart.shipping', 'Frais de livraison')}</span>
                  <span>
                    {shipping === 0 
                      ? t('cart.freeShipping', 'Gratuit') 
                      : `${shipping.toFixed(2)} €`
                    }
                  </span>
                </div>
                
                <div className="border-t border-gray-200 dark:border-slate-700 pt-3 flex justify-between font-semibold">
                  <span>{t('cart.total', 'Total')}</span>
                  <span>{total.toFixed(2)} €</span>
                </div>
              </div>
              
              <Link 
                href="/fr/checkout"
                className="block w-full bg-ocean-blue text-white text-center py-3 px-4 rounded font-medium hover:bg-ocean-blue-dark transition"
              >
                {t('cart.proceedToCheckout', 'Procéder au paiement')}
              </Link>
              
              <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
                <p className="mb-2">
                  {t('cart.securePayment', 'Paiement sécurisé par Stripe')}
                </p>
                <div className="flex space-x-2">
                  <span className="block w-8 h-5 bg-gray-200 dark:bg-gray-700 rounded"></span>
                  <span className="block w-8 h-5 bg-gray-200 dark:bg-gray-700 rounded"></span>
                  <span className="block w-8 h-5 bg-gray-200 dark:bg-gray-700 rounded"></span>
                  <span className="block w-8 h-5 bg-gray-200 dark:bg-gray-700 rounded"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
