'use client';

import Link from 'next/link';
import {
  CircleUser,
  LogOut,
  Menu,
  Search,
  Settings,
  User,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { checkSystemStatusAction } from '@/app/actions';

function SystemStatusIndicator() {
  const [status, setStatus] = useState<'operational' | 'outage' | 'checking'>('checking');

  useEffect(() => {
    const interval = setInterval(() => {
        setStatus('checking');
        checkSystemStatusAction().then(result => {
            setStatus(result.status);
        });
    }, 30000); // Check every 30 seconds

    // Initial check
    checkSystemStatusAction().then(result => {
        setStatus(result.status);
    });

    return () => clearInterval(interval);
  }, []);

  const statusConfig = {
    checking: {
      color: 'bg-yellow-500 animate-pulse',
      tooltip: 'Verificando estado del sistema...',
    },
    operational: {
      color: 'bg-green-500',
      tooltip: 'Sistema Operacional',
    },
    outage: {
      color: 'bg-red-500',
      tooltip: 'Interrupción del Servicio',
    },
  };

  return (
    <div className="group relative flex items-center">
      <div className={cn("h-3 w-3 rounded-full transition-colors", statusConfig[status].color)} />
      <div className="absolute -top-8 -right-2 w-max scale-0 rounded bg-foreground px-2 py-1 text-xs text-background opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100">
        {statusConfig[status].tooltip}
      </div>
    </div>
  );
}


export function Header() {
  const { toggleSidebar, isMobile } = useSidebar();
  const [userName, setUserName] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserName(localStorage.getItem('userName'));
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userRole');
      localStorage.removeItem('userName');
    }
  };

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
      {isMobile && (
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={toggleSidebar}
        >
          <Menu className="h-4 w-4" />
          <span className="sr-only">Alternar Menú</span>
        </Button>
      )}
      <div className="w-full flex-1">
        <form>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar gastos..."
              className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
            />
          </div>
        </form>
      </div>
       <div className="flex items-center gap-4">
        <SystemStatusIndicator />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Alternar menú de usuario</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{userName || 'Mi Cuenta'}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>Configuración</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="#">
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild onClick={handleLogout}>
              <Link href="/">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar Sesión</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
       </div>
    </header>
  );
}
