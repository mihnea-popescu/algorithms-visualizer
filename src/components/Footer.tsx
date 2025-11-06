import React from "react";

export default function Footer() {
  return (
    <footer style={{ width: "100%", marginTop: "2rem", paddingTop: "1rem", paddingBottom: "1rem", borderTop: "1px solid var(--border)", textAlign: "center", color: "var(--muted)" }}>
      <p style={{ margin: "0.25rem 0" }}>
        <strong>Made by Mihnea Popescu</strong>
      </p>
      <p style={{ margin: "0.25rem 0" }}>
        Open source on{" "}
        <a
          href="https://github.com/mihnea-popescu/algorithms-visualizer"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--accent)", textDecoration: "none" }}
        >
          GitHub
        </a>
      </p>
    </footer>
  );
}

