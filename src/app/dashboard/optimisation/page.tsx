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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LinearProgrammingForm } from '@/components/optimisation/linear-programming-form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

// Placeholder components for the other optimisation models
const PlaceholderContent = ({ title, description }: { title: string, description: string }) => (
    <Card>
        <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
            <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>En Desarrollo</AlertTitle>
                <AlertDescription>
                    Este modelo de optimización está actualmente en desarrollo. La interfaz de entrada de datos se mostrará aquí.
                </AlertDescription>
            </Alert>
        </CardContent>
    </Card>
);


export default function OptimisationPage() {
  return (
    <>
      <PageHeader
        title="Optimización (Investigación Operativa)"
        description="Utilice modelos de investigación operativa para optimizar los recursos de la universidad."
      />
      <Tabs defaultValue="linear-programming">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="linear-programming">
            Programación Lineal
          </TabsTrigger>
          <TabsTrigger value="transport">
            Transporte
          </TabsTrigger>
          <TabsTrigger value="assignment">
            Asignación
          </TabsTrigger>
          <TabsTrigger value="dijkstra">
            Redes (Dijkstra)
          </TabsTrigger>
          <TabsTrigger value="pert-cpm">
            PERT/CPM
          </TabsTrigger>
        </TabsList>
        <TabsContent value="linear-programming">
          <Card>
            <CardHeader>
              <CardTitle>Modelo de Programación Lineal</CardTitle>
              <CardDescription>
                Defina la función objetivo y las restricciones para minimizar costos o maximizar el rendimiento.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LinearProgrammingForm />
            </CardContent>
          </Card>
        </TabsContent>
         <TabsContent value="transport">
          <PlaceholderContent 
            title="Modelo de Transporte"
            description="Optimice las rutas y costos de envío de materiales entre las diferentes sedes de la universidad."
          />
        </TabsContent>
        <TabsContent value="assignment">
          <PlaceholderContent 
            title="Modelo de Asignación"
            description="Asigne de manera óptima los recursos (personal, equipo) a las tareas para minimizar el costo o tiempo total."
          />
        </TabsContent>
        <TabsContent value="dijkstra">
          <PlaceholderContent 
            title="Algoritmo de Dijkstra para Redes"
            description="Encuentre la ruta más corta o de menor costo entre dos puntos (nodos) en la red de la universidad."
          />
        </TabsContent>
        <TabsContent value="pert-cpm">
          <PlaceholderContent 
            title="Modelo PERT/CPM"
            description="Planifique, programe y controle proyectos complejos para determinar la ruta crítica y gestionar los tiempos."
          />
        </TabsContent>
      </Tabs>
    </>
  );
}
