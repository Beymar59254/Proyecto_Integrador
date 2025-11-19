'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import type { AuditLog } from '@/lib/types';
import { ArrowUpDown, User, FileText, BarChart2, LogIn, LogOut, Check, FileDown, Trash, Pencil, ShieldAlert } from 'lucide-react';
import { Button } from '../ui/button';

const actionIcons = {
    create: Pencil,
    update: Pencil,
    delete: Trash,
    login: LogIn,
    logout: LogOut,
    generate_report: FileDown,
    approve_report: Check
};

const actionColors = {
    create: 'bg-blue-500/20 text-blue-700 border-blue-500/20',
    update: 'bg-yellow-500/20 text-yellow-700 border-yellow-500/20',
    delete: 'bg-red-500/20 text-red-700 border-red-500/20',
    login: 'bg-green-500/20 text-green-700 border-green-500/20',
    logout: 'bg-gray-500/20 text-gray-700 border-gray-500/20',
    generate_report: 'bg-purple-500/20 text-purple-700 border-purple-500/20',
    approve_report: 'bg-teal-500/20 text-teal-700 border-teal-500/20',
}

const targetIcons = {
    user: User,
    expense: FileText,
    report: BarChart2,
    system: ShieldAlert
};

export const columns: ColumnDef<AuditLog>[] = [
  {
    accessorKey: 'timestamp',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Fecha y Hora
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
        const date = new Date(row.getValue('timestamp'));
        const formattedDate = date.toLocaleDateString('es-BO', { timeZone: 'UTC' });
        const formattedTime = date.toLocaleTimeString('es-BO', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit', second: '2-digit' });
        return `${formattedDate} ${formattedTime}`;
    }
  },
  {
    accessorKey: 'user',
    header: ({ column }) => (
        <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
            Usuario
            <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue('user')}</div>,
  },
  {
    accessorKey: 'action',
    header: 'Acción',
    cell: ({ row }) => {
      const action = row.getValue('action') as AuditLog['action'];
      const Icon = actionIcons[action] || ShieldAlert;
      const colorClass = actionColors[action] || 'bg-gray-500/20 text-gray-700';
      const actionText = action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

      return (
        <Badge variant='outline' className={`capitalize ${colorClass}`}>
          <Icon className="mr-2 h-3.5 w-3.5" />
          {actionText}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: 'targetType',
    header: 'Objeto',
    cell: ({ row }) => {
      const targetType = row.getValue('targetType') as AuditLog['targetType'];
      const Icon = targetIcons[targetType] || ShieldAlert;
      const targetText = targetType.charAt(0).toUpperCase() + targetType.slice(1);
      return (
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span className="capitalize">{targetText}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: 'details',
    header: 'Detalles',
  },
];
