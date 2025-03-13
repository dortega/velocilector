'use client';
import { useTranslations } from 'next-intl';

export default function Dashboard() {
  const t = useTranslations('platform');

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{t('progress.title')}</h1>
      <p className="text-gray-600">{t('progress.empty')}</p>
    </div>
  );
} 