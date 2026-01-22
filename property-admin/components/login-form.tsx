'use client';
import React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import {
  getErrorMessage,
  isValidationError,
  getValidationErrors,
} from '@/utils/utils';
import { useToast } from './ui/toast';
import { useClient } from '@/hooks/useClient';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth-provider';
const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
});

type FormValues = z.infer<typeof formSchema>;

export function LoginForm() {
  const { addToast } = useToast();
  const client = useClient();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: FormValues) {
    setIsLoading(true);

    try {
      const result = await client.post('/admin/auth/login', {
        email: data.email,
        password: data.password,
      });

      login(result.data.data);

      addToast({
        title: 'Login Successful',
        description: 'Welcome back!',
        type: 'success',
        position: 'bottom-center',
      });

      window.location.href = '/dashboard';
    } catch (error: unknown) {
      console.error('Error during login:', error);
      const title = getErrorMessage(error);
      addToast({
        title: 'Failed to login',
        description: isValidationError(title)
          ? getValidationErrors(error)
          : `code: ${title}`,
        type: 'error',
        position: 'top-center',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="rounded-lg border border-green-200 bg-white p-6 shadow-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="admin@example.com"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      {...field}
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      <span className="sr-only">
                        {showPassword ? 'Hide password' : 'Show password'}
                      </span>
                    </Button>
                  </div>
                </FormControl>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
