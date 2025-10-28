import React, { useMemo } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { Matrix } from "../algorithms/floyd/floydAlgorithm";

type GraphVisualizationProps = {
  matrix: Matrix;
  labels: string[];
};

interface GraphNode {
  id: string;
  label: string;
}

interface GraphLink {
  source: string;
  target: string;
  weight: number;
}

export default function GraphVisualization({
  matrix,
  labels,
}: GraphVisualizationProps) {
  const graphData = useMemo(() => {
    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];

    // Create nodes for each vertex
    for (let i = 0; i < matrix.length; i++) {
      nodes.push({
        id: labels[i],
        label: labels[i],
      });
    }

    // Create links for each edge
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix.length; j++) {
        const weight = matrix[i][j];
        // Only create links for finite weights (not INF and not self-loops)
        if (Number.isFinite(weight) && weight > 0 && i !== j) {
          links.push({
            source: labels[i],
            target: labels[j],
            weight: weight,
          });
        }
      }
    }

    return { nodes, links };
  }, [matrix, labels]);

  return (
    <div className="graph-container">
      <ForceGraph2D
        graphData={graphData}
        nodeLabel="label"
        linkLabel={(link: GraphLink) => `${link.weight}`}
        nodeColor={() => "#60a5fa"}
        linkColor={() => "#9bb0c3"}
        backgroundColor="transparent"
        width={800}
        height={500}
        nodeCanvasObject={(
          node: any,
          ctx: CanvasRenderingContext2D,
          globalScale: number
        ) => {
          const label = node.label;
          const fontSize = 16 / globalScale;
          const nodeRadius = 25 / globalScale;

          // Draw node circle
          ctx.beginPath();
          ctx.arc(node.x, node.y, nodeRadius, 0, 2 * Math.PI, false);
          ctx.fillStyle = "#60a5fa";
          ctx.fill();
          ctx.strokeStyle = "#e7edf5";
          ctx.lineWidth = 3 / globalScale;
          ctx.stroke();

          // Draw node label
          ctx.font = `bold ${fontSize}px Sans-Serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = "#e7edf5";
          ctx.fillText(label, node.x, node.y);
        }}
        linkWidth={(link: GraphLink) => Math.max(2, Math.sqrt(link.weight) / 2)}
        cooldownTicks={200}
        enableZoomInteraction={true}
        enableNodeDrag={true}
        onNodeHover={(node: any) => {
          // Optional: Add hover effects
        }}
      />
    </div>
  );
}
