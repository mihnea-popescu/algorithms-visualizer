export type Step = {
  i: number;
  j: number;
  k: number;
  cost: number;
  explanation: string;
  matrix: number[][];
  split: number[][];
  updates: Set<string>;
  dimensions: number[]; // The p[] array for this step
  currentK?: number; // The current k being evaluated (for intermediate steps)
  currentCost?: number; // The current cost being evaluated
};

/**
 * Computes the minimum cost of matrix chain multiplication and returns step-by-step results.
 * @param dimensions Array of dimensions. For n matrices, array has n+1 elements.
 *                  Example: [10, 20, 30, 40] means matrices: 10×20, 20×30, 30×40
 * @returns Array of steps showing the DP computation
 */
export function matrixChainSteps(dimensions: number[]): Step[] {
  const n = dimensions.length - 1; // Number of matrices
  if (n <= 0) return [];

  // m[i][j] = minimum cost to multiply matrices from i to j (0-indexed)
  const m: number[][] = Array.from({ length: n }, () =>
    Array.from({ length: n }, () => 0)
  );
  // split[i][j] = optimal split point for matrices from i to j
  const split: number[][] = Array.from({ length: n }, () =>
    Array.from({ length: n }, () => -1)
  );

  const steps: Step[] = [];

  // Base case: cost of multiplying a single matrix is 0
  for (let i = 0; i < n; i++) {
    m[i][i] = 0;
    split[i][i] = i;
  }

  // l is the chain length (number of matrices in the chain)
  for (let l = 2; l <= n; l++) {
    // i is the starting index
    for (let i = 0; i <= n - l; i++) {
      const j = i + l - 1; // j is the ending index
      m[i][j] = Number.POSITIVE_INFINITY;
      const updates = new Set<string>();

      // Try all possible split points k between i and j-1
      for (let k = i; k < j; k++) {
        // Calculate cost for this split point
        // p[i] = dimensions[i] = number of rows of matrix A[i+1] (or columns of previous matrix)
        // p[k+1] = dimensions[k+1] = number of columns of matrix A[k+1]
        // p[j+1] = dimensions[j+1] = number of columns of matrix A[j+1] (the last matrix in this chain)
        const p_i = dimensions[i];        // p[i] = rows of first matrix in chain (Ai+1)
        const p_k1 = dimensions[k + 1];   // p[k+1] = columns of matrix Ak+1 (shared dimension)
        const p_j1 = dimensions[j + 1];   // p[j+1] = columns of last matrix in chain (Aj+1)
        
        const cost =
          m[i][k] + m[k + 1][j] + p_i * p_k1 * p_j1;

        // Create intermediate step for each k being evaluated
        const explanationIntermediate = 
          `Evaluating split at k = ${k}: ` +
          `m[${i}][${k}] + m[${k + 1}][${j}] + p[${i}]×p[${k + 1}]×p[${j + 1}] = ` +
          `${m[i][k]} + ${m[k + 1][j]} + ${p_i}×${p_k1}×${p_j1} = ` +
          `${m[i][k]} + ${m[k + 1][j]} + ${p_i * p_k1 * p_j1} = ${cost}`;

        steps.push({
          i,
          j,
          k,
          cost: m[i][j], // Current best cost so far
          explanation: explanationIntermediate,
          matrix: m.map((row) => row.slice()),
          split: split.map((row) => row.slice()),
          updates: new Set([...updates]),
          dimensions: [...dimensions],
          currentK: k,
          currentCost: cost,
        });

        if (cost < m[i][j]) {
          m[i][j] = cost;
          split[i][j] = k;
          updates.add(`${i}-${j}`);
        }
      }

      // Create final explanation for this i,j pair
      const optimalK = split[i][j];
      const p_i = dimensions[i];
      const p_k1 = dimensions[optimalK + 1];
      const p_j1 = dimensions[j + 1];
      const multiplicationCost = p_i * p_k1 * p_j1;
      
      const explanation = 
        `Final result for m[${i}][${j}]: ` +
        `Optimal split at k = ${optimalK}. ` +
        `Cost = m[${i}][${optimalK}] + m[${optimalK + 1}][${j}] + p[${i}]×p[${optimalK + 1}]×p[${j + 1}] = ` +
        `${m[i][optimalK]} + ${m[optimalK + 1][j]} + ${p_i}×${p_k1}×${p_j1} = ` +
        `${m[i][optimalK]} + ${m[optimalK + 1][j]} + ${multiplicationCost} = ${m[i][j]}`;

      steps.push({
        i,
        j,
        k: optimalK,
        cost: m[i][j],
        explanation,
        matrix: m.map((row) => row.slice()),
        split: split.map((row) => row.slice()),
        updates,
        dimensions: [...dimensions],
      });
    }
  }

  return steps;
}

/**
 * Reconstructs the optimal parenthesization from the split table
 */
export function getOptimalParenthesization(
  split: number[][],
  i: number,
  j: number
): string {
  if (i === j) {
    return `A${i + 1}`;
  }
  const k = split[i][j];
  return `(${getOptimalParenthesization(split, i, k)})(${getOptimalParenthesization(
    split,
    k + 1,
    j
  )})`;
}

/**
 * Formats a number for display (handles infinity)
 */
export function displayCell(v: number): string {
  if (v === Number.POSITIVE_INFINITY) return "∞";
  return String(v);
}

