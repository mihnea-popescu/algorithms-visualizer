export type Step = {
  i: number;
  j: number;
  k: number;
  cost: number;
  explanation: string;
  costMatrix: number[][];
  rootMatrix: number[][];
  updates: Set<string>;
  keys: string[];
  frequencies: number[];
  currentK?: number;
  currentCost?: number;
  sumFreq?: number;
};

/**
 * Computes the optimal binary search tree and returns step-by-step results.
 * @param keys Array of keys (sorted)
 * @param frequencies Array of frequencies/probabilities for each key
 * @returns Array of steps showing the DP computation
 */
export function optimalBinarySearchTreeSteps(
  keys: string[],
  frequencies: number[]
): Step[] {
  const n = keys.length;
  if (n === 0) return [];

  // cost[i][j] = minimum cost of BST for keys from i to j (inclusive)
  const cost: number[][] = Array.from({ length: n }, () =>
    Array.from({ length: n }, () => 0)
  );
  // root[i][j] = root key index for optimal BST from i to j
  const root: number[][] = Array.from({ length: n }, () =>
    Array.from({ length: n }, () => -1)
  );

  const steps: Step[] = [];

  // Precompute prefix sums for frequencies (for O(1) range sum queries)
  const prefixSum: number[] = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefixSum[i + 1] = prefixSum[i] + frequencies[i];
  }

  // Helper to get sum of frequencies from i to j (inclusive)
  const getSumFreq = (i: number, j: number): number => {
    return prefixSum[j + 1] - prefixSum[i];
  };

  // Base case: single key
  for (let i = 0; i < n; i++) {
    cost[i][i] = frequencies[i];
    root[i][i] = i;
    steps.push({
      i,
      j: i,
      k: i,
      cost: frequencies[i],
      explanation: `Base case: Single key "${keys[i]}" with frequency ${frequencies[i]}. Cost = ${frequencies[i]}.`,
      costMatrix: cost.map((row) => row.slice()),
      rootMatrix: root.map((row) => row.slice()),
      updates: new Set([`${i}-${i}`]),
      keys: [...keys],
      frequencies: [...frequencies],
    });
  }

  // l is the length of the range (number of keys)
  for (let l = 2; l <= n; l++) {
    // i is the starting index
    for (let i = 0; i <= n - l; i++) {
      const j = i + l - 1; // j is the ending index
      const sumFreq = getSumFreq(i, j);
      cost[i][j] = Number.POSITIVE_INFINITY;
      const updates = new Set<string>();

      // Try all possible roots k from i to j
      for (let k = i; k <= j; k++) {
        // Cost of left subtree (keys i to k-1)
        const leftCost = k > i ? cost[i][k - 1] : 0;
        // Cost of right subtree (keys k+1 to j)
        const rightCost = k < j ? cost[k + 1][j] : 0;
        // Total cost with k as root
        const totalCost = leftCost + rightCost + sumFreq;

        // Create intermediate step for each k being evaluated
        // eslint-disable-next-line
        const leftSubtree = k > i ? `keys[${i}..${k - 1}]` : "empty";
        // eslint-disable-next-line
        const rightSubtree = k < j ? `keys[${k + 1}..${j}]` : "empty";
        const leftCostStr = k > i ? `cost[${i}][${k - 1}] = ${leftCost}` : "0";
        const rightCostStr = k < j ? `cost[${k + 1}][${j}] = ${rightCost}` : "0";

        const explanationIntermediate =
          `Evaluating root k = ${k} (key "${keys[k]}"): ` +
          `cost = leftCost + rightCost + sum(freqs[${i}..${j}]) = ` +
          `${leftCostStr} + ${rightCostStr} + ${sumFreq} = ${totalCost}`;

        steps.push({
          i,
          j,
          k,
          cost: cost[i][j], // Current best cost so far
          explanation: explanationIntermediate,
          costMatrix: cost.map((row) => row.slice()),
          rootMatrix: root.map((row) => row.slice()),
          updates: new Set(Array.from(updates)),
          keys: [...keys],
          frequencies: [...frequencies],
          currentK: k,
          currentCost: totalCost,
          sumFreq,
        });

        if (totalCost < cost[i][j]) {
          cost[i][j] = totalCost;
          root[i][j] = k;
          updates.add(`${i}-${j}`);
        }
      }

      // Create final explanation for this i,j pair
      const optimalK = root[i][j];
      const leftCost = optimalK > i ? cost[i][optimalK - 1] : 0;
      const rightCost = optimalK < j ? cost[optimalK + 1][j] : 0;
      const finalCost = leftCost + rightCost + sumFreq;

      const explanation =
        `Final result for cost[${i}][${j}]: ` +
        `Optimal root is k = ${optimalK} (key "${keys[optimalK]}"). ` +
        `Cost = ${leftCost > 0 ? `cost[${i}][${optimalK - 1}] + ` : ""}` +
        `${rightCost > 0 ? `cost[${optimalK + 1}][${j}] + ` : ""}` +
        `sum(freqs[${i}..${j}]) = ` +
        `${leftCost > 0 ? `${leftCost} + ` : ""}` +
        `${rightCost > 0 ? `${rightCost} + ` : ""}` +
        `${sumFreq} = ${finalCost}`;

      steps.push({
        i,
        j,
        k: optimalK,
        cost: cost[i][j],
        explanation,
        costMatrix: cost.map((row) => row.slice()),
        rootMatrix: root.map((row) => row.slice()),
        updates,
        keys: [...keys],
        frequencies: [...frequencies],
        sumFreq,
      });
    }
  }

  return steps;
}

/**
 * Reconstructs the optimal BST structure from the root table
 */
export function getOptimalBSTStructure(
  root: number[][],
  keys: string[],
  i: number,
  j: number
): string {
  if (i > j) return "null";
  if (i === j) return keys[i];
  const k = root[i][j];
  return `(${getOptimalBSTStructure(root, keys, i, k - 1)}) ${keys[k]} (${getOptimalBSTStructure(
    root,
    keys,
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
