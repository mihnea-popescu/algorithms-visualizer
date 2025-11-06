export type MergeSortStep = {
  array: number[];
  explanation: string;
  phase: "divide" | "merge" | "compare";
  leftArray?: number[];
  rightArray?: number[];
  leftIndex?: number;
  rightIndex?: number;
  mergedArray?: number[];
  comparing?: {
    left: number;
    right: number;
  };
  depth?: number;
  range?: {
    start: number;
    end: number;
  };
};

/**
 * Generates step-by-step visualization of merge sort algorithm
 * @param arr The array to sort
 * @returns Array of steps showing the merge sort process
 */
export function mergeSortSteps(arr: number[]): MergeSortStep[] {
  const steps: MergeSortStep[] = [];
  const originalArray = [...arr];

  // Initial step
  steps.push({
    array: [...originalArray],
    explanation: `Starting merge sort on array: [${originalArray.join(", ")}]. Merge sort uses divide-and-conquer: divide the array into halves, recursively sort each half, then merge them back together.`,
    phase: "divide",
    range: { start: 0, end: originalArray.length - 1 },
    depth: 0,
  });

  // Perform merge sort and collect steps
  function mergeSort(
    start: number,
    end: number,
    depth: number
  ): number[] {
    if (start >= end) {
      // Base case: single element
      if (start === end) {
        steps.push({
          array: [...originalArray],
          explanation: `Base case: Array segment [${originalArray[start]}] is already sorted (single element).`,
          phase: "divide",
          range: { start, end },
          depth,
        });
      }
      return [originalArray[start]];
    }

    const mid = Math.floor((start + end) / 2);
    const range = originalArray.slice(start, end + 1);

    // Divide phase
    steps.push({
      array: [...originalArray],
      explanation: `Dividing array segment [${range.join(", ")}] at position ${mid}. Left half: [${originalArray
        .slice(start, mid + 1)
        .join(", ")}], Right half: [${originalArray.slice(mid + 1, end + 1).join(", ")}].`,
      phase: "divide",
      leftArray: originalArray.slice(start, mid + 1),
      rightArray: originalArray.slice(mid + 1, end + 1),
      range: { start, end },
      depth,
    });

    // Recursively sort left and right halves
    const left = mergeSort(start, mid, depth + 1);
    const right = mergeSort(mid + 1, end, depth + 1);

    // Merge phase
    const merged = merge(left, right, start, depth, steps, originalArray);
    
    // Update the original array with merged result
    for (let i = 0; i < merged.length; i++) {
      originalArray[start + i] = merged[i];
    }

    // Show final merged result
    steps.push({
      array: [...originalArray],
      explanation: `Merged sorted halves [${left.join(", ")}] and [${right.join(", ")}] into [${merged.join(", ")}].`,
      phase: "merge",
      leftArray: left,
      rightArray: right,
      mergedArray: merged,
      range: { start, end },
      depth,
    });

    return merged;
  }

  // Perform the sort
  mergeSort(0, originalArray.length - 1, 0);

  // Final step
  steps.push({
    array: [...originalArray],
    explanation: `Merge sort complete! Final sorted array: [${originalArray.join(", ")}].`,
    phase: "merge",
  });

  return steps;
}

/**
 * Merges two sorted arrays into one sorted array
 */
function merge(
  left: number[],
  right: number[],
  startIndex: number,
  depth: number,
  steps: MergeSortStep[],
  originalArray: number[]
): number[] {
  const merged: number[] = [];
  let leftIndex = 0;
  let rightIndex = 0;

  steps.push({
    array: [...originalArray],
    explanation: `Starting merge: Comparing elements from left array [${left.join(", ")}] and right array [${right.join(", ")}].`,
    phase: "merge",
    leftArray: left,
    rightArray: right,
    leftIndex: 0,
    rightIndex: 0,
    depth,
  });

  while (leftIndex < left.length && rightIndex < right.length) {
    const leftVal = left[leftIndex];
    const rightVal = right[rightIndex];

    steps.push({
      array: [...originalArray],
      explanation: `Comparing ${leftVal} (left) and ${rightVal} (right). ${
        leftVal <= rightVal
          ? `${leftVal} is smaller or equal, so we take it.`
          : `${rightVal} is smaller, so we take it.`
      }`,
      phase: "compare",
      leftArray: left,
      rightArray: right,
      leftIndex,
      rightIndex,
      comparing: { left: leftVal, right: rightVal },
      mergedArray: [...merged],
      depth,
    });

    if (leftVal <= rightVal) {
      merged.push(leftVal);
      leftIndex++;
    } else {
      merged.push(rightVal);
      rightIndex++;
    }

    steps.push({
      array: [...originalArray],
      explanation: `Added ${merged[merged.length - 1]} to merged array. Current merged array: [${merged.join(", ")}].`,
      phase: "merge",
      leftArray: left,
      rightArray: right,
      leftIndex,
      rightIndex,
      mergedArray: [...merged],
      depth,
    });
  }

  // Add remaining elements from left array
  while (leftIndex < left.length) {
    steps.push({
      array: [...originalArray],
      explanation: `Left array still has elements. Adding remaining element ${left[leftIndex]} from left array.`,
      phase: "merge",
      leftArray: left,
      rightArray: right,
      leftIndex,
      rightIndex,
      mergedArray: [...merged],
      depth,
    });
    merged.push(left[leftIndex]);
    leftIndex++;
  }

  // Add remaining elements from right array
  while (rightIndex < right.length) {
    steps.push({
      array: [...originalArray],
      explanation: `Right array still has elements. Adding remaining element ${right[rightIndex]} from right array.`,
      phase: "merge",
      leftArray: left,
      rightArray: right,
      leftIndex,
      rightIndex,
      mergedArray: [...merged],
      depth,
    });
    merged.push(right[rightIndex]);
    rightIndex++;
  }

  return merged;
}

