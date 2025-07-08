'use client';

import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
  const { t } = useTranslation('common');
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset error
    setEmailError('');
    
    // Validate email
    if (!email) {
      setEmailError(t('forgotPassword.errors.emailRequired', 'L\'adresse e-mail est requise'));
      return;
    }
    
    if (!validateEmail(email)) {
      setEmailError(t('forgotPassword.errors.invalidEmail', 'Veuillez entrer une adresse e-mail valide'));
      return;
    }
    
    setSubmitting(true);
    
    try {
      // In a real app, this would be an API call to request a password reset
      // For demo purposes, we'll simulate a successful request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message
      setSubmitted(true);
      setSubmitting(false);
    } catch (error) {
      console.error('Password reset request error:', error);
      setEmailError(t('forgotPassword.errors.general', 'Une erreur est survenue. Veuillez réessayer.'));
      setSubmitting(false);
    }
  };
  
  return (
    <div className="container-custom py-12">
      <div className="max-w-md mx-auto bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">
            {t('forgotPassword.title', 'Mot de passe oublié')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {t('forgotPassword.subtitle', 'Réinitialisez votre mot de passe en quelques étapes simples')}
          </p>
        </div>
        
        {submitted ? (
          <div className="text-center">
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
              {t('forgotPassword.emailSent', 'Un e-mail de réinitialisation a été envoyé à')} {email}
            </div>
            
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              {t('forgotPassword.checkInbox', 'Veuillez vérifier votre boîte de réception et suivre les instructions pour réinitialiser votre mot de passe. Le lien de réinitialisation expirera dans 24 heures.')}
            </p>
            
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => {
                  setEmail('');
                  setSubmitted(false);
                }}
                className="py-2 px-4 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-slate-600 transition"
              >
                {t('forgotPassword.tryAnotherEmail', 'Essayer une autre adresse e-mail')}
              </button>
              
              <Link
                href="/fr/account/login"
                className="py-2 px-4 bg-ocean-blue text-white rounded hover:bg-ocean-blue-dark transition text-center"
              >
                {t('forgotPassword.backToLogin', 'Retour à la connexion')}
              </Link>
            </div>
          </div>
        ) : (
          <>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              {t('forgotPassword.instructions', 'Entrez l\'adresse e-mail associée à votre compte et nous vous enverrons un lien pour réinitialiser votre mot de passe.')}
            </p>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="email" className="block mb-1 font-medium">
                  {t('forgotPassword.emailAddress', 'Adresse e-mail')} *
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 ${
                    emailError ? 'border-red-500' : ''
                  }`}
                  placeholder="votre@email.com"
                  disabled={submitting}
                />
                {emailError && (
                  <p className="text-red-500 text-sm mt-1">{emailError}</p>
                )}
              </div>
              
              <div className="flex flex-col space-y-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className={`py-2 px-4 rounded font-medium ${
                    submitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-ocean-blue text-white hover:bg-ocean-blue-dark'
                  } transition`}
                >
                  {submitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('forgotPassword.sending', 'Envoi en cours...')}
                    </span>
                  ) : (
                    t('forgotPassword.resetPassword', 'Réinitialiser le mot de passe')
                  )}
                </button>
                
                <Link
                  href="/fr/account/login"
                  className="py-2 px-4 border border-gray-300 dark:border-slate-600 rounded hover:bg-gray-50 dark:hover:bg-slate-700 transition text-center"
                >
                  {t('forgotPassword.backToLogin', 'Retour à la connexion')}
                </Link>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
