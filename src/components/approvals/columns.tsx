'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import type { Expense } from '@/lib/types';
import { ArrowUpDown, Check, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';

export const columns: ColumnDef<Expense>[] = [
    {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Seleccionar todo"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Seleccionar fila"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'user',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Solicitante
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'description',
    header: 'Descripción',
  },
    {
    accessorKey: 'amount',
    header: ({ column }) => (
        <div className='text-right'>
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                Monto
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        </div>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'));
      const formatted = new Intl.NumberFormat('es-BO', {
        style: 'currency',
        currency: 'BOB',
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'date',
    header: ({ column }) => (
        <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
            Fecha
            <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    ),
    cell: ({ row }) => {
        const dateStr = row.getValue('date') as string;
        const date = new Date(dateStr);
        return date.toLocaleDateString('es-BO', { timeZone: 'UTC' });
    }
  },
  {
    accessorKey: 'category',
    header: 'Categoría',
  },
  {
    id: 'actions',
    header: () => <div className="text-center">Acciones</div>,
    cell: ({ row }) => {
        // In a real app, you would have functions to handle approve/reject
        const handleApprove = () => alert(`Gasto ${row.original.id} aprobado.`);
        const handleReject = () => alert(`Gasto ${row.original.id} rechazado.`);
        return (
            <div className="flex justify-center items-center gap-2">
                <Button variant="outline" size="sm" className="bg-green-500/10 text-green-700 border-green-500/30 hover:bg-green-500/20" onClick={handleApprove}>
                    <Check className="mr-2 h-4 w-4" />
                    Aprobar
                </Button>
                <Button variant="outline" size="sm" className="bg-red-500/10 text-red-700 border-red-500/30 hover:bg-red-500/20" onClick={handleReject}>
                    <X className="mr-2 h-4 w-4" />
                    Rechazar
                </Button>
            </div>
        )
    },
  },
];
