'use client';
import React from 'react'; // Importar React
import { PageHeader } from '@/components/page-header';
import { AuditLogDataTable } from '@/components/audit-log/data-table';
import { columns } from '@/components/audit-log/columns';
import { getPaginatedAuditLogs } from '@/lib/data';
import type { SearchParams } from '@/lib/types';
import { useEffect, useState, Suspense } from 'react'; // Importar Suspense
import type { AuditLog } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResponsiveContainer, Sankey, Tooltip, Layer, Rectangle } from 'recharts';
import { ArrowRight } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

// --- Componente para el Mapa del Sistema (sin cambios) ---
const SystemMap = () => {
    // ... (el contenido de este componente no cambia)
};

// --- NUEVO Componente de Contenido de Auditoría ---
const AuditLogContent = () => {
  // ... (toda la lógica de carga de datos va aquí)
};


// --- Componente de Página Principal (Modificado) ---
export default function AuditLogPage() {
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
            <Suspense fallback={
                <div className="space-y-4">
                    {/* ... (el esqueleto de carga va aquí) */}
                </div>
            }>
              <AuditLogContent />
            </Suspense>
          </TabsContent>
          <TabsContent value="map">
            <SystemMap />
          </TabsContent>
      </Tabs>
    </>
  );
}
