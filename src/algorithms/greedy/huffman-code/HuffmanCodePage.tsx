import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  huffmanCodeSteps,
  HuffmanNode,
  Step,
} from "./huffmanCodeAlgorithm";
import Footer from "../../../components/Footer";
import SEO from "../../../components/SEO";
import "../../../styles.css";

const DEFAULT_FREQUENCIES: { [key: string]: number } = {
  A: 5,
  B: 2,
  C: 1,
  D: 3,
};

export default function HuffmanCodePage() {
  const [frequencies, setFrequencies] = useState<{ [key: string]: number }>(
    DEFAULT_FREQUENCIES
  );
  const [steps, setSteps] = useState<Step[] | null>(null);
  const [stepIndex, setStepIndex] = useState<number>(0);

  // Reset steps when frequencies change
  useEffect(() => {
    setSteps(null);
    setStepIndex(0);
  }, [frequencies]);

  function addCharacter() {
    const newChar = String.fromCharCode(65 + Object.keys(frequencies).length);
    setFrequencies({ ...frequencies, [newChar]: 1 });
  }

  function removeCharacter(char: string) {
    if (Object.keys(frequencies).length <= 1) return;
    const newFreqs = { ...frequencies };
    delete newFreqs[char];
    setFrequencies(newFreqs);
  }

  function updateFrequency(char: string, value: number) {
    setFrequencies({ ...frequencies, [char]: Math.max(1, value) });
  }

  function compute() {
    if (Object.keys(frequencies).length === 0) {
      alert("Please enter at least 1 character");
      return;
    }
    try {
      const result = huffmanCodeSteps(frequencies);
      setSteps(result);
      setStepIndex(0);
    } catch (error) {
      alert((error as Error).message);
    }
  }

  const currentStep = steps?.[stepIndex] ?? null;

  return (
    <>
      <SEO
        title="Huffman Coding"
        description="Interactive visualization of the Huffman Coding algorithm. Learn how to build optimal prefix-free binary codes using a greedy approach. Step-by-step visualization of tree construction and encoding generation."
        keywords="huffman coding, data compression, greedy algorithm, prefix codes, binary tree, encoding, algorithm visualization"
        ogType="article"
      />
      <div className="app">
        <div className="container">
          {/* Header */}
          <header
            style={{
              marginBottom: "2rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              alignItems: "flex-start",
            }}
          >
            <Link to="/" style={{ textDecoration: "none" }}>
              <button style={{ padding: "0.5rem 1rem", fontSize: "1rem" }}>
                🏠 Home
              </button>
            </Link>
            <h1 style={{ margin: 0 }}>Huffman Coding Algorithm</h1>
          </header>

          {/* Controls */}
          <section
            className="controls"
            style={{
              position: "sticky",
              top: 0,
              backgroundColor: "var(--panel)",
              zIndex: 100,
              marginBottom: "1rem",
              padding: "1rem",
              borderRadius: "8px",
              border: "1px solid var(--border)",
            }}
          >
            <div className="row">
              <button onClick={compute} className="primary">
                Compute
              </button>
              {steps && (
                <>
                  <button
                    onClick={() => setStepIndex(0)}
                    disabled={stepIndex === 0}
                  >
                    ⏮
                  </button>
                  <button
                    onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
                    disabled={stepIndex === 0}
                  >
                    ◀
                  </button>
                  <button
                    onClick={() =>
                      setStepIndex((i) =>
                        Math.min((steps?.length ?? 1) - 1, i + 1)
                      )
                    }
                    disabled={stepIndex === steps!.length - 1}
                  >
                    ▶
                  </button>
                  <button
                    onClick={() => setStepIndex(steps!.length - 1)}
                    disabled={stepIndex === steps!.length - 1}
                  >
                    ⏭
                  </button>
                </>
              )}
            </div>

            {steps && (
              <div className="row">
                <input
                  type="range"
                  min={0}
                  max={steps.length - 1}
                  value={stepIndex}
                  onChange={(e) => setStepIndex(Number(e.target.value))}
                />
                <div className="step-label">
                  Step {stepIndex + 1} of {steps.length}
                </div>
              </div>
            )}

            {currentStep && (
              <div
                style={{
                  marginTop: "1rem",
                  padding: "0.75rem",
                  backgroundColor: "#1a2332",
                  borderRadius: "4px",
                  border: "1px solid #213040",
                }}
              >
                <p style={{ margin: 0, color: "#e7edf5" }}>
                  {currentStep.explanation}
                </p>
              </div>
            )}
          </section>

          {/* Input Section */}
          <section>
            <h2>Input</h2>
            <p>
              Enter characters and their frequencies. The Huffman algorithm will
              build an optimal prefix-free binary encoding tree using a greedy
              approach: repeatedly merge the two nodes with the lowest
              frequencies.
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                marginTop: "1rem",
              }}
            >
              {Object.entries(frequencies).map(([char, freq]) => (
                <div
                  key={char}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "1rem",
                    backgroundColor: "#0f1722",
                    border: "1px solid #213040",
                    borderRadius: "8px",
                    flexWrap: "wrap",
                  }}
                >
                  <span style={{ fontWeight: "600" }}>Character:</span>
                  <input
                    type="text"
                    maxLength={1}
                    value={char}
                    onChange={(e) => {
                      const newChar = e.target.value.toUpperCase();
                      if (newChar && newChar !== char) {
                        const newFreqs = { ...frequencies };
                        delete newFreqs[char];
                        newFreqs[newChar] = freq;
                        setFrequencies(newFreqs);
                      }
                    }}
                    style={{
                      padding: "0.5rem",
                      width: "60px",
                      backgroundColor: "#1a2332",
                      border: "1px solid #213040",
                      borderRadius: "4px",
                      color: "#e7edf5",
                      textAlign: "center",
                      fontSize: "1.2rem",
                      fontWeight: "600",
                    }}
                  />
                  <span style={{ fontWeight: "600" }}>Frequency:</span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={freq}
                    onChange={(e) =>
                      updateFrequency(char, parseInt(e.target.value) || 1)
                    }
                    style={{
                      padding: "0.5rem",
                      width: "100px",
                      backgroundColor: "#1a2332",
                      border: "1px solid #213040",
                      borderRadius: "4px",
                      color: "#e7edf5",
                    }}
                  />
                  {Object.keys(frequencies).length > 1 && (
                    <button
                      onClick={() => removeCharacter(char)}
                      style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: "#dc2626",
                        border: "none",
                        borderRadius: "4px",
                        color: "white",
                        cursor: "pointer",
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addCharacter}
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#22c55e",
                  border: "none",
                  borderRadius: "8px",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "1rem",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  justifyContent: "center",
                }}
              >
                <span>+</span> Add Character
              </button>
            </div>
          </section>

          {/* Mathematical Explanation */}
          {currentStep && (
            <section className="formula-section">
              <h2>Mathematical Explanation</h2>
              <div className="formula-box">
                <div className="formula-main">
                  <code>
                    Greedy Strategy: Always merge the two nodes with lowest
                    frequencies
                  </code>
                </div>
                <div className="formula-explanation">
                  <p>
                    <strong>Huffman Coding Algorithm:</strong> Builds an optimal
                    prefix-free binary encoding tree using a greedy approach.
                    The algorithm repeatedly merges the two nodes with the
                    lowest frequencies until only one root node remains.
                  </p>
                  <ul style={{ marginLeft: "1.5rem", lineHeight: "1.8" }}>
                    <li>
                      <strong>Greedy Choice:</strong> At each step, merge the
                      two nodes with the smallest frequencies. This ensures that
                      characters with higher frequencies get shorter codes.
                    </li>
                    <li>
                      <strong>Tree Construction:</strong> Start with leaf nodes
                      for each character. Repeatedly create internal nodes by
                      merging the two smallest nodes, until only one root
                      remains.
                    </li>
                    <li>
                      <strong>Encoding:</strong> Traverse the tree from root to
                      leaves. Left edges represent '0', right edges represent
                      '1'. The path from root to a leaf gives the encoding for
                      that character.
                    </li>
                    <li>
                      <strong>Optimality:</strong> This greedy approach produces
                      an optimal prefix-free code, minimizing the expected code
                      length.
                    </li>
                  </ul>
                  {currentStep.encodingTable && (
                    <div
                      style={{
                        marginTop: "1rem",
                        padding: "0.75rem",
                        backgroundColor: "#1a2332",
                        borderRadius: "4px",
                        border: "1px solid #213040",
                      }}
                    >
                      <p style={{ marginBottom: "0.5rem" }}>
                        <strong>Encoding Statistics:</strong>
                      </p>
                      <p>Total Bits: {currentStep.totalBits}</p>
                    </div>
                  )}
                  <p>
                    <strong>Time Complexity:</strong> O(n log n) - We need to
                    sort nodes by frequency n times, and each merge operation
                    takes O(log n) time with a priority queue.
                  </p>
                  <p>
                    <strong>Space Complexity:</strong> O(n) - We store n leaf
                    nodes and at most n-1 internal nodes in the tree.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Visualization */}
          <section>
            <h2>
              Visualization{" "}
              {steps
                ? `(Step ${stepIndex + 1}/${steps.length})`
                : "(press Compute)"}
            </h2>
            {currentStep ? (
              <HuffmanTreeVisualization step={currentStep} />
            ) : (
              <p>
                Enter characters with frequencies, then click Compute to start
                visualization.
              </p>
            )}
          </section>

          {/* Encoding Table */}
          {currentStep?.encodingTable && (
            <section>
              <h2>Encoding Table</h2>
              <div className="formula-box">
                <div className="matrix-wrapper">
                  <table className="matrix">
                    <thead>
                      <tr>
                        <th>Character</th>
                        <th>Frequency</th>
                        <th>Huffman Code</th>
                        <th>Code Length</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(frequencies)
                        .sort((a, b) => b[1] - a[1])
                        .map(([char, freq]) => {
                          const code = currentStep.encodingTable![char] || "";
                          return (
                            <tr key={char}>
                              <td>
                                <strong>{char}</strong>
                              </td>
                              <td>{freq}</td>
                              <td>
                                <code
                                  style={{
                                    color: "#60a5fa",
                                    fontFamily: "monospace",
                                    fontSize: "1.1rem",
                                  }}
                                >
                                  {code || "N/A"}
                                </code>
                              </td>
                              <td>{code.length}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* Code Preview */}
          <section>
            <h2>Algorithm Implementation</h2>
            <pre
              style={{
                backgroundColor: "#0f1722",
                border: "1px solid #213040",
                padding: "1rem",
                borderRadius: "8px",
                overflowX: "auto",
                color: "#e7edf5",
              }}
            >
              <code
                style={{
                  fontFamily: "'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
                  fontSize: "14px",
                  color: "#60a5fa",
                  lineHeight: "1.6",
                }}
              >{`import heapq
from collections import defaultdict

class Node:
    def __init__(self, char=None, freq=0, left=None, right=None):
        self.char = char
        self.freq = freq
        self.left = left
        self.right = right
        self.is_leaf = char is not None
    
    def __lt__(self, other):
        return self.freq < other.freq

def build_huffman_tree(frequencies):
    """
    Builds a Huffman tree using greedy approach.
    Strategy: Repeatedly merge the two nodes with lowest frequencies.
    """
    # Create priority queue with leaf nodes
    heap = []
    for char, freq in frequencies.items():
        heapq.heappush(heap, Node(char=char, freq=freq))
    
    # Greedy step: merge two smallest nodes until one remains
    while len(heap) > 1:
        left = heapq.heappop(heap)
        right = heapq.heappop(heap)
        
        # Create internal node
        merged = Node(
            freq=left.freq + right.freq,
            left=left,
            right=right
        )
        heapq.heappush(heap, merged)
    
    return heap[0] if heap else None

def build_encoding_table(root, code="", encoding_table=None):
    """
    Traverses the Huffman tree to build encoding table.
    Left edge = 0, Right edge = 1
    """
    if encoding_table is None:
        encoding_table = {}
    
    if root.is_leaf:
        encoding_table[root.char] = code
    else:
        if root.left:
            build_encoding_table(root.left, code + "0", encoding_table)
        if root.right:
            build_encoding_table(root.right, code + "1", encoding_table)
    
    return encoding_table

def huffman_encode(frequencies):
    """
    Main function: builds tree and returns encoding table.
    """
    root = build_huffman_tree(frequencies)
    if root is None:
        return {}
    
    encoding_table = build_encoding_table(root)
    return encoding_table

# Example usage
frequencies = {'A': 5, 'B': 2, 'C': 1, 'D': 3}
encoding = huffman_encode(frequencies)
print("Huffman Encoding Table:")
for char, code in sorted(encoding.items()):
    print(f"{char}: {code}")`}</code>
            </pre>
          </section>
        </div>
        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}

type HuffmanTreeVisualizationProps = {
  step: Step;
};

function HuffmanTreeVisualization({
  step,
}: HuffmanTreeVisualizationProps) {
  const renderNode = (
    node: HuffmanNode,
    x: number,
    y: number,
    level: number,
    maxLevel: number,
    width: number
  ): React.JSX.Element | null => {
    if (!node) return null;

    const nodeWidth = 80;
    const nodeHeight = 60;
    const levelHeight = 120;
    const isLeaf = node.isLeaf;
    const label = isLeaf
      ? `${node.character}\n(${node.frequency})`
      : `(${node.frequency})`;

    const children: React.JSX.Element[] = [];
    let childX = x - width / 2;

    if (node.left) {
      const childWidth = width / 2;
      const childY = y + levelHeight;
      children.push(
        <g key={`edge-left-${node.id}`}>
          <line
            x1={x}
            y1={y + nodeHeight / 2}
            x2={childX + childWidth / 2}
            y2={childY - nodeHeight / 2}
            stroke="#60a5fa"
            strokeWidth="2"
          />
          <text
            x={(x + childX + childWidth / 2) / 2}
            y={(y + nodeHeight / 2 + childY - nodeHeight / 2) / 2}
            fill="#22c55e"
            fontSize="14"
            fontWeight="600"
            textAnchor="middle"
          >
            0
          </text>
        </g>
      );
      children.push(
        renderNode(
          node.left,
          childX + childWidth / 2,
          childY,
          level + 1,
          maxLevel,
          childWidth
        )!
      );
      childX += childWidth;
    }

    if (node.right) {
      const childWidth = width / 2;
      const childY = y + levelHeight;
      children.push(
        <g key={`edge-right-${node.id}`}>
          <line
            x1={x}
            y1={y + nodeHeight / 2}
            x2={childX + childWidth / 2}
            y2={childY - nodeHeight / 2}
            stroke="#60a5fa"
            strokeWidth="2"
          />
          <text
            x={(x + childX + childWidth / 2) / 2}
            y={(y + nodeHeight / 2 + childY - nodeHeight / 2) / 2}
            fill="#22c55e"
            fontSize="14"
            fontWeight="600"
            textAnchor="middle"
          >
            1
          </text>
        </g>
      );
      children.push(
        renderNode(
          node.right,
          childX + childWidth / 2,
          childY,
          level + 1,
          maxLevel,
          childWidth
        )!
      );
    }

    return (
      <g key={node.id}>
        <rect
          x={x - nodeWidth / 2}
          y={y - nodeHeight / 2}
          width={nodeWidth}
          height={nodeHeight}
          fill={isLeaf ? "#22c55e" : "#3b82f6"}
          stroke="#e7edf5"
          strokeWidth="2"
          rx="4"
        />
        <text
          x={x}
          y={y}
          fill="#e7edf5"
          fontSize="12"
          fontWeight="600"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {label.split("\n").map((line, i) => (
            <tspan key={i} x={x} dy={i === 0 ? 0 : 16}>
              {line}
            </tspan>
          ))}
        </text>
        {children}
      </g>
    );
  };

  const calculateTreeDepth = (node: HuffmanNode | undefined): number => {
    if (!node) return 0;
    if (node.isLeaf) return 1;
    return (
      1 +
      Math.max(
        calculateTreeDepth(node.left),
        calculateTreeDepth(node.right)
      )
    );
  };

  // Find the root node: prefer mergedNode if it exists, otherwise find the largest non-leaf node
  const rootNode = step.mergedNode || step.nodes.find((n) => !n.isLeaf) || step.nodes[0];
  if (!rootNode) {
    return <p>No tree to display</p>;
  }

  const depth = calculateTreeDepth(rootNode);
  const svgWidth = Math.max(800, Math.pow(2, depth) * 100);
  const svgHeight = depth * 150 + 100;

  return (
    <div
      style={{
        backgroundColor: "#0f1722",
        border: "1px solid #213040",
        borderRadius: "8px",
        padding: "2rem",
        overflowX: "auto",
      }}
    >
      <svg width={svgWidth} height={svgHeight}>
        {renderNode(rootNode, svgWidth / 2, 50, 0, depth, svgWidth)}
      </svg>
    </div>
  );
}

