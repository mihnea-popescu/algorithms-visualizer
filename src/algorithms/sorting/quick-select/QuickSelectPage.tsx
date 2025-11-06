import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { quickSelectSteps, QuickSelectStep } from "./quickSelectAlgorithm";
import Footer from "../../../components/Footer";
import SEO from "../../../components/SEO";
import "../../../styles.css";

const DEFAULT_ARRAY = [38, 27, 43, 3, 9, 82, 10];
const DEFAULT_K = 4;

export default function QuickSelectPage() {
  const [array, setArray] = useState<number[]>(DEFAULT_ARRAY);
  const [k, setK] = useState<number>(DEFAULT_K);
  const [steps, setSteps] = useState<QuickSelectStep[] | null>(null);
  const [stepIndex, setStepIndex] = useState<number>(0);

  // Reset steps when array or k changes
  useEffect(() => {
    setSteps(null);
    setStepIndex(0);
  }, [array, k]);

  function addElement() {
    setArray([...array, 1]);
  }

  function removeElement(index: number) {
    if (array.length <= 1) return;
    setArray(array.filter((_, i) => i !== index));
  }

  function updateElement(index: number, value: number) {
    const newArray = [...array];
    newArray[index] = value;
    setArray(newArray);
  }

  function parseArrayInput(input: string) {
    const numbers = input
      .split(/[,\s\n]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .map((s) => parseInt(s, 10))
      .filter((n) => !isNaN(n));
    if (numbers.length > 0) {
      setArray(numbers);
    }
  }

  function compute() {
    if (array.length === 0) {
      alert("Please enter at least 1 element");
      return;
    }
    if (k < 1 || k > array.length) {
      alert(`k must be between 1 and ${array.length}`);
      return;
    }
    const result = quickSelectSteps(array, k);
    setSteps(result);
    setStepIndex(0);
  }

  const currentStep = steps?.[stepIndex] ?? null;

  return (
    <>
      <SEO
        title="Quick Select"
        description="Interactive visualization of the Quick Select algorithm. Learn how to find the k-th smallest element efficiently using partition-based selection. Understand the O(n) average case time complexity."
        keywords="quick select, selection algorithm, k-th smallest, algorithm visualization, partition, O(n), selection problem"
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
            <h1 style={{ margin: 0 }}>Quick Select Algorithm</h1>
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
                Find k-th Smallest
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
                  Step {stepIndex + 1} of {steps.length}
                </div>
              </div>
            )}

            {currentStep && (
              <div
                style={{
                  marginTop: "1rem",
                  padding: "0.75rem",
                  backgroundColor: "#1a2332",
                  borderRadius: "4px",
                  border: "1px solid #213040",
                }}
              >
                <p style={{ margin: 0, color: "#e7edf5" }}>
                  {currentStep.explanation}
                </p>
              </div>
            )}
          </section>

          {/* Input Section */}
          <section>
            <h2>Input</h2>
            <p>
              Enter the array elements and the value of k (1-indexed). Quick
              select finds the k-th smallest element in the array using a
              partition-based approach similar to quick sort, but only recurses
              on the partition containing the k-th element.
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                marginTop: "1rem",
              }}
            >
              <div
                style={{
                  padding: "1rem",
                  backgroundColor: "#0f1722",
                  border: "1px solid #213040",
                  borderRadius: "8px",
                }}
              >
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "600",
                  }}
                >
                  k (k-th smallest element, 1-indexed):
                </label>
                <input
                  type="number"
                  min={1}
                  max={array.length}
                  value={k}
                  onChange={(e) => setK(parseInt(e.target.value, 10) || 1)}
                  style={{
                    padding: "0.5rem",
                    width: "100px",
                    backgroundColor: "#1a2332",
                    border: "1px solid #213040",
                    borderRadius: "4px",
                    color: "#e7edf5",
                  }}
                />
                <span style={{ marginLeft: "1rem", color: "#9ca3af" }}>
                  (must be between 1 and {array.length})
                </span>
              </div>

              <div
                style={{
                  padding: "1rem",
                  backgroundColor: "#0f1722",
                  border: "1px solid #213040",
                  borderRadius: "8px",
                }}
              >
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "600",
                  }}
                >
                  Quick Input (comma or space separated):
                </label>
                <input
                  type="text"
                  placeholder="e.g., 38, 27, 43, 3, 9, 82, 10"
                  onBlur={(e) => {
                    if (e.target.value.trim()) {
                      parseArrayInput(e.target.value);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.currentTarget.blur();
                    }
                  }}
                  style={{
                    padding: "0.75rem",
                    width: "100%",
                    backgroundColor: "#1a2332",
                    border: "1px solid #213040",
                    borderRadius: "4px",
                    color: "#e7edf5",
                    fontSize: "1rem",
                  }}
                />
                <p
                  style={{
                    marginTop: "0.5rem",
                    fontSize: "0.875rem",
                    color: "#9ca3af",
                  }}
                >
                  Enter numbers separated by commas, spaces, or newlines. Press
                  Enter or click outside to apply.
                </p>
              </div>

              <div
                style={{
                  padding: "1rem",
                  backgroundColor: "#0f1722",
                  border: "1px solid #213040",
                  borderRadius: "8px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.75rem",
                  }}
                >
                  <label style={{ fontWeight: "600" }}>
                    Array Elements ({array.length}):
                  </label>
                  <button
                    onClick={addElement}
                    style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: "#22c55e",
                      border: "none",
                      borderRadius: "4px",
                      color: "white",
                      cursor: "pointer",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                    }}
                  >
                    + Add
                  </button>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                    gap: "0.75rem",
                  }}
                >
                  {array.map((value, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.25rem",
                      }}
                    >
                      <label
                        style={{
                          fontSize: "0.75rem",
                          color: "#9ca3af",
                          fontWeight: "500",
                        }}
                      >
                        [{index}]
                      </label>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <input
                          type="number"
                          value={value}
                          onChange={(e) =>
                            updateElement(
                              index,
                              parseInt(e.target.value, 10) || 0
                            )
                          }
                          style={{
                            padding: "0.5rem",
                            flex: 1,
                            backgroundColor: "#1a2332",
                            border: "1px solid #213040",
                            borderRadius: "4px",
                            color: "#e7edf5",
                          }}
                        />
                        {array.length > 1 && (
                          <button
                            onClick={() => removeElement(index)}
                            style={{
                              padding: "0.5rem",
                              backgroundColor: "#dc2626",
                              border: "none",
                              borderRadius: "4px",
                              color: "white",
                              cursor: "pointer",
                              fontSize: "0.75rem",
                              minWidth: "40px",
                            }}
                            title="Remove"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Mathematical Explanation */}
          {currentStep && (
            <section className="formula-section">
              <h2>Mathematical Explanation</h2>
              <div className="formula-box">
                <div className="formula-main">
                  <code>
                    {currentStep.phase === "start"
                      ? "Quick Select: find k-th smallest element"
                      : currentStep.phase === "pivot"
                      ? "Pivot: choose element and partition around it"
                      : currentStep.phase === "partition"
                      ? "Partition: left < pivot ≤ right"
                      : currentStep.phase === "compare"
                      ? "Compare: determine which partition contains k-th element"
                      : currentStep.phase === "recurse"
                      ? "Recurse: search in the partition containing k-th element"
                      : currentStep.phase === "found"
                      ? "Found: k-th smallest element found"
                      : "Swap: place element in correct partition"}
                  </code>
                </div>
                <div className="formula-explanation">
                  <p>
                    <strong>Quick Select Algorithm:</strong>
                  </p>
                  <ul style={{ marginLeft: "1.5rem", lineHeight: "1.8" }}>
                    <li>
                      <strong>Partition:</strong> Choose a pivot and partition
                      the array around it (elements smaller than pivot on the
                      left, greater or equal on the right)
                    </li>
                    <li>
                      <strong>Rank Check:</strong> Calculate the rank of the
                      pivot (its position in sorted order)
                    </li>
                    <li>
                      <strong>Recurse:</strong> If pivot rank equals k, we found
                      the answer. Otherwise, recurse on the partition containing
                      the k-th element
                    </li>
                    <li>
                      <strong>Key Insight:</strong> Unlike quick sort, we only
                      recurse on one partition, not both
                    </li>
                  </ul>
                  <p>
                    <strong>Time Complexity:</strong> O(n) average case, O(n²)
                    worst case - The average case occurs when the pivot divides
                    the array roughly in half. The worst case occurs when the
                    pivot is always the smallest or largest element, creating
                    unbalanced partitions. However, with median-of-medians pivot
                    selection, worst case becomes O(n).
                  </p>
                  <p>
                    <strong>Space Complexity:</strong> O(log n) average case,
                    O(n) worst case - Space is used for the recursion stack.
                  </p>
                  {currentStep.range && (
                    <div
                      style={{
                        marginTop: "1rem",
                        padding: "0.75rem",
                        backgroundColor: "#1a2332",
                        borderRadius: "4px",
                        border: "1px solid #213040",
                      }}
                    >
                      <p style={{ marginBottom: "0.5rem" }}>
                        <strong>Current Segment:</strong>
                      </p>
                      <p>
                        Range: [{currentStep.range.start},{" "}
                        {currentStep.range.end}]
                      </p>
                      {currentStep.depth !== undefined && (
                        <p>Recursion Depth: {currentStep.depth}</p>
                      )}
                      {currentStep.k !== undefined && (
                        <p>Looking for: {currentStep.k}-th smallest</p>
                      )}
                      {currentStep.pivotValue !== undefined && (
                        <p>Pivot Value: {currentStep.pivotValue}</p>
                      )}
                    </div>
                  )}
                  {currentStep.result !== undefined && (
                    <div
                      style={{
                        marginTop: "1rem",
                        padding: "0.75rem",
                        backgroundColor: "#22c55e",
                        borderRadius: "4px",
                        border: "2px solid #4ade80",
                      }}
                    >
                      <p style={{ margin: 0, fontWeight: "600", color: "#fff" }}>
                        Result: The {currentStep.k}-th smallest element is{" "}
                        {currentStep.result}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Visualization */}
          <section>
            <h2>
              Visualization{" "}
              {steps
                ? `(Step ${stepIndex + 1}/${steps.length})`
                : "(press Find k-th Smallest)"}
            </h2>
            {currentStep ? (
              <QuickSelectVisualization step={currentStep} />
            ) : (
              <p>
                Enter array elements, set k, and click "Find k-th Smallest" to
                begin visualization.
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
              >{`def quick_select(arr, k):
    """
    Find the k-th smallest element in an array (1-indexed).
    Time Complexity: O(n) average, O(n²) worst case
    Space Complexity: O(log n) average, O(n) worst case
    """
    if k < 1 or k > len(arr):
        raise ValueError("k must be between 1 and len(arr)")
    
    return _quick_select(arr, 0, len(arr) - 1, k)

def _quick_select(arr, start, end, k):
    """Helper function for quick select."""
    if start == end:
        return arr[start]
    
    # Choose pivot (using last element)
    pivot_index = partition(arr, start, end)
    
    # Calculate rank of pivot (1-indexed)
    pivot_rank = pivot_index - start + 1
    
    if pivot_rank == k:
        return arr[pivot_index]
    elif k < pivot_rank:
        # k-th element is in left partition
        return _quick_select(arr, start, pivot_index - 1, k)
    else:
        # k-th element is in right partition
        return _quick_select(arr, pivot_index + 1, end, k - pivot_rank)

def partition(arr, start, end):
    """
    Partitions the array around a pivot element.
    Returns the final position of the pivot.
    """
    # Choose last element as pivot
    pivot = arr[end]
    i = start  # Index of smaller element
    
    # Traverse through all elements
    for j in range(start, end):
        # If current element is smaller than pivot
        if arr[j] < pivot:
            # Swap with element at i
            arr[i], arr[j] = arr[j], arr[i]
            i += 1
    
    # Place pivot at its final position
    arr[i], arr[end] = arr[end], arr[i]
    return i

# Example usage
arr = [38, 27, 43, 3, 9, 82, 10]
k = 4
result = quick_select(arr, k)
print(f"The {k}-th smallest element is: {result}`}</code>
            </pre>
          </section>
        </div>
        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}

type QuickSelectVisualizationProps = {
  step: QuickSelectStep;
};

function QuickSelectVisualization({
  step,
}: QuickSelectVisualizationProps) {
  return (
    <div
      style={{
        backgroundColor: "#0f1722",
        border: "1px solid #213040",
        borderRadius: "8px",
        padding: "2rem",
      }}
    >
      {/* Main Array */}
      <div style={{ marginBottom: "2rem" }}>
        <h3 style={{ marginBottom: "1rem", color: "#e7edf5" }}>Array</h3>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {step.array.map((value, index) => {
            const isPivot = step.pivotIndex === index;
            const isInRange =
              step.range &&
              index >= step.range.start &&
              index <= step.range.end;
            const isLeftIndex = step.leftIndex === index;
            const isRightIndex = step.rightIndex === index;
            const isSwapped =
              step.swapped &&
              (index === step.swapped.i || index === step.swapped.j);
            const isResult =
              step.phase === "found" &&
              step.result !== undefined &&
              value === step.result;

            let backgroundColor = "#1a2332";
            let borderColor = "#213040";
            let borderWidth = "1px";
            let fontWeight = "400";

            if (isResult) {
              backgroundColor = "#22c55e";
              borderColor = "#4ade80";
              borderWidth = "3px";
              fontWeight = "700";
            } else if (isPivot) {
              backgroundColor = "#f59e0b";
              borderColor = "#fbbf24";
              borderWidth = "3px";
              fontWeight = "700";
            } else if (isSwapped) {
              backgroundColor = "#22c55e";
              borderColor = "#4ade80";
              borderWidth = "2px";
              fontWeight = "600";
            } else if (isLeftIndex) {
              backgroundColor = "#3b82f6";
              borderColor = "#60a5fa";
              borderWidth = "2px";
              fontWeight = "600";
            } else if (isRightIndex) {
              backgroundColor = "#8b5cf6";
              borderColor = "#a78bfa";
              borderWidth = "2px";
              fontWeight = "600";
            } else if (isInRange) {
              backgroundColor = "#1e3a5f";
              borderColor = "#3b82f6";
              borderWidth = "1px";
            }

            return (
              <div
                key={index}
                style={{
                  padding: "1rem 1.5rem",
                  backgroundColor,
                  border: `${borderWidth} solid ${borderColor}`,
                  borderRadius: "8px",
                  color: "#e7edf5",
                  fontWeight,
                  minWidth: "60px",
                  textAlign: "center",
                  fontSize: "1.1rem",
                  position: "relative",
                }}
                title={`Index ${index}: ${value}${
                  isPivot ? " (Pivot)" : ""
                }${isLeftIndex ? " (Left pointer)" : ""}${
                  isRightIndex ? " (Right pointer)" : ""
                }${isResult ? " (Result)" : ""}`}
              >
                {value}
                {isPivot && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-8px",
                      right: "-8px",
                      backgroundColor: "#f59e0b",
                      color: "#fff",
                      borderRadius: "50%",
                      width: "20px",
                      height: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.7rem",
                      fontWeight: "700",
                    }}
                  >
                    P
                  </div>
                )}
                {isResult && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-8px",
                      left: "-8px",
                      backgroundColor: "#22c55e",
                      color: "#fff",
                      borderRadius: "50%",
                      width: "24px",
                      height: "24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.7rem",
                      fontWeight: "700",
                    }}
                  >
                    ✓
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Comparison */}
      {step.comparing && (
        <div
          style={{
            marginBottom: "2rem",
            padding: "1rem",
            backgroundColor: "#1a2332",
            borderRadius: "8px",
            border: "2px solid #60a5fa",
            textAlign: "center",
          }}
        >
          <h3 style={{ marginBottom: "1rem", color: "#e7edf5" }}>Comparing</h3>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "2rem",
            }}
          >
            <div
              style={{
                padding: "1.5rem 2rem",
                backgroundColor: "#3b82f6",
                borderRadius: "8px",
                fontSize: "1.5rem",
                fontWeight: "600",
                color: "#fff",
              }}
            >
              {step.comparing.left}
            </div>
            <span style={{ fontSize: "2rem", color: "#60a5fa" }}>&lt;</span>
            <div
              style={{
                padding: "1.5rem 2rem",
                backgroundColor: "#f59e0b",
                borderRadius: "8px",
                fontSize: "1.5rem",
                fontWeight: "600",
                color: "#fff",
              }}
            >
              {step.comparing.right}
            </div>
          </div>
        </div>
      )}

      {/* Partitioned View */}
      {step.partitioned && (
        <div>
          <h3 style={{ marginBottom: "1rem", color: "#e7edf5" }}>
            Partitioned View
          </h3>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {step.partitioned.left.length > 0 && (
              <div>
                <h4
                  style={{
                    marginBottom: "0.5rem",
                    color: "#60a5fa",
                    fontSize: "0.9rem",
                  }}
                >
                  Left Partition (&lt; {step.partitioned.pivot})
                </h4>
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    flexWrap: "wrap",
                  }}
                >
                  {step.partitioned.left.map((value, index) => (
                    <div
                      key={index}
                      style={{
                        padding: "0.75rem 1.25rem",
                        backgroundColor: "#3b82f6",
                        border: "2px solid #60a5fa",
                        borderRadius: "6px",
                        color: "#fff",
                        fontWeight: "600",
                        minWidth: "50px",
                        textAlign: "center",
                      }}
                    >
                      {value}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div>
              <h4
                style={{
                  marginBottom: "0.5rem",
                  color: "#f59e0b",
                  fontSize: "0.9rem",
                }}
              >
                Pivot
              </h4>
              <div
                style={{
                  padding: "1rem 1.5rem",
                  backgroundColor: "#f59e0b",
                  border: "3px solid #fbbf24",
                  borderRadius: "8px",
                  color: "#fff",
                  fontWeight: "700",
                  fontSize: "1.2rem",
                  minWidth: "60px",
                  textAlign: "center",
                }}
              >
                {step.partitioned.pivot}
              </div>
            </div>
            {step.partitioned.right.length > 0 && (
              <div>
                <h4
                  style={{
                    marginBottom: "0.5rem",
                    color: "#8b5cf6",
                    fontSize: "0.9rem",
                  }}
                >
                  Right Partition (≥ {step.partitioned.pivot})
                </h4>
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    flexWrap: "wrap",
                  }}
                >
                  {step.partitioned.right.map((value, index) => (
                    <div
                      key={index}
                      style={{
                        padding: "0.75rem 1.25rem",
                        backgroundColor: "#8b5cf6",
                        border: "2px solid #a78bfa",
                        borderRadius: "6px",
                        color: "#fff",
                        fontWeight: "600",
                        minWidth: "50px",
                        textAlign: "center",
                      }}
                    >
                      {value}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

