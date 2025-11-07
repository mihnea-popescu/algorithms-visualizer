import React from "react";
import { displayCell } from "./optimalBinarySearchTreeAlgorithm";

interface OptimalBinarySearchTreeTableProps {
  costMatrix: number[][];
  rootMatrix: number[][];
  updates?: Set<string>;
  currentI?: number;
  currentJ?: number;
  keys: string[];
}

export default function OptimalBinarySearchTreeTable({
  costMatrix,
  rootMatrix,
  updates = new Set(),
  currentI,
  currentJ,
  keys,
}: OptimalBinarySearchTreeTableProps) {
  const n = costMatrix.length;

  return (
    <div className="matrix-wrapper">
      <h3 style={{ marginBottom: "1rem", paddingLeft: "1rem" }}>
        Cost Matrix (cost[i][j])
      </h3>
      <p style={{ marginBottom: "1rem", paddingLeft: "1rem", color: "#a0a0a0", fontSize: "0.9rem" }}>
        cost[i][j] = minimum cost of BST for keys from index i to j (inclusive)
      </p>
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
                    title={
                      i > j
                        ? "Invalid range (i > j)"
                        : `cost[${i}][${j}] = ${displayCell(costMatrix[i][j])}`
                    }
                  >
                    {i > j ? "—" : displayCell(costMatrix[i][j])}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ marginBottom: "1rem", paddingLeft: "1rem" }}>
        Root Matrix (root[i][j])
      </h3>
      <p style={{ marginBottom: "1rem", paddingLeft: "1rem", color: "#a0a0a0", fontSize: "0.9rem" }}>
        root[i][j] = index of root key for optimal BST from i to j
      </p>
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
                const rootIdx = rootMatrix[i][j];

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
                    title={
                      i > j
                        ? "Invalid range"
                        : rootIdx >= 0
                        ? `Root at index ${rootIdx} (key "${keys[rootIdx]}")`
                        : "Not computed"
                    }
                  >
                    {i > j ? "—" : rootIdx >= 0 ? rootIdx : "—"}
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


