export type Item = {
  id: number;
  weight: number;
  value: number;
  ratio: number; // value/weight ratio
  originalIndex: number; // Original position before sorting
};

export type Step = {
  items: Item[];
  sortedItems: Item[];
  explanation: string;
  currentItem?: number; // Index of item being processed
  selectedItems: {
    itemId: number;
    fraction: number; // 0 to 1, how much of the item is taken
    weight: number; // actual weight taken
    value: number; // actual value obtained
  }[];
  remainingCapacity: number;
  totalValue: number;
  totalWeight: number;
};

/**
 * Computes the fractional knapsack solution using greedy algorithm.
 * The greedy strategy is to sort items by value/weight ratio (descending),
 * then take as much as possible of each item until the knapsack is full.
 *
 * @param weights Array of item weights
 * @param values Array of item values
 * @param capacity Maximum capacity of the knapsack
 * @returns Array of steps showing the greedy computation
 */
export function knapsackSteps(
  weights: number[],
  values: number[],
  capacity: number
): Step[] {
  const steps: Step[] = [];

  if (weights.length !== values.length) {
    throw new Error("Weights and values arrays must have the same length");
  }

  if (weights.length === 0) {
    return steps;
  }

  // Create initial items with their ratios
  const items: Item[] = weights.map((weight, index) => ({
    id: index + 1,
    weight,
    value: values[index],
    ratio: values[index] / weight,
    originalIndex: index,
  }));

  // Initial step: show unsorted items
  steps.push({
    items: [...items],
    sortedItems: [],
    explanation: `Initial state: We have ${items.length} items. We'll sort them by value/weight ratio (descending) to maximize profit.`,
    selectedItems: [],
    remainingCapacity: capacity,
    totalValue: 0,
    totalWeight: 0,
  });

  // Greedy algorithm: sort by value/weight ratio (descending)
  const sortedItems = [...items].sort((a, b) => b.ratio - a.ratio);

  // Show the sorting step
  steps.push({
    items: [...items],
    sortedItems: [...sortedItems],
    explanation: `Sorted items by value/weight ratio (descending). The item with the highest ratio gives the best value per unit weight.`,
    selectedItems: [],
    remainingCapacity: capacity,
    totalValue: 0,
    totalWeight: 0,
  });

  // Process items one by one
  let remainingCapacity = capacity;
  const selectedItems: Step["selectedItems"] = [];
  let totalValue = 0;
  let totalWeight = 0;

  for (let i = 0; i < sortedItems.length; i++) {
    const currentItem = sortedItems[i];
    let fraction = 0;
    let itemWeight = 0;
    let itemValue = 0;

    if (remainingCapacity <= 0) {
      // Knapsack is full, skip remaining items
      steps.push({
        items: [...items],
        sortedItems: [...sortedItems],
        explanation: `Item ${currentItem.id} (weight: ${currentItem.weight}, value: ${currentItem.value}, ratio: ${currentItem.ratio.toFixed(2)}) cannot be added - knapsack is full.`,
        currentItem: i,
        selectedItems: [...selectedItems],
        remainingCapacity: remainingCapacity,
        totalValue,
        totalWeight,
      });
      continue;
    }

    if (currentItem.weight <= remainingCapacity) {
      // Take the entire item
      fraction = 1;
      itemWeight = currentItem.weight;
      itemValue = currentItem.value;
      remainingCapacity -= itemWeight;
      totalWeight += itemWeight;
      totalValue += itemValue;

      selectedItems.push({
        itemId: currentItem.id,
        fraction: 1,
        weight: itemWeight,
        value: itemValue,
      });

      steps.push({
        items: [...items],
        sortedItems: [...sortedItems],
        explanation: `Step ${i + 1}: Take all of Item ${currentItem.id} (weight: ${currentItem.weight}, value: ${currentItem.value}, ratio: ${currentItem.ratio.toFixed(2)}). Remaining capacity: ${remainingCapacity.toFixed(2)}.`,
        currentItem: i,
        selectedItems: [...selectedItems],
        remainingCapacity: remainingCapacity,
        totalValue,
        totalWeight,
      });
    } else {
      // Take a fraction of the item
      fraction = remainingCapacity / currentItem.weight;
      itemWeight = remainingCapacity;
      itemValue = currentItem.value * fraction;
      totalWeight += itemWeight;
      totalValue += itemValue;
      remainingCapacity = 0;

      selectedItems.push({
        itemId: currentItem.id,
        fraction: fraction,
        weight: itemWeight,
        value: itemValue,
      });

      steps.push({
        items: [...items],
        sortedItems: [...sortedItems],
        explanation: `Step ${i + 1}: Take ${(fraction * 100).toFixed(1)}% of Item ${currentItem.id} (weight: ${currentItem.weight}, value: ${currentItem.value}, ratio: ${currentItem.ratio.toFixed(2)}). This fills the knapsack completely.`,
        currentItem: i,
        selectedItems: [...selectedItems],
        remainingCapacity: 0,
        totalValue,
        totalWeight,
      });
      break; // Knapsack is full
    }
  }

  // Final step
  steps.push({
    items: [...items],
    sortedItems: [...sortedItems],
    explanation: `Final result: Total value obtained: ${totalValue.toFixed(2)}, Total weight: ${totalWeight.toFixed(2)}/${capacity}. This is the optimal solution using the greedy approach.`,
    selectedItems: [...selectedItems],
    remainingCapacity: remainingCapacity,
    totalValue,
    totalWeight,
  });

  return steps;
}

