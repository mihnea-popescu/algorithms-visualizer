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
};

/**
 * Computes the job sequencing with deadlines solution using greedy algorithm.
 * The greedy strategy is to sort jobs by profit (descending),
 * then for each job, find the latest available time slot before its deadline.
 *
 * @param profits Array of job profits
 * @param deadlines Array of job deadlines
 * @returns Array of steps showing the greedy computation
 */
export function jobSequencingSteps(
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
    explanation: `Initial state: We have ${jobs.length} jobs. We'll sort them by profit (descending) to maximize total profit. Each job takes 1 unit of time.`,
    schedule: [],
    totalProfit: 0,
    maxDeadline,
  });

  // Greedy algorithm: sort by profit (descending)
  const sortedJobs = [...jobs].sort((a, b) => b.profit - a.profit);

  // Show the sorting step
  steps.push({
    jobs: [...jobs],
    sortedJobs: [...sortedJobs],
    explanation: `Sorted jobs by profit (descending). The greedy strategy is to process jobs with higher profit first, as they contribute more to the total profit.`,
    schedule: [],
    totalProfit: 0,
    maxDeadline,
  });

  // Initialize schedule: -1 means slot is empty
  const schedule: number[] = new Array(maxDeadline).fill(-1);
  let totalProfit = 0;

  // Process jobs one by one
  for (let i = 0; i < sortedJobs.length; i++) {
    const currentJob = sortedJobs[i];

    // Find the latest available time slot before the deadline
    let slotFound = false;
    let assignedSlot = -1;

    // Try to find the latest available slot (before or at deadline)
    for (
      let slot = Math.min(currentJob.deadline - 1, maxDeadline - 1);
      slot >= 0;
      slot--
    ) {
      if (schedule[slot] === -1) {
        schedule[slot] = currentJob.id;
        assignedSlot = slot;
        totalProfit += currentJob.profit;
        slotFound = true;
        break;
      }
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
        }, deadline: ${currentJob.deadline}) is scheduled at time slot ${
          assignedSlot + 1
        }. This is the latest available slot before its deadline. Total profit: ${totalProfit}.`,
        currentJob: i,
        schedule: scheduleArray,
        totalProfit,
        maxDeadline,
      });
    } else {
      steps.push({
        jobs: [...jobs],
        sortedJobs: [...sortedJobs],
        explanation: `Step ${i + 1}: Job ${currentJob.id} (profit: ${
          currentJob.profit
        }, deadline: ${
          currentJob.deadline
        }) cannot be scheduled. All time slots before its deadline are already occupied.`,
        currentJob: i,
        schedule: scheduleArray,
        totalProfit,
        maxDeadline,
      });
    }
  }

  // Final step
  steps.push({
    jobs: [...jobs],
    sortedJobs: [...sortedJobs],
    explanation: `Final result: Total profit obtained: ${totalProfit}. This is the optimal solution using the greedy approach.`,
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
  });

  return steps;
}
