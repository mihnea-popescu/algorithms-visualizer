import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import GraphVisualization from "../../../components/GraphVisualization";
import {
  INF,
  Matrix,
  parseCell,
  emptyMatrix,
} from "../../floyd/floydAlgorithm";
import { primsSteps, PrimStep, labelFor } from "./primsAlgorithm";
import PrimsGraphView from "./PrimsGraphView";
import Footer from "../../../components/Footer";
import SEO from "../../../components/SEO";
import "../../../styles.css";

const DEFAULT_N = 5;
const DEFAULT_MATRIX: Matrix = [
  [0, 2, 0, 6, 0],
  [2, 0, 3, 8, 5],
  [0, 3, 0, 0, 7],
  [6, 8, 0, 0, 9],
  [0, 5, 7, 9, 0],
];

export default function PrimsPage() {
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
        // For undirected graph, use the value from either direction
        const val1 = parseCell(cells[i]?.[j] ?? "");
        const val2 = parseCell(cells[j]?.[i] ?? "");
        // Use the first non-INF value, or INF if both are INF
        if (Number.isFinite(val1) && val1 > 0) return val1;
        if (Number.isFinite(val2) && val2 > 0) return val2;
        return INF;
      })
    );
  }, [cells, n]);

  const [start, setStart] = useState<number>(0);
  const [steps, setSteps] = useState<PrimStep[] | null>(null);
  const [stepIndex, setStepIndex] = useState<number>(0);

  function handleNChange(newN: number) {
    const safeN = Math.max(1, Math.min(12, newN));
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
    const result = primsSteps(matrix, start);
    setSteps(result);
    setStepIndex(0);
  }

  const currentStep = steps?.[stepIndex] ?? null;

  return (
    <>
      <SEO
        title="Prim's Minimum Spanning Tree Algorithm"
        description="Interactive visualization of Prim's algorithm for finding the minimum spanning tree of a weighted undirected graph. Step-by-step visualization with edge selection and key updates."
        keywords="Prim, MST, minimum spanning tree, graph algorithm, greedy algorithm, graph theory, algorithm visualization"
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
            <h1 style={{ margin: 0 }}>Prim's Minimum Spanning Tree</h1>
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
                Start Vertex:&nbsp;
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
                    key[v] = min(key[v], weight(u, v))
                  </code>
                </div>
                <div className="formula-explanation">
                  <p>
                    <strong>Current Step:</strong> {currentStep.explanation}
                  </p>
                  <p>
                    Prim's algorithm grows the MST by adding the minimum-weight
                    edge that connects a vertex in the MST to a vertex outside
                    it. The key array stores the minimum weight edge connecting
                    each vertex to the current MST.
                  </p>
                  {currentStep.mstEdges.length > 0 && (
                    <p>
                      <strong>MST Edges:</strong>{" "}
                      {currentStep.mstEdges
                        .map(
                          (e) =>
                            `${labelFor(e.from)} → ${labelFor(e.to)} (${e.weight})`
                        )
                        .join(", ")}
                    </p>
                  )}
                  <p>
                    <strong>Time Complexity:</strong> O(V²) with adjacency
                    matrix (O((V + E) log V) with priority queue) - In each
                    iteration, we find the minimum key vertex (O(V)) and update
                    adjacent vertices (O(V)), resulting in O(V²) overall.
                  </p>
                  <p>
                    <strong>Space Complexity:</strong> O(V) - We store key,
                    parent, and inMST arrays for all V vertices.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Input Section */}
          <section>
            <h2>Input</h2>
            <p>
              Enter edge weights for undirected edges. Leave blank or use "∞" for
              no edge. The matrix is symmetric (edge from i to j is the same as
              j to i). Diagonal is fixed to 0.
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
              Visual representation of your adjacency matrix as an undirected
              graph. The algorithm finds the minimum spanning tree starting from
              vertex {labelFor(start)}.
            </p>
            {currentStep ? (
              <PrimsGraphView
                matrix={matrix}
                labels={labels}
                step={currentStep}
              />
            ) : (
              <GraphVisualization matrix={matrix} labels={labels} />
            )}
          </section>

          {/* Key Table */}
          {currentStep && (
            <section>
              <h2>Key and Parent Arrays</h2>
              <p>
                Current key values (minimum edge weight to connect each vertex
                to MST) and parent vertices:
              </p>
              <div className="matrix-wrapper">
                <table className="matrix">
                  <thead>
                    <tr>
                      <th>Vertex</th>
                      <th>Key</th>
                      <th>Parent</th>
                      <th>In MST</th>
                    </tr>
                  </thead>
                  <tbody>
                    {labels.map((label, idx) => {
                      const key = currentStep.key[idx];
                      const parent = currentStep.parent[idx];
                      const isInMST = currentStep.inMST.has(idx);
                      return (
                        <tr
                          key={idx}
                          style={{
                            backgroundColor: isInMST ? "#10b98120" : "transparent",
                          }}
                        >
                          <td>
                            <strong>{label}</strong>
                          </td>
                          <td>{key === Infinity ? "∞" : key}</td>
                          <td>{parent !== null ? labelFor(parent) : "—"}</td>
                          <td>{isInMST ? "Yes" : "No"}</td>
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
              >{`def prims_mst(graph, start):
    n = len(graph)
    key = [float('inf')] * n
    parent = [None] * n
    in_mst = [False] * n
    
    key[start] = 0
    
    for _ in range(n):
        # Find vertex with minimum key not in MST
        u = None
        min_key = float('inf')
        for v in range(n):
            if not in_mst[v] and key[v] < min_key:
                min_key = key[v]
                u = v
        
        if u is None:
            break
        
        in_mst[u] = True
        
        # Update key values of adjacent vertices
        for v in range(n):
            weight = graph[u][v]
            if (not in_mst[v] and 
                weight > 0 and 
                weight < key[v]):
                key[v] = weight
                parent[v] = u
    
    # Build MST edges
    mst_edges = []
    for v in range(n):
        if parent[v] is not None:
            mst_edges.append((parent[v], v, graph[parent[v]][v]))
    
    return mst_edges`}</code>
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

