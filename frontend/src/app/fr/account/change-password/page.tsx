'use client';

import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ChangePasswordPage() {
  const { t } = useTranslation('common');
  const router = useRouter();
  
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    general: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      try {
        const userData = localStorage.getItem('nexpa-user');
        if (userData) {
          setIsLoggedIn(true);
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
      currentPassword: form.currentPassword ? '' : t('changePassword.errors.currentPassword', 'Le mot de passe actuel est requis'),
      newPassword: !form.newPassword ? t('changePassword.errors.newPassword', 'Le nouveau mot de passe est requis') : 
                   form.newPassword.length < 8 ? t('changePassword.errors.passwordLength', 'Le mot de passe doit contenir au moins 8 caractères') : '',
      confirmPassword: !form.confirmPassword ? t('changePassword.errors.confirmPassword', 'Veuillez confirmer votre nouveau mot de passe') : 
                       form.newPassword !== form.confirmPassword ? t('changePassword.errors.passwordMatch', 'Les mots de passe ne correspondent pas') : '',
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
      // In a real app, this would be an API call to update the password
      // For demo purposes, we'll simulate a successful update
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Reset form
      setForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Show success message
      setSuccess(true);
      setSaving(false);
    } catch (error) {
      console.error('Password update error:', error);
      setErrors({
        ...errors,
        general: t('changePassword.errors.general', 'Une erreur est survenue lors de la mise à jour du mot de passe. Veuillez réessayer.')
      });
      setSaving(false);
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
                className="block px-4 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700"
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
                {t('changePassword.title', 'Changer de mot de passe')}
              </h2>
            </div>
            
            {success && (
              <div className="mb-6 p-3 bg-green-100 text-green-700 rounded">
                {t('changePassword.success', 'Votre mot de passe a été mis à jour avec succès.')}
              </div>
            )}
            
            {errors.general && (
              <div className="mb-6 p-3 bg-red-100 text-red-700 rounded">
                {errors.general}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 mb-6">
                <div>
                  <label htmlFor="currentPassword" className="block mb-1 font-medium">
                    {t('changePassword.currentPassword', 'Mot de passe actuel')} *
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={form.currentPassword}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 ${
                      errors.currentPassword ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.currentPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="newPassword" className="block mb-1 font-medium">
                    {t('changePassword.newPassword', 'Nouveau mot de passe')} *
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={form.newPassword}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 ${
                      errors.newPassword ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.newPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                  )}
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {t('changePassword.passwordHint', 'Le mot de passe doit contenir au moins 8 caractères')}
                  </p>
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block mb-1 font-medium">
                    {t('changePassword.confirmPassword', 'Confirmer le nouveau mot de passe')} *
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 ${
                      errors.confirmPassword ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between">
                <Link
                  href="/fr/account/profile"
                  className="py-2 px-4 border border-gray-300 dark:border-slate-600 rounded hover:bg-gray-50 dark:hover:bg-slate-700 transition"
                >
                  {t('changePassword.cancel', 'Annuler')}
                </Link>
                
                <button
                  type="submit"
                  disabled={saving}
                  className={`py-2 px-4 rounded font-medium ${
                    saving
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
                      {t('changePassword.saving', 'Mise à jour...')}
                    </span>
                  ) : (
                    t('changePassword.save', 'Mettre à jour le mot de passe')
                  )}
                </button>
              </div>
            </form>
          </div>
          
          <div className="mt-6 bg-white dark:bg-slate-800 rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4">
              {t('changePassword.forgotPassword', 'Mot de passe oublié ?')}
            </h3>
            
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              {t('changePassword.forgotPasswordInfo', 'Si vous avez oublié votre mot de passe actuel, vous pouvez le réinitialiser en utilisant le lien ci-dessous.')}
            </p>
            
            <Link
              href="/fr/account/forgot-password"
              className="text-ocean-blue hover:underline"
            >
              {t('changePassword.resetPassword', 'Réinitialiser mon mot de passe')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
