import React, { useMemo, useState } from "react";
import MatrixTable from "./algorithms/floyd/FloydMatrixTable";
import GraphVisualization from "./components/GraphVisualization";
import {
  INF,
  Matrix,
  Step,
  emptyMatrix,
  floydWarshallSteps,
  parseCell,
} from "./algorithms/floyd/floydAlgorithm";
import "./styles.css";

const DEFAULT_N = 4;
// A small default graph with some edges:
const DEFAULT_MATRIX: Matrix = [
  [0, 1, INF, 4],
  [INF, 0, 5, 2],
  [INF, INF, 0, INF],
  [INF, INF, 1, 0],
];

function labelFor(i: number): string {
  // A, B, C, D, ... (works up to 26 nicely)
  return String.fromCharCode("A".charCodeAt(0) + i);
}

export default function App() {
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
    // ensure diagonal is 0, parse other cells
    return Array.from({ length: n }, (_, i) =>
      Array.from({ length: n }, (_, j) =>
        i === j ? 0 : parseCell(cells[i]?.[j] ?? "")
      )
    );
  }, [cells, n]);

  const [steps, setSteps] = useState<Step[] | null>(null);
  const [stepIndex, setStepIndex] = useState<number>(0);

  function handleNChange(newN: number) {
    const safeN = Math.max(1, Math.min(12, newN)); // keep it reasonable
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
    <div className="app">
      <h1>Floyd–Warshall Visualizer</h1>

      <section className="controls">
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
                  setStepIndex((i) => Math.min((steps?.length ?? 1) - 1, i + 1))
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
              {`k = ${currentStep?.k}  (${
                labels[currentStep!.k - 1]
              } allowed as intermediate)`}
            </div>
          </div>
        )}
      </section>

      {currentStep && (
        <section className="formula-section">
          <h2>Floyd-Warshall Formula</h2>
          <div className="formula-box">
            <div className="formula-main">
              <code>dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])</code>
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
                <code>dist[i][k] + dist[k][j] &lt; dist[i][j]</code>, we update
                the distance.
              </p>
              <p>
                <strong>Updates in this step:</strong>{" "}
                {currentStep.updates.size} cells were improved.
              </p>
            </div>
          </div>
        </section>
      )}

      <section>
        <h2>Adjacency matrix (input)</h2>
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

      <section>
        <h2>Graph Visualization</h2>
        <p>
          Visual representation of your adjacency matrix as a directed graph.
          Arrows show edge direction.
        </p>
        <GraphVisualization matrix={matrix} labels={labels} />
      </section>

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
            Cells highlighted were improved during this k-step. Hover over cells
            to see calculation details.
          </p>
        )}
      </section>
    </div>
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
