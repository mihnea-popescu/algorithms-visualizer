export type QuickSortStep = {
  array: number[];
  explanation: string;
  phase: "partition" | "compare" | "swap" | "pivot" | "complete";
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
};

/**
 * Generates step-by-step visualization of quick sort algorithm
 * @param arr The array to sort
 * @returns Array of steps showing the quick sort process
 */
export function quickSortSteps(arr: number[]): QuickSortStep[] {
  const steps: QuickSortStep[] = [];
  const originalArray = [...arr];

  // Initial step
  steps.push({
    array: [...originalArray],
    explanation: `Starting quick sort on array: [${originalArray.join(", ")}]. Quick sort uses divide-and-conquer: choose a pivot, partition the array around the pivot, then recursively sort the partitions.`,
    phase: "pivot",
    range: { start: 0, end: originalArray.length - 1 },
    depth: 0,
  });

  // Perform quick sort and collect steps
  function quickSort(start: number, end: number, depth: number): void {
    if (start >= end) {
      // Base case: single element or empty
      if (start === end) {
        steps.push({
          array: [...originalArray],
          explanation: `Base case: Array segment [${originalArray[start]}] is already sorted (single element).`,
          phase: "complete",
          range: { start, end },
          depth,
        });
      }
      return;
    }

    // Choose pivot (using last element as pivot)
    const pivotIndex = end;
    const pivotValue = originalArray[pivotIndex];

    steps.push({
      array: [...originalArray],
      explanation: `Choosing pivot: ${pivotValue} at index ${pivotIndex}. We'll partition the array so all elements less than ${pivotValue} are on the left, and all elements greater than or equal to ${pivotValue} are on the right.`,
      phase: "pivot",
      pivotIndex,
      pivotValue,
      range: { start, end },
      depth,
    });

    // Partition the array
    const partitionResult = partition(start, end, pivotIndex, depth, steps, originalArray);
    const finalPivotIndex = partitionResult.finalPivotIndex;

    // Show partitioned result
    const leftPart = originalArray.slice(start, finalPivotIndex);
    const rightPart = originalArray.slice(finalPivotIndex + 1, end + 1);
    
    steps.push({
      array: [...originalArray],
      explanation: `Partition complete! Pivot ${pivotValue} is now at its correct position (index ${finalPivotIndex}). Left partition: [${leftPart.join(", ")}], Right partition: [${rightPart.join(", ")}].`,
      phase: "partition",
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

    // Recursively sort left and right partitions
    quickSort(start, finalPivotIndex - 1, depth + 1);
    quickSort(finalPivotIndex + 1, end, depth + 1);
  }

  // Perform the sort
  quickSort(0, originalArray.length - 1, 0);

  // Final step
  steps.push({
    array: [...originalArray],
    explanation: `Quick sort complete! Final sorted array: [${originalArray.join(", ")}].`,
    phase: "complete",
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
  steps: QuickSortStep[],
  originalArray: number[]
): { finalPivotIndex: number } {
  const pivotValue = originalArray[pivotIndex];
  let i = start; // Index of smaller element (indicates right position of pivot)

  steps.push({
    array: [...originalArray],
    explanation: `Starting partition: Moving elements smaller than pivot ${pivotValue} to the left.`,
    phase: "partition",
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
      pivotIndex: end,
      pivotValue,
      swapped: { i: pivotIndex, j: end },
      range: { start, end },
      depth,
    });
  }

  // Traverse through all elements
  for (let j = start; j < end; j++) {
    // If current element is smaller than or equal to pivot
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
      pivotIndex: end,
      pivotValue,
      leftIndex: i,
      rightIndex: j,
      comparing: { left: currentValue, right: pivotValue },
      range: { start, end },
      depth,
    });

    if (comparison) {
      // Swap current element with element at i
      swap(originalArray, i, j);
      steps.push({
        array: [...originalArray],
        explanation: `Swapped ${originalArray[i]} (index ${i}) with ${currentValue} (index ${j}). Element ${currentValue} is now in the left partition.`,
        phase: "swap",
        pivotIndex: end,
        pivotValue,
        leftIndex: i,
        rightIndex: j,
        swapped: { i, j },
        range: { start, end },
        depth,
      });
      i++; // Increment index of smaller element
    }
  }

  // Swap pivot with element at i (pivot's correct position)
  swap(originalArray, i, end);
  steps.push({
    array: [...originalArray],
    explanation: `Placed pivot ${pivotValue} at its final position (index ${i}). All elements to the left are smaller, all elements to the right are greater or equal.`,
    phase: "swap",
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

