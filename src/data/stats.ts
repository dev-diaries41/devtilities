// statistics.ts

export function getMean<T extends Record<string, any>>(data: T[], key: keyof T): number {
    const totalValue = getTotalValue(data, key);
    return Math.floor(totalValue / data.length);
}

export function getMode<T extends Record<string, any>>(data: T[], key: keyof T): T[keyof T] | null {
    const valueCounts: Record<string, number> = {};
    data.forEach(item => {
        const value = item[key];
        if (typeof value === 'string' || typeof value === 'number') {
            valueCounts[value] = (valueCounts[value] || 0) + 1;
        }
    });

    let maxCount = 0;
    let modeValue: T[keyof T] | null = null;
    for (const [value, count] of Object.entries(valueCounts)) {
        if (count > maxCount) {
            maxCount = count;
            modeValue = value as T[keyof T];
        }
    }

    return modeValue;
}

export function getMedian<T extends Record<string, any>>(data: T[], key: keyof T): number {
    const sortedValues = data
        .map(item => item[key])
        .filter(value => typeof value === 'number')
        .sort((a, b) => (a as number) - (b as number)) as number[];
    
    if (sortedValues.length === 0) throw new Error('Cannot calculate median of empty data');

    const midIndex = Math.floor(sortedValues.length / 2);

    if (sortedValues.length % 2 === 0) {
        return (sortedValues[midIndex - 1] + sortedValues[midIndex]) / 2;
    } else {
        return sortedValues[midIndex];
    }
}

export function getTotalValue<T extends Record<string, any>>(data: T[], key: keyof T): number {
    return data.reduce((total, item) => {
        const value = item[key];
        if (typeof value === 'number') {
            return total + value;
        }
        return total;
    }, 0);
}

export function getMaxValueItem<T extends Record<string, any>>(data: T[], key: keyof T): T | null {
    let maxValue = -Infinity;
    let maxItem: T | null = null;

    data.forEach(item => {
        const value = item[key];
        if (typeof value === 'number' && value > maxValue) {
            maxValue = value;
            maxItem = item;
        }
    });

    return maxItem;
}

export function getMinValueItem<T extends Record<string, any>>(data: T[], key: keyof T): T | null {
    let minValue = Infinity;
    let minItem: T | null = null;

    data.forEach(item => {
        const value = item[key];
        if (typeof value === 'number' && value < minValue) {
            minValue = value;
            minItem = item;
        }
    });
    return minItem;
}
