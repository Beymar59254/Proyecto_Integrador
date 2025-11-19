'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ReceiptText,
  Users,
  BarChart3,
  CheckCircle,
  Settings,
  FileClock,
  LogOut,
  Instagram,
  Facebook,
  Youtube,
  LineChart,
} from 'lucide-react';
import React from 'react';

import { AppLogo } from '@/components/icons';
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import type { NavItem, UserRole } from '@/lib/types';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';

const navItems: NavItem[] = [
  {
    href: '/dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard',
    roles: ['admin', 'manager', 'accountant', 'user', 'auditor'],
  },
  {
    href: '/dashboard/expenses',
    icon: ReceiptText,
    label: 'Gastos',
    roles: ['admin', 'manager', 'accountant', 'user'],
  },
  {
    href: '/dashboard/approvals',
    icon: CheckCircle,
    label: 'Aprobaciones',
    roles: ['admin', 'manager'],
  },
  {
    href: '/dashboard/reports',
    icon: BarChart3,
    label: 'Reportes',
    roles: ['admin', 'manager', 'accountant'],
  },
  {
    href: '/dashboard/optimisation',
    icon: LineChart,
    label: 'Optimización IO',
    roles: ['admin', 'manager'],
  },
  {
    href: '/dashboard/users',
    icon: Users,
    label: 'Usuarios',
    roles: ['admin'],
  },
  {
    href: '/dashboard/settings',
    icon: Settings,
    label: 'Configuración',
    roles: ['admin'],
  },
  {
    href: '/dashboard/audit-log',
    icon: FileClock,
    label: 'Auditoría',
    roles: ['admin', 'auditor'],
  },
];

const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" {...props}>
      <path
        fill="currentColor"
        d="M448 209.9a210.1 210.1 0 0 1 -122.8-39.25V349.38A162.6 162.6 0 1 1 185 188.31V278.2a74.62 74.62 0 1 0 52.23 71.18V0l88 24.18V209.9z"
      />
    </svg>
  );

export function AppSidebar() {
  const pathname = usePathname();
  const [userRole, setUserRole] = React.useState<UserRole | null>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const role = localStorage.getItem('userRole') as UserRole;
      setUserRole(role);
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userRole');
      localStorage.removeItem('userName');
    }
  };

  if (!userRole) {
    // You can return a loader or a placeholder here
    return (
        <div className="hidden border-r bg-muted/40 md:block">
            {/* Skeleton loader can be placed here */}
        </div>
    );
  }

  return (
    <>
      <SidebarHeader className="border-b">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <AppLogo className="h-8 w-8 text-primary" />
          <span className="font-headline text-lg group-data-[collapsible=icon]:hidden">
            SGC_USB
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) =>
            item.roles.includes(userRole) ? (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  className={cn(
                    'justify-start',
                    pathname === item.href && 'font-semibold'
                  )}
                  tooltip={{ children: item.label }}
                >
                  <Link href={item.href}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ) : null
          )}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t flex-col gap-2">
        <div className="flex items-center justify-center gap-2 group-data-[collapsible=icon]:hidden">
            <Button variant="ghost" size="icon" asChild>
                <a href="https://www.facebook.com/usalesianabolivia" target="_blank" rel="noopener noreferrer"><Facebook className="h-4 w-4"/></a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
                <a href="https://www.instagram.com/usalesiana/" target="_blank" rel="noopener noreferrer"><Instagram className="h-4 w-4"/></a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
                <a href="https://www.youtube.com/c/UniversidadSalesianadeBolivia" target="_blank" rel="noopener noreferrer"><Youtube className="h-4 w-4"/></a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
                <a href="https://www.tiktok.com/@usalesiana" target="_blank" rel="noopener noreferrer"><TikTokIcon className="h-4 w-4"/></a>
            </Button>
        </div>
        <Separator className="my-1" />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="justify-start"
              tooltip={{ children: 'Cerrar Sesión' }}
              onClick={handleLogout}
            >
              <Link href="/">
                <LogOut className="h-4 w-4" />
                <span>Cerrar Sesión</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
