'use client';

import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { t } = useTranslation('common');
  const router = useRouter();
  
  const [form, setForm] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [errors, setErrors] = useState({
    email: '',
    password: '',
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
      email: !form.email ? t('login.errors.email', 'Email is required') : 
             !/\S+@\S+\.\S+/.test(form.email) ? t('login.errors.emailInvalid', 'Invalid email format') : '',
      password: !form.password ? t('login.errors.password', 'Password is required') : '',
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
    
    setLoading(true);
    
    try {
      // In a real app, this would be an API call to authenticate
      // For demo purposes, we'll simulate a successful login
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a mock user
      const mockUser = {
        firstName: 'John',
        lastName: 'Smith',
        email: form.email,
        isLoggedIn: true
      };
      
      // Save user to localStorage (simulating auth)
      localStorage.setItem('nexpa-user', JSON.stringify(mockUser));
      
      // Redirect to account page
      router.push('/en/account');
    } catch (error) {
      console.error('Login error:', error);
      setErrors({
        ...errors,
        general: t('login.errors.general', 'An error occurred during login. Please try again.')
      });
      setLoading(false);
    }
  };
  
  return (
    <div className="container-custom py-12">
      <div className="max-w-md mx-auto bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {t('login.title', 'Login')}
        </h1>
        
        {errors.general && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {errors.general}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-1 font-medium">
              {t('login.email', 'Email')}
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
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="password" className="font-medium">
                {t('login.password', 'Password')}
              </label>
              <Link href="/en/account/forgot-password" className="text-sm text-ocean-blue hover:underline">
                {t('login.forgotPassword', 'Forgot password?')}
              </Link>
            </div>
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
          </div>
          
          <div className="mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={form.rememberMe}
                onChange={handleInputChange}
                className="mr-2"
              />
              <label htmlFor="rememberMe">
                {t('login.rememberMe', 'Remember me')}
              </label>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded font-medium ${
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
                {t('login.loggingIn', 'Logging in...')}
              </span>
            ) : (
              t('login.login', 'Login')
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p>
            {t('login.noAccount', 'Don\'t have an account?')}{' '}
            <Link href="/en/account/register" className="text-ocean-blue hover:underline">
              {t('login.register', 'Register')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
