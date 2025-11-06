import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import HomePage from "./components/HomePage";
import FloydWarshallPage from "./algorithms/graph/floyd-warshall/FloydWarshallPage";
import DijkstraPage from "./algorithms/graph/dijkstra/DijkstraPage";
import MatrixChainPage from "./algorithms/dp/matrix-chain-multiplication/MatrixChainPage";
import OptimalStoragePage from "./algorithms/greedy/optimal-storage-on-tapes/OptimalStoragePage";
import KnapsackPage from "./algorithms/greedy/knapsack/KnapsackPage";

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter
        basename={
          process.env.NODE_ENV === "production" ? "/algorithms-visualizer" : "/"
        }
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/graph/floyd-warshall" element={<FloydWarshallPage />} />
          <Route path="/graph/dijkstra" element={<DijkstraPage />} />
          <Route
            path="/dp/matrix-chain-multiplication"
            element={<MatrixChainPage />}
          />
          <Route
            path="/greedy/optimal-storage-on-tapes"
            element={<OptimalStoragePage />}
          />
          <Route
            path="/greedy/knapsack"
            element={<KnapsackPage />}
          />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}
