'use server';

import { generateBrandedPdf } from '@/ai/flows/generate-branded-pdf';
import type { Expense } from '@/lib/types';
import { solveLinearProgramming } from '@/ai/flows/solve-linear-programming';
import type { SolveLinearProgrammingInput, SolveLinearProgrammingOutput } from '@/ai/flows/solve-linear-programming';

export async function createPdfReportAction(
  expenses: Expense[],
  isFinalReport: boolean = false,
): Promise<{ pdfDataUri?: string; error?: string }> {
  try {
    const reportData = JSON.stringify({
      title: isFinalReport ? 'Informe Final del Proyecto SGC_USB' : 'Reporte de Gastos',
      date: new Date().toLocaleDateString('es-BO'),
      expenses: isFinalReport ? [] : expenses, // Don't send huge data for final report
      isFinalReport,
    });
    
    // In a real scenario, you could add dynamic brand guidelines here.
    // For the final report, specific guidelines are embedded in the prompt.
    const brandGuidelines = isFinalReport ? '' : `
- Primary color: #007BFF
- Accent color: #FFC107
- Font: Inter (sans-serif)
- Layout: Use tables for data, include the university logo at the top.
`;

    const result = await generateBrandedPdf({
      reportData,
      brandGuidelines,
    });

    return { pdfDataUri: result.pdfDataUri };
  } catch (error) {
    console.error('Error generating PDF:', error);
    return { error: 'Failed to generate PDF report.' };
  }
}

export async function solveLPAction(input: SolveLinearProgrammingInput): Promise<{ solution?: SolveLinearProgrammingOutput, error?: string }> {
    try {
        // Simulate a longer background process for demonstration
        await new Promise(resolve => setTimeout(resolve, 2500)); 
        const solution = await solveLinearProgramming(input);
        return { solution };
    } catch (e: any) {
        console.error("Error solving LP:", e);
        return { error: e.message || 'Ocurrió un error al resolver el problema.' };
    }
}

export async function checkSystemStatusAction(): Promise<{ status: 'operational' | 'outage' }> {
  // Simulate a network check. In a real app, this would ping backend services.
  // We'll simulate a 95% success rate.
  if (Math.random() > 0.05) {
    return { status: 'operational' };
  }
  return { status: 'outage' };
}
