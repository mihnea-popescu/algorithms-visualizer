import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  jobSequencingSteps,
  Step,
} from "./jobSequencingAlgorithm";
import Footer from "../../../components/Footer";
import SEO from "../../../components/SEO";
import "../../../styles.css";

const DEFAULT_PROFITS = [20, 15, 10, 5, 1];
const DEFAULT_DEADLINES = [2, 2, 1, 3, 3];

export default function JobSequencingPage() {
  const [profits, setProfits] = useState<number[]>(DEFAULT_PROFITS);
  const [deadlines, setDeadlines] = useState<number[]>(DEFAULT_DEADLINES);
  const [steps, setSteps] = useState<Step[] | null>(null);
  const [stepIndex, setStepIndex] = useState<number>(0);

  // Reset steps when inputs change
  useEffect(() => {
    setSteps(null);
    setStepIndex(0);
  }, [profits, deadlines]);

  function addJob() {
    setProfits([...profits, 1]);
    setDeadlines([...deadlines, 1]);
  }

  function removeJob(index: number) {
    if (profits.length <= 1) return;
    setProfits(profits.filter((_, i) => i !== index));
    setDeadlines(deadlines.filter((_, i) => i !== index));
  }

  function updateProfit(index: number, value: number) {
    const newProfits = [...profits];
    newProfits[index] = Math.max(1, value);
    setProfits(newProfits);
  }

  function updateDeadline(index: number, value: number) {
    const newDeadlines = [...deadlines];
    newDeadlines[index] = Math.max(1, value);
    setDeadlines(newDeadlines);
  }

  function compute() {
    if (profits.length === 0) {
      alert("Please enter at least 1 job");
      return;
    }
    if (profits.length !== deadlines.length) {
      alert("Profits and deadlines arrays must have the same length");
      return;
    }
    try {
      const result = jobSequencingSteps(profits, deadlines);
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
        title="Job Sequencing with Deadlines"
        description="Interactive visualization of the Job Sequencing with Deadlines greedy algorithm. Find the optimal schedule to maximize profit by selecting jobs that can be completed before their deadlines. Step-by-step visualization with greedy strategy based on profit."
        keywords="job sequencing, deadlines, greedy algorithm, job scheduling, profit maximization, algorithm visualization"
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
          <h1 style={{ margin: 0 }}>Job Sequencing with Deadlines</h1>
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
            Enter the profit and deadline for each job. Each job takes 1 unit of time to complete.
            The goal is to maximize total profit by selecting jobs that can be completed before their deadlines.
            The greedy strategy is to sort jobs by profit (descending) and schedule each job at the latest
            available time slot before its deadline.
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            {profits.map((profit, index) => (
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
                <span style={{ fontWeight: "600" }}>Job {index + 1}:</span>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <label>Profit:</label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={profit}
                    onChange={(e) =>
                      updateProfit(index, parseInt(e.target.value) || 1)
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
                  <label>Deadline:</label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={deadlines[index]}
                    onChange={(e) =>
                      updateDeadline(index, parseInt(e.target.value) || 1)
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
                {profits.length > 1 && (
                  <button
                    onClick={() => removeJob(index)}
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
              onClick={addJob}
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
              <span>+</span> Add Job
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
                  Sort jobs by profit (descending), then schedule at latest available slot
                </code>
              </div>
              <div className="formula-explanation">
                <p>
                  <strong>Greedy Strategy:</strong> Sort jobs by profit (descending),
                  then for each job, find the latest available time slot before its deadline.
                  This ensures we maximize profit while respecting deadlines.
                </p>
                <ul style={{ marginLeft: "1.5rem", lineHeight: "1.8" }}>
                  <li>
                    <strong>Profit-based Sorting:</strong> Jobs with higher profit are
                    processed first, as they contribute more to the total profit.
                  </li>
                  <li>
                    <strong>Latest Slot Assignment:</strong> For each job, we assign it
                    to the latest available time slot before its deadline. This leaves
                    earlier slots available for jobs with earlier deadlines.
                  </li>
                  <li>
                    <strong>Why this works:</strong> By processing high-profit jobs first
                    and assigning them to the latest possible slot, we maximize the chance
                    of fitting more jobs into the schedule, thus maximizing total profit.
                  </li>
                </ul>
                {currentStep.schedule.length > 0 && (
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
                    <p>Total Profit: {currentStep.totalProfit}</p>
                    <p>Jobs Scheduled: {currentStep.schedule.length}</p>
                    <p>Maximum Deadline: {currentStep.maxDeadline}</p>
                  </div>
                )}
                <p>
                  <strong>Time Complexity:</strong> O(n²) - In the worst case, for each
                  of n jobs, we may need to check up to n time slots to find the latest
                  available slot. The sorting step is O(n log n), but the scheduling
                  dominates with O(n²).
                </p>
                <p>
                  <strong>Space Complexity:</strong> O(n) - We store the jobs array,
                  sorted jobs array, and schedule array, all of size at most n.
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
            <JobSequencingVisualization step={currentStep} />
          ) : (
            <p>Enter jobs with profits and deadlines, then click Compute to start visualization.</p>
          )}
        </section>

        {/* Results */}
        {currentStep &&
          currentStep.schedule.length > 0 &&
          stepIndex === steps!.length - 1 && (
            <section>
              <h2>Results</h2>
              <div className="formula-box">
                <p>
                  <strong>Total Profit:</strong> {currentStep.totalProfit}
                </p>
                <p>
                  <strong>Jobs Scheduled:</strong> {currentStep.schedule.length}
                </p>
                <p>
                  <strong>Schedule:</strong>
                </p>
                <ul style={{ marginLeft: "1.5rem", lineHeight: "1.8" }}>
                  {currentStep.schedule
                    .sort((a, b) => a.timeSlot - b.timeSlot)
                    .map((scheduled, idx) => (
                      <li key={idx}>
                        Time Slot {scheduled.timeSlot}: Job {scheduled.jobId} (profit: {scheduled.profit})
                      </li>
                    ))}
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
            >{`def job_sequencing_with_deadlines(profits, deadlines):
    """
    Greedy algorithm to solve the job sequencing with deadlines problem.
    Strategy: Sort jobs by profit (descending), then for each job,
    find the latest available time slot before its deadline.
    """
    n = len(profits)
    
    # Create list of (index, profit, deadline) tuples
    jobs = [(i + 1, profits[i], deadlines[i]) for i in range(n)]
    
    # Greedy step: sort by profit (descending)
    sorted_jobs = sorted(jobs, key=lambda x: x[1], reverse=True)
    
    # Find maximum deadline
    max_deadline = max(deadlines)
    
    # Initialize schedule: -1 means slot is empty
    schedule = [-1] * max_deadline
    total_profit = 0
    
    # Process jobs one by one
    for job_id, profit, deadline in sorted_jobs:
        # Find the latest available time slot before the deadline
        slot_found = False
        for slot in range(min(deadline - 1, max_deadline - 1), -1, -1):
            if schedule[slot] == -1:
                schedule[slot] = job_id
                total_profit += profit
                slot_found = True
                break
    
    # Filter out empty slots
    result = [(slot + 1, schedule[slot]) 
              for slot in range(max_deadline) 
              if schedule[slot] != -1]
    
    return result, total_profit

# Example usage
profits = [20, 15, 10, 5, 1]
deadlines = [2, 2, 1, 3, 3]
schedule, total_profit = job_sequencing_with_deadlines(profits, deadlines)
print(f"Schedule: {schedule}")
print(f"Total profit: {total_profit}")`}</code>
          </pre>
        </section>
        </div>
        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}

type JobSequencingVisualizationProps = {
  step: Step;
};

function JobSequencingVisualization({ step }: JobSequencingVisualizationProps) {
  const maxDeadline = step.maxDeadline;
  const scheduleArray = new Array(maxDeadline).fill(null).map((_, index) => {
    const scheduled = step.schedule.find(s => s.timeSlot === index + 1);
    return scheduled || null;
  });

  return (
    <div
      style={{
        backgroundColor: "#0f1722",
        border: "1px solid #213040",
        borderRadius: "8px",
        padding: "2rem",
      }}
    >
      {/* Schedule visualization */}
      <div style={{ marginBottom: "2rem" }}>
        <h3 style={{ marginBottom: "1rem", color: "#e7edf5" }}>
          Schedule Timeline
        </h3>
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {scheduleArray.map((scheduled, index) => (
            <div
              key={index}
              style={{
                flex: "1",
                minWidth: "120px",
                padding: "1rem",
                backgroundColor: scheduled ? "#0f1722" : "#1a2332",
                border: scheduled
                  ? "2px solid #22c55e"
                  : "1px solid #213040",
                borderRadius: "8px",
                textAlign: "center",
                color: "#e7edf5",
              }}
            >
              <div style={{ fontSize: "0.85rem", color: "#a0a0a0", marginBottom: "0.5rem" }}>
                Time Slot {index + 1}
              </div>
              {scheduled ? (
                <>
                  <div style={{ fontSize: "1.2rem", fontWeight: "600", color: "#22c55e" }}>
                    Job {scheduled.jobId}
                  </div>
                  <div style={{ fontSize: "0.9rem", color: "#60a5fa", marginTop: "0.25rem" }}>
                    Profit: {scheduled.profit}
                  </div>
                </>
              ) : (
                <div style={{ fontSize: "0.9rem", color: "#a0a0a0" }}>
                  Empty
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Jobs table */}
      {step.sortedJobs.length > 0 && (
        <div>
          <h3 style={{ marginBottom: "1rem", color: "#e7edf5" }}>
            Jobs (Sorted by Profit)
          </h3>
          <div className="matrix-wrapper">
            <table className="matrix">
              <thead>
                <tr>
                  <th>Job</th>
                  <th>Profit</th>
                  <th>Deadline</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {step.sortedJobs.map((job, index) => {
                  const isCurrent = step.currentJob === index;
                  const scheduled = step.schedule.find(s => s.jobId === job.id);
                  return (
                    <tr
                      key={job.id}
                      style={{
                        backgroundColor: isCurrent ? "#3b82f620" : "transparent",
                      }}
                    >
                      <td>
                        <strong>Job {job.id}</strong>
                      </td>
                      <td>{job.profit}</td>
                      <td>{job.deadline}</td>
                      <td>
                        {scheduled ? (
                          <span style={{ color: "#22c55e" }}>
                            Scheduled at slot {scheduled.timeSlot}
                          </span>
                        ) : (
                          <span style={{ color: "#a0a0a0" }}>Not scheduled</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {step.schedule.length > 0 && (
                  <tr
                    style={{
                      backgroundColor: "#1a2332",
                      fontWeight: "600",
                      borderTop: "2px solid #213040",
                    }}
                  >
                    <td colSpan={2}>
                      <strong>Total Profit</strong>
                    </td>
                    <td colSpan={2}>{step.totalProfit}</td>
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

