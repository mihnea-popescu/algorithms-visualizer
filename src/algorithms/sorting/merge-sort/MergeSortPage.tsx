import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { mergeSortSteps, MergeSortStep } from "./mergeSortAlgorithm";
import Footer from "../../../components/Footer";
import SEO from "../../../components/SEO";
import "../../../styles.css";

const DEFAULT_ARRAY = [38, 27, 43, 3, 9, 82, 10];

export default function MergeSortPage() {
  const [array, setArray] = useState<number[]>(DEFAULT_ARRAY);
  const [steps, setSteps] = useState<MergeSortStep[] | null>(null);
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
    const result = mergeSortSteps(array);
    setSteps(result);
    setStepIndex(0);
  }

  const currentStep = steps?.[stepIndex] ?? null;

  return (
    <>
      <SEO
        title="Merge Sort"
        description="Interactive visualization of the Merge Sort algorithm. Learn how divide-and-conquer works with step-by-step visualization of array splitting and merging. Understand the O(n log n) time complexity."
        keywords="merge sort, sorting algorithm, divide and conquer, algorithm visualization, recursive sorting, O(n log n)"
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
            <h1 style={{ margin: 0 }}>Merge Sort Algorithm</h1>
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
              Enter the array elements to sort. Merge sort uses
              divide-and-conquer: it divides the array into halves, recursively
              sorts each half, then merges them back together.
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
                    {currentStep.phase === "divide"
                      ? "Divide: array → left_half, right_half"
                      : currentStep.phase === "merge"
                      ? "Merge: merge(left_sorted, right_sorted) → sorted_array"
                      : "Compare: left[i] ≤ right[j] ? take left[i] : take right[j]"}
                  </code>
                </div>
                <div className="formula-explanation">
                  <p>
                    <strong>Merge Sort Algorithm:</strong>
                  </p>
                  <ul style={{ marginLeft: "1.5rem", lineHeight: "1.8" }}>
                    <li>
                      <strong>Divide:</strong> Split the array into two halves
                      recursively until each subarray has one element
                    </li>
                    <li>
                      <strong>Conquer:</strong> A single element is already
                      sorted (base case)
                    </li>
                    <li>
                      <strong>Merge:</strong> Combine two sorted halves by
                      comparing elements and placing them in order
                    </li>
                    <li>
                      <strong>Recurrence Relation:</strong> T(n) = 2T(n/2) +
                      O(n)
                    </li>
                  </ul>
                  <p>
                    <strong>Time Complexity:</strong> O(n log n) - The array is
                    divided log n times, and each merge takes O(n) time.
                  </p>
                  <p>
                    <strong>Space Complexity:</strong> O(n) - Additional space
                    is needed for the temporary arrays during merging.
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
              <MergeSortVisualization step={currentStep} />
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
              >{`def merge_sort(arr):
    """
    Merge sort algorithm using divide-and-conquer.
    Time Complexity: O(n log n)
    Space Complexity: O(n)
    """
    if len(arr) <= 1:
        return arr
    
    # Divide: split array into two halves
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    # Merge: combine two sorted halves
    return merge(left, right)

def merge(left, right):
    """Merge two sorted arrays into one sorted array."""
    merged = []
    i, j = 0, 0
    
    # Compare elements from both arrays
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            merged.append(left[i])
            i += 1
        else:
            merged.append(right[j])
            j += 1
    
    # Add remaining elements
    merged.extend(left[i:])
    merged.extend(right[j:])
    
    return merged

# Example usage
arr = [38, 27, 43, 3, 9, 82, 10]
sorted_arr = merge_sort(arr)
print(f"Sorted array: {sorted_arr}`}</code>
            </pre>
          </section>
        </div>
        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}

type MergeSortVisualizationProps = {
  step: MergeSortStep;
};

