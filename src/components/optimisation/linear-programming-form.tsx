'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Trash2, PlusCircle, Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { solveLPAction } from '@/app/actions';
import type { SolveLinearProgrammingOutput } from '@/ai/flows/solve-linear-programming';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';
import { Separator } from '../ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';

const linearProgrammingSchema = z.object({
  objective: z.object({
    type: z.enum(['minimize', 'maximize']),
    coefficients: z
      .array(z.object({ value: z.coerce.number() }))
      .min(1, 'Se requiere al menos un coeficiente en la función objetivo.'),
  }),
  constraints: z
    .array(
      z.object({
        coefficients: z.array(z.object({ value: z.coerce.number() })),
        inequality: z.enum(['<=', '>=', '=']),
        rhs: z.coerce.number(),
      })
    )
    .min(1, 'Se requiere al least una restricción.'),
});

type LinearProgrammingFormValues = z.infer<typeof linearProgrammingSchema>;

export function LinearProgrammingForm() {
  const [solution, setSolution] = useState<SolveLinearProgrammingOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();


  const form = useForm<LinearProgrammingFormValues>({
    resolver: zodResolver(linearProgrammingSchema),
    defaultValues: {
      objective: {
        type: 'minimize',
        coefficients: [{ value: 0 }],
      },
      constraints: [
        {
          coefficients: [{ value: 0 }],
          inequality: '<=',
          rhs: 0,
        },
      ],
    },
  });

  const {
    fields: objectiveCoeffs,
    append: appendObjectiveCoeff,
    remove: removeObjectiveCoeff,
  } = useFieldArray({
    control: form.control,
    name: 'objective.coefficients',
  });

  const {
    fields: constraints,
    append: appendConstraint,
    remove: removeConstraint,
  } = useFieldArray({
    control: form.control,
    name: 'constraints',
  });

  const numVariables = form.watch('objective.coefficients').length;

  const handleAddVariable = () => {
    appendObjectiveCoeff({ value: 0 });
    form.getValues('constraints').forEach((_, index) => {
      form.setValue(
        `constraints.${index}.coefficients`,
        form.getValues(`constraints.${index}.coefficients`).concat({ value: 0 })
      );
    });
  };

  const handleRemoveVariable = (index: number) => {
    if (numVariables <= 1) return;
    removeObjectiveCoeff(index);
    form.getValues('constraints').forEach((_, cIndex) => {
      const newCoeffs = form
        .getValues(`constraints.${cIndex}.coefficients`)
        .filter((_, vIndex) => vIndex !== index);
      form.setValue(`constraints.${cIndex}.coefficients`, newCoeffs);
    });
  };
  
  const handleAddConstraint = () => {
    appendConstraint({
      coefficients: Array(numVariables).fill({ value: 0 }),
      inequality: '<=',
      rhs: 0,
    });
  };


  async function onSubmit(data: LinearProgrammingFormValues) {
    setIsLoading(true);
    setSolution(null);
    setError(null);
    
    toast({
        title: "Procesando Solicitud (Sistemas Operativos)",
        description: "El problema de optimización se está ejecutando en segundo plano.",
    });

    const result = await solveLPAction({
        objective: data.objective.type,
        objective_coeffs: data.objective.coefficients.map(c => c.value),
        constraint_coeffs: data.constraints.map(c => c.coefficients.map(coef => coef.value)),
        inequalities: data.constraints.map(c => c.inequality),
        rhs_values: data.constraints.map(c => c.rhs)
    });

    setIsLoading(false);

    if (result.error || !result.solution) {
        setError(result.error || 'Ocurrió un error al resolver el problema.');
        toast({
            variant: "destructive",
            title: "Error en el Proceso",
            description: result.error || 'No se pudo completar el cálculo de optimización.',
        });
    } else {
        setSolution(result.solution);
        toast({
            title: "Cálculo Completado",
            description: "La solución óptima ha sido encontrada.",
        });
    }
  }

  return (
    <>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Objective Function */}
        <div className="space-y-4 rounded-lg border p-4 transition-all hover:shadow-md">
          <h3 className="text-lg font-medium">Función Objetivo</h3>
          <div className="flex items-end gap-4">
            <FormField
              control={form.control}
              name="objective.type"
              render={({ field }) => (
                <FormItem className="w-48">
                  <FormLabel>Tipo</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="minimize">Minimizar</SelectItem>
                      <SelectItem value="maximize">Maximizar</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex-1 space-y-2">
              <FormLabel>Coeficientes de las variables (x₁, x₂, ...)</FormLabel>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {objectiveCoeffs.map((field, index) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`objective.coefficients.${index}.value`}
                    render={({ field }) => (
                      <FormItem>
                         <FormControl>
                           <div className="relative">
                             <Input type="number" step="any" {...field} />
                             {index > 0 && <span className='absolute -left-5 top-2 text-muted-foreground'>+</span>}
                           </div>
                         </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddVariable}
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Variable
            </Button>
            {numVariables > 1 && (
                 <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => handleRemoveVariable(numVariables - 1)}
                    >
                    <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
            )}
          </div>
        </div>

        {/* Constraints */}
        <div className="space-y-4 rounded-lg border p-4 transition-all hover:shadow-md">
           <div className="flex justify-between items-center">
             <h3 className="text-lg font-medium">Restricciones</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddConstraint}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Añadir Restricción
              </Button>
           </div>
          {constraints.map((constraint, cIndex) => (
            <div
              key={constraint.id}
              className="flex items-end gap-2 p-2 rounded-md bg-muted/50"
            >
              <div className="flex-1 space-y-2">
                <FormLabel>Coeficientes (x₁, x₂, ...)</FormLabel>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                  {Array.from({ length: numVariables }).map((_, vIndex) => (
                    <FormField
                      key={`${constraint.id}-v${vIndex}`}
                      control={form.control}
                      name={`constraints.${cIndex}.coefficients.${vIndex}.value`}
                      defaultValue={0}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                               <Input type="number" step="any" {...field} />
                               {vIndex > 0 && <span className='absolute -left-5 top-2 text-muted-foreground'>+</span>}
                            </div>
                          </FormControl>
                           <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>
              <FormField
                control={form.control}
                name={`constraints.${cIndex}.inequality`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="<=">&le;</SelectItem>
                        <SelectItem value=">=">&ge;</SelectItem>
                        <SelectItem value="=">=</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`constraints.${cIndex}.rhs`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="any"
                        className="w-28"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeConstraint(cIndex)}
                className="h-9 w-9"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
        </div>

        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Calculando...
                </>
            ) : "Resolver Problema"}
        </Button>
      </form>
    </Form>
    {error && !isLoading && (
        <Alert variant="destructive" className="mt-8">
            <AlertTitle>Error de Cálculo</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
    )}
    {solution && !isLoading && (
        <Card className="mt-8 animate-in fade-in-50 duration-500">
            <CardHeader>
                <CardTitle>Resultados de la Optimización</CardTitle>
                <CardDescription>Solución óptima encontrada por el modelo de Programación Lineal.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h4 className="font-semibold text-lg">Solución Óptima</h4>
                    <p className={`text-2xl font-bold ${solution.status === 'Optimal' ? 'text-green-600' : 'text-yellow-600'}`}>
                        {solution.status}
                    </p>
                </div>
                <Separator />
                <div>
                    <h4 className="font-semibold">Valor Óptimo de la Función Objetivo (Z)</h4>
                    <p className="text-xl font-mono">{solution.optimal_value.toLocaleString('es-BO')}</p>
                </div>
                <Separator />
                <div>
                    <h4 className="font-semibold">Valores de las Variables</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                        {Object.entries(solution.variable_values).map(([key, value]) => (
                             <div key={key} className="p-3 bg-muted rounded-md transition-all hover:bg-muted/80">
                                <p className="text-sm font-medium text-muted-foreground">{key}</p>
                                <p className="text-lg font-semibold">{(value as number).toLocaleString('es-BO')}</p>
                            </div>
                        ))}
                    </div>
                </div>
                 <Separator />
                <div>
                    <h4 className="font-semibold mb-2">Análisis de la Solución (Generado por IA)</h4>
                     <Alert>
                        <AlertTitle className="font-semibold">Interpretación de los Resultados</AlertTitle>
                        <AlertDescription className="prose prose-sm max-w-none text-foreground">
                           <p>{solution.analysis}</p>
                        </AlertDescription>
                    </Alert>
                </div>
            </CardContent>
        </Card>
    )}
    </>
  );
}
