import type {Metadata} from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-body' });

export const metadata: Metadata = {
  title: 'Gestion de Costos - Universidad Salesiana de Bolivia',
  description: 'Sistema de gestión de costos para la Universidad Salesiana de Bolivia.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={cn('antialiased font-body', inter.variable)}>{children}</body>
    </html>
  );
}