function MergeSortVisualization({ step }: MergeSortVisualizationProps) {
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
        <h3 style={{ marginBottom: "1rem", color: "#e7edf5" }}>Main Array</h3>
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
            const isInRange =
              step.range &&
              index >= step.range.start &&
              index <= step.range.end;
            return (
              <div
                key={index}
                style={{
                  padding: "1rem 1.5rem",
                  backgroundColor: isInRange ? "#3b82f6" : "#1a2332",
                  border: isInRange ? "2px solid #60a5fa" : "1px solid #213040",
                  borderRadius: "8px",
                  color: "#e7edf5",
                  fontWeight: isInRange ? "600" : "400",
                  minWidth: "60px",
                  textAlign: "center",
                  fontSize: "1.1rem",
                }}
                title={`Index ${index}: ${value}`}
              >
                {value}
              </div>
            );
          })}
        </div>
      </div>

      {/* Left and Right Arrays (during merge) */}
      {(step.leftArray || step.rightArray) && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          {step.leftArray && (
            <div>
              <h3 style={{ marginBottom: "1rem", color: "#e7edf5" }}>
                Left Array
                {step.leftIndex !== undefined && (
                  <span style={{ color: "#60a5fa", marginLeft: "0.5rem" }}>
                    (index: {step.leftIndex})
                  </span>
                )}
              </h3>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {step.leftArray.map((value, index) => {
                  const isCurrent = step.leftIndex === index;
                  return (
                    <div
                      key={index}
                      style={{
                        padding: "1rem 1.5rem",
                        backgroundColor: isCurrent ? "#22c55e" : "#1a2332",
                        border: isCurrent
                          ? "2px solid #4ade80"
                          : "1px solid #213040",
                        borderRadius: "8px",
                        color: "#e7edf5",
                        fontWeight: isCurrent ? "600" : "400",
                        minWidth: "60px",
                        textAlign: "center",
                        fontSize: "1.1rem",
                      }}
                      title={`Index ${index}: ${value}`}
                    >
                      {value}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {step.rightArray && (
            <div>
              <h3 style={{ marginBottom: "1rem", color: "#e7edf5" }}>
                Right Array
                {step.rightIndex !== undefined && (
                  <span style={{ color: "#60a5fa", marginLeft: "0.5rem" }}>
                    (index: {step.rightIndex})
                  </span>
                )}
              </h3>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {step.rightArray.map((value, index) => {
                  const isCurrent = step.rightIndex === index;
                  return (
                    <div
                      key={index}
                      style={{
                        padding: "1rem 1.5rem",
                        backgroundColor: isCurrent ? "#f59e0b" : "#1a2332",
                        border: isCurrent
                          ? "2px solid #fbbf24"
                          : "1px solid #213040",
                        borderRadius: "8px",
                        color: "#e7edf5",
                        fontWeight: isCurrent ? "600" : "400",
                        minWidth: "60px",
                        textAlign: "center",
                        fontSize: "1.1rem",
                      }}
                      title={`Index ${index}: ${value}`}
                    >
                      {value}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Comparison (during merge) */}
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
                backgroundColor: "#22c55e",
                borderRadius: "8px",
                fontSize: "1.5rem",
                fontWeight: "600",
                color: "#fff",
              }}
            >
              {step.comparing.left}
            </div>
            <span style={{ fontSize: "2rem", color: "#60a5fa" }}>≤</span>
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

      {/* Merged Array */}
      {step.mergedArray && (
        <div>
          <h3 style={{ marginBottom: "1rem", color: "#e7edf5" }}>
            Merged Array
          </h3>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {step.mergedArray.map((value, index) => (
              <div
                key={index}
                style={{
                  padding: "1rem 1.5rem",
                  backgroundColor: "#3b82f6",
                  border: "2px solid #60a5fa",
                  borderRadius: "8px",
                  color: "#e7edf5",
                  fontWeight: "600",
                  minWidth: "60px",
                  textAlign: "center",
                  fontSize: "1.1rem",
                }}
                title={`Position ${index}: ${value}`}
              >
                {value}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
