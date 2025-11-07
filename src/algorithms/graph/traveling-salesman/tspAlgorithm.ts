import { Matrix, INF } from "../../floyd/floydAlgorithm";

export type TSPStep = {
  iteration: number;
  mask: number;
  currentCity: number;
  visited: Set<number>;
  currentPath: number[];
  currentCost: number;
  dpState: Map<string, number>;
  explanation: string;
  bestTour?: number[];
  bestCost?: number;
};

export function labelFor(i: number): string {
  return String.fromCharCode("A".charCodeAt(0) + i);
}

export function displayCell(v: number): string {
  return Number.isFinite(v) ? String(v) : "∞";
}

// Helper to convert set to bitmask
// eslint-disable-next-line
function setToMask(visited: Set<number>, n: number): number {
  let mask = 0;
  for (const v of Array.from(visited)) {
    mask |= 1 << v;
  }
  return mask;
}

// Helper to convert bitmask to set
function maskToSet(mask: number, n: number): Set<number> {
  const set = new Set<number>();
  for (let i = 0; i < n; i++) {
    if (mask & (1 << i)) {
      set.add(i);
    }
  }
  return set;
}

// Helper to get DP key
function getDPKey(mask: number, city: number): string {
  return `${mask},${city}`;
}

export function tspSteps(graph: Matrix, start: number = 0): TSPStep[] {
  const n = graph.length;
  const steps: TSPStep[] = [];

  // Limit to reasonable size for visualization
  if (n > 7) {
    steps.push({
      iteration: 0,
      mask: 0,
      currentCity: start,
      visited: new Set(),
      currentPath: [],
      currentCost: 0,
      dpState: new Map(),
      explanation: `Graph too large (${n} vertices). TSP with Held-Karp algorithm is O(2^n * n^2). Maximum recommended size is 7 vertices for visualization.`,
    });
    return steps;
  }

  // DP table: dp[mask][last] = minimum cost to visit all cities in mask ending at last
  const dp = new Map<string, number>();
  const parent = new Map<string, number>();

  // Base case: starting at city 0 with only city 0 visited
  const startMask = 1 << start;
  const startKey = getDPKey(startMask, start);
  dp.set(startKey, 0);
  parent.set(startKey, -1);

  steps.push({
    iteration: 0,
    mask: startMask,
    currentCity: start,
    visited: new Set([start]),
    currentPath: [start],
    currentCost: 0,
    dpState: new Map(dp),
    explanation: `Initialization: Start at city ${labelFor(start)}. Cost = 0.`,
  });

  // Iterate over all possible subsets of cities
  const allCities = (1 << n) - 1;
  let iteration = 1;

  for (let mask = 1; mask <= allCities; mask++) {
    // Skip if start city is not in mask
    if (!(mask & (1 << start))) continue;

    // Try all cities as the last city in the current subset
    for (let last = 0; last < n; last++) {
      // Skip if last city is not in mask
      if (!(mask & (1 << last))) continue;

      const currentKey = getDPKey(mask, last);
      const currentCost = dp.get(currentKey);

      // If this state doesn't exist yet, skip
      if (currentCost === undefined) continue;

      // Try to extend to all unvisited cities
      for (let next = 0; next < n; next++) {
        // Skip if next is already visited or same as last
        if (mask & (1 << next) || next === last) continue;

        const edgeWeight = graph[last][next];
        if (!Number.isFinite(edgeWeight) || edgeWeight <= 0) continue;

        const newMask = mask | (1 << next);
        const newKey = getDPKey(newMask, next);
        const newCost = currentCost + edgeWeight;

        const existingCost = dp.get(newKey);
        if (existingCost === undefined || newCost < existingCost) {
          dp.set(newKey, newCost);
          parent.set(newKey, last);

          const visited = maskToSet(newMask, n);
          const path = reconstructPath(parent, newMask, next, start, n);

          steps.push({
            iteration,
            mask: newMask,
            currentCity: next,
            visited: new Set(visited),
            currentPath: path,
            currentCost: newCost,
            dpState: new Map(dp),
            explanation: `Extend tour: From ${labelFor(last)} → ${labelFor(next)} (cost: ${displayCell(edgeWeight)}). New cost: ${displayCell(newCost)}. Visited: ${Array.from(visited).map(labelFor).join(", ")}.`,
          });

          iteration++;
        }
      }
    }
  }

  // Find the best tour that visits all cities and returns to start
  let bestCost = INF;
  let bestLastCity = -1;
  const allVisitedMask = allCities;

  for (let last = 0; last < n; last++) {
    if (last === start) continue;
    const key = getDPKey(allVisitedMask, last);
    const cost = dp.get(key);
    if (cost !== undefined) {
      const returnCost = graph[last][start];
      if (Number.isFinite(returnCost) && returnCost > 0) {
        const totalCost = cost + returnCost;
        if (totalCost < bestCost) {
          bestCost = totalCost;
          bestLastCity = last;
        }
      }
    }
  }

  if (bestLastCity !== -1 && Number.isFinite(bestCost)) {
    const bestPath = reconstructPath(parent, allVisitedMask, bestLastCity, start, n);
    bestPath.push(start); // Return to start

    steps.push({
      iteration,
      mask: allVisitedMask,
      currentCity: start,
      visited: new Set(Array.from({ length: n }, (_, i) => i)),
      currentPath: bestPath,
      currentCost: bestCost,
      dpState: new Map(dp),
      explanation: `Complete tour found! Total cost: ${displayCell(bestCost)}. Tour: ${bestPath.map(labelFor).join(" → ")}.`,
      bestTour: bestPath,
      bestCost: bestCost,
    });
  } else {
    steps.push({
      iteration,
      mask: allVisitedMask,
      currentCity: start,
      visited: new Set(Array.from({ length: n }, (_, i) => i)),
      currentPath: [],
      currentCost: INF,
      dpState: new Map(dp),
      explanation: `No valid tour found. The graph may not be complete or may not have a Hamiltonian cycle.`,
    });
  }

  return steps;
}

function reconstructPath(
  parent: Map<string, number>,
  mask: number,
  last: number,
  start: number,
  n: number
): number[] {
  const path: number[] = [];
  let currentMask = mask;
  let currentCity = last;

  // Reconstruct path backwards
  while (true) {
    path.unshift(currentCity);
    
    // If we've reached the start, we're done
    if (currentCity === start && currentMask === (1 << start)) {
      break;
    }
    
    // Get the previous city from parent map
    const key = getDPKey(currentMask, currentCity);
    const prevCity = parent.get(key);
    
    if (prevCity === undefined || prevCity === -1) {
      // If no parent, try to reconstruct from start
      if (currentCity !== start) {
        path.shift(); // Remove the city we just added
      }
      break;
    }
    
    // Remove current city from mask to get previous mask
    currentMask &= ~(1 << currentCity);
    currentCity = prevCity;
    
    // Safety check to avoid infinite loops
    if (path.length > n) {
      break;
    }
  }

  return path;
}

