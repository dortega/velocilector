'use client';
import { Suspense } from 'react';
import AuthForm from '../components/AuthForm';

function ResetContent() {
  return <AuthForm mode="reset" />;
}

export default function ResetPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetContent />
    </Suspense>
  );
} 