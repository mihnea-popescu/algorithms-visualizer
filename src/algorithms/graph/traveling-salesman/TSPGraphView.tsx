import React, { useMemo } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { Matrix } from "../../floyd/floydAlgorithm";
import { TSPStep } from "./tspAlgorithm";

type TSPGraphViewProps = {
  matrix: Matrix;
  labels: string[];
  step: TSPStep | null;
  start: number;
};

interface GraphNode {
  id: string;
  label: string;
  isVisited: boolean;
  isCurrent: boolean;
  isStart: boolean;
  isInTour: boolean;
}

interface GraphLink {
  source: string;
  target: string;
  weight: number;
  isInTour: boolean;
  isCurrent: boolean;
}

export default function TSPGraphView({
  matrix,
  labels,
  step,
  start,
}: TSPGraphViewProps) {
  const graphData = useMemo(() => {
    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];

    if (!step) {
      for (let i = 0; i < matrix.length; i++) {
        nodes.push({
          id: labels[i],
          label: labels[i],
          isVisited: false,
          isCurrent: false,
          isStart: i === start,
          isInTour: false,
        });
      }
    } else {
      for (let i = 0; i < matrix.length; i++) {
        const isInTour = step.currentPath.includes(i);
        nodes.push({
          id: labels[i],
          label: labels[i],
          isVisited: step.visited.has(i),
          isCurrent: step.currentCity === i,
          isStart: i === start,
          isInTour,
        });
      }
    }

    // Create links
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix.length; j++) {
        const weight = matrix[i][j];
        if (Number.isFinite(weight) && weight > 0 && i !== j) {
          let isInTour = false;
          let isCurrent = false;

          if (step?.currentPath && step.currentPath.length > 0) {
            const path = step.currentPath;
            // Check if edge (i, j) is consecutive in the path
            for (let k = 0; k < path.length - 1; k++) {
              if (path[k] === i && path[k + 1] === j) {
                isInTour = true;
                break;
              }
            }
            // Check if it's the return edge (last city to start) for complete tour
            if (
              path.length === matrix.length &&
              path[path.length - 1] === i &&
              path[0] === j
            ) {
              isInTour = true;
            }
            // Check if this is the current edge being considered
            if (
              path.length > 0 &&
              path[path.length - 1] === i &&
              step.currentCity === j
            ) {
              isCurrent = true;
            }
          }

          links.push({
            source: labels[i],
            target: labels[j],
            weight: weight,
            isInTour,
            isCurrent,
          });
        }
      }
    }

    return { nodes, links };
  }, [matrix, labels, step, start]);

  return (
    <div className="graph-container">
      <ForceGraph2D
        graphData={graphData}
        nodeLabel={(node: any) => node.label}
        linkLabel={(link: GraphLink) => `${link.weight}`}
        nodeColor={(node: GraphNode) => {
          if (node.isStart) return "#f59e0b";
          if (node.isCurrent) return "#10b981";
          if (node.isInTour) return "#60a5fa";
          if (node.isVisited) return "#8b5cf6";
          return "#9bb0c3";
        }}
        linkColor={(link: GraphLink) => {
          if (link.isInTour) return "#10b981";
          if (link.isCurrent) return "#f59e0b";
          return "#9bb0c3";
        }}
        linkWidth={(link: GraphLink) => {
          if (link.isInTour) return 4;
          if (link.isCurrent) return 3;
          return 2;
        }}
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
          const nodeRadius = 30 / globalScale;

          let color = "#9bb0c3";
          if (node.isStart) color = "#f59e0b";
          else if (node.isCurrent) color = "#10b981";
          else if (node.isInTour) color = "#60a5fa";
          else if (node.isVisited) color = "#8b5cf6";

          ctx.beginPath();
          ctx.arc(node.x, node.y, nodeRadius, 0, 2 * Math.PI, false);
          ctx.fillStyle = color;
          ctx.fill();
          ctx.strokeStyle = "#e7edf5";
          ctx.lineWidth = 3 / globalScale;
          ctx.stroke();

          ctx.font = `bold ${fontSize}px Sans-Serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = "#e7edf5";
          ctx.fillText(label, node.x, node.y);
        }}
        linkDirectionalArrowLength={6}
        linkDirectionalArrowRelPos={0.8}
        linkDirectionalArrowColor={(link: GraphLink) => {
          if (link.isInTour) return "#10b981";
          if (link.isCurrent) return "#f59e0b";
          return "#9bb0c3";
        }}
        cooldownTicks={200}
        enableZoomInteraction={true}
        enableNodeDrag={true}
      />
      <div style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#9bb0c3" }}>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <span>
            <span
              style={{
                display: "inline-block",
                width: "12px",
                height: "12px",
                backgroundColor: "#f59e0b",
                borderRadius: "50%",
                marginRight: "4px",
              }}
            />
            Start City
          </span>
          <span>
            <span
              style={{
                display: "inline-block",
                width: "12px",
                height: "12px",
                backgroundColor: "#10b981",
                borderRadius: "50%",
                marginRight: "4px",
              }}
            />
            Current City / Tour Edge
          </span>
          <span>
            <span
              style={{
                display: "inline-block",
                width: "12px",
                height: "12px",
                backgroundColor: "#60a5fa",
                borderRadius: "50%",
                marginRight: "4px",
              }}
            />
            In Tour
          </span>
          <span>
            <span
              style={{
                display: "inline-block",
                width: "12px",
                height: "12px",
                backgroundColor: "#8b5cf6",
                borderRadius: "50%",
                marginRight: "4px",
              }}
            />
            Visited
          </span>
          <span>
            <span
              style={{
                display: "inline-block",
                width: "12px",
                height: "12px",
                backgroundColor: "#9bb0c3",
                borderRadius: "50%",
                marginRight: "4px",
              }}
            />
            Unvisited
          </span>
        </div>
      </div>
    </div>
  );
}

