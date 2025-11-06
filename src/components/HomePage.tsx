import React from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import SEO from "./SEO";
import "./../styles.css";

interface Algorithm {
  name: string;
  path: string;
}

interface Category {
  name: string;
  algorithms: Algorithm[];
}

const categories: Category[] = [
  {
    name: "Graph Theory",
    algorithms: [
      { name: "Floyd–Warshall", path: "/graph/floyd-warshall" },
      { name: "Dijkstra", path: "/graph/dijkstra" },
      // Placeholder for future algorithms
      // { name: "Bellman-Ford", path: "/graph/bellman-ford" },
      // { name: "Traveling Salesman", path: "/graph/traveling-salesman" },
    ],
  },
  {
    name: "Dynamic Programming",
    algorithms: [
      { name: "Floyd–Warshall", path: "/graph/floyd-warshall" },
      { name: "Matrix Chain Multiplication", path: "/dp/matrix-chain-multiplication" },
      // Placeholder for future algorithms
      // { name: "Knapsack", path: "/dp/knapsack" },
      // { name: "Longest Common Subsequence", path: "/dp/lcs" },
    ],
  },
  {
    name: "Greedy",
    algorithms: [
      { name: "Dijkstra", path: "/graph/dijkstra" },
      { name: "Optimal Storage on Tapes", path: "/greedy/optimal-storage-on-tapes" },
      // Placeholder for future algorithms
    ],
  },
  {
    name: "Sorting",
    algorithms: [
      // Placeholder for future algorithms
      // { name: "Merge Sort", path: "/sorting/merge-sort" },
      // { name: "Quick Sort", path: "/sorting/quick-sort" },
    ],
  },
];

export default function HomePage() {
  return (
    <>
      <SEO
        title="Algorithms Visualizer"
        description="Interactive educational platform for visualizing algorithms step by step. Explore graph theory, dynamic programming, greedy algorithms, and sorting algorithms with interactive visualizations."
        keywords="algorithms, visualization, graph theory, dynamic programming, sorting, educational, interactive learning, Floyd-Warshall, Dijkstra"
      />
      <div
        className="app"
        style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}
      >
        <header style={{ textAlign: "center", marginBottom: "4rem" }}>
          <h1
            style={{
              fontSize: "3rem",
              marginBottom: "1rem",
              fontWeight: "700",
              letterSpacing: "0.02em",
              background: "linear-gradient(135deg, var(--accent), #a78bfa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Algorithms Visualizer
          </h1>
          <p
            style={{
              fontSize: "1.2rem",
              color: "var(--muted)",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Interactive educational platform for visualizing algorithms step by
            step
          </p>
        </header>

        <main>
          {categories.map((category) => (
            <section
              key={category.name}
              style={{
                marginBottom: "2.5rem",
                padding: "2rem",
                backgroundColor: "var(--panel)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h2
                style={{
                  fontSize: "1.8rem",
                  marginBottom: "1.5rem",
                  color: "var(--text)",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <span style={{ color: "var(--accent)" }}>▸</span>
                {category.name}
              </h2>
              {category.algorithms.length > 0 ? (
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(220px, 1fr))",
                    gap: "1rem",
                  }}
                >
                  {category.algorithms.map((algorithm) => (
                    <li key={algorithm.path}>
                      <Link
                        to={algorithm.path}
                        style={{
                          display: "block",
                          padding: "1.25rem 1.5rem",
                          backgroundColor: "#0f1722",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                          textDecoration: "none",
                          color: "var(--text)",
                          transition: "all 0.2s ease",
                          fontWeight: "500",
                          fontSize: "1rem",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#1a2332";
                          e.currentTarget.style.borderColor = "var(--accent)";
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow =
                            "0 4px 12px rgba(96, 165, 250, 0.2)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "#0f1722";
                          e.currentTarget.style.borderColor = "var(--border)";
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        {algorithm.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p
                  style={{
                    color: "var(--muted)",
                    fontStyle: "italic",
                    padding: "1rem 0",
                  }}
                >
                  Coming soon...
                </p>
              )}
            </section>
          ))}
        </main>

        <Footer />
      </div>
    </>
  );
}
