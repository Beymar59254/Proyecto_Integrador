import type { LucideIcon } from 'lucide-react';

export type UserRole = 'admin' | 'manager' | 'accountant' | 'user' | 'auditor';

export type UserStatus = 'active' | 'inactive';

export type ExpenseStatus = 'approved' | 'pending' | 'rejected' | 'draft';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  department: string;
  sede: string;
  status: UserStatus;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  status: ExpenseStatus;
  date: string;
  category: string;
  department: string;
  sede: string;
  user: string;
  receiptUrl?: string;
}

export interface Department {
  id: string;
  name: string;
  sede: string;
}

export interface Sede {
    id: string;
    name: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface NavItem {
  href: string;
  icon: LucideIcon;
  label: string;
  roles: UserRole[];
}

export interface AuditLog {
    id: string;
    user: string;
    action: 'create' | 'update' | 'delete' | 'login' | 'logout' | 'generate_report' | 'approve_report';
    targetType: 'user' | 'expense' | 'report' | 'system' | 'optimisation';
    targetId: string;
    timestamp: string;
    details: string;
}

export interface SearchParams {
  [key: string]: string | string[] | undefined;
}
