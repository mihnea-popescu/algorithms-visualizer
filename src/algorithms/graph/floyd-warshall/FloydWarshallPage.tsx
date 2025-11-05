import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import MatrixTable from "../../floyd/FloydMatrixTable";
import GraphVisualization from "../../../components/GraphVisualization";
import {
  INF,
  Matrix,
  Step,
  emptyMatrix,
  floydWarshallSteps,
  parseCell,
} from "../../floyd/floydAlgorithm";
import Footer from "../../../components/Footer";
import SEO from "../../../components/SEO";
import "../../../styles.css";

const DEFAULT_N = 4;
const DEFAULT_MATRIX: Matrix = [
  [0, 1, INF, 4],
  [INF, 0, 5, 2],
  [INF, INF, 0, INF],
  [INF, INF, 1, 0],
];

function labelFor(i: number): string {
  return String.fromCharCode("A".charCodeAt(0) + i);
}

export default function FloydWarshallPage() {
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

  const [steps, setSteps] = useState<Step[] | null>(null);
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
  }

  function handleCellChange(i: number, j: number, val: string) {
    setCells((prev) => {
      const next = prev.map((r) => r.slice());
      next[i][j] = val;
      return next;
    });
  }

  function compute() {
    const result = floydWarshallSteps(matrix);
    setSteps(result);
    setStepIndex(0);
  }

  const currentStep = steps?.[stepIndex] ?? null;

  return (
    <>
      <SEO
        title="Floyd–Warshall Algorithm"
        description="Interactive visualization of the Floyd–Warshall algorithm for finding shortest paths between all pairs of vertices in a weighted graph. Step-by-step visualization with matrix updates and graph representation."
        keywords="Floyd-Warshall, shortest path, graph algorithm, all pairs shortest path, dynamic programming, graph theory, algorithm visualization"
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
          <h1 style={{ margin: 0 }}>Floyd–Warshall Algorithm</h1>
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
                {`Step k = ${currentStep?.k} (${
                  labels[currentStep!.k - 1]
                } allowed as intermediate)`}
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
                  dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])
                </code>
              </div>
              <div className="formula-explanation">
                <p>
                  <strong>
                    Step k = {currentStep.k} ({labels[currentStep.k - 1]}):
                  </strong>{" "}
                  We allow vertex {labels[currentStep.k - 1]} as an intermediate
                  vertex.
                </p>
                <p>
                  For each pair of vertices (i, j), we check if going through
                  vertex {labels[currentStep.k - 1]} gives us a shorter path. If{" "}
                  <code>dist[i][k] + dist[k][j] &lt; dist[i][j]</code>, we
                  update the distance.
                </p>
                <p>
                  <strong>Updates in this step:</strong>{" "}
                  {currentStep.updates.size} cells were improved.
                </p>
                <p>
                  <strong>Time Complexity:</strong> O(n³) - We iterate through
                  all pairs of vertices (i, j) for each intermediate vertex k,
                  resulting in three nested loops over n vertices.
                </p>
                <p>
                  <strong>Space Complexity:</strong> O(n²) - We store an n×n
                  distance matrix to keep track of shortest paths between all
                  pairs of vertices.
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
            Arrows show edge direction.
          </p>
          <GraphVisualization matrix={matrix} labels={labels} />
        </section>

        {/* Distance Matrix Visualization */}
        <section>
          <h2>
            Distance matrix{" "}
            {steps ? `after k = ${currentStep!.k}` : "(press Compute)"}
          </h2>
          {currentStep ? (
            <MatrixTable
              matrix={currentStep.matrix}
              updates={currentStep.updates}
              headers={labels}
              debug={currentStep.debug}
            />
          ) : (
            <MatrixTable matrix={matrix} headers={labels} />
          )}
          {currentStep && (
            <p className="legend">
              Cells highlighted were improved during this k-step. Hover over
              cells to see calculation details.
            </p>
          )}
        </section>

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
            >{`for k in range(n):
    for i in range(n):
        for j in range(n):
            dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])`}</code>
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
