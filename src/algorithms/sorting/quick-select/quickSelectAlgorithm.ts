export type QuickSelectStep = {
  array: number[];
  explanation: string;
  phase: "start" | "partition" | "compare" | "swap" | "pivot" | "found" | "recurse";
  k?: number;
  pivotIndex?: number;
  pivotValue?: number;
  leftIndex?: number;
  rightIndex?: number;
  comparing?: {
    left: number;
    right: number;
  };
  swapped?: {
    i: number;
    j: number;
  };
  depth?: number;
  range?: {
    start: number;
    end: number;
  };
  partitioned?: {
    left: number[];
    pivot: number;
    right: number[];
  };
  result?: number;
};

/**
 * Generates step-by-step visualization of quick select algorithm
 * @param arr The array to search in
 * @param k The k-th smallest element to find (1-indexed)
 * @returns Array of steps showing the quick select process
 */
export function quickSelectSteps(arr: number[], k: number): QuickSelectStep[] {
  const steps: QuickSelectStep[] = [];
  const originalArray = [...arr];

  if (k < 1 || k > arr.length) {
    steps.push({
      array: [...originalArray],
      explanation: `Invalid k value: ${k}. k must be between 1 and ${arr.length}.`,
      phase: "start",
    });
    return steps;
  }

  // Initial step
  steps.push({
    array: [...originalArray],
    explanation: `Starting quick select to find the ${k}-th smallest element in array: [${originalArray.join(", ")}]. Quick select uses a partition-based approach similar to quick sort, but only recurses on the partition containing the k-th element.`,
    phase: "start",
    k,
    range: { start: 0, end: originalArray.length - 1 },
    depth: 0,
  });

  // Perform quick select and collect steps
  function quickSelect(start: number, end: number, k: number, depth: number): number {
    if (start === end) {
      steps.push({
        array: [...originalArray],
        explanation: `Base case: Only one element in range [${start}, ${end}]. The ${k}-th smallest element is ${originalArray[start]}.`,
        phase: "found",
        k,
        result: originalArray[start],
        range: { start, end },
        depth,
      });
      return originalArray[start];
    }

    // Choose pivot (using last element as pivot)
    const pivotIndex = end;
    const pivotValue = originalArray[pivotIndex];

    steps.push({
      array: [...originalArray],
      explanation: `Choosing pivot: ${pivotValue} at index ${pivotIndex}. We'll partition the array around this pivot.`,
      phase: "pivot",
      k,
      pivotIndex,
      pivotValue,
      range: { start, end },
      depth,
    });

    // Partition the array
    const partitionResult = partition(start, end, pivotIndex, depth, steps, originalArray, k);
    const finalPivotIndex = partitionResult.finalPivotIndex;

    // Show partitioned result
    const leftPart = originalArray.slice(start, finalPivotIndex);
    const rightPart = originalArray.slice(finalPivotIndex + 1, end + 1);
    
    steps.push({
      array: [...originalArray],
      explanation: `Partition complete! Pivot ${pivotValue} is now at index ${finalPivotIndex}. Left partition (${leftPart.length} elements): [${leftPart.join(", ") || "empty"}], Right partition (${rightPart.length} elements): [${rightPart.join(", ") || "empty"}].`,
      phase: "partition",
      k,
      pivotIndex: finalPivotIndex,
      pivotValue,
      partitioned: {
        left: leftPart,
        pivot: pivotValue,
        right: rightPart,
      },
      range: { start, end },
      depth,
    });

    // Calculate the rank of the pivot (1-indexed)
    const pivotRank = finalPivotIndex - start + 1;

    steps.push({
      array: [...originalArray],
      explanation: `Pivot ${pivotValue} is at position ${pivotRank} in the current range (${pivotRank}-th smallest in range [${start}, ${end}]). We're looking for the ${k}-th smallest.`,
      phase: "compare",
      k,
      pivotIndex: finalPivotIndex,
      pivotValue,
      range: { start, end },
      depth,
    });

    if (pivotRank === k) {
      // Found the k-th smallest element
      steps.push({
        array: [...originalArray],
        explanation: `Found! The pivot ${pivotValue} is exactly the ${k}-th smallest element in the current range.`,
        phase: "found",
        k,
        pivotIndex: finalPivotIndex,
        pivotValue,
        result: pivotValue,
        range: { start, end },
        depth,
      });
      return pivotValue;
    } else if (k < pivotRank) {
      // The k-th smallest is in the left partition
      steps.push({
        array: [...originalArray],
        explanation: `Since ${k} < ${pivotRank}, the ${k}-th smallest element must be in the left partition. Recursing on left partition [${start}, ${finalPivotIndex - 1}].`,
        phase: "recurse",
        k,
        pivotIndex: finalPivotIndex,
        pivotValue,
        range: { start, end: finalPivotIndex - 1 },
        depth,
      });
      return quickSelect(start, finalPivotIndex - 1, k, depth + 1);
    } else {
      // The k-th smallest is in the right partition
      const newK = k - pivotRank;
      steps.push({
        array: [...originalArray],
        explanation: `Since ${k} > ${pivotRank}, the ${k}-th smallest element must be in the right partition. Adjusting k to ${newK} (since we've already found ${pivotRank} smaller elements) and recursing on right partition [${finalPivotIndex + 1}, ${end}].`,
        phase: "recurse",
        k: newK,
        pivotIndex: finalPivotIndex,
        pivotValue,
        range: { start: finalPivotIndex + 1, end },
        depth,
      });
      return quickSelect(finalPivotIndex + 1, end, newK, depth + 1);
    }
  }

  // Perform the selection
  const result = quickSelect(0, originalArray.length - 1, k, 0);

  // Final step
  steps.push({
    array: [...originalArray],
    explanation: `Quick select complete! The ${k}-th smallest element is ${result}.`,
    phase: "found",
    k,
    result,
  });

  return steps;
}

