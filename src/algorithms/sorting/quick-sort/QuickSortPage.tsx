import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { quickSortSteps, QuickSortStep } from "./quickSortAlgorithm";
import Footer from "../../../components/Footer";
import SEO from "../../../components/SEO";
import "../../../styles.css";

const DEFAULT_ARRAY = [38, 27, 43, 3, 9, 82, 10];

export default function QuickSortPage() {
  const [array, setArray] = useState<number[]>(DEFAULT_ARRAY);
  const [steps, setSteps] = useState<QuickSortStep[] | null>(null);
  const [stepIndex, setStepIndex] = useState<number>(0);

  // Reset steps when array changes
  useEffect(() => {
    setSteps(null);
    setStepIndex(0);
  }, [array]);

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

  function compute() {
    if (array.length === 0) {
      alert("Please enter at least 1 element");
      return;
    }
    const result = quickSortSteps(array);
    setSteps(result);
    setStepIndex(0);
  }

  const currentStep = steps?.[stepIndex] ?? null;

  return (
    <>
      <SEO
        title="Quick Sort"
        description="Interactive visualization of the Quick Sort algorithm. Learn how divide-and-conquer works with pivot selection and partitioning. Understand the O(n log n) average case and O(n²) worst case time complexity."
        keywords="quick sort, sorting algorithm, divide and conquer, algorithm visualization, recursive sorting, O(n log n), pivot, partition"
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
            <h1 style={{ margin: 0 }}>Quick Sort Algorithm</h1>
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
                Start Sorting
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
              Enter the array elements to sort. Quick sort uses
              divide-and-conquer: it chooses a pivot element, partitions the
              array around the pivot (elements smaller than pivot on the left,
              larger or equal on the right), then recursively sorts each
              partition.
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                marginTop: "1rem",
              }}
            >
              {array.map((value, index) => (
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
                  <span style={{ fontWeight: "600" }}>Element {index}:</span>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) =>
                      updateElement(index, parseInt(e.target.value, 10) || 0)
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
                  {array.length > 1 && (
                    <button
                      onClick={() => removeElement(index)}
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
                onClick={addElement}
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
                <span>+</span> Add Element
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
                    {currentStep.phase === "pivot"
                      ? "Pivot: choose element and partition around it"
                      : currentStep.phase === "partition"
                      ? "Partition: left < pivot ≤ right"
                      : currentStep.phase === "compare"
                      ? "Compare: arr[j] < pivot ? move left : stay right"
                      : currentStep.phase === "swap"
                      ? "Swap: place element in correct partition"
                      : "Complete: array is sorted"}
                  </code>
                </div>
                <div className="formula-explanation">
                  <p>
                    <strong>Quick Sort Algorithm:</strong>
                  </p>
                  <ul style={{ marginLeft: "1.5rem", lineHeight: "1.8" }}>
                    <li>
                      <strong>Pivot Selection:</strong> Choose a pivot element
                      (typically the last element)
                    </li>
                    <li>
                      <strong>Partition:</strong> Rearrange the array so all
                      elements smaller than the pivot are on the left, and all
                      elements greater than or equal to the pivot are on the
                      right
                    </li>
                    <li>
                      <strong>Recurse:</strong> Recursively sort the left and
                      right partitions
                    </li>
                    <li>
                      <strong>Base Case:</strong> Arrays with 0 or 1 element are
                      already sorted
                    </li>
                  </ul>
                  <p>
                    <strong>Time Complexity:</strong> O(n log n) average case,
                    O(n²) worst case - The average case occurs when the pivot
                    divides the array roughly in half each time. The worst case
                    occurs when the pivot is always the smallest or largest
                    element, creating unbalanced partitions.
                  </p>
                  <p>
                    <strong>Space Complexity:</strong> O(log n) average case,
                    O(n) worst case - Space is used for the recursion stack. In
                    the average case, the depth is log n. In the worst case, it
                    can be n.
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
                      {currentStep.pivotValue !== undefined && (
                        <p>Pivot Value: {currentStep.pivotValue}</p>
                      )}
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
                : "(press Start Sorting)"}
            </h2>
            {currentStep ? (
              <QuickSortVisualization step={currentStep} />
            ) : (
              <p>
                Enter array elements and click "Start Sorting" to begin
                visualization.
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
              >{`def quick_sort(arr, start=0, end=None):
    """
    Quick sort algorithm using divide-and-conquer.
    Time Complexity: O(n log n) average, O(n²) worst case
    Space Complexity: O(log n) average, O(n) worst case
    """
    if end is None:
        end = len(arr) - 1
    
    if start >= end:
        return
    
    # Partition the array around a pivot
    pivot_index = partition(arr, start, end)
    
    # Recursively sort left and right partitions
    quick_sort(arr, start, pivot_index - 1)
    quick_sort(arr, pivot_index + 1, end)

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
quick_sort(arr)
print(f"Sorted array: {arr}`}</code>
            </pre>
          </section>
        </div>
        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}

type QuickSortVisualizationProps = {
  step: QuickSortStep;
};

function QuickSortVisualization({ step }: QuickSortVisualizationProps) {
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

            let backgroundColor = "#1a2332";
            let borderColor = "#213040";
            let borderWidth = "1px";
            let fontWeight = "400";

            if (isPivot) {
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
                }`}
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

