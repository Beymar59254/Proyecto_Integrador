'use server';
/**
 * @fileOverview Solves a linear programming problem using AI.
 *
 * - solveLinearProgramming - A function that solves the LP problem.
 * - SolveLinearProgrammingInput - The input type for the function.
 * - SolveLinearProgrammingOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SolveLinearProgrammingInputSchema = z.object({
  objective: z.enum(['minimize', 'maximize']).describe('Whether to minimize or maximize the objective function.'),
  objective_coeffs: z.array(z.number()).describe('An array of coefficients for the objective function.'),
  constraint_coeffs: z.array(z.array(z.number())).describe('A 2D array of coefficients for the constraints.'),
  inequalities: z.array(z.enum(['<=', '>=', '='])).describe('An array of inequality signs for each constraint.'),
  rhs_values: z.array(z.number()).describe('An array of right-hand side values for each constraint.'),
});
export type SolveLinearProgrammingInput = z.infer<typeof SolveLinearProgrammingInputSchema>;

const SolveLinearProgrammingOutputSchema = z.object({
  status: z.string().describe('The status of the solution (e.g., "Optimal", "Infeasible").'),
  optimal_value: z.number().describe('The optimal value of the objective function.'),
  variable_values: z.record(z.number()).describe('A dictionary sampah the optimal values for each variable (x1, x2, etc.).'),
  analysis: z.string().describe('A natural language analysis and interpretation of the solution provided, written in Spanish.'),
});
export type SolveLinearProgrammingOutput = z.infer<typeof SolveLinearProgrammingOutputSchema>;

export async function solveLinearProgramming(input: SolveLinearProgrammingInput): Promise<SolveLinearProgrammingOutput> {
  return solveLinearProgrammingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'solveLinearProgrammingPrompt',
  input: { schema: SolveLinearProgrammingInputSchema },
  output: { schema: SolveLinearProgrammingOutputSchema },
  prompt: `You are an expert in Operations Research and Mathematical Optimization. Your task is to solve a linear programming problem using Python with the PuLP library.

The user provides the objective function (to minimize or maximize) and a set of constraints. You must formulate this as a PuLP model, solve it, and return the results in the specified JSON format.

**Problem Details:**

*   **Objective:** {{objective}}
*   **Objective Function Coefficients:** [{{#each objective_coeffs}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}]
*   **Constraint Matrix (A):**
    {{#each constraint_coeffs}}
    [{{#each this}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}]
    {{/each}}
*   **Inequalities:** [{{#each inequalities}}"{{this}}"{{#unless @last}}, {{/unless}}{{/each}}]
*   **Right-Hand Side Vector (b):** [{{#each rhs_values}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}]

**Your Task:**

1.  **Formulate the PuLP model:** Create the LP problem, define the variables, set the objective function, and add all the constraints.
2.  **Solve the model:** Call the solver.
3.  **Extract the results:** Get the solution status, the optimal value of the objective function, and the values of each decision variable.
4.  **Provide an analysis:** Write a brief, clear analysis in Spanish explaining what the results mean in a practical context. For example, if minimizing cost, explain what the minimum cost is and what values the variables should take to achieve it.
5.  **Format the output:** Return the entire result as a single JSON object matching the output schema.

**Example Python Code Structure (for your internal reference):**
\'\'\'python
from pulp import LpProblem, LpVariable, lpSum, LpMinimize, LpMaximize

# 1. Create the model
if objective == 'minimize':
    model = LpProblem(name="lp-problem", sense=LpMinimize)
else:
    model = LpProblem(name="lp-problem", sense=LpMaximize)

# 2. Define variables
num_vars = len(objective_coeffs)
variables = [LpVariable(name=f"x{i+1}", lowBound=0) for i in range(num_vars)]

# 3. Add objective function
model += lpSum([objective_coeffs[i] * variables[i] for i in range(num_vars)])

# 4. Add constraints
for i in range(len(constraint_coeffs)):
    expr = lpSum([constraint_coeffs[i][j] * variables[j] for j in range(num_vars)])
    if inequalities[i] == '<=':
        model += (expr <= rhs_values[i], f"constraint_{i}")
    elif inequalities[i] == '>=':
        model += (expr >= rhs_values[i], f"constraint_{i}")
    else:
        model += (expr == rhs_values[i], f"constraint_{i}")

# 5. Solve the problem
status = model.solve()

# 6. Extract results and format output
# ...
\'\'\'

Now, solve the provided problem and return the JSON output.
`,
});

const solveLinearProgrammingFlow = ai.defineFlow(
  {
    name: 'solveLinearProgrammingFlow',
    inputSchema: SolveLinearProgrammingInputSchema,
    outputSchema: SolveLinearProgrammingOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
