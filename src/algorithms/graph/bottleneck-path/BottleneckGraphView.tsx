import React, { useMemo } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { Matrix } from "../../floyd/floydAlgorithm";
import { BottleneckStep } from "./bottleneckPathAlgorithm";

type BottleneckGraphViewProps = {
  matrix: Matrix;
  labels: string[];
  step: BottleneckStep | null;
  source: number;
  target: number;
};

interface GraphNode {
  id: string;
  label: string;
  bottleneck: number;
  isVisited: boolean;
  isCurrent: boolean;
  isSource: boolean;
  isTarget: boolean;
  isInPath: boolean;
}

interface GraphLink {
  source: string;
  target: string;
  weight: number;
  isRelaxed: boolean;
  isInPath: boolean;
}

export default function BottleneckGraphView({
  matrix,
  labels,
  step,
  source,
  target,
}: BottleneckGraphViewProps) {
  const graphData = useMemo(() => {
    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];

    if (!step) {
      for (let i = 0; i < matrix.length; i++) {
        nodes.push({
          id: labels[i],
          label: labels[i],
          bottleneck: Infinity,
          isVisited: false,
          isCurrent: false,
          isSource: i === source,
          isTarget: i === target,
          isInPath: false,
        });
      }
    } else {
      for (let i = 0; i < matrix.length; i++) {
        const isInPath = step.pathToTarget?.includes(i) ?? false;
        nodes.push({
          id: labels[i],
          label: `${labels[i]}\n(${step.bottlenecks[i] === Infinity ? "∞" : step.bottlenecks[i]})`,
          bottleneck: step.bottlenecks[i],
          isVisited: step.visited.has(i),
          isCurrent: step.currentVertex === i,
          isSource: i === source,
          isTarget: i === target,
          isInPath,
        });
      }
    }

    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix.length; j++) {
        const weight = matrix[i][j];
        if (Number.isFinite(weight) && weight > 0 && i !== j) {
          const isInPath =
            step?.pathToTarget &&
            step.pathToTarget.includes(i) &&
            step.pathToTarget.includes(j) &&
            step.pathToTarget.indexOf(i) === step.pathToTarget.indexOf(j) - 1;

          links.push({
            source: labels[i],
            target: labels[j],
            weight: weight,
            isRelaxed: step?.processing === j && step?.currentVertex === i,
            isInPath: isInPath ?? false,
          });
        }
      }
    }

    return { nodes, links };
  }, [matrix, labels, step, source, target]);

  return (
    <div className="graph-container">
      <ForceGraph2D
        graphData={graphData}
        nodeLabel={(node: any) => node.label}
        linkLabel={(link: GraphLink) => `${link.weight}`}
        nodeColor={(node: GraphNode) => {
          if (node.isInPath) return "#10b981";
          if (node.isCurrent) return "#f59e0b";
          if (node.isVisited) return "#3b82f6";
          if (node.isSource) return "#8b5cf6";
          if (node.isTarget) return "#ef4444";
          return "#60a5fa";
        }}
        linkColor={(link: GraphLink) => {
          if (link.isInPath) return "#10b981";
          if (link.isRelaxed) return "#f59e0b";
          return "#9bb0c3";
        }}
        linkWidth={(link: GraphLink) => {
          if (link.isInPath) return 4;
          if (link.isRelaxed) return 3;
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
          const label = node.label.split("\n")[0];
          const bottleneck = node.label.split("\n")[1] || "";
          const fontSize = 16 / globalScale;
          const bottleneckFontSize = 12 / globalScale;
          const nodeRadius = 30 / globalScale;

          let color = "#60a5fa";
          if (node.isInPath) color = "#10b981";
          else if (node.isCurrent) color = "#f59e0b";
          else if (node.isVisited) color = "#3b82f6";
          else if (node.isSource) color = "#8b5cf6";
          else if (node.isTarget) color = "#ef4444";

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
          ctx.fillText(label, node.x, node.y - bottleneckFontSize);

          if (bottleneck) {
            ctx.font = `${bottleneckFontSize}px Sans-Serif`;
            ctx.fillStyle = "#9bb0c3";
            ctx.fillText(bottleneck, node.x, node.y + fontSize / 2);
          }
        }}
        linkDirectionalArrowLength={6}
        linkDirectionalArrowRelPos={0.8}
        linkDirectionalArrowColor={(link: GraphLink) => {
          if (link.isInPath) return "#10b981";
          if (link.isRelaxed) return "#f59e0b";
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
                backgroundColor: "#8b5cf6",
                borderRadius: "50%",
                marginRight: "4px",
              }}
            />
            Source
          </span>
          <span>
            <span
              style={{
                display: "inline-block",
                width: "12px",
                height: "12px",
                backgroundColor: "#ef4444",
                borderRadius: "50%",
                marginRight: "4px",
              }}
            />
            Target
          </span>
          <span>
            <span
              style={{
                display: "inline-block",
                width: "12px",
                height: "12px",
                backgroundColor: "#3b82f6",
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
                backgroundColor: "#f59e0b",
                borderRadius: "50%",
                marginRight: "4px",
              }}
            />
            Current
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
            In Path
          </span>
        </div>
      </div>
    </div>
  );
}

