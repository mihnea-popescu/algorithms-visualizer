export type Job = {
  id: number;
  profit: number;
  deadline: number;
  originalIndex: number;
};

export type Step = {
  jobs: Job[];
  sortedJobs: Job[];
  explanation: string;
  currentJob?: number; // Index of job being processed
  schedule: {
    timeSlot: number;
    jobId: number;
    profit: number;
  }[];
  totalProfit: number;
  maxDeadline: number;
  unionFind?: {
    parent: number[];
    explanation: string;
  };
};

/**
 * Union-Find data structure for efficient slot finding.
 * Each slot points to the latest available slot at or before it.
 */
class UnionFind {
  parent: number[];

  constructor(size: number) {
    // Initialize: each slot points to itself (all slots are available)
    this.parent = Array.from({ length: size }, (_, i) => i);
  }

  /**
   * Find the latest available slot at or before the given slot.
   * Uses path compression for efficiency.
   */
  find(slot: number): number {
    if (slot < 0) return -1;
    if (this.parent[slot] === slot) {
      return slot;
    }
    // Path compression: make all nodes point directly to root
    this.parent[slot] = this.find(this.parent[slot]);
    return this.parent[slot];
  }

  /**
   * Union slot with slot-1. When a slot is occupied, we connect it
   * to the previous slot so find() will return the previous available slot.
   * Special case: if slot is 0, mark it as unavailable by setting parent[0] = -1.
   */
  union(slot: number): void {
    if (slot < 0) return;
    if (slot === 0) {
      // Mark slot 0 as unavailable
      this.parent[0] = -1;
      return;
    }
    const rootSlot = this.find(slot);
    const rootPrev = this.find(slot - 1);
    if (rootSlot !== rootPrev) {
      this.parent[rootSlot] = rootPrev;
    }
  }

  /**
   * Get the current state for visualization
   */
  getState(): number[] {
    return [...this.parent];
  }
}

/**
 * Computes the job sequencing with deadlines solution using greedy algorithm
 * with Union-Find data structure for O(n log n) time complexity.
 * The greedy strategy is to sort jobs by profit (descending),
 * then for each job, find the latest available time slot before its deadline using Union-Find.
 *
 * @param profits Array of job profits
 * @param deadlines Array of job deadlines
 * @returns Array of steps showing the greedy computation
 */
