import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function Loading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="mt-2 h-4 w-[350px]" />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <Skeleton className="h-6 w-[200px]" />
            <Skeleton className="mt-2 h-4 w-[150px]" />
          </div>
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-[150px]" />
            <Skeleton className="h-10 w-[120px]" />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div>
                    <Skeleton className="h-5 w-[200px]" />
                    <Skeleton className="mt-1 h-4 w-[150px]" />
                  </div>
                </div>
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
