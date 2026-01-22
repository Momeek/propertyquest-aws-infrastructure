'use client';
import React, { Suspense } from 'react';
import Link from 'next/link';
import { Eye, Search } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { UserDocumentAttr } from '@/interfaces/user.interface';
import { useClient } from '@/hooks/useClient';
import dayjs from 'dayjs';
import { Loader2 } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import Pagination from '@/components/pagination';

function ReviewsContent() {
  const client = useClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
  const searchFromUrl = searchParams.get('search') || '';
  const debouncedSearch = useDebounce(searchFromUrl, 600);

  const setPage = (newPage: number) => {
    const params = new URLSearchParams();
    params.append('page', newPage.toString());
    params.append('limit', '10');
    if (searchFromUrl && searchFromUrl.trim()) {
      params.append('search', searchFromUrl.trim());
    }
    router.push(`?${params.toString()}`);
  };

  const setSearch = (newSearch: string) => {
    const params = new URLSearchParams();
    params.append('page', '1');
    params.append('limit', '10');
    if (newSearch && newSearch.trim()) {
      params.append('search', newSearch.trim());
    }
    router.push(`?${params.toString()}`);
  };

  const {
    data: { docs = [], meta = { totalPages: 1 } } = {},
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['docs', pageFromUrl, debouncedSearch],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('page', pageFromUrl.toString());
      params.append('limit', '10');
      if (debouncedSearch && debouncedSearch.trim()) {
        params.append('search', debouncedSearch.trim());
      }
      const response = await client.get(
        `/admin/user-docs/all?${params.toString()}`,
      );
      return response?.data?.data || { docs: [], meta: { totalPages: 1 } };
    },
    refetchOnMount: 'always',
  });

  const increasePage = () =>
    pageFromUrl < meta.totalPages && setPage(pageFromUrl + 1);
  const decreasePage = () => pageFromUrl > 1 && setPage(pageFromUrl - 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Document Reviews</h1>
        <p className="mt-2 text-gray-600">
          Manage and process pending document reviews
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <CardTitle>All Documents</CardTitle>
            <CardDescription>Showing {docs.length} documents</CardDescription>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search documents..."
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Document Type</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>CAC No</TableHead>
                <TableHead>NIN</TableHead>
                <TableHead>Submitted Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8}>
                    <div className="flex justify-center items-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : docs && docs.length > 0 ? (
                docs.map((review: UserDocumentAttr) => (
                  <TableRow key={review.userDocumentId}>
                    <TableCell>
                      {review?.User?.name + ' ' + review?.User?.surname}
                    </TableCell>
                    <TableCell>
                      {review?.docType || 'CAC/Affiliation Document'}
                    </TableCell>
                    <TableCell>{review?.role}</TableCell>
                    <TableCell>{review?.cacNumber}</TableCell>
                    <TableCell>{review?.nin}</TableCell>
                    <TableCell>
                      {dayjs(review.createdAt).format('DD-MM-YYYY')}
                    </TableCell>
                    <TableCell>
                      {review?.inReview && review?.rejected && (
                        <Badge
                          variant="outline"
                          className="bg-red-100 text-red-800"
                        >
                          Rejected
                        </Badge>
                      )}
                      {review?.inReview && !review?.rejected && (
                        <Badge
                          variant="outline"
                          className="bg-amber-100 text-amber-800"
                        >
                          Pending
                        </Badge>
                      )}
                      {!review?.inReview && (
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800"
                        >
                          Approved
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="icon" asChild>
                          <Link href={`/reviews/${review.userId}`}>
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <p className="text-gray-500">No documents found</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {(!isFetching || !isLoading) && docs && docs.length > 0 && (
            <div className="flex justify-center pt-6">
              <Pagination
                currentPage={pageFromUrl}
                totalPages={meta.totalPages}
                increasePage={increasePage}
                decreasePage={decreasePage}
                onPageChange={(page) => {
                  setPage(page);
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function ReviewsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
        </div>
      }
    >
      <ReviewsContent />
    </Suspense>
  );
}