export function jobSequencingUnionFindSteps(
  profits: number[],
  deadlines: number[]
): Step[] {
  const steps: Step[] = [];

  if (profits.length !== deadlines.length) {
    throw new Error("Profits and deadlines arrays must have the same length");
  }

  if (profits.length === 0) {
    return steps;
  }

  // Create initial jobs
  const jobs: Job[] = profits.map((profit, index) => ({
    id: index + 1,
    profit,
    deadline: deadlines[index],
    originalIndex: index,
  }));

  const maxDeadline = Math.max(...deadlines);

  // Initial step: show unsorted jobs
  steps.push({
    jobs: [...jobs],
    sortedJobs: [],
    explanation: `Initial state: We have ${jobs.length} jobs. We'll sort them by profit (descending) to maximize total profit. Each job takes 1 unit of time. We'll use Union-Find to efficiently find available slots in O(n log n) time.`,
    schedule: [],
    totalProfit: 0,
    maxDeadline,
    unionFind: {
      parent: Array.from({ length: maxDeadline }, (_, i) => i),
      explanation: `Union-Find initialized: Each slot points to itself, meaning all slots are available.`,
    },
  });

  // Greedy algorithm: sort by profit (descending)
  const sortedJobs = [...jobs].sort((a, b) => b.profit - a.profit);

  // Show the sorting step
  steps.push({
    jobs: [...jobs],
    sortedJobs: [...sortedJobs],
    explanation: `Sorted jobs by profit (descending). The greedy strategy is to process jobs with higher profit first, as they contribute more to the total profit. We'll use Union-Find to find the latest available slot in nearly O(1) amortized time.`,
    schedule: [],
    totalProfit: 0,
    maxDeadline,
    unionFind: {
      parent: Array.from({ length: maxDeadline }, (_, i) => i),
      explanation: `Union-Find state: All slots are still available.`,
    },
  });

  // Initialize schedule: -1 means slot is empty
  const schedule: number[] = new Array(maxDeadline).fill(-1);
  let totalProfit = 0;
  const uf = new UnionFind(maxDeadline);

  // Process jobs one by one
  for (let i = 0; i < sortedJobs.length; i++) {
    const currentJob = sortedJobs[i];

    // Find the latest available time slot before the deadline using Union-Find
    const deadlineSlot = Math.min(currentJob.deadline - 1, maxDeadline - 1);
    const availableSlot = uf.find(deadlineSlot);
    const slotFound = availableSlot >= 0;
    let assignedSlot = -1;

    if (slotFound) {
      assignedSlot = availableSlot;
      schedule[assignedSlot] = currentJob.id;
      totalProfit += currentJob.profit;
      // Union the assigned slot with the previous slot
      uf.union(assignedSlot);
    }

    // Create schedule array for visualization
    const scheduleArray = schedule
      .map((jobId, timeSlot) => ({
        timeSlot: timeSlot + 1,
        jobId: jobId !== -1 ? jobId : 0,
        profit:
          jobId !== -1
            ? sortedJobs.find((j) => j.id === jobId)?.profit || 0
            : 0,
      }))
      .filter((s) => s.jobId !== 0);

    if (slotFound) {
      steps.push({
        jobs: [...jobs],
        sortedJobs: [...sortedJobs],
        explanation: `Step ${i + 1}: Job ${currentJob.id} (profit: ${
          currentJob.profit
        }, deadline: ${
          currentJob.deadline
        }). Using Union-Find, we found the latest available slot ${
          assignedSlot + 1
        } by calling find(${deadlineSlot}). After assignment, we union slot ${assignedSlot} with slot ${
          assignedSlot - 1
        } so future finds will skip this occupied slot. Total profit: ${totalProfit}.`,
        currentJob: i,
        schedule: scheduleArray,
        totalProfit,
        maxDeadline,
        unionFind: {
          parent: uf.getState(),
          explanation: `Union-Find after assignment: Slot ${assignedSlot} is now ${
            assignedSlot === 0
              ? "marked as unavailable (parent = -1)"
              : `connected to slot ${assignedSlot - 1}`
          }. The find() operation will now return the previous available slot.`,
        },
      });
    } else {
      steps.push({
        jobs: [...jobs],
        sortedJobs: [...sortedJobs],
        explanation: `Step ${i + 1}: Job ${currentJob.id} (profit: ${
          currentJob.profit
        }, deadline: ${
          currentJob.deadline
        }). Using Union-Find, we called find(${deadlineSlot}) which returned -1, meaning no available slot exists before the deadline. This job cannot be scheduled.`,
        currentJob: i,
        schedule: scheduleArray,
        totalProfit,
        maxDeadline,
        unionFind: {
          parent: uf.getState(),
          explanation: `Union-Find state: No changes made as the job could not be scheduled.`,
        },
      });
    }
  }

  // Final step
  steps.push({
    jobs: [...jobs],
    sortedJobs: [...sortedJobs],
    explanation: `Final result: Total profit obtained: ${totalProfit}. This is the optimal solution using the greedy approach with Union-Find, achieving O(n log n) time complexity.`,
    schedule: schedule
      .map((jobId, timeSlot) => ({
        timeSlot: timeSlot + 1,
        jobId: jobId !== -1 ? jobId : 0,
        profit:
          jobId !== -1
            ? sortedJobs.find((j) => j.id === jobId)?.profit || 0
            : 0,
      }))
      .filter((s) => s.jobId !== 0),
    totalProfit,
    maxDeadline,
    unionFind: {
      parent: uf.getState(),
      explanation: `Final Union-Find state: All occupied slots are connected to their previous slots.`,
    },
  });

  return steps;
}

