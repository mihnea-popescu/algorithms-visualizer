export type Program = {
  id: number;
  length: number;
  originalIndex: number; // Original position before sorting
};

export type Step = {
  programs: Program[];
  sortedPrograms: Program[];
  explanation: string;
  currentProgram?: number; // Index of program being processed
  cumulativeTime: number[]; // Cumulative retrieval time for each position
  totalTime: number; // Total retrieval time
  averageTime: number; // Average retrieval time
};

/**
 * Computes the optimal storage order on tapes using greedy algorithm.
 * The greedy strategy is to sort programs by length in ascending order (shortest first).
 * This minimizes the average retrieval time.
 *
 * @param programLengths Array of program lengths
 * @returns Array of steps showing the greedy computation
 */
export function optimalStorageSteps(programLengths: number[]): Step[] {
  const steps: Step[] = [];

  // Create initial programs with their original indices
  const programs: Program[] = programLengths.map((length, index) => ({
    id: index + 1,
    length,
    originalIndex: index,
  }));

  // Initial step: show unsorted programs
  const initialCumulativeTime = calculateCumulativeTime(programs);
  const initialTotalTime = initialCumulativeTime.reduce(
    (sum, time) => sum + time,
    0
  );
  const initialAverageTime =
    programs.length > 0 ? initialTotalTime / programs.length : 0;

  steps.push({
    programs: [...programs],
    sortedPrograms: [...programs],
    explanation: `Initial order: Programs are in their original order. We'll sort them by length (shortest first) to minimize average retrieval time.`,
    cumulativeTime: [...initialCumulativeTime],
    totalTime: initialTotalTime,
    averageTime: initialAverageTime,
  });

  // Greedy algorithm: sort by length (ascending)
  // Create a copy and sort
  const sortedPrograms = [...programs].sort((a, b) => a.length - b.length);

  // Show the sorting process step by step
  for (let i = 0; i < sortedPrograms.length; i++) {
    const currentProgram = sortedPrograms[i];
    const explanation =
      i === 0
        ? `Step ${i + 1}: Select the shortest program (Program ${
            currentProgram.id
          } with length ${currentProgram.length}). Place it first.`
        : `Step ${i + 1}: Select the next shortest program (Program ${
            currentProgram.id
          } with length ${currentProgram.length}). Place it at position ${
            i + 1
          }.`;

    const currentOrder = sortedPrograms.slice(0, i + 1);
    const cumulativeTime = calculateCumulativeTime(currentOrder);
    const totalTime = cumulativeTime.reduce((sum, time) => sum + time, 0);
    const averageTime =
      currentOrder.length > 0 ? totalTime / currentOrder.length : 0;

    steps.push({
      programs: [...programs],
      sortedPrograms: [...currentOrder],
      explanation,
      currentProgram: i,
      cumulativeTime: [...cumulativeTime],
      totalTime,
      averageTime,
    });
  }

  // Final step: show complete sorted order and final statistics
  const finalCumulativeTime = calculateCumulativeTime(sortedPrograms);
  const finalTotalTime = finalCumulativeTime.reduce(
    (sum, time) => sum + time,
    0
  );
  const finalAverageTime =
    sortedPrograms.length > 0 ? finalTotalTime / sortedPrograms.length : 0;

  steps.push({
    programs: [...programs],
    sortedPrograms: [...sortedPrograms],
    explanation: `Final result: All programs sorted by length (shortest first). This minimizes the average retrieval time. Total retrieval time: ${finalTotalTime}, Average retrieval time: ${finalAverageTime.toFixed(
      2
    )}.`,
    cumulativeTime: [...finalCumulativeTime],
    totalTime: finalTotalTime,
    averageTime: finalAverageTime,
  });

  return steps;
}

/**
 * Calculates cumulative retrieval time for each program position.
 * Retrieval time for program at position i = sum of all programs from 0 to i
 */
function calculateCumulativeTime(programs: Program[]): number[] {
  const cumulativeTime: number[] = [];
  let sum = 0;

  for (const program of programs) {
    sum += program.length;
    cumulativeTime.push(sum);
  }

  return cumulativeTime;
}

/**
 * Formats a number for display
 */
export function displayNumber(v: number): string {
  return String(v);
}
