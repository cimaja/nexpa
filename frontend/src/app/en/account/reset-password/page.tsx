'use client';

import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ResetPasswordPage() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [form, setForm] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({
    newPassword: '',
    confirmPassword: '',
    general: ''
  });
  
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [invalidToken, setInvalidToken] = useState(false);
  
  useEffect(() => {
    // Get token from URL
    const tokenParam = searchParams?.get('token');
    
    if (tokenParam) {
      setToken(tokenParam);
      // In a real app, we would validate the token with the backend
      // For demo purposes, we'll simulate a valid token
      const isValidToken = true; // This would be determined by API call
      
      if (isValidToken) {
        setLoading(false);
      } else {
        setInvalidToken(true);
        setLoading(false);
      }
    } else {
      setInvalidToken(true);
      setLoading(false);
    }
  }, [searchParams]);
  
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
  };
  
  const validateForm = () => {
    const newErrors = {
      newPassword: !form.newPassword ? t('resetPassword.errors.newPassword', 'New password is required') : 
                   form.newPassword.length < 8 ? t('resetPassword.errors.passwordLength', 'Password must be at least 8 characters long') : '',
      confirmPassword: !form.confirmPassword ? t('resetPassword.errors.confirmPassword', 'Please confirm your new password') : 
                       form.newPassword !== form.confirmPassword ? t('resetPassword.errors.passwordMatch', 'Passwords do not match') : '',
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
    
    setSubmitting(true);
    
    try {
      // In a real app, this would be an API call to reset the password
      // For demo purposes, we'll simulate a successful reset
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message
      setSuccess(true);
      setSubmitting(false);
    } catch (error) {
      console.error('Password reset error:', error);
      setErrors({
        ...errors,
        general: t('resetPassword.errors.general', 'An error occurred while resetting your password. Please try again.')
      });
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="container-custom py-12">
        <div className="max-w-md mx-auto bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ocean-blue"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (invalidToken) {
    return (
      <div className="container-custom py-12">
        <div className="max-w-md mx-auto bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-red-600">
              {t('resetPassword.invalidToken', 'Invalid Reset Link')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-4">
              {t('resetPassword.tokenExpired', 'This password reset link is invalid or has expired. Please request a new reset link.')}
            </p>
          </div>
          
          <div className="flex justify-center mt-6">
            <Link
              href="/en/account/forgot-password"
              className="py-2 px-4 bg-ocean-blue text-white rounded hover:bg-ocean-blue-dark transition"
            >
              {t('resetPassword.requestNewLink', 'Request New Link')}
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  if (success) {
    return (
      <div className="container-custom py-12">
        <div className="max-w-md mx-auto bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-green-600">
              {t('resetPassword.success', 'Password Reset Successful')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-4">
              {t('resetPassword.successMessage', 'Your password has been reset successfully. You can now log in with your new password.')}
            </p>
          </div>
          
          <div className="flex justify-center mt-6">
            <Link
              href="/en/account/login"
              className="py-2 px-4 bg-ocean-blue text-white rounded hover:bg-ocean-blue-dark transition"
            >
              {t('resetPassword.goToLogin', 'Go to Login Page')}
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container-custom py-12">
      <div className="max-w-md mx-auto bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">
            {t('resetPassword.title', 'Reset Password')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {t('resetPassword.subtitle', 'Create a new password for your account')}
          </p>
        </div>
        
        {errors.general && (
          <div className="mb-6 p-3 bg-red-100 text-red-700 rounded">
            {errors.general}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 mb-6">
            <div>
              <label htmlFor="newPassword" className="block mb-1 font-medium">
                {t('resetPassword.newPassword', 'New Password')} *
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
                {t('resetPassword.passwordHint', 'Password must be at least 8 characters long')}
              </p>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block mb-1 font-medium">
                {t('resetPassword.confirmPassword', 'Confirm New Password')} *
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
          
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-2 px-4 rounded font-medium ${
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
                  {t('resetPassword.resetting', 'Resetting...')}
                </span>
              ) : (
                t('resetPassword.resetPassword', 'Reset Password')
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
