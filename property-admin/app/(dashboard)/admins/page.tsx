'use client';
import React, { useState, Suspense } from 'react';
import {
  Search,
  UserPlus,
  MoreHorizontal,
  Shield,
  AlertCircle,
} from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CreateAdminForm } from '@/components/create-admin-form';
import { ConfirmDialog } from '@/components/ui/confirmation-dialog';
import { useQuery } from '@tanstack/react-query';
import { AdminAttr } from '@/interfaces/admin.interface';
import { useClient } from '@/hooks/useClient';
import { useToast } from '@/components/ui/toast';
import dayjs from 'dayjs';
import { Loader2 } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import Pagination from '@/components/pagination';
import { useCurrentAdminStore } from '@/store/auth.store';

function AdminsContent() {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminAttr | null>(null);
  const [actionType, setActionType] = useState<
    'activate' | 'deactivate' | null
  >(null);

  const client = useClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useToast();
  const { admin } = useCurrentAdminStore();

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
    data: { admins = [], meta = { totalPages: 1 } } = {},
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['admins', pageFromUrl, debouncedSearch],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('page', pageFromUrl.toString());
      params.append('limit', '10');
      if (debouncedSearch && debouncedSearch.trim()) {
        params.append('search', debouncedSearch.trim());
      }
      const response = await client.get(
        `/admin/all/${admin.adminId}?${params.toString()}`,
      );
      return response?.data?.data || { admins: [], meta: { totalPages: 1 } };
    },
    refetchOnMount: 'always',
  });

  const increasePage = () =>
    pageFromUrl < meta.totalPages && setPage(pageFromUrl + 1);
  const decreasePage = () => pageFromUrl > 1 && setPage(pageFromUrl - 1);

  const handleActionClick = (
    admin: AdminAttr,
    type: 'activate' | 'deactivate',
  ) => {
    setSelectedAdmin(admin);
    setActionType(type);
    setConfirmOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedAdmin || !actionType) return;

    try {
      const endpoint =
        actionType === 'activate'
          ? `/admin/activate-admin/${selectedAdmin.adminId}`
          : `/admin/diactivate-admin/${selectedAdmin.adminId}`;

      await client.put(endpoint, {});

      addToast({
        title: 'Success',
        description: `Admin has been ${actionType === 'activate' ? 'activated' : 'deactivated'} successfully`,
        type: 'success',
        position: 'bottom-center',
      });

      setConfirmOpen(false);
      setSelectedAdmin(null);
      setActionType(null);
      refetch();
    } catch (error: unknown) {
      console.error(`Failed to ${actionType} admin:`, error);
      addToast({
        title: `Failed to ${actionType} admin`,
        description: 'An error occurred while processing your request',
        type: 'error',
        position: 'top-center',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Management</h1>
        <p className="mt-2 text-gray-600">
          Manage system administrators and their permissions
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <CardTitle>All Administrators</CardTitle>
            <CardDescription>
              Showing {admins.length} administrators
            </CardDescription>
          </div>
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search admins..."
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Admin
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader>
                  <DialogTitle>Create New Admin</DialogTitle>
                  <DialogDescription>
                    Add a new administrator to the system. They will have access
                    to manage users and content.
                  </DialogDescription>
                </DialogHeader>
                <CreateAdminForm onClose={() => setIsOpen(false)} />
              </DialogContent>
            </Dialog>
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
                <TableHead>Last Active</TableHead>
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
              ) : admins && admins.length > 0 ? (
                admins.map((admin: AdminAttr) => (
                  <TableRow key={admin.adminId}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700">
                          <Shield className="h-4 w-4" />
                        </div>
                        {admin.fullName}
                      </div>
                    </TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700"
                      >
                        {admin.isSuperAdmin ? 'Super Admin' : 'Admin'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {admin.active ? (
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
                      {dayjs(admin?.lastLogin).format('DD-MM-YYYY')}
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
                            className="cursor-pointer hover:opacity-50"
                            onClick={() =>
                              router.push(`admins/${admin.adminId}`)
                            }
                          >
                            View details
                          </DropdownMenuItem>
                          {/* <DropdownMenuItem>Edit permissions</DropdownMenuItem> */}
                          {admin.active ? (
                            <DropdownMenuItem
                              className="text-red-500 cursor-pointer hover:opacity-50"
                              onClick={() =>
                                handleActionClick(admin, 'deactivate')
                              }
                            >
                              Deactivate
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              className="text-green-600 cursor-pointer hover:opacity-50"
                              onClick={() =>
                                handleActionClick(admin, 'activate')
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
                    <p className="text-gray-500">No admins found</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {(!isFetching || !isLoading) && admins && admins.length > 0 && (
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
          actionType === 'activate' ? 'Activate admin?' : 'Deactivate admin?'
        }
        description={
          actionType === 'activate'
            ? `This will activate ${selectedAdmin?.fullName} and restore their system access.`
            : `This will deactivate ${selectedAdmin?.fullName} and revoke their system access.`
        }
        confirmText={actionType === 'activate' ? 'Activate' : 'Deactivate'}
        cancelText="Cancel"
        onConfirm={handleConfirmAction}
        icon={<AlertCircle className="h-5 w-5 text-amber-500" />}
      />
    </div>
  );
}

export default function AdminsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
        </div>
      }
    >
      <AdminsContent />
    </Suspense>
  );
}