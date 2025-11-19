'use client';

import React from 'react';
import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DateRangePicker } from '@/components/date-range-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import type { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { FileDown, Loader2, FileText, BookDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createPdfReportAction } from '@/app/actions';
import { expenses as allExpenses, departments, categories, sedes } from '@/lib/data';
import type { Expense } from '@/lib/types';
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from 'recharts';
import { Separator } from '@/components/ui/separator';

export default function ReportsPage() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
  const [sede, setSede] = React.useState<string>('all');
  const [department, setDepartment] = React.useState<string>('all');
  const [category, setCategory] = React.useState<string>('all');
  const [filteredExpenses, setFilteredExpenses] = React.useState<Expense[]>(allExpenses);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isGeneratingFinal, setIsGeneratingFinal] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    let result = allExpenses;
    if (dateRange?.from && dateRange?.to) {
        const fromDate = new Date(dateRange.from);
        fromDate.setHours(0, 0, 0, 0);
        const toDate = new Date(dateRange.to);
        toDate.setHours(23, 59, 59, 999);

        result = result.filter(e => {
            const expenseDate = new Date(e.date);
            return expenseDate >= fromDate && expenseDate <= toDate;
        });
    }
    if (sede !== 'all') {
        result = result.filter(e => e.sede === sede);
    }
    if (department !== 'all') {
        result = result.filter(e => e.department === department);
    }
    if (category !== 'all') {
        result = result.filter(e => e.category === category);
    }
    setFilteredExpenses(result);
  }, [dateRange, sede, department, category]);


  const handleGeneratePdf = async (isFinalReport: boolean) => {
    if (!isFinalReport && filteredExpenses.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No hay datos',
        description: 'No hay gastos que coincidan con los filtros para generar un reporte.',
      });
      return;
    }
    
    if (isFinalReport) {
        setIsGeneratingFinal(true);
    } else {
        setIsGenerating(true);
    }
    
    const { pdfDataUri, error } = await createPdfReportAction(isFinalReport ? allExpenses : filteredExpenses, isFinalReport);
    
    if (isFinalReport) {
        setIsGeneratingFinal(false);
    } else {
        setIsGenerating(false);
    }

    if (error || !pdfDataUri) {
      toast({
        variant: 'destructive',
        title: 'Error al generar PDF',
        description: error || 'Ocurrió un error inesperado.',
      });
      return;
    }

    const link = document.createElement('a');
    link.href = pdfDataUri;
    link.download = `${isFinalReport ? 'Informe-Final-SGC-USB' : 'reporte-gastos'}-${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: 'PDF Generado',
      description: 'La descarga de tu reporte ha comenzado.',
    });
  };

  const handleExportCsv = () => {
    if (filteredExpenses.length === 0) {
        toast({
            variant: 'destructive',
            title: 'No hay datos',
            description: 'No hay gastos que coincidan con los filtros para exportar.',
        });
        return;
    }

    const headers = ['ID', 'Descripción', 'Monto', 'Estado', 'Fecha', 'Categoría', 'Departamento', 'Sede', 'Usuario'];
    const csvContent = [
        headers.join(','),
        ...filteredExpenses.map(e => [
            e.id,
            `"${e.description.replace(/"/g, '""')}"`,
            e.amount,
            e.status,
            e.date,
            e.category,
            e.department,
            e.sede,
            `"${e.user.replace(/"/g, '""')}"`
        ].join(','))
    ].join('\n');

    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `export-gastos-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
        title: 'Exportación a Excel (CSV) completa',
        description: 'Tu archivo se ha descargado correctamente.',
    });
  };

  const chartData = categories.map(cat => ({
    name: cat.name,
    total: filteredExpenses
        .filter(e => e.category === cat.name)
        .reduce((acc, curr) => acc + curr.amount, 0),
  })).filter(c => c.total > 0);

  const filteredDepartments = sede === 'all'
    ? departments
    : departments.filter(d => d.sede === sede);

  React.useEffect(() => {
    if (sede !== 'all' && !filteredDepartments.some(d => d.name === department)) {
      setDepartment('all');
    }
  }, [sede, department, filteredDepartments]);


  return (
    <>
      <PageHeader
        title="Reportes y Analíticas"
        description="Filtra y visualiza los datos de gastos y genera reportes detallados."
      />
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Filtros de Reporte de Gastos</CardTitle>
            <CardDescription>
              Selecciona los filtros para generar tu reporte de gastos.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-end gap-4">
            <div className="grid gap-2">
              <Label htmlFor="date-range">Rango de Fechas</Label>
              <DateRangePicker
                date={dateRange}
                onDateChange={setDateRange}
                className="w-full"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sede">Sede</Label>
              <Select value={sede} onValueChange={setSede}>
                <SelectTrigger className="w-[200px]" id="sede">
                  <SelectValue placeholder="Sede" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {sedes.map((s) => (
                    <SelectItem key={s.id} value={s.name}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="department">Departamento</Label>
              <Select 
                value={department} 
                onValueChange={setDepartment} 
              >
                <SelectTrigger className="w-[200px]" id="department">
                  <SelectValue placeholder="Departamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {filteredDepartments.map((d) => (
                    <SelectItem key={d.id} value={d.name}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Categoría</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[200px]" id="category">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.name}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='flex gap-2 flex-wrap'>
              <Button
                onClick={() => handleGeneratePdf(false)}
                disabled={isGenerating}
                className="w-full sm:w-auto"
              >
                {isGenerating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <FileDown className="mr-2 h-4 w-4" />
                )}
                Generar PDF de Gastos
              </Button>
               <Button
                  onClick={handleExportCsv}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Exportar a Excel
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Visualización de Gastos</CardTitle>
                <CardDescription>Un desglose de los gastos basado en los filtros aplicados.</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                {filteredExpenses.length > 0 ? (
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={chartData}>
                            <XAxis
                                dataKey="name"
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                angle={-45}
                                textAnchor="end"
                                height={60}
                            />
                            <YAxis
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `Bs ${new Intl.NumberFormat('es-BO').format(value as number)}`}
                            />
                            <Tooltip
                                cursor={{fill: 'hsl(var(--muted))'}}
                                contentStyle={{background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)'}}
                                formatter={(value: number) => [`Bs ${new Intl.NumberFormat('es-BO').format(value)}`, "Total"]}
                            />
                            <Legend iconSize={10}/>
                            <Bar dataKey="total" fill="hsl(var(--primary))" name="Total Gastado" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-[350px] text-muted-foreground">
                        <p>No hay datos para mostrar con los filtros actuales.</p>
                    </div>
                )}
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informe Final del Proyecto</CardTitle>
            <CardDescription>
              Genera el documento técnico completo del proyecto SGC_USB en formato PDF.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Button
                onClick={() => handleGeneratePdf(true)}
                disabled={isGeneratingFinal}
                className="w-full sm:w-auto"
              >
                {isGeneratingFinal ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <BookDown className="mr-2 h-4 w-4" />
                )}
                Generar Informe Final del Proyecto
              </Button>
          </CardContent>
        </Card>

      </div>
    </>
  );
}
