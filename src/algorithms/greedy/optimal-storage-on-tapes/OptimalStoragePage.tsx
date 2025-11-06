import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  optimalStorageSteps,
  Step,
  Program,
  displayNumber,
} from "./optimalStorageAlgorithm";
import Footer from "../../../components/Footer";
import SEO from "../../../components/SEO";
import "../../../styles.css";

const DEFAULT_PROGRAMS = [5, 10, 3, 8, 2];

export default function OptimalStoragePage() {
  const [programLengths, setProgramLengths] = useState<number[]>(DEFAULT_PROGRAMS);
  const [steps, setSteps] = useState<Step[] | null>(null);
  const [stepIndex, setStepIndex] = useState<number>(0);

  // Reset steps when program lengths change
  useEffect(() => {
    setSteps(null);
    setStepIndex(0);
  }, [programLengths]);

  function addProgram() {
    setProgramLengths([...programLengths, 1]);
  }

  function removeProgram(index: number) {
    if (programLengths.length <= 1) return;
    setProgramLengths(programLengths.filter((_, i) => i !== index));
  }

  function updateProgram(index: number, value: number) {
    const newPrograms = [...programLengths];
    newPrograms[index] = Math.max(1, value);
    setProgramLengths(newPrograms);
  }

  function compute() {
    if (programLengths.length === 0) {
      alert("Please enter at least 1 program");
      return;
    }
    const result = optimalStorageSteps(programLengths);
    setSteps(result);
    setStepIndex(0);
  }

  const currentStep = steps?.[stepIndex] ?? null;

  return (
    <>
      <SEO
        title="Optimal Storage on Tapes"
        description="Interactive visualization of the Optimal Storage on Tapes greedy algorithm. Find the optimal order to store programs on tapes to minimize average retrieval time. Step-by-step visualization with greedy sorting strategy."
        keywords="optimal storage on tapes, greedy algorithm, program ordering, retrieval time minimization, greedy sorting, algorithm visualization"
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
          <h1 style={{ margin: 0 }}>Optimal Storage on Tapes</h1>
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
            Enter the length of each program. The goal is to find the optimal
            order to store programs on tapes that minimizes the average retrieval
            time. The greedy strategy is to sort programs by length in ascending
            order (shortest first).
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            {programLengths.map((length, index) => (
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
                <span style={{ fontWeight: "600" }}>Program {index + 1}:</span>
                <input
                  type="number"
                  min="1"
                  value={length}
                  onChange={(e) =>
                    updateProgram(index, parseInt(e.target.value, 10) || 1)
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
                <span>units</span>
                {programLengths.length > 1 && (
                  <button
                    onClick={() => removeProgram(index)}
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
              onClick={addProgram}
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
              <span>+</span> Add Program
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
                  Average Retrieval Time = (Σ retrieval_time[i]) / n
                </code>
              </div>
              <div className="formula-explanation">
                <p>
                  <strong>Greedy Strategy:</strong> Sort programs by length in
                  ascending order (shortest first).
                </p>
                <ul style={{ marginLeft: "1.5rem", lineHeight: "1.8" }}>
                  <li>
                    <strong>Retrieval Time</strong> for a program at position i
                    = sum of all programs from position 0 to i (including itself)
                  </li>
                  <li>
                    <strong>Total Retrieval Time</strong> = sum of retrieval
                    times for all programs
                  </li>
                  <li>
                    <strong>Average Retrieval Time</strong> = Total Retrieval
                    Time / number of programs
                  </li>
                  <li>
                    <strong>Why shortest first?</strong> By placing shorter
                    programs first, we minimize the cumulative time that longer
                    programs wait, reducing the overall average retrieval time.
                  </li>
                </ul>
                {currentStep.sortedPrograms.length > 0 && (
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
                    <p>Total Retrieval Time: {currentStep.totalTime}</p>
                    <p>
                      Average Retrieval Time: {currentStep.averageTime.toFixed(2)}
                    </p>
                  </div>
                )}
                <p>
                  <strong>Time Complexity:</strong> O(n log n) - Dominated by
                  the sorting step. We need to sort n programs by length.
                </p>
                <p>
                  <strong>Space Complexity:</strong> O(n) - We store the
                  programs array and cumulative time array, both of size n.
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
            <TapeVisualization step={currentStep} />
          ) : (
            <p>Enter program lengths and click Compute to start visualization.</p>
          )}
        </section>

        {/* Results */}
        {currentStep &&
          currentStep.sortedPrograms.length === programLengths.length && (
            <section>
              <h2>Results</h2>
              <div className="formula-box">
                <p>
                  <strong>Optimal Order:</strong>{" "}
                  {currentStep.sortedPrograms
                    .map((p) => `Program ${p.id} (length ${p.length})`)
                    .join(" → ")}
                </p>
                <p>
                  <strong>Total Retrieval Time:</strong> {currentStep.totalTime}
                </p>
                <p>
                  <strong>Average Retrieval Time:</strong>{" "}
                  {currentStep.averageTime.toFixed(2)}
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
            >{`def optimal_storage_on_tapes(program_lengths):
    """
    Greedy algorithm to minimize average retrieval time.
    Strategy: Sort programs by length in ascending order (shortest first).
    """
    n = len(program_lengths)
    
    # Create list of (index, length) pairs
    programs = [(i + 1, length) for i, length in enumerate(program_lengths)]
    
    # Greedy step: sort by length (ascending)
    sorted_programs = sorted(programs, key=lambda x: x[1])
    
    # Calculate cumulative retrieval time
    cumulative_time = []
    total_time = 0
    for i, (program_id, length) in enumerate(sorted_programs):
        if i == 0:
            cumulative_time.append(length)
        else:
            cumulative_time.append(cumulative_time[i-1] + length)
        total_time += cumulative_time[i]
    
    # Calculate average retrieval time
    average_time = total_time / n if n > 0 else 0
    
    return sorted_programs, total_time, average_time

# Example usage
programs = [5, 10, 3, 8, 2]
optimal_order, total, average = optimal_storage_on_tapes(programs)
print(f"Optimal order: {optimal_order}")
print(f"Total retrieval time: {total}")
print(f"Average retrieval time: {average:.2f}")`}</code>
          </pre>
        </section>
        </div>
        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}

type TapeVisualizationProps = {
  step: Step;
};

function TapeVisualization({ step }: TapeVisualizationProps) {
  return (
    <div
      style={{
        backgroundColor: "#0f1722",
        border: "1px solid #213040",
        borderRadius: "8px",
        padding: "2rem",
      }}
    >
      {/* Tape representation */}
      <div style={{ marginBottom: "2rem" }}>
        <h3 style={{ marginBottom: "1rem", color: "#e7edf5" }}>
          Tape Storage Order
        </h3>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
            alignItems: "center",
          }}
        >
          {step.sortedPrograms.length > 0 ? (
            step.sortedPrograms.map((program, index) => {
              const isCurrent = step.currentProgram === index;
              return (
                <div
                  key={program.id}
                  style={{
                    padding: "1rem 1.5rem",
                    backgroundColor: isCurrent ? "#3b82f6" : "#1a2332",
                    border: isCurrent
                      ? "2px solid #60a5fa"
                      : "1px solid #213040",
                    borderRadius: "8px",
                    color: "#e7edf5",
                    fontWeight: isCurrent ? "600" : "400",
                    position: "relative",
                    minWidth: "120px",
                    textAlign: "center",
                  }}
                  title={`Program ${program.id} (length: ${program.length})`}
                >
                  <div style={{ fontSize: "0.9rem", color: "#a0a0a0" }}>
                    Position {index + 1}
                  </div>
                  <div style={{ fontSize: "1.2rem", marginTop: "0.25rem" }}>
                    P{program.id}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#60a5fa" }}>
                    Length: {program.length}
                  </div>
                  {step.cumulativeTime[index] !== undefined && (
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#22c55e",
                        marginTop: "0.25rem",
                      }}
                    >
                      Retrieval: {step.cumulativeTime[index]}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p style={{ color: "#a0a0a0" }}>No programs yet</p>
          )}
        </div>
      </div>

      {/* Statistics table */}
      {step.sortedPrograms.length > 0 && (
        <div>
          <h3 style={{ marginBottom: "1rem", color: "#e7edf5" }}>
            Retrieval Time Details
          </h3>
          <div className="matrix-wrapper">
            <table className="matrix">
              <thead>
                <tr>
                  <th>Position</th>
                  <th>Program</th>
                  <th>Length</th>
                  <th>Retrieval Time</th>
                </tr>
              </thead>
              <tbody>
                {step.sortedPrograms.map((program, index) => {
                  const isCurrent = step.currentProgram === index;
                  return (
                    <tr
                      key={program.id}
                      style={{
                        backgroundColor: isCurrent ? "#3b82f620" : "transparent",
                      }}
                    >
                      <td>{index + 1}</td>
                      <td>
                        <strong>Program {program.id}</strong>
                      </td>
                      <td>{program.length}</td>
                      <td>
                        {step.cumulativeTime[index] !== undefined
                          ? step.cumulativeTime[index]
                          : "—"}
                      </td>
                    </tr>
                  );
                })}
                {step.sortedPrograms.length > 0 && (
                  <tr
                    style={{
                      backgroundColor: "#1a2332",
                      fontWeight: "600",
                      borderTop: "2px solid #213040",
                    }}
                  >
                    <td colSpan={3}>
                      <strong>Total Retrieval Time</strong>
                    </td>
                    <td>{step.totalTime}</td>
                  </tr>
                )}
                {step.sortedPrograms.length > 0 && (
                  <tr
                    style={{
                      backgroundColor: "#1a2332",
                      fontWeight: "600",
                    }}
                  >
                    <td colSpan={3}>
                      <strong>Average Retrieval Time</strong>
                    </td>
                    <td>{step.averageTime.toFixed(2)}</td>
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

