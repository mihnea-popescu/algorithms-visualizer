import { Matrix, INF } from "../../floyd/floydAlgorithm";

export type DijkstraStep = {
  iteration: number;
  currentVertex: number | null;
  distances: number[];
  previous: (number | null)[];
  visited: Set<number>;
  processing: number | null;
  explanation: string;
  pathToTarget?: number[];
};

export function dijkstraSteps(
  graph: Matrix,
  source: number,
  target: number
): DijkstraStep[] {
  const n = graph.length;
  const distances: number[] = Array(n).fill(INF);
  const previous: (number | null)[] = Array(n).fill(null);
  const visited = new Set<number>();
  const steps: DijkstraStep[] = [];

  distances[source] = 0;
  steps.push({
    iteration: 0,
    currentVertex: null,
    distances: [...distances],
    previous: [...previous],
    visited: new Set(visited),
    processing: source,
    explanation: `Initialization: Set distance to source vertex ${labelFor(
      source
    )} to 0, all others to ∞.`,
  });

  for (let iteration = 1; iteration <= n; iteration++) {
    let minDist = INF;
    let current: number | null = null;

    for (let v = 0; v < n; v++) {
      if (!visited.has(v) && distances[v] < minDist) {
        minDist = distances[v];
        current = v;
      }
    }

    if (current === null || minDist === INF) {
      break;
    }

    visited.add(current);
    const explanation = `Select vertex ${labelFor(
      current
    )} with minimum distance ${displayCell(distances[current])}.`;

    steps.push({
      iteration,
      currentVertex: current,
      distances: [...distances],
      previous: [...previous],
      visited: new Set(visited),
      processing: current,
      explanation,
    });

    for (let neighbor = 0; neighbor < n; neighbor++) {
      if (visited.has(neighbor)) continue;

      const edgeWeight = graph[current][neighbor];
      if (!Number.isFinite(edgeWeight) || edgeWeight <= 0) continue;

      const alt = safeAdd(distances[current], edgeWeight);
      if (alt < distances[neighbor]) {
        const oldDist = distances[neighbor];
        distances[neighbor] = alt;
        previous[neighbor] = current;
        steps.push({
          iteration,
          currentVertex: current,
          distances: [...distances],
          previous: [...previous],
          visited: new Set(visited),
          processing: neighbor,
          explanation: `Relax edge ${labelFor(current)} → ${labelFor(
            neighbor
          )}: dist[${labelFor(neighbor)}] = min(${displayCell(
            oldDist
          )}, ${displayCell(distances[current])} + ${displayCell(
            edgeWeight
          )}) = ${displayCell(alt)}.`,
        });
      }
    }

    if (current === target) {
      const path = reconstructPath(previous, source, target);
      steps.push({
        iteration,
        currentVertex: current,
        distances: [...distances],
        previous: [...previous],
        visited: new Set(visited),
        processing: null,
        explanation: `Target vertex ${labelFor(
          target
        )} reached! Shortest distance: ${displayCell(distances[target])}.`,
        pathToTarget: path,
      });
      break;
    }
  }

  const finalPath = reconstructPath(previous, source, target);
  const lastStep = steps[steps.length - 1];
  if (lastStep && !lastStep.pathToTarget) {
    lastStep.pathToTarget = finalPath;
  }

  return steps;
}

function reconstructPath(
  previous: (number | null)[],
  source: number,
  target: number
): number[] {
  const path: number[] = [];
  let current: number | null = target;

  while (current !== null) {
    path.unshift(current);
    if (current === source) break;
    current = previous[current];
  }

  if (path[0] !== source) {
    return [];
  }

  return path;
}

function safeAdd(a: number, b: number): number {
  if (!Number.isFinite(a) || !Number.isFinite(b))
    return Number.POSITIVE_INFINITY;
  return a + b;
}

function displayCell(v: number): string {
  return Number.isFinite(v) ? String(v) : "∞";
}

export function labelFor(i: number): string {
  return String.fromCharCode("A".charCodeAt(0) + i);
}
