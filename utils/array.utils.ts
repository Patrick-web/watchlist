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