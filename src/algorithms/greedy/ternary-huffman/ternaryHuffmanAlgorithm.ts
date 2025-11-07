export type TernaryHuffmanNode = {
  id: string;
  character?: string;
  frequency: number;
  left?: TernaryHuffmanNode;
  middle?: TernaryHuffmanNode;
  right?: TernaryHuffmanNode;
  isLeaf: boolean;
};

export type EncodingTable = {
  [character: string]: string;
};

export type Step = {
  nodes: TernaryHuffmanNode[];
  explanation: string;
  mergedNode?: TernaryHuffmanNode;
  encodingTable?: EncodingTable;
  totalBits?: number;
};

/**
 * Builds a Ternary Huffman tree using a greedy approach.
 * Repeatedly merges the three nodes with lowest frequencies.
 * If there are fewer than 3 nodes, merges all remaining nodes.
 *
 * @param frequencies Object mapping characters to their frequencies
 * @returns Array of steps showing the tree construction
 */
export function ternaryHuffmanCodeSteps(
  frequencies: { [character: string]: number }
): Step[] {
  const steps: Step[] = [];

  if (Object.keys(frequencies).length === 0) {
    return steps;
  }

  // Create initial leaf nodes
  const nodes: TernaryHuffmanNode[] = Object.entries(frequencies).map(
    ([char, freq], index) => ({
      id: `leaf-${index}`,
      character: char,
      frequency: freq,
      isLeaf: true,
    })
  );

  // Initial step
  steps.push({
    nodes: JSON.parse(JSON.stringify(nodes)),
    explanation: `Initial state: We have ${nodes.length} characters with their frequencies. We'll build a Ternary Huffman tree by repeatedly merging the three nodes with the lowest frequencies.`,
  });

  // Build Ternary Huffman tree using greedy approach
  const workingNodes: TernaryHuffmanNode[] = JSON.parse(
    JSON.stringify(nodes)
  );
  let nodeIdCounter = nodes.length;

  while (workingNodes.length > 1) {
    // Sort by frequency (ascending)
    workingNodes.sort((a, b) => a.frequency - b.frequency);

    // Take nodes to merge (3 if available, otherwise all remaining)
    const nodesToMerge = workingNodes.splice(
      0,
      Math.min(3, workingNodes.length)
    );

    if (nodesToMerge.length === 0) break;

    // Create merged node
    const totalFrequency = nodesToMerge.reduce(
      (sum, node) => sum + node.frequency,
      0
    );

    const mergedNode: TernaryHuffmanNode = {
      id: `node-${nodeIdCounter++}`,
      frequency: totalFrequency,
      isLeaf: false,
    };

    // Assign children based on how many nodes we're merging
    if (nodesToMerge.length >= 1) {
      mergedNode.left = nodesToMerge[0];
    }
    if (nodesToMerge.length >= 2) {
      mergedNode.middle = nodesToMerge[1];
    }
    if (nodesToMerge.length >= 3) {
      mergedNode.right = nodesToMerge[2];
    }

    // Add merged node back to the queue
    workingNodes.push(mergedNode);

    // Create explanation
    const freqList = nodesToMerge.map((n) => n.frequency).join(", ");
    const childCount = nodesToMerge.length;

    steps.push({
      nodes: JSON.parse(JSON.stringify(workingNodes)),
      explanation: `Merged ${childCount} node${childCount > 1 ? "s" : ""} with frequencies ${freqList} into a new node with frequency ${totalFrequency}. This creates a ternary node with ${childCount} child${childCount > 1 ? "ren" : ""}.`,
      mergedNode: JSON.parse(JSON.stringify(mergedNode)),
    });
  }

  // Build encoding table from the tree
  const root = workingNodes[0];
  const encodingTable: EncodingTable = {};
  let totalBits = 0;

  function buildEncodingTable(node: TernaryHuffmanNode, code: string) {
    if (node.isLeaf && node.character) {
      encodingTable[node.character] = code;
      totalBits += node.frequency * code.length;
    } else {
      if (node.left) {
        buildEncodingTable(node.left, code + "0");
      }
      if (node.middle) {
        buildEncodingTable(node.middle, code + "1");
      }
      if (node.right) {
        buildEncodingTable(node.right, code + "2");
      }
    }
  }

  buildEncodingTable(root, "");

  // Final step with encoding table
  steps.push({
    nodes: [root],
    explanation: `Ternary Huffman tree construction complete! The tree has been built using the greedy strategy. Now we can generate the encoding table by traversing the tree (left = 0, middle = 1, right = 2).`,
    encodingTable: { ...encodingTable },
    totalBits,
  });

  return steps;
}

/**
 * Calculates the average bits per character
 */
export function calculateAverageBits(
  frequencies: { [character: string]: number },
  encodingTable: EncodingTable
): number {
  const totalFrequency = Object.values(frequencies).reduce(
    (sum, freq) => sum + freq,
    0
  );
  let totalBits = 0;

  for (const [char, freq] of Object.entries(frequencies)) {
    const code = encodingTable[char] || "";
    totalBits += freq * code.length;
  }

  return totalBits / totalFrequency;
}

