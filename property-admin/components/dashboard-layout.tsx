'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  FileText,
  LogOut,
  Menu,
  X,
  Shield,
  Home,
  ChevronDown,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-provider';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { useCurrentAdminStore } from '@/store/auth.store';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth();
  const { admin } = useCurrentAdminStore();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [propertiesOpen, setPropertiesOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Reviews', href: '/reviews', icon: FileText },
    {
      name: 'Properties',
      href: '',
      icon: Home,
      submenu: [
        { name: 'Published', href: '/properties' },
        { name: 'Unpublished', href: '/properties/unpublished' },
      ],
    },
    { name: 'Users', href: '/users', icon: Users },
    { name: 'Admins', href: '/admins', icon: Shield },
  ];

  const isPropertiesActive = pathname.startsWith('/properties');

  return (
    <SidebarProvider style={{ overflow: 'hidden' }}>
      <div className="h-[100dvh] bg-gray-50 w-full">
        {/* Mobile menu */}
        {!mobileMenuOpen && (
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-8 w-8" />
          </Button>
        )}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div
              className="h-full w-64 bg-white p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-green-600">
                  Admin Portal
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="space-y-1">
                {navigation.map((item) => (
                  <div key={item.name}>
                    {item.submenu ? (
                      <>
                        <button
                          onClick={() => setPropertiesOpen(!propertiesOpen)}
                          className={`w-full flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                            isPropertiesActive
                              ? 'bg-green-100 text-green-700'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <item.icon className="mr-3 h-5 w-5" />
                          <span className="flex-1 text-left">{item.name}</span>
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${
                              propertiesOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        {propertiesOpen && (
                          <div className="ml-4 space-y-1">
                            {item.submenu.map((subitem) => (
                              <Link
                                key={subitem.name}
                                href={subitem.href}
                                className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                                  pathname === subitem.href
                                    ? 'bg-green-100 text-green-700'
                                    : 'text-gray-700 hover:bg-gray-100'
                                }`}
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {subitem.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                          pathname === item.href
                            ? 'bg-green-100 text-green-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <item.icon className="mr-3 h-5 w-5" />
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>
              <div className="absolute bottom-4 left-0 w-full px-4">
                <Button
                  variant="ghost"
                  className="flex w-full items-center justify-start text-gray-700 hover:bg-gray-100"
                  onClick={logout}
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 ml-0 md:ml-50 h-[100dvh] overflow-y-auto">
          <main className="p-4 pb-10 lg:p-8">{children}</main>
        </div>

        {/* Desktop sidebar */}
        <Sidebar className="hidden lg:flex px-5" variant="sidebar">
          <SidebarHeader className="p-4">
            <h2 className="text-xl font-bold text-green-600">Admin Portal</h2>
            <p className="text-sm text-gray-500">Welcome, {admin?.userName}</p>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <div key={item.name}>
                  {item.submenu ? (
                    <>
                      <SidebarMenuItem>
                        <button
                          onClick={() => setPropertiesOpen(!propertiesOpen)}
                          className={`w-full flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                            isPropertiesActive
                              ? 'bg-green-100 text-green-700'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <item.icon className="mr-3 h-5 w-5" />
                          <span className="flex-1 text-left">{item.name}</span>
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${
                              propertiesOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                      </SidebarMenuItem>
                      {propertiesOpen && (
                        <div className="ml-4 space-y-1">
                          {item.submenu.map((subitem) => (
                            <SidebarMenuItem key={subitem.name}>
                              <SidebarMenuButton
                                asChild
                                isActive={pathname === subitem.href}
                              >
                                <Link
                                  href={subitem.href}
                                  className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                                    pathname === subitem.href
                                      ? 'bg-green-100 text-green-700'
                                      : 'text-gray-700 hover:bg-gray-100'
                                  }`}
                                >
                                  {subitem.name}
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.href}
                      >
                        <Link
                          href={item.href}
                          className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                            pathname === item.href
                              ? 'bg-green-100 text-green-700'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <item.icon />
                          <span>{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                </div>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4">
            <Button
              variant="ghost"
              className="flex w-full items-center justify-start text-gray-700 hover:bg-gray-100"
              onClick={logout}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </Button>
          </SidebarFooter>
        </Sidebar>
      </div>
    </SidebarProvider>
  );
}