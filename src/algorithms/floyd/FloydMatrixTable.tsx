import React, { useState } from "react";
import { Matrix, displayCell } from "./floydAlgorithm";

type Props = {
  matrix: Matrix;
  updates?: Set<string>;
  headers?: string[];
  debug?: Record<string, string>;
};

export default function MatrixTable({
  matrix,
  updates,
  headers,
  debug,
}: Props) {
  const n = matrix.length;
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="matrix-wrapper">
      <table className="matrix">
        <thead>
          <tr>
            <th></th>
            {Array.from({ length: n }, (_, j) => (
              <th key={j}>{headers?.[j] ?? j}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.map((row, i) => (
            <tr key={i}>
              <th>{headers?.[i] ?? i}</th>
              {row.map((v, j) => {
                const key = `${i}-${j}`;
                const isUpdated = updates?.has(key);
                const showTip = hovered === key && debug?.[key];
                return (
                  <td
                    key={j}
                    className={isUpdated ? "updated" : undefined}
                    onMouseEnter={() => setHovered(key)}
                    onMouseLeave={() => setHovered(null)}
                    style={{ position: "relative" }}
                    title={
                      debug?.[key] ? "Hover for calculation details" : undefined
                    }
                  >
                    {displayCell(v)}
                    {showTip && (
                      <div className="tooltip">
                        <div className="tooltip-title">Calculation:</div>
                        <div className="tooltip-content">{debug![key]}</div>
                      </div>
                    )}
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
