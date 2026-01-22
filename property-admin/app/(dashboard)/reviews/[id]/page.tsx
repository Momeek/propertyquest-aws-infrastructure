'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Download,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  FileText,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { UserDocumentAttr } from '@/interfaces/user.interface';
import { useClient } from '@/hooks/useClient';
import dayjs from 'dayjs';
import {
  getAffiliationDocumentUrl,
  getBusinessDocumentUrl,
} from '@/utils/utils';
import { nodeEnv, vercelEnv } from '@/utils/baseUrl';
import { PDFPreview } from '@/components/PDF/pdfPreview';
import {
  getErrorMessage,
  isValidationError,
  getValidationErrors,
} from '@/utils/utils';
import { useToast } from '@/components/ui/toast';

export default function ReviewDetailPage() {
  const { id } = useParams();
  const client = useClient();
  const { addToast } = useToast();
  const [reviewNote, setReviewNote] = useState<string>('');

  const { data: document, refetch } = useQuery<UserDocumentAttr, AxiosError>({
    queryKey: ['docs-id', id],
    queryFn: () =>
      client.get(`/admin/user-docs/${id}`).then((res) => res.data.data.doc),
    refetchOnMount: 'always',
    enabled: !!id,
  });

  const handleApprove = async () => {
    if (!id) return;
    const confirmed = window.confirm(
      'Are you sure you want to approve this document?',
    );
    if (!confirmed) return;
    try {
      await client.post(
        `/admin/user-docs/${document?.userDocumentId}/approve`,
        {
          inReview: false,
        },
      );
      refetch();

      addToast({
        title: 'Document approved successfully.',
        description: '',
        type: 'success',
        position: 'bottom-center',
      });
    } catch (error: unknown) {
      console.error('Error approving document:', error);
      const title = getErrorMessage(error);
      addToast({
        title: 'Failed to approve document',
        description: isValidationError(title)
          ? getValidationErrors(error)
          : `code: ${title}`,
        type: 'error',
        position: 'top-center',
      });
    }
  };

  const handleReject = async () => {
    if (!id) return;
    if (!reviewNote.trim()) {
      window.alert('Please add a review note before rejecting.');
      return;
    }
    const confirmed = window.confirm(
      'Are you sure you want to reject this document?',
    );
    if (!confirmed) return;
    try {
      await client.post(`/admin/user-docs/${document?.userDocumentId}/reject`, {
        rejected: true,
      });
      refetch();
      addToast({
        title: 'Document rejected successfully.',
        description: '',
        type: 'success',
        position: 'bottom-center',
      });
    } catch (error: unknown) {
      console.error('Error rejecting document:', error);
      const title = getErrorMessage(error);
      addToast({
        title: 'Failed to reject document',
        description: isValidationError(title)
          ? getValidationErrors(error)
          : `code: ${title}`,
        type: 'error',
        position: 'top-center',
      });
    }
  };

  const handleSaveNotes = async () => {
    if (!id) return;
    try {
      await client.post(`/admin/user-docs/${document?.userDocumentId}/note`, {
        reviewNote: reviewNote,
      });
      refetch();
      addToast({
        title: 'Review notes saved successfully.',
        description: '',
        type: 'success',
        position: 'bottom-center',
      });
    } catch (error: unknown) {
      console.error('Error saving review notes:', error);
      const title = getErrorMessage(error);
      addToast({
        title: 'Failed to save review notes',
        description: isValidationError(title)
          ? getValidationErrors(error)
          : `code: ${title}`,
        type: 'error',
        position: 'top-center',
      });
    }
  };

  return (
    <div className="space-y-6 pb-5">
      <div className="flex flex-col gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/reviews">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-md md:text-3xl font-bold text-gray-900">
            Document Review: {id}
          </h1>
          <p className="mt-1 text-gray-600">
            Review and process this document submission
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Document Preview</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center items-center">
              <div className="relative rounded-md overflow-hidden w-fit">
                {document?.businessDocumentUrl &&
                  (document?.businessDocumentUrl?.endsWith('.pdf') ? (
                    <PDFPreview
                      url={
                        nodeEnv === 'production' || vercelEnv === 'production'
                          ? document.businessDocumentUrl
                          : getBusinessDocumentUrl(document.businessDocumentUrl)
                      }
                    />
                  ) : (
                    <Image
                      src={
                        nodeEnv === 'production' || vercelEnv === 'production'
                          ? (document?.businessDocumentUrl as string)
                          : getBusinessDocumentUrl(
                              document?.businessDocumentUrl,
                            )
                      }
                      alt="Document preview"
                      width={800}
                      height={600}
                      className="object-cover"
                    />
                  ))}

                {document?.affiliationDocumentUrl &&
                  (document?.affiliationDocumentUrl.endsWith('.pdf') ? (
                    <iframe
                      src={
                        nodeEnv === 'production' || vercelEnv === 'production'
                          ? (document?.affiliationDocumentUrl as string)
                          : getAffiliationDocumentUrl(
                              document?.affiliationDocumentUrl,
                            )
                      }
                      className="w-full h-full mb-4"
                      title="Affiliation Document Preview"
                    ></iframe>
                  ) : (
                    <Image
                      src={
                        nodeEnv === 'production' || vercelEnv === 'production'
                          ? (document?.affiliationDocumentUrl as string)
                          : getAffiliationDocumentUrl(
                              document?.affiliationDocumentUrl,
                            )
                      }
                      alt="Document preview"
                      width={800}
                      height={600}
                      className="object-cover"
                    />
                  ))}
              </div>
            </CardContent>
            <CardFooter className="flex-col md:flex justify-between">
              <div className="mb-4 md:mb-0 w-full">
                {document?.businessDocumentUrl && (
                  <Button asChild variant="outline" className="mb-4 mr-2">
                    <a
                      href={
                        nodeEnv === 'production' || vercelEnv === 'production'
                          ? document?.businessDocumentUrl
                          : getBusinessDocumentUrl(
                              document?.businessDocumentUrl,
                            )
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

                {document?.affiliationDocumentUrl && (
                  <Button asChild variant="outline">
                    <a
                      href={
                        nodeEnv === 'production' || vercelEnv === 'production'
                          ? document?.affiliationDocumentUrl
                          : getAffiliationDocumentUrl(
                              document?.affiliationDocumentUrl,
                            )
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
              <div className="flex space-x-2 w-full">
                <Button
                  variant="outline"
                  className="text-green-600 hover:text-green-700 cursor-pointer"
                  onClick={handleApprove}
                  disabled={!document?.inReview || document?.rejected}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </Button>
                <Button
                  variant="outline"
                  className="text-red-600 hover:text-red-700 cursor-pointer"
                  onClick={handleReject}
                  disabled={!document?.inReview || document?.rejected}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              </div>
            </CardFooter>
          </Card>

          {document?.inReview && (
            <Card>
              <CardHeader>
                <CardTitle>Review Notes</CardTitle>
                <CardDescription>
                  Add notes about this document review
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Enter your review notes here..."
                  className="min-h-[120px]"
                  value={document?.reviewNote || reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                />
              </CardContent>
              <CardFooter>
                <Button
                  className="ml-auto bg-green-600 hover:bg-green-700 cursor-pointer"
                  onClick={handleSaveNotes}
                  disabled={!reviewNote.trim()}
                >
                  Save Notes
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Document Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">
                  Status
                </span>
                {document?.inReview && document?.rejected && (
                  <Badge variant="outline" className="bg-red-100 text-red-800">
                    Rejected
                  </Badge>
                )}
                {document?.inReview && !document?.rejected && (
                  <Badge
                    variant="outline"
                    className="bg-amber-100 text-amber-800"
                  >
                    Pending
                  </Badge>
                )}
                {!document?.inReview && (
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-800"
                  >
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
                    {document?.docType || 'CAC/Affiliation Document'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">Role</p>
                  <p className="text-sm text-gray-500">{document?.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">NIN</p>
                  <p className="text-sm text-gray-500">{document?.nin}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">CAC</p>
                  <p className="text-sm text-gray-500">{document?.cacNumber}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">Submitted Date</p>
                  <p className="text-sm text-gray-500">
                    {dayjs(document?.createdAt).format('DD-MM-YYYY')}
                  </p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">Submitted By</p>
                  <p className="text-sm text-gray-500">
                    {document?.User?.name + ' ' + document?.User?.surname}
                  </p>
                  <p className="text-sm text-gray-500">
                    {document?.User?.email}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Review History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 h-2 w-2 rounded-full bg-gray-300"></div>
                  <div>
                    <p className="text-sm font-medium">Document submitted</p>
                    <p className="text-xs text-gray-500">
                      {dayjs(document?.createdAt).format('DD-MM-YYYY')} at{' '}
                      {dayjs(document?.createdAt).format('h:mm A')}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
