'use client';

import type { Table } from '@tanstack/react-table';
import { PlusCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTableFacetedFilter } from './data-table-faceted-filter';
import { departments, sedes } from '@/lib/data';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

const roles = [
    { value: 'admin', label: 'Admin' },
    { value: 'manager', label: 'Gerente' },
    { value: 'accountant', label: 'Contador' },
    { value: 'user', label: 'Usuario' },
];

const statuses = [
    { value: 'active', label: 'Activo' },
    { value: 'inactive', label: 'Inactivo' },
]

export function UsersToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const sedeOptions = sedes.map(s => ({ value: s.name, label: s.name }));
  const departmentOptions = departments.map(d => ({ value: d.name, label: d.name }));

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filtrar por nombre o email..."
          value={
            (table.getColumn('name')?.getFilterValue() as string) ?? ''
          }
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn('role') && (
          <DataTableFacetedFilter
            column={table.getColumn('role')}
            title="Rol"
            options={roles}
          />
        )}
        {table.getColumn('sede') && (
            <DataTableFacetedFilter
                column={table.getColumn('sede')}
                title="Sede"
                options={sedeOptions}
            />
        )}
        {table.getColumn('status') && (
            <DataTableFacetedFilter
                column={table.getColumn('status')}
                title="Estado"
                options={statuses}
            />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Limpiar
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <Button size="sm" className="h-8 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Crear Usuario
            </span>
        </Button>
      </div>
    </div>
  );
}
