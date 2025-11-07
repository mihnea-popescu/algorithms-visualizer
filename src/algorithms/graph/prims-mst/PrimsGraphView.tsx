import React, { useMemo } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { Matrix } from "../../floyd/floydAlgorithm";
// eslint-disable-next-line
import { PrimStep, Edge } from "./primsAlgorithm";

type PrimsGraphViewProps = {
  matrix: Matrix;
  labels: string[];
  step: PrimStep | null;
};

interface GraphNode {
  id: string;
  label: string;
  isInMST: boolean;
  isCurrent: boolean;
  key: number;
}

interface GraphLink {
  source: string;
  target: string;
  weight: number;
  isInMST: boolean;
  isCandidate: boolean;
  isSelected: boolean;
}

export default function PrimsGraphView({
  matrix,
  labels,
  step,
}: PrimsGraphViewProps) {
  const graphData = useMemo(() => {
    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];

    if (!step) {
      for (let i = 0; i < matrix.length; i++) {
        nodes.push({
          id: labels[i],
          label: labels[i],
          isInMST: false,
          isCurrent: false,
          key: Infinity,
        });
      }
    } else {
      for (let i = 0; i < matrix.length; i++) {
        nodes.push({
          id: labels[i],
          label: `${labels[i]}\n(${step.key[i] === Infinity ? "∞" : step.key[i]})`,
          isInMST: step.inMST.has(i),
          isCurrent: false,
          key: step.key[i],
        });
      }
    }

    // Determine which node is current (the one just added)
    if (step?.selectedEdge) {
      const currentIdx = step.selectedEdge.to;
      nodes[currentIdx].isCurrent = true;
    }

    // Create links
    for (let i = 0; i < matrix.length; i++) {
      for (let j = i + 1; j < matrix.length; j++) {
        const weight = matrix[i][j];
        if (Number.isFinite(weight) && weight > 0) {
          const isInMST =
            step?.mstEdges.some(
              (e) =>
                (e.from === i && e.to === j) || (e.from === j && e.to === i)
            ) ?? false;
          const isCandidate =
            step?.candidateEdges.some(
              (e) =>
                (e.from === i && e.to === j) || (e.from === j && e.to === i)
            ) ?? false;
          const isSelected =
            step?.selectedEdge &&
            ((step.selectedEdge.from === i && step.selectedEdge.to === j) ||
              (step.selectedEdge.from === j && step.selectedEdge.to === i));

          links.push({
            source: labels[i],
            target: labels[j],
            weight: weight,
            isInMST,
            isCandidate,
            isSelected: isSelected ?? false,
          });
        }
      }
    }

    return { nodes, links };
  }, [matrix, labels, step]);

  return (
    <div className="graph-container">
      <ForceGraph2D
        graphData={graphData}
        nodeLabel={(node: any) => node.label}
        linkLabel={(link: GraphLink) => `${link.weight}`}
        nodeColor={(node: GraphNode) => {
          if (node.isCurrent) return "#f59e0b";
          if (node.isInMST) return "#10b981";
          return "#60a5fa";
        }}
        linkColor={(link: GraphLink) => {
          if (link.isSelected) return "#f59e0b";
          if (link.isInMST) return "#10b981";
          if (link.isCandidate) return "#fbbf24";
          return "#9bb0c3";
        }}
        linkWidth={(link: GraphLink) => {
          if (link.isSelected) return 4;
          if (link.isInMST) return 3;
          if (link.isCandidate) return 2.5;
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
          const key = node.label.split("\n")[1] || "";
          const fontSize = 16 / globalScale;
          const keyFontSize = 12 / globalScale;
          const nodeRadius = 30 / globalScale;

          let color = "#60a5fa";
          if (node.isCurrent) color = "#f59e0b";
          else if (node.isInMST) color = "#10b981";

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
          ctx.fillText(label, node.x, node.y - keyFontSize);

          if (key) {
            ctx.font = `${keyFontSize}px Sans-Serif`;
            ctx.fillStyle = "#9bb0c3";
            ctx.fillText(key, node.x, node.y + fontSize / 2);
          }
        }}
        linkDirectionalArrowLength={0}
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
                backgroundColor: "#10b981",
                borderRadius: "50%",
                marginRight: "4px",
              }}
            />
            In MST
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
                backgroundColor: "#fbbf24",
                borderRadius: "50%",
                marginRight: "4px",
              }}
            />
            Candidate
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
            Not Considered
          </span>
        </div>
      </div>
    </div>
  );
}

