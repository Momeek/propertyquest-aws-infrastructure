'use client';
import React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  getErrorMessage,
  isValidationError,
  getValidationErrors,
} from '@/utils/utils';
import { useToast } from './ui/toast';
import { useClient } from '@/hooks/useClient';
import { Eye, EyeOff } from 'lucide-react';

const formSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  userName: z
    .string()
    .min(2, { message: 'User name must be at least 2 characters' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' }),
  isSuperAdmin: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateAdminForm({ onClose }: { onClose: () => void }) {
  const { addToast } = useToast();
  const client = useClient();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      userName: '',
      password: '',
      isSuperAdmin: false,
    },
  });

  async function onSubmit(data: FormValues) {
    setIsLoading(true);

    try {
      await client.post('/admin/create', data);
      addToast({
        title: 'Admin successful created',
        description: '',
        type: 'success',
        position: 'bottom-center',
      });
      form.reset();
      onClose();
    } catch (error: unknown) {
      console.error('Error during creation:', error);
      const title = getErrorMessage(error);
      addToast({
        title: 'Failed to create admin',
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage className="text-red-600" />
            </FormItem>
          )}
        />

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
          name="userName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User Name</FormLabel>
              <FormControl>
                <Input placeholder="J D" {...field} disabled={isLoading} />
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

        <FormField
          control={form.control}
          name="isSuperAdmin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Admin Role</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(value === 'true')}
                defaultValue={
                  field.value !== undefined ? String(field.value) : undefined
                }
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white border border-[#dddd]">
                  <SelectItem className="hover:text-[#16a249]" value="false">
                    Admin
                  </SelectItem>
                  <SelectItem className="hover:text-[#16a249]" value="true">
                    Super Admin
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage className="text-red-600" />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            className="bg-green-600 hover:bg-green-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Admin'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
