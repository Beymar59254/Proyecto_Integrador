'use client';
import { PageHeader } from '@/components/page-header';
import { AuditLogDataTable } from '@/components/audit-log/data-table';
import { columns } from '@/components/audit-log/columns';
import { getPaginatedAuditLogs } from '@/lib/data';
import type { SearchParams } from '@/lib/types';
import { useEffect, useState } from 'react';
import type { AuditLog } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResponsiveContainer, Sankey, Tooltip, Layer, Rectangle } from 'recharts';
import { ArrowRight } from 'lucide-react';
import { useSearchParams } from 'next/navigation';


const SystemMap = () => {
    const data = {
        nodes: [
            { name: 'Entrada de Datos' }, // 0
            { name: 'Proceso' }, // 1
            { name: 'Salida' }, // 2
            { name: 'Retroalimentación' }, // 3
            { name: 'Gastos' }, // 4
            { name: 'Aprobación y Análisis' }, // 5
            { name: 'Reportes y Optimización' }, // 6
            { name: 'Auditoría' }, // 7
        ],
        links: [
            { source: 4, target: 5, value: 10 },
            { source: 5, target: 6, value: 8 },
            { source: 6, target: 7, value: 6 },
            { source: 7, target: 5, value: 2 },
            
            { source: 0, target: 4, value: 1, "color": "transparent" },
            { source: 1, target: 5, value: 1, "color": "transparent" },
            { source: 2, target: 6, value: 1, "color": "transparent" },
            { source: 3, target: 7, value: 1, "color": "transparent" },
        ],
    };
    
    // Custom node component to style main categories differently
    const CustomNode = ({ x, y, width, height, index, payload }: any) => {
      const isMainCategory = index < 4;
      return (
        <Layer key={`CustomNode${index}`}>
          <Rectangle
            x={x}
            y={y}
            width={width}
            height={height}
            fill={isMainCategory ? "hsl(var(--primary))" : "hsl(var(--secondary))"}
            fillOpacity="1"
            radius={4}
          />
          <text
            x={x + width / 2}
            y={y + height / 2}
            textAnchor="middle"
            alignmentBaseline="middle"
            fill={isMainCategory ? "hsl(var(--primary-foreground))" : "hsl(var(--secondary-foreground))"}
            fontSize="12"
            fontWeight={isMainCategory ? "bold" : "normal"}
          >
            {payload.name}
          </text>
        </Layer>
      );
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Mapa del Sistema (Teoría de Sistemas)</CardTitle>
                <CardDescription>
                    Visualización del flujo de información y retroalimentación dentro del SGC_USB.
                </CardDescription>
            </CardHeader>
            <CardContent className="h-[500px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <Sankey
                        data={data}
                        node={<CustomNode />}
                        nodePadding={50}
                        margin={{
                            left: 20,
                            right: 20,
                            top: 20,
                            bottom: 20,
                        }}
                        link={{ stroke: 'hsl(var(--border))', strokeOpacity: 0.5 }}
                    >
                         <Tooltip 
                            contentStyle={{
                                background: 'hsl(var(--background))', 
                                border: '1px solid hsl(var(--border))', 
                                borderRadius: 'var(--radius)',
                                color: 'hsl(var(--foreground))'
                            }}
                         />
                    </Sankey>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};


export default function AuditLogPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [logs, setLogs] = useState<{ data: AuditLog[]; totalCount: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const sp = useSearchParams();

  useEffect(() => {
    setIsLoading(true);
    const filters: SearchParams = {
        page: sp.get('page') || '1',
        per_page: sp.get('per_page') || '10',
        user: sp.get('user') || undefined,
        action: sp.get('action') || undefined,
        targetType: sp.get('targetType') || undefined,
        from: sp.get('from') || undefined,
        to: sp.get('to') || undefined,
    };
    getPaginatedAuditLogs(filters)
      .then((result) => {
        setLogs(result);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [sp]);

  return (
    <>
      <PageHeader
        title="Auditoría y Monitoreo del Sistema"
        description="Rastrea acciones y visualiza la arquitectura del sistema."
      />
      <Tabs defaultValue="log">
          <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="log">Registro de Auditoría</TabsTrigger>
              <TabsTrigger value="map">Mapa del Sistema</TabsTrigger>
          </TabsList>
          <TabsContent value="log">
            {isLoading ? (
                <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex flex-1 items-center space-x-2">
                    <Skeleton className="h-8 w-[250px]" />
                    <Skeleton className="h-8 w-[150px]" />
                    <Skeleton className="h-8 w-[100px]" />
                    </div>
                </div>
                <div className="rounded-md border">
                    <Skeleton className="h-[400px] w-full" />
                </div>
                <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-[100px]" />
                    <Skeleton className="h-8 w-[200px]" />
                </div>
                </div>
            ) : (
            <AuditLogDataTable
                columns={columns}
                data={logs?.data ?? []}
                totalCount={logs?.totalCount ?? 0}
            />
            )}
          </TabsContent>
          <TabsContent value="map">
            <SystemMap />
          </TabsContent>
      </Tabs>

    </>
  );
}
