'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { authService } from '@/services/auth';
import Image from 'next/image';
import Link from 'next/link';

export default function AuthForm({ mode = 'login' }) {
  const t = useTranslations('auth');
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('verify'); // 'verify', 'reset', 'verified'

  useEffect(() => {
    // Mostrar modal de verificación exitosa si viene de callback
    if (searchParams.get('verified') === 'true') {
      setModalType('verified');
      setShowModal(true);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let result;

      if (mode === 'login') {
        result = await authService.login(email, password);
        if (result.error) throw new Error(result.error);
        router.push('/platform');
      } 
      else if (mode === 'register') {
        result = await authService.register(email, password);
        if (result.error) throw new Error(result.error);
        setModalType('verify');
        setShowModal(true);
      }
      else if (mode === 'reset') {
        result = await authService.resetPassword(email);
        if (result.error) throw new Error(result.error);
        setModalType('reset');
        setShowModal(true);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getModalContent = () => {
    switch (modalType) {
      case 'verify':
        return {
          title: t('verifyEmailTitle'),
          message: t('verifyEmail'),
          action: t('modal.understand')
        };
      case 'reset':
        return {
          title: t('resetEmailTitle'),
          message: t('resetEmailSent'),
          action: t('modal.understand')
        };
      case 'verified':
        return {
          title: t('verifiedEmailTitle'),
          message: t('verifiedEmail'),
          action: t('modal.login')
        };
      default:
        return { title: '', message: '', action: '' };
    }
  };

  const modalContent = getModalContent();

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="flex flex-col items-center">
            <Image
              src="/images/black_logo.png"
              alt="Velocilector logo"
              width={48}
              height={48}
              className="w-20 h-20"
            />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              {t(`${mode}.title`)}
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  {t('email')}
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder={t('email')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {mode !== 'reset' && (
                <div>
                  <label htmlFor="password" className="sr-only">
                    {t('password')}
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                    placeholder={t('password')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              )}
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                {loading ? t('loading') : t(`${mode}.action`)}
              </button>
            </div>
          </form>

          <div className="text-sm text-center space-y-2">
            {mode === 'login' && (
              <>
                <a href="/auth/register" className="text-green-600 hover:text-green-500">
                  {t('login.register')}
                </a>
                <br />
                <a href="/auth/reset" className="text-green-600 hover:text-green-500">
                  {t('login.forgot')}
                </a>
              </>
            )}
            {mode === 'register' && (
              <a href="/auth/login" className="text-green-600 hover:text-green-500">
                {t('register.login')}
              </a>
            )}
            {mode === 'reset' && (
              <a href="/auth/login" className="text-green-600 hover:text-green-500">
                {t('reset.back')}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Modal Dinámico */}
      <dialog id="verification_modal" className={`modal ${showModal ? 'modal-open' : ''}`}>
        <div className="modal-box bg-white">
          <h3 className="font-bold text-lg text-green-800">
            {modalContent.title}
          </h3>
          <p className="py-4">
            {modalContent.message}
          </p>
          <div className="modal-action">
            <button 
              className="btn btn-primary bg-green-800 hover:bg-green-700 text-white border-none"
              onClick={() => setShowModal(false)}
            >
              {modalContent.action}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setShowModal(false)}>close</button>
        </form>
      </dialog>
    </>
  );
} 