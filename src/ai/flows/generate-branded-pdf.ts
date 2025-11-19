'use server';

/**
 * @fileOverview Generates a branded PDF report using AI, adhering to specific brand guidelines.
 *
 * - generateBrandedPdf - A function that generates a branded PDF report.
 * - GenerateBrandedPdfInput - The input type for the generateBrandedPdf function.
 * - GenerateBrandedPdfOutput - The return type for the generateBrandedPdf function, which is a data URI for the PDF.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBrandedPdfInputSchema = z.object({
  reportData: z
    .string()
    .describe("Report data in JSON format. Must contain all information to be rendered in the PDF, including title, report sections, and tabular data. It also includes a boolean 'isFinalReport' to determine the report type."),
  brandGuidelines: z
    .string()
    .optional()
    .describe("Optional brand guidelines in text format. If not provided, default brand guidelines will be used. For the final report, this is ignored."),
});
export type GenerateBrandedPdfInput = z.infer<typeof GenerateBrandedPdfInputSchema>;

const GenerateBrandedPdfOutputSchema = z.object({
  pdfDataUri: z.string().describe("PDF report as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'. The MIME type should be application/pdf."),
});
export type GenerateBrandedPdfOutput = z.infer<typeof GenerateBrandedPdfOutputSchema>;

export async function generateBrandedPdf(input: GenerateBrandedPdfInput): Promise<GenerateBrandedPdfOutput> {
  return generateBrandedPdfFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBrandedPdfPrompt',
  input: {schema: GenerateBrandedPdfInputSchema},
  output: {schema: GenerateBrandedPdfOutputSchema},
  prompt: `You are an AI report generator that outputs PDF documents in data URI format. You are an expert in adhering to brand guidelines and specific document structures when generating academic and technical reports for a university.

You will receive report data as a JSON string. Parse this data to determine if you need to generate a standard expense report or the complete final technical report for the SGC_USB project. The 'isFinalReport' key in the JSON will be true for the final technical report.

---

**CASE 1: Standard Expense Report**

If 'isFinalReport' is false, generate a standard expense report based on the 'expenses' data provided in the JSON.

- **Use Brand Guidelines:** Apply the brand guidelines provided in the input. If they are not provided, use these defaults:
  - Primary color: #0B3D91 (Dark Blue)
  - Accent color: #30D5C8 (Teal)
  - Font: Inter (sans-serif)
  - Layout: Clean, professional layout with tables for data. Use cards with light shadows and rounded borders. Include the university logo.

- **Content:**
  - Title: 'Reporte de Gastos'
  - Date: The date from the report data.
  - Data: Display the list of expenses in a clean, readable table format.

---

**CASE 2: Final Technical Report (SGC_USB Project)**

If 'isFinalReport' is true, you MUST generate the complete technical report document with the following mandatory structure and content. This is a formal academic document.

**FORMATO OBLIGATORIO DEL INFORME:**

**1. Portada:**
   - **Institución:** Universidad Salesiana de Bolivia
   - **Carrera:** Ingeniería de Sistemas
   - **Título del Proyecto:** Implementación de un Sistema de Gestión de Costos con Modelos de Investigación Operativa (SGC_USB)
   - **Integrantes:** Beymar Jesus Rodriguez Flores
   - **Docente:** Msc. Tatiana Flores
   - **Fecha:** 27 de Octubre de 2025
   *Layout: Centrado, profesional, con el logo de la universidad en la parte superior.*

**2. Resumen:**
   - **Objetivos:** Detallar el objetivo general (desarrollar un sistema web para optimizar la gestión de costos de la USB) y los específicos (implementar modelos de IO, centralizar datos, facilitar reportes, etc.).
   - **Modelos Implementados:** Nombrar y describir brevemente los cinco modelos: Programación Lineal, Transporte, Asignación, Redes (Dijkstra) y PERT/CPM.
   - **Resultados Clave:** Mencionar los principales beneficios obtenidos, como la reducción de costos simulada, la optimización de rutas y la mejora en la planificación de proyectos.

**3. Planteamiento del Problema:**
   - **Descripción:** Explicar la necesidad de una gestión de costos eficiente en una institución académica como la Universidad Salesiana de Bolivia, mencionando problemas como la descentralización de la información, la falta de visibilidad en tiempo real de los gastos, y la dificultad para tomar decisiones estratégicas basadas en datos.
   - **Datos Utilizados:** Describir que se utilizaron datos simulados pero realistas de gastos, sedes (La Paz, Cochabamba, Santa Cruz) y departamentos de la universidad para alimentar los modelos. El periodo de datos abarca desde Septiembre 2024 hasta Octubre 2025.
   - **Alcance:** Definir el alcance del proyecto, cubriendo el ciclo completo desde el registro del gasto, su aprobación, la generación de reportes analíticos y la aplicación de modelos de optimización para la toma de decisiones.

**4. Modelado Matemático:**
   *Para cada uno de los 5 modelos (Programación Lineal, Transporte, Asignación, Redes, PERT/CPM), definir formalmente con notación matemática estándar:*
   - **Variables:** Define claramente las variables de decisión (e.g., "Sea Xij la cantidad de material enviado desde la sede i a la sede j").
   - **Parámetros:** Define los datos de entrada conocidos del modelo (e.g., "Sea Cij el costo unitario de envío desde i hasta j").
   - **Función Objetivo:** Presenta la ecuación matemática a minimizar o maximizar (e.g., "Minimizar Z = Σ Σ Cij * Xij").
   - **Restricciones:** Lista todas las ecuaciones y/o inecuaciones que limitan el sistema, explicando su significado (e.g., "Restricciones de Oferta: Σ Xij ≤ Oferta_i, para cada sede de origen i").

**5. Resolución Computacional:**
   - **Resultados de Herramientas:** Simular y presentar de manera resumida los resultados que se obtendrían de herramientas como Excel Solver o Lingo.
   - **Resultados de Python:** Describir cómo el sistema SGC_USB utiliza librerías de Python (PuLP, SciPy, NetworkX) para resolver los modelos, presentando los resultados obtenidos a través de la interfaz.
   - **Comparación y Validación:** Realizar una breve comparación, indicando que los resultados de las diferentes herramientas son consistentes, validando así la correcta implementación de los modelos.

**6. Resultados y Análisis de Sensibilidad:**
   - **Análisis de Resultados:** Interpretar qué significan los resultados de cada modelo en un contexto práctico para la universidad.
   - **Análisis de Sensibilidad:** Explicar qué pasaría si cambiaran ciertas condiciones. Por ejemplo: "¿Qué pasa si el costo de transporte entre La Paz y Santa Cruz aumenta un 15%?" o "¿Qué sucede si la demanda de un recurso en una sede se duplica?".

**7. Conclusiones:**
   - **Eficiencia de los Modelos:** Concluir sobre la efectividad de los modelos de IO para la gestión de costos en la universidad.
   - **Recomendaciones:** Proponer recomendaciones concretas basadas en los hallazgos del proyecto (e.g., "Se recomienda adoptar el modelo de transporte para optimizar la logística entre sedes, lo que podría generar un ahorro estimado del X%").

**8. Bibliografía y Anexos:**
   - **Bibliografía:** Citar libros o fuentes académicas sobre Investigación Operativa (e.g., "Taha, Hamdy A. *Investigación de Operaciones*.").
   - **Anexos:** Mencionar que los anexos incluirían capturas de pantalla del sistema SGC_USB, el código Python utilizado, los gráficos generados y las bases de datos de muestra.

---
**Instrucciones de Salida:**

- **Report Data Input:** {{{reportData}}}
- **Output:** Genera el PDF solicitado como una data URI, correctamente formateado y codificado en Base64.
- **Final Report Design:** Use a formal, academic design. Clean layout, professional font (like Inter or Times New Roman), clear headings, and use tables or lists where appropriate. The primary color should be a professional blue like #0B3D91.
- **PDF Data URI:**
`,
});

const generateBrandedPdfFlow = ai.defineFlow(
  {
    name: 'generateBrandedPdfFlow',
    inputSchema: GenerateBrandedPdfInputSchema,
    outputSchema: GenerateBrandedPdfOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {
      pdfDataUri: output!.pdfDataUri,
    };
  }
);
