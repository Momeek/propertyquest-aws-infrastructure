'use client';
import React from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Download,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
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
import { Separator } from '@/components/ui/separator';
import { useClient } from '@/hooks/useClient';
import dayjs from 'dayjs';
import {
  getAffiliationDocumentUrl,
  getBusinessDocumentUrl,
  getAvatarUrl,
} from '@/utils/utils';
import { nodeEnv, vercelEnv } from '@/utils/baseUrl';
import { PDFPreview } from '@/components/PDF/pdfPreview';

function UserDetailContent() {
  const params = useParams();
  const router = useRouter();
  const client = useClient();

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['user', params.id],
    queryFn: async () => {
      const response = await client.get(`/admin/users/${params.id}`);
      return response?.data?.data.user;
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

  if (error || !user) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Users
        </Button>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-900">Failed to load user</h3>
                <p className="text-red-800 text-sm mt-1">
                  {error instanceof Error ? error.message : 'User not found'}
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
          Back to Users
        </Button>
        <div className="flex items-center gap-2">
          {user.active ? (
            <Badge className="bg-green-100 text-green-800">Active</Badge>
          ) : (
            <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
          )}
        </div>
      </div>

      {/* User Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {user.avatarUrl ? (
              <Image
                src={
                  nodeEnv === 'production' || vercelEnv === 'production'
                    ? (user.avatarUrl as string)
                    : getAvatarUrl(user.avatarUrl)
                }
                width={128}
                height={128}
                alt="Profile Picture"
                className="h-20 w-20 rounded-full object-cover"
              />
            ) : (
              <div className="h-20 w-20 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold text-lg">
                {user.name?.charAt(0)}
                {user.surname?.charAt(0)}
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">
                {user.name} {user.surname}
              </h1>
              <p className="text-gray-600 mt-1">{user.email}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="outline">{user.role}</Badge>
                <Badge variant="outline">{user.type || 'local'}</Badge>
                {user.isVerified && (
                  <Badge className="bg-blue-100 text-blue-800">Verified</Badge>
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
          <CardDescription>Basic user details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-semibold text-gray-600">First Name</label>
              <p className="text-gray-900 mt-1">{user.name || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">Last Name</label>
              <p className="text-gray-900 mt-1">{user.surname || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">Email Address</label>
              <p className="text-gray-900 mt-1 break-all">{user.email || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">Phone Number</label>
              <p className="text-gray-900 mt-1">{user.phone || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">User ID</label>
              <p className="text-gray-900 mt-1 font-mono text-sm">{user.userId || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">Account Type</label>
              <p className="text-gray-900 mt-1 capitalize">{user.type || '-'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Status */}
      <Card>
        <CardHeader>
          <CardTitle>Account Status</CardTitle>
          <CardDescription>Account verification and activity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-semibold text-gray-600">Status</label>
              <div className="mt-1">
                {user.active ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="text-green-600 font-semibold">Active</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-600 font-semibold">Inactive</span>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">Email Verified</label>
              <div className="mt-1">
                {user.isVerified ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="text-green-600 font-semibold">Verified</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    <span className="text-yellow-600 font-semibold">Pending</span>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">Last Login</label>
              <p className="text-gray-900 mt-1">
                {user.lastLogin
                  ? dayjs(user.lastLogin).format('DD-MM-YYYY HH:mm')
                  : 'Never'}
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">Account Created</label>
              <p className="text-gray-900 mt-1">
                {user.createdAt ? dayjs(user.createdAt).format('DD-MM-YYYY HH:mm') : '-'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role & Permissions */}
      <Card>
        <CardHeader>
          <CardTitle>Role & Permissions</CardTitle>
          <CardDescription>User role and access level</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-600">Role</label>
            <p className="text-gray-900 mt-1 capitalize">{user.role || '-'}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">
              Role determines what actions and features this user can access within the system.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Documents & Verification */}
      {user.UserDocument && (
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Document Preview</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center items-center">
                <div className="relative rounded-md overflow-hidden w-fit">
                  {user.UserDocument.businessDocumentUrl &&
                    (user.UserDocument.businessDocumentUrl?.endsWith('.pdf') ? (
                      <PDFPreview
                        url={
                          nodeEnv === 'production' || vercelEnv === 'production'
                            ? user.UserDocument.businessDocumentUrl
                            : getBusinessDocumentUrl(user.UserDocument.businessDocumentUrl)
                        }
                      />
                    ) : (
                      <Image
                        src={
                          nodeEnv === 'production' || vercelEnv === 'production'
                            ? (user.UserDocument?.businessDocumentUrl as string)
                            : getBusinessDocumentUrl(user.UserDocument?.businessDocumentUrl)
                        }
                        alt="Business Document preview"
                        width={800}
                        height={600}
                        className="object-cover"
                      />
                    ))}

                  {user.UserDocument.affiliationDocumentUrl &&
                    (user.UserDocument.affiliationDocumentUrl.endsWith('.pdf') ? (
                      <iframe
                        src={
                          nodeEnv === 'production' || vercelEnv === 'production'
                            ? (user.UserDocument?.affiliationDocumentUrl as string)
                            : getAffiliationDocumentUrl(user.UserDocument?.affiliationDocumentUrl)
                        }
                        className="w-full h-[600px] mb-4"
                        title="Affiliation Document Preview"
                      />
                    ) : (
                      <Image
                        src={
                          nodeEnv === 'production' || vercelEnv === 'production'
                            ? (user.UserDocument?.affiliationDocumentUrl as string)
                            : getAffiliationDocumentUrl(user.UserDocument?.affiliationDocumentUrl)
                        }
                        alt="Affiliation Document preview"
                        width={800}
                        height={600}
                        className="object-cover"
                      />
                    ))}
                </div>
              </CardContent>
              <CardContent className="flex-col md:flex justify-between">
                <div className="mb-4 md:mb-0 w-full">
                  {user.UserDocument.businessDocumentUrl && (
                    <Button asChild variant="outline" className="mb-4 mr-2">
                      <a
                        href={
                          nodeEnv === 'production' || vercelEnv === 'production'
                            ? user.UserDocument?.businessDocumentUrl
                            : getBusinessDocumentUrl(user.UserDocument?.businessDocumentUrl)
                        }
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download Business Document
                      </a>
                    </Button>
                  )}

                  {user.UserDocument.affiliationDocumentUrl && (
                    <Button asChild variant="outline">
                      <a
                        href={
                          nodeEnv === 'production' || vercelEnv === 'production'
                            ? user.UserDocument?.affiliationDocumentUrl
                            : getAffiliationDocumentUrl(user.UserDocument?.affiliationDocumentUrl)
                        }
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download Affiliation Document
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Document Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Status</span>
                  {user.UserDocument.inReview && user.UserDocument.rejected && (
                    <Badge variant="outline" className="bg-red-100 text-red-800">
                      Rejected
                    </Badge>
                  )}
                  {user.UserDocument.inReview && !user.UserDocument.rejected && (
                    <Badge variant="outline" className="bg-amber-100 text-amber-800">
                      Pending
                    </Badge>
                  )}
                  {!user.UserDocument.inReview && (
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      Approved
                    </Badge>
                  )}
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Document Type</p>
                    <p className="text-sm text-gray-500">
                      {user.UserDocument.docType || 'CAC/Affiliation Document'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Role</p>
                    <p className="text-sm text-gray-500">{user.UserDocument.role}</p>
                  </div>
                </div>
                {user.UserDocument.nin && (
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">NIN</p>
                      <p className="text-sm text-gray-500">{user.UserDocument.nin}</p>
                    </div>
                  </div>
                )}
                {user.UserDocument.cacNumber && (
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">CAC</p>
                      <p className="text-sm text-gray-500">{user.UserDocument.cacNumber}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Affiliated</p>
                    <p className="text-sm text-gray-500">
                      {user.UserDocument.isAffiliated ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {user.UserDocument.reviewNote && (
              <Card>
                <CardHeader>
                  <CardTitle>Review Note</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-gray-900 text-sm">{user.UserDocument.reviewNote}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Activity</CardTitle>
          <CardDescription>User account timeline</CardDescription>
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
                  {user.createdAt ? dayjs(user.createdAt).format('MMMM DD, YYYY HH:mm') : '-'}
                </p>
              </div>
            </div>
            {user.lastLogin && (
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-blue-500 mt-1.5" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Last Login</p>
                  <p className="text-sm text-gray-600">
                    {dayjs(user.lastLogin).format('MMMM DD, YYYY HH:mm')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function UserDetailPage() {
  return <UserDetailContent />;
}