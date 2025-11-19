import { expenses, categories } from '@/lib/data';
import { PageHeader } from '@/components/page-header';
import { DashboardClient } from '@/components/dashboard/client';

export default function Dashboard() {
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const pendingExpenses = expenses.filter(e => e.status === 'pending').length;
  const recentExpenses = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  const chartData = categories.map(category => {
      const total = expenses
          .filter(e => e.category === category.name)
          .reduce((acc, curr) => acc + curr.amount, 0);
      return { name: category.name, total: total };
  }).filter(c => c.total > 0);


  return (
    <>
      <PageHeader title="Dashboard" description="Bienvenido, aquí tienes un resumen de la actividad." />
      <DashboardClient
        totalExpenses={totalExpenses}
        pendingExpenses={pendingExpenses}
        recentExpenses={recentExpenses}
        chartData={chartData}
      />
    </>
  );
}
