import React from "react";

export default function Footer() {
  return (
    <footer style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid #e5e7eb", textAlign: "center", color: "#6b7280" }}>
      <p style={{ margin: "0.5rem 0" }}>
        <strong>Made by Mihnea Popescu</strong>
      </p>
      <p style={{ margin: "0.5rem 0" }}>
        Open source on{" "}
        <a
          href="https://github.com/mihnea-popescu/algorithms-visualizer"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#3b82f6", textDecoration: "none" }}
        >
          GitHub
        </a>
      </p>
    </footer>
  );
}

