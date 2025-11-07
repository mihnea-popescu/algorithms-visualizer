import { Matrix, INF } from "../../floyd/floydAlgorithm";

export type Edge = {
  from: number;
  to: number;
  weight: number;
};

export type KruskalStep = {
  iteration: number;
  sortedEdges: Edge[];
  mstEdges: Edge[];
  consideredEdge: Edge | null;
  addedEdge: Edge | null;
  rejectedEdge: Edge | null;
  explanation: string;
  parent: number[];
  rank: number[];
};

export function labelFor(i: number): string {
  return String.fromCharCode("A".charCodeAt(0) + i);
}

export function displayCell(v: number): string {
  return Number.isFinite(v) ? String(v) : "∞";
}

class UnionFind {
  parent: number[];
  rank: number[];

  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = Array(n).fill(0);
  }

  find(x: number): number {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]); // Path compression
    }
    return this.parent[x];
  }

  union(x: number, y: number): boolean {
    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX === rootY) {
      return false; // Already in same set (would create cycle)
    }

    // Union by rank
    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
    } else {
      this.parent[rootY] = rootX;
      this.rank[rootX]++;
    }

    return true; // Successfully merged
  }
}

export function kruskalsSteps(graph: Matrix): KruskalStep[] {
  const n = graph.length;
  const steps: KruskalStep[] = [];
  const edges: Edge[] = [];

  // Collect all edges (for undirected graph, check both directions)
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const weight1 = graph[i][j];
      const weight2 = graph[j][i];
      const weight = Number.isFinite(weight1) && weight1 > 0 
        ? weight1 
        : (Number.isFinite(weight2) && weight2 > 0 ? weight2 : INF);
      
      if (Number.isFinite(weight) && weight > 0) {
        edges.push({
          from: i,
          to: j,
          weight: weight,
        });
      }
    }
  }

  // Sort edges by weight
  edges.sort((a, b) => a.weight - b.weight);

  // Initial step
  const uf = new UnionFind(n);
  steps.push({
    iteration: 0,
    sortedEdges: [...edges],
    mstEdges: [],
    consideredEdge: null,
    addedEdge: null,
    rejectedEdge: null,
    explanation: `Initialization: Sort all edges by weight. Total edges: ${edges.length}.`,
    parent: [...uf.parent],
    rank: [...uf.rank],
  });

  const mstEdges: Edge[] = [];
  let iteration = 1;

  for (const edge of edges) {
    const beforeUnion = {
      parent: [...uf.parent],
      rank: [...uf.rank],
    };

    steps.push({
      iteration,
      sortedEdges: [...edges],
      mstEdges: [...mstEdges],
      consideredEdge: edge,
      addedEdge: null,
      rejectedEdge: null,
      explanation: `Consider edge ${labelFor(edge.from)} → ${labelFor(edge.to)} (weight: ${edge.weight}).`,
      parent: [...beforeUnion.parent],
      rank: [...beforeUnion.rank],
    });

    const canAdd = uf.union(edge.from, edge.to);

    if (canAdd) {
      mstEdges.push(edge);
      steps.push({
        iteration,
        sortedEdges: [...edges],
        mstEdges: [...mstEdges],
        consideredEdge: null,
        addedEdge: edge,
        rejectedEdge: null,
        explanation: `Add edge ${labelFor(edge.from)} → ${labelFor(edge.to)} to MST (weight: ${edge.weight}). No cycle created.`,
        parent: [...uf.parent],
        rank: [...uf.rank],
      });
    } else {
      steps.push({
        iteration,
        sortedEdges: [...edges],
        mstEdges: [...mstEdges],
        consideredEdge: null,
        addedEdge: null,
        rejectedEdge: edge,
        explanation: `Reject edge ${labelFor(edge.from)} → ${labelFor(edge.to)} (weight: ${edge.weight}). Adding it would create a cycle.`,
        parent: [...beforeUnion.parent],
        rank: [...beforeUnion.rank],
      });
    }

    iteration++;

    // Stop if we have n-1 edges (MST is complete)
    if (mstEdges.length === n - 1) {
      break;
    }
  }

  // Final step
  const totalWeight = mstEdges.reduce((sum, e) => sum + e.weight, 0);
  steps.push({
    iteration,
    sortedEdges: [...edges],
    mstEdges: [...mstEdges],
    consideredEdge: null,
    addedEdge: null,
    rejectedEdge: null,
    explanation: `MST complete! Total weight: ${totalWeight}. Added ${mstEdges.length} edges.`,
    parent: [...uf.parent],
    rank: [...uf.rank],
  });

  return steps;
}

