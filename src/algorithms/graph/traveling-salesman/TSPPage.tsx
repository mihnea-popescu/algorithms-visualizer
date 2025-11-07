import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import GraphVisualization from "../../../components/GraphVisualization";
import {
  INF,
  Matrix,
  parseCell,
  emptyMatrix,
} from "../../floyd/floydAlgorithm";
import { tspSteps, TSPStep, labelFor, displayCell } from "./tspAlgorithm";
import TSPGraphView from "./TSPGraphView";
import Footer from "../../../components/Footer";
import SEO from "../../../components/SEO";
import "../../../styles.css";

const DEFAULT_N = 4;
const DEFAULT_MATRIX: Matrix = [
  [0, 10, 15, 20],
  [10, 0, 35, 25],
  [15, 35, 0, 30],
  [20, 25, 30, 0],
];

const TSP_FORMULA = "dp[mask][last] = min(dp[mask][last], dp[mask\\{last\\}][prev] + cost(prev, last))";

export default function TSPPage() {
  const [n, setN] = useState<number>(DEFAULT_N);
  const [cells, setCells] = useState<string[][]>(
    DEFAULT_MATRIX.map((row) =>
      row.map((v) => (Number.isFinite(v) && v > 0 ? String(v) : ""))
    )
  );

  const labels = useMemo(
    () => Array.from({ length: n }, (_, i) => labelFor(i)),
    [n]
  );

  const matrix: Matrix = useMemo(() => {
    return Array.from({ length: n }, (_, i) =>
      Array.from({ length: n }, (_, j) => {
        if (i === j) return 0;
        const val1 = parseCell(cells[i]?.[j] ?? "");
        const val2 = parseCell(cells[j]?.[i] ?? "");
        if (Number.isFinite(val1) && val1 > 0) return val1;
        if (Number.isFinite(val2) && val2 > 0) return val2;
        return INF;
      })
    );
  }, [cells, n]);

  const [start, setStart] = useState<number>(0);
  const [steps, setSteps] = useState<TSPStep[] | null>(null);
  const [stepIndex, setStepIndex] = useState<number>(0);

  function handleNChange(newN: number) {
    const safeN = Math.max(2, Math.min(7, newN)); // Limit to 7 for TSP visualization
    setN(safeN);
    const next = emptyMatrix(safeN).map((row, i) =>
      row.map((v, j) => (i === j ? "0" : ""))
    );
    setCells(next);
    setSteps(null);
    setStepIndex(0);
    setStart(Math.min(start, safeN - 1));
  }

  function handleCellChange(i: number, j: number, val: string) {
    setCells((prev) => {
      const next = prev.map((r) => r.slice());
      next[i][j] = val;
      return next;
    });
  }

  function compute() {
    const result = tspSteps(matrix, start);
    setSteps(result);
    setStepIndex(0);
  }

  const currentStep = steps?.[stepIndex] ?? null;

  return (
    <>
      <SEO
        title="Traveling Salesman Problem (TSP)"
        description="Interactive visualization of the Traveling Salesman Problem using Held-Karp dynamic programming algorithm. Find the shortest route visiting each city exactly once and returning to the start."
        keywords="TSP, traveling salesman problem, Held-Karp, dynamic programming, Hamiltonian cycle, graph algorithm, optimization, algorithm visualization"
        ogType="article"
      />
      <div className="app">
        <div className="container">
          {/* Header */}
          <header
            style={{
              marginBottom: "2rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              alignItems: "flex-start",
            }}
          >
            <Link to="/" style={{ textDecoration: "none" }}>
              <button style={{ padding: "0.5rem 1rem", fontSize: "1rem" }}>
                🏠 Home
              </button>
            </Link>
            <h1 style={{ margin: 0 }}>Traveling Salesman Problem</h1>
          </header>

          {/* Controls */}
          <section
            className="controls"
            style={{
              position: "sticky",
              top: 0,
              zIndex: 100,
              backgroundColor: "var(--panel)",
            }}
          >
            <div className="row">
              <label>
                Size (n×n):&nbsp;
                <input
                  type="number"
                  min={2}
                  max={7}
                  value={n}
                  onChange={(e) => handleNChange(Number(e.target.value))}
                />
                <span style={{ fontSize: "0.85rem", color: "var(--muted)", marginLeft: "0.5rem" }}>
                  (max 7 for visualization)
                </span>
              </label>
              <label>
                Start City:&nbsp;
                <select
                  value={start}
                  onChange={(e) => {
                    setStart(Number(e.target.value));
                    setSteps(null);
                    setStepIndex(0);
                  }}
                >
                  {labels.map((label, idx) => (
                    <option key={idx} value={idx}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <button onClick={compute} className="primary">
                Compute
              </button>
              {steps && (
                <>
                  <button
                    onClick={() => setStepIndex(0)}
                    disabled={stepIndex === 0}
                  >
                    ⏮
                  </button>
                  <button
                    onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
                    disabled={stepIndex === 0}
                  >
                    ◀
                  </button>
                  <button
                    onClick={() =>
                      setStepIndex((i) =>
                        Math.min((steps?.length ?? 1) - 1, i + 1)
                      )
                    }
                    disabled={stepIndex === steps!.length - 1}
                  >
                    ▶
                  </button>
                  <button
                    onClick={() => setStepIndex(steps!.length - 1)}
                    disabled={stepIndex === steps!.length - 1}
                  >
                    ⏭
                  </button>
                </>
              )}
            </div>

            {steps && (
              <div className="row">
                <input
                  type="range"
                  min={0}
                  max={steps.length - 1}
                  value={stepIndex}
                  onChange={(e) => setStepIndex(Number(e.target.value))}
                />
                <div className="step-label">
                  Step {stepIndex + 1} / {steps.length}
                </div>
              </div>
            )}
          </section>

          {/* Mathematical Explanation */}
          {currentStep && (
            <section className="formula-section">
              <h2>Mathematical Explanation</h2>
              <div className="formula-box">
                <div className="formula-main">
                  <code>
                    {TSP_FORMULA}
                  </code>
                </div>
                <div className="formula-explanation">
                  <p>
                    <strong>Current Step:</strong> {currentStep.explanation}
                  </p>
                  <p>
                    The Held-Karp algorithm uses dynamic programming to solve TSP.
                    For each subset of cities (represented as a bitmask) and each
                    possible last city in that subset, we store the minimum cost
                    to visit all cities in the subset ending at that city.
                  </p>
                  {currentStep.currentPath.length > 0 && (
                    <p>
                      <strong>Current Path:</strong>{" "}
                      {currentStep.currentPath.map(labelFor).join(" → ")}
                      {currentStep.currentPath.length === n &&
                        currentStep.currentPath[0] === start && (
                          <span> → {labelFor(start)}</span>
                        )}
                    </p>
                  )}
                  {currentStep.currentCost < INF && (
                    <p>
                      <strong>Current Cost:</strong> {displayCell(currentStep.currentCost)}
                    </p>
                  )}
                  {currentStep.bestTour && currentStep.bestCost !== undefined && (
                    <p>
                      <strong>Best Tour Found:</strong>{" "}
                      {currentStep.bestTour.map(labelFor).join(" → ")} → {labelFor(start)} (Cost: {displayCell(currentStep.bestCost)})
                    </p>
                  )}
                  <p>
                    <strong>Time Complexity:</strong> O(2^n × n²) - We iterate
                    over all 2^n subsets of cities and for each subset, we
                    consider all n cities as the last city and all n cities as
                    the next city.
                  </p>
                  <p>
                    <strong>Space Complexity:</strong> O(2^n × n) - We store a
                    DP state for each (subset, last city) pair.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Input Section */}
          <section>
            <h2>Input</h2>
            <p>
              Enter edge weights for the distance matrix. The graph should be
              complete (all cities should be reachable from each other) for TSP
              to work. Leave blank or use "∞" for no edge. Diagonal is fixed to
              0.
            </p>
            <EditableMatrix
              n={n}
              cells={cells}
              onChange={handleCellChange}
              headers={labels}
            />
          </section>

          {/* Visualization */}
          <section>
            <h2>Graph Visualization</h2>
            <p>
              Visual representation of your distance matrix. The algorithm finds
              the shortest tour visiting each city exactly once and returning to
              the start city {labelFor(start)}.
            </p>
            {currentStep ? (
              <TSPGraphView
                matrix={matrix}
                labels={labels}
                step={currentStep}
                start={start}
              />
            ) : (
              <GraphVisualization matrix={matrix} labels={labels} />
            )}
          </section>

          {/* DP State Table */}
          {currentStep && currentStep.dpState.size > 0 && (
            <section>
              <h2>Dynamic Programming State</h2>
              <p>
                Current DP table entries. Each entry represents the minimum cost
                to visit a subset of cities ending at a specific city:
              </p>
              <div className="matrix-wrapper">
                <table className="matrix">
                  <thead>
                    <tr>
                      <th>Subset (Mask)</th>
                      <th>Last City</th>
                      <th>Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from(currentStep.dpState.entries())
                      .slice(0, 20)
                      .map(([key, cost], idx) => {
                        const [maskStr, cityStr] = key.split(",");
                        const mask = parseInt(maskStr);
                        const city = parseInt(cityStr);
                        const cities = [];
                        for (let i = 0; i < n; i++) {
                          if (mask & (1 << i)) {
                            cities.push(labelFor(i));
                          }
                        }
                        return (
                          <tr key={idx}>
                            <td>
                              <strong>
                                {cities.length > 0 ? cities.join(", ") : "∅"}
                              </strong>
                            </td>
                            <td>{labelFor(city)}</td>
                            <td>{displayCell(cost)}</td>
                          </tr>
                        );
                      })}
                    {currentStep.dpState.size > 20 && (
                      <tr>
                        <td colSpan={3} style={{ textAlign: "center", color: "var(--muted)" }}>
                          ... and {currentStep.dpState.size - 20} more entries
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Code Preview */}
          <section>
            <h2>Algorithm Implementation</h2>
            <pre
              style={{
                backgroundColor: "#0f1722",
                border: "1px solid #213040",
                padding: "1rem",
                borderRadius: "8px",
                overflowX: "auto",
                color: "#e7edf5",
              }}
            >
              <code
                style={{
                  fontFamily: "'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
                  fontSize: "14px",
                  color: "#60a5fa",
                  lineHeight: "1.6",
                }}
              >{`def tsp_held_karp(graph, start):
    n = len(graph)
    # dp[mask][last] = minimum cost to visit all cities in mask ending at last
    dp = {}
    parent = {}
    
    # Base case: starting at city 0
    start_mask = 1 << start
    dp[(start_mask, start)] = 0
    parent[(start_mask, start)] = -1
    
    all_cities = (1 << n) - 1
    
    # Iterate over all subsets
    for mask in range(1, all_cities + 1):
        if not (mask & (1 << start)):
            continue
        
        # Try all cities as last city in subset
        for last in range(n):
            if not (mask & (1 << last)):
                continue
            
            if (mask, last) not in dp:
                continue
            
            # Extend to unvisited cities
            for next_city in range(n):
                if (mask & (1 << next_city)) or next_city == last:
                    continue
                
                edge_weight = graph[last][next_city]
                if edge_weight <= 0:
                    continue
                
                new_mask = mask | (1 << next_city)
                new_cost = dp[(mask, last)] + edge_weight
                
                if (new_mask, next_city) not in dp or new_cost < dp[(new_mask, next_city)]:
                    dp[(new_mask, next_city)] = new_cost
                    parent[(new_mask, next_city)] = last
    
    # Find best tour returning to start
    best_cost = float('inf')
    best_last = -1
    
    for last in range(n):
        if last == start:
            continue
        if (all_cities, last) in dp:
            return_cost = graph[last][start]
            if return_cost > 0:
                total = dp[(all_cities, last)] + return_cost
                if total < best_cost:
                    best_cost = total
                    best_last = last
    
    # Reconstruct path
    if best_last != -1:
        path = reconstruct_path(parent, all_cities, best_last, start)
        path.append(start)
        return path, best_cost
    
    return None, float('inf')`}</code>
            </pre>
          </section>
        </div>
        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}

type EditableMatrixProps = {
  n: number;
  cells: string[][];
  onChange: (i: number, j: number, val: string) => void;
  headers?: string[];
};

function EditableMatrix({ n, cells, onChange, headers }: EditableMatrixProps) {
  return (
    <div className="matrix-wrapper">
      <table className="matrix editable">
        <thead>
          <tr>
            <th></th>
            {Array.from({ length: n }, (_, j) => (
              <th key={j}>{headers?.[j] ?? j}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: n }, (_, i) => (
            <tr key={i}>
              <th>{headers?.[i] ?? i}</th>
              {Array.from({ length: n }, (_, j) => (
                <td key={j}>
                  {i === j ? (
                    <div className="diag">0</div>
                  ) : (
                    <input
                      value={cells[i]?.[j] ?? ""}
                      onChange={(e) => onChange(i, j, e.target.value)}
                      placeholder="∞"
                      inputMode="numeric"
                    />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

