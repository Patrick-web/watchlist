export function createNumberArray(min: number, max: number): number[] {
  if (min > max) {
    throw new Error("Min should be less than or equal to max.");
  }

  const result: number[] = [];
  for (let i = min; i <= max; i++) {
    result.push(i);
  }

  return result;
}

export function removeDuplicates<T extends { [key: string]: any }>(
  arr: T[],
  key: keyof T,
): T[] {
  const uniqueMap = new Map<string | number, T>();

  arr.forEach((item) => {
    if (!uniqueMap.has(item[key])) {
      uniqueMap.set(item[key], item);
    }
  });

  return Array.from(uniqueMap.values());
}
