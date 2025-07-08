'use client';

import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Address {
  id: string;
  type: 'shipping' | 'billing';
  isDefault: boolean;
  name: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export default function AddressesPage() {
  const { t } = useTranslation('common');
  const router = useRouter();
  
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      try {
        const userData = localStorage.getItem('nexpa-user');
        if (userData) {
          setIsLoggedIn(true);
          
          // Load addresses from localStorage or create mock ones if not exist
          const storedAddresses = localStorage.getItem('nexpa-addresses');
          if (storedAddresses) {
            setAddresses(JSON.parse(storedAddresses));
          } else {
            // For demo purposes, create mock addresses
            const mockAddresses: Address[] = [
              {
                id: '1',
                type: 'shipping',
                isDefault: true,
                name: 'Home',
                street: '123 Main Street',
                city: 'London',
                postalCode: 'SW1A 1AA',
                country: 'United Kingdom',
                phone: '+44 20 1234 5678'
              },
              {
                id: '2',
                type: 'billing',
                isDefault: true,
                name: 'Billing Address',
                street: '456 Oxford Street',
                city: 'London',
                postalCode: 'W1C 1AB',
                country: 'United Kingdom'
              }
            ];
            
            setAddresses(mockAddresses);
            localStorage.setItem('nexpa-addresses', JSON.stringify(mockAddresses));
          }
          
          setLoading(false);
        } else {
          // Redirect to login if not logged in
          router.push('/en/account/login');
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        router.push('/en/account/login');
      }
    };
    
    checkAuth();
  }, [router]);
  
  const handleEditAddress = (address: Address) => {
    setEditingAddress({ ...address });
    setIsAddingNew(false);
  };
  
  const handleAddNewAddress = () => {
    setEditingAddress({
      id: `new-${Date.now()}`,
      type: 'shipping',
      isDefault: addresses.filter(a => a.type === 'shipping').length === 0,
      name: '',
      street: '',
      city: '',
      postalCode: '',
      country: 'United Kingdom',
      phone: ''
    });
    setIsAddingNew(true);
  };
  
  const handleDeleteAddress = (id: string) => {
    if (confirm(t('addresses.confirmDelete', 'Are you sure you want to delete this address?'))) {
      const updatedAddresses = addresses.filter(address => address.id !== id);
      setAddresses(updatedAddresses);
      localStorage.setItem('nexpa-addresses', JSON.stringify(updatedAddresses));
    }
  };
  
  const handleSetDefault = (id: string, type: 'shipping' | 'billing') => {
    const updatedAddresses = addresses.map(address => {
      if (address.type === type) {
        return {
          ...address,
          isDefault: address.id === id
        };
      }
      return address;
    });
    
    setAddresses(updatedAddresses);
    localStorage.setItem('nexpa-addresses', JSON.stringify(updatedAddresses));
  };
  
  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingAddress) return;
    
    // Simple validation
    if (!editingAddress.name || !editingAddress.street || !editingAddress.city || !editingAddress.postalCode || !editingAddress.country) {
      alert(t('addresses.fillRequired', 'Please fill in all required fields.'));
      return;
    }
    
    let updatedAddresses: Address[];
    
    if (isAddingNew) {
      // If it's the first address of its type, make it default
      const isFirstOfType = !addresses.some(a => a.type === editingAddress.type);
      const newAddress = {
        ...editingAddress,
        isDefault: isFirstOfType ? true : editingAddress.isDefault
      };
      
      updatedAddresses = [...addresses, newAddress];
    } else {
      // Update existing address
      updatedAddresses = addresses.map(address => 
        address.id === editingAddress.id ? editingAddress : address
      );
    }
    
    // If this address is set as default, update other addresses of the same type
    if (editingAddress.isDefault) {
      updatedAddresses = updatedAddresses.map(address => {
        if (address.id !== editingAddress.id && address.type === editingAddress.type) {
          return { ...address, isDefault: false };
        }
        return address;
      });
    }
    
    setAddresses(updatedAddresses);
    localStorage.setItem('nexpa-addresses', JSON.stringify(updatedAddresses));
    setEditingAddress(null);
  };
  
  const handleCancelEdit = () => {
    setEditingAddress(null);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (!editingAddress) return;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setEditingAddress({
        ...editingAddress,
        [name]: checked
      });
    } else {
      setEditingAddress({
        ...editingAddress,
        [name]: value
      });
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
      <h1 className="text-3xl font-bold mb-8">{t('account.title', 'My Account')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar navigation */}
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
            <nav className="space-y-1">
              <Link 
                href="/en/account"
                className="block px-4 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700"
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
                className="block px-4 py-2 rounded-md bg-ocean-blue text-white font-medium"
              >
                {t('account.nav.addresses', 'Addresses')}
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem('nexpa-user');
                  router.push('/en/account/login');
                }}
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
                {t('addresses.title', 'My Addresses')}
              </h2>
              <button
                onClick={handleAddNewAddress}
                className="py-2 px-4 bg-ocean-blue text-white rounded hover:bg-ocean-blue-dark transition"
              >
                {t('addresses.addNew', 'Add New Address')}
              </button>
            </div>
            
            {editingAddress ? (
              <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4">
                  {isAddingNew 
                    ? t('addresses.addNewAddress', 'Add New Address') 
                    : t('addresses.editAddress', 'Edit Address')}
                </h3>
                
                <form onSubmit={handleSaveAddress}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="name" className="block mb-1 font-medium">
                        {t('addresses.name', 'Address Name')} *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={editingAddress.name}
                        onChange={handleInputChange}
                        placeholder={t('addresses.namePlaceholder', 'e.g. Home, Office, etc.')}
                        className="w-full p-2 border rounded dark:bg-slate-600 dark:border-slate-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="type" className="block mb-1 font-medium">
                        {t('addresses.type', 'Address Type')} *
                      </label>
                      <select
                        id="type"
                        name="type"
                        value={editingAddress.type}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded dark:bg-slate-600 dark:border-slate-500"
                      >
                        <option value="shipping">{t('addresses.shipping', 'Shipping')}</option>
                        <option value="billing">{t('addresses.billing', 'Billing')}</option>
                      </select>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label htmlFor="street" className="block mb-1 font-medium">
                        {t('addresses.street', 'Street Address')} *
                      </label>
                      <input
                        type="text"
                        id="street"
                        name="street"
                        value={editingAddress.street}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded dark:bg-slate-600 dark:border-slate-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="city" className="block mb-1 font-medium">
                        {t('addresses.city', 'City')} *
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={editingAddress.city}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded dark:bg-slate-600 dark:border-slate-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="postalCode" className="block mb-1 font-medium">
                        {t('addresses.postalCode', 'Postal Code')} *
                      </label>
                      <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        value={editingAddress.postalCode}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded dark:bg-slate-600 dark:border-slate-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="country" className="block mb-1 font-medium">
                        {t('addresses.country', 'Country')} *
                      </label>
                      <input
                        type="text"
                        id="country"
                        name="country"
                        value={editingAddress.country}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded dark:bg-slate-600 dark:border-slate-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block mb-1 font-medium">
                        {t('addresses.phone', 'Phone')}
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={editingAddress.phone || ''}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded dark:bg-slate-600 dark:border-slate-500"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="isDefault"
                          name="isDefault"
                          checked={editingAddress.isDefault}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        <label htmlFor="isDefault">
                          {editingAddress.type === 'shipping' 
                            ? t('addresses.defaultShipping', 'Set as default shipping address')
                            : t('addresses.defaultBilling', 'Set as default billing address')}
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="py-2 px-4 border border-gray-300 dark:border-slate-600 rounded hover:bg-gray-50 dark:hover:bg-slate-600 transition"
                    >
                      {t('addresses.cancel', 'Cancel')}
                    </button>
                    <button
                      type="submit"
                      className="py-2 px-4 bg-ocean-blue text-white rounded hover:bg-ocean-blue-dark transition"
                    >
                      {t('addresses.save', 'Save')}
                    </button>
                  </div>
                </form>
              </div>
            ) : null}
            
            {/* Shipping addresses */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">
                {t('addresses.shippingAddresses', 'Shipping Addresses')}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.filter(address => address.type === 'shipping').length > 0 ? (
                  addresses
                    .filter(address => address.type === 'shipping')
                    .map(address => (
                      <div key={address.id} className="border rounded-lg p-4 relative dark:border-slate-700">
                        {address.isDefault && (
                          <span className="absolute top-2 right-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium dark:bg-green-800 dark:text-green-100">
                            {t('addresses.default', 'Default')}
                          </span>
                        )}
                        <h4 className="font-semibold">{address.name}</h4>
                        <p className="text-gray-600 dark:text-gray-300">{address.street}</p>
                        <p className="text-gray-600 dark:text-gray-300">
                          {address.city}, {address.postalCode}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">{address.country}</p>
                        {address.phone && (
                          <p className="text-gray-600 dark:text-gray-300">{address.phone}</p>
                        )}
                        
                        <div className="mt-4 flex space-x-2">
                          <button
                            onClick={() => handleEditAddress(address)}
                            className="text-sm text-ocean-blue hover:underline"
                          >
                            {t('addresses.edit', 'Edit')}
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(address.id)}
                            className="text-sm text-red-600 hover:underline"
                          >
                            {t('addresses.delete', 'Delete')}
                          </button>
                          {!address.isDefault && (
                            <button
                              onClick={() => handleSetDefault(address.id, 'shipping')}
                              className="text-sm text-gray-600 hover:underline dark:text-gray-300"
                            >
                              {t('addresses.setDefault', 'Set as default')}
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="md:col-span-2 text-center py-6 border rounded-lg dark:border-slate-700">
                    <p className="text-gray-500 dark:text-gray-400">
                      {t('addresses.noShippingAddresses', 'You haven\'t added any shipping addresses yet.')}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Billing addresses */}
            <div>
              <h3 className="text-xl font-semibold mb-4">
                {t('addresses.billingAddresses', 'Billing Addresses')}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.filter(address => address.type === 'billing').length > 0 ? (
                  addresses
                    .filter(address => address.type === 'billing')
                    .map(address => (
                      <div key={address.id} className="border rounded-lg p-4 relative dark:border-slate-700">
                        {address.isDefault && (
                          <span className="absolute top-2 right-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium dark:bg-green-800 dark:text-green-100">
                            {t('addresses.default', 'Default')}
                          </span>
                        )}
                        <h4 className="font-semibold">{address.name}</h4>
                        <p className="text-gray-600 dark:text-gray-300">{address.street}</p>
                        <p className="text-gray-600 dark:text-gray-300">
                          {address.city}, {address.postalCode}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">{address.country}</p>
                        {address.phone && (
                          <p className="text-gray-600 dark:text-gray-300">{address.phone}</p>
                        )}
                        
                        <div className="mt-4 flex space-x-2">
                          <button
                            onClick={() => handleEditAddress(address)}
                            className="text-sm text-ocean-blue hover:underline"
                          >
                            {t('addresses.edit', 'Edit')}
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(address.id)}
                            className="text-sm text-red-600 hover:underline"
                          >
                            {t('addresses.delete', 'Delete')}
                          </button>
                          {!address.isDefault && (
                            <button
                              onClick={() => handleSetDefault(address.id, 'billing')}
                              className="text-sm text-gray-600 hover:underline dark:text-gray-300"
                            >
                              {t('addresses.setDefault', 'Set as default')}
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="md:col-span-2 text-center py-6 border rounded-lg dark:border-slate-700">
                    <p className="text-gray-500 dark:text-gray-400">
                      {t('addresses.noBillingAddresses', 'You haven\'t added any billing addresses yet.')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
