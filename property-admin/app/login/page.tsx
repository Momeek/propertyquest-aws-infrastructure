'use client';
import React, { useEffect } from 'react';
import { LoginForm } from '@/components/login-form';
import { useAuth } from '@/lib/auth-provider';
import { useRouter, usePathname } from 'next/navigation';

export default function LoginPage() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (user && pathname === '/login') {
      router.push('/dashboard');
    }
  }, [user, router]);

  return (
    <div className="flex h-[100dvh] overflow-hidden items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-black">Admin Portal</h1>
          <p className="mt-2 text-gray-600">Sign in to your account</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
