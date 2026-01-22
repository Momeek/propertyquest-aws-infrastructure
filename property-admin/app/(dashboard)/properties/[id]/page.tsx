'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  Heart,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Phone,
  Mail,
  Copy,
  Check,
  CheckCircle,
  XCircle,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useClient } from '@/hooks/useClient';
import { nodeEnv, vercelEnv } from '@/utils/baseUrl';
import {
  getErrorMessage,
  isValidationError,
  getValidationErrors,
} from '@/utils/utils';
import { useToast } from '@/components/ui/toast';
import { PropertyAttr } from '@/interfaces/property.interface';
import PropertyGallery from '@/components/ui/propertyGallery';
import PropertyFeatures from '@/components/ui/propertyFeatures';
import PropertyLocation from '@/components/ui/propertyLocation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PropertySkeleton from "@/components/propertySkeletonLoader";
import { UserAttr } from '@/interfaces/user.interface';
import { JSONSafeParse, formatAmount, getAvatarUrl } from '@/utils/utils';
import LazyImage from '@/components/ui/lazyImage';


export default function PropertyDetailPage() {
  const { id } = useParams();
  const client = useClient();
  const { addToast } = useToast();
  const [reviewNote, setReviewNote] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const { data: property, refetch, isFetching, isLoading } = useQuery<PropertyAttr, AxiosError>({
    queryKey: ['properties', id],
    queryFn: () =>
      client.get(`/admin/property/${id}`).then((res) => res.data.data.property),
    refetchOnMount: 'always',
    enabled: !!id,
    initialData: {} as PropertyAttr,
  });

  useEffect(() => {
    if (property?.reviewNote) {
      setReviewNote(property.reviewNote);
    }
  }, [property?.reviewNote]);

  const professionalInfo = JSONSafeParse(
    property?.User?.professionalInfo
  ) as UserAttr["professionalInfo"];
  const details = JSONSafeParse(property?.details) as PropertyAttr["details"];
  const media = JSONSafeParse(property?.media) as PropertyAttr["media"];
  const location = JSONSafeParse(
    property?.location
  ) as PropertyAttr["location"];
  const pricing = JSONSafeParse(property?.pricing) as PropertyAttr["pricing"];

  const likeCount = Array.isArray(property?.LikedProperties)
    ? property.LikedProperties.length
    : 0;

  const handleCopyPropertyId = async () => {
    try {
      await navigator.clipboard.writeText(property?.propertyId as string);
      setCopied(true);
      addToast({
        title: "Copied!",
        description: "Property ID copied to clipboard",
        type: "success",
        position: "bottom-center",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy: ", error);
      addToast({
        title: "Failed to copy",
        description: "Could not copy property ID",
        type: "error",
        position: "bottom-center",
      });
    }
  };

  const handlePublish = async () => {
    if (!id) return;
    const confirmed = window.confirm(
      'Are you sure you want to publish this property?',
    );
    if (!confirmed) return;
    try {
      await client.put(`/admin/property/publish/${property?.propertyId}`, {});
      refetch();

      addToast({
        title: 'Property published successfully.',
        description: '',
        type: 'success',
        position: 'bottom-center',
      });
    } catch (error: unknown) {
      console.error('Error publishing property:', error);
      const title = getErrorMessage(error);
      addToast({
        title: 'Failed to publish property',
        description: isValidationError(title)
          ? getValidationErrors(error)
          : `code: ${title}`,
        type: 'error',
        position: 'top-center',
      });
    }
  };

  const handleUnpublish = async () => {
    if (!id) return;
    if (!reviewNote.trim()) {
      window.alert(
        'Please add a review note before unpublishing this property.',
      );
      return;
    }
    const confirmed = window.confirm(
      'Are you sure you want to unpublish this property?',
    );
    if (!confirmed) return;
    try {
      await client.put(`/admin/property/unpublish/${property?.propertyId}`, {});
      refetch();
      addToast({
        title: 'Property unpublished successfully.',
        description: '',
        type: 'success',
        position: 'bottom-center',
      });
    } catch (error: unknown) {
      console.error('Error unpublishing property:', error);
      const title = getErrorMessage(error);
      addToast({
        title: 'Failed to unpublish property',
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
      await client.put(`/admin/property/note/${property?.propertyId}`, {
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

  if (isLoading || isFetching) {
    return <PropertySkeleton />;
  }

  if (!property) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
        {/* Back Button */}
        <div className="bg-white px-6">
          <div className="container py-4">
            <Link
              href={`/properties`}
              className="inline-flex items-center text-gray-600 hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to listings
            </Link>
          </div>
        </div>

        {/* Property Header */}
        <div className="bg-white border-b border-[#b6b3b3] px-6">
          <div className="container py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  {details?.title}
                </h1>
                <div className="flex items-center text-gray-500 mt-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  {location?.city}, {location?.neighborhood}
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  Property ID:
                  <span className="font-mono ml-2">{property?.propertyId}</span>
                  <button
                    onClick={handleCopyPropertyId}
                    className="ml-2 p-1 hover:bg-gray-100 rounded"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4 text-gray-600" />
                    )}
                  </button>
                </div>
                <div className="mt-2">
                  <Badge
                    variant={property?.active ? "default" : "secondary"}
                    className={
                      property?.active
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                    }
                  >
                    {property?.active ? "Published" : "Not published"}
                  </Badge>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-3xl font-bold text-[#16a249]">
                  {formatAmount(
                    (pricing?.price || pricing?.rentPrice) as number
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="py-8 px-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Property Details */}
            <div className="lg:col-span-2">
              {/* Property Gallery */}
              <PropertyGallery
                images={media?.images || []}
                hasVideo={!!media?.videoTourUrl}
              />

              {/* Property Details Tabs */}
              <div className="mt-8 bg-white rounded-lg border border-[#b6b3b3] overflow-hidden">
                <Tabs defaultValue="overview">
                  <TabsList className="w-full border-b rounded-none bg-white p-0">
                    <TabsTrigger
                      value="overview"
                      className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#16a249] data-[state=active]:shadow-none py-4"
                    >
                      Overview
                    </TabsTrigger>
                    <TabsTrigger
                      value="features"
                      className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#16a249] data-[state=active]:shadow-none py-4"
                    >
                      Features
                    </TabsTrigger>
                    <TabsTrigger
                      value="location"
                      className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#16a249] data-[state=active]:shadow-none py-4"
                    >
                      Location
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="p-6">
                    <div className="space-y-6">
                      <div className="flex flex-wrap gap-6">
                        <div className="flex items-center">
                          <Bed className="h-5 w-5 mr-2 text-gray-500" />
                          <div>
                            <div className="font-medium">
                              {details?.bedrooms === "0"
                                ? "Studio"
                                : details?.bedrooms}
                            </div>
                            <div className="text-sm text-gray-500">
                              {`${details?.bedrooms !== "0" ? "Bedrooms" : ""}`}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Bath className="h-5 w-5 mr-2 text-gray-500" />
                          <div>
                            <div className="font-medium">
                              {details?.bathrooms}
                            </div>
                            <div className="text-sm text-gray-500">
                              Bathrooms
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Maximize className="h-5 w-5 mr-2 text-gray-500" />
                          <div>
                            <div className="font-medium">
                              {details?.area_sq_ft}
                            </div>
                            <div className="text-sm text-gray-500">Sq Ft</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                          <div>
                            <div className="font-medium">
                              {details?.yearBuilt || "N/A"}
                            </div>
                            <div className="text-sm text-gray-500">
                              Year Built
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          Description
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                          {details?.description}
                        </p>
                      </div>

                      {/* Additional Listing Info */}
                      <div className="pt-6 border-t border-gray-200">
                        <h3 className="text-lg font-semibold mb-4">
                          Listing Information
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Status</p>
                            <p className="font-medium capitalize">
                              {details?.status?.replace(/_/g, " ")}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Type</p>
                            <p className="font-medium capitalize">
                              {details?.listingType}
                            </p>
                          </div>
                          {pricing?.isFeatured && (
                            <div>
                              <p className="text-sm text-gray-500">Featured</p>
                              <p className="font-medium text-[#16a249]">Yes</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="features" className="p-6">
                    <PropertyFeatures features={details?.features} />
                  </TabsContent>

                  <TabsContent value="location" className="p-6">
                    <PropertyLocation location={location} />
                  </TabsContent>
                </Tabs>
              </div>

              {/* Review Notes Section */}
              <Card className="mt-8 bg-white rounded-lg border border-[#b6b3b3]">
                <CardHeader>
                  <CardTitle>Review Notes</CardTitle>
                  <CardDescription>
                    Add notes about this property
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Enter your review notes here..."
                    className="min-h-[120px]"
                    value={reviewNote}
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
            </div>

            {/* Right Column - Summary & Stats */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-[#b6b3b3] p-6 sticky top-20">
                <h3 className="font-semibold text-lg mb-6">Property Summary</h3>

                {/* Key Stats */}
                <div className="space-y-4 pb-6 border-b border-[#b6b3b3]">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Price</p>
                    <p className="text-2xl font-bold text-[#16a249]">
                      {formatAmount(
                        (pricing?.price || pricing?.rentPrice) as number
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">Bedrooms</p>
                    <p className="font-semibold">
                      {details?.bedrooms === "0"
                        ? "Studio"
                        : `${details?.bedrooms} Bed`}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">Bathrooms</p>
                    <p className="font-semibold">{details?.bathrooms} Bath</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">Area</p>
                    <p className="font-semibold">{details?.area_sq_ft} Sq Ft</p>
                  </div>
                </div>

                {/* Likes Stats */}
                <div className="py-4 space-y-3 border-b border-[#b6b3b3]">
                  <h4 className="font-medium">Engagement</h4>
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-[#16a249]" 
                      color={likeCount ? "#16a249" : "#cccc"}
                      fill={likeCount ? "#16a249" : "#ffffff"}
                    />
                    <span className="text-sm">
                      {likeCount}{" "}
                      likes
                    </span>
                  </div>
                </div>

                {/* Publish/Unpublish Buttons */}
                <div className="py-4 space-y-3 border-b border-[#b6b3b3]">
                  <h4 className="font-medium">Actions</h4>
                  {property?.active ? (
                    <Button
                      variant="outline"
                      className="w-full text-red-600 hover:text-red-700 cursor-pointer"
                      onClick={handleUnpublish}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Unpublish
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full text-green-600 hover:text-green-700 cursor-pointer"
                      onClick={handlePublish}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Publish
                    </Button>
                  )}
                </div>

                {/* Agent Info */}
                {property?.User && (
                  <>
                    <div className="pt-6">
                      <h4 className="font-medium mb-4">Listed by</h4>
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 rounded-full overflow-hidden">
                          <LazyImage
                            src={
                              vercelEnv === "production" ||
                              nodeEnv === "production"
                                ? (property?.User?.avatarUrl as string)
                                : getAvatarUrl(
                                    property?.User?.avatarUrl as string
                                  ) ?? "/user.jpg"
                            }
                            alt="user-image"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm">
                            {property?.User?.name} {property?.User?.surname}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {professionalInfo?.company || "PropertyQuest"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-gray-50 rounded-md space-y-2">
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{property?.User?.phone}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Mail className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="break-all">
                          {property?.User?.email}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}