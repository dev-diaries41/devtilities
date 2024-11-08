
export function countValues<T extends Record<string, any>>(data: T[], key: string, type: 'string' | 'number' | 'array'): Record<string, number> {
    const counts: Record<string, number> = {};
    data.forEach(item => {
        let value: any = item[key];
        if (type === 'array') {
            if (!Array.isArray(value)) throw new Error('Value must be an array');
            value.forEach((v: string) => {
                counts[v] = (counts[v] || 0) + 1;
            });
        } else if (type === 'string') {
            if (typeof value !== 'string') throw new Error('Value must be a string');
            if (value === '') return;
            counts[value] = (counts[value] || 0) + 1;
        } else if (type === 'number') {
            if (typeof value !== 'number') throw new Error('Value must be a number');
            counts[value] = (counts[value] || 0) + 1;
        }
    });
    return sortObjectByValues(counts);
}

// Function to limit the number of items in the data
export function limit<T>(data: Record<keyof T, number>, topN: number): Record<string, number> {
    const result: Record<string, number> = {};
    let count = 0;
    for (const key in data) {
        if (count >= topN) break;
        result[key] = data[key];
        count++;
    }
    return result;
}

// Function to group entries with values under minVal into a single new category called "Other"
export function addOthersCategory<T extends Record<string, number>>(data: T, minVal: number): Record<string, number> {
    const other: Record<string, number> = {};
    const result: Record<string, number> = {};
    for (const key in data) {
        if (data[key] < minVal) {
            other[key] = data[key];
        } else {
            result[key] = data[key];
        }
    }
    result['Other'] = Object.values(other).reduce((acc, val) => acc + val, 0);
    return result;
}

export function groupRelatedKeys<T extends Record<string, number>>(countData: T, relatedSubgroups: string[], groupName: string): Record<string, number> {
    let newCountData: Record<string, number> = {};
    let groupCount = 0;

    for (const [key, value] of Object.entries(countData)) {
        if (relatedSubgroups.includes(key)) {
            groupCount += value;
        } else {
            newCountData[key] = value;
        }
    }

    if (groupCount > 0) {
        newCountData[groupName] = (newCountData[groupName] || 0) + groupCount;
    }

    return sortObjectByValues(newCountData);
}

// Function to sort an object by its values in descending order
export function sortObjectByValues<T extends Record<string, any>>(obj: T): T {
    const sortedEntries = Object.entries(obj).sort((a, b) => b[1] - a[1]);
    const sortedObj: Record<string, any> = {};
    sortedEntries.forEach(([key, value]) => {
        sortedObj[key] = value;
    });
    return sortedObj as T;
}

export function toCountData<T extends Record<string, any>[]>(data: T, category: string, metric: string): Record<string, number> {
    const result: Record<string, number> = {};
    for (const item of data) {
        result[item[category]] = item[metric];
    }
    return sortObjectByValues(result);
}
