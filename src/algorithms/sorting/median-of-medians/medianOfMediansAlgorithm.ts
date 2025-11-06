export type MedianOfMediansStep = {
  array: number[];
  explanation: string;
  phase: "start" | "group" | "sort_groups" | "find_medians" | "recursive_median" | "partition" | "compare" | "swap" | "pivot" | "found" | "recurse";
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
  groups?: number[][];
  medians?: number[];
  partitioned?: {
    left: number[];
    pivot: number;
    right: number[];
  };
  result?: number;
};

/**
 * Generates step-by-step visualization of median of medians algorithm
 * @param arr The array to search in
 * @param k The k-th smallest element to find (1-indexed)
 * @returns Array of steps showing the median of medians process
 */
export function medianOfMediansSteps(arr: number[], k: number): MedianOfMediansStep[] {
  const steps: MedianOfMediansStep[] = [];
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
    explanation: `Starting median of medians algorithm to find the ${k}-th smallest element in array: [${originalArray.join(", ")}]. This algorithm uses median-of-medians pivot selection to guarantee O(n) worst-case time complexity.`,
    phase: "start",
    k,
    range: { start: 0, end: originalArray.length - 1 },
    depth: 0,
  });

  // Perform median of medians and collect steps
  function medianOfMedians(start: number, end: number, k: number, depth: number): number {
    const length = end - start + 1;
    
    if (length <= 5) {
      // Base case: sort small array and return k-th element
      const subarray = originalArray.slice(start, end + 1);
      subarray.sort((a, b) => a - b);
      for (let i = 0; i < subarray.length; i++) {
        originalArray[start + i] = subarray[i];
      }
      
      steps.push({
        array: [...originalArray],
        explanation: `Base case: Array segment has ${length} elements (≤ 5). Sorting directly: [${subarray.join(", ")}]. The ${k}-th smallest element is ${subarray[k - 1]}.`,
        phase: "found",
        k,
        result: subarray[k - 1],
        range: { start, end },
        depth,
      });
      
      return subarray[k - 1];
    }

    // Step 1: Divide into groups of 5
    const numGroups = Math.ceil(length / 5);
    const groups: number[][] = [];
    
    steps.push({
      array: [...originalArray],
      explanation: `Dividing array segment [${start}, ${end}] into groups of 5. Total groups: ${numGroups}.`,
      phase: "group",
      k,
      range: { start, end },
      depth,
    });

    for (let i = 0; i < numGroups; i++) {
      const groupStart = start + i * 5;
      const groupEnd = Math.min(start + i * 5 + 4, end);
      const group = originalArray.slice(groupStart, groupEnd + 1);
      groups.push(group);
    }

    steps.push({
      array: [...originalArray],
      explanation: `Created ${groups.length} groups: ${groups.map((g, i) => `Group ${i + 1}: [${g.join(", ")}]`).join("; ")}.`,
      phase: "group",
      k,
      groups,
      range: { start, end },
      depth,
    });

    // Step 2: Sort each group and find medians
    const medians: number[] = [];
    
    steps.push({
      array: [...originalArray],
      explanation: `Sorting each group and finding the median of each group.`,
      phase: "sort_groups",
      k,
      groups,
      range: { start, end },
      depth,
    });

    for (let i = 0; i < groups.length; i++) {
      const group = [...groups[i]];
      group.sort((a, b) => a - b);
      const medianIndex = Math.floor(group.length / 2);
      const median = group[medianIndex];
      medians.push(median);
      
      // Update the original array with sorted group
      const groupStart = start + i * 5;
      for (let j = 0; j < group.length; j++) {
        originalArray[groupStart + j] = group[j];
      }
      
      steps.push({
        array: [...originalArray],
        explanation: `Group ${i + 1} sorted: [${group.join(", ")}]. Median: ${median} (at position ${medianIndex} in the group).`,
        phase: "sort_groups",
        k,
        groups: groups.map((g, idx) => idx === i ? group : g),
        range: { start, end },
        depth,
      });
    }

    steps.push({
      array: [...originalArray],
      explanation: `Found medians of all groups: [${medians.join(", ")}]. Now we'll recursively find the median of these medians.`,
      phase: "find_medians",
      k,
      medians,
      range: { start, end },
      depth,
    });

    // Step 3: Recursively find median of medians
    const medianOfMediansValue = medianOfMedians(
      start,
      start + medians.length - 1,
      Math.floor(medians.length / 2) + 1,
      depth + 1
    );

    steps.push({
      array: [...originalArray],
      explanation: `Found median of medians: ${medianOfMediansValue}. This will be our pivot. It guarantees that at least 30% of elements are less than the pivot and at least 30% are greater.`,
      phase: "recursive_median",
      k,
      pivotValue: medianOfMediansValue,
      range: { start, end },
      depth,
    });

    // Step 4: Find pivot index in original array
    let pivotIndex = -1;
    for (let i = start; i <= end; i++) {
      if (originalArray[i] === medianOfMediansValue) {
        pivotIndex = i;
        break;
      }
    }

    if (pivotIndex === -1) {
      // This shouldn't happen, but handle it
      pivotIndex = end;
    }

    steps.push({
      array: [...originalArray],
      explanation: `Using ${medianOfMediansValue} as pivot (found at index ${pivotIndex}). Now partitioning the array around this pivot.`,
      phase: "pivot",
      k,
      pivotIndex,
      pivotValue: medianOfMediansValue,
      range: { start, end },
      depth,
    });

    // Step 5: Partition around the pivot
    const partitionResult = partition(start, end, pivotIndex, depth, steps, originalArray, k);
    const finalPivotIndex = partitionResult.finalPivotIndex;

    // Show partitioned result
    const leftPart = originalArray.slice(start, finalPivotIndex);
    const rightPart = originalArray.slice(finalPivotIndex + 1, end + 1);
    
    steps.push({
      array: [...originalArray],
      explanation: `Partition complete! Pivot ${medianOfMediansValue} is now at index ${finalPivotIndex}. Left partition (${leftPart.length} elements): [${leftPart.join(", ") || "empty"}], Right partition (${rightPart.length} elements): [${rightPart.join(", ") || "empty"}].`,
      phase: "partition",
      k,
      pivotIndex: finalPivotIndex,
      pivotValue: medianOfMediansValue,
      partitioned: {
        left: leftPart,
        pivot: medianOfMediansValue,
        right: rightPart,
      },
      range: { start, end },
      depth,
    });

    // Step 6: Determine which partition contains k-th element
    const pivotRank = finalPivotIndex - start + 1;

    steps.push({
      array: [...originalArray],
      explanation: `Pivot ${medianOfMediansValue} is at position ${pivotRank} in the current range (${pivotRank}-th smallest in range [${start}, ${end}]). We're looking for the ${k}-th smallest.`,
      phase: "compare",
      k,
      pivotIndex: finalPivotIndex,
      pivotValue: medianOfMediansValue,
      range: { start, end },
      depth,
    });

    if (pivotRank === k) {
      steps.push({
        array: [...originalArray],
        explanation: `Found! The pivot ${medianOfMediansValue} is exactly the ${k}-th smallest element in the current range.`,
        phase: "found",
        k,
        pivotIndex: finalPivotIndex,
        pivotValue: medianOfMediansValue,
        result: medianOfMediansValue,
        range: { start, end },
        depth,
      });
      return medianOfMediansValue;
    } else if (k < pivotRank) {
      steps.push({
        array: [...originalArray],
        explanation: `Since ${k} < ${pivotRank}, the ${k}-th smallest element must be in the left partition. Recursing on left partition [${start}, ${finalPivotIndex - 1}].`,
        phase: "recurse",
        k,
        pivotIndex: finalPivotIndex,
        pivotValue: medianOfMediansValue,
        range: { start, end: finalPivotIndex - 1 },
        depth,
      });
      return medianOfMedians(start, finalPivotIndex - 1, k, depth + 1);
    } else {
      const newK = k - pivotRank;
      steps.push({
        array: [...originalArray],
        explanation: `Since ${k} > ${pivotRank}, the ${k}-th smallest element must be in the right partition. Adjusting k to ${newK} (since we've already found ${pivotRank} smaller elements) and recursing on right partition [${finalPivotIndex + 1}, ${end}].`,
        phase: "recurse",
        k: newK,
        pivotIndex: finalPivotIndex,
        pivotValue: medianOfMediansValue,
        range: { start: finalPivotIndex + 1, end },
        depth,
      });
      return medianOfMedians(finalPivotIndex + 1, end, newK, depth + 1);
    }
  }

  // Perform the selection
  const result = medianOfMedians(0, originalArray.length - 1, k, 0);

  // Final step
  steps.push({
    array: [...originalArray],
    explanation: `Median of medians algorithm complete! The ${k}-th smallest element is ${result}.`,
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
  steps: MedianOfMediansStep[],
  originalArray: number[],
  k: number
): { finalPivotIndex: number } {
  const pivotValue = originalArray[pivotIndex];
  let i = start;

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

