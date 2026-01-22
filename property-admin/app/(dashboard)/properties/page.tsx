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
// import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { useClient } from '@/hooks/useClient';
import dayjs from 'dayjs';
import { Loader2 } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import Pagination from '@/components/pagination';
import { PropertyAttr } from '@/interfaces/property.interface';
import {
  JSONSafeParse,
  getPropertyImagesUrl,
  formatAmount,
} from '@/utils/utils';
import { nodeEnv, vercelEnv } from '@/utils/baseUrl';
import LazyImage from '@/components/ui/lazyImage';
import { Badge } from '@/components/ui/badge';

function PropertiesContent() {
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
    data: { properties = [], meta = { totalPages: 1 } } = {},
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['properties', pageFromUrl, debouncedSearch],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('page', pageFromUrl.toString());
      params.append('limit', '10');
      if (debouncedSearch && debouncedSearch.trim()) {
        params.append('search', debouncedSearch.trim());
      }
      const response = await client.get(
        `/admin/property/published?${params.toString()}`,
      );
      return (
        response?.data?.data || { properties: [], meta: { totalPages: 1 } }
      );
    },
    refetchOnMount: 'always',
  });

  const increasePage = () =>
    pageFromUrl < meta.totalPages && setPage(pageFromUrl + 1);
  const decreasePage = () => pageFromUrl > 1 && setPage(pageFromUrl - 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Property Reviews</h1>
        <p className="mt-2 text-gray-600">
          Manage and process pending property reviews
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <CardTitle>All Properties</CardTitle>
            <CardDescription>
              Showing {properties.length} properties
            </CardDescription>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search properties..."
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
                <TableHead>Property</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Listed Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Active</TableHead>
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
              ) : properties && properties.length > 0 ? (
                properties.map((property: PropertyAttr) => {
                  const details = JSONSafeParse(
                    property?.details,
                  ) as PropertyAttr['details'];
                  const media = JSONSafeParse(
                    property.media,
                  ) as PropertyAttr['media'];
                  const location = JSONSafeParse(
                    property.location,
                  ) as PropertyAttr['location'];
                  const pricing = JSONSafeParse(
                    property.pricing,
                  ) as PropertyAttr['pricing'];

                  const isFeaturedImage = media?.images?.find(
                    (img) => img.isFeatured === true,
                  );

                  return (
                    <TableRow key={property.propertyId}>
                      <TableCell>
                        {property?.User?.name + ' ' + property?.User?.surname}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 rounded-md overflow-hidden">
                            <LazyImage
                              src={
                                vercelEnv === 'production' ||
                                nodeEnv === 'production'
                                  ? (isFeaturedImage?.url as string)
                                  : (getPropertyImagesUrl(
                                      isFeaturedImage?.url as string,
                                    ) ?? '/placeholder.svg')
                              }
                              alt="property-image"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{details?.title}</p>
                            <p className="text-sm text-gray-500">
                              {location?.city}, {location?.neighborhood}
                            </p>
                            {pricing?.isFeatured && (
                              <Badge variant="secondary" className="mt-1">
                                Featured
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {formatAmount(
                              (pricing?.price || pricing?.rentPrice) as number,
                            )}
                          </p>
                          <p className="text-sm text-gray-500">
                            {details?.listingType}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {dayjs(property.createdAt).format('DD-MM-YYYY')}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            details?.status === 'ready'
                              ? 'default'
                              : details?.status === 'under_construction'
                                ? 'outline'
                                : 'secondary'
                          }
                          className={
                            details?.status === 'ready'
                              ? 'bg-green-100 text-green-800 hover:bg-green-100'
                              : details?.status === 'under_construction'
                                ? 'bg-amber-100 text-amber-800 hover:bg-amber-100'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-100'
                          }
                        >
                          {details?.status === 'ready' && 'Ready'}
                          {details?.status === 'under_construction' &&
                            'Under Construction'}
                          {details?.status === 'offPlan' && 'Off Plan'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={property?.active ? 'default' : 'secondary'}
                          className={
                            property?.active
                              ? 'bg-green-100 text-green-800 hover:bg-green-100'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-100'
                          }
                        >
                          {property?.active ? 'Published' : 'Not published'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="icon" asChild>
                            <Link href={`/properties/${property.propertyId}`}>
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <p className="text-gray-500">No property found</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {(!isFetching || !isLoading) &&
            properties &&
            properties.length > 0 && (
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

export default function PropertiesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
        </div>
      }
    >
      <PropertiesContent />
    </Suspense>
  );
}
