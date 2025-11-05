import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MatrixChainTable from "./MatrixChainTable";
import {
  Step,
  matrixChainSteps,
  getOptimalParenthesization,
  displayCell,
} from "./matrixChainAlgorithm";
import Footer from "../../../components/Footer";
import SEO from "../../../components/SEO";
import "../../../styles.css";

interface MatrixInput {
  rows: number;
  cols: number;
}

const DEFAULT_MATRICES: MatrixInput[] = [
  { rows: 10, cols: 20 },
  { rows: 20, cols: 30 },
  { rows: 30, cols: 40 },
  { rows: 40, cols: 30 },
];

export default function MatrixChainPage() {
  const [matrices, setMatrices] = useState<MatrixInput[]>(DEFAULT_MATRICES);

  const [steps, setSteps] = useState<Step[] | null>(null);
  const [stepIndex, setStepIndex] = useState<number>(0);

  // Convert matrices to dimensions array
  const dimensions = useMemo(() => {
    if (matrices.length === 0) return [];
    const dims: number[] = [matrices[0].rows];
    for (let i = 0; i < matrices.length; i++) {
      dims.push(matrices[i].cols);
    }
    return dims;
  }, [matrices]);

  // Reset steps when matrices change
  useEffect(() => {
    setSteps(null);
    setStepIndex(0);
  }, [matrices]);

  function addMatrix() {
    setMatrices([...matrices, { rows: 1, cols: 1 }]);
  }

  function removeMatrix(index: number) {
    if (matrices.length <= 1) return;
    setMatrices(matrices.filter((_, i) => i !== index));
  }

  function updateMatrix(index: number, field: "rows" | "cols", value: number) {
    const newMatrices = [...matrices];
    newMatrices[index] = { ...newMatrices[index], [field]: value };
    setMatrices(newMatrices);
  }

  function compute() {
    if (dimensions.length < 2) {
      alert("Please enter at least 2 dimensions");
      return;
    }
    const result = matrixChainSteps(dimensions);
    setSteps(result);
    setStepIndex(0);
  }

  const currentStep = steps?.[stepIndex] ?? null;
  const n = dimensions.length - 1; // Number of matrices

  const optimalParenthesization = useMemo(() => {
    if (!steps || steps.length === 0) return "";
    const finalStep = steps[steps.length - 1];
    return getOptimalParenthesization(finalStep.split, 0, n - 1);
  }, [steps, n]);

  const totalCost = useMemo(() => {
    if (!steps || steps.length === 0) return null;
    const finalStep = steps[steps.length - 1];
    return finalStep.matrix[0][n - 1];
  }, [steps, n]);

  return (
    <>
      <SEO
        title="Matrix Chain Multiplication"
        description="Interactive visualization of the Matrix Chain Multiplication dynamic programming algorithm. Find the optimal way to parenthesize matrix multiplication to minimize scalar multiplications. Step-by-step visualization with DP tables."
        keywords="matrix chain multiplication, dynamic programming, optimal parenthesization, DP algorithm, algorithm visualization, matrix multiplication"
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
          <h1 style={{ margin: 0 }}>Matrix Chain Multiplication</h1>
        </header>

        {/* Controls */}
        <section
          className="controls"
          style={{
            position: "sticky",
            top: 0,
            backgroundColor: "var(--panel)",
            zIndex: 100,
            marginBottom: "1rem",
          }}
        >
          <div className="row">
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
                Step {stepIndex + 1} of {steps.length}: 
                {currentStep?.currentK !== undefined 
                  ? ` Evaluating split at k = ${currentStep.currentK} for m[${currentStep?.i}][${currentStep?.j}]`
                  : ` Final result for m[${currentStep?.i}][${currentStep?.j}]`}
              </div>
            </div>
          )}
        </section>

        {/* Input Section */}
        <section>
          <h2>Input</h2>
          <p>
            Enter the dimensions of each matrix. Each matrix has rows × columns.
            The goal is to find the optimal parenthesization that minimizes the
            number of scalar multiplications.
          </p>
          {dimensions.length > 0 && (
            <div style={{ 
              marginTop: "1rem", 
              padding: "1rem", 
              backgroundColor: "#1a2332",
              borderRadius: "8px",
              border: "1px solid #213040"
            }}>
              <p style={{ marginBottom: "0.5rem" }}>
                <strong>Dimensions Array (p[]):</strong> The algorithm converts your matrices into a dimensions array p[].
              </p>
              <p style={{ marginBottom: "0.5rem", fontSize: "0.9rem", color: "#a0a0a0" }}>
                For {matrices.length} matrices, p[] has {dimensions.length} elements: p = [{dimensions.join(", ")}]
              </p>
              <p style={{ marginBottom: "0.5rem", fontSize: "0.9rem", color: "#a0a0a0" }}>
                Matrix A<sub>i</sub> has dimensions p[i] × p[i+1]:
              </p>
              <ul style={{ marginLeft: "1.5rem", fontSize: "0.9rem", color: "#a0a0a0" }}>
                {matrices.map((matrix, idx) => (
                  <li key={idx}>
                    A<sub>{idx + 1}</sub>: {matrix.rows} × {matrix.cols} = p[{idx}] × p[{idx + 1}] = {dimensions[idx]} × {dimensions[idx + 1]}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            {matrices.map((matrix, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "1rem",
                  backgroundColor: "#0f1722",
                  border: "1px solid #213040",
                  borderRadius: "8px",
                }}
              >
                <span style={{ fontWeight: "600" }}>A{index + 1}:</span>
                <input
                  type="number"
                  min="1"
                  value={matrix.rows}
                  onChange={(e) =>
                    updateMatrix(index, "rows", parseInt(e.target.value, 10) || 1)
                  }
                  style={{
                    padding: "0.5rem",
                    width: "80px",
                    backgroundColor: "#1a2332",
                    border: "1px solid #213040",
                    borderRadius: "4px",
                    color: "#e7edf5",
                  }}
                />
                <span>×</span>
                <input
                  type="number"
                  min="1"
                  value={matrix.cols}
                  onChange={(e) =>
                    updateMatrix(index, "cols", parseInt(e.target.value, 10) || 1)
                  }
                  style={{
                    padding: "0.5rem",
                    width: "80px",
                    backgroundColor: "#1a2332",
                    border: "1px solid #213040",
                    borderRadius: "4px",
                    color: "#e7edf5",
                  }}
                />
                {matrices.length > 1 && (
                  <button
                    onClick={() => removeMatrix(index)}
                    style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: "#dc2626",
                      border: "none",
                      borderRadius: "4px",
                      color: "white",
                      cursor: "pointer",
                      marginLeft: "auto",
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addMatrix}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "#22c55e",
                border: "none",
                borderRadius: "8px",
                color: "white",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                justifyContent: "center",
              }}
            >
              <span>+</span> Add Matrix
            </button>
          </div>
        </section>

        {/* Dimensions Array (p[]) Display */}
        {currentStep && currentStep.dimensions && (
          <section>
            <h2>Dimensions Array (p[])</h2>
            <div className="formula-box">
              <p style={{ marginBottom: "1rem" }}>
                The <strong>p[]</strong> array stores the dimensions of all matrices. 
                For n matrices, p[] has n+1 elements. Matrix A<sub>i</sub> has dimensions 
                p[i] × p[i+1] (rows × columns).
              </p>
              <div style={{ 
                display: "flex", 
                flexWrap: "wrap", 
                gap: "0.5rem",
                alignItems: "center",
                marginBottom: "1rem"
              }}>
                <span style={{ fontWeight: "600", marginRight: "0.5rem" }}>p[] =</span>
                <span style={{ fontSize: "1.2rem" }}>[</span>
                {currentStep.dimensions.map((dim, idx) => {
                  // Highlight the dimensions being used in current calculation
                  const isP_i = idx === currentStep.i;
                  const isP_k1 = currentStep.currentK !== undefined && idx === currentStep.currentK + 1;
                  const isP_j1 = idx === currentStep.j + 1;
                  const isUsed = isP_i || isP_k1 || isP_j1;
                  
                  return (
                    <React.Fragment key={idx}>
                      <span
                        style={{
                          padding: "0.5rem 0.75rem",
                          backgroundColor: isUsed ? "#3b82f6" : "#1a2332",
                          border: isUsed ? "2px solid #60a5fa" : "1px solid #213040",
                          borderRadius: "4px",
                          color: "#e7edf5",
                          fontWeight: isUsed ? "600" : "400",
                          position: "relative",
                        }}
                        title={
                          isP_i ? `p[${idx}] = ${currentStep.dimensions[idx]} = rows of first matrix in chain (A${currentStep.i + 1})` :
                          isP_k1 ? `p[${idx}] = ${currentStep.dimensions[idx]} = columns of matrix A${currentStep.currentK! + 1} = shared dimension between left and right subchains` :
                          isP_j1 ? `p[${idx}] = ${currentStep.dimensions[idx]} = columns of last matrix in chain (A${currentStep.j + 1})` :
                          `p[${idx}] = ${currentStep.dimensions[idx]}`
                        }
                      >
                        {dim}
                        {isUsed && (
                          <span style={{
                            position: "absolute",
                            top: "-20px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            fontSize: "0.75rem",
                            color: "#60a5fa",
                            fontWeight: "600",
                          }}>
                            {isP_i ? `p[${idx}]` : isP_k1 ? `p[${idx}]` : `p[${idx}]`}
                          </span>
                        )}
                      </span>
                      {idx < currentStep.dimensions.length - 1 && (
                        <span style={{ color: "#666" }}>,</span>
                      )}
                    </React.Fragment>
                  );
                })}
                <span style={{ fontSize: "1.2rem" }}>]</span>
              </div>
              {currentStep.currentK !== undefined && (
                <p style={{ 
                  marginTop: "1rem", 
                  padding: "0.75rem", 
                  backgroundColor: "#1a2332",
                  borderRadius: "4px",
                  border: "1px solid #213040"
                }}>
                  <strong>Currently using:</strong> p[{currentStep.i}] = {currentStep.dimensions[currentStep.i]} 
                  {" "}× p[{currentStep.currentK + 1}] = {currentStep.dimensions[currentStep.currentK + 1]} 
                  {" "}× p[{currentStep.j + 1}] = {currentStep.dimensions[currentStep.j + 1]}
                </p>
              )}
            </div>
          </section>
        )}

        {/* Mathematical Explanation */}
        {currentStep && (
          <section className="formula-section">
            <h2>Mathematical Explanation</h2>
            <div className="formula-box">
              <div className="formula-main">
                <code>
                  m[i][j] = min(m[i][k] + m[k+1][j] + p[i]×p[k+1]×p[j+1]) for i ≤ k &lt; j
                </code>
              </div>
              <div className="formula-explanation">
                <p>
                  <strong>Formula Explanation:</strong>
                </p>
                <ul style={{ marginLeft: "1.5rem", lineHeight: "1.8" }}>
                  <li>
                    <strong>m[i][j]</strong> = minimum cost to multiply matrices from index i to j
                  </li>
                  <li>
                    <strong>m[i][k]</strong> = minimum cost to multiply matrices from i to k (left subchain)
                  </li>
                  <li>
                    <strong>m[k+1][j]</strong> = minimum cost to multiply matrices from k+1 to j (right subchain)
                  </li>
                  <li>
                    <strong>p[i]</strong> = number of rows of the first matrix in the chain (A<sub>i+1</sub>)
                    {currentStep.dimensions && ` = ${currentStep.dimensions[currentStep.i]}`}
                  </li>
                  <li>
                    <strong>p[k+1]</strong> = number of columns of matrix A<sub>k+2</sub> (the shared dimension between the two subchains)
                    {currentStep.currentK !== undefined && currentStep.dimensions && ` = ${currentStep.dimensions[currentStep.currentK + 1]}`}
                  </li>
                  <li>
                    <strong>p[j+1]</strong> = number of columns of the last matrix in the chain (A<sub>j+1</sub>)
                    {currentStep.dimensions && ` = ${currentStep.dimensions[currentStep.j + 1]}`}
                  </li>
                  <li>
                    <strong>p[i] × p[k+1] × p[j+1]</strong> = cost to multiply the two resulting matrices from the subchains
                    {currentStep.dimensions && currentStep.currentK !== undefined && 
                      ` = ${currentStep.dimensions[currentStep.i]} × ${currentStep.dimensions[currentStep.currentK + 1]} × ${currentStep.dimensions[currentStep.j + 1]} = ${currentStep.dimensions[currentStep.i] * currentStep.dimensions[currentStep.currentK + 1] * currentStep.dimensions[currentStep.j + 1]}`
                    }
                  </li>
                </ul>
                <p style={{ marginTop: "1rem" }}>
                  <strong>
                    Computing m[{currentStep.i}][{currentStep.j}]:
                  </strong>{" "}
                  Finding the minimum cost to multiply matrices from index{" "}
                  {currentStep.i} to {currentStep.j}.
                </p>
                <p style={{ 
                  padding: "0.75rem", 
                  backgroundColor: "#1a2332",
                  borderRadius: "4px",
                  border: "1px solid #213040",
                  marginTop: "1rem"
                }}>
                  {currentStep.explanation}
                </p>
                <p>
                  <strong>Time Complexity:</strong> O(n³) - We have three nested
                  loops: chain length l from 2 to n, starting index i from 0 to
                  n-l, and split point k from i to j-1, resulting in O(n³)
                  operations.
                </p>
                <p>
                  <strong>Space Complexity:</strong> O(n²) - We store two n×n
                  tables: the cost matrix m[i][j] and the split matrix to track
                  optimal parenthesization.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Visualization */}
        <section>
          <h2>
            Dynamic Programming Tables{" "}
            {steps
              ? `(Step ${stepIndex + 1}/${steps.length})`
              : "(press Compute)"}
          </h2>
          {currentStep ? (
            <MatrixChainTable
              matrix={currentStep.matrix}
              split={currentStep.split}
              updates={currentStep.updates}
              currentI={currentStep.i}
              currentJ={currentStep.j}
            />
          ) : (
            <p>Enter dimensions and click Compute to start visualization.</p>
          )}
          {currentStep && (
            <p className="legend">
              Green cells were updated in this step. Blue cell is currently being
              computed. Hover over cells to see details.
            </p>
          )}
        </section>

        {/* Results */}
        {totalCost !== null && steps && steps.length > 0 && (
          <section>
            <h2>Results</h2>
            <div className="formula-box">
              <p>
                <strong>Minimum Cost:</strong> {displayCell(totalCost)} scalar
                multiplications
              </p>
              <p>
                <strong>Optimal Parenthesization:</strong>{" "}
                <ParenthesizationDisplay text={optimalParenthesization} />
              </p>
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
            >{`# p[] is array of dimensions: p has n+1 elements for n matrices
# Matrix A[i] has dimensions p[i] × p[i+1] (rows × columns)
# m[i][j] = minimum cost to multiply matrices from i to j

for l in range(2, n + 1):  # chain length (number of matrices)
    for i in range(n - l + 1):  # starting index
        j = i + l - 1  # ending index
        m[i][j] = float('inf')
        for k in range(i, j):  # try all split points
            # p[i] = rows of first matrix (A[i+1])
            # p[k+1] = columns of matrix A[k+1] (shared dimension)
            # p[j+1] = columns of last matrix (A[j+1])
            cost = m[i][k] + m[k+1][j] + p[i]*p[k+1]*p[j+1]
            if cost < m[i][j]:
                m[i][j] = cost
                split[i][j] = k

# Minimum cost is m[0][n-1]`}</code>
          </pre>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}

// Component to color-code parentheses
function ParenthesizationDisplay({ text }: { text: string }) {
  const colors = [
    "#60a5fa", // blue
    "#22c55e", // green
    "#f59e0b", // orange
    "#ef4444", // red
    "#a78bfa", // purple
    "#ec4899", // pink
    "#06b6d4", // cyan
    "#f97316", // orange-red
  ];

  const result: React.ReactElement[] = [];
  let colorIndex = 0;
  const openParens: number[] = [];

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === "(") {
      const currentColor = colors[colorIndex % colors.length];
      openParens.push(colorIndex);
      result.push(
        <span key={i} style={{ color: currentColor, fontWeight: "600" }}>
          (
        </span>
      );
      colorIndex++;
    } else if (char === ")") {
      const parenIndex = openParens.pop();
      if (parenIndex !== undefined) {
        const currentColor = colors[parenIndex % colors.length];
        result.push(
          <span key={i} style={{ color: currentColor, fontWeight: "600" }}>
            )
          </span>
        );
      } else {
        result.push(<span key={i}>{char}</span>);
      }
    } else {
      result.push(<span key={i}>{char}</span>);
    }
  }

  return (
    <code style={{ fontSize: "1.1rem", color: "#e7edf5" }}>{result}</code>
  );
}

