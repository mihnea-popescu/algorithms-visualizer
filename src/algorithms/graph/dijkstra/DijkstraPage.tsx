import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import GraphVisualization from "../../../components/GraphVisualization";
import {
  INF,
  Matrix,
  parseCell,
  emptyMatrix,
} from "../../floyd/floydAlgorithm";
import { dijkstraSteps, DijkstraStep, labelFor } from "./dijkstraAlgorithm";
import DijkstraGraphView from "./DijkstraGraphView";
import Footer from "../../../components/Footer";
import SEO from "../../../components/SEO";
import "../../../styles.css";

const DEFAULT_N = 5;
const DEFAULT_MATRIX: Matrix = [
  [0, 4, 2, INF, INF],
  [INF, 0, 3, 2, 3],
  [INF, 1, 0, 4, 5],
  [INF, INF, INF, 0, INF],
  [INF, INF, INF, 1, 0],
];

export default function DijkstraPage() {
  const [n, setN] = useState<number>(DEFAULT_N);
  const [cells, setCells] = useState<string[][]>(
    DEFAULT_MATRIX.map((row) =>
      row.map((v) => (Number.isFinite(v) ? String(v) : ""))
    )
  );

  const labels = useMemo(
    () => Array.from({ length: n }, (_, i) => labelFor(i)),
    [n]
  );

  const matrix: Matrix = useMemo(() => {
    return Array.from({ length: n }, (_, i) =>
      Array.from({ length: n }, (_, j) =>
        i === j ? 0 : parseCell(cells[i]?.[j] ?? "")
      )
    );
  }, [cells, n]);

  const [source, setSource] = useState<number>(0);
  const [target, setTarget] = useState<number>(4);
  const [steps, setSteps] = useState<DijkstraStep[] | null>(null);
  const [stepIndex, setStepIndex] = useState<number>(0);

  function handleNChange(newN: number) {
    const safeN = Math.max(1, Math.min(12, newN));
    setN(safeN);
    const next = emptyMatrix(safeN).map((row, i) =>
      row.map((v, j) => (Number.isFinite(v) ? (i === j ? "0" : "") : ""))
    );
    setCells(next);
    setSteps(null);
    setStepIndex(0);
    setSource(Math.min(source, safeN - 1));
    setTarget(Math.min(target, safeN - 1));
  }

  function handleCellChange(i: number, j: number, val: string) {
    setCells((prev) => {
      const next = prev.map((r) => r.slice());
      next[i][j] = val;
      return next;
    });
  }

  function compute() {
    const result = dijkstraSteps(matrix, source, target);
    setSteps(result);
    setStepIndex(0);
  }

  const currentStep = steps?.[stepIndex] ?? null;

  return (
    <>
      <SEO
        title="Dijkstra's Algorithm"
        description="Interactive visualization of Dijkstra's algorithm for finding the shortest path between two nodes in a weighted graph. Step-by-step visualization with distance updates and path reconstruction."
        keywords="Dijkstra, shortest path, graph algorithm, single source shortest path, greedy algorithm, graph theory, algorithm visualization"
        ogType="article"
      />
      <div className="app">
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
          <h1 style={{ margin: 0 }}>Dijkstra's Algorithm</h1>
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
                min={1}
                max={12}
                value={n}
                onChange={(e) => handleNChange(Number(e.target.value))}
              />
            </label>
            <label>
              Source:&nbsp;
              <select
                value={source}
                onChange={(e) => {
                  setSource(Number(e.target.value));
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
            <label>
              Target:&nbsp;
              <select
                value={target}
                onChange={(e) => {
                  setTarget(Number(e.target.value));
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
                  dist[v] = min(dist[v], dist[u] + weight(u, v))
                </code>
              </div>
              <div className="formula-explanation">
                <p>
                  <strong>Current Step:</strong> {currentStep.explanation}
                </p>
                {currentStep.currentVertex !== null && (
                  <p>
                    Currently processing vertex{" "}
                    {labelFor(currentStep.currentVertex)}. The algorithm
                    maintains a distance array where dist[v] represents the
                    shortest known distance from the source to vertex v.
                  </p>
                )}
                {currentStep.pathToTarget && currentStep.pathToTarget.length > 0 && (
                  <p>
                    <strong>Shortest Path:</strong>{" "}
                    {currentStep.pathToTarget.map((v) => labelFor(v)).join(" → ")}{" "}
                    (Distance:{" "}
                    {currentStep.distances[target] === Infinity
                      ? "∞"
                      : currentStep.distances[target]}
                    )
                  </p>
                )}
                <p>
                  <strong>Time Complexity:</strong> O(n²) with adjacency matrix
                  (O((V + E) log V) with priority queue) - In each iteration,
                  we find the unvisited vertex with minimum distance (O(n)), and
                  we relax all its edges (O(n)), resulting in O(n²) overall.
                </p>
                <p>
                  <strong>Space Complexity:</strong> O(n) - We store distances
                  for all n vertices and a previous array for path
                  reconstruction.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Input Section */}
        <section>
          <h2>Input</h2>
          <p>
            Enter edge weights for directed edges. Leave blank or use "∞" for no
            edge. Diagonal is fixed to 0. Matrix[i][j] represents the weight of
            edge from vertex i to vertex j.
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
            Visual representation of your adjacency matrix as a directed graph.
            The algorithm finds the shortest path from {labelFor(source)} to{" "}
            {labelFor(target)}.
          </p>
          {currentStep ? (
            <DijkstraGraphView
              matrix={matrix}
              labels={labels}
              step={currentStep}
              source={source}
              target={target}
            />
          ) : (
            <GraphVisualization matrix={matrix} labels={labels} />
          )}
        </section>

        {/* Distance Table */}
        {currentStep && (
          <section>
            <h2>Distance Array</h2>
            <p>
              Current distances from source vertex {labelFor(source)} to all
              vertices:
            </p>
            <div className="matrix-wrapper">
              <table className="matrix">
                <thead>
                  <tr>
                    <th>Vertex</th>
                    <th>Distance</th>
                    <th>Previous</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {labels.map((label, idx) => {
                    const dist = currentStep.distances[idx];
                    const prev = currentStep.previous[idx];
                    const isVisited = currentStep.visited.has(idx);
                    const isCurrent = currentStep.currentVertex === idx;
                    return (
                      <tr
                        key={idx}
                        style={{
                          backgroundColor:
                            isCurrent || idx === currentStep.processing
                              ? "#f59e0b20"
                              : isVisited
                              ? "#3b82f620"
                              : "transparent",
                        }}
                      >
                        <td>
                          <strong>{label}</strong>
                        </td>
                        <td>
                          {dist === Infinity ? "∞" : dist}
                          {idx === source && " (source)"}
                          {idx === target && " (target)"}
                        </td>
                        <td>{prev !== null ? labelFor(prev) : "—"}</td>
                        <td>
                          {isCurrent ? "Current" : isVisited ? "Visited" : "Unvisited"}
                        </td>
                      </tr>
                    );
                  })}
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
            >{`def dijkstra(graph, source, target):
    n = len(graph)
    dist = [float('inf')] * n
    prev = [None] * n
    visited = set()
    
    dist[source] = 0
    
    for _ in range(n):
        # Find unvisited vertex with minimum distance
        u = None
        min_dist = float('inf')
        for v in range(n):
            if v not in visited and dist[v] < min_dist:
                min_dist = dist[v]
                u = v
        
        if u is None or min_dist == float('inf'):
            break
        
        visited.add(u)
        
        # Relax edges from u
        for v in range(n):
            if v in visited:
                continue
            weight = graph[u][v]
            if weight > 0 and weight != float('inf'):
                alt = dist[u] + weight
                if alt < dist[v]:
                    dist[v] = alt
                    prev[v] = u
        
        if u == target:
            break
    
    # Reconstruct path
    path = []
    current = target
    while current is not None:
        path.insert(0, current)
        if current == source:
            break
        current = prev[current]
    
    return dist[target], path`}</code>
          </pre>
        </section>

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

