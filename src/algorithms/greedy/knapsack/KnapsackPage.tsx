import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  knapsackSteps,
  Step,
  Item,
} from "./knapsackAlgorithm";
import Footer from "../../../components/Footer";
import SEO from "../../../components/SEO";
import "../../../styles.css";

const DEFAULT_WEIGHTS = [10, 20, 30];
const DEFAULT_VALUES = [60, 100, 120];
const DEFAULT_CAPACITY = 50;

export default function KnapsackPage() {
  const [weights, setWeights] = useState<number[]>(DEFAULT_WEIGHTS);
  const [values, setValues] = useState<number[]>(DEFAULT_VALUES);
  const [capacity, setCapacity] = useState<number>(DEFAULT_CAPACITY);
  const [steps, setSteps] = useState<Step[] | null>(null);
  const [stepIndex, setStepIndex] = useState<number>(0);

  // Reset steps when inputs change
  useEffect(() => {
    setSteps(null);
    setStepIndex(0);
  }, [weights, values, capacity]);

  function addItem() {
    setWeights([...weights, 1]);
    setValues([...values, 1]);
  }

  function removeItem(index: number) {
    if (weights.length <= 1) return;
    setWeights(weights.filter((_, i) => i !== index));
    setValues(values.filter((_, i) => i !== index));
  }

  function updateWeight(index: number, value: number) {
    const newWeights = [...weights];
    newWeights[index] = Math.max(0.1, value);
    setWeights(newWeights);
  }

  function updateValue(index: number, value: number) {
    const newValues = [...values];
    newValues[index] = Math.max(0.1, value);
    setValues(newValues);
  }

  function compute() {
    if (weights.length === 0) {
      alert("Please enter at least 1 item");
      return;
    }
    if (capacity <= 0) {
      alert("Capacity must be greater than 0");
      return;
    }
    try {
      const result = knapsackSteps(weights, values, capacity);
      setSteps(result);
      setStepIndex(0);
    } catch (error) {
      alert((error as Error).message);
    }
  }

  const currentStep = steps?.[stepIndex] ?? null;

  return (
    <>
      <SEO
        title="Fractional Knapsack Problem"
        description="Interactive visualization of the Fractional Knapsack greedy algorithm. Find the optimal way to fill a knapsack with items to maximize total value. Step-by-step visualization with greedy strategy based on value/weight ratio."
        keywords="fractional knapsack, greedy algorithm, knapsack problem, optimization, value/weight ratio, algorithm visualization"
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
          <h1 style={{ margin: 0 }}>Fractional Knapsack Problem</h1>
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
            padding: "1rem",
            borderRadius: "8px",
            border: "1px solid var(--border)",
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
            Enter the weight and value of each item, and the knapsack capacity.
            The goal is to maximize the total value while not exceeding the capacity.
            The greedy strategy is to sort items by value/weight ratio (descending)
            and take as much as possible of each item.
          </p>
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "600",
              }}
            >
              Knapsack Capacity:
            </label>
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={capacity}
              onChange={(e) => setCapacity(parseFloat(e.target.value) || 0.1)}
              style={{
                padding: "0.5rem",
                width: "200px",
                backgroundColor: "#1a2332",
                border: "1px solid #213040",
                borderRadius: "4px",
                color: "#e7edf5",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            {weights.map((weight, index) => (
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
                  flexWrap: "wrap",
                }}
              >
                <span style={{ fontWeight: "600" }}>Item {index + 1}:</span>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <label>Weight:</label>
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={weight}
                    onChange={(e) =>
                      updateWeight(index, parseFloat(e.target.value) || 0.1)
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
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <label>Value:</label>
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={values[index]}
                    onChange={(e) =>
                      updateValue(index, parseFloat(e.target.value) || 0.1)
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
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginLeft: "auto" }}>
                  <span style={{ color: "#60a5fa", fontSize: "0.9rem" }}>
                    Ratio: {(values[index] / weight).toFixed(2)}
                  </span>
                </div>
                {weights.length > 1 && (
                  <button
                    onClick={() => removeItem(index)}
                    style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: "#dc2626",
                      border: "none",
                      borderRadius: "4px",
                      color: "white",
                      cursor: "pointer",
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addItem}
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
              <span>+</span> Add Item
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
                  Ratio = Value / Weight
                </code>
              </div>
              <div className="formula-explanation">
                <p>
                  <strong>Greedy Strategy:</strong> Sort items by value/weight ratio
                  (descending), then take as much as possible of each item until
                  the knapsack is full.
                </p>
                <ul style={{ marginLeft: "1.5rem", lineHeight: "1.8" }}>
                  <li>
                    <strong>Value/Weight Ratio</strong> indicates how much value
                    we get per unit of weight. Higher ratio = better value.
                  </li>
                  <li>
                    <strong>Greedy Choice:</strong> Always select the item with the
                    highest remaining ratio first.
                  </li>
                  <li>
                    <strong>Fractional Selection:</strong> If an item doesn't fit
                    completely, take a fraction of it to fill the remaining capacity.
                  </li>
                  <li>
                    <strong>Why this works:</strong> Taking items with higher ratios
                    first maximizes the value per unit of capacity used, leading to
                    the optimal solution.
                  </li>
                </ul>
                {currentStep.selectedItems.length > 0 && (
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
                      <strong>Current Statistics:</strong>
                    </p>
                    <p>Total Value: {currentStep.totalValue.toFixed(2)}</p>
                    <p>Total Weight: {currentStep.totalWeight.toFixed(2)} / {capacity}</p>
                    <p>Remaining Capacity: {currentStep.remainingCapacity.toFixed(2)}</p>
                  </div>
                )}
                <p>
                  <strong>Time Complexity:</strong> O(n log n) - Dominated by
                  the sorting step. We need to sort n items by value/weight ratio.
                </p>
                <p>
                  <strong>Space Complexity:</strong> O(n) - We store the items
                  array and selected items array, both of size n.
                </p>
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
              : "(press Compute)"}
          </h2>
          {currentStep ? (
            <KnapsackVisualization step={currentStep} capacity={capacity} />
          ) : (
            <p>Enter items and capacity, then click Compute to start visualization.</p>
          )}
        </section>

        {/* Results */}
        {currentStep &&
          currentStep.selectedItems.length > 0 &&
          (currentStep.remainingCapacity === 0 ||
            currentStep.currentItem === undefined) && (
            <section>
              <h2>Results</h2>
              <div className="formula-box">
                <p>
                  <strong>Total Value:</strong> {currentStep.totalValue.toFixed(2)}
                </p>
                <p>
                  <strong>Total Weight:</strong> {currentStep.totalWeight.toFixed(2)} / {capacity}
                </p>
                <p>
                  <strong>Items Selected:</strong>
                </p>
                <ul style={{ marginLeft: "1.5rem", lineHeight: "1.8" }}>
                  {currentStep.selectedItems.map((selected, idx) => {
                    const item = currentStep.sortedItems.find(
                      (i) => i.id === selected.itemId
                    );
                    return (
                      <li key={idx}>
                        Item {selected.itemId}: {selected.fraction < 1
                          ? `${(selected.fraction * 100).toFixed(1)}%`
                          : "100%"} (weight: {selected.weight.toFixed(2)}, value: {selected.value.toFixed(2)})
                      </li>
                    );
                  })}
                </ul>
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
            >{`def fractional_knapsack(weights, values, capacity):
    """
    Greedy algorithm to solve the fractional knapsack problem.
    Strategy: Sort items by value/weight ratio (descending), then take
    as much as possible of each item until the knapsack is full.
    """
    n = len(weights)
    
    # Create list of (index, weight, value, ratio) tuples
    items = [(i + 1, weights[i], values[i], values[i] / weights[i])
             for i in range(n)]
    
    # Greedy step: sort by ratio (descending)
    sorted_items = sorted(items, key=lambda x: x[3], reverse=True)
    
    total_value = 0
    remaining_capacity = capacity
    selected = []
    
    for item_id, weight, value, ratio in sorted_items:
        if remaining_capacity <= 0:
            break
        
        if weight <= remaining_capacity:
            # Take the entire item
            fraction = 1.0
            taken_weight = weight
            taken_value = value
        else:
            # Take a fraction of the item
            fraction = remaining_capacity / weight
            taken_weight = remaining_capacity
            taken_value = value * fraction
        
        selected.append((item_id, fraction, taken_weight, taken_value))
        total_value += taken_value
        remaining_capacity -= taken_weight
    
    return selected, total_value

# Example usage
weights = [10, 20, 30]
values = [60, 100, 120]
capacity = 50
selected, total_value = fractional_knapsack(weights, values, capacity)
print(f"Selected items: {selected}")
print(f"Total value: {total_value:.2f}")`}</code>
          </pre>
        </section>
        </div>
        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}

type KnapsackVisualizationProps = {
  step: Step;
  capacity: number;
};

function KnapsackVisualization({ step, capacity }: KnapsackVisualizationProps) {
  return (
    <div
      style={{
        backgroundColor: "#0f1722",
        border: "1px solid #213040",
        borderRadius: "8px",
        padding: "2rem",
      }}
    >
      {/* Knapsack representation */}
      <div style={{ marginBottom: "2rem" }}>
        <h3 style={{ marginBottom: "1rem", color: "#e7edf5" }}>
          Knapsack Contents
        </h3>
        <div
          style={{
            border: "2px solid #213040",
            borderRadius: "8px",
            padding: "1rem",
            backgroundColor: "#1a2332",
            minHeight: "100px",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "0.5rem",
              right: "0.5rem",
              fontSize: "0.85rem",
              color: "#a0a0a0",
            }}
          >
            Capacity: {capacity} | Used: {step.totalWeight.toFixed(2)} | Remaining: {step.remainingCapacity.toFixed(2)}
          </div>
          {step.selectedItems.length > 0 ? (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.5rem",
                alignItems: "center",
                marginTop: "2rem",
              }}
            >
              {step.selectedItems.map((selected, index) => {
                const item = step.sortedItems.find(
                  (i) => i.id === selected.itemId
                );
                if (!item) return null;
                const isCurrent = step.currentItem === step.sortedItems.indexOf(item);
                return (
                  <div
                    key={selected.itemId}
                    style={{
                      padding: "1rem 1.5rem",
                      backgroundColor: isCurrent ? "#3b82f6" : "#0f1722",
                      border: isCurrent
                        ? "2px solid #60a5fa"
                        : "1px solid #213040",
                      borderRadius: "8px",
                      color: "#e7edf5",
                      fontWeight: isCurrent ? "600" : "400",
                      position: "relative",
                      minWidth: "140px",
                      textAlign: "center",
                    }}
                    title={`Item ${selected.itemId}: ${selected.fraction < 1 ? `${(selected.fraction * 100).toFixed(1)}%` : "100%"} taken`}
                  >
                    <div style={{ fontSize: "0.9rem", color: "#a0a0a0" }}>
                      Item {selected.itemId}
                    </div>
                    <div style={{ fontSize: "1rem", marginTop: "0.25rem" }}>
                      {selected.fraction < 1
                        ? `${(selected.fraction * 100).toFixed(1)}%`
                        : "100%"}
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "#60a5fa", marginTop: "0.25rem" }}>
                      W: {selected.weight.toFixed(2)}
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "#22c55e", marginTop: "0.25rem" }}>
                      V: {selected.value.toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ color: "#a0a0a0", marginTop: "2rem" }}>No items selected yet</p>
          )}
        </div>
      </div>

      {/* Items table */}
      {step.sortedItems.length > 0 && (
        <div>
          <h3 style={{ marginBottom: "1rem", color: "#e7edf5" }}>
            Items (Sorted by Value/Weight Ratio)
          </h3>
          <div className="matrix-wrapper">
            <table className="matrix">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Weight</th>
                  <th>Value</th>
                  <th>Ratio</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {step.sortedItems.map((item, index) => {
                  const isCurrent = step.currentItem === index;
                  const selected = step.selectedItems.find(
                    (s) => s.itemId === item.id
                  );
                  return (
                    <tr
                      key={item.id}
                      style={{
                        backgroundColor: isCurrent ? "#3b82f620" : "transparent",
                      }}
                    >
                      <td>
                        <strong>Item {item.id}</strong>
                      </td>
                      <td>{item.weight}</td>
                      <td>{item.value}</td>
                      <td>{item.ratio.toFixed(2)}</td>
                      <td>
                        {selected ? (
                          selected.fraction < 1 ? (
                            <span style={{ color: "#fbbf24" }}>
                              {((selected.fraction * 100).toFixed(1))}% taken
                            </span>
                          ) : (
                            <span style={{ color: "#22c55e" }}>100% taken</span>
                          )
                        ) : (
                          <span style={{ color: "#a0a0a0" }}>Not selected</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {step.selectedItems.length > 0 && (
                  <tr
                    style={{
                      backgroundColor: "#1a2332",
                      fontWeight: "600",
                      borderTop: "2px solid #213040",
                    }}
                  >
                    <td colSpan={3}>
                      <strong>Total Value</strong>
                    </td>
                    <td colSpan={2}>{step.totalValue.toFixed(2)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

