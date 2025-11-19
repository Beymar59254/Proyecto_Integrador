import { expenses } from '@/lib/data';
import { Expense } from '@/lib/types';
import { ExpensesDataTable } from '@/components/expenses/data-table';
import { columns } from '@/components/expenses/columns';
import { PageHeader } from '@/components/page-header';

async function getExpenses(): Promise<Expense[]> {
  // In a real application, you would fetch data from a database or API.
  return expenses;
}

export default async function ExpensesPage() {
  const data = await getExpenses();

  return (
    <>
      <PageHeader
        title="Gestión de Gastos"
        description="Visualiza, crea y gestiona todos los gastos."
      />
      <ExpensesDataTable columns={columns} data={data} />
    </>
  );
}
