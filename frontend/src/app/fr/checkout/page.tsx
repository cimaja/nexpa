'use client';

import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

interface CheckoutForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  saveInfo: boolean;
  paymentMethod: 'card' | 'paypal';
}

export default function CheckoutPage() {
  const { t } = useTranslation('common');
  const router = useRouter();
  
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [total, setTotal] = useState(0);
  const [processingPayment, setProcessingPayment] = useState(false);
  
  const [form, setForm] = useState<CheckoutForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
    saveInfo: false,
    paymentMethod: 'card'
  });
  
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });

  useEffect(() => {
    // Load cart from localStorage
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem('nexpa-cart');
        const parsedCart = savedCart ? JSON.parse(savedCart) : [];
        
        if (parsedCart.length === 0) {
          // Redirect to cart if empty
          router.push('/fr/cart');
          return;
        }
        
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
        router.push('/fr/cart');
      }
    };
    
    loadCart();
    
    // Try to load saved customer info
    const savedInfo = localStorage.getItem('nexpa-customer-info');
    if (savedInfo) {
      try {
        const parsedInfo = JSON.parse(savedInfo);
        setForm(prev => ({
          ...prev,
          ...parsedInfo,
          saveInfo: true
        }));
      } catch (e) {
        console.error('Error parsing saved customer info:', e);
      }
    }
  }, [router]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {
      firstName: form.firstName ? '' : t('checkout.errors.firstName', 'Le prénom est requis'),
      lastName: form.lastName ? '' : t('checkout.errors.lastName', 'Le nom est requis'),
      email: !form.email ? t('checkout.errors.email', 'L\'email est requis') : 
             !/\S+@\S+\.\S+/.test(form.email) ? t('checkout.errors.emailInvalid', 'Format d\'email invalide') : '',
      phone: form.phone ? '' : t('checkout.errors.phone', 'Le numéro de téléphone est requis'),
      address: form.address ? '' : t('checkout.errors.address', 'L\'adresse est requise'),
      city: form.city ? '' : t('checkout.errors.city', 'La ville est requise'),
      postalCode: !form.postalCode ? t('checkout.errors.postalCode', 'Le code postal est requis') :
                 !/^\d{5}$/.test(form.postalCode) ? t('checkout.errors.postalCodeInvalid', 'Code postal invalide') : '',
      country: form.country ? '' : t('checkout.errors.country', 'Le pays est requis')
    };
    
    setErrors(newErrors);
    
    // Check if any errors exist
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors).find(key => errors[key] !== '');
      if (firstErrorField) {
        document.getElementsByName(firstErrorField)[0]?.focus();
      }
      return;
    }
    
    setProcessingPayment(true);
    
    // Save customer info if requested
    if (form.saveInfo) {
      const infoToSave = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        postalCode: form.postalCode,
        country: form.country
      };
      localStorage.setItem('nexpa-customer-info', JSON.stringify(infoToSave));
    } else {
      localStorage.removeItem('nexpa-customer-info');
    }
    
    try {
      // In a real implementation, we would:
      // 1. Create an order in the backend
      // 2. Process payment with Stripe
      // 3. Redirect to confirmation page
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart
      localStorage.setItem('nexpa-cart', JSON.stringify([]));
      
      // Redirect to confirmation
      router.push('/fr/checkout/confirmation');
    } catch (error) {
      console.error('Error processing payment:', error);
      setProcessingPayment(false);
      alert(t('checkout.errors.payment', 'Une erreur est survenue lors du traitement du paiement. Veuillez réessayer.'));
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
      <h1 className="text-3xl font-bold mb-8">{t('checkout.title', 'Paiement')}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout form */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
            <form onSubmit={handleSubmit}>
              {/* Customer information */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{t('checkout.customerInfo', 'Informations client')}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block mb-1 font-medium">
                      {t('checkout.firstName', 'Prénom')} *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 ${
                        errors.firstName ? 'border-red-500' : ''
                      }`}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block mb-1 font-medium">
                      {t('checkout.lastName', 'Nom')} *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 ${
                        errors.lastName ? 'border-red-500' : ''
                      }`}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block mb-1 font-medium">
                      {t('checkout.email', 'Email')} *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 ${
                        errors.email ? 'border-red-500' : ''
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block mb-1 font-medium">
                      {t('checkout.phone', 'Téléphone')} *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={form.phone}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 ${
                        errors.phone ? 'border-red-500' : ''
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Shipping information */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{t('checkout.shippingInfo', 'Informations de livraison')}</h2>
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label htmlFor="address" className="block mb-1 font-medium">
                      {t('checkout.address', 'Adresse')} *
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={form.address}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 ${
                        errors.address ? 'border-red-500' : ''
                      }`}
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city" className="block mb-1 font-medium">
                        {t('checkout.city', 'Ville')} *
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={form.city}
                        onChange={handleInputChange}
                        className={`w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 ${
                          errors.city ? 'border-red-500' : ''
                        }`}
                      />
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="postalCode" className="block mb-1 font-medium">
                        {t('checkout.postalCode', 'Code postal')} *
                      </label>
                      <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        value={form.postalCode}
                        onChange={handleInputChange}
                        className={`w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 ${
                          errors.postalCode ? 'border-red-500' : ''
                        }`}
                      />
                      {errors.postalCode && (
                        <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="country" className="block mb-1 font-medium">
                      {t('checkout.country', 'Pays')} *
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={form.country}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 ${
                        errors.country ? 'border-red-500' : ''
                      }`}
                    >
                      <option value="France">France</option>
                      <option value="Belgique">Belgique</option>
                      <option value="Suisse">Suisse</option>
                      <option value="Canada">Canada</option>
                      <option value="Luxembourg">Luxembourg</option>
                    </select>
                    {errors.country && (
                      <p className="text-red-500 text-sm mt-1">{errors.country}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Payment method */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{t('checkout.paymentMethod', 'Méthode de paiement')}</h2>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="card"
                      name="paymentMethod"
                      value="card"
                      checked={form.paymentMethod === 'card'}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <label htmlFor="card" className="flex items-center">
                      <span className="mr-2">{t('checkout.creditCard', 'Carte de crédit')}</span>
                      <div className="flex space-x-1">
                        <span className="block w-8 h-5 bg-gray-200 dark:bg-gray-700 rounded"></span>
                        <span className="block w-8 h-5 bg-gray-200 dark:bg-gray-700 rounded"></span>
                      </div>
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="paypal"
                      name="paymentMethod"
                      value="paypal"
                      checked={form.paymentMethod === 'paypal'}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <label htmlFor="paypal" className="flex items-center">
                      <span className="mr-2">PayPal</span>
                      <span className="block w-8 h-5 bg-gray-200 dark:bg-gray-700 rounded"></span>
                    </label>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="saveInfo"
                      name="saveInfo"
                      checked={form.saveInfo}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <label htmlFor="saveInfo">
                      {t('checkout.saveInfo', 'Sauvegarder mes informations pour la prochaine fois')}
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
                <button
                  type="submit"
                  disabled={processingPayment}
                  className={`w-full py-3 px-4 rounded font-medium ${
                    processingPayment
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-ocean-blue text-white hover:bg-ocean-blue-dark'
                  } transition`}
                >
                  {processingPayment ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('checkout.processing', 'Traitement en cours...')}
                    </span>
                  ) : (
                    t('checkout.placeOrder', 'Passer la commande')
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 sticky top-6">
            <h2 className="text-xl font-semibold mb-4">{t('checkout.orderSummary', 'Récapitulatif de commande')}</h2>
            
            <div className="mb-4 max-h-80 overflow-y-auto">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center py-3 border-b border-gray-200 dark:border-slate-700 last:border-b-0">
                  <div className="relative h-16 w-16 mr-4 flex-shrink-0">
                    <Image
                      src={item.image || '/images/placeholder.jpg'}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t('checkout.quantity', 'Quantité')}: {item.quantity}
                    </p>
                  </div>
                  <div className="ml-4 font-semibold">
                    {(item.price * item.quantity).toFixed(2)} €
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>{t('checkout.subtotal', 'Sous-total')}</span>
                <span>{subtotal.toFixed(2)} €</span>
              </div>
              
              <div className="flex justify-between">
                <span>{t('checkout.shipping', 'Frais de livraison')}</span>
                <span>
                  {shipping === 0 
                    ? t('checkout.freeShipping', 'Gratuit') 
                    : `${shipping.toFixed(2)} €`
                  }
                </span>
              </div>
              
              <div className="border-t border-gray-200 dark:border-slate-700 pt-3 flex justify-between font-semibold">
                <span>{t('checkout.total', 'Total')}</span>
                <span>{total.toFixed(2)} €</span>
              </div>
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p>
                {t('checkout.termsNotice', 'En passant votre commande, vous acceptez nos conditions générales de vente et notre politique de confidentialité.')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
