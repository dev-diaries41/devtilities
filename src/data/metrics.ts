import { getMean, getMedian, getTotalValue } from "./stats";
import { countValues, limit, sortObjectByValues } from "./transform";

export class Metrics<T extends Record<string, any> = Record<string, any>> {
    data: T[];

    constructor(data: T[]) {
        this.data = data;
    }

    public calculateDistributionsForKeyMetrics<K extends keyof T>(performanceMetrics: K[], groupingAttributes: K[], topN: number = Infinity): Record<string, Record<K, Record<string, number>>> {
        const metricsDistributions: Record<string, Record<K, Record<string, number>>> = {};
        for (const field of performanceMetrics) {
            metricsDistributions[`${String(field)}Distributions`] = this.calculateDistributions(groupingAttributes, field, topN);
        }

        return metricsDistributions;
    }

    public calculateCountsForAttributes<K extends keyof T>(attributes: K[], type: 'array' | 'string' | 'number', topN: number = Infinity): Record<string, Record<string, number>> {
        const counts: Record<keyof T, Record<string, number>> = {} as Record<keyof T, Record<string, number>>;
        for (const attribute of attributes) {
            counts[attribute] = this.calculateCounts(attribute, type, topN);
        }
        return counts;    
    }

    public calculateStats<K extends keyof T>(keys: K[]): Record<K, ReturnType<typeof this.getStats>> {
        const result: Record<K, ReturnType<typeof this.getStats>> = {} as any;
        for (const key of keys) {
            result[key] = this.getStats(String(key));
        }
        return result;
    }

    public getTopN<K extends keyof T>(key: K, n: number): T[] {
        const sortedData = sortObjectByValues(
            this.data.reduce((acc, item) => {
                const value = item[key];
                if (typeof value === 'string' || typeof value === 'number') {
                    acc[value] = value;
                }
                return acc;
            }, {} as Record<string | number, number>)
        );
        return this.data.filter(item => Object.keys(sortedData).includes(String(item[key])))
            .slice(0, n);
    }

    private calculateCounts<K extends keyof T>(key: K, type: 'array' | 'string' | 'number', topN: number = Infinity): Record<string, number> {
        const countData = countValues(this.data, key as unknown as string, type);
        return limit(countData, topN);
    }

    private countNumberValuesInRange<K extends keyof T>(key: K, ranges: { min: number, max: number }[]): Record<string, number> {
        const rangeCount: Record<string, number> = {};
        ranges.forEach(range => {
            const rangeKey = `${range.min}-${range.max}`;
            rangeCount[rangeKey] = 0;
        });

        this.data.forEach(item => {
            const value = item[key];
            if (typeof value === 'number') {
                ranges.forEach(range => {
                    if (value >= range.min && value <= range.max) {
                        const rangeKey = `${range.min}-${range.max}`;
                        rangeCount[rangeKey] = (rangeCount[rangeKey] || 0) + 1;
                    }
                });
            }
        });

        return sortObjectByValues(rangeCount);
    }

    private getStats<K extends keyof T>(category: K) {
        return {
            mean: getMean(this.data, category),
            median: getMedian(this.data, category),
        };
    }


    private sumByCategoryValue<K extends keyof T>(category: K, value: string, metric: K): number {
        return this.data.reduce((acc, item) => {
            if (typeof item[category] !== 'string')throw new Error('Value must be a string');
            if (item[category].toLowerCase() === value.toLowerCase() && typeof item[metric] === 'number') {
                return acc + item[metric];
            }
            return acc;
        }, 0);
    }

    private calculateDistributions<K extends keyof T>(categories: K[], field: keyof T, topN: number = Infinity): Record<K, Record<string, number>> {
        const distributions: Record<K, Record<string, number>> = {} as Record<K, Record<string, number>>;
        
        for (const category of categories) {
            const values = this.getUniqueValues<keyof T>(category);
            if (values.length === 0) throw new Error('Options array cannot be empty.');
    
            const percentageDistribution: Record<string, number> = {};
            values.forEach(value => {
                percentageDistribution[value] = this.calculatePercentageForCategory(category, value, field);
            });
    
            const sortedData = sortObjectByValues(percentageDistribution);
            distributions[category] = limit(sortedData, topN);
        }
        return distributions;
    }
    

    private calculatePercentageForCategory<K extends keyof T>(category: K, value: string, metric: K): number {
        const total = getTotalValue(this.data, metric);
        const amount = this.sumByCategoryValue(category, value, metric);
        return total === 0 ? 0 : parseFloat(((amount / total) * 100).toFixed(2));
    }


    private getUniqueValues<K extends keyof T>(key: K): string[] {
        const uniqueValues = new Set<string>();
        this.data.forEach(item => {
            const value = item[key];
            if (typeof value === 'string' || typeof value === 'number') {
                uniqueValues.add(String(value));
            }
        });
        return Array.from(uniqueValues);
    }
}