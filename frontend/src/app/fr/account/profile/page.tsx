'use client';

import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isLoggedIn: boolean;
}

export default function ProfilePage() {
  const { t } = useTranslation('common');
  const router = useRouter();
  
  const [form, setForm] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    isLoggedIn: false
  });
  
  const [originalForm, setOriginalForm] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    isLoggedIn: false
  });
  
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    general: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in and load profile data
    const loadProfile = () => {
      try {
        const userData = localStorage.getItem('nexpa-user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          
          // Add phone if not present
          if (!parsedUser.phone) {
            parsedUser.phone = '';
          }
          
          setForm({
            ...parsedUser,
            isLoggedIn: true
          });
          
          setOriginalForm({
            ...parsedUser,
            isLoggedIn: true
          });
          
          setLoading(false);
        } else {
          // Redirect to login if not logged in
          router.push('/fr/account/login');
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        router.push('/fr/account/login');
      }
    };
    
    loadProfile();
  }, [router]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
    
    // Clear success message when form changes
    if (success) {
      setSuccess(false);
    }
  };
  
  const validateForm = () => {
    const newErrors = {
      firstName: form.firstName ? '' : t('profile.errors.firstName', 'Le prénom est requis'),
      lastName: form.lastName ? '' : t('profile.errors.lastName', 'Le nom est requis'),
      email: !form.email ? t('profile.errors.email', 'L\'email est requis') : 
             !/\S+@\S+\.\S+/.test(form.email) ? t('profile.errors.emailInvalid', 'Format d\'email invalide') : '',
      phone: '',
      general: ''
    };
    
    setErrors(newErrors);
    
    // Check if any errors exist
    return !Object.values(newErrors).some(error => error !== '');
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSaving(true);
    
    try {
      // In a real app, this would be an API call to update the profile
      // For demo purposes, we'll simulate a successful update
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user in localStorage
      localStorage.setItem('nexpa-user', JSON.stringify({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        isLoggedIn: true
      }));
      
      // Update original form state
      setOriginalForm({
        ...form
      });
      
      // Show success message
      setSuccess(true);
      setSaving(false);
    } catch (error) {
      console.error('Profile update error:', error);
      setErrors({
        ...errors,
        general: t('profile.errors.general', 'Une erreur est survenue lors de la mise à jour du profil. Veuillez réessayer.')
      });
      setSaving(false);
    }
  };
  
  const hasChanges = () => {
    return (
      form.firstName !== originalForm.firstName ||
      form.lastName !== originalForm.lastName ||
      form.email !== originalForm.email ||
      form.phone !== originalForm.phone
    );
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
                className="block px-4 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                {t('account.nav.orders', 'Mes commandes')}
              </Link>
              <Link 
                href="/fr/account/profile"
                className="block px-4 py-2 rounded-md bg-ocean-blue text-white font-medium"
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
                {t('profile.title', 'Modifier mon profil')}
              </h2>
            </div>
            
            {success && (
              <div className="mb-6 p-3 bg-green-100 text-green-700 rounded">
                {t('profile.success', 'Votre profil a été mis à jour avec succès.')}
              </div>
            )}
            
            {errors.general && (
              <div className="mb-6 p-3 bg-red-100 text-red-700 rounded">
                {errors.general}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="firstName" className="block mb-1 font-medium">
                    {t('profile.firstName', 'Prénom')} *
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
                    {t('profile.lastName', 'Nom')} *
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
                    {t('profile.email', 'Email')} *
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
                    {t('profile.phone', 'Téléphone')}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600"
                  />
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-slate-700 pt-6 flex justify-between">
                <Link
                  href="/fr/account/change-password"
                  className="py-2 px-4 border border-gray-300 dark:border-slate-600 rounded hover:bg-gray-50 dark:hover:bg-slate-700 transition"
                >
                  {t('profile.changePassword', 'Changer de mot de passe')}
                </Link>
                
                <button
                  type="submit"
                  disabled={saving || !hasChanges()}
                  className={`py-2 px-4 rounded font-medium ${
                    saving || !hasChanges()
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-ocean-blue text-white hover:bg-ocean-blue-dark'
                  } transition`}
                >
                  {saving ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('profile.saving', 'Enregistrement...')}
                    </span>
                  ) : (
                    t('profile.save', 'Enregistrer les modifications')
                  )}
                </button>
              </div>
            </form>
          </div>
          
          {/* Delete account section */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 mt-6">
            <h3 className="text-xl font-semibold mb-4 text-red-600 dark:text-red-400">
              {t('profile.dangerZone', 'Zone dangereuse')}
            </h3>
            
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              {t('profile.deleteAccountWarning', 'La suppression de votre compte est une action permanente et ne peut pas être annulée. Toutes vos données seront définitivement supprimées.')}
            </p>
            
            <button
              onClick={() => {
                if (confirm(t('profile.deleteConfirm', 'Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.'))) {
                  // In a real app, this would be an API call to delete the account
                  localStorage.removeItem('nexpa-user');
                  router.push('/fr');
                }
              }}
              className="py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              {t('profile.deleteAccount', 'Supprimer mon compte')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
