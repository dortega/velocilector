'use client';
import { Suspense } from 'react';
import AuthForm from '../components/AuthForm';

function RegisterContent() {
  return <AuthForm mode="register" />;
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterContent />
    </Suspense>
  );
} 