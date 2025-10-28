export type Matrix = number[][];
export type Step = {
  k: number;
  matrix: Matrix;
  updates: Set<string>;
  debug: Record<string, string>; // NEW: explanations per cell
};

export const INF = Number.POSITIVE_INFINITY;

export function parseCell(s: string): number {
  const t = s.trim();
  if (!t) return INF;
  if (t === "∞" || t.toLowerCase() === "inf" || t.toLowerCase() === "infinity")
    return INF;
  const n = Number(t);
  return Number.isFinite(n) ? n : INF;
}

export function displayCell(v: number): string {
  return Number.isFinite(v) ? String(v) : "∞";
}

/**
 * Runs Floyd–Warshall and captures per-k snapshots.
 * Assumes: diag zeros; INF for no edges.
 */
export function floydWarshallSteps(input: Matrix): Step[] {
  const n = input.length;
  const dist: Matrix = input.map((r) => r.slice());
  const steps: Step[] = [];

  for (let k = 0; k < n; k++) {
    const updates: Set<string> = new Set();
    const debug: Record<string, string> = {};
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const throughK = safeAdd(dist[i][k], dist[k][j]);
        if (throughK < dist[i][j]) {
          debug[`${i}-${j}`] = `min(${displayCell(dist[i][j])}, ${displayCell(
            dist[i][k]
          )} + ${displayCell(dist[k][j])} = ${throughK}) → ${throughK}`;
          dist[i][j] = throughK;
          updates.add(`${i}-${j}`);
        }
      }
    }
    steps.push({ k, matrix: dist.map((r) => r.slice()), updates, debug });
  }
  return steps;
}

function safeAdd(a: number, b: number): number {
  if (!Number.isFinite(a) || !Number.isFinite(b))
    return Number.POSITIVE_INFINITY;
  return a + b;
}

/** Returns an n×n matrix with zeros on diag and INF elsewhere. */
export function emptyMatrix(n: number): Matrix {
  return Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 0 : INF))
  );
}
