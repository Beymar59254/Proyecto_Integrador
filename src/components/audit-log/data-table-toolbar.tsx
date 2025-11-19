'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTableFacetedFilter } from './data-table-faceted-filter';
import { DateRangePicker } from '@/components/date-range-picker';
import React, { useTransition } from 'react';
import type { DateRange } from 'react-day-picker';

interface DataTableToolbarProps {
  // We don't need the whole table object anymore
}

const actions = [
    { value: 'create', label: 'Crear' },
    { value: 'update', label: 'Actualizar' },
    { value: 'delete', label: 'Eliminar' },
    { value: 'login', label: 'Login' },
    { value: 'logout', label: 'Logout' },
    { value: 'generate_report', label: 'Generar Reporte' },
    { value: 'approve_report', label: 'Aprobar Reporte' },
];

const targetTypes = [
    { value: 'user', label: 'Usuario' },
    { value: 'expense', label: 'Gasto' },
    { value: 'report', label: 'Reporte' },
    { value: 'system', label: 'Sistema' },
];

export function AuditLogToolbar({}: DataTableToolbarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const handleFilterChange = (key: string, value: string | string[] | null) => {
        startTransition(() => {
            const newParams = new URLSearchParams(searchParams.toString());
            if (value) {
                newParams.set(key, Array.isArray(value) ? value.join('.') : value);
            } else {
                newParams.delete(key);
            }
            newParams.set('page', '1'); // Reset to first page on filter change
            router.push(`${pathname}?${newParams.toString()}`);
        });
    };
    
    const handleDateRangeChange = (range: DateRange | undefined) => {
        startTransition(() => {
            const newParams = new URLSearchParams(searchParams.toString());
            if (range?.from) {
                newParams.set('from', range.from.toISOString());
            } else {
                newParams.delete('from');
            }
            if (range?.to) {
                newParams.set('to', range.to.toISOString());
            } else {
                newParams.delete('to');
            }
            newParams.set('page', '1');
            router.push(`${pathname}?${newParams.toString()}`);
        });
    };

    const isFiltered = Array.from(searchParams.keys()).some(key => !['page', 'per_page'].includes(key));
    
    const getFacetedFilterValue = (key: string) => {
        const value = searchParams.get(key);
        return value ? new Set(value.split('.')) : new Set();
    };

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder="Filtrar por usuario..."
                    defaultValue={searchParams.get('user') ?? ''}
                    onChange={(event) => handleFilterChange('user', event.target.value || null)}
                    className="h-8 w-[150px] lg:w-[250px]"
                />
                 <DateRangePicker 
                    date={{
                        from: searchParams.get('from') ? new Date(searchParams.get('from')!) : undefined,
                        to: searchParams.get('to') ? new Date(searchParams.get('to')!) : undefined,
                    }}
                    onDateChange={handleDateRangeChange}
                 />
                <DataTableFacetedFilter
                    title="Acción"
                    options={actions}
                    column={{
                        getFilterValue: () => getFacetedFilterValue('action'),
                        setFilterValue: (value) => handleFilterChange('action', value ? Array.from(value as Set<string>) : null),
                    } as any}
                />
                <DataTableFacetedFilter
                    title="Objeto"
                    options={targetTypes}
                     column={{
                        getFilterValue: () => getFacetedFilterValue('targetType'),
                        setFilterValue: (value) => handleFilterChange('targetType', value ? Array.from(value as Set<string>) : null),
                    } as any}
                />
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => router.push(pathname)}
                        className="h-8 px-2 lg:px-3"
                    >
                        Limpiar
                        <X className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}
