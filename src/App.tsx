import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import HomePage from "./components/HomePage";
import FloydWarshallPage from "./algorithms/graph/floyd-warshall/FloydWarshallPage";
import DijkstraPage from "./algorithms/graph/dijkstra/DijkstraPage";
import BottleneckPathPage from "./algorithms/graph/bottleneck-path/BottleneckPathPage";
import PrimsPage from "./algorithms/graph/prims-mst/PrimsPage";
import KruskalsPage from "./algorithms/graph/kruskals-mst/KruskalsPage";
import TSPPage from "./algorithms/graph/traveling-salesman/TSPPage";
import MatrixChainPage from "./algorithms/dp/matrix-chain-multiplication/MatrixChainPage";
import OptimalBinarySearchTreePage from "./algorithms/dp/optimal-binary-search-tree/OptimalBinarySearchTreePage";
import OptimalStoragePage from "./algorithms/greedy/optimal-storage-on-tapes/OptimalStoragePage";
import KnapsackPage from "./algorithms/greedy/knapsack/KnapsackPage";
import JobSequencingPage from "./algorithms/greedy/job-sequencing/JobSequencingPage";
import JobSequencingUnionFindPage from "./algorithms/greedy/job-sequencing-union-find/JobSequencingUnionFindPage";
import HuffmanCodePage from "./algorithms/greedy/huffman-code/HuffmanCodePage";
import TernaryHuffmanPage from "./algorithms/greedy/ternary-huffman/TernaryHuffmanPage";
import MergeSortPage from "./algorithms/sorting/merge-sort/MergeSortPage";
import QuickSortPage from "./algorithms/sorting/quick-sort/QuickSortPage";
import QuickSelectPage from "./algorithms/sorting/quick-select/QuickSelectPage";
import MedianOfMediansPage from "./algorithms/sorting/median-of-medians/MedianOfMediansPage";

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
          <Route path="/graph/bottleneck-path" element={<BottleneckPathPage />} />
          <Route path="/graph/prims-mst" element={<PrimsPage />} />
          <Route path="/graph/kruskals-mst" element={<KruskalsPage />} />
          <Route path="/graph/traveling-salesman" element={<TSPPage />} />
          <Route
            path="/dp/matrix-chain-multiplication"
            element={<MatrixChainPage />}
          />
          <Route
            path="/dp/optimal-binary-search-tree"
            element={<OptimalBinarySearchTreePage />}
          />
          <Route
            path="/greedy/optimal-storage-on-tapes"
            element={<OptimalStoragePage />}
          />
          <Route path="/greedy/knapsack" element={<KnapsackPage />} />
          <Route path="/greedy/job-sequencing" element={<JobSequencingPage />} />
          <Route path="/greedy/job-sequencing-union-find" element={<JobSequencingUnionFindPage />} />
          <Route path="/greedy/huffman-code" element={<HuffmanCodePage />} />
          <Route path="/greedy/ternary-huffman" element={<TernaryHuffmanPage />} />
          <Route path="/sorting/merge-sort" element={<MergeSortPage />} />
          <Route path="/sorting/quick-sort" element={<QuickSortPage />} />
          <Route path="/sorting/quick-select" element={<QuickSelectPage />} />
          <Route
            path="/sorting/median-of-medians"
            element={<MedianOfMediansPage />}
          />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}
