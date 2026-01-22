'use client';
import React, { useState, Suspense } from 'react';
import { Search, UserPlus, MoreHorizontal, AlertCircle } from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ConfirmDialog } from '@/components/ui/confirmation-dialog';
import { useQuery } from '@tanstack/react-query';
import { UserAttr } from '@/interfaces/user.interface';
import { useClient } from '@/hooks/useClient';
import { useToast } from '@/components/ui/toast';
import dayjs from 'dayjs';
import { Loader2 } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import Pagination from '@/components/pagination';

function UsersContent() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserAttr | null>(null);
  const [actionType, setActionType] = useState<
    'activate' | 'deactivate' | null
  >(null);

  const client = useClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useToast();

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
    data: { users = [], meta = { totalPages: 1 } } = {},
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['users', pageFromUrl, debouncedSearch],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('page', pageFromUrl.toString());
      params.append('limit', '10');
      if (debouncedSearch && debouncedSearch.trim()) {
        params.append('search', debouncedSearch.trim());
      }
      const response = await client.get(
        `/admin/users/all?${params.toString()}`,
      );
      return response?.data?.data || { users: [], meta: { totalPages: 1 } };
    },
    refetchOnMount: 'always',
  });

  const increasePage = () =>
    pageFromUrl < meta.totalPages && setPage(pageFromUrl + 1);
  const decreasePage = () => pageFromUrl > 1 && setPage(pageFromUrl - 1);

  const handleActionClick = (
    user: UserAttr,
    type: 'activate' | 'deactivate',
  ) => {
    setSelectedUser(user);
    setActionType(type);
    setConfirmOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedUser || !actionType) return;

    try {
      const endpoint =
        actionType === 'activate'
          ? `/admin/activate-user/${selectedUser.userId}`
          : `/admin/diactivate-user/${selectedUser.userId}`;

      await client.put(endpoint, {});

      addToast({
        title: 'Success',
        description: `User has been ${actionType === 'activate' ? 'activated' : 'deactivated'} successfully`,
        type: 'success',
        position: 'bottom-center',
      });

      setConfirmOpen(false);
      setSelectedUser(null);
      setActionType(null);
      refetch();
    } catch (error: unknown) {
      console.error(`Failed to ${actionType} user:`, error);
      addToast({
        title: `Failed to ${actionType} user`,
        description: 'An error occurred while processing your request',
        type: 'error',
        position: 'top-center',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Users</h1>
        <p className="mt-2 text-gray-600">
          Manage system users and their access
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <CardTitle>All Users</CardTitle>
            <CardDescription>Showing {users.length} users</CardDescription>
          </div>
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search users..."
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button className="bg-green-600 hover:bg-green-700">
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <div className="flex justify-center items-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : users && users.length > 0 ? (
                users.map((user: UserAttr) => (
                  <TableRow key={user.userId}>
                    <TableCell className="font-medium">
                      {user.name + ' ' + user.surname}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      {user.active ? (
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800"
                        >
                          Active
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-gray-100 text-gray-800"
                        >
                          Inactive
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {dayjs(user?.createdAt).format('DD-MM-YYYY')}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          className="bg-white border border-[#dddd]"
                          align="end"
                        >
                          <DropdownMenuItem
                            onClick={() => router.push(`users/${user.userId}`)}
                            className="cursor-pointer hover:opacity-50"
                          >
                            View details
                          </DropdownMenuItem>
                          {/* <DropdownMenuItem>Edit user</DropdownMenuItem> */}
                          {user.active ? (
                            <DropdownMenuItem
                              className="text-red-600 cursor-pointer hover:opacity-50"
                              onClick={() =>
                                handleActionClick(user, 'deactivate')
                              }
                            >
                              Deactivate
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              className="text-green-600 cursor-pointer hover:opacity-50"
                              onClick={() =>
                                handleActionClick(user, 'activate')
                              }
                            >
                              Activate
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <p className="text-gray-500">No users found</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {(!isFetching || !isLoading) && users && users.length > 0 && (
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

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={
          actionType === 'activate' ? 'Activate user?' : 'Deactivate user?'
        }
        description={
          actionType === 'activate'
            ? `This will activate ${selectedUser?.name} ${selectedUser?.surname} and restore their system access.`
            : `This will deactivate ${selectedUser?.name} ${selectedUser?.surname} and revoke their system access.`
        }
        confirmText={actionType === 'activate' ? 'Activate' : 'Deactivate'}
        cancelText="Cancel"
        onConfirm={handleConfirmAction}
        icon={<AlertCircle className="h-5 w-5 text-amber-500" />}
      />
    </div>
  );
}

export default function UsersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
        </div>
      }
    >
      <UsersContent />
    </Suspense>
  );
}