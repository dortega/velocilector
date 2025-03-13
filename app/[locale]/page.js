'use client';
import {useTranslations} from 'next-intl';
import Navbar from './components/Navbar';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const t = useTranslations('index');
  const currentYear = new Date().getFullYear();
  
  try {
    // Intentamos acceder a las traducciones de forma segura
    const title = t('title');
    const description = t('description');

    const renderFeatures = (plan) => {
      return Array.from({ length: 4 }, (_, i) => i + 1).map((num) => (
        <li key={num} className="flex items-center">
          <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          {t(`pricing.${plan}.feature${num}`)}
        </li>
      ));
    };

    return (
      <main className="min-h-screen bg-white flex flex-col">
        <Navbar />
        
        {/* Hero Section */}
        <section className="hero min-h-[70vh] bg-gradient-to-b from-green-800 via-green-600 to-white">
          <div className="hero-content text-center px-4">
            <div className="max-w-3xl w-full">
              <h1 className="flex items-center justify-center mb-8">
                <Image
                  src="/images/black_logo.png"
                  alt="Velocilector logo"
                  width={72}
                  height={72}
                  className="w-16 h-16 md:w-16 md:h-16"
                />
                <span className="text-5xl md:text-6xl font-light tracking-wide text-black">
                  velocilector
                </span>
              </h1>
              <p className="text-lg md:text-xl mb-8 text-black/80 px-4">
                {t('hero.subtitle')}
              </p>
              <Link 
                href="/play"
                className="btn btn-primary bg-green-800 text-white hover:bg-green-700 border-none"
              >
                {t('hero.cta')}
              </Link>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-12 md:py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="w-full md:w-1/2">
                <Image
                  src="/images/velocilector-about.png"
                  alt="Velocilector reading illustration"
                  width={500}
                  height={500}
                  className="w-full h-auto"
                  priority
                />
              </div>
              <div className="w-full md:w-1/2 space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-green-800">
                  {t('explanation.title')}
                </h2>
                <p className="text-base md:text-lg text-gray-600">
                  {t('explanation.description')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="py-12 md:py-16 px-4 bg-green-50">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-green-800 mb-8 md:mb-12">
              {t('benefits.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {/* Beneficio 1 */}
              <div className="card bg-white shadow-xl">
                <div className="card-body items-center text-center p-6">
                  <h3 className="card-title text-lg md:text-xl text-green-700">
                    {t('benefits.speed.title')}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600">
                    {t('benefits.speed.description')}
                  </p>
                </div>
              </div>
              {/* Beneficio 2 */}
              <div className="card bg-white shadow-xl">
                <div className="card-body items-center text-center p-6">
                  <h3 className="card-title text-lg md:text-xl text-green-700">
                    {t('benefits.comprehension.title')}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600">
                    {t('benefits.comprehension.description')}
                  </p>
                </div>
              </div>
              {/* Beneficio 3 */}
              <div className="card bg-white shadow-xl">
                <div className="card-body items-center text-center p-6">
                  <h3 className="card-title text-lg md:text-xl text-green-700">
                    {t('benefits.tracking.title')}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600">
                    {t('benefits.tracking.description')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-green-800 mb-4">{t('pricing.title')}</h2>
              <p className="text-gray-600">{t('pricing.subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Free Plan */}
              <div className="card bg-white shadow-xl">
                <div className="card-body p-8">
                  <h3 className="text-xl font-bold text-center mb-2">{t('pricing.free.title')}</h3>
                  <div className="text-center mb-6">
                    <span className="text-4xl font-bold">{t('pricing.free.price')}</span>
                    <span className="text-gray-500">{t('pricing.free.period')}</span>
                  </div>
                  <ul className="space-y-4">
                    {renderFeatures('free')}
                  </ul>
                  <div className="mt-8">
                    <Link 
                      href="/auth/register" 
                      className="btn btn-outline btn-block"
                    >
                      {t('pricing.free.cta')}
                    </Link>
                  </div>
                </div>
              </div>

              {/* Pro Plan */}
              <div className="card bg-white shadow-xl border-2 border-green-500">
                <div className="card-body p-8">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm">
                      {t('pricing.pro.highlight')}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-center mb-2">{t('pricing.pro.title')}</h3>
                  <div className="text-center mb-6">
                    <span className="text-4xl font-bold">{t('pricing.pro.price')}</span>
                    <span className="text-gray-500">{t('pricing.pro.period')}</span>
                  </div>
                  <ul className="space-y-4">
                    {renderFeatures('pro')}
                  </ul>
                  <div className="mt-8">
                    <Link 
                      href="/auth/register" 
                      className="btn btn-primary bg-green-500 hover:bg-green-600 border-none btn-block"
                    >
                      {t('pricing.pro.cta')}
                    </Link>
                  </div>
                </div>
              </div>

              {/* Premium Plan */}
              <div className="card bg-white shadow-xl">
                <div className="card-body p-8">
                  <h3 className="text-xl font-bold text-center mb-2">{t('pricing.premium.title')}</h3>
                  <div className="text-center mb-6">
                    <span className="text-4xl font-bold">{t('pricing.premium.price')}</span>
                    <span className="text-gray-500">{t('pricing.premium.period')}</span>
                  </div>
                  <ul className="space-y-4">
                    {renderFeatures('premium')}
                  </ul>
                  <div className="mt-8">
                    <Link 
                      href="/auth/register" 
                      className="btn btn-outline btn-block"
                    >
                      {t('pricing.premium.cta')}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-green-800 text-white">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('cta.title')}</h2>
            <p className="text-lg mb-8 text-green-100">{t('cta.subtitle')}</p>
            <Link 
              href="/auth/register" 
              className="btn btn-lg bg-white text-green-800 hover:bg-green-100 border-none"
            >
              {t('cta.button')}
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 bg-white border-t">
          <div className="container mx-auto max-w-6xl text-center text-gray-600">
            <p>© {currentYear} Obisdy Venture Builder. {t('footer.rights')}</p>
          </div>
        </footer>
      </main>
    );
  } catch (error) {
    console.error('❌ Error al acceder a las traducciones:', error);
    return (
      <main>
        <h1>Error loading translations</h1>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </main>
    );
  }
} 