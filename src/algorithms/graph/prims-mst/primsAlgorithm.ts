import { Matrix, INF } from "../../floyd/floydAlgorithm";

export type Edge = {
  from: number;
  to: number;
  weight: number;
};

export type PrimStep = {
  iteration: number;
  mstEdges: Edge[];
  inMST: Set<number>;
  candidateEdges: Edge[];
  selectedEdge: Edge | null;
  explanation: string;
  key: number[];
  parent: (number | null)[];
};

export function labelFor(i: number): string {
  return String.fromCharCode("A".charCodeAt(0) + i);
}

export function displayCell(v: number): string {
  return Number.isFinite(v) ? String(v) : "∞";
}

export function primsSteps(graph: Matrix, start: number = 0): PrimStep[] {
  const n = graph.length;
  const steps: PrimStep[] = [];
  const mstEdges: Edge[] = [];
  const inMST = new Set<number>();
  const key: number[] = Array(n).fill(INF);
  const parent: (number | null)[] = Array(n).fill(null);

  // Initialize with start vertex
  key[start] = 0;
  steps.push({
    iteration: 0,
    mstEdges: [],
    inMST: new Set(inMST),
    candidateEdges: [],
    selectedEdge: null,
    explanation: `Initialization: Start with vertex ${labelFor(start)}. Set key[${labelFor(start)}] = 0.`,
    key: [...key],
    parent: [...parent],
  });

  for (let iteration = 1; iteration < n; iteration++) {
    // Find the vertex with minimum key value that is not in MST
    let minKey = INF;
    let u: number | null = null;

    for (let v = 0; v < n; v++) {
      if (!inMST.has(v) && key[v] < minKey) {
        minKey = key[v];
        u = v;
      }
    }

    if (u === null || minKey === INF) {
      break; // No more vertices to add
    }

    // Add u to MST
    inMST.add(u);
    let selectedEdge: Edge | null = null;
    if (parent[u] !== null) {
      const p = parent[u]!;
      const weight1 = graph[p][u];
      const weight2 = graph[u][p];
      const weight = Number.isFinite(weight1) && weight1 > 0 
        ? weight1 
        : (Number.isFinite(weight2) && weight2 > 0 ? weight2 : INF);
      selectedEdge = {
        from: p,
        to: u,
        weight: weight,
      };
    }

    if (selectedEdge !== null) {
      mstEdges.push(selectedEdge);
    }

    // Collect candidate edges for visualization
    // For undirected graph, check both directions
    const candidateEdges: Edge[] = [];
    for (let v = 0; v < n; v++) {
      if (inMST.has(v)) continue;
      
      const weight1 = graph[u][v];
      const weight2 = graph[v][u];
      const weight = Number.isFinite(weight1) && weight1 > 0 
        ? weight1 
        : (Number.isFinite(weight2) && weight2 > 0 ? weight2 : INF);
      
      if (Number.isFinite(weight) && weight > 0) {
        candidateEdges.push({
          from: u,
          to: v,
          weight: weight,
        });
      }
    }

    const explanation = selectedEdge !== null
      ? `Add vertex ${labelFor(u)} to MST via edge ${labelFor(selectedEdge.from)} → ${labelFor(selectedEdge.to)} (weight: ${selectedEdge.weight}).`
      : `Add vertex ${labelFor(u)} to MST.`;

    steps.push({
      iteration,
      mstEdges: [...mstEdges],
      inMST: new Set(inMST),
      candidateEdges: [...candidateEdges],
      selectedEdge: selectedEdge,
      explanation,
      key: [...key],
      parent: [...parent],
    });

    // Update key values of adjacent vertices
    // For undirected graph, check both directions
    for (let v = 0; v < n; v++) {
      if (inMST.has(v)) continue;
      
      const weight1 = graph[u][v];
      const weight2 = graph[v][u];
      const weight = Number.isFinite(weight1) && weight1 > 0 
        ? weight1 
        : (Number.isFinite(weight2) && weight2 > 0 ? weight2 : INF);
      
      if (Number.isFinite(weight) && weight > 0 && weight < key[v]) {
        const oldKey = key[v];
        key[v] = weight;
        parent[v] = u;
        steps.push({
          iteration,
          mstEdges: [...mstEdges],
          inMST: new Set(inMST),
          candidateEdges: [],
          selectedEdge: null,
          explanation: `Update key[${labelFor(v)}] = min(${displayCell(oldKey)}, ${displayCell(weight)}) = ${displayCell(key[v])}. Set parent[${labelFor(v)}] = ${labelFor(u)}.`,
          key: [...key],
          parent: [...parent],
        });
      }
    }
  }

  // Final step
  const totalWeight = mstEdges.reduce((sum, e) => sum + e.weight, 0);
  steps.push({
    iteration: n,
    mstEdges: [...mstEdges],
    inMST: new Set(inMST),
    candidateEdges: [],
    selectedEdge: null,
    explanation: `MST complete! Total weight: ${totalWeight}.`,
    key: [...key],
    parent: [...parent],
  });

  return steps;
}

