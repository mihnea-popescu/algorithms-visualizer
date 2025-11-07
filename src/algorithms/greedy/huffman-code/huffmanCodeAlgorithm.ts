export type HuffmanNode = {
  id: string;
  character?: string;
  frequency: number;
  left?: HuffmanNode;
  right?: HuffmanNode;
  isLeaf: boolean;
};

export type EncodingTable = {
  [character: string]: string;
};

export type Step = {
  nodes: HuffmanNode[];
  explanation: string;
  mergedNode?: HuffmanNode;
  encodingTable?: EncodingTable;
  totalBits?: number;
};

/**
 * Builds a Huffman tree using a greedy approach.
 * Repeatedly merges the two nodes with lowest frequencies.
 *
 * @param frequencies Object mapping characters to their frequencies
 * @returns Array of steps showing the tree construction
 */
export function huffmanCodeSteps(
  frequencies: { [character: string]: number }
): Step[] {
  const steps: Step[] = [];

  if (Object.keys(frequencies).length === 0) {
    return steps;
  }

  // Create initial leaf nodes
  const nodes: HuffmanNode[] = Object.entries(frequencies).map(
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
    explanation: `Initial state: We have ${nodes.length} characters with their frequencies. We'll build a Huffman tree by repeatedly merging the two nodes with the lowest frequencies.`,
  });

  // Build Huffman tree using greedy approach
  const workingNodes: HuffmanNode[] = JSON.parse(JSON.stringify(nodes));
  let nodeIdCounter = nodes.length;

  while (workingNodes.length > 1) {
    // Sort by frequency (ascending)
    workingNodes.sort((a, b) => a.frequency - b.frequency);

    // Take the two nodes with lowest frequencies
    const left = workingNodes.shift()!;
    const right = workingNodes.shift()!;

    // Create merged node
    const mergedNode: HuffmanNode = {
      id: `node-${nodeIdCounter++}`,
      frequency: left.frequency + right.frequency,
      left,
      right,
      isLeaf: false,
    };

    // Add merged node back to the queue
    workingNodes.push(mergedNode);

    // Create step
    steps.push({
      nodes: JSON.parse(JSON.stringify(workingNodes)),
      explanation: `Merged nodes with frequencies ${left.frequency} and ${right.frequency} into a new node with frequency ${mergedNode.frequency}. The left child has frequency ${left.frequency}, and the right child has frequency ${right.frequency}.`,
      mergedNode: JSON.parse(JSON.stringify(mergedNode)),
    });
  }

  // Build encoding table from the tree
  const root = workingNodes[0];
  const encodingTable: EncodingTable = {};
  let totalBits = 0;

  function buildEncodingTable(node: HuffmanNode, code: string) {
    if (node.isLeaf && node.character) {
      encodingTable[node.character] = code;
      totalBits += node.frequency * code.length;
    } else {
      if (node.left) {
        buildEncodingTable(node.left, code + "0");
      }
      if (node.right) {
        buildEncodingTable(node.right, code + "1");
      }
    }
  }

  buildEncodingTable(root, "");

  // Final step with encoding table
  steps.push({
    nodes: [root],
    explanation: `Huffman tree construction complete! The tree has been built using the greedy strategy. Now we can generate the encoding table by traversing the tree (left = 0, right = 1).`,
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

