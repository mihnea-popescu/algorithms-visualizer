import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import HomePage from "./components/HomePage";
import FloydWarshallPage from "./algorithms/graph/floyd-warshall/FloydWarshallPage";

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/graph/floyd-warshall" element={<FloydWarshallPage />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}
