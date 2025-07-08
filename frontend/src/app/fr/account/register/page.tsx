'use client';

import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const { t } = useTranslation('common');
  const router = useRouter();
  
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: '',
    general: ''
  });
  
  const [loading, setLoading] = useState(false);
  
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
      firstName: form.firstName ? '' : t('register.errors.firstName', 'Le prénom est requis'),
      lastName: form.lastName ? '' : t('register.errors.lastName', 'Le nom est requis'),
      email: !form.email ? t('register.errors.email', 'L\'email est requis') : 
             !/\S+@\S+\.\S+/.test(form.email) ? t('register.errors.emailInvalid', 'Format d\'email invalide') : '',
      password: !form.password ? t('register.errors.password', 'Le mot de passe est requis') : 
                form.password.length < 8 ? t('register.errors.passwordLength', 'Le mot de passe doit contenir au moins 8 caractères') : '',
      confirmPassword: !form.confirmPassword ? t('register.errors.confirmPassword', 'Veuillez confirmer votre mot de passe') : 
                       form.password !== form.confirmPassword ? t('register.errors.passwordMatch', 'Les mots de passe ne correspondent pas') : '',
      acceptTerms: !form.acceptTerms ? t('register.errors.acceptTerms', 'Vous devez accepter les conditions générales') : '',
      general: ''
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
    
    setLoading(true);
    
    try {
      // In a real app, this would be an API call to register
      // For demo purposes, we'll simulate a successful registration
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create a mock user
      const mockUser = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        isLoggedIn: true
      };
      
      // Save user to localStorage (simulating auth)
      localStorage.setItem('nexpa-user', JSON.stringify(mockUser));
      
      // Redirect to account page
      router.push('/fr/account');
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({
        ...errors,
        general: t('register.errors.general', 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.')
      });
      setLoading(false);
    }
  };
  
  return (
    <div className="container-custom py-8">
      <div className="max-w-lg mx-auto bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {t('register.title', 'Créer un compte')}
        </h1>
        
        {errors.general && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {errors.general}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="firstName" className="block mb-1 font-medium">
                {t('register.firstName', 'Prénom')} *
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
                {t('register.lastName', 'Nom')} *
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
          </div>
          
          <div className="mb-4">
            <label htmlFor="email" className="block mb-1 font-medium">
              {t('register.email', 'Email')} *
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
          
          <div className="mb-4">
            <label htmlFor="password" className="block mb-1 font-medium">
              {t('register.password', 'Mot de passe')} *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 ${
                errors.password ? 'border-red-500' : ''
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t('register.passwordHint', 'Le mot de passe doit contenir au moins 8 caractères')}
            </p>
          </div>
          
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block mb-1 font-medium">
              {t('register.confirmPassword', 'Confirmer le mot de passe')} *
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
          
          <div className="mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="acceptTerms"
                name="acceptTerms"
                checked={form.acceptTerms}
                onChange={handleInputChange}
                className={`mr-2 ${errors.acceptTerms ? 'border-red-500' : ''}`}
              />
              <label htmlFor="acceptTerms">
                {t('register.acceptTerms', 'J\'accepte les')} <Link href="/fr/terms" className="text-ocean-blue hover:underline">{t('register.terms', 'conditions générales')}</Link> {t('register.and', 'et')} <Link href="/fr/privacy" className="text-ocean-blue hover:underline">{t('register.privacy', 'la politique de confidentialité')}</Link>
              </label>
            </div>
            {errors.acceptTerms && (
              <p className="text-red-500 text-sm mt-1">{errors.acceptTerms}</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded font-medium ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-ocean-blue text-white hover:bg-ocean-blue-dark'
            } transition`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('register.creating', 'Création du compte...')}
              </span>
            ) : (
              t('register.createAccount', 'Créer un compte')
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p>
            {t('register.haveAccount', 'Vous avez déjà un compte ?')}{' '}
            <Link href="/fr/account/login" className="text-ocean-blue hover:underline">
              {t('register.login', 'Se connecter')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
