'use client';
import { Suspense } from 'react';
import AuthForm from '../components/AuthForm';

function LoginContent() {
  return <AuthForm mode="login" />;
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
} 