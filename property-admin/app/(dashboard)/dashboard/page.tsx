'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, UserX, FileCheck, FileX, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { UserAttr } from '@/interfaces/user.interface';
import { UserDocumentAttr } from '@/interfaces/user.interface';
import { useClient } from '@/hooks/useClient';
import { PropertyAttr } from '@/interfaces/property.interface';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function DashboardPage() {
  const client = useClient();

  const { data: users } = useQuery<UserAttr[], AxiosError>({
    queryKey: ['users'],
    queryFn: () =>
      client.get('/admin/users/all').then((res) => res.data.data.users),
    refetchOnMount: 'always',
    initialData: [],
  });

  const { data: documents } = useQuery<UserDocumentAttr[], AxiosError>({
    queryKey: ['docs'],
    queryFn: () =>
      client.get('/admin/user-docs/all').then((res) => res.data.data.docs),
    refetchOnMount: 'always',
    initialData: [],
  });

  const { data: properties } = useQuery<PropertyAttr[], AxiosError>({
    queryKey: ['properties'],
    queryFn: () =>
      client.get('/admin/property/all').then((res) => res.data.data.properties),
    refetchOnMount: 'always',
    initialData: [],
  });

  const activeUsers = users.filter((user) => user.active).length;
  const inactiveUsers = users.filter((user) => !user.active).length;

  const pendingReviews = documents.filter(
    (doc) => doc.inReview && !doc?.rejected,
  ).length;
  const approvedDocuments = documents.filter((doc) => !doc.inReview).length;
  const rejectedDocuments = documents.filter(
    (doc) => doc.rejected && doc.inReview,
  ).length;

  const activeProperties = properties.filter(
    (property) => property.active,
  ).length;
  const inactiveProperties = properties.filter(
    (property) => !property.active,
  ).length;

  // Chart data
  const userTrendData = [
    { name: 'Active', value: activeUsers },
    { name: 'Inactive', value: inactiveUsers },
  ];

  const documentStatusData = [
    { name: 'Approved', value: approvedDocuments, color: '#3b82f6' },
    { name: 'Pending', value: pendingReviews, color: '#f59e0b' },
    { name: 'Rejected', value: rejectedDocuments, color: '#ef4444' },
  ];

  const propertyData = [
    { name: 'Published', value: activeProperties },
    { name: 'Unpublished', value: inactiveProperties },
  ];

  const stats = [
    {
      title: 'Active Users',
      value: activeUsers.toString(),
      icon: UserCheck,
      color: 'text-green-500 bg-green-100',
    },
    {
      title: 'Inactive Users',
      value: inactiveUsers.toString(),
      icon: UserX,
      color: 'text-red-500 bg-red-100',
    },
    {
      title: 'Pending Reviews',
      value: pendingReviews.toString(),
      icon: Clock,
      color: 'text-amber-500 bg-amber-100',
    },
    {
      title: 'Approved Documents',
      value: approvedDocuments.toString(),
      icon: FileCheck,
      color: 'text-blue-500 bg-blue-100',
    },
    {
      title: 'Rejected Documents',
      value: rejectedDocuments.toString(),
      icon: FileX,
      color: 'text-purple-500 bg-purple-100',
    },
    {
      title: 'Published Properties',
      value: activeProperties.toString(),
      icon: Users,
      color: 'text-cyan-500 bg-cyan-100',
    },
    {
      title: 'Unpublished Properties',
      value: inactiveProperties.toString(),
      icon: Users,
      color: 'text-gray-500 bg-gray-100',
    },
  ];

  return (
    <div className="space-y-6 pb-5 p-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Overview of your document review system
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="overflow-hidden hover:shadow-lg transition-shadow"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`rounded-full p-2 ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* User Status Bar */}
        <Card>
          <CardHeader>
            <CardTitle>User Status Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#4AD577" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Document Status Pie */}
        <Card>
          <CardHeader>
            <CardTitle>Document Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={documentStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {documentStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Property and Document Summary */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Property Status Bar */}
        <Card>
          <CardHeader>
            <CardTitle>Property Listing Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={propertyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#06b6d4" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Published (Active)</span>
                <span className="font-bold text-cyan-600">
                  {activeProperties} properties
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Unpublished (Inactive)</span>
                <span className="font-bold text-gray-500">
                  {inactiveProperties} properties
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Document Processing Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Document Processing Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Documents</span>
                <span className="text-2xl font-bold">{documents.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Approval Rate</span>
                <span className="text-2xl font-bold text-green-500">
                  {documents.length > 0
                    ? ((approvedDocuments / documents.length) * 100).toFixed(1)
                    : '0'}
                  %
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Rejection Rate</span>
                <span className="text-2xl font-bold text-red-500">
                  {documents.length > 0
                    ? ((rejectedDocuments / documents.length) * 100).toFixed(1)
                    : '0'}
                  %
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Pending Rate</span>
                <span className="text-2xl font-bold text-amber-500">
                  {documents.length > 0
                    ? ((pendingReviews / documents.length) * 100).toFixed(1)
                    : '0'}
                  %
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}