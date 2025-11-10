import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import OptimalBinarySearchTreeTable from "./OptimalBinarySearchTreeTable";
import {
  Step,
  optimalBinarySearchTreeSteps,
  getOptimalBSTStructure,
  displayCell,
} from "./optimalBinarySearchTreeAlgorithm";
import Footer from "../../../components/Footer";
import SEO from "../../../components/SEO";
import "../../../styles.css";

interface KeyFrequency {
  key: string;
  frequency: number;
}

const DEFAULT_KEYS: KeyFrequency[] = [
  { key: "A", frequency: 4 },
  { key: "B", frequency: 2 },
  { key: "C", frequency: 1 },
  { key: "D", frequency: 3 },
  { key: "E", frequency: 5 },
];

export default function OptimalBinarySearchTreePage() {
  const [keys, setKeys] = useState<KeyFrequency[]>(DEFAULT_KEYS);
  const [steps, setSteps] = useState<Step[] | null>(null);
  const [stepIndex, setStepIndex] = useState<number>(0);

  // Reset steps when keys change
  useEffect(() => {
    setSteps(null);
    setStepIndex(0);
  }, [keys]);

  function addKey() {
    setKeys([...keys, { key: String.fromCharCode(65 + keys.length), frequency: 1 }]);
  }

  function removeKey(index: number) {
    if (keys.length <= 1) return;
    setKeys(keys.filter((_, i) => i !== index));
  }

  function updateKey(index: number, field: "key" | "frequency", value: string | number) {
    const newKeys = [...keys];
    newKeys[index] = { ...newKeys[index], [field]: value };
    setKeys(newKeys);
  }

  function compute() {
    if (keys.length === 0) {
      alert("Please enter at least one key");
      return;
    }
    const keyStrings = keys.map((k) => k.key);
    const frequencies = keys.map((k) => k.frequency);
    const result = optimalBinarySearchTreeSteps(keyStrings, frequencies);
    setSteps(result);
    setStepIndex(0);
  }

  const currentStep = steps?.[stepIndex] ?? null;
  const n = keys.length;

  const optimalBSTStructure = useMemo(() => {
    if (!steps || steps.length === 0) return "";
    const finalStep = steps[steps.length - 1];
    return getOptimalBSTStructure(
      finalStep.rootMatrix,
      finalStep.keys,
      0,
      n - 1
    );
  }, [steps, n]);

  const totalCost = useMemo(() => {
    if (!steps || steps.length === 0) return null;
    const finalStep = steps[steps.length - 1];
    return finalStep.costMatrix[0][n - 1];
  }, [steps, n]);

  return (
    <>
      <SEO
        title="Optimal Binary Search Tree"
        description="Interactive visualization of the Optimal Binary Search Tree dynamic programming algorithm. Find the BST that minimizes expected search cost given keys and their frequencies. Step-by-step visualization with DP tables."
        keywords="optimal binary search tree, OBST, dynamic programming, DP algorithm, algorithm visualization, binary search tree, expected search cost"
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
            <h1 style={{ margin: 0 }}>Optimal Binary Search Tree</h1>
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
                  Step {stepIndex + 1} of {steps.length}:{" "}
                  {currentStep?.currentK !== undefined
                    ? ` Evaluating root k = ${currentStep.currentK} (key "${currentStep.keys[currentStep.currentK]}") for cost[${currentStep?.i}][${currentStep?.j}]`
                    : ` Final result for cost[${currentStep?.i}][${currentStep?.j}]`}
                </div>
              </div>
            )}
          </section>

          {/* Input Section */}
          <section>
            <h2>Input</h2>
            <p>
              Enter keys and their frequencies (or probabilities). The keys must be
              sorted. The algorithm finds the binary search tree that minimizes the
              expected search cost.
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                marginTop: "1rem",
              }}
            >
              {keys.map((keyFreq, index) => (
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
                  <span style={{ fontWeight: "600", minWidth: "60px" }}>
                    Key {index + 1}:
                  </span>
                  <input
                    type="text"
                    value={keyFreq.key}
                    onChange={(e) =>
                      updateKey(index, "key", e.target.value || "A")
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
                  <span style={{ marginLeft: "1rem" }}>Frequency:</span>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={keyFreq.frequency}
                    onChange={(e) =>
                      updateKey(
                        index,
                        "frequency",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    style={{
                      padding: "0.5rem",
                      width: "100px",
                      backgroundColor: "#1a2332",
                      border: "1px solid #213040",
                      borderRadius: "4px",
                      color: "#e7edf5",
                    }}
                  />
                  {keys.length > 1 && (
                    <button
                      onClick={() => removeKey(index)}
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
                onClick={addKey}
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
                <span>+</span> Add Key
              </button>
            </div>
          </section>

          {/* Mathematical Explanation */}
          {currentStep && (
            <section className="formula-section">
              <h2>Mathematical Explanation</h2>
              <div className="formula-box">
                <div className="formula-main">
                  <code>
                    cost[i][j] = min(cost[i][k-1] + cost[k+1][j] + sum(freqs[i..j])) for i ≤ k ≤ j
                  </code>
                </div>
                <div className="formula-explanation">
                  <p>
                    <strong>Formula Explanation:</strong>
                  </p>
                  <ul style={{ marginLeft: "1.5rem", lineHeight: "1.8" }}>
                    <li>
                      <strong>cost[i][j]</strong> = minimum cost of BST for keys
                      from index i to j (inclusive)
                    </li>
                    <li>
                      <strong>cost[i][k-1]</strong> = minimum cost of left subtree
                      (keys i to k-1), or 0 if k = i
                    </li>
                    <li>
                      <strong>cost[k+1][j]</strong> = minimum cost of right subtree
                      (keys k+1 to j), or 0 if k = j
                    </li>
                    <li>
                      <strong>sum(freqs[i..j])</strong> = sum of all frequencies
                      from i to j
                      {currentStep.sumFreq !== undefined &&
                        ` = ${currentStep.sumFreq}`}
                    </li>
                    <li>
                      <strong>k</strong> = root key index being evaluated (from i
                      to j)
                    </li>
                  </ul>
                  <p style={{ marginTop: "1rem" }}>
                    <strong>
                      Computing cost[{currentStep.i}][{currentStep.j}]:
                    </strong>{" "}
                    Finding the minimum cost BST for keys from index{" "}
                    {currentStep.i} to {currentStep.j}.
                  </p>
                  <p
                    style={{
                      padding: "0.75rem",
                      backgroundColor: "#1a2332",
                      borderRadius: "4px",
                      border: "1px solid #213040",
                      marginTop: "1rem",
                    }}
                  >
                    {currentStep.explanation}
                  </p>
                  <p>
                    <strong>Time Complexity:</strong> O(n³) - We have three nested
                    loops: range length l from 2 to n, starting index i from 0 to
                    n-l, and root k from i to j, resulting in O(n³) operations.
                  </p>
                  <p>
                    <strong>Space Complexity:</strong> O(n²) - We store two n×n
                    tables: the cost matrix cost[i][j] and the root matrix to track
                    optimal root for each subtree.
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
              <OptimalBinarySearchTreeTable
                costMatrix={currentStep.costMatrix}
                rootMatrix={currentStep.rootMatrix}
                updates={currentStep.updates}
                currentI={currentStep.i}
                currentJ={currentStep.j}
                keys={currentStep.keys}
              />
            ) : (
              <p>Enter keys and frequencies, then click Compute to start visualization.</p>
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
                  <strong>Minimum Expected Search Cost:</strong> {displayCell(totalCost)}
                </p>
                <p>
                  <strong>Optimal BST Structure:</strong>{" "}
                  <code
                    style={{
                      fontSize: "1rem",
                      color: "#60a5fa",
                      backgroundColor: "#1a2332",
                      padding: "0.5rem 1rem",
                      borderRadius: "4px",
                      display: "inline-block",
                    }}
                  >
                    {optimalBSTStructure}
                  </code>
                </p>
                <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#a0a0a0" }}>
                  The structure shows the optimal BST in infix notation: (left) root (right)
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
              >{`# keys[] = sorted array of keys
# freq[] = array of frequencies for each key
# cost[i][j] = minimum cost of BST for keys from i to j
# root[i][j] = root key index for optimal BST from i to j

# Precompute prefix sums for O(1) range sum queries
prefix_sum = [0] * (n + 1)
for i in range(n):
    prefix_sum[i + 1] = prefix_sum[i] + freq[i]

def get_sum_freq(i, j):
    return prefix_sum[j + 1] - prefix_sum[i]

# Base case: single key
for i in range(n):
    cost[i][i] = freq[i]
    root[i][i] = i

# l is the length of the range (number of keys)
for l in range(2, n + 1):
    for i in range(n - l + 1):  # starting index
        j = i + l - 1  # ending index
        sum_freq = get_sum_freq(i, j)
        cost[i][j] = float('inf')
        
        # Try all possible roots k from i to j
        for k in range(i, j + 1):
            left_cost = cost[i][k - 1] if k > i else 0
            right_cost = cost[k + 1][j] if k < j else 0
            total_cost = left_cost + right_cost + sum_freq
            
            if total_cost < cost[i][j]:
                cost[i][j] = total_cost
                root[i][j] = k

# Minimum cost is cost[0][n-1]`}</code>
              </pre>
            </section>
        </div>
        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}



