import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import GraphVisualization from "../../../components/GraphVisualization";
import {
  INF,
  Matrix,
  parseCell,
  emptyMatrix,
} from "../../floyd/floydAlgorithm";
import { kruskalsSteps, KruskalStep, labelFor } from "./kruskalsAlgorithm";
import KruskalsGraphView from "./KruskalsGraphView";
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

export default function KruskalsPage() {
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

  const [steps, setSteps] = useState<KruskalStep[] | null>(null);
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
  }

  function handleCellChange(i: number, j: number, val: string) {
    setCells((prev) => {
      const next = prev.map((r) => r.slice());
      next[i][j] = val;
      return next;
    });
  }

  function compute() {
    const result = kruskalsSteps(matrix);
    setSteps(result);
    setStepIndex(0);
  }

  const currentStep = steps?.[stepIndex] ?? null;

  return (
    <>
      <SEO
        title="Kruskal's Minimum Spanning Tree Algorithm"
        description="Interactive visualization of Kruskal's algorithm for finding the minimum spanning tree of a weighted undirected graph. Step-by-step visualization with edge sorting and cycle detection using Union-Find."
        keywords="Kruskal, MST, minimum spanning tree, graph algorithm, greedy algorithm, union-find, graph theory, algorithm visualization"
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
            <h1 style={{ margin: 0 }}>Kruskal's Minimum Spanning Tree</h1>
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
                    if find(u) ≠ find(v): union(u, v)
                  </code>
                </div>
                <div className="formula-explanation">
                  <p>
                    <strong>Current Step:</strong> {currentStep.explanation}
                  </p>
                  <p>
                    Kruskal's algorithm sorts all edges by weight and adds them
                    to the MST in order, as long as they don't create a cycle.
                    Union-Find data structure is used to efficiently detect
                    cycles.
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
                    <strong>Time Complexity:</strong> O(E log E) - Sorting edges
                    takes O(E log E), and Union-Find operations take nearly
                    O(1) amortized time with path compression and union by rank.
                  </p>
                  <p>
                    <strong>Space Complexity:</strong> O(V) - We store parent
                    and rank arrays for Union-Find, plus the sorted edge list
                    O(E).
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
              graph. The algorithm finds the minimum spanning tree by sorting
              edges and adding them greedily.
            </p>
            {currentStep ? (
              <KruskalsGraphView
                matrix={matrix}
                labels={labels}
                step={currentStep}
              />
            ) : (
              <GraphVisualization matrix={matrix} labels={labels} />
            )}
          </section>

          {/* Sorted Edges Table */}
          {currentStep && (
            <section>
              <h2>Sorted Edges</h2>
              <p>
                All edges sorted by weight. Green edges are in MST, red edges
                were rejected (would create cycle):
              </p>
              <div className="matrix-wrapper">
                <table className="matrix">
                  <thead>
                    <tr>
                      <th>Edge</th>
                      <th>Weight</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentStep.sortedEdges.map((edge, idx) => {
                      const isInMST = currentStep.mstEdges.some(
                        (e) =>
                          (e.from === edge.from && e.to === edge.to) ||
                          (e.from === edge.to && e.to === edge.from)
                      );
                      const isRejected =
                        currentStep.rejectedEdge &&
                        ((currentStep.rejectedEdge.from === edge.from &&
                          currentStep.rejectedEdge.to === edge.to) ||
                          (currentStep.rejectedEdge.from === edge.to &&
                            currentStep.rejectedEdge.to === edge.from));
                      const isConsidered =
                        currentStep.consideredEdge &&
                        ((currentStep.consideredEdge.from === edge.from &&
                          currentStep.consideredEdge.to === edge.to) ||
                          (currentStep.consideredEdge.from === edge.to &&
                            currentStep.consideredEdge.to === edge.from));

                      return (
                        <tr
                          key={idx}
                          style={{
                            backgroundColor: isInMST
                              ? "#10b98120"
                              : isRejected
                              ? "#ef444420"
                              : isConsidered
                              ? "#f59e0b20"
                              : "transparent",
                          }}
                        >
                          <td>
                            <strong>
                              {labelFor(edge.from)} → {labelFor(edge.to)}
                            </strong>
                          </td>
                          <td>{edge.weight}</td>
                          <td>
                            {isInMST
                              ? "In MST"
                              : isRejected
                              ? "Rejected (Cycle)"
                              : isConsidered
                              ? "Considering"
                              : "Not Yet"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Union-Find Table */}
          {currentStep && (
            <section>
              <h2>Union-Find Structure</h2>
              <p>
                Current parent and rank arrays used for cycle detection:
              </p>
              <div className="matrix-wrapper">
                <table className="matrix">
                  <thead>
                    <tr>
                      <th>Vertex</th>
                      <th>Parent</th>
                      <th>Rank</th>
                    </tr>
                  </thead>
                  <tbody>
                    {labels.map((label, idx) => {
                      const parent = currentStep.parent[idx];
                      const rank = currentStep.rank[idx];
                      return (
                        <tr key={idx}>
                          <td>
                            <strong>{label}</strong>
                          </td>
                          <td>
                            {parent === idx ? (
                              <span style={{ color: "#9bb0c3" }}>Root</span>
                            ) : (
                              labelFor(parent)
                            )}
                          </td>
                          <td>{rank}</td>
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
              >{`class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
    
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])  # Path compression
        return self.parent[x]
    
    def union(self, x, y):
        root_x = self.find(x)
        root_y = self.find(y)
        
        if root_x == root_y:
            return False  # Same set, would create cycle
        
        # Union by rank
        if self.rank[root_x] < self.rank[root_y]:
            self.parent[root_x] = root_y
        elif self.rank[root_x] > self.rank[root_y]:
            self.parent[root_y] = root_x
        else:
            self.parent[root_y] = root_x
            self.rank[root_x] += 1
        
        return True

def kruskals_mst(graph):
    n = len(graph)
    edges = []
    
    # Collect all edges
    for i in range(n):
        for j in range(i + 1, n):
            if graph[i][j] > 0:
                edges.append((i, j, graph[i][j]))
    
    # Sort edges by weight
    edges.sort(key=lambda x: x[2])
    
    uf = UnionFind(n)
    mst_edges = []
    
    for u, v, weight in edges:
        if uf.union(u, v):
            mst_edges.append((u, v, weight))
            if len(mst_edges) == n - 1:
                break
    
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

