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
    country: 'United Kingdom',
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
          router.push('/en/cart');
          return;
        }
        
        setCartItems(parsedCart);
        
        // Calculate totals
        const itemSubtotal = parsedCart.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0);
        setSubtotal(itemSubtotal);
        
        // Set shipping cost (free over €100)
        const shippingCost = itemSubtotal > 100 ? 0 : 10;
        setShipping(shippingCost);
        
        // Calculate total
        setTotal(itemSubtotal + shippingCost);
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading cart:', error);
        setCartItems([]);
        setLoading(false);
        router.push('/en/cart');
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
      firstName: form.firstName ? '' : t('checkout.errors.firstName', 'First name is required'),
      lastName: form.lastName ? '' : t('checkout.errors.lastName', 'Last name is required'),
      email: !form.email ? t('checkout.errors.email', 'Email is required') : 
             !/\S+@\S+\.\S+/.test(form.email) ? t('checkout.errors.emailInvalid', 'Invalid email format') : '',
      phone: form.phone ? '' : t('checkout.errors.phone', 'Phone number is required'),
      address: form.address ? '' : t('checkout.errors.address', 'Address is required'),
      city: form.city ? '' : t('checkout.errors.city', 'City is required'),
      postalCode: !form.postalCode ? t('checkout.errors.postalCode', 'Postal code is required') : '',
      country: form.country ? '' : t('checkout.errors.country', 'Country is required')
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
      router.push('/en/checkout/confirmation');
    } catch (error) {
      console.error('Error processing payment:', error);
      setProcessingPayment(false);
      alert(t('checkout.errors.payment', 'An error occurred while processing your payment. Please try again.'));
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
      <h1 className="text-3xl font-bold mb-8">{t('checkout.title', 'Checkout')}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout form */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
            <form onSubmit={handleSubmit}>
              {/* Customer information */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{t('checkout.customerInfo', 'Customer Information')}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block mb-1 font-medium">
                      {t('checkout.firstName', 'First Name')} *
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
                      {t('checkout.lastName', 'Last Name')} *
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
                      {t('checkout.phone', 'Phone')} *
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
                <h2 className="text-xl font-semibold mb-4">{t('checkout.shippingInfo', 'Shipping Information')}</h2>
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label htmlFor="address" className="block mb-1 font-medium">
                      {t('checkout.address', 'Address')} *
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
                        {t('checkout.city', 'City')} *
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
                        {t('checkout.postalCode', 'Postal Code')} *
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
                      {t('checkout.country', 'Country')} *
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
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                      <option value="Ireland">Ireland</option>
                    </select>
                    {errors.country && (
                      <p className="text-red-500 text-sm mt-1">{errors.country}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Payment method */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{t('checkout.paymentMethod', 'Payment Method')}</h2>
                
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
                      <span className="mr-2">{t('checkout.creditCard', 'Credit Card')}</span>
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
                      {t('checkout.saveInfo', 'Save my information for next time')}
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
                      {t('checkout.processing', 'Processing...')}
                    </span>
                  ) : (
                    t('checkout.placeOrder', 'Place Order')
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 sticky top-6">
            <h2 className="text-xl font-semibold mb-4">{t('checkout.orderSummary', 'Order Summary')}</h2>
            
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
                      {t('checkout.quantity', 'Quantity')}: {item.quantity}
                    </p>
                  </div>
                  <div className="ml-4 font-semibold">
                    €{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>{t('checkout.subtotal', 'Subtotal')}</span>
                <span>€{subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>{t('checkout.shipping', 'Shipping')}</span>
                <span>
                  {shipping === 0 
                    ? t('checkout.freeShipping', 'Free') 
                    : `€${shipping.toFixed(2)}`
                  }
                </span>
              </div>
              
              <div className="border-t border-gray-200 dark:border-slate-700 pt-3 flex justify-between font-semibold">
                <span>{t('checkout.total', 'Total')}</span>
                <span>€{total.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p>
                {t('checkout.termsNotice', 'By placing your order, you agree to our terms and conditions and privacy policy.')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
