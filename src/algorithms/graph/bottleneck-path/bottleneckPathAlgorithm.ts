import { Matrix, INF } from "../../floyd/floydAlgorithm";

export type BottleneckStep = {
  iteration: number;
  currentVertex: number | null;
  bottlenecks: number[];
  previous: (number | null)[];
  visited: Set<number>;
  processing: number | null;
  explanation: string;
  pathToTarget?: number[];
};

export function bottleneckPathSteps(
  graph: Matrix,
  source: number,
  target: number
): BottleneckStep[] {
  const n = graph.length;
  const bottlenecks: number[] = Array(n).fill(INF);
  const previous: (number | null)[] = Array(n).fill(null);
  const visited = new Set<number>();
  const steps: BottleneckStep[] = [];

  bottlenecks[source] = 0;
  steps.push({
    iteration: 0,
    currentVertex: null,
    bottlenecks: [...bottlenecks],
    previous: [...previous],
    visited: new Set(visited),
    processing: source,
    explanation: `Initialization: Set bottleneck to source vertex ${labelFor(
      source
    )} to 0, all others to ∞.`,
  });

  for (let iteration = 1; iteration <= n; iteration++) {
    let minBottleneck = INF;
    let current: number | null = null;

    for (let v = 0; v < n; v++) {
      if (!visited.has(v) && bottlenecks[v] < minBottleneck) {
        minBottleneck = bottlenecks[v];
        current = v;
      }
    }

    if (current === null || minBottleneck === INF) {
      break;
    }

    visited.add(current);
    const explanation = `Select vertex ${labelFor(
      current
    )} with minimum bottleneck ${displayCell(bottlenecks[current])}.`;

    steps.push({
      iteration,
      currentVertex: current,
      bottlenecks: [...bottlenecks],
      previous: [...previous],
      visited: new Set(visited),
      processing: current,
      explanation,
    });

    for (let neighbor = 0; neighbor < n; neighbor++) {
      if (visited.has(neighbor)) continue;

      const edgeWeight = graph[current][neighbor];
      if (!Number.isFinite(edgeWeight) || edgeWeight <= 0) continue;

      const newBottleneck = Math.max(bottlenecks[current], edgeWeight);
      if (newBottleneck < bottlenecks[neighbor]) {
        const oldBottleneck = bottlenecks[neighbor];
        bottlenecks[neighbor] = newBottleneck;
        previous[neighbor] = current;
        steps.push({
          iteration,
          currentVertex: current,
          bottlenecks: [...bottlenecks],
          previous: [...previous],
          visited: new Set(visited),
          processing: neighbor,
          explanation: `Relax edge ${labelFor(current)} → ${labelFor(
            neighbor
          )}: bottleneck[${labelFor(neighbor)}] = min(${displayCell(
            oldBottleneck
          )}, max(${displayCell(bottlenecks[current])}, ${displayCell(
            edgeWeight
          )})) = ${displayCell(newBottleneck)}.`,
        });
      }
    }

    if (current === target) {
      const path = reconstructPath(previous, source, target);
      steps.push({
        iteration,
        currentVertex: current,
        bottlenecks: [...bottlenecks],
        previous: [...previous],
        visited: new Set(visited),
        processing: null,
        explanation: `Target vertex ${labelFor(
          target
        )} reached! Minimum bottleneck: ${displayCell(bottlenecks[target])}.`,
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

function displayCell(v: number): string {
  return Number.isFinite(v) ? String(v) : "∞";
}

export function labelFor(i: number): string {
  return String.fromCharCode("A".charCodeAt(0) + i);
}

