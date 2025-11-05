import React from "react";
import { displayCell } from "./matrixChainAlgorithm";

interface MatrixChainTableProps {
  matrix: number[][];
  split: number[][];
  updates?: Set<string>;
  currentI?: number;
  currentJ?: number;
}

export default function MatrixChainTable({
  matrix,
  split,
  updates = new Set(),
  currentI,
  currentJ,
}: MatrixChainTableProps) {
  const n = matrix.length;

  return (
    <div className="matrix-wrapper">
      <h3 style={{ marginBottom: "1rem", paddingLeft: "1rem" }}>Cost Matrix (m[i][j])</h3>
      <table className="matrix" style={{ marginBottom: "2rem" }}>
        <thead>
          <tr>
            <th>i\j</th>
            {Array.from({ length: n }, (_, j) => (
              <th key={j}>{j}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: n }, (_, i) => (
            <tr key={i}>
              <th>{i}</th>
              {Array.from({ length: n }, (_, j) => {
                const isUpdated = updates.has(`${i}-${j}`);
                const isCurrent = i === currentI && j === currentJ;
                
                let bgColor = "#0f1722";
                if (isCurrent && currentI !== undefined && currentJ !== undefined) {
                  bgColor = "#3b82f6";
                } else if (isUpdated && currentI !== undefined && currentJ !== undefined) {
                  bgColor = "#22c55e";
                } else if (i > j) {
                  bgColor = "#1a1a1a";
                }

                return (
                  <td
                    key={j}
                    style={{
                      backgroundColor: bgColor,
                      border: isCurrent ? "2px solid #60a5fa" : "1px solid #213040",
                      padding: "0.75rem",
                      textAlign: "center",
                      minWidth: "60px",
                      color: i > j ? "#666" : "#e7edf5",
                    }}
                    title={i > j ? "Invalid range (i > j)" : `m[${i}][${j}] = ${displayCell(matrix[i][j])}`}
                  >
                    {i > j ? "—" : displayCell(matrix[i][j])}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ marginBottom: "1rem", paddingLeft: "1rem" }}>Split Matrix (optimal k)</h3>
      <table className="matrix">
        <thead>
          <tr>
            <th>i\j</th>
            {Array.from({ length: n }, (_, j) => (
              <th key={j}>{j}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: n }, (_, i) => (
            <tr key={i}>
              <th>{i}</th>
              {Array.from({ length: n }, (_, j) => {
                const isCurrent = i === currentI && j === currentJ;
                const bgColor = i > j ? "#1a1a1a" : isCurrent ? "#3b82f6" : "#0f1722";

                return (
                  <td
                    key={j}
                    style={{
                      backgroundColor: bgColor,
                      border: isCurrent ? "2px solid #60a5fa" : "1px solid #213040",
                      padding: "0.75rem",
                      textAlign: "center",
                      minWidth: "60px",
                      color: i > j ? "#666" : "#e7edf5",
                    }}
                    title={i > j ? "Invalid range" : split[i][j] >= 0 ? `Split at k = ${split[i][j]}` : "Not computed"}
                  >
                    {i > j ? "—" : split[i][j] >= 0 ? split[i][j] : "—"}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

