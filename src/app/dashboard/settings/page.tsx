'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { sedes, departments, categories } from '@/lib/data';
import { DataTable } from '@/components/settings/data-table';
import { sedeColumns, departmentColumns, categoryColumns } from '@/components/settings/columns';


export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Configuración"
        description="Gestiona la configuración de la aplicación, departamentos y categorías."
      />
      <Tabs defaultValue="sedes">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sedes">Sedes</TabsTrigger>
          <TabsTrigger value="departments">Departamentos</TabsTrigger>
          <TabsTrigger value="categories">Categorías de Gastos</TabsTrigger>
        </TabsList>
        <TabsContent value="sedes">
          <Card>
            <CardHeader>
              <CardTitle>Sedes</CardTitle>
              <CardDescription>
                Gestiona las sedes de la universidad.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
                <div className="flex justify-end">
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Añadir Sede
                    </Button>
                </div>
                <DataTable columns={sedeColumns} data={sedes} filterColumn='name' filterPlaceholder='Filtrar sedes...' />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="departments">
          <Card>
            <CardHeader>
              <CardTitle>Departamentos</CardTitle>
              <CardDescription>
                Gestiona los departamentos académicos y administrativos.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
                <div className="flex justify-end">
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Añadir Departamento
                    </Button>
                </div>
               <DataTable columns={departmentColumns} data={departments} filterColumn='name' filterPlaceholder='Filtrar departamentos...' />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Categorías de Gastos</CardTitle>
              <CardDescription>
                Gestiona las categorías utilizadas para clasificar los gastos.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
                <div className="flex justify-end">
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Añadir Categoría
                    </Button>
                </div>
                <DataTable columns={categoryColumns} data={categories} filterColumn='name' filterPlaceholder='Filtrar categorías...' />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