/**
 * Partitions the array around a pivot element
 * Returns the final position of the pivot
 */
function partition(
  start: number,
  end: number,
  pivotIndex: number,
  depth: number,
  steps: QuickSelectStep[],
  originalArray: number[],
  k: number
): { finalPivotIndex: number } {
  const pivotValue = originalArray[pivotIndex];
  let i = start; // Index of smaller element

  steps.push({
    array: [...originalArray],
    explanation: `Starting partition: Moving elements smaller than pivot ${pivotValue} to the left.`,
    phase: "partition",
    k,
    pivotIndex,
    pivotValue,
    leftIndex: i,
    rightIndex: start,
    range: { start, end },
    depth,
  });

  // Move pivot to end temporarily (if not already at end)
  if (pivotIndex !== end) {
    swap(originalArray, pivotIndex, end);
    steps.push({
      array: [...originalArray],
      explanation: `Moved pivot ${pivotValue} to the end (index ${end}) for easier partitioning.`,
      phase: "swap",
      k,
      pivotIndex: end,
      pivotValue,
      swapped: { i: pivotIndex, j: end },
      range: { start, end },
      depth,
    });
  }

  // Traverse through all elements
  for (let j = start; j < end; j++) {
    const currentValue = originalArray[j];
    const comparison = currentValue < pivotValue;

    steps.push({
      array: [...originalArray],
      explanation: `Comparing element at index ${j} (value: ${currentValue}) with pivot ${pivotValue}. ${
        comparison
          ? `${currentValue} < ${pivotValue}, so it should be on the left.`
          : `${currentValue} >= ${pivotValue}, so it stays on the right.`
      }`,
      phase: "compare",
      k,
      pivotIndex: end,
      pivotValue,
      leftIndex: i,
      rightIndex: j,
      comparing: { left: currentValue, right: pivotValue },
      range: { start, end },
      depth,
    });

    if (comparison) {
      swap(originalArray, i, j);
      steps.push({
        array: [...originalArray],
        explanation: `Swapped ${originalArray[i]} (index ${i}) with ${currentValue} (index ${j}). Element ${currentValue} is now in the left partition.`,
        phase: "swap",
        k,
        pivotIndex: end,
        pivotValue,
        leftIndex: i,
        rightIndex: j,
        swapped: { i, j },
        range: { start, end },
        depth,
      });
      i++;
    }
  }

  // Swap pivot with element at i (pivot's correct position)
  swap(originalArray, i, end);
  steps.push({
    array: [...originalArray],
    explanation: `Placed pivot ${pivotValue} at its final position (index ${i}). All elements to the left are smaller, all elements to the right are greater or equal.`,
    phase: "swap",
    k,
    pivotIndex: i,
    pivotValue,
    swapped: { i, j: end },
    range: { start, end },
    depth,
  });

  return { finalPivotIndex: i };
}

/**
 * Swaps two elements in an array
 */
function swap(arr: number[], i: number, j: number): void {
  const temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}

