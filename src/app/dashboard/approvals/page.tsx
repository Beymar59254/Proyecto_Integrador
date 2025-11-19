'use client';
import { PageHeader } from '@/components/page-header';
import { ApprovalsDataTable } from '@/components/approvals/data-table';
import { columns } from '@/components/approvals/columns';
import { expenses } from '@/lib/data';
import { useMemo } from 'react';
import type { Expense } from '@/lib/types';

export default function ApprovalsPage() {
  const pendingExpenses = useMemo(() => expenses.filter((e: Expense) => e.status === 'pending'), []);

  return (
    <>
      <PageHeader
        title="Aprobaciones"
        description="Revisa y aprueba los gastos pendientes de la universidad."
      />
      <ApprovalsDataTable columns={columns} data={pendingExpenses} />
    </>
  );
}
