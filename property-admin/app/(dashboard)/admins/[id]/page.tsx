'use client';
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Shield,
  Lock,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useClient } from '@/hooks/useClient';
import dayjs from 'dayjs';

function AdminDetailContent() {
  const params = useParams();
  const router = useRouter();
  const client = useClient();

  const {
    data: admin,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['admin', params.id],
    queryFn: async () => {
      const response = await client.get(`/admin/single/${params.id}`);
      return response?.data?.data.admin;
    },
    enabled: !!params.id,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error || !admin) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Admins
        </Button>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-900">Failed to load admin</h3>
                <p className="text-red-800 text-sm mt-1">
                  {error instanceof Error ? error.message : 'Admin not found'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Admins
        </Button>
        <div className="flex items-center gap-2">
          {admin.active ? (
            <Badge className="bg-green-100 text-green-800">Active</Badge>
          ) : (
            <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
          )}
          {admin.isSuperAdmin && (
            <Badge className="bg-purple-100 text-purple-800">
              <Shield className="h-3 w-3 mr-1" />
              Super Admin
            </Badge>
          )}
        </div>
      </div>

      {/* Admin Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-2xl">
              {admin.fullName?.charAt(0)}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">
                {admin.fullName}
              </h1>
              <p className="text-gray-600 mt-1">@{admin.userName}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {admin.isSuperAdmin ? (
                  <Badge className="bg-purple-100 text-purple-800">
                    Super Admin
                  </Badge>
                ) : (
                  <Badge variant="outline">Admin</Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Basic admin details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Full Name
              </label>
              <p className="text-gray-900 mt-1">{admin.fullName || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Username
              </label>
              <p className="text-gray-900 mt-1 font-mono">
                @{admin.userName || '-'}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Email Address
              </label>
              <p className="text-gray-900 mt-1 break-all">
                {admin.email || '-'}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Admin ID
              </label>
              <p className="text-gray-900 mt-1 font-mono text-sm">
                {admin.adminId || '-'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Status */}
      <Card>
        <CardHeader>
          <CardTitle>Account Status</CardTitle>
          <CardDescription>Account status and activity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Status
              </label>
              <div className="mt-1">
                {admin.active ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="text-green-600 font-semibold">Active</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-600 font-semibold">
                      Inactive
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Account Type
              </label>
              <div className="mt-1">
                {admin.isSuperAdmin ? (
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-purple-600" />
                    <span className="text-purple-600 font-semibold">
                      Super Admin
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <span className="text-blue-600 font-semibold">Admin</span>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Last Login
              </label>
              <p className="text-gray-900 mt-1">
                {admin.lastLogin
                  ? dayjs(admin.lastLogin).format('DD-MM-YYYY HH:mm')
                  : 'Never'}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Account Created
              </label>
              <p className="text-gray-900 mt-1">
                {admin.createdAt
                  ? dayjs(admin.createdAt).format('DD-MM-YYYY HH:mm')
                  : '-'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Permissions */}
      <Card>
        <CardHeader>
          <CardTitle>Permissions</CardTitle>
          <CardDescription>
            {admin.isSuperAdmin
              ? 'Super Admin has full access to all system features'
              : 'Permissions assigned to this admin account'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {admin.isSuperAdmin ? (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-purple-900">
                    Full System Access
                  </p>
                  <p className="text-sm text-purple-800 mt-1">
                    This admin has unrestricted access to all system features,
                    settings, and user management capabilities.
                  </p>
                </div>
              </div>
            </div>
          ) : admin.permissions ? (
            <div className="space-y-2">
              {admin.permissions
                .split(',')
                .map((permission: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
                  >
                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="text-gray-900 text-sm capitalize">
                      {permission.trim()}
                    </span>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              <Lock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">No specific permissions assigned</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Activity</CardTitle>
          <CardDescription>Admin account timeline</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="h-3 w-3 rounded-full bg-gray-400 mt-1.5" />
                <div className="w-0.5 h-12 bg-gray-200 my-2" />
              </div>
              <div className="pb-8">
                <p className="font-semibold text-gray-900">Account Created</p>
                <p className="text-sm text-gray-600">
                  {admin.createdAt
                    ? dayjs(admin.createdAt).format('MMMM DD, YYYY HH:mm')
                    : '-'}
                </p>
              </div>
            </div>
            {admin.lastLogin && (
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-blue-500 mt-1.5" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Last Login</p>
                  <p className="text-sm text-gray-600">
                    {dayjs(admin.lastLogin).format('MMMM DD, YYYY HH:mm')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Security Info */}
      <Card className="border-amber-200 bg-amber-50">
        <CardHeader>
          <CardTitle className="text-amber-900">Security Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-amber-800">
                Admin credentials are sensitive. Never share passwords or
                tokens. If you suspect unauthorized access, reset the password
                immediately.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminDetailPage() {
  return <AdminDetailContent />;
}